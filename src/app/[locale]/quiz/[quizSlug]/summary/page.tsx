import { useTranslations } from 'next-intl';
import Link from 'next/link';
import {
  X,
  Lock,
  ArrowRight,
  ShieldCheck,
  BarChart2,
  Target,
  FileText,
  ChevronRight,
} from 'lucide-react';

export default async function SummaryPage({
  searchParams,
  params: { locale },
}: {
  searchParams: { attemptId?: string };
  params: { locale: string };
}) {
  const attemptId = searchParams.attemptId;
  let summary = null;

  if (attemptId) {
    const res = await fetch(
      `http://localhost:${process.env.PORT || 3000}/api/attempt/${attemptId}`,
      {
        cache: 'no-store',
      }
    );
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
          {/* Outer floating shapes */}
          <div className="absolute top-0 left-[-20px] text-yellow-500 dark:text-yellow-400 text-lg animate-pulse">
            ✦
          </div>
          <div className="absolute bottom-4 right-[-16px] text-purple-500 dark:text-purple-400 text-sm">
            ✦
          </div>
          <div className="absolute top-8 right-[-10px] text-emerald-500 dark:text-emerald-400 text-xs">
            ●
          </div>
          <div className="absolute bottom-2 left-[-12px] text-blue-500 dark:text-blue-400 text-xs">
            ■
          </div>

          {/* Centered Check Circle with Glow */}
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
          Awesome Job!
        </h1>
        <p className="text-gray-500 dark:text-[#C8D1E1] text-xs text-center mb-8 max-w-[280px] leading-relaxed">
          You completed all {summary.totalQuestions} questions. You&apos;ve earned a base score of:
        </p>

        {/* Score Block */}
        <div className="text-center mb-8">
          <p className="text-7xl font-black text-[#4F7DFF] tracking-tighter drop-shadow-[0_4px_12px_rgba(79,125,255,0.1)]">
            {basePoints}
          </p>
          <p className="text-[10px] font-extrabold text-gray-400 dark:text-[#8B93A7] uppercase tracking-widest mt-2">
            Base Points
          </p>
        </div>

        {/* Locked Insights Card */}
        <div className="w-full bg-gray-50 dark:bg-[#1F2533] border border-gray-100 dark:border-white/[0.06] rounded-[22px] p-5 flex items-center justify-between shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 duration-200 cursor-pointer mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#4F7DFF]/10 flex items-center justify-center shrink-0 border border-[#4F7DFF]/15">
              <Lock className="w-5 h-5 text-[#4F7DFF]" />
            </div>
            <div className="flex flex-col text-left">
              <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-0.5">
                Unlock Insights
              </h4>
              <p className="text-[11px] text-gray-500 dark:text-[#8B93A7] max-w-[190px] leading-snug">
                See your detailed strengths and weaknesses with personalized recommendations.
              </p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400 dark:text-[#8B93A7] shrink-0" />
        </div>

        {/* Secure Text Info */}
        <div className="flex items-center justify-center gap-1.5 mb-4 text-[11px] font-semibold text-gray-500 dark:text-[#8B93A7]">
          <ShieldCheck className="w-4 h-4 text-[#22C55E]" />
          Secure one-time payment via Stripe
        </div>

        {/* Action Buttons */}
        <div className="w-full flex flex-col gap-3">
          <button className="w-full bg-[#4F7DFF] hover:bg-[#4F7DFF]/90 text-white font-bold text-sm py-4 rounded-[18px] shadow-lg shadow-[#4F7DFF]/25 flex items-center justify-center gap-2 active:scale-98 transition-all">
            <Lock className="w-4 h-4" />
            Unlock Full Results • $1
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>

          <Link
            href={`/${locale}`}
            className="w-full bg-gray-100 hover:bg-gray-200 dark:bg-[#1F2533]/40 dark:hover:bg-[#1F2533]/80 border border-gray-200 dark:border-white/[0.08] text-gray-700 dark:text-white font-bold text-sm py-4 rounded-[18px] flex items-center justify-center transition-all"
          >
            Skip for now
          </Link>
        </div>
      </div>
    </main>
  );
}
