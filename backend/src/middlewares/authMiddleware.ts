import { NextFunction } from "express";
import { UnauthorizedError } from "../utils/api.errors";
import jwt from "jsonwebtoken";
import { config } from "../config/config";

export const authMiddleware = (req: any, res: any, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new UnauthorizedError("No token provided"));
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return next(new UnauthorizedError("Invalid token format"));
  }

  try {
    const decode: any = jwt.verify(token, config.jwt.secret);
    req.user = decode;
    next();
  } catch (error) {
    return next(new UnauthorizedError("Invalid token"));
  }
};
