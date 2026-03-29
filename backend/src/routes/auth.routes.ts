import { NextFunction, Request, Router } from "express";
import { AuthController } from "../controllers/auth.controllers";
import { validateRequest } from "../utils/request-validation";
import { loginSchema, signupSchema } from "../schemas/auth.schemas";

export const authRouter = Router();
const authController = new AuthController();

authRouter.post("/register", validateRequest(signupSchema), (req, res, next) =>
  authController.register(req, res, next),
);

authRouter.post("/login", validateRequest(loginSchema), (req, res, next) =>
  authController.login(req, res, next),
);

authRouter.post("/refresh-token", (req, res, next) =>
  authController.refreshToken(req, res, next),
);

authRouter.post("/logout", (req, res, next) =>
  authController.logout(req, res, next),
);
