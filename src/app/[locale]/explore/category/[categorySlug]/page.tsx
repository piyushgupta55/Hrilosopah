'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Brain, Star, Bot, Link2, Bitcoin } from 'lucide-react';
import { BottomNav } from '@/components/home/BottomNav';

export default function CategoryPage() {
  const params = useParams() || {};
  const locale = (params.locale as string) || 'en';
  const categorySlug = (params.categorySlug as string) || '';
  const formattedCategory = categorySlug.toUpperCase();

  const allQuizzes = [
    {
      slug: 'ml-basics',
      title: 'Machine Learning Basics',
      desc: 'Master foundational concepts of ML algorithms',
      rating: '4.8',
      category: 'ai',
      icon: <Brain className="w-6 h-6 text-purple-600" strokeWidth={1.5} />,
      bg: 'bg-[#F3E8FF]',
    },
    {
      slug: 'ai-tools',
      title: 'AI Tools & Applications',
      desc: 'Explore cutting edge AI platforms and use-cases',
      category: 'ai',
      icon: <Bot className="w-6 h-6 text-indigo-600" strokeWidth={2} />,
      bg: 'bg-[#E0E7FF]',
      rating: '4.9',
    },
    {
      slug: 'bitcoin-fundamentals',
      title: 'Bitcoin Fundamentals',
      desc: 'Understand proof of work, wallets, and halving',
      rating: '4.7',
      category: 'crypto',
      icon: <Bitcoin className="w-6 h-6 text-blue-600" strokeWidth={1.5} />,
      bg: 'bg-[#E0F2FE]',
    },
    {
      slug: 'ethereum-basics',
      title: 'Ethereum & Smart Contracts',
      desc: 'Learn EVM, gas fees, and decentralized apps',
      rating: '4.6',
      category: 'crypto',
      icon: <span className="text-xl text-[#7E22CE] font-bold">⟠</span>,
      bg: 'bg-[#F3E8FF]',
    },
    {
      slug: 'blockchain-finance',
      title: 'DeFi & Blockchain Finance',
      desc: 'Intermediate guide to liquidity pools and yield',
      rating: '4.7',
      category: 'crypto',
      icon: <Link2 className="w-6 h-6 text-emerald-600" strokeWidth={2} />,
      bg: 'bg-[#D1FAE5]',
    },
  ];

  const categoryQuizzes = allQuizzes.filter(
    (q) => q.category.toLowerCase() === categorySlug.toLowerCase()
  );

  return (
    <div
      className="flex-1 w-full bg-[#F8F9FA] pt-4 flex flex-col min-h-screen relative"
      style={{ paddingBottom: 'calc(5.5rem + env(safe-area-inset-bottom))' }}
    >
      {/* Header */}
      <div className="px-5 w-full flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link
            href={`/${locale}/explore`}
            className="w-10 h-10 rounded-full flex items-center justify-center bg-white shadow-sm border border-gray-100 text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              {formattedCategory} Quizzes
            </h1>
            <p className="text-xs text-gray-500 font-medium">
              {categoryQuizzes.length} quizzes available
            </p>
          </div>
        </div>
      </div>

      {/* Quiz List */}
      <div className="px-5 w-full flex-1">
        {categoryQuizzes.length > 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col overflow-hidden divide-y divide-gray-100">
            {categoryQuizzes.map((q) => (
              <Link
                key={q.slug}
                href={`/${locale}/quiz/${q.slug}`}
                className="p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors"
              >
                <div
                  className={`w-12 h-12 rounded-2xl ${q.bg} flex items-center justify-center shrink-0 shadow-sm`}
                >
                  {q.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-gray-900 text-sm truncate mb-0.5">{q.title}</h4>
                  <p className="text-gray-500 text-xs">{q.desc}</p>
                </div>
                {q.rating && (
                  <div className="flex items-center gap-1 bg-gray-50 px-2.5 py-1 rounded-lg">
                    <span className="font-bold text-gray-700 text-sm">{q.rating}</span>
                    <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                  </div>
                )}
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-8 text-center border border-gray-100 shadow-sm">
            <p className="text-gray-500 text-sm">
              No quizzes found for category {formattedCategory}.
            </p>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
