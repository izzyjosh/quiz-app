import { NextFunction, Request, Response } from "express";
import { SuccessResponse } from "../utils/responses";
import { userService } from "../services/user.services";

class UserController {
  async checkUsername(req: Request, res: Response, next: NextFunction) {
    try {
      const { username } = req.params as { username: string };
      const exists = await userService.checkUsernameExists(username);

      res.status(200).json(
        SuccessResponse({
          message: "Username availability checked successfully",
          data: { exists },
        }),
      );
    } catch (error) {
      next(error);
    }
  }
}

export const userController = new UserController();
