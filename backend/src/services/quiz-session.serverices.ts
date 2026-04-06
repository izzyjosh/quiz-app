import { AppDataSource } from "../config/datasource";
import { QuizSession } from "../models/quizsession.model";
import { Participant } from "../models/participant.model";
import { CreateQuizSessionDTO } from "../schemas/quizsession.schemas";
import {
  NotFoundError,
  ForbiddenError,
  BadRequestError,
} from "../utils/api.errors";
import { participantService } from "./participant.services";
import { leaderboardService } from "./leaderboard.services";
import { redisClient } from "../config/redis";
import { Question } from "../models/question.model";
import { questionService } from "./question.services";
import { io } from "../app";
import {
  activeParticipants,
  emitLiveSessionRemoved,
  emitSessionListUpdated,
  emitSessionStatsUpdated,
  type SessionStatsPayload,
} from "../utils/socket";
import { Quiz } from "../models/quiz.model";

type SessionQuestionPayload = {
  id: string;
  text: string;
  order: number;
  options: Array<{ id: string; text: string }>;
  timeLimit: number;
};

type ActiveAndUpcomingSessions = {
  activeSessions: QuizSession[];
  upcomingSessions: QuizSession[];
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
  private questionTimers = new Map<string, NodeJS.Timeout>();
  private countdownTimers = new Map<string, NodeJS.Timeout>();
  private scheduledActivationTimers = new Map<string, NodeJS.Timeout>();

  private getQuestionsKey(sessionId: string): string {
    return `session:${sessionId}:questions`;
  }

  private getCurrentQuestionIndexKey(sessionId: string): string {
    return `session:${sessionId}:currentQuestionIndex`;
  }

  private getStatusKey(sessionId: string): string {
    return `session:${sessionId}:status`;
  }

  private getTimerKey(sessionId: string): string {
    return `session:${sessionId}:timer`;
  }

  private async cacheSessionState(
    sessionId: string,
    status: string,
    questions: SessionQuestionPayload[],
    currentQuestionIndex: number,
  ): Promise<void> {
    await Promise.all([
      redisClient.set(this.getStatusKey(sessionId), status),
      redisClient.set(
        this.getQuestionsKey(sessionId),
        JSON.stringify(questions),
      ),
      redisClient.set(
        this.getCurrentQuestionIndexKey(sessionId),
        String(currentQuestionIndex),
      ),
    ]);
  }

  private async emitSessionStats(): Promise<void> {
    emitSessionStatsUpdated(await getSessionStatsSnapshot());
  }

  private clearLocalTimers(sessionId: string): void {
    const questionTimer = this.questionTimers.get(sessionId);
    if (questionTimer) {
      clearTimeout(questionTimer);
      this.questionTimers.delete(sessionId);
    }

    const countdownTimer = this.countdownTimers.get(sessionId);
    if (countdownTimer) {
      clearTimeout(countdownTimer);
      this.countdownTimers.delete(sessionId);
    }
  }

  private clearScheduledActivationTimer(sessionId: string): void {
    const scheduledActivationTimer =
      this.scheduledActivationTimers.get(sessionId);
    if (!scheduledActivationTimer) {
      return;
    }

    clearTimeout(scheduledActivationTimer);
    this.scheduledActivationTimers.delete(sessionId);
  }

  private scheduleSessionActivation(session: QuizSession): void {
    const scheduledStartTime = session.scheduledStartTime;
    if (!scheduledStartTime || session.status !== "waiting") {
      return;
    }

    const delayMs = scheduledStartTime.getTime() - Date.now();
    if (delayMs <= 0) {
      void this.autoActivateSession(String(session.id));
      return;
    }

    const existingTimer = this.scheduledActivationTimers.get(
      String(session.id),
    );
    if (existingTimer) {
      clearTimeout(existingTimer);
      this.scheduledActivationTimers.delete(String(session.id));
    }

    const timeoutRef = setTimeout(() => {
      void this.autoActivateSession(String(session.id));
    }, delayMs);

    this.scheduledActivationTimers.set(String(session.id), timeoutRef);
  }

  private mapQuestionsForLiveSession(
    questions: Question[],
    defaultTimeLimit: number,
  ): SessionQuestionPayload[] {
    return questions
      .sort((a, b) => a.order - b.order)
      .map((question) => ({
        id: question.id,
        text: question.text,
        order: question.order,
        timeLimit: question.timeLimit || defaultTimeLimit,
        // Never include isCorrect in live question payloads.
        options: (question.options || []).map((option) => ({
          id: option.id,
          text: option.text,
        })),
      }));
  }

  private async getCachedSessionQuestions(
    sessionId: string,
  ): Promise<SessionQuestionPayload[]> {
    const questionsRaw = await redisClient.get(this.getQuestionsKey(sessionId));
    if (!questionsRaw) {
      return [];
    }

    try {
      return JSON.parse(questionsRaw) as SessionQuestionPayload[];
    } catch {
      return [];
    }
  }

  private async startTimer(
    sessionId: string,
    questionId: string,
    duration: number,
  ): Promise<Date> {
    this.clearLocalTimers(sessionId);

    const endsAt = new Date(Date.now() + duration * 1000);
    await redisClient.set(
      this.getTimerKey(sessionId),
      JSON.stringify({ questionId, endsAt: endsAt.toISOString() }),
      "EX",
      duration,
    );

    const timeoutRef = setTimeout(async () => {
      await this.handleTimeout(sessionId, questionId);
    }, duration * 1000);

    this.questionTimers.set(sessionId, timeoutRef);
    return endsAt;
  }

  private async sendQuestion(
    sessionId: string,
    questions: SessionQuestionPayload[],
    index: number,
  ): Promise<void> {
    const question = questions[index];

    if (!question) {
      await this.finishSession(sessionId, "completed");
      return;
    }

    await redisClient.set(
      this.getCurrentQuestionIndexKey(sessionId),
      String(index),
    );

    const endsAt = await this.startTimer(
      sessionId,
      question.id,
      question.timeLimit,
    );

    io.to(`session-${sessionId}`).emit("question:new", {
      questionId: question.id,
      text: question.text,
      options: question.options,
      timeLimit: question.timeLimit,
      endsAt,
    });
  }

  private async handleTimeout(
    sessionId: string,
    questionId: string,
  ): Promise<void> {
    const timerRaw = await redisClient.get(this.getTimerKey(sessionId));
    if (!timerRaw) {
      return;
    }

    try {
      const timer = JSON.parse(timerRaw) as {
        questionId: string;
        endsAt: string;
      };
      if (timer.questionId !== questionId) {
        return;
      }
    } catch {
      return;
    }

    io.to(`session-${sessionId}`).emit("question:timeout", {
      questionId,
    });

    const currentIndexRaw = await redisClient.get(
      this.getCurrentQuestionIndexKey(sessionId),
    );
    const currentIndex = Number(currentIndexRaw ?? "-1");
    const nextIndex = currentIndex + 1;

    const questions = await this.getCachedSessionQuestions(sessionId);
    await this.sendQuestion(sessionId, questions, nextIndex);
  }

  private async finishSession(
    sessionId: string,
    reason: "completed" | "ended",
  ): Promise<void> {
    const session = await this.quizSessionRepository.findOneBy({
      id: sessionId as any,
    });

    if (session && session.status !== "finished") {
      session.status = "finished";
      await this.quizSessionRepository.save(session);
    }

    this.clearLocalTimers(sessionId);

    await Promise.all([
      redisClient.del(this.getTimerKey(sessionId)),
      redisClient.set(this.getStatusKey(sessionId), "finished"),
      leaderboardService.clear(sessionId),
    ]);

    activeParticipants.delete(sessionId);
    io.emit("activeParticipants", {
      count: Array.from(activeParticipants.values()).reduce(
        (total, participants) => total + participants.size,
        0,
      ),
    });
    io.emit("liveSessions", {
      count: activeParticipants.size,
    });

    io.to(`session-${sessionId}`).emit("quiz:end", { reason });
    emitLiveSessionRemoved(sessionId);
    await this.emitSessionStats();
    emitSessionListUpdated();
  }

  private async activateSessionInternal(
    session: QuizSession,
  ): Promise<QuizSession> {
    if (session.status !== "waiting") {
      return session;
    }

    this.clearScheduledActivationTimer(String(session.id));

    session.status = "started";
    session.startTime = new Date();

    const questions = await this.getSessionQuestionsWithOptions(
      session.id as any,
    );
    if (questions.length === 0) {
      throw new BadRequestError("Cannot activate a session without questions");
    }

    const defaultQuestionTimeLimit = session.quiz?.timeLimit || 10;
    const liveQuestions = this.mapQuestionsForLiveSession(
      questions,
      defaultQuestionTimeLimit,
    );

    await Promise.all([
      leaderboardService.clear(String(session.id)),
      this.cacheSessionState(String(session.id), "starting", liveQuestions, -1),
    ]);

    io.to(`session-${session.id}`).emit("session:starting", { countdown: 10 });

    this.clearLocalTimers(String(session.id));
    const countdownRef = setTimeout(async () => {
      await redisClient.set(this.getStatusKey(String(session.id)), "started");
      await this.sendQuestion(String(session.id), liveQuestions, 0);
    }, 10_000);

    this.countdownTimers.set(String(session.id), countdownRef);

    return await this.quizSessionRepository.save(session);
  }

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

    this.scheduleSessionActivation(savedSession);

    await this.emitSessionStats();
    emitSessionListUpdated();

    return savedSession;
  }

  async joinSession(sessionId: string, userId: string): Promise<Participant> {
    const session = await this.getSession(sessionId);
    if (session.status === "finished") {
      throw new NotFoundError("Quiz session has already finished");
    }

    const participant = await participantService.createParticipant(
      userId,
      session.id as any,
    );

    if (!activeParticipants.has(sessionId)) {
      activeParticipants.set(sessionId, new Set());
    }

    activeParticipants.get(sessionId)?.add(userId);

    await leaderboardService.ensureMember(
      String(session.id),
      String(participant.id),
    );

    await this.emitSessionStats();

    return participant;
  }

  async activateSession(
    sessionId: string,
    userId: string,
  ): Promise<QuizSession> {
    const session = await this.getSession(sessionId);
    if (session.status !== "waiting") {
      throw new NotFoundError("Quiz session has already started");
    }

    // Check if user is the creator OR if scheduled time has passed
    const now = new Date();
    const isCreator = session.createdByUserId === userId;
    const isScheduledTimeReached =
      session.scheduledStartTime && session.scheduledStartTime <= now;

    if (!isCreator && !isScheduledTimeReached) {
      throw new ForbiddenError(
        "Only the session creator can activate this session, or wait until the scheduled time",
      );
    }

    const activatedSession = await this.activateSessionInternal(session);

    await this.emitSessionStats();
    emitSessionListUpdated();

    return activatedSession;
  }

  /**
   * Internal method for automatic session activation by scheduler
   * Bypasses user authorization checks
   * Used when scheduledStartTime is reached
   */
  async autoActivateSession(sessionId: string): Promise<QuizSession> {
    const session = await this.getSession(sessionId);
    const activatedSession = await this.activateSessionInternal(session);

    await this.emitSessionStats();
    emitSessionListUpdated();

    return activatedSession;
  }

  async getSession(sessionId: string): Promise<QuizSession> {
    const session = await this.quizSessionRepository.findOne({
      where: { id: sessionId as any },
      relations: ["quiz", "participants"],
    });
    if (!session) {
      throw new NotFoundError("Quiz session not found");
    }
    return session;
  }

  async getSessionQuestionsWithOptions(sessionId: string): Promise<Question[]> {
    const session = await this.getSession(sessionId);

    return questionService.getQuestionsAndOptions(session.quizId);
  }

  async endSession(sessionId: string, userId: string): Promise<QuizSession> {
    const session = await this.getSession(sessionId);

    // Only the creator can end the session
    if (session.createdByUserId !== userId) {
      throw new ForbiddenError("Only the session creator can end this session");
    }

    await this.finishSession(String(session.id), "ended");

    const updatedSession = await this.getSession(sessionId);
    await this.emitSessionStats();
    return updatedSession;
  }

  async updateCurrentQuestion(
    sessionId: string,
    questionIndex: number,
  ): Promise<QuizSession> {
    if (questionIndex < 0) {
      throw new BadRequestError("Question index cannot be negative");
    }

    const session = await this.getSession(sessionId);
    session.currentQuestionIndex = questionIndex;

    await redisClient.set(
      this.getCurrentQuestionIndexKey(String(session.id)),
      String(questionIndex),
    );

    return await this.quizSessionRepository.save(session);
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
