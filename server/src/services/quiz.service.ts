import { Repository } from "typeorm";
import { Quiz } from "../entity/Quiz";
import APIError from "../utils/apiErrors";
import AppDataSource from "../datasource/datasource";
import categoryRepository from "./category.services";
import { IQuiz } from "../interfaces/quiz.interface";

export class QuizService {
  constructor(private readonly quizRepository: Repository<Quiz>) {}

  async findAll() {
    return await this.quizRepository.find();
  }

  async findOne(id: string) {
    const quiz = await this.quizRepository.findOne({ where: { id } });
    if (!quiz) {
      throw new APIError("Quiz not found", 404);
    }
    return quiz;
  }

  async createQuiz(newQuiz: IQuiz) {
    const { categoryId, ...quizData } = newQuiz;

    const category = await categoryRepository.fetchOne(categoryId);
    if (!category) {
      throw new APIError("category does not exist", 404);
    }

    const quiz = this.quizRepository.create(...quizData, category);
    await this.quizRepository.save(quiz);
    return quiz;
  }

  async updateQuiz(id: string, data: Partial<Quiz>) {
    const quiz = await this.quizRepository.findOne({ where: { id } });
    if (!quiz) {
      throw new APIError("Quiz not found", 404);
    }
    this.quizRepository.merge(quiz, data);
    await this.quizRepository.save(quiz);
    return quiz;
  }

  async deleteQuiz(id: string) {
    const quiz = await this.quizRepository.findOne({ where: { id } });
    if (!quiz) {
      throw new APIError("Quiz not found", 404);
    }
    await this.quizRepository.remove(quiz);
    return { message: "Quiz deleted successfully" };
  }
}

const quizRepository = new QuizService(AppDataSource.getRepository(Quiz));
export default quizRepository;
