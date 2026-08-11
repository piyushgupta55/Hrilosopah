import React from 'react';
import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { ProfilePageClient, AchievementItem } from '@/components/profile/ProfilePageClient';

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

  const completedCount = userAttempts.length;

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

  // Real Time Spent Calculation
  let totalTimeSeconds = 0;
  for (const a of userAttempts) {
    if (a.completedAt && a.startedAt) {
      const diff = Math.floor(
        (new Date(a.completedAt).getTime() - new Date(a.startedAt).getTime()) / 1000
      );
      if (diff > 0) totalTimeSeconds += diff;
    }
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

  // Real Achievements Evaluation
  const aiCount = userAttempts.filter(
    (a) => a.quiz?.category && a.quiz.category.toLowerCase() === 'ai'
  ).length;
  const cryptoCount = userAttempts.filter(
    (a) => a.quiz?.category && a.quiz.category.toLowerCase() === 'crypto'
  ).length;
  const perfectScores = userAttempts.filter(
    (a) => a.score !== null && a.totalQuestions !== null && a.score === a.totalQuestions
  ).length;

  const achievementsList: AchievementItem[] = [
    {
      id: 'ai-rookie',
      title: 'AI Rookie',
      desc: 'Completed 5 AI Quizzes',
      iconType: 'Brain',
      bg: 'bg-purple-100 text-purple-600',
      unlocked: aiCount >= 5,
    },
    {
      id: 'crypto-novice',
      title: 'Crypto Novice',
      desc: 'Completed 5 Crypto Quizzes',
      iconType: 'Bitcoin',
      bg: 'bg-amber-100 text-amber-600',
      unlocked: cryptoCount >= 5,
    },
    {
      id: '7-day-streak',
      title: '7 Day Streak',
      desc: 'Maintained 7 day streak',
      iconType: 'Flame',
      bg: 'bg-orange-100 text-orange-600',
      unlocked: streakDays >= 7,
    },
    {
      id: 'perfect-score',
      title: 'Perfect Score',
      desc: 'Scored 100% accuracy',
      iconType: 'Award',
      bg: 'bg-yellow-100 text-yellow-600',
      unlocked: perfectScores >= 1,
    },
    {
      id: 'ai-master',
      title: 'AI Master',
      desc: 'Complete 20 AI Quizzes',
      iconType: 'Brain',
      bg: 'bg-[#EFF6FF] text-[#2563EB]',
      unlocked: aiCount >= 20,
    },
    {
      id: 'blockchain-architect',
      title: 'Blockchain Architect',
      desc: 'Complete 20 Crypto Quizzes',
      iconType: 'Bitcoin',
      bg: 'bg-blue-100 text-blue-600',
      unlocked: cryptoCount >= 20,
    },
  ];

  // User interests
  let initialInterests: string[] = ['AI', 'Crypto'];
  if (dbUser?.interests) {
    try {
      const parsed = JSON.parse(dbUser.interests);
      if (Array.isArray(parsed) && parsed.length > 0) {
        initialInterests = parsed;
      } else if (typeof dbUser.interests === 'string' && dbUser.interests.length > 0) {
        initialInterests = dbUser.interests.split(',').map((s) => s.trim());
      }
    } catch {
      if (typeof dbUser.interests === 'string' && dbUser.interests.length > 0) {
        initialInterests = dbUser.interests.split(',').map((s) => s.trim());
      }
    }
  }

  const initialDailyTime = dbUser?.dailyTime || '15';

  return (
    <ProfilePageClient
      locale={locale}
      userName={userName}
      userEmail={userEmail}
      userAvatarInitial={userAvatarInitial}
      completedCount={completedCount}
      streakDays={streakDays}
      timeSpentFormatted={timeSpentFormatted}
      achievementsList={achievementsList}
      initialInterests={initialInterests}
      initialDailyTime={initialDailyTime}
    />
  );
}
