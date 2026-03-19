import { Router } from "express";
import { validateRequest } from "../utils/request-validation";
import { createSubmissionSchema } from "../schemas/submission.schemas";
import { submissionController } from "../controllers/submission.controllers";
import { authMiddleware } from "../middlewares/authMiddleware";

export const submissionRouter = Router();

// Create submission (submit an answer)
submissionRouter.post(
  "/",
  authMiddleware,
  validateRequest(createSubmissionSchema),
  (req, res, next) => submissionController.createSubmission(req, res, next),
);

// Get all submissions for a participant
submissionRouter.get(
  "/participant/:participantId",
  authMiddleware,
  (req, res, next) =>
    submissionController.getParticipantSubmissions(req, res, next),
);

// Get a specific submission for a question by participant
submissionRouter.get(
  "/participant/:participantId/question/:questionId",
  authMiddleware,
  (req, res, next) =>
    submissionController.getQuestionSubmission(req, res, next),
);
