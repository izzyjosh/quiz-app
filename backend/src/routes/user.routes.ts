import { Router } from "express";
import { userController } from "../controllers/user.controllers";
import { authMiddleware } from "../middlewares/authMiddleware";

export const userRouter = Router();

userRouter.get("/check-username/:username", (req, res, next) =>
  userController.checkUsername(req, res, next),
);

userRouter.get("/me", authMiddleware, (req, res, next) =>
  userController.getUser(req, res, next),
);
