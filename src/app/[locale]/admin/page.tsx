'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  Shield,
  Users,
  UserPlus,
  Activity,
  CheckCircle2,
  Calendar,
  Flame,
  BookOpen,
  FileEdit,
  TrendingUp,
  Globe,
  Trophy,
  ArrowRight,
  RefreshCw,
  BarChart3,
  PieChart,
} from 'lucide-react';
import { AdminSignOutButton } from '@/components/admin/AdminSignOutButton';

export interface AdminStatsData {
  totalUsers: number;
  newSignups7Days: number;
  dau: number;
  mau: number;
  completedToday: number;
  completedThisWeek: number;
  avgStreak: number;
  publishedQuizzes: number;
  draftQuizzes: number;
  topQuizzes: Array<{
    quizId: string;
    title: string;
    slug: string;
    completionsCount: number;
  }>;
  languageBreakdown: Array<{
    language: string;
    userCount: number;
  }>;
  completionsPerDay: Array<{
    dateLabel: string;
    count: number;
  }>;
}

export default function AdminHomePage() {
  const params = useParams() || {};
  const locale = (params.locale as string) || 'en';

  const [stats, setStats] = useState<AdminStatsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  const fetchStats = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/stats', { cache: 'no-store' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to fetch platform stats.');
      setStats(data.stats);
    } catch (err: any) {
      console.error('Fetch stats error:', err);
      setError(err.message || 'Could not load stats');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const formatStatValue = (val: number | undefined) => {
    if (val === undefined || val === null) return '—';
    return val.toLocaleString();
  };

  const maxCompletionCount = stats?.completionsPerDay
    ? Math.max(...stats.completionsPerDay.map((d) => d.count), 1)
    : 1;

  const totalLangUsers = stats?.languageBreakdown
    ? stats.languageBreakdown.reduce((acc, l) => acc + l.userCount, 0)
    : 1;

  const adminNav = [
    { label: 'Overview', href: `/${locale}/admin`, active: true },
    { label: 'Quizzes', href: `/${locale}/admin/quizzes`, active: false },
    { label: 'Questions', href: `/${locale}/admin/questions`, active: false },
    { label: 'Learners & Moderation', href: `/${locale}/admin/users`, active: false },
    { label: 'Payments ($1)', href: `/${locale}/admin/payments`, active: false },
  ];

  return (
    <div className="w-full min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-sans">
      {/* Header */}
      <header className="w-full border-b border-blue-100 bg-white/95 backdrop-blur-lg px-4 sm:px-8 py-4 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-center text-[#2563EB]">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-black text-base sm:text-lg text-slate-900 leading-none">
              Hrilosopah Platform Overview
            </h1>
            <span className="text-[11px] text-slate-500 font-semibold">
              Live system health, activity & analytics
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={fetchStats}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
            title="Refresh Platform Analytics"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <AdminSignOutButton locale={locale} />
        </div>
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-8 space-y-6">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-gray-200 pb-4 overflow-x-auto no-scrollbar">
          {adminNav.map((tab) => (
            <Link
              key={tab.label}
              href={tab.href}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all whitespace-nowrap ${
                tab.active
                  ? 'bg-[#2563EB] text-white shadow-md shadow-blue-500/20'
                  : 'bg-white text-slate-600 hover:bg-blue-50 hover:text-[#2563EB] border border-blue-100'
              }`}
            >
              {tab.label}
            </Link>
          ))}
        </div>

        {/* QUICK LINK CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            href={`/${locale}/admin/quizzes`}
            className="bg-white border border-blue-100 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-blue-300 transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 bg-blue-50 rounded-2xl border border-blue-200 flex items-center justify-center text-[#2563EB] group-hover:scale-105 transition-transform">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-black text-base text-slate-900 group-hover:text-[#2563EB] transition-colors">
                  Manage Quizzes
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Create, edit, publish & organize quiz content
                </p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-[#2563EB] group-hover:translate-x-1 transition-all" />
          </Link>

          <Link
            href={`/${locale}/admin/users`}
            className="bg-white border border-blue-100 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-blue-300 transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center justify-center text-emerald-600 group-hover:scale-105 transition-transform">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-black text-base text-slate-900 group-hover:text-emerald-600 transition-colors">
                  Manage Learners
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  View profiles, streaks, support overrides & moderation
                </p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
          </Link>
        </div>

        {/* 1. TOP AGGREGATE STATS CARDS GRID */}
        {loading ? (
          /* Loading Skeleton */
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-28 bg-slate-100 animate-pulse rounded-2xl border border-slate-200"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {/* Total Users */}
            <div className="bg-white border border-blue-100 rounded-2xl p-4 shadow-sm space-y-1">
              <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-blue-600" /> Total Users
              </span>
              <p className="text-2xl font-black text-slate-900">
                {formatStatValue(stats?.totalUsers)}
              </p>
              <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-0.5">
                <UserPlus className="w-3 h-3" /> +{formatStatValue(stats?.newSignups7Days)} (7d)
              </span>
            </div>

            {/* DAU & MAU */}
            <div className="bg-white border border-blue-100 rounded-2xl p-4 shadow-sm space-y-1">
              <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <Activity className="w-3.5 h-3.5 text-emerald-600" /> DAU / MAU
              </span>
              <p className="text-2xl font-black text-slate-900">
                {formatStatValue(stats?.dau)}{' '}
                <span className="text-xs text-slate-400 font-bold">
                  / {formatStatValue(stats?.mau)}
                </span>
              </p>
              <span className="text-[11px] font-semibold text-slate-500">Active learners</span>
            </div>

            {/* Quizzes Completed Today */}
            <div className="bg-white border border-blue-100 rounded-2xl p-4 shadow-sm space-y-1">
              <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-purple-600" /> Today Completed
              </span>
              <p className="text-2xl font-black text-slate-900">
                {formatStatValue(stats?.completedToday)}
              </p>
              <span className="text-[11px] font-semibold text-slate-500">
                {formatStatValue(stats?.completedThisWeek)} this week
              </span>
            </div>

            {/* Avg Streak Length */}
            <div className="bg-white border border-amber-100 rounded-2xl p-4 shadow-sm space-y-1">
              <span className="text-[11px] font-extrabold text-amber-600 uppercase tracking-wider flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" /> Avg Streak
              </span>
              <p className="text-2xl font-black text-amber-600">
                {stats?.avgStreak !== undefined ? `${stats.avgStreak} Days` : '—'}
              </p>
              <span className="text-[11px] font-semibold text-slate-500">
                Across active learners
              </span>
            </div>

            {/* Published Quizzes */}
            <div className="bg-white border border-blue-100 rounded-2xl p-4 shadow-sm space-y-1">
              <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5 text-[#2563EB]" /> Published Quizzes
              </span>
              <p className="text-2xl font-black text-slate-900">
                {formatStatValue(stats?.publishedQuizzes)}
              </p>
              <span className="text-[11px] font-semibold text-slate-500">
                {formatStatValue(stats?.draftQuizzes)} drafts
              </span>
            </div>

            {/* Draft Quizzes */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-1">
              <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <FileEdit className="w-3.5 h-3.5 text-slate-500" /> Draft Quizzes
              </span>
              <p className="text-2xl font-black text-slate-700">
                {formatStatValue(stats?.draftQuizzes)}
              </p>
              <span className="text-[11px] font-semibold text-slate-500">In authoring</span>
            </div>
          </div>
        )}

        {/* 2. CHARTS & BREAKDOWN SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Quiz Completions Bar Chart (Last 7 Days) */}
          <div className="bg-white border border-blue-100 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-black text-slate-900 text-sm flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-[#2563EB]" />
                <span>Quiz Completions (Last 7 Days)</span>
              </h3>
              <span className="text-xs text-slate-400 font-semibold">Daily activity</span>
            </div>

            {loading ? (
              <div className="h-48 bg-slate-100 animate-pulse rounded-xl" />
            ) : !stats?.completionsPerDay || stats.completionsPerDay.length === 0 ? (
              <p className="text-xs text-slate-500 italic text-center py-12">
                No completion data recorded yet.
              </p>
            ) : (
              <div className="h-48 flex items-end justify-between gap-2 pt-6 pb-2 px-2">
                {stats.completionsPerDay.map((day, idx) => {
                  const barHeightPct = Math.max(
                    10,
                    Math.round((day.count / maxCompletionCount) * 100)
                  );
                  return (
                    <div
                      key={idx}
                      className="flex-1 flex flex-col items-center gap-2 h-full justify-end group"
                    >
                      <span className="text-[10px] font-black text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">
                        {day.count}
                      </span>
                      <div
                        style={{ height: `${barHeightPct}%` }}
                        className="w-full max-w-[36px] bg-gradient-to-t from-[#2563EB] to-blue-400 rounded-t-lg transition-all group-hover:brightness-110 shadow-sm"
                      />
                      <span className="text-[10px] font-bold text-slate-500 truncate w-full text-center">
                        {day.dateLabel}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Preferred Language Breakdown Chart */}
          <div className="bg-white border border-blue-100 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-black text-slate-900 text-sm flex items-center gap-2">
                <Globe className="w-4 h-4 text-emerald-600" />
                <span>Learner Language Usage</span>
              </h3>
              <span className="text-xs text-slate-400 font-semibold">Distribution</span>
            </div>

            {loading ? (
              <div className="h-48 bg-slate-100 animate-pulse rounded-xl" />
            ) : !stats?.languageBreakdown || stats.languageBreakdown.length === 0 ? (
              <p className="text-xs text-slate-500 italic text-center py-12">
                No language data recorded yet.
              </p>
            ) : (
              <div className="space-y-3.5 pt-2">
                {stats.languageBreakdown.map((langItem, idx) => {
                  const pct = Math.round((langItem.userCount / totalLangUsers) * 100);
                  const colors = [
                    'bg-[#2563EB]',
                    'bg-emerald-500',
                    'bg-purple-500',
                    'bg-amber-500',
                    'bg-rose-500',
                  ];
                  const barColor = colors[idx % colors.length];

                  return (
                    <div key={langItem.language} className="space-y-1">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                        <span>{langItem.language}</span>
                        <span>
                          {langItem.userCount} users ({pct}%)
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                        <div
                          style={{ width: `${pct}%` }}
                          className={`h-full ${barColor} rounded-full transition-all duration-500`}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* 3. TOP 5 MOST-COMPLETED QUIZZES */}
        <section className="bg-white border border-blue-100 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-500" />
              <span>Top 5 Most-Completed Quizzes</span>
            </h3>
            <Link
              href={`/${locale}/admin/quizzes`}
              className="text-xs font-extrabold text-[#2563EB] hover:underline"
            >
              View All Quizzes →
            </Link>
          </div>

          {loading ? (
            <div className="space-y-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-10 bg-slate-100 animate-pulse rounded-xl" />
              ))}
            </div>
          ) : !stats?.topQuizzes || stats.topQuizzes.length === 0 ? (
            <p className="text-xs text-slate-500 italic">No quiz completions logged yet.</p>
          ) : (
            <div className="space-y-2.5">
              {stats.topQuizzes.map((quiz, idx) => (
                <div
                  key={quiz.quizId}
                  className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-xl hover:bg-blue-50/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg bg-blue-100 text-[#2563EB] font-black text-xs flex items-center justify-center shrink-0">
                      #{idx + 1}
                    </span>
                    <div>
                      <h4 className="font-black text-xs sm:text-sm text-slate-900">{quiz.title}</h4>
                      <span className="text-[11px] text-slate-500 font-mono">
                        /quiz/{quiz.slug}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-700 font-black text-xs rounded-xl border border-emerald-200">
                      {quiz.completionsCount} Completions
                    </span>
                    <Link
                      href={`/${locale}/admin/quizzes`}
                      className="p-1.5 bg-white border border-slate-200 rounded-lg text-slate-600 hover:text-[#2563EB] transition-colors"
                      title="Edit Quiz"
                    >
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
