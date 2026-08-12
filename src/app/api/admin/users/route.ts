import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    // Single user detail endpoint
    if (id) {
      const user = await prisma.user.findUnique({
        where: { id },
        include: {
          attempts: {
            include: {
              quiz: {
                include: {
                  translations: true,
                },
              },
            },
            orderBy: { startedAt: 'desc' },
          },
        },
      });

      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      const totalAttempts = user.attempts.length;
      let totalCorrect = 0;
      let totalQuestionsAttempted = 0;
      let totalTimeSeconds = 0;

      user.attempts.forEach((att) => {
        if (att.score !== null) totalCorrect += att.score;
        if (att.totalQuestions !== null) totalQuestionsAttempted += att.totalQuestions;

        if (att.startedAt && att.completedAt) {
          const diff = Math.max(
            0,
            Math.floor(
              (new Date(att.completedAt).getTime() - new Date(att.startedAt).getTime()) / 1000
            )
          );
          totalTimeSeconds += diff;
        }
      });

      const accuracyPct =
        totalQuestionsAttempted > 0
          ? Math.round((totalCorrect / totalQuestionsAttempted) * 100)
          : 0;

      // Mock or computed badges based on milestones
      const badges = [];
      if (totalAttempts >= 1)
        badges.push({
          id: 'b1',
          name: 'First Step',
          icon: '🎯',
          description: 'Completed 1st quiz',
        });
      if (user.currentStreak >= 3)
        badges.push({
          id: 'b2',
          name: 'Streak Starter',
          icon: '🔥',
          description: '3-day streak achieved',
        });
      if (user.xp >= 100)
        badges.push({ id: 'b3', name: 'XP Novice', icon: '⚡', description: 'Earned 100+ XP' });
      if (accuracyPct >= 80 && totalAttempts >= 3)
        badges.push({
          id: 'b4',
          name: 'Sharpshooter',
          icon: '🏆',
          description: '80%+ Quiz Accuracy',
        });

      return NextResponse.json({
        success: true,
        user: {
          id: user.id,
          name: user.name || user.email.split('@')[0] || 'Learner',
          email: user.email,
          username: user.username || user.email.split('@')[0],
          phone: user.phone || 'N/A',
          createdAt: user.createdAt.toISOString(),
          updatedAt: user.updatedAt.toISOString(),
          status: user.status || 'Active',
          language: user.language || 'English',
          experience: user.experience || 'Beginner',
          goal: user.goal || 'General Learning',
          interests: user.interests || 'Tech & AI',
          currentStreak: user.currentStreak || 0,
          longestStreak: user.longestStreak || 0,
          xp: user.xp || 0,
          stats: {
            totalQuizzesCompleted: totalAttempts,
            accuracyPct,
            totalTimeSpentSeconds: totalTimeSeconds,
          },
          badges,
          recentAttempts: user.attempts.slice(0, 10).map((a) => {
            const enTrans = a.quiz.translations.find((t) => t.locale === 'en');
            return {
              id: a.id,
              quizTitle: enTrans?.title || a.quiz.slug.toUpperCase().replace(/-/g, ' '),
              quizSlug: a.quiz.slug,
              score: a.score ?? 0,
              totalQuestions: a.totalQuestions ?? 0,
              startedAt: a.startedAt.toISOString(),
              completedAt: a.completedAt ? a.completedAt.toISOString() : null,
            };
          }),
        },
      });
    }

    // List all users endpoint
    const rawUsers = await prisma.user.findMany({
      include: {
        _count: {
          select: { attempts: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const users = rawUsers.map((u) => ({
      id: u.id,
      email: u.email,
      name: u.name || u.email.split('@')[0] || 'Learner',
      createdAt: u.createdAt.toISOString(),
      currentStreak: u.currentStreak || 0,
      longestStreak: u.longestStreak || 0,
      xp: u.xp || 0,
      language: u.language || 'English',
      status: u.status || 'Active',
      attemptsCount: u._count?.attempts || 0,
    }));

    return NextResponse.json({ success: true, users });
  } catch (error: any) {
    console.error('Error fetching admin users:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to fetch users.' },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, action, status, streak } = body;

    if (!id) {
      return NextResponse.json({ error: 'User ID is required.' }, { status: 400 });
    }

    // Action: Reset streak
    if (action === 'reset_streak') {
      const updatedUser = await prisma.user.update({
        where: { id },
        data: { currentStreak: streak !== undefined ? Number(streak) : 0 },
      });
      return NextResponse.json({ success: true, user: updatedUser });
    }

    // Action: Toggle Status (Active / Suspended)
    if (action === 'update_status' || status) {
      const newStatus = status || 'Active';
      const updatedUser = await prisma.user.update({
        where: { id },
        data: { status: newStatus },
      });
      return NextResponse.json({ success: true, user: updatedUser });
    }

    return NextResponse.json({ error: 'Invalid action parameter.' }, { status: 400 });
  } catch (error: any) {
    console.error('Error updating admin user:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to update user.' },
      { status: 500 }
    );
  }
}
