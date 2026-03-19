import { NextFunction, Request, Response } from "express";
import { quizSessionService } from "../services/quiz-session.serverices";

class QuizSessionController {
  async startSession(req: Request, res: Response, next: NextFunction) {
    try {
      const body = (req as any).validatedBody;
      const response = quizSessionService.startSession(body);
      res.status(200).json({
        message: "Quiz session started successfully",
        data: response,
      });
    } catch (err) {
      next(err);
    }
  }
}

export const quizSessionController = new QuizSessionController();
