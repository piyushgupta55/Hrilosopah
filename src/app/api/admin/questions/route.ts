import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { text, options, correctOptionIndex, difficulty, category, explanation, quizSlug } = body;

    if (!text || !options || correctOptionIndex === undefined) {
      return NextResponse.json(
        { error: 'Question text, options, and correctOptionIndex are required.' },
        { status: 400 }
      );
    }

    const quizCategory = category || 'AI';
    const targetSlug =
      quizSlug || (quizCategory === 'Crypto' ? 'crypto-fundamentals' : 'ai-awareness');

    // Find or create quiz matching category
    let quiz = await prisma.quiz.findFirst({
      where: { slug: targetSlug },
    });

    if (!quiz) {
      quiz = await prisma.quiz.create({
        data: {
          slug: targetSlug,
          category: quizCategory,
          isActive: true,
        },
      });
    }

    const optionsStr = typeof options === 'string' ? options : JSON.stringify(options);

    const newQuestion = await prisma.question.create({
      data: {
        quizId: quiz.id,
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
    const { id, text, options, correctOptionIndex, difficulty, category, explanation } = body;

    if (!id || !text) {
      return NextResponse.json(
        { error: 'Question ID and text are required for edit.' },
        { status: 400 }
      );
    }

    const optionsStr = typeof options === 'string' ? options : JSON.stringify(options);

    // If category changed, find or assign to appropriate quiz category
    let quizId: string | undefined = undefined;
    if (category) {
      const targetSlug = category === 'Crypto' ? 'crypto-fundamentals' : 'ai-awareness';
      let quiz = await prisma.quiz.findFirst({ where: { slug: targetSlug } });
      if (!quiz) {
        quiz = await prisma.quiz.create({
          data: { slug: targetSlug, category, isActive: true },
        });
      }
      quizId = quiz.id;
    }

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
