import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    // If ID is provided, return full quiz detail with questions for editor pre-population
    if (id) {
      const quiz = await prisma.quiz.findUnique({
        where: { id },
        include: {
          translations: true,
          questions: {
            orderBy: { order: 'asc' },
          },
        },
      });

      if (!quiz) {
        return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });
      }

      const enTrans = quiz.translations.find((t) => t.locale === 'en');
      const title = enTrans?.title || quiz.slug.toUpperCase().replace(/-/g, ' ');

      const formattedQuestions = quiz.questions.map((q) => {
        let parsedOptions: string[] = [];
        try {
          parsedOptions = JSON.parse(q.options);
          if (!Array.isArray(parsedOptions)) parsedOptions = [];
        } catch {
          parsedOptions = [];
        }

        let correctIndexes: number[] = [q.correctOptionIndex];
        // If options or metadata encodes multiple correct answers, handle gracefully
        if (q.correctOptionIndex < 0 && (q as any).correctIndexes) {
          correctIndexes = (q as any).correctIndexes;
        }

        return {
          id: q.id,
          text: q.text,
          questionType: q.questionType || 'single-choice',
          options: parsedOptions.length > 0 ? parsedOptions : ['', ''],
          correctOptionIndex: q.correctOptionIndex,
          correctIndexes,
          explanation: q.explanation || '',
          difficulty: q.difficulty || 'beginner',
          order: q.order || 0,
        };
      });

      return NextResponse.json({
        success: true,
        quiz: {
          id: quiz.id,
          slug: quiz.slug,
          title,
          category: quiz.category,
          difficulty: quiz.difficulty || 'beginner',
          quizType: quiz.quizType || 'Build-Up/Leveled',
          status: quiz.isActive ? 'Published' : 'Draft',
          isActive: quiz.isActive,
          questions: formattedQuestions,
        },
      });
    }

    // Default list view logic
    const rawQuizzes = await prisma.quiz.findMany({
      include: {
        _count: {
          select: { questions: true },
        },
        questions: {
          select: { difficulty: true },
        },
        translations: true,
      },
      orderBy: { updatedAt: 'desc' },
    });

    const quizzes = rawQuizzes.map((q) => {
      const enTrans = q.translations.find((t) => t.locale === 'en');
      const difficulty = q.difficulty || q.questions[0]?.difficulty || 'beginner';

      return {
        id: q.id,
        slug: q.slug,
        title: enTrans?.title || q.slug.toUpperCase().replace(/-/g, ' '),
        category: q.category,
        difficulty,
        quizType: q.quizType || 'Build-Up/Leveled',
        questionsCount: q._count?.questions || q.questions.length || 0,
        status: q.isActive ? 'Published' : 'Draft',
        isActive: q.isActive,
        updatedAt: q.updatedAt.toISOString(),
      };
    });

    return NextResponse.json({ success: true, quizzes });
  } catch (error: any) {
    console.error('Error fetching admin quizzes:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to fetch quizzes.' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, slug, category, difficulty, quizType, isActive, status, questions } = body;

    if (!title || !category) {
      return NextResponse.json({ error: 'Title and category are required.' }, { status: 400 });
    }

    const rawSlug = slug || title;
    const cleanSlug = rawSlug
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '-')
      .replace(/-+/g, '-');

    const isQuizActive = status === 'Published' || Boolean(isActive);

    // Create quiz and title translation
    const quiz = await prisma.quiz.create({
      data: {
        slug: cleanSlug,
        category: category.trim(),
        difficulty: difficulty || 'beginner',
        quizType: quizType || 'Build-Up/Leveled',
        isActive: isQuizActive,
        translations: {
          create: {
            locale: 'en',
            title: title.trim(),
          },
        },
      },
    });

    // Create questions if present
    if (Array.isArray(questions) && questions.length > 0) {
      const questionsData = questions.map((q: any, index: number) => {
        const optionsArr = Array.isArray(q.options) ? q.options : [];
        const correctIdx =
          typeof q.correctOptionIndex === 'number'
            ? q.correctOptionIndex
            : Array.isArray(q.correctIndexes) && q.correctIndexes.length > 0
              ? q.correctIndexes[0]
              : 0;

        return {
          quizId: quiz.id,
          text: (q.text || '').trim(),
          options: JSON.stringify(optionsArr),
          correctOptionIndex: correctIdx,
          explanation: q.explanation ? q.explanation.trim() : null,
          difficulty: q.difficulty || difficulty || 'beginner',
          questionType: q.questionType || 'single-choice',
          order: index,
        };
      });

      await prisma.question.createMany({
        data: questionsData,
      });
    }

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
    const { id, title, slug, category, difficulty, quizType, isActive, status, questions } = body;

    if (!id) {
      return NextResponse.json({ error: 'Quiz ID is required for edit.' }, { status: 400 });
    }

    const isQuizActive = status !== undefined ? status === 'Published' : Boolean(isActive);

    const updateData: any = {
      isActive: isQuizActive,
    };
    if (category) updateData.category = category.trim();
    if (difficulty) updateData.difficulty = difficulty;
    if (quizType) updateData.quizType = quizType;
    if (slug) {
      updateData.slug = slug
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9-]/g, '-');
    }

    const updatedQuiz = await prisma.quiz.update({
      where: { id },
      data: updateData,
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

    // Sync questions if questions array provided
    if (Array.isArray(questions)) {
      // Find existing question IDs to clean up translations first
      const existingQuestions = await prisma.question.findMany({
        where: { quizId: id },
        select: { id: true },
      });
      const questionIds = existingQuestions.map((q) => q.id);

      if (questionIds.length > 0) {
        await prisma.questionTranslation.deleteMany({
          where: { questionId: { in: questionIds } },
        });
      }

      // Delete existing questions for this quiz and recreate with updated payload
      await prisma.question.deleteMany({
        where: { quizId: id },
      });

      if (questions.length > 0) {
        const questionsData = questions.map((q: any, index: number) => {
          const optionsArr = Array.isArray(q.options) ? q.options : [];
          const correctIdx =
            typeof q.correctOptionIndex === 'number'
              ? q.correctOptionIndex
              : Array.isArray(q.correctIndexes) && q.correctIndexes.length > 0
                ? q.correctIndexes[0]
                : 0;

          return {
            quizId: id,
            text: (q.text || '').trim(),
            options: JSON.stringify(optionsArr),
            correctOptionIndex: correctIdx,
            explanation: q.explanation ? q.explanation.trim() : null,
            difficulty: q.difficulty || difficulty || 'beginner',
            questionType: q.questionType || 'single-choice',
            order: index,
          };
        });

        await prisma.question.createMany({
          data: questionsData,
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

    // Clean up dependent child records prior to quiz deletion
    const existingQuestions = await prisma.question.findMany({
      where: { quizId: id },
      select: { id: true },
    });
    const questionIds = existingQuestions.map((q) => q.id);

    if (questionIds.length > 0) {
      await prisma.questionTranslation.deleteMany({
        where: { questionId: { in: questionIds } },
      });
    }

    await prisma.question.deleteMany({
      where: { quizId: id },
    });

    await prisma.quizTranslation.deleteMany({
      where: { quizId: id },
    });

    await prisma.attempt.deleteMany({
      where: { quizId: id },
    });

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
