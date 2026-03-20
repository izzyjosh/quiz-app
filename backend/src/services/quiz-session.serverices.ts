import { AppDataSource } from "../config/datasource";
import { QuizSession } from "../models/quizsession.model";
import { Participant } from "../models/participant.model";
import { CreateQuizSessionDTO } from "../schemas/quizsession.schemas";
import { NotFoundError, ForbiddenError } from "../utils/api.errors";
import { participantService } from "./participant.services";
import { leaderboardService } from "./leaderboard.services";

class QuizSessionService {
  private quizSessionRepository = AppDataSource.getRepository(QuizSession);

  async startSession(data: CreateQuizSessionDTO): Promise<QuizSession> {
    const session = new QuizSession();
    session.quizId = data.quizId;
    session.status = data.status;
    session.currentQuestionIndex = data.currentQuestionIndex;
    session.startTime = data.startTime || undefined;
    session.scheduledStartTime = data.scheduledStartTime || undefined;
    session.createdByUserId = data.createdByUserId;
    return await this.quizSessionRepository.save(session);
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

    await leaderboardService.ensureMember(
      String(session.id),
      String(participant.id),
    );

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

    session.status = "started";
    session.startTime = new Date();

    await leaderboardService.clear(session.id as any); // Clear leaderboard at session start

    return await this.quizSessionRepository.save(session);
  }

  /**
   * Internal method for automatic session activation by scheduler
   * Bypasses user authorization checks
   * Used when scheduledStartTime is reached
   */
  async autoActivateSession(sessionId: string): Promise<QuizSession> {
    const session = await this.getSession(sessionId);
    if (session.status !== "waiting") {
      return session;
    }

    session.status = "started";
    session.startTime = new Date();
    await leaderboardService.clear(session.id as any); // Clear leaderboard at session start
    return await this.quizSessionRepository.save(session);
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

  async endSession(sessionId: string, userId: string): Promise<QuizSession> {
    const session = await this.getSession(sessionId);

    // Only the creator can end the session
    if (session.createdByUserId !== userId) {
      throw new ForbiddenError("Only the session creator can end this session");
    }

    session.status = "finished";
    await leaderboardService.clear(session.id as any); // Clear leaderboard at session end
    return await this.quizSessionRepository.save(session);
  }

  async updateCurrentQuestion(
    sessionId: string,
    questionIndex: number,
  ): Promise<QuizSession> {
    const session = await this.getSession(sessionId);
    session.currentQuestionIndex = questionIndex;
    return await this.quizSessionRepository.save(session);
  }
}

export const quizSessionService = new QuizSessionService();
