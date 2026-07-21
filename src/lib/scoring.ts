type Question = {
  id: string;
  correctOptionIndex: number;
};

export function calculateScore(
  questions: Question[],
  answers: Record<string, number>
): { score: number; total: number } {
  let score = 0;
  for (const q of questions) {
    if (answers[q.id] === q.correctOptionIndex) {
      score += 1;
    }
  }
  return { score, total: questions.length };
}
