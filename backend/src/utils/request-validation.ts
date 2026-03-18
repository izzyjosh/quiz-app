import { NextFunction, Request, Response } from "express";
import { ValidationError } from "../utils/api.errors";
import { ZodSchema } from "zod";

export const validateRequest =
  (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedData = schema.parse(req.body);
      (req as any).validatedBody = validatedData;
      next();
    } catch (err: any) {
      if (err?.issues) {
        // map Zod issues to a structured format
        const details = err.issues.map((issue: any) => ({
          path: issue.path.join("."), // e.g., 'email' or 'password'
          message: issue.message,
          code: issue.code, // optional, Zod error code
        }));

        next(new ValidationError("Invalid request data", details));
      } else {
        next(err);
      }
    }
  };
