import { notFound } from 'next/navigation';
import { QuizDetailWrapper } from '@/components/quiz/QuizDetailWrapper';
import { prisma } from '@/lib/prisma';

export default async function QuizPage({
  params,
}: {
  params: { locale: string; quizSlug: string };
}) {
  // 1. Fetch quiz directly from DB
  const quiz = await prisma.quiz.findFirst({
    where: { slug: params.quizSlug, isActive: true },
    include: {
      questions: {
        where: { status: 'approved' },
      },
    },
  });

  if (!quiz || !quiz.questions || quiz.questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>No questions available for this quiz.</p>
      </div>
    );
  }

  // 2. Prepare safe questions (same as API route)
  const shuffledQuestions = [...quiz.questions].sort(() => 0.5 - Math.random()).slice(0, 15);
  const safeQuestions = shuffledQuestions.map((q) => ({
    id: q.id,
    text: q.text,
    options: JSON.parse(q.options),
    difficulty: q.difficulty,
  }));

  const quizData = {
    id: quiz.id,
    slug: quiz.slug,
    category: quiz.category,
    // Add missing title/description if available (from translations) or fallback
    title: quiz.category === 'crypto' ? 'Crypto Basics' : 'AI Fundamentals',
    description:
      quiz.category === 'crypto'
        ? 'Master the core concepts of cryptocurrency and blockchain technology.'
        : "Learn the basic concepts of Artificial Intelligence and how it's shaping the future.",
    questions: safeQuestions,
  };

  // 3. Create attempt directly in DB
  const sessionId = crypto.randomUUID();
  const attempt = await prisma.attempt.create({
    data: {
      quizId: quiz.id,
      sessionId,
    },
  });

  if (!attempt) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Failed to start quiz attempt. Please try again.</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen flex flex-col bg-surface overflow-hidden">
      <QuizDetailWrapper quizData={quizData} attemptId={attempt.id} />
    </main>
  );
}
