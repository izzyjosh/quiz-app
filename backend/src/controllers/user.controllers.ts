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

  async getUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { id: userId } = (req as any).user;

      if (!userId) {
        return res.status(401).json(
          SuccessResponse({
            message: "Unauthorized",
            data: null,
          }),
        );
      }

      const user = await userService.getUserById(userId);

      if (!user) {
        return res.status(404).json(
          SuccessResponse({
            message: "User not found",
            data: null,
          }),
        );
      }

      res.status(200).json(
        SuccessResponse({
          message: "User fetched successfully",
          data: user,
        }),
      );
    } catch (error) {
      next(error);
    }
  }
}

export const userController = new UserController();
