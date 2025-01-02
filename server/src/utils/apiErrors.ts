import { StatusCodes } from "http-status-codes";

export default class APIError extends Error {
  constructor(
    public message: string,
    public statusCode: number
  ) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class APIValidationError extends APIError {
  constructor(public errors: { field: string; message: string }[]) {
    super("Validation Error", StatusCodes.UNPROCESSABLE_ENTITY);
    this.errors = errors;
    this.statusCode = StatusCodes.UNPROCESSABLE_ENTITY;
  }
}
