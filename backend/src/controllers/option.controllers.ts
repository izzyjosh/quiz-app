import { NextFunction, Request, Response } from "express";
import { optionService } from "../services/option.services";
import { SuccessResponse } from "../utils/responses";

class OptionController {
  async createOption(req: Request, res: Response, next: NextFunction) {
    try {
      const questionId = req.params.questionId as string;
      const body = (req as any).validatedBody;
      const option = await optionService.createOption(body, questionId);
      res.status(201).json(
        SuccessResponse({
          message: "Option created successfully",
          data: option,
        }),
      );
    } catch (error) {
      next(error);
    }
  }

  async getOptions(req: Request, res: Response, next: NextFunction) {
    try {
      const questionId = req.params.questionId as string;
      const options = await optionService.getOptions(questionId);
      res.status(200).json(
        SuccessResponse({
          message: "Options retrieved successfully",
          data: options,
        }),
      );
    } catch (error) {
      next(error);
    }
  }
}

export const optionController = new OptionController();
