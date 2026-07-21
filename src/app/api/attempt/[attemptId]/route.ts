import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { submitAnswersSchema } from '@/lib/validation/quiz';

export async function PATCH(request: Request, { params }: { params: { attemptId: string } }) {
  try {
    const body = await request.json();
    const result = submitAnswersSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: { code: 'INVALID_INPUT', message: 'Invalid payload' } },
        { status: 400 }
      );
    }

    const { answers } = result.data;
    const { attemptId } = params;

    // Get the attempt
    const attempt = await prisma.attempt.findUnique({
      where: { id: attemptId },
    });

    if (!attempt) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'Attempt not found' } },
        { status: 404 }
      );
    }

    if (attempt.completedAt) {
      return NextResponse.json(
        { success: false, error: { code: 'CONFLICT', message: 'Attempt already completed' } },
        { status: 409 }
      );
    }

    // Fetch all questions that were answered
    const questionIds = Object.keys(answers);
    const questions = await prisma.question.findMany({
      where: {
        id: { in: questionIds },
        quizId: attempt.quizId,
      },
    });

    // Score computation
    const { calculateScore } = await import('@/lib/scoring');
    const { score } = calculateScore(questions, answers);

    // Update attempt
    await prisma.attempt.update({
      where: { id: attemptId },
      data: {
        score,
        totalQuestions: questionIds.length,
        completedAt: new Date(),
      },
    });

    return NextResponse.json({ success: true, data: { success: true } });
  } catch (error) {
    console.error('Error submitting attempt:', error);
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_SERVER_ERROR', message: 'Something went wrong' } },
      { status: 500 }
    );
  }
}

export async function GET(request: Request, { params }: { params: { attemptId: string } }) {
  try {
    const attempt = await prisma.attempt.findUnique({
      where: { id: params.attemptId },
    });

    if (!attempt) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'Attempt not found' } },
        { status: 404 }
      );
    }

    // Only return basic summary (do not reveal score)
    return NextResponse.json({
      success: true,
      data: {
        id: attempt.id,
        quizId: attempt.quizId,
        completedAt: attempt.completedAt,
        totalQuestions: attempt.totalQuestions,
        paymentStatus: attempt.paymentStatus,
      },
    });
  } catch (error) {
    console.error('Error fetching attempt summary:', error);
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_SERVER_ERROR', message: 'Something went wrong' } },
      { status: 500 }
    );
  }
}
