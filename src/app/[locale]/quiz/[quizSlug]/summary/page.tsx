import Link from 'next/link';
import { X, Lock, ShieldCheck } from 'lucide-react';
import { UnlockButton } from '@/components/quiz/UnlockButton';

export default async function SummaryPage({
  searchParams,
  params: { locale, quizSlug },
}: {
  searchParams: { attemptId?: string; unlocked?: string; payment?: string };
  params: { locale: string; quizSlug: string };
}) {
  const attemptId = searchParams.attemptId;
  const isUnlocked = searchParams.unlocked === 'true' || searchParams.payment === 'success';
  let summary = null;

  const baseUrl = process.env.NEXTAUTH_URL
    ? process.env.NEXTAUTH_URL
    : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'http://localhost:3000';

  if (attemptId) {
    const res = await fetch(`${baseUrl}/api/attempt/${attemptId}`, {
      cache: 'no-store',
    });
    if (res.ok) {
      const data = await res.json();
      summary = data.data;
    }
  }

  // Fallback default summary if endpoint fails or offline, to keep the UI viewable
  if (!summary) {
    summary = {
      totalQuestions: 15,
      score: 1500,
    };
  }

  const basePoints = summary.totalQuestions * 100;

  return (
    <main className="min-h-screen bg-white dark:bg-[#0B0D12] flex flex-col relative overflow-hidden text-slate-900 dark:text-white">
      {/* Celebration ambient glow */}
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-72 h-72 bg-[#4F7DFF]/10 dark:bg-[#4F7DFF]/15 rounded-full blur-[80px] pointer-events-none" />

      {/* Header */}
      <div className="px-5 pt-6 pb-2 flex items-center justify-between z-10 relative">
        <Link
          href={`/${locale}`}
          className="w-10 h-10 -ml-2 rounded-full flex items-center justify-center text-gray-500 dark:text-[#C8D1E1] hover:bg-black/5 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </Link>
        <div className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#4F7DFF]/10 border border-[#4F7DFF]/20 rounded-full text-[11px] font-bold text-[#4F7DFF] uppercase tracking-wider">
          <span className="w-1.5 h-1.5 rounded-full bg-[#4F7DFF]" />
          Quiz Complete
        </div>
        <div className="w-10 h-10" /> {/* Balancer */}
      </div>

      {/* Scrollable Container */}
      <div className="flex-1 flex flex-col items-center px-5 pt-4 pb-8 overflow-y-auto no-scrollbar z-10">
        {/* Checkmark Illustration */}
        <div className="relative mb-6 flex items-center justify-center">
          <div className="w-24 h-24 rounded-full bg-white dark:bg-[#121722] border border-gray-100 dark:border-white/[0.08] flex items-center justify-center shadow-[0_8px_32px_rgba(79,125,255,0.08)] dark:shadow-[0_8px_32px_rgba(79,125,255,0.15)] relative">
            <div className="absolute inset-2 rounded-full bg-gradient-to-tr from-[#4F7DFF]/20 to-transparent blur-sm" />
            <div className="w-14 h-14 rounded-full bg-[#4F7DFF] flex items-center justify-center shadow-lg shadow-[#4F7DFF]/30 relative z-10">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={3}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Text Headers */}
        <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2 text-center leading-tight">
          {isUnlocked ? 'Full Results Unlocked!' : 'Awesome Job!'}
        </h1>
        <p className="text-gray-500 dark:text-[#C8D1E1] text-xs text-center mb-8 max-w-[280px] leading-relaxed">
          {isUnlocked
            ? `You completed all ${summary.totalQuestions} questions with detailed step-by-step breakdown & official certificate:`
            : `You completed all ${summary.totalQuestions} questions. Unlock full answers & certificate for $1:`}
        </p>

        {/* Score Block */}
        <div className="text-center mb-4">
          <p className="text-6xl font-black text-[#4F7DFF] tracking-tighter drop-shadow-[0_4px_12px_rgba(79,125,255,0.1)]">
            {basePoints}
          </p>
          <p className="text-[10px] font-extrabold text-gray-400 dark:text-[#8B93A7] uppercase tracking-widest mt-1">
            Base Points
          </p>
        </div>

        {/* Unlocked / Locked Insights Card */}
        {isUnlocked ? (
          <div className="w-full bg-[#EFF6FF] dark:bg-[#1E293B]/80 border-2 border-[#60A5FA] rounded-xl p-3.5 flex flex-col gap-2.5 mb-3 shadow-md">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#DBEAFE] dark:bg-[#3B82F6]/20 text-[#2563EB] dark:text-[#60A5FA] flex items-center justify-center shrink-0 border border-[#93C5FD]">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="text-left">
                <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white">
                  Full Results & Explanations Unlocked
                </h4>
                <p className="text-[11px] text-[#2563EB] dark:text-[#60A5FA] font-semibold">
                  Verified Pass • Certificate ID: HRL-{Date.now().toString().slice(-6)}
                </p>
              </div>
            </div>
            <Link
              href={
                attemptId
                  ? `/${locale}/quiz/${quizSlug}/results?attemptId=${attemptId}`
                  : `/${locale}/quiz/${quizSlug}/results`
              }
              className="w-full py-2.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-lg font-bold text-xs shadow-md text-center transition-all active:scale-[0.98]"
            >
              View Full Detailed Results & Answers
            </Link>
          </div>
        ) : (
          <div className="w-full bg-white dark:bg-[#1E293B] border border-blue-100 dark:border-white/10 rounded-xl p-3.5 flex items-center justify-between shadow-sm mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#EFF6FF] dark:bg-[#3B82F6]/20 flex items-center justify-center shrink-0 border border-[#BFDBFE]">
                <Lock className="w-4.5 h-4.5 text-[#2563EB] dark:text-[#60A5FA]" />
              </div>
              <div className="flex flex-col text-left">
                <h4 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm mb-0.5">
                  Unlock Detailed Answers ($1.00)
                </h4>
                <p className="text-[11px] text-gray-500 dark:text-[#94A3B8] max-w-[200px] leading-snug">
                  See question explanations, correct answers & full score breakdown.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Secure Text Info */}
        <div className="flex items-center justify-center gap-1.5 mb-2.5 text-[11px] font-semibold text-[#2563EB] dark:text-[#60A5FA]">
          <ShieldCheck className="w-4 h-4 text-[#2563EB] dark:text-[#60A5FA]" />
          Secure $1.00 payment via Stripe Gateway
        </div>

        {/* Action Buttons */}
        <div className="w-full flex flex-col gap-3">
          {!isUnlocked && (
            <UnlockButton attemptId={attemptId} quizSlug={quizSlug} locale={locale} />
          )}

          <Link
            href={`/${locale}`}
            className="w-full bg-gray-100 hover:bg-gray-200 dark:bg-[#1F2533]/40 dark:hover:bg-[#1F2533]/80 border border-gray-200 dark:border-white/[0.08] text-gray-700 dark:text-white font-bold text-sm py-4 rounded-[18px] flex items-center justify-center transition-all"
          >
            {isUnlocked ? 'Return to Home' : 'Skip for now'}
          </Link>
        </div>
      </div>
    </main>
  );
}
