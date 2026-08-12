'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Hexagon, Check, X, Shield, Zap } from 'lucide-react';

interface StreakCardProps {
  streakDays?: number;
  locale?: string;
  labels?: {
    streakDays: string;
    keepItUp: string;
    practiceNow?: string;
  };
}

export const StreakCard = ({
  streakDays = 0,
  locale = 'en',
  labels = {
    streakDays: '0 Day Streak',
    keepItUp: 'Start your streak today!',
    practiceNow: 'Practice Today',
  },
}: StreakCardProps) => {
  const [showModal, setShowModal] = useState(false);

  // Compute weekDays status dynamically based on streakDays
  const daysOfWeek = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const todayIdx = (new Date().getDay() + 6) % 7; // Monday = 0, Sunday = 6

  const weekDays = daysOfWeek.map((label, idx) => {
    const isToday = idx === todayIdx;
    const isCompleted = streakDays > 0 && idx <= todayIdx && todayIdx - idx < streakDays;
    return {
      label,
      completed: isCompleted,
      isToday,
    };
  });

  return (
    <>
      <div
        onClick={() => setShowModal(true)}
        className="w-full bg-gradient-to-r from-[#4F46E5] via-[#4338CA] to-[#3B82F6] rounded-2xl p-5 text-white shadow-xl shadow-blue-600/20 relative overflow-hidden cursor-pointer group hover:shadow-2xl transition-all duration-300 active:scale-[0.99]"
      >
        {/* Glow Effects */}
        <div className="absolute -top-12 -right-12 w-44 h-44 bg-white/10 rounded-full blur-2xl group-hover:scale-110 transition-transform"></div>
        <div className="absolute -bottom-10 -left-10 w-36 h-36 bg-blue-400/20 rounded-full blur-xl"></div>

        <div className="flex justify-between items-start mb-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Flame className="w-5 h-5 text-amber-400 fill-amber-400 animate-pulse" />
              <h3 className="font-bold text-xl text-white tracking-tight">{labels.streakDays}</h3>
            </div>
            <p className="text-blue-100 text-xs font-medium flex items-center gap-1">
              <span>{labels.keepItUp}</span>
              <span className="text-amber-300 font-bold">• Tap for details</span>
            </p>
          </div>

          {/* Hexagon Badge */}
          <div className="relative flex items-center justify-center group-hover:scale-105 transition-transform">
            <Hexagon
              className="w-[3.5rem] h-[3.5rem] text-white/30 fill-white/15"
              strokeWidth={1.5}
            />
            <span className="absolute text-2xl font-black text-white drop-shadow-sm">
              {streakDays}
            </span>
          </div>
        </div>

        {/* Days Circle Row */}
        <div className="flex justify-between items-center relative z-10 px-1">
          {weekDays.map((day, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              {day.isToday ? (
                <div className="w-7 h-7 rounded-full bg-amber-400 text-indigo-950 flex items-center justify-center shadow-lg shadow-amber-400/50 ring-2 ring-white animate-bounce">
                  <Flame className="w-4 h-4 fill-indigo-950" />
                </div>
              ) : day.completed ? (
                <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center shadow-md">
                  <Check className="w-3.5 h-3.5 text-blue-600 stroke-[3]" />
                </div>
              ) : (
                <div className="w-6 h-6 rounded-full bg-white/20 border border-white/40 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-white/60"></div>
                </div>
              )}
              <span
                className={`text-[11px] font-bold ${
                  day.isToday ? 'text-amber-300 font-black' : 'text-blue-100'
                }`}
              >
                {day.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Streak Detail Interactive Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-sm bg-white border border-gray-100 rounded-3xl p-6 text-gray-900 shadow-2xl relative overflow-hidden"
            >
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-900 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex flex-col items-center text-center mt-2 mb-6">
                <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-500 to-orange-400 flex items-center justify-center shadow-lg shadow-orange-500/20 mb-3">
                  <Flame className="w-10 h-10 text-white fill-white animate-pulse" />
                </div>
                <h3 className="text-2xl font-black text-gray-900">{streakDays} Day Streak!</h3>
                <p className="text-xs text-gray-500 mt-1 max-w-[220px]">
                  {streakDays > 0
                    ? `You've completed quizzes ${streakDays} ${streakDays === 1 ? 'day' : 'days'} in a row! Keep practicing daily to protect your streak.`
                    : 'Complete a quiz today to start your learning streak!'}
                </p>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-blue-50/60 border border-blue-100/80">
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-blue-600" />
                    <div className="text-left">
                      <div className="text-xs font-bold text-gray-900">Streak Freeze</div>
                      <div className="text-[10px] text-gray-500">1 active protection</div>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-[12px] bg-emerald-600 text-white text-[11px] font-bold shadow-sm">
                    Active
                  </span>
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-blue-50/60 border border-blue-100/80">
                  <div className="flex items-center gap-3">
                    <Zap className="w-5 h-5 text-amber-500" />
                    <div className="text-left">
                      <div className="text-xs font-bold text-gray-900">Daily Goal</div>
                      <div className="text-[10px] text-gray-500">
                        {streakDays > 0 ? 'Quiz completed today' : 'No quiz completed today'}
                      </div>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-[12px] text-[11px] font-bold shadow-sm ${
                      streakDays > 0 ? 'bg-blue-600 text-white' : 'bg-slate-700 text-white'
                    }`}
                  >
                    {streakDays > 0 ? 'Completed' : 'Pending'}
                  </span>
                </div>
              </div>

              <Link
                href={`/${locale}/quiz/ai-awareness`}
                onClick={() => setShowModal(false)}
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-600/25 transition-all active:scale-[0.98]"
              >
                <span>Continue Today&apos;s Quiz</span>
              </Link>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
