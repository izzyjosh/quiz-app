import { StatusCodes } from "http-status-codes";

export default class APIError extends Error {
  status: string;

  constructor(
    public message: string,
    public statusCode: number,
    public errors: Array<unknown>,
  ) {
    super(message);

    this.statusCode = statusCode;
    this.status = "error";
    this.errors = errors;

    Error.captureStackTrace(this, this.constructor);
  }
}

export class BadRequestError extends APIError {
  constructor(message = "Bad Request", errors: Array<unknown> = []) {
    super(message, StatusCodes.BAD_REQUEST, errors);
  }
}

export class ValidationError extends APIError {
  constructor(message = "Validation failed", errors: Array<unknown> = []) {
    super(message, StatusCodes.UNPROCESSABLE_ENTITY, errors);
  }
}

export class NotFoundError extends APIError {
  constructor(message = "Not Found", errors: Array<unknown> = []) {
    super(message, StatusCodes.NOT_FOUND, errors);
  }
}

export class UnauthorizedError extends APIError {
  constructor(message = "Unauthorized", errors: Array<unknown> = []) {
    super(message, StatusCodes.UNAUTHORIZED, errors);
  }
}

export class ForbiddenError extends APIError {
  constructor(message = "Forbidden", errors: Array<unknown> = []) {
    super(message, StatusCodes.FORBIDDEN, errors);
  }
}
