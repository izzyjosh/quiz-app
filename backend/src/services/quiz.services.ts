import { AppDataSource } from "../config/datasource";
import { Quiz } from "../models/quiz.model";
import { CreateQuizDTO } from "../schemas/quiz.schemas";

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
}

export const quizService = new QuizService();
