// src/services/auth.service.ts
import { AppDataSource } from "../config/datasource";
import { User } from "../models/user.model";
import {
  hashPassword,
  hashToken,
  generateAccessToken,
  generateRefreshToken,
  comparePassword,
  verifyRefreshToken,
} from "../utils/auth";
import { BadRequestError } from "../utils/api.errors";
import { LoginInput, SignupInput } from "../schemas/auth.schemas";
import { RefreshToken } from "../models/refreshToken.model";
import { MoreThan } from "typeorm/find-options/operator/MoreThan";

class AuthService {
  private userRepo = AppDataSource.getRepository(User);
  private tokenRepo = AppDataSource.getRepository(RefreshToken);

  private async saveRefreshToken(userId: string, token: string) {
    const tokenHash = hashToken(token);

    const tokenEntity = this.tokenRepo.create({
      userId,
      tokenHash,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    await this.tokenRepo.save(tokenEntity);
  }

  async register(data: SignupInput) {
    const { username, email, password, avatar } = data;
    // Check if user already exists
    const existing = await this.userRepo.findOneBy({ email });
    if (existing) throw new BadRequestError("Email already in use");

    // Hash password
    const hashed = await hashPassword(password);

    const user = this.userRepo.create({
      username,
      email,
      password: hashed,
      avatar,
    });
    await this.userRepo.save(user);

    // Generate JWT

    const accessToken = generateAccessToken(user.id, user.tokenVersion);
    const { token: refreshToken } = generateRefreshToken(
      user.id,
      user.tokenVersion,
    );
    await this.saveRefreshToken(user.id, refreshToken);
    const { password: _, ...userData } = user; // Exclude password
    return { accessToken, refreshToken, user: userData };
  }

  async login(data: LoginInput) {
    const { email, password } = data;
    const user = await this.userRepo.findOneBy({ email });
    if (!user) throw new BadRequestError("Invalid credentials");

    const isValid = await comparePassword(password, user.password);
    if (!isValid) throw new BadRequestError("Invalid credentials");

    const accessToken = generateAccessToken(user.id, user.tokenVersion);
    const { token: refreshToken } = generateRefreshToken(
      user.id,
      user.tokenVersion,
    );
    await this.saveRefreshToken(user.id, refreshToken);
    const { password: _, ...userData } = user; // Exclude password
    return { accessToken, refreshToken, user: userData };
  }

  async refreshToken(token: string) {
    let decodedToken: { id: string; tokenVersion: number; type: "refresh" };

    try {
      decodedToken = verifyRefreshToken(token);
    } catch (error) {
      throw new BadRequestError("Invalid or expired refresh token");
    }

    const userId = decodedToken.id;
    const tokenVersion = decodedToken.tokenVersion;
    if (!userId) {
      throw new BadRequestError("Invalid refresh token payload");
    }
    const user = await this.userRepo.findOneBy({ id: userId });
    if (!user) {
      throw new BadRequestError("User not found");
    }
    if (
      typeof tokenVersion !== "number" ||
      tokenVersion !== user.tokenVersion
    ) {
      throw new BadRequestError("Refresh token version is invalid");
    }

    const tokenHash = hashToken(token);
    const activeToken = await this.tokenRepo.findOneBy({
      tokenHash,
      userId,
      expiresAt: MoreThan(new Date()),
      isRevoked: false,
    });
    if (!activeToken) {
      throw new BadRequestError("Refresh token is invalid or expired");
    }

    await this.tokenRepo.update({ id: activeToken.id }, { isRevoked: true });

    const { token: newRefreshToken } = generateRefreshToken(
      userId,
      user.tokenVersion,
    );
    const accessToken = generateAccessToken(userId, user.tokenVersion);

    await this.saveRefreshToken(userId, newRefreshToken);

    return { accessToken, refreshToken: newRefreshToken };
  }

  async logout(refreshToken?: string) {
    if (!refreshToken) {
      return;
    }

    let decodedToken: { id: string; tokenVersion: number; type: "refresh" };

    try {
      decodedToken = verifyRefreshToken(refreshToken);
    } catch {
      return;
    }

    const userId = decodedToken.id;
    if (!userId) {
      return;
    }

    const user = await this.userRepo.findOneBy({ id: userId });
    if (!user) {
      return;
    }

    user.tokenVersion += 1;
    await this.userRepo.save(user);

    await this.tokenRepo.update(
      { userId, isRevoked: false },
      { isRevoked: true },
    );
  }

  async cleanupRefreshTokens() {
    const now = new Date();

    await this.tokenRepo
      .createQueryBuilder()
      .delete()
      .where("expiresAt < :now", { now })
      .orWhere("isRevoked = :isRevoked", { isRevoked: true })
      .execute();
  }
}

export const authService = new AuthService();
