import { isContext } from "node:vm";
import { z } from "zod";

export const createQuizSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  timeLimit: z.number().int().positive().default(10), // in seconds per question
  category: z.string().min(1, "Category is required"),
  themeKey: z.string().min(1, "Theme key is required"),
  difficulty: z.enum(["EASY", "MEDIUM", "HARD"]).default("MEDIUM"),
  icon: z.string().min(1, "Icon is required"),
  accentColor: z.string().min(1, "Accent color is required"),
});

export type CreateQuizDTO = z.infer<typeof createQuizSchema>;
