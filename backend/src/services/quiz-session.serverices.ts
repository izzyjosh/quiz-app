import { AppDataSource } from "../config/datasource";
import { QuizSession } from "../models/quizsession.model";
import { Participant } from "../models/participant.model";
import { CreateQuizSessionDTO } from "../schemas/quizsession.schemas";
import { BadRequestError, NotFoundError } from "../utils/api.errors";
import { participantService } from "./participant.services";

import { activeParticipants, type SessionStatsPayload } from "../utils/socket";
import { Quiz } from "../models/quiz.model";
import { io } from "../app";

type ActiveAndUpcomingSessions = {
  activeSessions: QuizSession[];
  upcomingSessions: QuizSession[];
};

type InMemoryParticipant = {
  participantId: string;
  socketId: string | null;
  score: number;
  lastAnsweredQuestionIndex: number;
};

type InMemorySessionSnapshot = {
  sessionId: string;
  quizId: string;
  startedAt: string;
  questionStartTime: number;
  questionTimeout: NodeJS.Timeout | null;
  nextQuestionTimeout: NodeJS.Timeout | null;
  submittedSocketIds: Set<string>;
  submittedAnswers: Map<string, string>;
  currentQuestionIndex: number;
  totalQuestions: number;
  status: "waiting" | "started" | "finished";
  scheduledStartTime: Date;
  questions: Array<{
    questionId: string;
    text: string;
    order: number;
    startTime: string | null;
    timeLimit: number;
    options: Array<{ id: string; text: string }>;
    correctOptions: Array<{ id: string; text: string }>;
  }>;
  participants: Map<string, InMemoryParticipant>;
};

type SubmitAnswerResult = {
  selectedAnswer: { id: string; text: string } | null;
  correctAnswer: Array<{ id: string; text: string }> | null;
  isCorrect: boolean | null;
  revealed: boolean;
};

export type LiveSessionState = {
  sessionId: string;
  status: "waiting" | "starting" | "started" | "finished";
  currentQuestionIndex: number;
  totalQuestions: number;
  question: {
    questionId: string;
    text: string;
    options: Array<{ id: string; text: string }>;
    timeLimit: number;
    endsAt: string;
  } | null;
  serverNow: string;
};

export type SessionStats = SessionStatsPayload;

export async function getSessionStatsSnapshot(): Promise<SessionStats> {
  const participantRepository = AppDataSource.getRepository(Participant);
  const quizSessionRepository = AppDataSource.getRepository(QuizSession);
  const quizRepository = AppDataSource.getRepository(Quiz);

  const [activeParticipants, activeSessions, totalQuizTemplates] =
    await Promise.all([
      participantRepository
        .createQueryBuilder("participant")
        .innerJoin("participant.quizSession", "session")
        .where("session.status = :status", { status: "started" })
        .getCount(),
      quizSessionRepository.count({
        where: { status: "started" },
      }),
      quizRepository.count(),
    ]);

  return {
    activeParticipants,
    activeSessions,
    totalQuizTemplates,
  };
}

class QuizSessionService {
  private quizSessionRepository = AppDataSource.getRepository(QuizSession);
  private participantRepository = AppDataSource.getRepository(Participant);
  private quizRepository = AppDataSource.getRepository(Quiz);

  // In-Memory store
  private session = new Map<string, InMemorySessionSnapshot>();

  scheduleSession(session: InMemorySessionSnapshot) {
    const delay = session.scheduledStartTime.getTime() - Date.now();

    if (delay <= 0) {
      this.startSession(session);
    } else {
      setTimeout(() => this.startSession(session), delay);
    }
  }

  startSession(session: InMemorySessionSnapshot) {
    session.status = "started";
    session.currentQuestionIndex = 0;

    this.broadcastQuestion(session);
  }

  broadcastQuestion(session: InMemorySessionSnapshot) {
    session.submittedSocketIds.clear();
    session.submittedAnswers.clear();

    const question = session.questions[session.currentQuestionIndex];
    const questionStartTime = Date.now();
    const endsAt = new Date(
      questionStartTime + question.timeLimit * 1000,
    ).toISOString();

    session.questionStartTime = questionStartTime;
    question.startTime = new Date(questionStartTime).toISOString();

    session.startedAt = new Date().toISOString();
    const room = `session-${session.sessionId}`;

    io.to(room).emit("newQuestion", {
      question: {
        questionId: question.questionId,
        text: question.text,
        startTime: question.startTime,
        options: question.options,
        timeLimit: question.timeLimit,
        endsAt,
      },
      currentQuestionIndex: session.currentQuestionIndex,
    });

    this.startTimer(session);
  }

