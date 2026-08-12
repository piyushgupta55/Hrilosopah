import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Default XP formula values
const DEFAULT_XP_CONFIG = {
  id: 'global',
  baseXpPerCorrect: 10,
  speedBonusMultiplier: 1.5,
  accuracyBonus100: 50,
  streakMultiplierPerDay: 1.1,
  streakCapDays: 30,
  dailyChallengeBonusXp: 100,
};

// Default seed achievements if table is fresh
const DEFAULT_ACHIEVEMENTS = [
  {
    name: 'Early Bird',
    description: 'Completed a quiz before 9 AM',
    icon: '🌅',
    conditionType: 'quiz_count',
    thresholdValue: 1,
    isActive: true,
  },
  {
    name: 'Streak Master',
    description: 'Maintained a active 7-day learning streak',
    icon: '🔥',
    conditionType: 'streak_length',
    thresholdValue: 7,
    isActive: true,
  },
  {
    name: 'Quiz Rookie',
    description: 'Completed your first 10 quizzes',
    icon: '🎯',
    conditionType: 'quiz_count',
    thresholdValue: 10,
    isActive: true,
  },
  {
    name: 'AI Specialist',
    description: 'Scored 100% accuracy on 5 AI category quizzes',
    icon: '🤖',
    conditionType: 'category_mastery',
    thresholdValue: 5,
    isActive: true,
  },
];

export async function GET() {
  try {
    // 1. Fetch or initialize XP Config
    let xpConfig = await prisma.xpConfig.findUnique({
      where: { id: 'global' },
    });

    if (!xpConfig) {
      xpConfig = await prisma.xpConfig.create({
        data: DEFAULT_XP_CONFIG,
      });
    }

    // 2. Fetch or seed Achievements
    let achievements = await prisma.achievement.findMany({
      orderBy: { createdAt: 'desc' },
    });

    if (achievements.length === 0) {
      await prisma.achievement.createMany({
        data: DEFAULT_ACHIEVEMENTS,
      });
      achievements = await prisma.achievement.findMany({
        orderBy: { createdAt: 'desc' },
      });
    }

    return NextResponse.json({
      success: true,
      xpConfig,
      achievements,
    });
  } catch (error: any) {
    console.error('Error fetching gamification data:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to fetch gamification rules.' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, achievement, xpConfig } = body;

    // Save/Update XP Rules
    if (action === 'save_xp_config' || xpConfig) {
      const payload = xpConfig || body;
      const updatedConfig = await prisma.xpConfig.upsert({
        where: { id: 'global' },
        update: {
          baseXpPerCorrect: Number(payload.baseXpPerCorrect ?? 10),
          speedBonusMultiplier: Number(payload.speedBonusMultiplier ?? 1.5),
          accuracyBonus100: Number(payload.accuracyBonus100 ?? 50),
          streakMultiplierPerDay: Number(payload.streakMultiplierPerDay ?? 1.1),
          streakCapDays: Number(payload.streakCapDays ?? 30),
          dailyChallengeBonusXp: Number(payload.dailyChallengeBonusXp ?? 100),
        },
        create: {
          id: 'global',
          baseXpPerCorrect: Number(payload.baseXpPerCorrect ?? 10),
          speedBonusMultiplier: Number(payload.speedBonusMultiplier ?? 1.5),
          accuracyBonus100: Number(payload.accuracyBonus100 ?? 50),
          streakMultiplierPerDay: Number(payload.streakMultiplierPerDay ?? 1.1),
          streakCapDays: Number(payload.streakCapDays ?? 30),
          dailyChallengeBonusXp: Number(payload.dailyChallengeBonusXp ?? 100),
        },
      });

      return NextResponse.json({ success: true, xpConfig: updatedConfig });
    }

    // Reset XP Rules to default
    if (action === 'reset_xp_config') {
      const resetConfig = await prisma.xpConfig.upsert({
        where: { id: 'global' },
        update: DEFAULT_XP_CONFIG,
        create: DEFAULT_XP_CONFIG,
      });

      return NextResponse.json({ success: true, xpConfig: resetConfig });
    }

    // Create new Achievement
    if (action === 'create_achievement' || achievement) {
      const data = achievement || body;
      if (!data.name || !data.description) {
        return NextResponse.json({ error: 'Name and description are required.' }, { status: 400 });
      }

      const newAch = await prisma.achievement.create({
        data: {
          name: data.name.trim(),
          description: data.description.trim(),
          icon: data.icon || '🏆',
          conditionType: data.conditionType || 'quiz_count',
          thresholdValue: Number(data.thresholdValue || 1),
          isActive: data.isActive !== undefined ? Boolean(data.isActive) : true,
        },
      });

      return NextResponse.json({ success: true, achievement: newAch }, { status: 201 });
    }

    return NextResponse.json({ error: 'Invalid action.' }, { status: 400 });
  } catch (error: any) {
    console.error('Error saving gamification data:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to save gamification data.' },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, name, description, icon, conditionType, thresholdValue, isActive } = body;

    if (!id) {
      return NextResponse.json({ error: 'Achievement ID is required.' }, { status: 400 });
    }

    const updateData: any = {};
    if (name !== undefined) updateData.name = name.trim();
    if (description !== undefined) updateData.description = description.trim();
    if (icon !== undefined) updateData.icon = icon;
    if (conditionType !== undefined) updateData.conditionType = conditionType;
    if (thresholdValue !== undefined) updateData.thresholdValue = Number(thresholdValue);
    if (isActive !== undefined) updateData.isActive = Boolean(isActive);

    const updatedAch = await prisma.achievement.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ success: true, achievement: updatedAch });
  } catch (error: any) {
    console.error('Error updating achievement:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to update achievement.' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Achievement ID is required.' }, { status: 400 });
    }

    await prisma.achievement.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting achievement:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to delete achievement.' },
      { status: 500 }
    );
  }
}
