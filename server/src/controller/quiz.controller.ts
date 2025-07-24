import { Request, Response } from "express";
import quizRepository from "../services/quiz.service";
import successResponse from "../utils/successResponse";

import { matchedData } from "express-validator";
import { StatusCodes } from "http-status-codes";
import parseValidationError from "../utils/parseValidationError";
import APIError, { APIValidationError } from "../utils/apiErrors";

class QuizController {
  static async all(req: Request, res: Response) {
    const data = await quizRepository.findAll();
    successResponse({
      res,
      statusCode: StatusCodes.OK,
      message: "quizzes returned successfully",
      data: data
    });
  }

  static async create(req: Request, res: Response) {
    const errors = parseValidationError(req);

    if (errors.length > 0) {
      throw new APIValidationError(errors);
    }

    const quizData = matchedData(req);

    const response = await quizRepository.createQuiz(quizData);

    successResponse({
      res,
      statusCode: StatusCodes.CREATED,
      message: "quiz created successfully",
      data: response
    });
  }

  static async fetchOne(req: Request, res: Response) {
    const id = req.params.id;
    const response = await quizRepository.findOne(id);
    successResponse({
      res,
      statusCode: StatusCodes.OK,
      message: "quiz returned successfully ",
      data: response
    });
  }

  static async update(req: Request, res: Response) {
    const id = req.params.id;
    const errors = parseValidationError(req);

    if (errors.length > 0) {
      throw new APIValidationError(errors);
    }

    const updateQuizData = matchedData(req);

    const response = await quizRepository.updateQuiz(id, updateQuizData);

    successResponse({
      res,
      statusCode: StatusCodes.OK,
      message: "quiz updated successfully",
      data: response
    });
  }

  static async deleteQuiz(req: Request, res: Response) {
    const id = req.params.id;
    const response = await quizRepository.deleteQuiz(id);

    successResponse({
      res,
      statusCode: StatusCodes.OK,
      message: "quiz deleted successfully ",
      data: response
    });
  }
}

export default QuizController;
