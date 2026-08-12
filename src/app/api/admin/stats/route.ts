import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const now = new Date();

    // 1. Total registered users & New signups in last 7 days
    const totalUsers = await prisma.user.count();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const newSignups7Days = await prisma.user.count({
      where: {
        createdAt: { gte: sevenDaysAgo },
      },
    });

    // 2. Daily Active Users (attempts logged today) & Monthly Active Users (attempts in last 30 days)
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const dauAttempts = await prisma.attempt.groupBy({
      by: ['sessionId'],
      where: {
        startedAt: { gte: startOfToday },
      },
    });
    const dau = dauAttempts.length;

    const mauAttempts = await prisma.attempt.groupBy({
      by: ['sessionId'],
      where: {
        startedAt: { gte: thirtyDaysAgo },
      },
    });
    const mau = mauAttempts.length;

    // 3. Quizzes completed today & this week
    const completedToday = await prisma.attempt.count({
      where: {
        completedAt: { gte: startOfToday },
      },
    });
    const completedThisWeek = await prisma.attempt.count({
      where: {
        completedAt: { gte: sevenDaysAgo },
      },
    });

    // 4. Average current streak length across active users
    const streakAgg = await prisma.user.aggregate({
      _avg: { currentStreak: true },
      where: { status: 'Active' },
    });
    const avgStreak = streakAgg._avg.currentStreak
      ? Math.round(streakAgg._avg.currentStreak * 10) / 10
      : 0;

    // 5. Total published vs draft quizzes
    const publishedQuizzes = await prisma.quiz.count({
      where: { isActive: true },
    });
    const draftQuizzes = await prisma.quiz.count({
      where: { isActive: false },
    });

    // 6. Top 5 most-completed quizzes (title + completion count)
    const topQuizAttempts = await prisma.attempt.groupBy({
      by: ['quizId'],
      _count: { id: true },
      where: { completedAt: { not: null } },
      orderBy: { _count: { id: 'desc' } },
      take: 5,
    });

    const quizIds = topQuizAttempts.map((q) => q.quizId);
    const quizzesInfo = await prisma.quiz.findMany({
      where: { id: { in: quizIds } },
      include: { translations: true },
    });

    const topQuizzes = topQuizAttempts.map((item) => {
      const q = quizzesInfo.find((quiz) => quiz.id === item.quizId);
      const enTrans = q?.translations.find((t) => t.locale === 'en');
      return {
        quizId: item.quizId,
        title: enTrans?.title || q?.slug.toUpperCase().replace(/-/g, ' ') || 'Quiz',
        slug: q?.slug || '',
        completionsCount: item._count.id,
      };
    });

    // 7. Language usage breakdown (count of users per preferred language)
    const languageGroups = await prisma.user.groupBy({
      by: ['language'],
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
    });

    const languageBreakdown = languageGroups.map((g) => ({
      language: g.language || 'English',
      userCount: g._count.id,
    }));

    // 8. Quiz completions per day for the last 7 days
    const completionsPerDay: Array<{ dateLabel: string; count: number }> = [];
    for (let i = 6; i >= 0; i--) {
      const dayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
      const dayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i + 1);

      const count = await prisma.attempt.count({
        where: {
          completedAt: {
            gte: dayStart,
            lt: dayEnd,
          },
        },
      });

      const dateLabel = dayStart.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'numeric',
        day: 'numeric',
      });
      completionsPerDay.push({ dateLabel, count });
    }

    return NextResponse.json({
      success: true,
      stats: {
        totalUsers,
        newSignups7Days,
        dau,
        mau,
        completedToday,
        completedThisWeek,
        avgStreak,
        publishedQuizzes,
        draftQuizzes,
        topQuizzes,
        languageBreakdown,
        completionsPerDay,
      },
    });
  } catch (error: any) {
    console.error('Error computing admin stats:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to compute admin stats.' },
      { status: 500 }
    );
  }
}
