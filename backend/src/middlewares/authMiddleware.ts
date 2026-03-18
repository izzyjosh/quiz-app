import { NextFunction } from "express";
import { UnauthorizedError } from "../utils/api.errors";
import jwt from "jsonwebtoken";
import { config } from "../config/config";
import { z } from "zod";

// JWT Payload Schema
const JWTPayloadSchema = z.object({
  id: z.string(),
  email: z.string().email(),
});

type JWTPayload = z.infer<typeof JWTPayloadSchema>;

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
    const decode: JWTPayload = JWTPayloadSchema.parse(
      jwt.verify(token, config.jwt.secret),
    );
    req.user = decode;
    next();
  } catch (error) {
    return next(new UnauthorizedError("Invalid token"));
  }
};
