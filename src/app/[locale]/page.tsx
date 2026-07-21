import React from 'react';
import Link from 'next/link';
import { BottomNav } from '@/components/home/BottomNav';
import { Bell, ChevronRight, Check, Flame, Hexagon, Brain } from 'lucide-react';
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

  // Dynamically replace hardcoded greeting name in internationalized messages
  const greetingText = t('greeting').replace('Piyush', userName);

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
        <div className="w-full bg-gradient-to-r from-[#4F46E5] to-[#3B82F6] rounded-xl p-5 text-white shadow-lg shadow-blue-500/20 relative overflow-hidden">
          <div className="flex justify-between items-start mb-6 relative z-10">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Flame className="w-4 h-4 text-orange-400 fill-orange-400" />
                <h3 className="font-semibold text-lg">{t('streakDays', { days: 7 })}</h3>
              </div>
              <p className="text-blue-100 text-sm">{t('keepItUp')}</p>
            </div>
            {/* Hexagon for streak count */}
            <div className="relative flex items-center justify-center">
              <Hexagon
                className="w-[3.25rem] h-[3.25rem] text-white/40 fill-white/10"
                strokeWidth={1.5}
              />
              <span className="absolute text-2xl font-bold text-white">7</span>
            </div>
          </div>

          <div className="flex justify-between items-center relative z-10 px-1">
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center shadow-sm">
                  <Check className="w-3.5 h-3.5 text-blue-600 stroke-[3]" />
                </div>
                <span className="text-[10px] text-blue-100 font-medium">{day}</span>
              </div>
            ))}
          </div>

          {/* Decorative elements */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-2xl"></div>
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-blue-400/20 rounded-full blur-xl"></div>
        </div>
      </div>

      {/* Continue Learning */}
      <div className="px-5 w-full mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-900 text-lg">{t('continueLearning')}</h3>
          <button className="text-blue-600 text-sm font-semibold hover:text-blue-700">
            {t('seeAll')}
          </button>
        </div>

        <Link href={`/${locale}/quiz/ai-awareness`} className="block">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className="w-14 h-14 rounded-[14px] bg-[#EEF2FF] flex items-center justify-center shrink-0">
              <Brain className="w-7 h-7 text-indigo-600" strokeWidth={1.5} />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-gray-900 text-base truncate mb-1">
                {tCards('aiAwareness')}
              </h4>
              <p className="text-gray-500 text-xs mb-2">{t('quizDesc')}</p>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-[#4F46E5] rounded-full" style={{ width: '60%' }}></div>
                </div>
                <span className="text-xs font-semibold text-gray-600 w-8">60%</span>
              </div>
            </div>
            <div className="w-8 h-8 flex items-center justify-center text-gray-400 shrink-0">
              <ChevronRight className="w-5 h-5" />
            </div>
          </div>
        </Link>
      </div>

      {/* Recommended For You */}
      <div className="px-5 w-full mb-8">
        <h3 className="font-bold text-gray-900 text-lg mb-4">{t('recommended')}</h3>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <Link href={`/${locale}/quiz/ai-awareness`}>
            <div className="bg-white dark:bg-[#121722] rounded-[22px] p-5 shadow-sm border border-gray-100 dark:border-white/[0.06] flex flex-col items-center text-center h-full hover:shadow-md transition-all hover:-translate-y-0.5 duration-200 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-purple-500/10 to-transparent opacity-100"></div>

              <div className="w-full flex justify-start mb-2 relative z-10">
                <span className="px-2.5 py-1 bg-[#F3E8FF] dark:bg-[#8B5CF6]/20 text-[#7E22CE] dark:text-[#8B5CF6] text-[10px] font-bold rounded-full uppercase tracking-wider">
                  {tExplore('popular')}
                </span>
              </div>

              <div className="w-16 h-16 rounded-full bg-[#F3E8FF] dark:bg-[#8B5CF6]/15 flex items-center justify-center mb-4 mt-2 relative z-10">
                <Brain className="w-8 h-8 text-purple-600 dark:text-[#8B5CF6]" strokeWidth={1.5} />
              </div>

              <h4 className="font-bold text-gray-900 dark:text-white text-sm mb-1 relative z-10">
                {tCards('aiAwareness')}
              </h4>
              <p className="text-gray-400 dark:text-[#8B93A7] text-[11px] relative z-10">
                {t('quizDesc')}
              </p>
            </div>
          </Link>

          <Link href={`/${locale}/quiz/crypto-blockchain`}>
            <div className="bg-white dark:bg-[#121722] rounded-[22px] p-5 shadow-sm border border-gray-100 dark:border-white/[0.06] flex flex-col items-center text-center h-full hover:shadow-md transition-all hover:-translate-y-0.5 duration-200 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-blue-500/10 to-transparent opacity-100"></div>

              <div className="w-full flex justify-between items-start mb-2 relative z-10">
                <span className="px-2.5 py-1 bg-[#ECFDF5] dark:bg-[#22C55E]/20 text-[#059669] dark:text-[#22C55E] text-[10px] font-bold rounded-full uppercase tracking-wider">
                  {tExplore('newLabel')}
                </span>
                <span className="text-[#3B82F6] dark:text-[#4F7DFF] text-lg font-bold">₿</span>
              </div>

              <div className="w-16 h-16 rounded-full bg-[#E0F2FE] dark:bg-[#4F7DFF]/15 flex items-center justify-center mb-4 mt-2 relative z-10 text-3xl text-[#3B82F6] dark:text-[#4F7DFF] font-bold">
                ₿
              </div>

              <h4 className="font-bold text-gray-900 dark:text-white text-sm mb-1 relative z-10">
                {tCards('cryptoBasics')}
              </h4>
              <p className="text-gray-400 dark:text-[#8B93A7] text-[11px] relative z-10">
                {t('quizDesc')}
              </p>
            </div>
          </Link>
        </div>
      </div>

      {/* Your Progress */}
      <div className="px-5 w-full mb-6">
        <h3 className="font-bold text-gray-900 text-lg mb-4">{t('yourProgress')}</h3>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="grid grid-cols-2 min-[400px]:grid-cols-4 gap-y-4 min-[400px]:gap-y-0">
            <div className="flex flex-col items-center justify-center text-center px-1 border-r border-b min-[400px]:border-b-0 border-gray-100 pb-3 min-[400px]:pb-0">
              <span className="font-bold text-xl text-gray-900 mb-1">12</span>
              <span className="text-[10px] text-gray-500 font-medium">{t('quizzesTaken')}</span>
            </div>
            <div className="flex flex-col items-center justify-center text-center px-1 border-b min-[400px]:border-b-0 min-[400px]:border-r border-gray-100 pb-3 min-[400px]:pb-0">
              <span className="font-bold text-xl text-gray-900 mb-1">85%</span>
              <span className="text-[10px] text-gray-500 font-medium">{t('avgScore')}</span>
            </div>
            <div className="flex flex-col items-center justify-center text-center px-1 border-r border-gray-100 pt-1 min-[400px]:pt-0">
              <span className="font-bold text-xl text-gray-900 mb-1 whitespace-nowrap">3h 20m</span>
              <span className="text-[10px] text-gray-500 font-medium">{t('timeSpent')}</span>
            </div>
            <div className="flex flex-col items-center justify-center text-center px-1 pt-1 min-[400px]:pt-0">
              <span className="font-bold text-xl text-gray-900 mb-1">7</span>
              <span className="text-[10px] text-gray-500 font-medium">{t('dayStreak')}</span>
            </div>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
