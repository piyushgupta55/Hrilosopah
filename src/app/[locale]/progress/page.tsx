import React from 'react';
import Link from 'next/link';
import { BottomNav } from '@/components/home/BottomNav';
import { Calendar, CheckCircle2, Check, HelpCircle, Flame, CheckCircle, Brain } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function ProgressPage({ params: { locale } }: { params: { locale: string } }) {
  const t = useTranslations('Progress');
  const tHome = useTranslations('Home');

  return (
    <div
      className="flex-1 w-full bg-[#F8F9FA] pt-4 flex flex-col overflow-y-auto overflow-x-hidden relative"
      style={{ paddingBottom: 'calc(5.5rem + env(safe-area-inset-bottom))' }}
    >
      {/* Header */}
      <div className="px-5 w-full flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">{t('title')}</h1>
        <button className="w-10 h-10 rounded-full flex items-center justify-center text-gray-900 hover:bg-gray-100 transition-colors">
          <Calendar className="w-5 h-5" />
        </button>
      </div>

      {/* Overall Progress */}
      <div className="px-5 w-full mb-6">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-900 text-sm mb-4">{t('overallProgress')}</h3>

          <div className="flex items-center gap-6">
            {/* Circular Chart */}
            <div className="relative w-28 h-28 shrink-0">
              <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" stroke="#EEF2FF" strokeWidth="8" fill="none" />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="#4F46E5"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray="251.2"
                  strokeDashoffset={251.2 * (1 - 0.68)}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-gray-900 leading-tight">68%</span>
                <span className="text-[10px] text-gray-500 font-medium">Overall</span>
              </div>
            </div>

            {/* Stats List */}
            <div className="flex-1 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                  <span className="text-xs text-gray-600 font-medium">{t('quizzesCompleted')}</span>
                </div>
                <span className="text-xs font-bold text-gray-900">24</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  <span className="text-xs text-gray-600 font-medium">{t('correctAnswers')}</span>
                </div>
                <span className="text-xs font-bold text-gray-900">218</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-blue-500" />
                  <span className="text-xs text-gray-600 font-medium">{t('totalQuestions')}</span>
                </div>
                <span className="text-xs font-bold text-gray-900">320</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Flame className="w-4 h-4 text-orange-400 fill-orange-400" />
                  <span className="text-xs text-gray-600 font-medium">{t('currentStreak')}</span>
                </div>
                <span className="text-xs font-bold text-gray-900">7 days</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Your Learning Journey */}
      <div className="px-5 w-full mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-900 text-lg">{t('learningJourney')}</h3>
          <button className="text-gray-500 text-xs font-semibold flex items-center gap-1 bg-white border border-gray-100 rounded-full px-3 py-1.5 shadow-sm">
            This Month <span className="text-[10px]">▼</span>
          </button>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 h-48 relative overflow-hidden">
          {/* Simple SVG Line Chart */}
          <div className="absolute top-5 left-5 bottom-8 right-5 border-l border-b border-gray-100">
            {/* Y Axis Labels */}
            <div className="absolute -left-5 h-full flex flex-col justify-between text-[10px] text-gray-400 pb-2">
              <span>100</span>
              <span>75</span>
              <span>50</span>
              <span>25</span>
              <span>0</span>
            </div>

            {/* X Axis Labels */}
            <div className="absolute -bottom-6 w-full flex justify-between text-[10px] text-gray-400">
              <span>May 1</span>
              <span>May 8</span>
              <span>May 15</span>
              <span>May 22</span>
              <span>May 29</span>
            </div>

            {/* SVG Line and Area */}
            <svg
              className="w-full h-full overflow-visible"
              preserveAspectRatio="none"
              viewBox="0 0 100 100"
            >
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#4F46E5" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#4F46E5" stopOpacity="0" />
                </linearGradient>
              </defs>
              <polyline
                points="0,90 20,80 40,70 60,65 80,45 100,20"
                fill="none"
                stroke="#4F46E5"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <polygon
                points="0,90 20,80 40,70 60,65 80,45 100,20 100,100 0,100"
                fill="url(#gradient)"
              />
              {/* Data Point */}
              <circle cx="100" cy="20" r="3" fill="#4F46E5" className="shadow-lg" />
            </svg>

            {/* Tooltip on last point */}
            <div className="absolute right-0 top-0 -mt-2 -mr-3 flex flex-col items-center">
              <div className="bg-[#4F46E5] text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-md mb-1">
                May 29
                <br />
                85%
              </div>
              <div className="w-2 h-2 bg-[#4F46E5] transform rotate-45 -mt-2.5"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Subject Wise Progress */}
      <div className="px-5 w-full mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-900 text-lg">{t('subjectWise')}</h3>
          <button className="text-blue-600 text-sm font-semibold hover:text-blue-700">
            {tHome('seeAll')}
          </button>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex flex-col gap-5">
          {/* AI */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#F3E8FF] flex items-center justify-center shrink-0">
                  <Brain className="w-5 h-5 text-purple-600" strokeWidth={1.5} />
                </div>
                <h4 className="font-bold text-sm text-gray-900">Artificial Intelligence</h4>
              </div>
            </div>
            <div className="flex items-center gap-3 pl-13">
              <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-600 rounded-full" style={{ width: '72%' }}></div>
              </div>
              <span className="text-xs font-bold text-gray-900 w-8">72%</span>
              <span className="text-[10px] text-gray-500 font-medium">16/22 Quizzes</span>
            </div>
          </div>

          <div className="w-full h-[1px] bg-gray-100"></div>

          {/* Crypto */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#E0F2FE] flex items-center justify-center text-xl text-[#3B82F6] font-bold shrink-0">
                  ₿
                </div>
                <h4 className="font-bold text-sm text-gray-900">Crypto & Blockchain</h4>
              </div>
            </div>
            <div className="flex items-center gap-3 pl-13">
              <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-600 rounded-full" style={{ width: '65%' }}></div>
              </div>
              <span className="text-xs font-bold text-gray-900 w-8">65%</span>
              <span className="text-[10px] text-gray-500 font-medium">13/20 Quizzes</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="px-5 w-full mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-900 text-lg">{t('recentActivity')}</h3>
          <button className="text-blue-600 text-sm font-semibold hover:text-blue-700">
            {tHome('seeAll')}
          </button>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-[#ECFDF5] flex items-center justify-center shrink-0">
            <CheckCircle className="w-6 h-6 text-[#10B981]" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-gray-900 text-sm mb-0.5">AI Awareness Quiz</h4>
            <p className="text-gray-500 text-xs">Completed • May 29, 2024</p>
          </div>
          <div className="px-3 py-1 bg-[#ECFDF5] text-[#10B981] text-xs font-bold rounded-lg shadow-sm">
            85%
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
