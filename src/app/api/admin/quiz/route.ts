import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, slug, category, isActive } = body;

    if (!title || !slug || !category) {
      return NextResponse.json(
        { error: 'Title, slug, and category are required.' },
        { status: 400 }
      );
    }

    const cleanSlug = slug
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '-');

    // Create quiz and title translation
    const quiz = await prisma.quiz.create({
      data: {
        slug: cleanSlug,
        category: category.trim(),
        isActive: Boolean(isActive),
        translations: {
          create: {
            locale: 'en',
            title: title.trim(),
          },
        },
      },
      include: {
        translations: true,
      },
    });

    return NextResponse.json({ success: true, quiz }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating DB quiz:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to create quiz in database.' },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, title, category, isActive } = body;

    if (!id) {
      return NextResponse.json({ error: 'Quiz ID is required for edit.' }, { status: 400 });
    }

    const updatedQuiz = await prisma.quiz.update({
      where: { id },
      data: {
        category: category?.trim(),
        isActive: Boolean(isActive),
      },
    });

    if (title) {
      // Upsert translation title for English
      const existingTrans = await prisma.quizTranslation.findFirst({
        where: { quizId: id, locale: 'en' },
      });

      if (existingTrans) {
        await prisma.quizTranslation.update({
          where: { id: existingTrans.id },
          data: { title: title.trim() },
        });
      } else {
        await prisma.quizTranslation.create({
          data: {
            quizId: id,
            locale: 'en',
            title: title.trim(),
          },
        });
      }
    }

    return NextResponse.json({ success: true, quiz: updatedQuiz });
  } catch (error: any) {
    console.error('Error updating DB quiz:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to update quiz in database.' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Quiz ID is required.' }, { status: 400 });
    }

    await prisma.quiz.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting DB quiz:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to delete quiz.' },
      { status: 500 }
    );
  }
}
