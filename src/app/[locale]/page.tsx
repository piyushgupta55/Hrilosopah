import React from 'react';
import Link from 'next/link';
import { BottomNav } from '@/components/home/BottomNav';
import { StreakCard } from '@/components/home/StreakCard';
import { Bell, ChevronRight, Check, Flame, Hexagon, Brain, Bitcoin, Play } from 'lucide-react';
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';

import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export default async function HomePage({ params: { locale } }: { params: { locale: string } }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect(`/${locale}/onboarding`);
  }

  const userEmail = session.user?.email || '';

  let dbUser = null;
  if (userEmail) {
    dbUser = await prisma.user.findUnique({
      where: { email: userEmail },
    });
  }

  const userName = dbUser?.name || userEmail.split('@')[0] || 'Learner';
  const userAvatarInitial = userName.charAt(0).toUpperCase();

  const t = await getTranslations('Home');
  const tExplore = await getTranslations('Explore');
  const tCards = await getTranslations('Cards');

  // Fetch real user attempts from database
  const userAttempts = userEmail
    ? await prisma.attempt.findMany({
        where: {
          email: userEmail,
          completedAt: { not: null },
        },
        include: {
          quiz: true,
        },
        orderBy: {
          completedAt: 'desc',
        },
      })
    : [];

  const quizzesTaken = userAttempts.length;

  // Real Streak Calculation
  let streakDays = 0;
  if (userAttempts.length > 0) {
    const dates = userAttempts
      .map((a) => (a.completedAt ? new Date(a.completedAt).toISOString().split('T')[0] : null))
      .filter((d): d is string => d !== null);

    const uniqueDates = Array.from(new Set(dates)).sort().reverse();

    if (uniqueDates.length > 0) {
      const todayStr = new Date().toISOString().split('T')[0];
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      if (uniqueDates[0] === todayStr || uniqueDates[0] === yesterdayStr) {
        let current = new Date(uniqueDates[0]);
        for (const dateStr of uniqueDates) {
          if (dateStr === current.toISOString().split('T')[0]) {
            streakDays++;
            current.setDate(current.getDate() - 1);
          } else {
            break;
          }
        }
      }
    }
  }

  // Real Time Spent & Accuracy Calculation
  let totalTimeSeconds = 0;
  let totalCorrect = 0;
  let totalQuestions = 0;

  for (const a of userAttempts) {
    if (a.completedAt && a.startedAt) {
      const diff = Math.floor(
        (new Date(a.completedAt).getTime() - new Date(a.startedAt).getTime()) / 1000
      );
      if (diff > 0) totalTimeSeconds += diff;
    }
    totalCorrect += a.score || 0;
    totalQuestions += a.totalQuestions || 15;
  }

  let timeSpentFormatted = '0m';
  if (totalTimeSeconds > 0) {
    const hours = Math.floor(totalTimeSeconds / 3600);
    const mins = Math.floor((totalTimeSeconds % 3600) / 60);
    if (hours > 0) {
      timeSpentFormatted = mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
    } else {
      timeSpentFormatted = `${mins > 0 ? mins : 1}m`;
    }
  }

  const avgScorePct = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

  // Latest attempt for Continue Learning section
  const latestAttempt = userAttempts[0] || null;
  const latestQuiz = latestAttempt ? latestAttempt.quiz : null;
  const latestScorePct =
    latestAttempt && latestAttempt.score !== null && latestAttempt.totalQuestions
      ? Math.round((latestAttempt.score / latestAttempt.totalQuestions) * 100)
      : 0;

  // Dynamically replace hardcoded greeting name in internationalized messages
  const greetingText = t('greeting').replace('Piyush', userName);

  const publishedQuizzes = await prisma.quiz.findMany({
    where: { isActive: true },
    include: { translations: true, questions: true },
    take: 6,
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div
      className="flex-1 w-full bg-[#F8F9FA] pt-4 flex flex-col overflow-y-auto overflow-x-hidden relative"
      style={{ paddingBottom: 'calc(5.5rem + env(safe-area-inset-bottom))' }}
    >
      {/* Header */}
      <div className="px-5 w-full flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-900 tracking-tight">Hrilosopah</h1>
        <div className="flex items-center gap-3">
          <Link
            href={`/${locale}/profile`}
            className="w-9 h-9 rounded-full bg-gray-200 overflow-hidden border-2 border-white shadow-sm hover:opacity-80 transition-opacity"
          >
            <div className="w-full h-full bg-blue-100 flex items-center justify-center text-sm font-bold text-blue-600">
              {userAvatarInitial}
            </div>
          </Link>
        </div>
      </div>

      {/* Greeting */}
      <div className="px-5 w-full mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-1">
          {greetingText}{' '}
          <span className="inline-block origin-bottom-right hover:animate-wave">👋</span>
        </h2>
        <p className="text-gray-500 text-sm">{t('letsLearn')}</p>
      </div>

      {/* Streak Card */}
      <div className="px-5 w-full mb-8">
        <StreakCard
          streakDays={streakDays}
          locale={locale}
          labels={{
            streakDays: t('streakDays', { days: streakDays }),
            keepItUp: streakDays > 0 ? t('keepItUp') : 'Start your streak today!',
          }}
        />
      </div>

      {/* Continue Learning */}
      <div className="px-5 w-full mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-900 text-lg">{t('continueLearning')}</h3>
          <Link
            href={`/${locale}/play`}
            className="text-blue-600 text-sm font-semibold hover:text-blue-700"
          >
            {t('seeAll')}
          </Link>
        </div>

        {latestQuiz ? (
          <Link href={`/${locale}/quiz/${latestQuiz.slug}`} className="block">
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 rounded-[14px] bg-[#EEF2FF] flex items-center justify-center shrink-0">
                {latestQuiz.category.toLowerCase() === 'crypto' ? (
                  <Bitcoin className="w-7 h-7 text-blue-600" strokeWidth={1.5} />
                ) : (
                  <Brain className="w-7 h-7 text-indigo-600" strokeWidth={1.5} />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-gray-900 text-base truncate mb-1">
                  {latestQuiz.slug
                    .split('-')
                    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
                    .join(' ')}
                </h4>
                <p className="text-gray-500 text-xs mb-2">{t('quizDesc')}</p>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#4F46E5] rounded-full"
                      style={{ width: `${latestScorePct}%` }}
                    ></div>
                  </div>
                  <span className="text-xs font-semibold text-gray-600 w-8">{latestScorePct}%</span>
                </div>
              </div>
              <div className="w-8 h-8 flex items-center justify-center text-gray-400 shrink-0">
                <ChevronRight className="w-5 h-5" />
              </div>
            </div>
          </Link>
        ) : publishedQuizzes.length > 0 ? (
          <Link href={`/${locale}/quiz/${publishedQuizzes[0].slug}`} className="block">
            <div className="bg-white rounded-xl p-4 shadow-sm border border-blue-100 flex items-center gap-4 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 rounded-[14px] bg-[#EEF2FF] flex items-center justify-center shrink-0">
                <Brain className="w-7 h-7 text-indigo-600" strokeWidth={1.5} />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-gray-900 text-base truncate mb-0.5">
                  {publishedQuizzes[0].translations?.[0]?.title || publishedQuizzes[0].slug}
                </h4>
                <p className="text-gray-500 text-xs">
                  Start your first quiz to begin tracking your progress!
                </p>
              </div>
              <div className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold shrink-0 flex items-center gap-1">
                <span>Start</span>
                <Play className="w-3 h-3 fill-white" />
              </div>
            </div>
          </Link>
        ) : null}
      </div>

      {/* Recommended For You */}
      <div className="px-5 w-full mb-8">
        <h3 className="font-bold text-gray-900 text-lg mb-4">{t('recommended')}</h3>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {publishedQuizzes.map((quiz, idx) => {
            const displayTitle =
              quiz.translations?.[0]?.title ||
              quiz.slug
                .split('-')
                .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
                .join(' ');

            return (
              <Link key={quiz.id} href={`/${locale}/quiz/${quiz.slug}`}>
                <div className="bg-white dark:bg-[#121722] rounded-[22px] p-5 shadow-sm border border-gray-100 dark:border-white/[0.06] flex flex-col items-center text-center h-full hover:shadow-md transition-all hover:-translate-y-0.5 duration-200 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-purple-500/10 to-transparent opacity-100"></div>

                  <div className="w-full flex justify-start mb-2 relative z-10">
                    <span className="px-2.5 py-1 bg-[#F3E8FF] dark:bg-[#8B5CF6]/20 text-[#7E22CE] dark:text-[#8B5CF6] text-[10px] font-bold rounded-full uppercase tracking-wider">
                      {idx === 0 ? tExplore('popular') : tExplore('newLabel')}
                    </span>
                  </div>

                  <div className="w-16 h-16 rounded-full bg-[#F3E8FF] dark:bg-[#8B5CF6]/15 flex items-center justify-center mb-4 mt-2 relative z-10">
                    <Brain
                      className="w-8 h-8 text-purple-600 dark:text-[#8B5CF6]"
                      strokeWidth={1.5}
                    />
                  </div>

                  <h4 className="font-bold text-gray-900 dark:text-white text-sm mb-1 relative z-10 line-clamp-2">
                    {displayTitle}
                  </h4>
                  <p className="text-gray-400 dark:text-[#8B93A7] text-[11px] relative z-10">
                    {quiz.questions?.length || 10} Questions
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Your Progress */}
      <div className="px-5 w-full mb-6">
        <h3 className="font-bold text-gray-900 text-lg mb-4">{t('yourProgress')}</h3>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="grid grid-cols-2 min-[400px]:grid-cols-4 gap-y-4 min-[400px]:gap-y-0">
            <div className="flex flex-col items-center justify-center text-center px-1 border-r border-b min-[400px]:border-b-0 border-gray-100 pb-3 min-[400px]:pb-0">
              <span className="font-bold text-xl text-gray-900 mb-1">{quizzesTaken}</span>
              <span className="text-[10px] text-gray-500 font-medium">{t('quizzesTaken')}</span>
            </div>
            <div className="flex flex-col items-center justify-center text-center px-1 border-b min-[400px]:border-b-0 min-[400px]:border-r border-gray-100 pb-3 min-[400px]:pb-0">
              <span className="font-bold text-xl text-gray-900 mb-1">{avgScorePct}%</span>
              <span className="text-[10px] text-gray-500 font-medium">{t('avgScore')}</span>
            </div>
            <div className="flex flex-col items-center justify-center text-center px-1 border-r border-gray-100 pt-1 min-[400px]:pt-0">
              <span className="font-bold text-xl text-gray-900 mb-1 whitespace-nowrap">
                {timeSpentFormatted}
              </span>
              <span className="text-[10px] text-gray-500 font-medium">{t('timeSpent')}</span>
            </div>
            <div className="flex flex-col items-center justify-center text-center px-1 pt-1 min-[400px]:pt-0">
              <span className="font-bold text-xl text-gray-900 mb-1">{streakDays}</span>
              <span className="text-[10px] text-gray-500 font-medium">{t('dayStreak')}</span>
            </div>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
