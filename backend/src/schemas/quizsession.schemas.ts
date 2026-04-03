import { z } from "zod";

export const createQuizSessionSchema = z.object({
  sessionName: z.string().min(1, "Session name is required"),
  quizId: z.string().min(1, "Quiz ID is required"),
  status: z.enum(["waiting", "started", "finished"]).default("waiting"),
  currentQuestionIndex: z.number().int().nonnegative().default(0),
  startTime: z.union([z.coerce.date(), z.null()]).default(null),
  scheduledStartTime: z.union([z.coerce.date(), z.null()]).optional(),
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
