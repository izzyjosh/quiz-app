import { NextFunction, Request, Response } from "express";
import { SignupInput } from "../schemas/auth.schemas";
import { authService } from "../services/auth.services";
import { success } from "zod";
import { SuccessResponse } from "../utils/responses";

export class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const body: SignupInput = (req as any).validatedBody;

      const response = await authService.register(body);
      res.status(201).json(
        SuccessResponse({
          message: "User registered successfully",
          data: response,
        }),
      );
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = (req as any).validatedBody;

      const response = await authService.login({ email, password });
      res.status(200).json(
        SuccessResponse({
          message: "User logged in successfully",
          data: response,
        }),
      );
    } catch (error) {
      next(error);
    }
  }
}
