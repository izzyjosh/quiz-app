import { Router } from "express";
import { userController } from "../controllers/user.controllers";

export const userRouter = Router();

userRouter.get("/check-username/:username", (req, res, next) =>
  userController.checkUsername(req, res, next),
);
