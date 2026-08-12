import React from 'react';
import { QuizRunner } from '@/components/quiz/QuizRunner';
import { prisma } from '@/lib/prisma';

const FALLBACK_QUIZZES: Record<string, any> = {
  'ai-awareness': {
    id: 'quiz-ai-awareness',
    slug: 'ai-awareness',
    questions: [
      {
        id: 'q1',
        text: 'What does AI stand for?',
        options: [
          'Automated Interface',
          'Artificial Intelligence',
          'Algorithmic Integration',
          'Advanced Iteration',
        ],
        difficulty: 'beginner',
      },
      {
        id: 'q2',
        text: 'Which neural network architecture introduced self-attention mechanism?',
        options: ['RNN', 'Transformer', 'CNN', 'LSTM'],
        difficulty: 'intermediate',
      },
    ],
  },
  'crypto-basics': {
    id: 'quiz-crypto-basics',
    slug: 'crypto-basics',
    questions: [
      {
        id: 'c1',
        text: 'Who published the Bitcoin whitepaper in 2008?',
        options: ['Vitalik Buterin', 'Satoshi Nakamoto', 'Gavin Wood', 'Hal Finney'],
        difficulty: 'beginner',
      },
      {
        id: 'c2',
        text: 'What is the hard-coded maximum supply limit of Bitcoin?',
        options: ['100 Million', '21 Million', 'Unlimited', '18 Million'],
        difficulty: 'beginner',
      },
    ],
  },
};

export default async function LocalizedEmbedQuizPage({
  params,
}: {
  params: { locale: string; quizSlug: string };
}) {
  let quizData = null;

  try {
    const quiz = await prisma.quiz.findFirst({
      where: { slug: params.quizSlug, isActive: true },
      include: {
        questions: {
          where: { status: 'approved' },
          orderBy: { order: 'asc' },
        },
      },
    });

    if (quiz) {
      const safeQuestions = quiz.questions.map((q) => {
        let parsedOptions = [];
        try {
          parsedOptions = typeof q.options === 'string' ? JSON.parse(q.options) : q.options || [];
        } catch {
          parsedOptions = [];
        }
        return {
          id: q.id,
          text: q.text,
          options: parsedOptions,
          difficulty: q.difficulty,
        };
      });

      quizData = {
        id: quiz.id,
        slug: quiz.slug,
        category: quiz.category,
        questions: safeQuestions,
      };
    }
  } catch (err) {
    console.error('Prisma query error in embed page:', err);
  }

  if (!quizData) {
    quizData = FALLBACK_QUIZZES[params.quizSlug] || FALLBACK_QUIZZES['ai-awareness'];
  }

  const attemptId = 'att_' + globalThis.crypto.randomUUID();

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col">
      <div className="flex-grow flex items-center justify-center">
        <QuizRunner quizSlug={quizData.slug} attemptId={attemptId} questions={quizData.questions} />
      </div>
    </main>
  );
}
