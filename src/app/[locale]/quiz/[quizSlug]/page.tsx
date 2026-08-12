import { notFound } from 'next/navigation';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { QuizDetailWrapper } from '@/components/quiz/QuizDetailWrapper';
import { prisma } from '@/lib/prisma';
import { translateQuestionData } from '@/lib/translator';

import { Clock } from 'lucide-react';
import Link from 'next/link';

export default async function QuizPage({
  params,
}: {
  params: { locale: string; quizSlug: string };
}) {
  const session = await getServerSession(authOptions);
  const userEmail = session?.user?.email || null;

  // 1. Fetch quiz directly from DB
  const quiz = await prisma.quiz.findFirst({
    where: { slug: params.quizSlug, isActive: true },
    include: {
      questions: true,
      translations: true,
    },
  });

  if (!quiz || !quiz.questions || quiz.questions.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-[#F8F9FA]">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 max-w-sm w-full flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
            <Clock className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Coming Soon</h2>
          <p className="text-sm text-gray-500 mb-6">
            There are no questions available for this quiz right now. Check back soon!
          </p>
          <Link
            href={`/${params.locale}/play`}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors text-center text-sm"
          >
            Back to Quizzes
          </Link>
        </div>
      </div>
    );
  }

  // 2. Prepare safe questions in target locale
  const safeQuestions = quiz.questions.map((q) => {
    let parsedOptions: string[] = [];
    try {
      parsedOptions = typeof q.options === 'string' ? JSON.parse(q.options) : q.options || [];
    } catch {
      parsedOptions = [];
    }
    const baseQ = {
      id: q.id,
      text: q.text,
      options: parsedOptions,
      explanation: q.explanation,
      correctOptionIndex: q.correctOptionIndex,
      difficulty: q.difficulty,
    };
    return translateQuestionData(baseQ, params.locale);
  });

  const quizTitle =
    quiz.translations?.[0]?.title ||
    quiz.slug
      .split('-')
      .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
      .join(' ');

  const quizData = {
    id: quiz.id,
    slug: quiz.slug,
    category: quiz.category,
    difficulty: quiz.difficulty || 'beginner',
    title: quizTitle,
    description: `Test your knowledge in ${quiz.category} with interactive questions.`,
    questions: safeQuestions,
  };

  // 3. Create attempt directly in DB
  const sessionId = crypto.randomUUID();
  const attempt = await prisma.attempt.create({
    data: {
      quizId: quiz.id,
      sessionId,
      email: userEmail,
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
