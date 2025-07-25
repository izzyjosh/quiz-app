import { Request, Response } from "express";
import questionRepository from "../services/question.services";
import successResponse from "../utils/successResponse";
import { IQuestion, IQuestionUpdate } from "../interfaces/question.interface";
import { matchedData } from "express-validator";
import { StatusCodes } from "http-status-codes";
import parseValidationError from "../utils/parseValidationError";
import APIError, { APIValidationError } from "../utils/apiErrors";

class QuestionController {
  static async create(req: Request, res: Response) {
    const errors = parseValidationError(req);

    if (errors.length > 0) {
      throw new APIValidationError(errors);
    }

    const data = matchedData(req) as IQuestion;

    const response = await questionRepository.createQuestion(data);

    successResponse({
      res,
      statusCode: StatusCodes.CREATED,
      message: "question created successfully",
      data: response
    });
  }

  static async all(req: Request, res: Response) {
    const quizId = req.params.id;
    const response = await questionRepository.fetchAll(quizId);
    successResponse({
      res,
      statusCode: StatusCodes.OK,
      message: "questions returned successfully",
      data: response
    });
  }

  static async findOne(req: Request, res: Response) {
    const questionId = req.params.id;
    const response = await questionRepository.findOne(questionId);
    successResponse({
      res,
      statusCode: StatusCodes.OK,
      message: "Question returned successfully",
      data: response
    });
  }

  static async deleteQuestion(req: Request, res: Response) {
    const questionId = req.params.id;
    const response = await questionRepository.deleteQuestion(questionId);
    successResponse({
      res,
      statusCode: StatusCodes.OK,
      message: "deleted successfully",
      data: response
    });
  }

  static async update(req: Request, res: Response) {
    const questionId = req.params.id;

    const errors = parseValidationError(req);
    if (errors.length > 0) {
      throw new APIValidationError(errors);
    }

    const data = matchedData(req) as IQuestionUpdate;

    const response = await questionRepository.updateQuestion(questionId, data);

    successResponse({
      res,
      statusCode: StatusCodes.OK,
      message: "updated successfully",
      data: response
    });
  }
}

export default QuestionController;
