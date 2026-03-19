import { AppDataSource } from "../config/datasource";
import { Quiz } from "../models/quiz.model";
import { CreateQuizDTO } from "../schemas/quiz.schemas";
import { NotFoundError } from "../utils/api.errors";

class QuizService {
  private quizRepository = AppDataSource.getRepository(Quiz);

  async createQuiz(data: CreateQuizDTO, userId?: string): Promise<Quiz> {
    const quizData = {
      ...data,
      userId: userId,
    };
    const quiz = this.quizRepository.create(quizData);
    return await this.quizRepository.save(quiz);
  }

  async getQuiz(quizId: string): Promise<Quiz> {
    const quiz = await this.quizRepository.findOneBy({ id: quizId });
    if (!quiz) {
      throw new NotFoundError("Quiz not found");
    }
    return quiz;
  }

  async getAll(): Promise<Quiz[]> {
    return await this.quizRepository.find();
  }

  async deleteQuiz(quizId: string): Promise<void> {
    const quiz = await this.quizRepository.findOneBy({ id: quizId });
    if (!quiz) {
      throw new NotFoundError("Quiz not found");
    }
    await this.quizRepository.remove(quiz);
  }
}

export const quizService = new QuizService();
