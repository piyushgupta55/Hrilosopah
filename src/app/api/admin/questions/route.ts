import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      text,
      options,
      correctOptionIndex,
      difficulty,
      category,
      explanation,
      quizId,
      quizSlug,
    } = body;

    if (!text || !options || correctOptionIndex === undefined) {
      return NextResponse.json(
        { error: 'Question text, options, and correctOptionIndex are required.' },
        { status: 400 }
      );
    }

    let targetQuizId = quizId;

    if (!targetQuizId && quizSlug) {
      const q = await prisma.quiz.findFirst({ where: { slug: quizSlug } });
      if (q) targetQuizId = q.id;
    }

    if (!targetQuizId) {
      const quizCategory = category || 'AI';
      const targetSlug =
        quizSlug ||
        (quizCategory.toLowerCase() === 'crypto' ? 'crypto-blockchain' : 'ai-awareness');
      let quiz = await prisma.quiz.findFirst({ where: { slug: targetSlug } });
      if (!quiz) {
        quiz = await prisma.quiz.create({
          data: {
            slug: targetSlug,
            category: quizCategory,
            isActive: true,
          },
        });
      }
      targetQuizId = quiz.id;
    }

    const optionsStr = typeof options === 'string' ? options : JSON.stringify(options);

    const newQuestion = await prisma.question.create({
      data: {
        quizId: targetQuizId,
        text: text.trim(),
        options: optionsStr,
        correctOptionIndex: Number(correctOptionIndex),
        difficulty: difficulty || 'beginner',
        explanation: explanation ? explanation.trim() : null,
      },
    });

    return NextResponse.json({ success: true, question: newQuestion }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating question:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to create question in DB.' },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, text, options, correctOptionIndex, difficulty, category, explanation, quizId } =
      body;

    if (!id || !text) {
      return NextResponse.json(
        { error: 'Question ID and text are required for edit.' },
        { status: 400 }
      );
    }

    const optionsStr = typeof options === 'string' ? options : JSON.stringify(options);

    const updatedQuestion = await prisma.question.update({
      where: { id },
      data: {
        text: text.trim(),
        options: optionsStr,
        correctOptionIndex: Number(correctOptionIndex),
        difficulty: difficulty || 'beginner',
        explanation: explanation ? explanation.trim() : null,
        ...(quizId ? { quizId } : {}),
      },
    });

    return NextResponse.json({ success: true, question: updatedQuestion });
  } catch (error: any) {
    console.error('Error updating question:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to update question in DB.' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Question ID is required.' }, { status: 400 });
    }

    await prisma.question.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting question:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to delete question.' },
      { status: 500 }
    );
  }
}
