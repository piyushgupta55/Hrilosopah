'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { BottomNav } from '@/components/home/BottomNav';
import {
  Settings,
  Flame,
  Clock,
  CheckCircle2,
  Award,
  ChevronRight,
  Bookmark,
  Heart,
  Target,
  User,
  Brain,
  Bitcoin,
  X,
  Zap,
  Check,
} from 'lucide-react';

interface ProfilePageClientProps {
  locale: string;
  userName: string;
  userEmail: string;
  userAvatarInitial: string;
}

export function ProfilePageClient({
  locale,
  userName,
  userEmail,
  userAvatarInitial,
}: ProfilePageClientProps) {
  const [activeModal, setActiveModal] = useState<
    'achievements' | 'saved' | 'topics' | 'goals' | null
  >(null);
  const [dailyGoal, setDailyGoal] = useState('15');
  const [favTopics, setFavTopics] = useState<string[]>(['AI', 'Crypto']);

  const achievementsList = [
    {
      title: 'AI Rookie',
      desc: 'Completed 5 AI Quizzes',
      icon: Brain,
      bg: 'bg-purple-100 text-purple-600',
      unlocked: true,
    },
    {
      title: 'Crypto Novice',
      desc: 'Completed 5 Crypto Quizzes',
      icon: Bitcoin,
      bg: 'bg-amber-100 text-amber-600',
      unlocked: true,
    },
    {
      title: '7 Day Streak',
      desc: 'Maintained 7 day streak',
      icon: Flame,
      bg: 'bg-orange-100 text-orange-600',
      unlocked: true,
    },
    {
      title: 'Perfect Score',
      desc: 'Scored 100% accuracy',
      icon: Award,
      bg: 'bg-yellow-100 text-yellow-600',
      unlocked: true,
    },
    {
      title: 'AI Master',
      desc: 'Complete 20 AI Quizzes',
      icon: Brain,
      bg: 'bg-[#EFF6FF] text-[#2563EB]',
      unlocked: false,
    },
    {
      title: 'Blockchain Architect',
      desc: 'Complete 20 Crypto Quizzes',
      icon: Bitcoin,
      bg: 'bg-blue-100 text-blue-600',
      unlocked: false,
    },
  ];

  const savedQuizzesList = [
    {
      title: 'AI Awareness & LLM Architecture',
      qCount: 15,
      duration: '5 mins',
      category: 'AI',
      slug: 'ai-awareness',
    },
    {
      title: 'Crypto Fundamentals & Bitcoin',
      qCount: 15,
      duration: '6 mins',
      category: 'Crypto',
      slug: 'crypto-fundamentals',
    },
  ];

  const toggleTopic = (topic: string) => {
    setFavTopics((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]
    );
  };

  return (
    <div
      className="flex-1 w-full bg-[#F8FAFC] flex flex-col overflow-y-auto overflow-x-hidden relative font-sans"
      style={{ paddingBottom: 'calc(5.5rem + env(safe-area-inset-bottom))' }}
    >
      {/* Header with Blue Gradient */}
      <div className="w-full bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] pt-10 pb-20 px-5 relative rounded-b-[32px] text-white">
        <div className="flex items-center justify-between mb-6">
          <span className="font-extrabold text-[#93C5FD] tracking-wide text-xs uppercase">
            Learner Profile
          </span>
          <Link
            href={`/${locale}/settings`}
            className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors backdrop-blur-md"
          >
            <Settings className="w-5 h-5" />
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white text-[#2563EB] font-black text-2xl flex items-center justify-center shadow-lg shrink-0 border-2 border-white/20">
            {userAvatarInitial}
          </div>
          <div>
            <h2 className="text-xl font-black leading-snug">{userName}</h2>
            <p className="text-xs text-[#BFDBFE] font-medium">{userEmail}</p>
            <span className="inline-block mt-1 px-2.5 py-0.5 bg-white/15 text-white text-[10px] font-bold rounded-full border border-white/20 backdrop-blur-md">
              Hrilosopah Scholar
            </span>
          </div>
        </div>
      </div>

      {/* Stats Card Overlap */}
      <div className="px-5 w-full -mt-12 mb-6 relative z-10">
        <div className="bg-white rounded-xl shadow-md border border-blue-100 p-4 flex items-center justify-between text-center divide-x divide-gray-100">
          <div className="flex flex-col items-center flex-1 px-2">
            <CheckCircle2 className="w-5 h-5 text-[#2563EB] mb-1" />
            <span className="font-black text-lg text-slate-900 leading-none">24</span>
            <span className="text-[10px] text-slate-400 font-bold mt-1">Completed</span>
          </div>

          <div className="flex flex-col items-center flex-1 px-2">
            <Flame className="w-5 h-5 text-orange-500 fill-orange-500 mb-1" />
            <span className="font-black text-lg text-slate-900 leading-none">7 Days</span>
            <span className="text-[10px] text-slate-400 font-bold mt-1">Streak</span>
          </div>

          <div className="flex flex-col items-center flex-1 px-2">
            <Clock className="w-5 h-5 text-[#2563EB] mb-1" />
            <span className="font-black text-lg text-slate-900 leading-none">3h 20m</span>
            <span className="text-[10px] text-slate-400 font-bold mt-1">Time Spent</span>
          </div>
        </div>
      </div>

      {/* Achievements Section */}
      <div className="w-full mb-6">
        <div className="px-5 flex items-center justify-between mb-3">
          <h3 className="font-extrabold text-slate-900 text-base">Achievements</h3>
          <button
            onClick={() => setActiveModal('achievements')}
            className="text-[#2563EB] text-xs font-extrabold hover:text-[#1D4ED8] transition-colors"
          >
            See all
          </button>
        </div>

        <div className="w-full overflow-x-auto no-scrollbar pl-5 pr-5 pb-2">
          <div className="flex items-center gap-3">
            {achievementsList.slice(0, 4).map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  onClick={() => setActiveModal('achievements')}
                  className="w-[120px] bg-white border border-blue-100 rounded-xl p-3 flex flex-col items-center text-center shadow-sm shrink-0 cursor-pointer hover:shadow-md transition-all active:scale-[0.98]"
                >
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center mb-2.5 ${item.bg}`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <h4 className="font-extrabold text-xs text-slate-900 mb-0.5">{item.title}</h4>
                  <p className="text-[9px] text-slate-400 leading-tight">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Interactive Quick Links */}
      <div className="px-5 w-full mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-blue-100 overflow-hidden divide-y divide-gray-100">
          <button
            onClick={() => setActiveModal('saved')}
            className="w-full px-5 py-3.5 flex items-center justify-between hover:bg-blue-50/50 transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#2563EB] flex items-center justify-center">
                <Bookmark className="w-4 h-4" />
              </div>
              <div>
                <span className="font-extrabold text-sm text-slate-900 block">Saved Quizzes</span>
                <span className="text-[10px] text-slate-400 font-medium">
                  {savedQuizzesList.length} Quizzes bookmarked
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>

          <button
            onClick={() => setActiveModal('topics')}
            className="w-full px-5 py-3.5 flex items-center justify-between hover:bg-blue-50/50 transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#2563EB] flex items-center justify-center">
                <Heart className="w-4 h-4" />
              </div>
              <div>
                <span className="font-extrabold text-sm text-slate-900 block">
                  Favourite Topics
                </span>
                <span className="text-[10px] text-slate-400 font-medium">
                  {favTopics.join(', ')} selected
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>

          <button
            onClick={() => setActiveModal('goals')}
            className="w-full px-5 py-3.5 flex items-center justify-between hover:bg-blue-50/50 transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#2563EB] flex items-center justify-center">
                <Target className="w-4 h-4" />
              </div>
              <div>
                <span className="font-extrabold text-sm text-slate-900 block">Learning Goals</span>
                <span className="text-[10px] text-slate-400 font-medium">
                  {dailyGoal} Mins / day target
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>
        </div>
      </div>

      {/* Account Settings */}
      <div className="px-5 w-full mb-6">
        <h3 className="font-extrabold text-slate-900 text-base mb-3">Account</h3>
        <div className="bg-white rounded-xl shadow-sm border border-blue-100 overflow-hidden">
          <Link
            href={`/${locale}/settings`}
            className="w-full px-5 py-3.5 flex items-center justify-between hover:bg-blue-50/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#2563EB] flex items-center justify-center">
                <User className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-sm text-slate-900">Account Settings</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </Link>
        </div>
      </div>

      {/* MODALS */}
      {/* 1. Achievements Modal */}
      {activeModal === 'achievements' && (
        <div className="fixed inset-0 z-[200] bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
                <Award className="w-5 h-5 text-[#2563EB]" />
                All Achievements & Badges
              </h3>
              <button
                onClick={() => setActiveModal(null)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-900"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto pr-1">
              {achievementsList.map((badge, i) => {
                const BIcon = badge.icon;
                return (
                  <div
                    key={i}
                    className={`p-3 rounded-xl border flex flex-col items-center text-center ${
                      badge.unlocked
                        ? 'bg-white border-blue-100 shadow-sm'
                        : 'bg-slate-50 border-slate-200 opacity-60'
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center mb-2 ${badge.bg}`}
                    >
                      <BIcon className="w-5 h-5" />
                    </div>
                    <h4 className="font-bold text-xs text-slate-900">{badge.title}</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">{badge.desc}</p>
                    <span
                      className={`mt-2 px-2 py-0.5 text-[9px] font-extrabold rounded-full ${
                        badge.unlocked
                          ? 'bg-blue-50 text-[#2563EB] border border-blue-100'
                          : 'bg-slate-200 text-slate-500'
                      }`}
                    >
                      {badge.unlocked ? 'Unlocked ✓' : 'Locked 🔒'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 2. Saved Quizzes Modal */}
      {activeModal === 'saved' && (
        <div className="fixed inset-0 z-[200] bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
                <Bookmark className="w-5 h-5 text-[#2563EB]" />
                Bookmarked Quizzes
              </h3>
              <button
                onClick={() => setActiveModal(null)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-900"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 max-h-[50vh] overflow-y-auto">
              {savedQuizzesList.map((quiz, i) => (
                <div
                  key={i}
                  className="p-3.5 rounded-xl border border-blue-100 bg-white flex items-center justify-between gap-3 shadow-sm"
                >
                  <div>
                    <span className="text-[10px] font-bold text-[#2563EB] uppercase block mb-0.5">
                      {quiz.category}
                    </span>
                    <h4 className="font-bold text-xs text-slate-900">{quiz.title}</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      {quiz.qCount} Questions • {quiz.duration}
                    </p>
                  </div>
                  <Link
                    href={`/${locale}/quiz/${quiz.slug}`}
                    className="px-3 py-1.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold rounded-lg shrink-0 shadow-sm"
                  >
                    Play Now
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. Favourite Topics Modal */}
      {activeModal === 'topics' && (
        <div className="fixed inset-0 z-[200] bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
                <Heart className="w-5 h-5 text-[#2563EB]" />
                Select Favourite Topics
              </h3>
              <button
                onClick={() => setActiveModal(null)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-900"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {['AI', 'Crypto', 'Machine Learning', 'Blockchain', 'Web3', 'Data Science'].map(
                (topic) => {
                  const isSelected = favTopics.includes(topic);
                  return (
                    <button
                      key={topic}
                      onClick={() => toggleTopic(topic)}
                      className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-between transition-all ${
                        isSelected
                          ? 'bg-blue-50 border-[#2563EB] text-[#2563EB]'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span>{topic}</span>
                      {isSelected && <Check className="w-4 h-4 text-[#2563EB]" />}
                    </button>
                  );
                }
              )}
            </div>

            <button
              onClick={() => setActiveModal(null)}
              className="w-full py-3 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs rounded-xl shadow-md transition-all"
            >
              Save Preferred Topics
            </button>
          </div>
        </div>
      )}

      {/* 4. Learning Goals Modal */}
      {activeModal === 'goals' && (
        <div className="fixed inset-0 z-[200] bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
                <Target className="w-5 h-5 text-[#2563EB]" />
                Set Daily Learning Goal
              </h3>
              <button
                onClick={() => setActiveModal(null)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-900"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5">
              {[
                { label: '5 Minutes', val: '5', desc: 'Casual practice' },
                { label: '10 Minutes', val: '10', desc: 'Regular learner' },
                { label: '15 Minutes', val: '15', desc: 'Serious scholar (Recommended)' },
                { label: '20+ Minutes', val: '20', desc: 'Intensive mastery' },
              ].map((g) => (
                <button
                  key={g.val}
                  onClick={() => setDailyGoal(g.val)}
                  className={`w-full p-3.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                    dailyGoal === g.val
                      ? 'bg-blue-50 border-[#2563EB] text-[#2563EB]'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div>
                    <h4 className="font-extrabold text-xs">{g.label}</h4>
                    <p className="text-[10px] text-slate-400">{g.desc}</p>
                  </div>
                  {dailyGoal === g.val && <Check className="w-4 h-4 text-[#2563EB]" />}
                </button>
              ))}
            </div>

            <button
              onClick={() => setActiveModal(null)}
              className="w-full py-3 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs rounded-xl shadow-md transition-all"
            >
              Update Learning Goal
            </button>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}
