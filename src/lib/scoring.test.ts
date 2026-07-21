import { describe, it, expect } from 'vitest';
import { calculateScore } from './scoring';

describe('Scoring Logic', () => {
  it('should correctly calculate the score', () => {
    const questions = [
      { id: 'q1', correctOptionIndex: 1 },
      { id: 'q2', correctOptionIndex: 2 },
      { id: 'q3', correctOptionIndex: 0 },
    ];

    const answers = {
      q1: 1, // correct
      q2: 0, // incorrect
      q3: 0, // correct
    };

    const result = calculateScore(questions, answers);

    expect(result.score).toBe(2);
    expect(result.total).toBe(3);
  });
});
