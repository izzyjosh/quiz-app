/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Request, Response, NextFunction } from "express";
import APIError from "../utils/api.errors";
import { StatusCodes } from "http-status-codes";
import errorCodes, { IErrorStatus } from "../utils/error-codes";

/**
 * Format validation errors (for example from class-validator or any manual validation)
 */
const handleValidationError = (err: any) => {
  if (!err.errors) return [];

  // Transform validation errors into a consistent format
  const errors = Object.values(err.errors).map((error: any) => ({
    type: "field",
    field: error.property || error.path,
    msg: error.message,
    location: "body",
  }));

  return errors;
};

export const RequestErrorHandler = (
  err: Error | APIError,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  let statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
  const status = "error";
  let message = "Something went wrong";
  let errors = undefined;

  // If it's a custom APIError
  if ("statusCode" in err) {
    statusCode = err.statusCode;
    message = err.message;
    errors = (err as APIError).errors;
  }
  // Handle generic validation errors (e.g., class-validator or custom)
  else if ((err as any).errors) {
    statusCode = StatusCodes.UNPROCESSABLE_ENTITY;
    message = "Validation Error";
    errors = handleValidationError(err);
  }

  // Send JSON error response
  res.status(statusCode).json({
    statusCode,
    status,
    error: {
      code: errorCodes[statusCode as IErrorStatus],
      message,
      ...(errors && { details: errors }),
      ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    },
  });
};

/**
 * 404 Not Found Handler
 */
export const NotFoundErrorHandler = (req: Request, res: Response) => {
  res.status(StatusCodes.NOT_FOUND).json({
    statusCode: StatusCodes.NOT_FOUND,
    status: "error",
    error: {
      code: errorCodes[StatusCodes.NOT_FOUND],
      message: "Not found",
    },
  });
};
