'use client';

import React, { useEffect, useState } from 'react';
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
  FileQuestion,
} from 'lucide-react';

interface QuizAttemptProgress {
  id: string;
  title: string;
  category: string;
  date: string;
  timeSpent: string;
  score: string;
  questionsCorrect: number;
  totalQuestions: number;
  points: number;
  slug: string;
}

interface UserStatsData {
  completedCount: number;
  streakDays: number;
  timeSpentFormatted: string;
  accuracyPercentage: number;
  totalQuestionsCorrect: number;
  totalQuestionsAttempted: number;
  totalPoints: number;
  completedQuizzes: QuizAttemptProgress[];
}

export default function ProgressPage() {
  const params = useParams() || {};
  const locale = (params.locale as string) || 'en';

  const [activeTab, setActiveTab] = useState<'all' | 'ai' | 'crypto'>('all');
  const [stats, setStats] = useState<UserStatsData>({
    completedCount: 0,
    streakDays: 0,
    timeSpentFormatted: '0m',
    accuracyPercentage: 0,
    totalQuestionsCorrect: 0,
    totalQuestionsAttempted: 0,
    totalPoints: 0,
    completedQuizzes: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch('/api/user/stats');
        const json = await res.json();
        if (json.success && json.data) {
          setStats(json.data);
        }
      } catch (err) {
        console.error('Error fetching user stats:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  const filteredQuizzes = stats.completedQuizzes.filter((q) => {
    if (activeTab === 'ai') return q.category.toUpperCase() === 'AI';
    if (activeTab === 'crypto') return q.category.toUpperCase() === 'CRYPTO';
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
          <span className="text-xs font-black text-[#2563EB]">
            {stats.totalPoints.toLocaleString()} XP
          </span>
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
              {stats.completedCount > 0 ? 'Active Learner' : 'New Learner'}
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
                  strokeDashoffset={251.2 * (1 - (stats.accuracyPercentage / 100))}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-lg font-black text-slate-900 leading-none">
                  {stats.accuracyPercentage}%
                </span>
                <span className="text-[9px] text-slate-400 font-bold mt-0.5">Accuracy</span>
              </div>
            </div>

            {/* 4 Stat Boxes */}
            <div className="flex-1 grid grid-cols-2 gap-2 text-xs">
              <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[9px] font-bold text-slate-400 uppercase block mb-0.5">
                  Quizzes
                </span>
                <span className="text-xs font-black text-slate-900">
                  {stats.completedCount} Completed
                </span>
              </div>
              <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[9px] font-bold text-slate-400 uppercase block mb-0.5">
                  Accuracy
                </span>
                <span className="text-xs font-black text-[#2563EB]">
                  {stats.totalQuestionsCorrect}/{stats.totalQuestionsAttempted} Correct
                </span>
              </div>
              <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[9px] font-bold text-slate-400 uppercase block mb-0.5">
                  Streak
                </span>
                <span className="text-xs font-black text-slate-900">
                  {stats.streakDays} {stats.streakDays === 1 ? 'Day' : 'Days'} 🔥
                </span>
              </div>
              <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[9px] font-bold text-slate-400 uppercase block mb-0.5">
                  Time Spent
                </span>
                <span className="text-xs font-black text-slate-900">
                  {stats.timeSpentFormatted}
                </span>
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
        {loading ? (
          <div className="text-center py-8 text-xs text-slate-400 font-medium">Loading stats...</div>
        ) : filteredQuizzes.length === 0 ? (
          <div className="bg-white border border-blue-100 rounded-xl p-8 text-center shadow-sm">
            <FileQuestion className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <h4 className="font-bold text-sm text-slate-900 mb-1">No completed tests yet</h4>
            <p className="text-xs text-slate-400 mb-4 max-w-xs mx-auto">
              Take your first quiz to track your accuracy, earn XP, and view detailed answer analytics!
            </p>
            <Link
              href={`/${locale}/play`}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#2563EB] text-white text-xs font-bold rounded-xl shadow-md hover:bg-[#1D4ED8] transition-all"
            >
              Start a Quiz
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="space-y-2.5">
            {filteredQuizzes.map((quiz) => {
              const Icon = quiz.category === 'AI' ? Brain : Bitcoin;
              const iconBg =
                quiz.category === 'AI'
                  ? 'bg-purple-50 text-purple-600 border border-purple-200'
                  : 'bg-amber-50 text-amber-600 border border-amber-200';

              return (
                <div
                  key={quiz.id}
                  className="bg-white border border-blue-100 rounded-xl p-3.5 shadow-sm hover:shadow-md transition-all"
                >
                  <div className="flex items-center justify-between gap-3 mb-2.5">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}
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
        )}
      </div>

      <BottomNav />
    </div>
  );
}
