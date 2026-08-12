import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { submitAnswersSchema } from '@/lib/validation/quiz';

const FALLBACK_AI_QUESTIONS = [
  { id: 'q1', correctOptionIndex: 1 },
  { id: 'q2', correctOptionIndex: 1 },
  { id: 'q3', correctOptionIndex: 1 },
  { id: 'q4', correctOptionIndex: 1 },
  { id: 'q5', correctOptionIndex: 0 },
];

const FALLBACK_CRYPTO_QUESTIONS = [
  { id: 'c1', correctOptionIndex: 1 },
  { id: 'c2', correctOptionIndex: 1 },
  { id: 'c3', correctOptionIndex: 1 },
  { id: 'c4', correctOptionIndex: 1 },
  { id: 'c5', correctOptionIndex: 0 },
];

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
      include: { quiz: true },
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

    // Fetch questions from DB for this quiz
    let questionsToScore = await prisma.question.findMany({
      where: {
        quizId: attempt.quizId,
      },
    });

    // If no questions in DB, fallback to topic questions
    if (!questionsToScore || questionsToScore.length === 0) {
      const slug = attempt.quiz?.slug || '';
      const isCrypto =
        slug.includes('crypto') || slug.includes('bitcoin') || slug.includes('block');
      questionsToScore = (isCrypto ? FALLBACK_CRYPTO_QUESTIONS : FALLBACK_AI_QUESTIONS) as any;
    }

    let score = 0;
    const totalQs = Math.max(Object.keys(answers).length, questionsToScore.length, 1);

    for (let i = 0; i < questionsToScore.length; i++) {
      const q = questionsToScore[i];
      const userChoice =
        answers[q.id] !== undefined
          ? answers[q.id]
          : answers[`q_${i}`] !== undefined
            ? answers[`q_${i}`]
            : answers[`q${i + 1}`] !== undefined
              ? answers[`q${i + 1}`]
              : undefined;

      if (
        userChoice !== undefined &&
        userChoice !== null &&
        Number(userChoice) === Number(q.correctOptionIndex)
      ) {
        score++;
      }
    }

    // Fetch session if present
    const { getServerSession } = await import('next-auth/next');
    const { authOptions } = await import('@/lib/auth');
    const session = await getServerSession(authOptions);
    const userEmail = session?.user?.email || null;

    // Update attempt
    await prisma.attempt.update({
      where: { id: attemptId },
      data: {
        score,
        totalQuestions: totalQs,
        completedAt: new Date(),
        ...(attempt.email ? {} : userEmail ? { email: userEmail } : {}),
      },
    });

    return NextResponse.json({
      success: true,
      data: { success: true, score, totalQuestions: totalQs },
    });
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
