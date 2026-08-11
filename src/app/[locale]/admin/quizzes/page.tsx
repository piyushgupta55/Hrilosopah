import React from 'react';
import { prisma } from '@/lib/prisma';
import { AdminQuizzesClient, QuizItem } from '@/components/admin/AdminQuizzesClient';

export const dynamic = 'force-dynamic';

export default async function AdminQuizzesPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  let initialQuizzes: QuizItem[] = [];

  try {
    const rawQuizzes = await prisma.quiz.findMany({
      include: {
        _count: {
          select: { questions: true },
        },
        questions: {
          orderBy: { id: 'asc' },
        },
        translations: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    initialQuizzes = rawQuizzes.map((q) => {
      const enTrans = q.translations.find((t) => t.locale === 'en');
      return {
        id: q.id,
        slug: q.slug,
        category: q.category,
        isActive: q.isActive,
        title: enTrans?.title || q.slug.toUpperCase().replace(/-/g, ' '),
        questionsCount: q.questions.length,
        questions: q.questions.map((quest) => {
          let parsedOpts: string[] = [];
          try {
            parsedOpts =
              typeof quest.options === 'string' ? JSON.parse(quest.options) : quest.options;
          } catch {
            parsedOpts = ['Option A', 'Option B', 'Option C', 'Option D'];
          }
          return {
            id: quest.id,
            text: quest.text,
            options: parsedOpts,
            correctOptionIndex: quest.correctOptionIndex,
            difficulty: quest.difficulty || 'beginner',
            explanation: quest.explanation,
            quizId: q.id,
          };
        }),
      };
    });
  } catch (err) {
    console.error('Error fetching quizzes for AdminQuizzesPage:', err);
  }

  return <AdminQuizzesClient locale={locale} initialQuizzes={initialQuizzes} />;
}
