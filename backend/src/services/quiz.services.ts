import { AppDataSource } from "../config/datasource";
import { Quiz } from "../models/quiz.model";
import { QuizSession } from "../models/quizsession.model";
import { CreateQuizDTO } from "../schemas/quiz.schemas";
import { NotFoundError } from "../utils/api.errors";
import { emitTotalQuizCount, emitSessionStatsUpdated } from "../utils/socket";
import { getSessionStatsSnapshot } from "./quiz-session.serverices";

type QuizWithSessionCounts = Quiz & {
  liveNow: number;
  upcoming: number;
  totalRuns: number;
  questionCount: number;
};

class QuizService {
  private quizRepository = AppDataSource.getRepository(Quiz);
  private sessionRepository = AppDataSource.getRepository(QuizSession);

  async createQuiz(data: CreateQuizDTO, userId?: string): Promise<Quiz> {
    const quizData = {
      ...data,
      themeKey: data.themeKey.trim().toLowerCase(),
      userId: userId,
    };
    const quiz = this.quizRepository.create(quizData);
    const createdQuiz = await this.quizRepository.save(quiz);

    const totalQuizCount = await this.quizRepository.count();
    emitTotalQuizCount(totalQuizCount);
    emitSessionStatsUpdated(await getSessionStatsSnapshot());

    return createdQuiz;
  }

  async getQuiz(quizId: string): Promise<Quiz> {
    const quiz = await this.quizRepository.findOneBy({ id: quizId });
    if (!quiz) {
      throw new NotFoundError("Quiz not found");
    }
    return quiz;
  }

  async getAll(): Promise<QuizWithSessionCounts[]> {
    const now = new Date();

    const quizzes = await this.quizRepository.find({
      relations: ["questions"],
    });

    const quizzesWithCounts = await Promise.all(
      quizzes.map(async (quiz) => {
        // Count live sessions (status = "started")
        const liveNow = await this.sessionRepository.count({
          where: {
            quizId: quiz.id,
            status: "started",
          },
        });

        // Count upcoming sessions (status = "waiting" AND scheduledStartTime > now)
        const upcoming = await this.sessionRepository
          .createQueryBuilder("session")
          .where("session.quizId = :quizId", { quizId: quiz.id })
          .andWhere("session.status = :status", { status: "waiting" })
          .andWhere("session.scheduledStartTime IS NOT NULL")
          .andWhere("session.scheduledStartTime > :now", { now })
          .getCount();

        // Count total runs (status = "finished")
        const totalRuns = await this.sessionRepository.count({
          where: {
            quizId: quiz.id,
            status: "finished",
          },
        });

        // Count questions
        const questionCount = quiz.questions ? quiz.questions.length : 0;

        return {
          ...quiz,
          liveNow,
          upcoming,
          totalRuns,
          questionCount,
        };
      }),
    );

    return quizzesWithCounts;
  }

  async deleteQuiz(quizId: string): Promise<void> {
    const quiz = await this.quizRepository.findOneBy({ id: quizId });
    if (!quiz) {
      throw new NotFoundError("Quiz not found");
    }
    await this.quizRepository.remove(quiz);

    emitTotalQuizCount(await this.quizRepository.count());
    emitSessionStatsUpdated(await getSessionStatsSnapshot());
  }
}

export const quizService = new QuizService();
