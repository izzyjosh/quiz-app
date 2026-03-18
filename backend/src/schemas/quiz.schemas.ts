import { z } from "zod";

export const createQuizSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  timeLimit: z.number().int().positive().default(10), // in seconds per question
});

export type CreateQuizDTO = z.infer<typeof createQuizSchema>;
