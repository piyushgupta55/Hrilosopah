import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request, { params }: { params: { attemptId: string } }) {
  try {
    const attempt = await prisma.attempt.findUnique({
      where: { id: params.attemptId },
      include: {
        quiz: {
          include: {
            questions: {
              orderBy: { order: 'asc' },
            },
            translations: true,
          },
        },
      },
    });

    if (!attempt) {
      return NextResponse.json({ error: 'Attempt not found' }, { status: 404 });
    }

    const questions = attempt.quiz.questions || [];
    const totalQuestions = attempt.totalQuestions || questions.length || 15;
    const score = attempt.score !== null ? attempt.score : 0;
    const scorePct = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;
    const points = score * 100;

    const durationMs =
      attempt.completedAt && attempt.startedAt
        ? new Date(attempt.completedAt).getTime() - new Date(attempt.startedAt).getTime()
        : 0;
    const totalSecs = Math.max(1, Math.floor(durationMs / 1000));
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    const timeSpentFormatted = mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;

    return NextResponse.json({
      success: true,
      data: {
        attemptId: attempt.id,
        quizTitle: attempt.quiz.translations?.[0]?.title || attempt.quiz.slug,
        category: attempt.quiz.category,
        totalQuestions,
        score,
        scorePct,
        points,
        timeSpentFormatted,
        completedAt: attempt.completedAt,
        questions: questions.map((q) => {
          let opts: string[] = [];
          try {
            opts = typeof q.options === 'string' ? JSON.parse(q.options) : q.options || [];
          } catch {
            opts = [];
          }
          return {
            id: q.id,
            text: q.text,
            options: opts,
            correctOptionIndex: q.correctOptionIndex,
            explanation: q.explanation || '',
          };
        }),
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Failed to fetch attempt details' },
      { status: 500 }
    );
  }
}
