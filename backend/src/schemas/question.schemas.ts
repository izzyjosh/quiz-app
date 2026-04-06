import { z } from "zod";

export const createQuestionSchema = z.object({
  text: z.string().min(1, "Question text is required"),
  order: z.number().int().positive().default(1),
  timeLimit: z.number().int().positive().default(30),
});

export type CreateQuestionDTO = z.infer<typeof createQuestionSchema>;
