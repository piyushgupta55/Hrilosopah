'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { BottomNav } from '@/components/home/BottomNav';
import {
  Brain,
  Bitcoin,
  Award,
  Zap,
  BarChart3,
  Clock,
  ArrowRight,
  CheckCircle2,
  TrendingUp,
} from 'lucide-react';

export default function ProgressPage() {
  const params = useParams() || {};
  const locale = (params.locale as string) || 'en';

  const [activeTab, setActiveTab] = useState<'all' | 'ai' | 'crypto'>('all');

  const completedQuizzes = [
    {
      id: 'ai-awareness',
      title: 'AI Awareness & LLM Architecture',
      category: 'AI',
      icon: Brain,
      iconBg: 'bg-purple-50 text-purple-600 border border-purple-200',
      date: 'Aug 10, 2026',
      timeSpent: '4m 12s',
      score: '100%',
      questionsCorrect: 15,
      totalQuestions: 15,
      points: 1500,
      slug: 'ai-awareness',
    },
    {
      id: 'crypto-fundamentals',
      title: 'Crypto Fundamentals & Bitcoin',
      category: 'Crypto',
      icon: Bitcoin,
      iconBg: 'bg-amber-50 text-amber-600 border border-amber-200',
      date: 'Aug 09, 2026',
      timeSpent: '5m 45s',
      score: '93%',
      questionsCorrect: 14,
      totalQuestions: 15,
      points: 1400,
      slug: 'crypto-fundamentals',
    },
    {
      id: 'blockchain-architecture',
      title: 'Blockchain Consensus & Smart Contracts',
      category: 'Crypto',
      icon: Bitcoin,
      iconBg: 'bg-blue-50 text-blue-600 border border-blue-200',
      date: 'Aug 08, 2026',
      timeSpent: '6m 10s',
      score: '87%',
      questionsCorrect: 13,
      totalQuestions: 15,
      points: 1300,
      slug: 'blockchain-architecture',
    },
    {
      id: 'machine-learning-basics',
      title: 'Machine Learning & Neural Networks',
      category: 'AI',
      icon: Brain,
      iconBg: 'bg-[#EFF6FF] text-[#2563EB] border border-blue-200',
      date: 'Aug 07, 2026',
      timeSpent: '3m 50s',
      score: '80%',
      questionsCorrect: 12,
      totalQuestions: 15,
      points: 1200,
      slug: 'machine-learning-basics',
    },
  ];

  const filteredQuizzes = completedQuizzes.filter((q) => {
    if (activeTab === 'ai') return q.category === 'AI';
    if (activeTab === 'crypto') return q.category === 'Crypto';
    return true;
  });

  return (
    <div
      className="flex-1 w-full bg-[#F8FAFC] text-slate-900 pt-4 flex flex-col overflow-y-auto overflow-x-hidden relative font-sans"
      style={{ paddingBottom: 'calc(5.5rem + env(safe-area-inset-bottom))' }}
    >
      {/* Header */}
      <div className="px-5 w-full flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Your Progress & Analytics
          </h1>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Track completed tests and topic mastery
          </p>
        </div>
        <div className="flex items-center gap-1.5 bg-white border border-blue-200 px-3 py-1.5 rounded-full shadow-sm">
          <Zap className="w-4 h-4 text-[#2563EB]" />
          <span className="text-xs font-black text-[#2563EB]">1,500 XP</span>
        </div>
      </div>

      {/* Overall Performance Hero Card */}
      <div className="px-5 w-full mb-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-blue-100">
          <div className="flex items-center justify-between mb-3 border-b border-gray-100 pb-2.5">
            <h3 className="font-extrabold text-slate-900 text-xs sm:text-sm flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-[#2563EB]" />
              Overall Quiz Performance
            </h3>
            <span className="text-[10px] font-bold text-[#2563EB] bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
              Top 5% Learner
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Circular Ring Chart */}
            <div className="relative w-20 h-20 shrink-0">
              <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" stroke="#EFF6FF" strokeWidth="10" fill="none" />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="#2563EB"
                  strokeWidth="10"
                  fill="none"
                  strokeDasharray="251.2"
                  strokeDashoffset={251.2 * (1 - 0.9)}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-lg font-black text-slate-900 leading-none">90%</span>
                <span className="text-[9px] text-slate-400 font-bold mt-0.5">Accuracy</span>
              </div>
            </div>

            {/* 4 Stat Boxes */}
            <div className="flex-1 grid grid-cols-2 gap-2 text-xs">
              <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[9px] font-bold text-slate-400 uppercase block mb-0.5">
                  Quizzes
                </span>
                <span className="text-xs font-black text-slate-900">4 Completed</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[9px] font-bold text-slate-400 uppercase block mb-0.5">
                  Accuracy
                </span>
                <span className="text-xs font-black text-[#2563EB]">54/60 Correct</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[9px] font-bold text-slate-400 uppercase block mb-0.5">
                  Streak
                </span>
                <span className="text-xs font-black text-slate-900">7 Days 🔥</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[9px] font-bold text-slate-400 uppercase block mb-0.5">
                  Time Spent
                </span>
                <span className="text-xs font-black text-slate-900">19m 57s</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tests You Have Given */}
      <div className="px-5 w-full mb-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
              Tests You Have Given
            </h3>
            <p className="text-[11px] text-slate-500">
              Tap View Analytics for full answers & explanations
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all ${
                activeTab === 'all'
                  ? 'bg-white text-[#2563EB] shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setActiveTab('ai')}
              className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all ${
                activeTab === 'ai'
                  ? 'bg-white text-[#2563EB] shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              AI
            </button>
            <button
              onClick={() => setActiveTab('crypto')}
              className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all ${
                activeTab === 'crypto'
                  ? 'bg-white text-[#2563EB] shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Crypto
            </button>
          </div>
        </div>

        {/* Quiz Cards */}
        <div className="space-y-2.5">
          {filteredQuizzes.map((quiz) => {
            const Icon = quiz.icon;
            return (
              <div
                key={quiz.id}
                className="bg-white border border-blue-100 rounded-xl p-3.5 shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-between gap-3 mb-2.5">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${quiz.iconBg}`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 leading-snug">
                        {quiz.title}
                      </h4>
                      <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-400 font-medium">
                        <span>{quiz.date}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          {quiz.timeSpent}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-base font-black text-[#2563EB] leading-none block">
                      {quiz.score}
                    </span>
                    <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">
                      {quiz.questionsCorrect}/{quiz.totalQuestions} Correct
                    </span>
                  </div>
                </div>

                {/* Card Footer Bar */}
                <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-xs">
                  <span className="px-2.5 py-0.5 bg-blue-50 text-[#2563EB] text-[10px] font-bold rounded-full border border-blue-100">
                    +{quiz.points} XP
                  </span>

                  <Link
                    href={`/${locale}/quiz/${quiz.slug}/results`}
                    className="flex items-center gap-1 px-3 py-1.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-[11px] rounded-lg shadow-sm transition-all active:scale-[0.98]"
                  >
                    <span>View Analytics</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Topic Mastery Breakdown */}
      <div className="px-5 w-full mb-6">
        <h3 className="font-extrabold text-slate-900 text-sm sm:text-base mb-2.5">
          Topic Mastery Breakdown
        </h3>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-blue-100 flex flex-col gap-3 text-xs">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between font-bold">
              <div className="flex items-center gap-2">
                <Brain className="w-4 h-4 text-[#2563EB]" />
                <span className="text-slate-900">Artificial Intelligence & LLMs</span>
              </div>
              <span className="text-[#2563EB] font-black">90%</span>
            </div>
            <div className="w-full h-2 bg-blue-50 rounded-full overflow-hidden">
              <div className="h-full bg-[#2563EB] rounded-full" style={{ width: '90%' }}></div>
            </div>
          </div>

          <div className="w-full h-[1px] bg-gray-100"></div>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between font-bold">
              <div className="flex items-center gap-2">
                <Bitcoin className="w-4 h-4 text-[#2563EB]" />
                <span className="text-slate-900">Blockchain & Cryptography</span>
              </div>
              <span className="text-[#2563EB] font-black">87%</span>
            </div>
            <div className="w-full h-2 bg-blue-50 rounded-full overflow-hidden">
              <div className="h-full bg-[#2563EB] rounded-full" style={{ width: '87%' }}></div>
            </div>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
