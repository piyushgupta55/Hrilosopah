import { z } from 'zod';

export const submitAnswersSchema = z.object({
  answers: z.record(z.string(), z.number()), // Record<questionId, selectedOptionIndex>
});

export const createAttemptSchema = z.object({
  quizId: z.string(),
});
