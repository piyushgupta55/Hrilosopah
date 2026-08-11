import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({
        success: true,
        data: {
          completedCount: 0,
          streakDays: 0,
          timeSpentFormatted: '0m',
          accuracyPercentage: 0,
          totalQuestionsCorrect: 0,
          totalQuestionsAttempted: 0,
          totalPoints: 0,
          completedQuizzes: [],
        },
      });
    }

    const userEmail = session.user.email;
    const attempts = await prisma.attempt.findMany({
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
    });

    const completedCount = attempts.length;

    // Streak calculation
    let streakDays = 0;
    if (attempts.length > 0) {
      const dates = attempts
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

    // Time spent & score calculation
    let totalTimeSeconds = 0;
    let totalCorrect = 0;
    let totalQuestions = 0;

    const completedQuizzes = attempts.map((a) => {
      if (a.completedAt && a.startedAt) {
        const diff = Math.floor(
          (new Date(a.completedAt).getTime() - new Date(a.startedAt).getTime()) / 1000
        );
        if (diff > 0) totalTimeSeconds += diff;
      }

      const score = a.score || 0;
      const qTotal = a.totalQuestions || 15;
      totalCorrect += score;
      totalQuestions += qTotal;

      const accPct = Math.round((score / qTotal) * 100);
      const points = score * 100;

      const dateStr = a.completedAt
        ? new Date(a.completedAt).toLocaleDateString('en-US', {
            month: 'short',
            day: '2-digit',
            year: 'numeric',
          })
        : '';

      const durationSecs =
        a.completedAt && a.startedAt
          ? Math.max(1, Math.floor((new Date(a.completedAt).getTime() - new Date(a.startedAt).getTime()) / 1000))
          : 0;

      const durationStr =
        durationSecs >= 60
          ? `${Math.floor(durationSecs / 60)}m ${durationSecs % 60}s`
          : `${durationSecs}s`;

      return {
        id: a.id,
        title: a.quiz.slug.split('-').map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join(' '),
        category: a.quiz.category.toUpperCase(),
        date: dateStr,
        timeSpent: durationStr,
        score: `${accPct}%`,
        questionsCorrect: score,
        totalQuestions: qTotal,
        points,
        slug: a.quiz.slug,
      };
    });

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

    const accuracyPercentage = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
    const totalPoints = totalCorrect * 100;

    return NextResponse.json({
      success: true,
      data: {
        completedCount,
        streakDays,
        timeSpentFormatted,
        accuracyPercentage,
        totalQuestionsCorrect: totalCorrect,
        totalQuestionsAttempted: totalQuestions,
        totalPoints,
        completedQuizzes,
      },
    });
  } catch (error) {
    console.error('Error fetching user stats:', error);
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch user stats' } },
      { status: 500 }
    );
  }
}
