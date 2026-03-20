import { AppDataSource } from "../config/datasource";
import { Question } from "../models/question.model";
import { CreateQuestionDTO } from "../schemas/question.schemas";
import { NotFoundError } from "../utils/api.errors";

class QuestionService {
  private questionRepo = AppDataSource.getRepository(Question);

  async createQuestion(
    data: CreateQuestionDTO,
    quizId: string,
  ): Promise<Question> {
    const question = this.questionRepo.create({ ...data, quizId });
    return this.questionRepo.save(question);
  }

  async getQuestion(questionId: string): Promise<Question> {
    const question = await this.questionRepo.findOneBy({ id: questionId });
    if (!question) {
      throw new NotFoundError("Question not found");
    }
    return question;
  }

  async getQuestionsAndOptions(quizId: string): Promise<Question[]> {
    return this.questionRepo.find({
      where: { quizId },
      relations: ["options"],
    });
  }

  async getAllQuestions(quizId: string): Promise<Question[]> {
    return this.questionRepo.findBy({ quizId });
  }
}

export const questionService = new QuestionService();
