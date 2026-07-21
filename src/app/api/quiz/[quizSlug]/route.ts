import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request, { params }: { params: { quizSlug: string } }) {
  try {
    const quiz = await prisma.quiz.findUnique({
      where: { slug: params.quizSlug, isActive: true },
      include: {
        questions: {
          where: { status: 'approved' },
        },
      },
    });

    if (!quiz) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'Quiz not found' } },
        { status: 404 }
      );
    }

    // Shuffle questions and limit to 15 (if more exist)
    const shuffledQuestions = [...quiz.questions].sort(() => 0.5 - Math.random()).slice(0, 15);

    // Remove correctOptionIndex and explanation from the response to prevent cheating
    const safeQuestions = shuffledQuestions.map((q) => ({
      id: q.id,
      text: q.text,
      options: JSON.parse(q.options),
      difficulty: q.difficulty,
    }));

    return NextResponse.json({
      success: true,
      data: {
        id: quiz.id,
        slug: quiz.slug,
        category: quiz.category,
        questions: safeQuestions,
      },
    });
  } catch (error) {
    console.error('Error fetching quiz:', error);
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_SERVER_ERROR', message: 'Something went wrong' } },
      { status: 500 }
    );
  }
}
