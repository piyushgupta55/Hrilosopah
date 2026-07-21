'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { BottomNav } from '@/components/home/BottomNav';
import { Search, Star, Brain, Bot, Link2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function ExplorePage({ params: { locale } }: { params: { locale: string } }) {
  const t = useTranslations('Explore');
  const tHome = useTranslations('Home');
  const tCards = useTranslations('Cards');

  const [selectedFilter, setSelectedFilter] = useState('All');

  const filters = ['All', 'AI', 'Crypto', 'Blockchain', 'Tech', 'Finance'];

  // Quiz list data with tags for filtering
  const trendingQuizzes = [
    {
      slug: 'ml-basics',
      title: tCards('mlBasics'),
      desc: tHome('quizDesc'),
      rating: '4.8',
      tags: ['AI', 'Tech'],
      icon: <Brain className="w-6 h-6 text-purple-600" strokeWidth={1.5} />,
      bg: 'bg-[#F3E8FF]',
    },
    {
      slug: 'bitcoin-fundamentals',
      title: tCards('bitcoinFundamentals'),
      desc: tHome('quizDesc'),
      rating: '4.7',
      tags: ['Crypto', 'Blockchain'],
      icon: <span className="text-xl text-[#3B82F6] font-bold">₿</span>,
      bg: 'bg-[#E0F2FE]',
    },
    {
      slug: 'ethereum-basics',
      title: tCards('ethereumBasics'),
      desc: tHome('quizDesc'),
      rating: '4.6',
      tags: ['Crypto', 'Blockchain'],
      icon: <span className="text-xl text-[#7E22CE] font-bold">⟠</span>,
      bg: 'bg-[#F3E8FF]',
    },
  ];

  const newQuizzes = [
    {
      slug: 'ai-tools',
      title: tCards('aiTools'),
      desc: tHome('quizDesc'),
      tags: ['AI', 'Tech'],
      icon: <Bot className="w-6 h-6 text-indigo-600" strokeWidth={2} />,
      bg: 'bg-[#E0E7FF]',
      badge: t('newLabel'),
    },
    {
      slug: 'blockchain-finance',
      title: tCards('blockchainFinance'),
      desc: 'Intermediate • 15-20 Qs',
      tags: ['Blockchain', 'Finance'],
      icon: <Link2 className="w-6 h-6 text-emerald-600" strokeWidth={2} />,
      bg: 'bg-[#D1FAE5]',
    },
  ];

  // Helper to check if item matches filter
  const matchesFilter = (itemTags: string[]) => {
    if (selectedFilter === 'All') return true;
    return itemTags.includes(selectedFilter);
  };

  const filteredTrending = trendingQuizzes.filter((q) => matchesFilter(q.tags));
  const filteredNew = newQuizzes.filter((q) => matchesFilter(q.tags));

  return (
    <div
      className="flex-1 w-full bg-[#F8F9FA] pt-4 flex flex-col overflow-y-auto overflow-x-hidden relative"
      style={{ paddingBottom: 'calc(5.5rem + env(safe-area-inset-bottom))' }}
    >
      {/* Header */}
      <div className="px-5 w-full flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">{t('title')}</h1>
        <button className="w-10 h-10 rounded-full flex items-center justify-center text-gray-900 hover:bg-gray-100 transition-colors">
          <Search className="w-5 h-5" />
        </button>
      </div>

      {/* Filter Pills */}
      <div className="w-full mb-6 overflow-x-auto no-scrollbar pl-5 pr-5">
        <div className="flex items-center gap-2">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${
                selectedFilter === filter
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                  : 'bg-[#F3F4F6] text-gray-700 hover:bg-gray-200 shadow-none'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Top Categories */}
      {selectedFilter === 'All' && (
        <div className="px-5 w-full mb-8">
          <h3 className="font-bold text-gray-900 text-lg mb-4">{t('topCategories')}</h3>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <Link href={`/${locale}/explore/category/ai`}>
              <div className="bg-[#7B61FF] rounded-xl p-5 text-white flex flex-col items-center justify-center text-center h-40 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <Brain
                  className="w-[3.5rem] h-[3.5rem] mb-3 text-[#E0D4FF] drop-shadow-sm"
                  strokeWidth={1.5}
                />
                <h4 className="font-bold text-sm leading-tight mb-1">{tCards('ai')}</h4>
                <p className="text-white/80 text-[11px] font-medium">
                  {tCards('quizzesCount', { count: 12 })}
                </p>
              </div>
            </Link>

            <Link href={`/${locale}/explore/category/crypto`}>
              <div className="bg-[#EAF2FF] rounded-xl p-5 flex flex-col items-center justify-center text-center h-40 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                <div className="absolute inset-0 bg-white/40 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center mb-3 shadow-sm shadow-blue-500/30">
                  <span className="text-2xl font-bold text-white">₿</span>
                </div>
                <h4 className="font-bold text-sm text-gray-900 leading-tight mb-1">
                  {tCards('crypto')}
                </h4>
                <p className="text-blue-600 text-[11px] font-semibold">
                  {tCards('quizzesCount', { count: 15 })}
                </p>
              </div>
            </Link>
          </div>
        </div>
      )}

      {/* Trending Quizzes */}
      {filteredTrending.length > 0 && (
        <div className="px-5 w-full mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900 text-lg">{t('trendingQuizzes')}</h3>
            <button className="text-blue-600 text-sm font-semibold hover:text-blue-700">
              {tHome('seeAll')}
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col overflow-hidden divide-y divide-gray-100">
            {filteredTrending.map((q) => (
              <Link
                key={q.slug}
                href={`/${locale}/quiz/${q.slug}`}
                className="p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors"
              >
                <div
                  className={`w-12 h-12 rounded-full ${q.bg} flex items-center justify-center shrink-0`}
                >
                  {q.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-gray-900 text-sm truncate mb-0.5">{q.title}</h4>
                  <p className="text-gray-500 text-xs">{q.desc}</p>
                </div>
                <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-lg">
                  <span className="font-bold text-gray-700 text-sm">{q.rating}</span>
                  <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* New & Updated */}
      {filteredNew.length > 0 && (
        <div className="px-5 w-full mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900 text-lg">{t('newUpdated')}</h3>
            <button className="text-blue-600 text-sm font-semibold hover:text-blue-700">
              {tHome('seeAll')}
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col overflow-hidden divide-y divide-gray-100">
            {filteredNew.map((q) => (
              <Link
                key={q.slug}
                href={`/${locale}/quiz/${q.slug}`}
                className="p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors"
              >
                <div
                  className={`w-12 h-12 rounded-2xl ${q.bg} flex items-center justify-center shrink-0 drop-shadow-sm`}
                >
                  {q.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-gray-900 text-sm truncate mb-0.5">{q.title}</h4>
                  <p className="text-gray-500 text-xs">{q.desc}</p>
                </div>
                {q.badge && (
                  <div className="px-2.5 py-1 bg-[#ECFDF5] text-[#059669] text-[10px] font-bold rounded-md uppercase tracking-wider">
                    {q.badge}
                  </div>
                )}
              </Link>
            ))}
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}
