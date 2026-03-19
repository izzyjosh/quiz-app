import { Router } from "express";
import { validateRequest } from "../utils/request-validation";
import { createQuizSchema } from "../schemas/quiz.schemas";
import { quizController } from "../controllers/quiz.controllers";
import { authMiddleware } from "../middlewares/authMiddleware";

export const quizRouter = Router();

quizRouter.post(
  "/",
  authMiddleware,
  validateRequest(createQuizSchema),
  (req, res, next) => quizController.createQuiz(req, res, next),
);

quizRouter.get("/", authMiddleware, (req, res, next) =>
  quizController.getAllQuizzes(req, res, next),
);

quizRouter.get("/:quizId", authMiddleware, (req, res, next) =>
  quizController.getQuiz(req, res, next),
);

quizRouter.delete("/:quizId", authMiddleware, (req, res, next) =>
  quizController.deleteQuiz(req, res, next),
);
