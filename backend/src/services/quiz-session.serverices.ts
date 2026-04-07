import { AppDataSource } from "../config/datasource";
import { QuizSession } from "../models/quizsession.model";
import { Participant } from "../models/participant.model";
import { CreateQuizSessionDTO } from "../schemas/quizsession.schemas";
import { NotFoundError } from "../utils/api.errors";
import { participantService } from "./participant.services";

import { activeParticipants, type SessionStatsPayload } from "../utils/socket";
import { Quiz } from "../models/quiz.model";

type ActiveAndUpcomingSessions = {
  activeSessions: QuizSession[];
  upcomingSessions: QuizSession[];
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

  async startSession(data: CreateQuizSessionDTO): Promise<QuizSession> {
    const session = new QuizSession();
    session.sessionName = data.sessionName;
    session.quizId = data.quizId;
    session.status = data.status;
    session.currentQuestionIndex = data.currentQuestionIndex;
    session.startTime = data.startTime || undefined;
    session.scheduledStartTime = data.scheduledStartTime || undefined;
    session.createdByUserId = data.createdByUserId as string;
    const savedSession = await this.quizSessionRepository.save(session);

    return savedSession;
  }

  async joinSession(sessionId: string, userId: string): Promise<Participant> {
    const session = await this.quizSessionRepository.findOne({
      where: { id: sessionId },
    });
    if (!session) {
      throw new NotFoundError("Quiz session not found");
    }
    if (session.status === "finished") {
      throw new NotFoundError("Quiz session has already finished");
    }

    const participant = await participantService.createParticipant(
      userId,
      session.id as any,
    );

    // for getting the number of active participants
    if (!activeParticipants.has(sessionId)) {
      activeParticipants.set(sessionId, new Set());
    }

    activeParticipants.get(sessionId)?.add(userId);

    return participant;
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
