import { Router } from "express";
import { quizSessionController } from "../controllers/quizsession.controllers";
import { authMiddleware } from "../middlewares/authMiddleware";
import { validateRequest } from "../utils/request-validation";
import { createQuizSessionSchema } from "../schemas/quizsession.schemas";

export const sesssionRouter = Router();

sesssionRouter.post(
  "/start",
  authMiddleware,
  validateRequest(createQuizSessionSchema),
  (req, res, next) => quizSessionController.startSession(req, res, next),
);

sesssionRouter.post("/:sessionId/activate", authMiddleware, (req, res, next) =>
  quizSessionController.activateSession(req, res, next),
);

sesssionRouter.post("/:sessionId/end", authMiddleware, (req, res, next) =>
  quizSessionController.endSession(req, res, next),
);

sesssionRouter.post("/:sessionId/join", authMiddleware, (req, res, next) =>
  quizSessionController.joinSession(req, res, next),
);
