import { NextFunction, Request, Response } from "express";
import { CreateQuizDTO } from "../schemas/quiz.schemas";
import { quizService } from "../services/quiz.services";
import { SuccessResponse } from "../utils/responses";

class QuizController {
  async createQuiz(req: Request, res: Response, next: NextFunction) {
    try {
      const body: CreateQuizDTO = (req as any).validatedBody;
      const { id: userId } = (req as any).user;

      const response = await quizService.createQuiz(body, userId);

      res.status(201).json(
        SuccessResponse({
          message: "Quiz created successfully",
          data: response,
        }),
      );
    } catch (err) {
      next(err);
    }
  }

  async getQuiz(req: Request, res: Response, next: NextFunction) {
    try {
      const quizId = req.params.quizId as string;
      const response = await quizService.getQuiz(quizId);

      res.status(200).json(
        SuccessResponse({
          message: "Quiz retrieved successfully",
          data: response,
        }),
      );
    } catch (err) {
      next(err);
    }
  }

  async getAllQuizzes(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await quizService.getAll();

      res.status(200).json(
        SuccessResponse({
          message: "Quizzes retrieved successfully",
          data: response,
        }),
      );
    } catch (err) {
      next(err);
    }
  }

  async deleteQuiz(req: Request, res: Response, next: NextFunction) {
    try {
      const quizId = req.params.quizId as string;
      await quizService.deleteQuiz(quizId);

      res.status(200).json(
        SuccessResponse({
          message: "Quiz deleted successfully",
        }),
      );
    } catch (err) {
      next(err);
    }
  }
}

export const quizController = new QuizController();
