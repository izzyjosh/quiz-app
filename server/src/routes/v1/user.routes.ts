import { Router} from "express";
import { createUser } from "../../controller/user.controller";
import { userValidator } from "../../utils/validators"

const authRouter = Router();

authRouter.post("", userValidator, createUser);

export default authRouter;
