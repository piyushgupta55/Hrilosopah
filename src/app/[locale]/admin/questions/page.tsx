import React from 'react';
import { prisma } from '@/lib/prisma';
import { AdminQuestionsClient, QuestionItem } from '@/components/admin/AdminQuestionsClient';

export const dynamic = 'force-dynamic';

export default async function AdminQuestionsPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  let initialQuestions: QuestionItem[] = [];

  try {
    const rawQuestions = await prisma.question.findMany({
      include: {
        quiz: {
          select: {
            category: true,
            slug: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    initialQuestions = rawQuestions.map((q) => {
      let optsArr: string[] = [];
      try {
        optsArr = typeof q.options === 'string' ? JSON.parse(q.options) : q.options;
      } catch {
        optsArr = [q.options];
      }

      return {
        id: q.id,
        text: q.text,
        options: optsArr,
        correctOptionIndex: q.correctOptionIndex,
        difficulty: q.difficulty,
        explanation: q.explanation,
        category: q.quiz?.category || 'AI',
        quizSlug: q.quiz?.slug || 'ai-awareness',
      };
    });
  } catch (err) {
    console.error('Error fetching questions from DB for AdminQuestionsPage:', err);
  }

  // Fallback initial core questions bank if DB has no rows yet
  if (!initialQuestions || initialQuestions.length === 0) {
    initialQuestions = [
      {
        id: 'q1',
        text: 'What is the primary function of a Transformer architecture in modern AI models?',
        options: [
          'Processing sequences in parallel using self-attention mechanisms',
          'Sequential step-by-step recurrent processing',
          'Static pixel rendering',
          'Manual feature extraction',
        ],
        correctOptionIndex: 0,
        difficulty: 'intermediate',
        explanation:
          'Transformers rely on self-attention mechanisms to compute relationships across entire sequences simultaneously.',
        category: 'AI',
        quizSlug: 'ai-awareness',
      },
      {
        id: 'q2',
        text: 'Who published the Bitcoin whitepaper in 2008?',
        options: ['Satoshi Nakamoto', 'Vitalik Buterin', 'Nick Szabo', 'Hal Finney'],
        correctOptionIndex: 0,
        difficulty: 'beginner',
        explanation:
          'Satoshi Nakamoto published the whitepaper titled "Bitcoin: A Peer-to-Peer Electronic Cash System" in October 2008.',
        category: 'Crypto',
        quizSlug: 'crypto-fundamentals',
      },
      {
        id: 'q3',
        text: 'What is a Zero-Knowledge Proof (ZKP) in cryptography?',
        options: [
          'A method by which one party can prove a statement is true without revealing any underlying information',
          'A proof that contains zero encryption keys',
          'A fallback backup key',
          'A consensus algorithm for mining',
        ],
        correctOptionIndex: 0,
        difficulty: 'advanced',
        explanation:
          'Zero-Knowledge Proofs allow verification of transactions or claims without exposing private data.',
        category: 'Crypto',
        quizSlug: 'blockchain-architecture',
      },
      {
        id: 'q4',
        text: 'What does RLHF stand for in Large Language Model training?',
        options: [
          'Reinforcement Learning from Human Feedback',
          'Recurrent Logic Human Foundation',
          'Random Layer High Frequency',
          'Rotational Linear Host Factor',
        ],
        correctOptionIndex: 0,
        difficulty: 'intermediate',
        explanation:
          'RLHF is a machine learning technique that uses human feedback to fine-tune AI models for safety and alignment.',
        category: 'AI',
        quizSlug: 'ai-awareness',
      },
    ];
  }

  return <AdminQuestionsClient locale={locale} initialQuestions={initialQuestions} />;
}
