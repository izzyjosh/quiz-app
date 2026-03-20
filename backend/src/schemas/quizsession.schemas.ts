import { z } from "zod";

export const createQuizSessionSchema = z.object({
  quizId: z.string().min(1, "Quiz ID is required"),
  status: z.enum(["waiting", "started", "finished"]).default("waiting"),
  currentQuestionIndex: z.number().int().nonnegative().default(0),
  startTime: z.date().nullable().default(null),
  scheduledStartTime: z.date().nullable().optional(),
  createdByUserId: z.string().min(1, "Creator user ID is required"),
});

export type CreateQuizSessionDTO = z.infer<typeof createQuizSessionSchema>;

export const joinQuizSessionSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
});

export type JoinQuizSessionDTO = z.infer<typeof joinQuizSessionSchema>;
