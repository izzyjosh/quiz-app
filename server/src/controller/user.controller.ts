import { Request, Response } from "express";
import { matchedData } from "express-validator";
import catchAsync from "../utils/catchAsync";
import parseValidationError from "../utils/parseValidationError";
import APIError, { APIValidationError } from "../utils/apiErrors";
import userService from "../services/user.service";
import successResponse from "../utils/successResponse";
import { StatusCodes } from "http-status-codes";
import { config } from "dotenv";

config();

export const createUser = catchAsync(async (req: Request, res: Response) => {
  const errors = parseValidationError(req);

  if (errors.length > 0) {
    throw new APIValidationError(errors);
  }

  const { email, password, adminSecret } = matchedData(req);
  let role: "user" | "admin" = "user";

  if (adminSecret) {
    if (adminSecret !== process.env.ADMIN_SECRET) {
      throw new APIError("Invalid Admin secret key", 403);
    }
    role = "admin";
  }
  const response = await userService.createUser(email, password, role);

  return successResponse({
    res,
    statusCode: StatusCodes.CREATED,
    message: `${
      role.charAt(0).toUpperCase() + role.slice(1)
    } created successfully`,
    data: response
  });
});

export const loginUser = catchAsync(async (req: Request, res: Response) => {
  const errors = parseValidationError(req);

  if (errors.length > 0) {
    throw new APIValidationError(errors);
  }

  const { email, password } = matchedData(req);

  const response = await userService.loginUser(email, password);

  return successResponse({
    res,
    statusCode: StatusCodes.OK,
    message: "User logged in successfully",
    data: response
  });
});
