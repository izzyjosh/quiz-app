import { validationResult } from "express-validator";
import { Request } from "express";
import { IValidationError } from "../interfaces/validation.interface";

const parseValidationError = (req: Request) => {
  const result = validationResult(req);
  const errors = result.array() as IValidationError[];
  const parsedErrors = errors.map(({ msg: message, path: field }) => {
    return {
      field,
      message,
    };
  });

  return parsedErrors;
};

export default parseValidationError;
