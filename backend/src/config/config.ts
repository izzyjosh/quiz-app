import dotenv from "dotenv";
import { jwt, z } from "zod";

dotenv.config();

const envSchema = z.object({
  PORT: z.string().default("8000"),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),

  DATABASE_HOST: z.string().min(1),
  DATABASE_PORT: z.string().default("5432"),
  DATABASE_USERNAME: z.string().min(1),
  DATABASE_PASSWORD: z.string().min(1),
  DATABASE_NAME: z.string().min(1),
  JWT_SECRET: z.string().min(1),
});

const env = envSchema.parse(process.env);

export const config = {
  port: Number(env.PORT),
  nodeEnv: env.NODE_ENV,
  jwt: {
    secret: env.JWT_SECRET,
  },
  database: {
    host: env.DATABASE_HOST,
    port: Number(env.DATABASE_PORT),
    username: env.DATABASE_USERNAME,
    password: env.DATABASE_PASSWORD,
    name: env.DATABASE_NAME,
  },
  //jwtSecret: env.JWT_SECRET,
};
