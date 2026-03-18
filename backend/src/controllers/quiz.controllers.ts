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
}

export const quizController = new QuizController();