  startTimer(session: InMemorySessionSnapshot) {
    const question = session.questions[session.currentQuestionIndex];
    const duration = question.timeLimit * 1000;

    if (session.questionTimeout) {
      clearTimeout(session.questionTimeout);
    }

    if (session.nextQuestionTimeout) {
      clearTimeout(session.nextQuestionTimeout);
      session.nextQuestionTimeout = null;
    }

    session.questionTimeout = setTimeout(() => {
      this.revealAnswers(session);

      session.questionTimeout = null;
      session.nextQuestionTimeout = setTimeout(() => {
        session.nextQuestionTimeout = null;
        this.nextQuestion(session);
      }, 3000);
    }, duration);
  }

  nextQuestion(session: InMemorySessionSnapshot) {
    if (session.questionTimeout) {
      clearTimeout(session.questionTimeout);
      session.questionTimeout = null;
    }

    if (session.nextQuestionTimeout) {
      clearTimeout(session.nextQuestionTimeout);
      session.nextQuestionTimeout = null;
    }

    session.currentQuestionIndex++;
    if (session.currentQuestionIndex > session.totalQuestions - 1) {
      return this.endSession(session);
    }

    this.broadcastQuestion(session);
  }

  revealAnswers(session: InMemorySessionSnapshot) {
    const question = session.questions[session.currentQuestionIndex];

    if (!question) {
      return;
    }

    const room = `session-${session.sessionId}`;
    const socketsInRoom = io.sockets.adapter.rooms.get(room);

    if (!socketsInRoom || socketsInRoom.size === 0) {
      return;
    }

    for (const socketId of socketsInRoom) {
      const selectedOptionId = session.submittedAnswers.get(socketId) || "";
      const selectedAnswer = question.options.find(
        (option) => option.id === selectedOptionId,
      );
      const isCorrect = Boolean(
        selectedAnswer &&
        question.correctOptions.some(
          (correct) => correct.id === selectedAnswer.id,
        ),
      );

      const result: SubmitAnswerResult = {
        selectedAnswer: selectedAnswer || null,
        correctAnswer: question.correctOptions,
        isCorrect,
        revealed: true,
      };

      io.to(socketId).emit("answer:result", result);
    }
  }

  submitAnswer(
    selectedOption: string = "",
    session: InMemorySessionSnapshot,
    targetSocketId?: string,
  ) {
    const question = session.questions[session.currentQuestionIndex];

    if (!question) {
      throw new BadRequestError("No active question for this session");
    }

    // Save answer only; revealing correctness is deferred until timeout.
    if (targetSocketId) {
      if (session.submittedSocketIds.has(targetSocketId)) {
        return;
      }

      session.submittedSocketIds.add(targetSocketId);
      if (selectedOption) {
        session.submittedAnswers.set(targetSocketId, selectedOption);
      }
    }
  }

  endSession(session: InMemorySessionSnapshot) {}

  sendCurrentQuestion(session: InMemorySessionSnapshot) {
    const question = session.questions[session.currentQuestionIndex];
    const duration = question.timeLimit * 1000;
    const endsAt = new Date(session.questionStartTime + duration).toISOString();

    const room = `session-${session.sessionId}`;
    io.to(room).emit("currentQuestion", {
      question: {
        questionId: question.questionId,
        text: question.text,
        startTime: question.startTime,
        options: question.options,
        timeLimit: question.timeLimit,
        endsAt,
      },
      currentQuestionIndex: session.currentQuestionIndex,
    });
  }

  async createSession(data: CreateQuizSessionDTO): Promise<QuizSession> {
    const session = new QuizSession();
    session.sessionName = data.sessionName;
    session.quizId = data.quizId;
    session.status = data.status;
    session.currentQuestionIndex = data.currentQuestionIndex;
    session.startTime = data.startTime || undefined;
    session.scheduledStartTime = data.scheduledStartTime || undefined;
    session.createdByUserId = data.createdByUserId as string;
    const savedSession = await this.quizSessionRepository.save(session);

    const quiz = await this.quizRepository.findOne({
      where: { id: savedSession.quizId },
      relations: ["questions", "questions.options"],
    });

    if (!quiz) {
      throw new NotFoundError("Quiz not found for this session");
    }

    const questions = [...(quiz.questions || [])].sort(
      (a, b) => a.order - b.order,
    );

    this.session.set(savedSession.id, {
      sessionId: savedSession.id,
      quizId: savedSession.quizId,
      startedAt: new Date().toISOString(),
      questionStartTime: 0,
      questionTimeout: null,
      nextQuestionTimeout: null,
      submittedSocketIds: new Set<string>(),
      submittedAnswers: new Map<string, string>(),
      currentQuestionIndex: savedSession.currentQuestionIndex,
      totalQuestions: questions.length,
      status: savedSession.status,
      scheduledStartTime: savedSession.scheduledStartTime || new Date(),
      questions: questions.map((question) => {
        const options = question.options || [];
        const correctOptions = options
          .filter((option) => option.isCorrect)
          .map((option) => ({
            id: option.id,
            text: option.text,
          }));

        return {
          questionId: question.id,
          text: question.text,
          order: question.order,
          startTime: null,
          timeLimit: question.timeLimit,
          options: options.map((option) => ({
            id: option.id,
            text: option.text,
          })),
          correctOptions,
        };
      }),
      participants: new Map<string, InMemoryParticipant>(),
    });

    void this.scheduleSession(this.session.get(savedSession.id)!);

    return savedSession;
  }

