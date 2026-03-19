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
