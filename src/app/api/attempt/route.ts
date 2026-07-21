import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createAttemptSchema } from '@/lib/validation/quiz';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = createAttemptSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: { code: 'INVALID_INPUT', message: 'Invalid payload' } },
        { status: 400 }
      );
    }

    const { quizId } = result.data;

    // Check if quiz exists
    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
    });

    if (!quiz) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'Quiz not found' } },
        { status: 404 }
      );
    }

    const sessionId = crypto.randomUUID();

    const attempt = await prisma.attempt.create({
      data: {
        quizId,
        sessionId,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        id: attempt.id,
        sessionId: attempt.sessionId,
      },
    });
  } catch (error) {
    console.error('Error creating attempt:', error);
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_SERVER_ERROR', message: 'Something went wrong' } },
      { status: 500 }
    );
  }
}
