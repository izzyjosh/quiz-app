import { Router } from "express";
import { questionController } from "../controllers/question.controllers";
import { authMiddleware } from "../middlewares/authMiddleware";
import { validateRequest } from "../utils/request-validation";
import { createQuestionSchema } from "../schemas/question.schemas";

export const questionRouter = Router({ mergeParams: true });

questionRouter.post(
  "/questions",
  authMiddleware,
  validateRequest(createQuestionSchema),
  (req, res, next) => questionController.createQuestion(req, res, next),
);

questionRouter.get("/questions/:questionId", authMiddleware, (req, res, next) =>
  questionController.getQuestion(req, res, next),
);

questionRouter.get("/questions", authMiddleware, (req, res, next) =>
  questionController.getAllQuestions(req, res, next),
);
