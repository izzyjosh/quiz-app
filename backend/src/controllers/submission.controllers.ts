import { NextFunction, Request, Response } from "express";
import { CreateSubmissionDTO } from "../schemas/submission.schemas";
import { submissionService } from "../services/submission.services";
import { SuccessResponse } from "../utils/responses";

class SubmissionController {
  async createSubmission(req: Request, res: Response, next: NextFunction) {
    try {
      const body: CreateSubmissionDTO = (req as any).validatedBody;

      const response = await submissionService.createSubmission(body);

      res.status(201).json(
        SuccessResponse({
          message: "Answer submitted successfully",
          data: response,
        }),
      );
    } catch (err) {
      next(err);
    }
  }

  async getParticipantSubmissions(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const participantId = req.params.participantId as string;

      const response =
        await submissionService.getParticipantSubmissions(participantId);

      res.status(200).json(
        SuccessResponse({
          message: "Submissions retrieved successfully",
          data: response,
        }),
      );
    } catch (err) {
      next(err);
    }
  }

  async getQuestionSubmission(req: Request, res: Response, next: NextFunction) {
    try {
      const { participantId, questionId } = req.params;

      const response = await submissionService.getQuestionSubmission(
        participantId as string,
        questionId as string,
      );

      res.status(200).json(
        SuccessResponse({
          message: "Submission retrieved successfully",
          data: response,
        }),
      );
    } catch (err) {
      next(err);
    }
  }
}

export const submissionController = new SubmissionController();
