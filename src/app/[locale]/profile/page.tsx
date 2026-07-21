import React from 'react';
import Link from 'next/link';
import { BottomNav } from '@/components/home/BottomNav';
import {
  Settings,
  Camera,
  Flame,
  Clock,
  CheckCircle2,
  Award,
  ChevronRight,
  FileText,
  Bookmark,
  Heart,
  Target,
  User,
  Brain,
} from 'lucide-react';
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';

import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export default async function ProfilePage({ params: { locale } }: { params: { locale: string } }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect(`/${locale}/login`);
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

  const t = await getTranslations('Profile');
  const tHome = await getTranslations('Home');
  const tProgress = await getTranslations('Progress');
  const tSettings = await getTranslations('Settings');
  const tCards = await getTranslations('Cards');

  return (
    <div
      className="flex-1 w-full bg-[#F8F9FA] flex flex-col overflow-y-auto overflow-x-hidden relative"
      style={{ paddingBottom: 'calc(5.5rem + env(safe-area-inset-bottom))' }}
    >
      {/* Header with Blue Gradient Background */}
      <div className="w-full bg-gradient-to-br from-[#4F46E5] to-[#3B82F6] pt-12 pb-24 px-5 relative rounded-b-[40px]">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex-1"></div>
          <div className="bg-white/20 backdrop-blur-md px-4 py-1 rounded-full text-white text-xs font-bold tracking-wider">
            {t('title').toUpperCase()}
          </div>
          <div className="flex-1 flex justify-end">
            <Link
              href={`/${locale}/settings`}
              className="w-10 h-10 flex items-center justify-center text-white hover:bg-white/10 rounded-full transition-colors"
            >
              <Settings className="w-6 h-6" />
            </Link>
          </div>
        </div>

        {/* Profile Info */}
        <div className="flex flex-col items-center">
          <div className="relative mb-3">
            <div className="w-24 h-24 rounded-full bg-white p-1 shadow-lg">
              <div className="w-full h-full rounded-full bg-blue-100 flex items-center justify-center overflow-hidden">
                {/* Fallback avatar */}
                <span className="text-4xl text-blue-600 font-bold">{userAvatarInitial}</span>
              </div>
            </div>
            <button className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md text-blue-600">
              <Camera className="w-4 h-4" />
            </button>
          </div>

          <h2 className="text-2xl font-bold text-white mb-1">{userName}</h2>
          <div className="flex items-center gap-1.5 text-blue-100 mb-4">
            <Award className="w-4 h-4" />
            <span className="text-sm font-medium">{t('knowledgeExplorer')}</span>
          </div>

          <button className="bg-white/20 backdrop-blur-md hover:bg-white/30 text-white px-6 py-2 rounded-full text-sm font-bold transition-colors border border-white/10 shadow-sm">
            {t('editProfile')}
          </button>
        </div>
      </div>

      {/* Floating Stats Card */}
      <div className="px-5 w-full -mt-14 relative z-10 mb-8">
        <div className="bg-white rounded-xl p-5 shadow-lg border border-gray-50 flex justify-between items-center">
          <div className="flex flex-col items-center flex-1">
            <CheckCircle2 className="w-5 h-5 text-blue-600 mb-2" />
            <span className="font-bold text-xl text-gray-900 mb-0.5">24</span>
            <span className="text-[10px] text-gray-500 font-medium text-center">
              {tProgress('quizzesCompleted')}
            </span>
          </div>
          <div className="w-[1px] h-12 bg-gray-100"></div>

          <div className="flex flex-col items-center flex-1">
            <CheckCircle2 className="w-5 h-5 text-green-500 mb-2" />
            <span className="font-bold text-xl text-gray-900 mb-0.5">218</span>
            <span className="text-[10px] text-gray-500 font-medium text-center">
              {tProgress('correctAnswers')}
            </span>
          </div>
          <div className="w-[1px] h-12 bg-gray-100"></div>

          <div className="flex flex-col items-center flex-1">
            <Flame className="w-5 h-5 text-orange-400 fill-orange-400 mb-2" />
            <span className="font-bold text-xl text-gray-900 mb-0.5">7</span>
            <span className="text-[10px] text-gray-500 font-medium text-center">
              {tHome('dayStreak')}
            </span>
          </div>
          <div className="w-[1px] h-12 bg-gray-100"></div>

          <div className="flex flex-col items-center flex-1">
            <Clock className="w-5 h-5 text-[#7E57C2] mb-2" />
            <span className="font-bold text-xl text-gray-900 mb-0.5">3h 20m</span>
            <span className="text-[10px] text-gray-500 font-medium text-center">
              {tHome('timeSpent')}
            </span>
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div className="w-full mb-8">
        <div className="px-5 flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-900 text-lg">{t('achievements')}</h3>
          <button className="text-blue-600 text-sm font-semibold hover:text-blue-700">
            {tHome('seeAll')}
          </button>
        </div>

        <div className="w-full overflow-x-auto no-scrollbar pl-5 pr-5 pb-2">
          <div className="flex items-center gap-4">
            {/* Achievement 1 */}
            <div className="w-[120px] bg-white border border-gray-100 rounded-xl p-4 flex flex-col items-center text-center shadow-sm shrink-0">
              <div className="w-16 h-16 rounded-full bg-[#F3E8FF] flex items-center justify-center mb-3">
                <Brain className="w-8 h-8 text-[#7E57C2]" strokeWidth={1.5} />
              </div>
              <h4 className="font-bold text-xs text-gray-900 mb-1">{tCards('aiRookie')}</h4>
              <p className="text-[10px] text-gray-500">{tCards('aiRookieDesc')}</p>
            </div>

            {/* Achievement 2 */}
            <div className="w-[120px] bg-white border border-gray-100 rounded-xl p-4 flex flex-col items-center text-center shadow-sm shrink-0">
              <div className="w-16 h-16 rounded-full bg-[#E0F2FE] flex items-center justify-center mb-3">
                <span className="text-3xl text-[#3B82F6] font-bold">₿</span>
              </div>
              <h4 className="font-bold text-xs text-gray-900 mb-1">{tCards('cryptoNovice')}</h4>
              <p className="text-[10px] text-gray-500">{tCards('cryptoNoviceDesc')}</p>
            </div>

            {/* Achievement 3 */}
            <div className="w-[120px] bg-white border border-gray-100 rounded-xl p-4 flex flex-col items-center text-center shadow-sm shrink-0">
              <div className="w-16 h-16 rounded-full bg-[#FEF3C7] flex items-center justify-center mb-3">
                <span className="text-3xl text-orange-500">🔥</span>
              </div>
              <h4 className="font-bold text-xs text-gray-900 mb-1">
                {tHome('streakDays', { days: 7 })}
              </h4>
              <p className="text-[10px] text-gray-500">{tCards('streak7DayDesc')}</p>
            </div>

            {/* Achievement 4 */}
            <div className="w-[120px] bg-white border border-gray-100 rounded-xl p-4 flex flex-col items-center text-center shadow-sm shrink-0">
              <div className="w-16 h-16 rounded-full bg-[#FEF08A] flex items-center justify-center mb-3">
                <span className="text-3xl">⭐</span>
              </div>
              <h4 className="font-bold text-xs text-gray-900 mb-1">{tCards('perfectScore')}</h4>
              <p className="text-[10px] text-gray-500">{tCards('perfectScoreDesc')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* List Links */}
      <div className="px-5 w-full mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <button className="w-full px-5 py-4 flex items-center justify-between border-b border-gray-50 hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-3">
              <Bookmark className="w-5 h-5 text-gray-500" />
              <span className="font-semibold text-sm text-gray-900">{t('savedQuizzes')}</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>

          <button className="w-full px-5 py-4 flex items-center justify-between border-b border-gray-50 hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-3">
              <Heart className="w-5 h-5 text-gray-500" />
              <span className="font-semibold text-sm text-gray-900">{t('favouriteTopics')}</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>

          <button className="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-3">
              <Target className="w-5 h-5 text-gray-500" />
              <span className="font-semibold text-sm text-gray-900">{t('learningGoals')}</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Account Section */}
      <div className="px-5 w-full mb-6">
        <h3 className="font-bold text-gray-900 text-lg mb-4">{tSettings('account')}</h3>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
          <Link
            href={`/${locale}/settings`}
            className="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-gray-500" />
              <span className="font-semibold text-sm text-gray-900">{t('accountSettings')}</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </Link>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
