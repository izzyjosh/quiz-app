import { Router } from "express";
import { quizSessionController } from "../controllers/quizsession.controllers";
import { authMiddleware } from "../middlewares/authMiddleware";
import { validateRequest } from "../utils/request-validation";
import { createQuizSessionSchema } from "../schemas/quizsession.schemas";

export const sessionRouter = Router();

sessionRouter.post(
  "/start",
  authMiddleware,
  validateRequest(createQuizSessionSchema),
  (req, res, next) => quizSessionController.startSession(req, res, next),
);

sessionRouter.get("/upcoming-active", authMiddleware, (req, res, next) =>
  quizSessionController.getAllSessions(req, res, next),
);

sessionRouter.get("/stats", authMiddleware, (req, res, next) =>
  quizSessionController.getSessionStats(req, res, next),
);

sessionRouter.post("/:sessionId/activate", authMiddleware, (req, res, next) =>
  quizSessionController.activateSession(req, res, next),
);

sessionRouter.post("/:sessionId/end", authMiddleware, (req, res, next) =>
  quizSessionController.endSession(req, res, next),
);

sessionRouter.post("/:sessionId/join", authMiddleware, (req, res, next) =>
  quizSessionController.joinSession(req, res, next),
);
