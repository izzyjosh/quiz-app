import { Router } from "express";
import { createUser, loginUser } from "../../controller/user.controller";
import { userValidator } from "../../utils/validators";

const authRouter = Router();

authRouter
  .post("/register", userValidator, createUser)
  .post("/login", userValidator, loginUser);

export default authRouter;
