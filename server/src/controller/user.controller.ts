import { Request, Response } from "express";
import { matchedData } from "express-validator";
import catchAsync from "../utils/catchAsync";
import parseValidationError from "../utils/parseValidationError";
import { APIValidationError } from "../utils/apiErrors";
import UserService from "../services/user.service";
import successResponse from "../utils/successResponse";
import { StatusCodes } from "http-status-codes";

export const createUser = catchAsync(async (req: Request, res: Response) => {
  const errors = parseValidationError(req);

  if (errors.length > 0) {
    throw new APIValidationError(errors);
  }

  const { email, password } = matchedData(req);
  const response = await UserService.createUser(email, password);

  return successResponse({
    res,
    statusCode: StatusCodes.CREATED,
    message: "User created successfully",
    data: response,
  });
});
