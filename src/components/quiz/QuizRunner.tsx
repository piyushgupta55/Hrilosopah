'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { QuestionCard } from './QuestionCard';
import { ProgressBar } from './ProgressBar';
import { ArrowLeft, Bookmark, ArrowRight, List } from 'lucide-react';

type Question = {
  id: string;
  text: string;
  options: string[];
};

type QuizRunnerProps = {
  quizSlug: string;
  attemptId: string;
  questions: Question[];
};

export const QuizRunner = ({ quizSlug, attemptId, questions }: QuizRunnerProps) => {
  const t = useTranslations('Quiz');
  const router = useRouter();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentQuestion = questions[currentIndex];
  const isLastQuestion = currentIndex === questions.length - 1;
  const hasAnsweredCurrent = answers[currentQuestion.id] !== undefined;

  const handleSelectOption = (index: number) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: index }));
  };

  const score = Object.keys(answers).length * 100;

  const handleNext = () => {
    if (!hasAnsweredCurrent) return;
    if (!isLastQuestion) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handleSubmit = async () => {
    if (!hasAnsweredCurrent) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch(`/api/attempt/${attemptId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers }),
      });

      const data = await res.json();

      if (data.success) {
        router.push(`/en/quiz/${quizSlug}/summary?attemptId=${attemptId}`);
      } else {
        setError(data.error?.message || t('error'));
        setIsSubmitting(false);
      }
    } catch (err) {
      console.error(err);
      setError(t('error'));
      setIsSubmitting(false);
    }
  };

  if (!questions.length) return <div>No questions available</div>;

  return (
    <div className="min-h-screen w-full flex flex-col bg-[#F8F9FA] overflow-x-hidden">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full pt-6 pb-2 px-4 bg-[#F8F9FA]/90 backdrop-blur-md">
        <div className="max-w-2xl mx-auto w-full flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-700 shadow-sm border border-gray-100 hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <h1 className="font-bold text-gray-900 text-sm">
            {quizSlug === 'ai-awareness' ? 'AI Awareness Quiz' : 'Quiz'}
          </h1>

          <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-700 shadow-sm border border-gray-100 hover:bg-gray-50 transition-colors">
            <Bookmark className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Progress */}
      <div className="max-w-2xl mx-auto w-full mb-6 mt-4">
        <ProgressBar current={currentIndex + 1} total={questions.length} score={score} />
      </div>

      {/* Main scrollable content */}
      <main className="w-full max-w-2xl mx-auto flex-grow flex flex-col pb-32">
        <QuestionCard
          question={currentQuestion}
          selectedOptionIndex={answers[currentQuestion.id] ?? null}
          onSelectOption={handleSelectOption}
        />
      </main>

      {/* Sticky Footer for Actions */}
      <footer className="fixed bottom-0 left-0 w-full bg-[#F8F9FA]/90 backdrop-blur-xl border-t border-gray-200 p-5 z-50">
        <div className="max-w-2xl mx-auto w-full flex flex-col gap-3">
          {error && <span className="text-red-500 text-xs font-medium text-center">{error}</span>}

          {isLastQuestion ? (
            <button
              onClick={handleSubmit}
              disabled={!hasAnsweredCurrent || isSubmitting}
              className="w-full bg-[#4F46E5] hover:bg-indigo-700 text-white font-bold text-base py-3.5 rounded-xl shadow-[0_8px_16px_-4px_rgba(79,70,229,0.3)] flex items-center justify-center gap-2 transition-colors relative disabled:opacity-50"
            >
              {isSubmitting ? 'Submitting...' : t('submit')}
              {!isSubmitting && (
                <div className="absolute right-6">
                  <ArrowRight className="w-5 h-5" />
                </div>
              )}
            </button>
          ) : (
            <button
              onClick={handleNext}
              disabled={!hasAnsweredCurrent}
              className="w-full bg-[#4F46E5] hover:bg-indigo-700 text-white font-bold text-base py-3.5 rounded-xl shadow-[0_8px_16px_-4px_rgba(79,70,229,0.3)] flex items-center justify-center gap-2 transition-colors relative disabled:opacity-50 disabled:shadow-none"
            >
              Next Question
              <div className="absolute right-6">
                <ArrowRight className="w-5 h-5" />
              </div>
            </button>
          )}

          <div className="h-[env(safe-area-inset-bottom)]"></div>
        </div>
      </footer>
    </div>
  );
};
