type Question = {
  id: string;
  correctOptionIndex: number;
};

export function calculateScore(
  questions: Question[],
  answers: Record<string, number | string>
): { score: number; total: number } {
  let score = 0;
  for (const q of questions) {
    const ans = answers[q.id];
    if (ans !== undefined && ans !== null && Number(ans) === Number(q.correctOptionIndex)) {
      score += 1;
    }
  }
  return { score, total: questions.length };
}
