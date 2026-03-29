import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { createHash, randomUUID } from "node:crypto";
import { config } from "../config/config";
import { z } from "zod";

const AccessTokenPayloadSchema = z.object({
  id: z.string(),
  tokenVersion: z.number(),
  type: z.literal("access"),
});

const RefreshTokenPayloadSchema = z.object({
  id: z.string(),
  tokenVersion: z.number(),
  type: z.literal("refresh"),
  jti: z.string(),
});

export type AccessTokenPayload = z.infer<typeof AccessTokenPayloadSchema>;
export type RefreshTokenPayload = z.infer<typeof RefreshTokenPayloadSchema>;

export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

export const comparePassword = async (
  password: string,
  hashedPassword: string,
): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};

export const hashToken = (token: string): string => {
  return createHash("sha256").update(token).digest("hex");
};

export const generateAccessToken = (userId: string, tokenVersion: number) => {
  const payload: AccessTokenPayload = {
    id: userId,
    tokenVersion,
    type: "access",
  };
  const token = jwt.sign(payload, config.jwt.secret, { expiresIn: "1h" });
  return token;
};

export const generateRefreshToken = (userId: string, tokenVersion: number) => {
  const payload: RefreshTokenPayload = {
    id: userId,
    tokenVersion,
    type: "refresh",
    jti: randomUUID(),
  };

  const token = jwt.sign(payload, config.jwt.secret, { expiresIn: "7d" });

  return { token, jti: payload.jti };
};

export const verifyAccessToken = (token: string): AccessTokenPayload => {
  const decoded = jwt.verify(token, config.jwt.secret);
  return AccessTokenPayloadSchema.parse(decoded);
};

export const verifyRefreshToken = (token: string): RefreshTokenPayload => {
  const decoded = jwt.verify(token, config.jwt.secret);
  return RefreshTokenPayloadSchema.parse(decoded);
};
