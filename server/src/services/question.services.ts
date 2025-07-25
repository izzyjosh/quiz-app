import { Repository } from "typeorm";
import { Question } from "../entity/Question";
import { IQuestion } from "../interfaces/question.interface";
import quizRepository from "./quiz.service";
import APIError from "../utils/apiErrors";
import AppDataSource from "../datasource/datasource";

export class QuestionService {
  constructor(private readonly questionRepository: Repository<Question>) {}

  async createQuestion(data: IQuestion) {
    const { quizId, ...questionData } = data;

    const quiz = await quizRepository.findOne(quizId);
    if (!quiz) {
      throw new APIError("Quiz not found", 404);
    }

    const question = this.questionRepository.create({ ...questionData, quiz });
    await this.questionRepository.save(question);

    return question;
  }

  async updateQuestion(id: string, data: Partial<IQuestion>) {
    const question = await this.questionRepository.findOne({ where: { id } });

    if (!question) {
      throw new APIError("Question does not exist", 404);
    }

    this.questionRepository.merge(question, data);
    await this.questionRepository.save(question);
    return question;
  }

  async findOne(id: string) {
    return this.questionRepository.findOne({ where: { id } });
  }

  // find all the questions in a quiz
  async fetchAll(quizId: string) {
    const quiz = await quizRepository.findOne(quizId);
    if (!quiz) {
      throw new APIError("quiz does not exist", 404);
    }
    return this.questionRepository.find({ where: { quiz: { id: quizId } } });
  }

  async deleteQuestion(id: string) {
    const question = await this.questionRepository.findOne({ where: { id } });
    if (!question) {
      throw new APIError("Question does not exist", 404);
    }
    await this.questionRepository.remove(question);
    return { message: "question deleted successfully " };
  }
}

const questionRepository = new QuestionService(
  AppDataSource.getRepository(Question)
);
export default questionRepository;
