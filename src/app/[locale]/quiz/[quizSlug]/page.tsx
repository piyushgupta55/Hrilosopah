import { notFound } from 'next/navigation';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { QuizDetailWrapper } from '@/components/quiz/QuizDetailWrapper';
import { prisma } from '@/lib/prisma';

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
      <div className="min-h-screen flex items-center justify-center p-6 text-center">
        <div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">Quiz Questions Coming Soon</h2>
          <p className="text-sm text-slate-500">
            No questions have been published for this quiz yet.
          </p>
        </div>
      </div>
    );
  }

  // 2. Prepare safe questions
  const safeQuestions = quiz.questions.map((q) => {
    let parsedOptions: string[] = [];
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
