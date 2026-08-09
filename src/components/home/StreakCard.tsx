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
  streakDays = 7,
  locale = 'en',
  labels = {
    streakDays: '7 Day Streak',
    keepItUp: 'Keep it up!',
    practiceNow: 'Practice Today',
  },
}: StreakCardProps) => {
  const [showModal, setShowModal] = useState(false);

  const weekDays = [
    { label: 'M', completed: true },
    { label: 'T', completed: true },
    { label: 'W', completed: true, isToday: true },
    { label: 'T', completed: true },
    { label: 'F', completed: true },
    { label: 'S', completed: true },
    { label: 'S', completed: true },
  ];

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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-sm bg-[#121722] border border-white/10 rounded-3xl p-6 text-white shadow-2xl relative overflow-hidden"
            >
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex flex-col items-center text-center mt-2 mb-6">
                <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-500 to-orange-400 flex items-center justify-center shadow-xl shadow-orange-500/30 mb-3">
                  <Flame className="w-10 h-10 text-white fill-white animate-pulse" />
                </div>
                <h3 className="text-2xl font-black text-white">{streakDays} Day Streak!</h3>
                <p className="text-xs text-gray-400 mt-1 max-w-[220px]">
                  You&apos;ve completed quizzes 7 days in a row! Keep practicing daily to protect
                  your streak.
                </p>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/5">
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-blue-400" />
                    <div className="text-left">
                      <div className="text-xs font-bold text-white">Streak Freeze</div>
                      <div className="text-[10px] text-gray-400">1 active protection</div>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                    Active
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/5">
                  <div className="flex items-center gap-3">
                    <Zap className="w-5 h-5 text-amber-400" />
                    <div className="text-left">
                      <div className="text-xs font-bold text-white">Daily Goal</div>
                      <div className="text-[10px] text-gray-400">1 Quiz completed today</div>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-400 text-[10px] font-bold">
                    Completed
                  </span>
                </div>
              </div>

              <Link
                href={`/${locale}/quiz/ai-awareness`}
                onClick={() => setShowModal(false)}
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition-all active:scale-[0.98]"
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
