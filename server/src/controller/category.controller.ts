import { Request, Response } from "express";
import categoryRepository from "../services/category.services";
import { categoryValidator } from "../utils/validators";
import parseValidationError from "../utils/parseValidationError";
import APIError, { APIValidationError } from "../utils/apiErrors";
import { matchedData } from "express-validator";
import { StatusCodes } from "http-status-codes";

class CategoryController {
  static async create(req: Request, res: Response) {
    const errors = parseValidationError(req);
    if (errors.length > 0) {
      throw new APIValidationError(errors);
    }

    const data = matchedData(req);
    const response = await categoryRepository.create(data);

    successResponse({
      res,
      statusCode: StatusCodes.CREATED,
      message: "quizzes created successfully",
      data: response
    });
  }

  static async findOne(req: Request, res: Response) {
    const id = req.params.id;
    const response = await categoryRepository.findOne(id);
    successResponse({
      res,
      statusCode: StatusCodes.OK,
      message: "category returned successfully",
      data: response
    });
  }

  static async all(req: Request, res: Response) {
    const response = await categoryRepository.fetchAll();
    successResponse({
      res,
      statusCode: StatusCodes.OK,
      message: "categories returned successfully",
      data: response
    });
  }

  static async deleteCategory(re: Request, res: Response) {
    const id = req.params.id;
    const response = await categoryRepository.deleteCategory(id);

    successResponse({
      res,
      statusCode: StatusCodes.OK,
      message: "category deleted successfully",
      data: data
    });
  }
}


export default CategoryController