import { z } from "zod";

export const createQuizSessionSchema = z.object({
  quizId: z.string().min(1, "Quiz ID is required"),
  status: z.enum(["waiting", "started", "finished"]).default("waiting"),
  currentQuestionIndex: z.number().int().nonnegative().default(0),
  startTime: z.date().nullable().default(null),
  scheduledStartTime: z.date().nullable().optional(),
  createdByUserId: z.string().optional(),
});

export type CreateQuizSessionDTO = z.infer<typeof createQuizSessionSchema>;

export const joinQuizSessionSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
});

export type JoinQuizSessionDTO = z.infer<typeof joinQuizSessionSchema>;

export const sessionResponseSchema = z.object({
  id: z.string(),
  quizId: z.string(),
  status: z.enum(["waiting", "started", "finished"]),
  currentQuestionIndex: z.number().int().nonnegative(),
  scheduleStartTime: z.date().nullable(),
  createdByUserId: z.string().nullable(),
  createdAt: z.date(),
});

export type SessionResponseDTO = z.infer<typeof sessionResponseSchema>;
