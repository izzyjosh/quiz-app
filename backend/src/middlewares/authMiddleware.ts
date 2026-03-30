import { NextFunction } from "express";
import { UnauthorizedError } from "../utils/api.errors";
import { AppDataSource } from "../config/datasource";
import { User } from "../models/user.model";
import { verifyAccessToken } from "../utils/auth";

const userRepo = AppDataSource.getRepository(User);

export const authMiddleware = async (
  req: any,
  res: any,
  next: NextFunction,
) => {
  const token = req.cookies?.accessToken as string | undefined;

  if (!token) {
    return next(new UnauthorizedError("Invalid token"));
  }

  try {
    const decode = verifyAccessToken(token);

    const user = await userRepo.findOneBy({ id: decode.id });
    if (!user || user.tokenVersion !== decode.tokenVersion) {
      return next(new UnauthorizedError("Invalid token"));
    }

    req.user = decode;
    next();
  } catch (error) {
    return next(new UnauthorizedError("Invalid token"));
  }
};
