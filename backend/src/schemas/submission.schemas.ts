import { z } from "zod";

export const createSubmissionSchema = z.object({
  participantId: z.string().uuid("Invalid participant ID"),
  questionId: z.string().uuid("Invalid question ID"),
  selectedAnswerId: z.string().uuid("Invalid option ID").nullable(),
});

export type CreateSubmissionDTO = z.infer<typeof createSubmissionSchema>;

export const getSubmissionsSchema = z.object({
  participantId: z.string().uuid("Invalid participant ID"),
});

export type GetSubmissionsDTO = z.infer<typeof getSubmissionsSchema>;
