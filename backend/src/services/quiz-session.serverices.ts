import { AppDataSource } from "../config/datasource";
import { QuizSession } from "../models/quizsession.model";
import { Participant } from "../models/participant.model";
import { CreateQuizSessionDTO } from "../schemas/quizsession.schemas";
import { NotFoundError } from "../utils/api.errors";
import { participantService } from "./participant.services";

class QuizSessionService {
  private quizSessionRepository = AppDataSource.getRepository(QuizSession);

  async startSession(data: CreateQuizSessionDTO): Promise<QuizSession> {
    const session = new QuizSession();
    session.quizId = data.quizId;
    session.status = data.status;
    session.currentQuestionIndex = data.currentQuestionIndex;
    session.startTime = data.startTime || undefined;
    session.scheduledStartTime = data.scheduledStartTime || undefined;
    return await this.quizSessionRepository.save(session);
  }

  async joinSession(sessionId: string, userId: string): Promise<Participant> {
    const session = await this.getSession(sessionId);
    if (session.status === "finished") {
      throw new NotFoundError("Quiz session has already finished");
    }

    return await participantService.createParticipant(userId, session.id as any);
  }

  async activateSession(sessionId: string): Promise<QuizSession> {
    const session = await this.getSession(sessionId);
    if (session.status !== "waiting") {
      throw new NotFoundError("Quiz session has already started");
    }
    session.status = "started";
    session.startTime = new Date();
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

  async endSession(sessionId: string): Promise<QuizSession> {
    const session = await this.getSession(sessionId);
    session.status = "finished";
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
