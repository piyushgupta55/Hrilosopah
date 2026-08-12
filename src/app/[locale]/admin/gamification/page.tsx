'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Shield, Award, Zap, RefreshCw, Loader2, AlertCircle } from 'lucide-react';
import { AchievementsTab, AchievementItem } from '@/components/admin/AchievementsTab';
import { XpRulesTab, XpConfigItem } from '@/components/admin/XpRulesTab';

export default function AdminGamificationPage() {
  const params = useParams() || {};
  const locale = (params.locale as string) || 'en';

  const [activeTab, setActiveTab] = useState<'achievements' | 'xp_rules'>('achievements');
  const [achievements, setAchievements] = useState<AchievementItem[]>([]);
  const [xpConfig, setXpConfig] = useState<XpConfigItem | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  const fetchGamificationData = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/gamification', { cache: 'no-store' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to fetch gamification settings.');

      setAchievements(data.achievements || []);
      setXpConfig(data.xpConfig || null);
    } catch (err: any) {
      console.error('Fetch gamification error:', err);
      setError(err.message || 'Failed to load gamification rules');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGamificationData();
  }, []);

  const adminNav = [
    { label: 'Overview', href: `/${locale}/admin`, active: false },
    { label: 'Quizzes', href: `/${locale}/admin/quizzes`, active: false },
    { label: 'Learners & Moderation', href: `/${locale}/admin/users`, active: false },
    { label: 'Gamification Rules', href: `/${locale}/admin/gamification`, active: true },
    { label: 'Payments ($1)', href: `/${locale}/admin/payments`, active: false },
  ];

  return (
    <div className="w-full min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-sans">
      {/* Header */}
      <header className="w-full border-b border-blue-100 bg-white/95 backdrop-blur-lg px-4 sm:px-8 py-4 flex items-center justify-between sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-center text-[#2563EB]">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-black text-base sm:text-lg text-slate-900">
              Gamification & Rewards Control
            </h1>
            <span className="text-[11px] text-slate-500 font-semibold">
              Tune platform badges, achievement conditions & XP formula
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={fetchGamificationData}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
            title="Refresh Gamification Rules"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-8 space-y-6">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-gray-200 pb-4 overflow-x-auto no-scrollbar">
          {adminNav.map((tab) => (
            <Link
              key={tab.label}
              href={tab.href}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all whitespace-nowrap ${
                tab.active
                  ? 'bg-[#2563EB] text-white shadow-md shadow-blue-500/20'
                  : 'bg-white text-slate-600 hover:bg-blue-50 hover:text-[#2563EB] border border-blue-100'
              }`}
            >
              {tab.label}
            </Link>
          ))}
        </div>

        {/* Section Switcher Tabs */}
        <div className="flex items-center gap-3 border-b border-slate-200 pb-1">
          <button
            type="button"
            onClick={() => setActiveTab('achievements')}
            className={`px-5 py-3 font-extrabold text-xs sm:text-sm border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'achievements'
                ? 'border-[#2563EB] text-[#2563EB]'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Achievements & Badges</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('xp_rules')}
            className={`px-5 py-3 font-extrabold text-xs sm:text-sm border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'xp_rules'
                ? 'border-[#2563EB] text-[#2563EB]'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>XP Formula Rules</span>
          </button>
        </div>

        {/* Main Tab View Container */}
        {loading ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-blue-100 shadow-sm flex items-center justify-center gap-3 text-slate-600 font-extrabold text-sm">
            <Loader2 className="w-5 h-5 text-[#2563EB] animate-spin" />
            <span>Loading gamification rules...</span>
          </div>
        ) : error ? (
          <div className="p-8 bg-white border border-red-200 rounded-2xl text-center space-y-2">
            <AlertCircle className="w-6 h-6 text-red-600 mx-auto" />
            <p className="text-xs font-bold text-red-700">{error}</p>
          </div>
        ) : activeTab === 'achievements' ? (
          <AchievementsTab achievements={achievements} onRefresh={fetchGamificationData} />
        ) : (
          <XpRulesTab initialConfig={xpConfig} onRefresh={fetchGamificationData} />
        )}
      </main>
    </div>
  );
}
