import { Request, Response, NextFunction } from "express";
import { quizService } from "../services/question.services";
import { CreateQuestionDTO } from "../schemas/question.schemas";
import { success } from "zod";
import { SuccessResponse } from "../utils/responses";

class QuestionController {
  async createQuestion(req: Request, res: Response, next: NextFunction) {
    try {
      const quizId = req.params.quizId as string;
      const body: CreateQuestionDTO = (req as any).validatedBody;

      const response = await quizService.createQuestion(body, quizId);
      res.status(201).json(
        SuccessResponse({
          message: "Question created successfully",
          data: response,
        }),
      );
    } catch (error) {
      next(error);
    }
  }

  async getQuestion(req: Request, res: Response, next: NextFunction) {
    try {
      const questionId = req.params.questionId as string;
      const response = await quizService.getQuestion(questionId);
      res.status(200).json(
        SuccessResponse({
          message: "Question retrieved successfully",
          data: response,
        }),
      );
    } catch (error) {
      next(error);
    }
  }

  async getAllQuestions(req: Request, res: Response, next: NextFunction) {
    try {
      const quizId = req.params.quizId as string;
      const response = await quizService.getAllQuestions(quizId);
      res.status(200).json(
        SuccessResponse({
          message: "Questions retrieved successfully",
          data: response,
        }),
      );
    } catch (error) {
      next(error);
    }
  }
}

export const questionController = new QuestionController();
