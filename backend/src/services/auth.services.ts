// src/services/auth.service.ts
import { AppDataSource } from "../config/datasource";
import { User } from "../models/user.model";
import { hashPassword, createToken, comparePassword } from "../utils/auth";
import { BadRequestError } from "../utils/api.errors";
import { LoginInput, SignupInput } from "../schemas/auth.schemas";

class AuthService {
  private userRepo = AppDataSource.getRepository(User);

  async register(data: SignupInput) {
    const { username, email, password } = data;
    // Check if user already exists
    const existing = await this.userRepo.findOneBy({ email });
    if (existing) throw new BadRequestError("Email already in use");

    // Hash password
    const hashed = await hashPassword(password);

    const user = this.userRepo.create({ username, email, password: hashed });
    await this.userRepo.save(user);

    // Generate JWT
    const token = createToken(user);
    const { password: _, ...userData } = user; // Exclude password
    return { token, user: userData };
  }

  async login(data: LoginInput) {
    const { email, password } = data;
    const user = await this.userRepo.findOneBy({ email });
    if (!user) throw new BadRequestError("Invalid credentials");

    const isValid = await comparePassword(password, user.password);
    if (!isValid) throw new BadRequestError("Invalid credentials");

    const token = createToken(user);
    const { password: _, ...userData } = user;
    return { token, user: userData };
  }
}

export const authService = new AuthService();