  async joinSession(
    sessionId: string,
    userId: string,
    socketId: string,
  ): Promise<Participant> {
    const quizSession = await this.quizSessionRepository.findOne({
      where: { id: sessionId },
    });

    if (!quizSession) {
      throw new NotFoundError("Quiz session not found");
    }

    if (quizSession.status === "finished") {
      throw new NotFoundError("Quiz session has already finished");
    }

    const participant = await participantService.createParticipant(
      userId,
      quizSession.id as any,
    );

    if (!activeParticipants.has(sessionId)) {
      activeParticipants.set(sessionId, new Set());
    }

    activeParticipants.get(sessionId)?.add(userId);

    const inMemorySession = this.session.get(sessionId);
    if (inMemorySession) {
      inMemorySession.participants.set(userId, {
        participantId: participant.id,
        socketId: socketId,
        score: 0,
        lastAnsweredQuestionIndex: -1,
      });

      if (inMemorySession.status === "started") {
        this.sendCurrentQuestionToSocket(socketId, inMemorySession);
      }
    }

    const now = Date.now();
    const startTime =
      this.session.get(sessionId)?.scheduledStartTime.getTime() || 0;
    if (this.session.get(sessionId)?.status === "waiting" && now < startTime) {
      const timeUntilStart = startTime - now;

      io.to(sessionId).emit("sessionStartingSoon", {
        message: `Quiz session will start in ${Math.ceil(timeUntilStart / 1000)} seconds!`,
      });
    }

    return participant;
  }

  sendCurrentQuestionToSocket(
    socketId: string,
    session: InMemorySessionSnapshot,
  ) {
    const question = session.questions[session.currentQuestionIndex];

    const now = Date.now();
    const endsAt = new Date(
      session.questionStartTime + question.timeLimit * 1000,
    ).toISOString();

    io.to(socketId).emit("newQuestion", {
      question: {
        questionId: question.questionId,
        text: question.text,
        options: question.options,
        timeLimit: question.timeLimit,
        startTime: question.startTime,
        endsAt,
      },
      currentQuestionIndex: session.currentQuestionIndex,
    });
  }

  // get all active and upcoming sessions
  async getActiveAndUpcomingSessions(): Promise<ActiveAndUpcomingSessions> {
    const now = new Date();

    const [activeSessions, upcomingSessions] = await Promise.all([
      this.quizSessionRepository
        .createQueryBuilder("session")
        .leftJoinAndSelect("session.quiz", "quiz")
        .loadRelationCountAndMap("quiz.questionCount", "quiz.questions")
        .where("session.status = :status", { status: "started" })
        .orderBy("session.startTime", "DESC")
        .getMany(),
      this.quizSessionRepository
        .createQueryBuilder("session")
        .leftJoinAndSelect("session.quiz", "quiz")
        .loadRelationCountAndMap("quiz.questionCount", "quiz.questions")
        .where("session.status = :status", { status: "waiting" })
        .andWhere("session.scheduledStartTime IS NOT NULL")
        .andWhere("session.scheduledStartTime > :now", { now })
        .orderBy("session.scheduledStartTime", "ASC")
        .getMany(),
    ]);

    return {
      activeSessions,
      upcomingSessions,
    };
  }

  async getSessionStats(): Promise<SessionStats> {
    const [activeParticipants, activeSessions, totalQuizTemplates] =
      await Promise.all([
        this.participantRepository
          .createQueryBuilder("participant")
          .innerJoin("participant.quizSession", "session")
          .where("session.status = :status", { status: "started" })
          .getCount(),
        this.quizSessionRepository.count({
          where: { status: "started" },
        }),
        this.quizRepository.count(),
      ]);

    return {
      activeParticipants,
      activeSessions,
      totalQuizTemplates,
    };
  }
}

export const quizSessionService = new QuizSessionService();
