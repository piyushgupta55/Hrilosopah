import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const FALLBACK_QUIZZES: Record<string, any> = {
  'ai-awareness': {
    id: 'quiz-ai-awareness',
    slug: 'ai-awareness',
    category: 'ai',
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
    category: 'crypto',
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

export async function GET(request: Request, { params }: { params: { quizSlug: string } }) {
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
          correctOptionIndex: typeof q.correctOptionIndex === 'number' ? q.correctOptionIndex : 0,
          explanation: q.explanation || null,
          difficulty: q.difficulty,
        };
      });

      return NextResponse.json({
        success: true,
        data: {
          id: quiz.id,
          slug: quiz.slug,
          category: quiz.category,
          questions: safeQuestions,
        },
      });
    }
  } catch (error) {
    console.error('Database unreachable, falling back to static quiz data:', error);
  }

  // Fallback to static quiz if DB is down or quiz not found
  const fallback = FALLBACK_QUIZZES[params.quizSlug] || FALLBACK_QUIZZES['ai-awareness'];
  return NextResponse.json({
    success: true,
    data: fallback,
  });
}
