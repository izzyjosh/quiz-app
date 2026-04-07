import { NextFunction, Request, Response } from "express";
import { quizSessionService } from "../services/quiz-session.serverices";
import { SuccessResponse } from "../utils/responses";

class QuizSessionController {
  async startSession(req: Request, res: Response, next: NextFunction) {
    try {
      const body = (req as any).validatedBody;
      const { id: userId } = (req as any).user;

      // Add creator info to the body
      const sessionData = {
        ...body,
        createdByUserId: userId,
      };

      const response = await quizSessionService.createSession(sessionData);
      res.status(200).json(
        SuccessResponse({
          message: "Quiz session created successfully",
          data: response,
        }),
      );
    } catch (err) {
      next(err);
    }
  }

  async joinSession(req: Request, res: Response, next: NextFunction) {
    try {
      const sessionId = req.params.sessionId as string;
      const { id: userId } = (req as any).user;
      const response = await quizSessionService.joinSession(sessionId, userId);
      res.status(200).json(
        SuccessResponse({
          message: "Successfully joined quiz session",
          data: response,
        }),
      );
    } catch (err) {
      next(err);
    }
  }

  async getAllSessions(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await quizSessionService.getActiveAndUpcomingSessions();
      res.status(200).json(
        SuccessResponse({
          message: "Sessions retrieved successfully",
          data: response,
        }),
      );
    } catch (err) {
      next(err);
    }
  }

  async getSessionStats(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await quizSessionService.getSessionStats();
      res.status(200).json(
        SuccessResponse({
          message: "Session stats retrieved successfully",
          data: response,
        }),
      );
    } catch (err) {
      next(err);
    }
  }
}

export const quizSessionController = new QuizSessionController();
