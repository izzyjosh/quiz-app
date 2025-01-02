import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import APIError, { APIValidationError } from "../utils/apiErrors";

export const NotFoundErrorMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(StatusCodes.NOT_FOUND).json({
    message: "Not found",
    status: StatusCodes.NOT_FOUND
  });
};

export const ServerErrorMiddleware = (
  err: Error | APIError | APIValidationError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  res
    .status(
      err instanceof APIError
        ? err.statusCode
        : StatusCodes.INTERNAL_SERVER_ERROR
    )
    .json({
      statusCode:
        err instanceof APIError
          ? err.statusCode
          : StatusCodes.INTERNAL_SERVER_ERROR,
      message: err.message,
      errors: err instanceof APIValidationError ? err.errors : [],
    });
};
