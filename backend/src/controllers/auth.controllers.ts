import { NextFunction, Request, Response } from "express";
import { SignupInput } from "../schemas/auth.schemas";
import { authService } from "../services/auth.services";
import { SuccessResponse } from "../utils/responses";
import { setAuthCookies, clearAuthCookies } from "../utils/cookies";
import { BadRequestError } from "../utils/api.errors";

export class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const body: SignupInput = (req as any).validatedBody;

      const response = await authService.register(body);

      setAuthCookies(res, response.accessToken, response.refreshToken);

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

      setAuthCookies(res, response.accessToken, response.refreshToken);

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

  async refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.cookies.refreshToken;
      if (!token) throw new BadRequestError("No refresh token provided");

      const response = await authService.refreshToken(token);
      setAuthCookies(res, response.accessToken, response.refreshToken);

      res.status(200).json(
        SuccessResponse({
          message: "Access token refreshed successfully",
          data: response,
        }),
      );
    } catch (error) {
      next(error);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const refreshToken = req.cookies.refreshToken as string | undefined;
      await authService.logout(refreshToken);

      clearAuthCookies(res);
      res.status(200).json(
        SuccessResponse({
          message: "User logged out successfully",
        }),
      );
    } catch (error) {
      next(error);
    }
  }
}
