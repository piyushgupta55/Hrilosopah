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
        questionsCount: q._count?.questions || 0,
      };
    });
  } catch (err) {
    console.error('Error fetching quizzes for AdminQuizzesPage:', err);
  }

  if (!initialQuizzes || initialQuizzes.length === 0) {
    initialQuizzes = [
      {
        id: '1',
        slug: 'ai-awareness',
        title: 'AI Awareness Quiz',
        category: 'AI',
        isActive: true,
        questionsCount: 15,
      },
      {
        id: '2',
        slug: 'crypto-basics',
        title: 'Crypto Basics Quiz',
        category: 'Crypto',
        isActive: true,
        questionsCount: 15,
      },
      {
        id: '3',
        slug: 'ml-basics',
        title: 'Machine Learning Fundamentals',
        category: 'AI',
        isActive: true,
        questionsCount: 15,
      },
      {
        id: '4',
        slug: 'ethereum-basics',
        title: 'Ethereum & Smart Contracts',
        category: 'Crypto',
        isActive: true,
        questionsCount: 15,
      },
    ];
  }

  return <AdminQuizzesClient locale={locale} initialQuizzes={initialQuizzes} />;
}
