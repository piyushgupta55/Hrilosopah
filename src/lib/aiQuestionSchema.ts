import { z } from 'zod';

export const AiQuestionSchema = z.object({
  text: z.string().min(1),
  options: z.array(z.string()).min(2),
  correctOptionIndex: z.number().int().min(0),
  explanation: z.string().optional(),
});

export type AiQuestion = z.infer<typeof AiQuestionSchema>;
