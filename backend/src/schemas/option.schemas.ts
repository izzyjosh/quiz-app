import { z } from "zod";

export const createOptionSchema = z.object({
  text: z.string().min(1, "Option text is required"),
  isCorrect: z.boolean().default(false),
});

export type CreateOptionDTO = z.infer<typeof createOptionSchema>;
