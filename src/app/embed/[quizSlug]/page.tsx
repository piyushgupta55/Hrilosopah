import { notFound } from 'next/navigation';
import { QuizRunner } from '@/components/quiz/QuizRunner';

const getBaseUrl = () => {
  if (process.env.NEXTAUTH_URL) return process.env.NEXTAUTH_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return 'http://localhost:3000';
};

async function startQuizAttempt(quizId: string) {
  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}/api/attempt`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ quizId }),
    cache: 'no-store',
  });

  if (!res.ok) return null;
  const data = await res.json();
  return data.data;
}

export default async function EmbedQuizPage({ params }: { params: { quizSlug: string } }) {
  // Fetch quiz metadata and questions
  const baseUrl = getBaseUrl();
  const quizRes = await fetch(`${baseUrl}/api/quiz/${params.quizSlug}`, {
    cache: 'no-store',
  });

  if (!quizRes.ok) {
    notFound();
  }

  const { data: quizData } = await quizRes.json();

  if (!quizData || !quizData.questions || quizData.questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>No questions available for this quiz.</p>
      </div>
    );
  }

  // Create an attempt on load
  const attempt = await startQuizAttempt(quizData.id);

  if (!attempt) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Failed to start quiz attempt. Please try again.</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col">
      <div className="flex-grow flex items-center justify-center">
        <QuizRunner
          quizSlug={quizData.slug}
          attemptId={attempt.id}
          questions={quizData.questions}
        />
      </div>
    </main>
  );
}
