'use client';

import React, { useState } from 'react';
import { QuizRunner } from './QuizRunner';
import {
  ArrowLeft,
  Share2,
  Star,
  Clock,
  FileText,
  BarChart2,
  Trophy,
  Globe,
  CheckCircle2,
  BookOpen,
  Lightbulb,
  Hexagon,
  Flame,
  TrendingUp,
  Play,
  List,
  Brain,
} from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export const QuizDetailWrapper = ({
  quizData,
  attemptId,
}: {
  quizData: any;
  attemptId: string;
}) => {
  const [started, setStarted] = useState(false);

  if (started) {
    return (
      <QuizRunner quizSlug={quizData.slug} attemptId={attemptId} questions={quizData.questions} />
    );
  }

  return (
    <div className="flex-1 w-full bg-[#F8F9FA] flex flex-col relative min-h-screen overflow-x-hidden pb-48">
      {/* Top Nav Removed */}

      <div className="px-5 pt-6 relative z-10">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left Text Content */}
          <div className="flex-1">
            <h4 className="text-[10px] font-bold text-purple-600 tracking-wider uppercase mb-2">
              {quizData.category || 'AI Fundamentals'}
            </h4>
            <h1 className="text-3xl font-extrabold text-gray-900 mb-2 leading-tight">
              {quizData.title}
            </h1>

            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="font-bold text-gray-900 text-sm">4.9</span>
              </div>
              <div className="w-px h-3 bg-gray-300"></div>
              <span className="text-sm text-gray-500 font-medium">12,000+ learners</span>
            </div>

            <p className="text-gray-600 text-sm leading-relaxed mb-6">
              {quizData.description ||
                "Learn the basic concepts of Artificial Intelligence and how it's shaping the future."}
            </p>
          </div>

          {/* Right Hero Composite Illustration */}
          <div className="relative w-full h-48 sm:w-48 sm:h-auto flex-shrink-0 flex items-center justify-center mb-4 sm:mb-0">
            {/* Soft Glow */}
            <div className="absolute w-40 h-40 bg-purple-400/20 rounded-full blur-2xl"></div>

            {/* The Brain Graphic */}
            <div className="relative z-10 w-28 h-28 flex items-center justify-center">
              <div className="absolute inset-0 bg-blue-600/10 rounded-full blur-md"></div>
              <Brain
                className="w-24 h-24 text-blue-600 fill-blue-500/20 drop-shadow-xl"
                strokeWidth={1}
              />
              <div className="absolute bg-blue-600 text-white font-bold text-sm px-2 py-1 rounded shadow-lg backdrop-blur-sm border border-blue-400/30">
                AI
              </div>
            </div>

            {/* Floating Element 1: Chart */}
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute left-4 bottom-8 bg-indigo-100/80 backdrop-blur-md p-2 rounded-xl shadow-sm border border-white/50"
            >
              <BarChart2 className="w-5 h-5 text-indigo-500" />
            </motion.div>

            {/* Floating Element 2: List */}
            <motion.div
              animate={{ y: [0, 5, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute right-0 top-4 bg-purple-100/80 backdrop-blur-md p-2 rounded-xl shadow-sm border border-white/50"
            >
              <List className="w-5 h-5 text-purple-500" />
            </motion.div>

            {/* Sparkles */}
            <Star className="absolute top-2 left-12 w-3 h-3 text-indigo-400 fill-indigo-400 opacity-60" />
            <Star className="absolute bottom-6 right-8 w-4 h-4 text-purple-400 fill-purple-400 opacity-60" />

            {/* Base platform */}
            <div className="absolute bottom-2 w-32 h-6 bg-blue-500/20 rounded-full blur-md"></div>
            <div className="absolute bottom-4 w-28 h-4 bg-blue-500/30 rounded-[100%] border border-blue-400/30"></div>
            <div className="absolute bottom-3 w-32 h-4 bg-blue-600/20 rounded-[100%]"></div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
          <div className="flex justify-between items-center px-1">
            <div className="flex flex-col items-center gap-1.5">
              <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                <Clock className="w-4 h-4 text-purple-600" />
              </div>
              <span className="font-bold text-gray-900 text-xs">10 Min</span>
              <span className="text-[9px] text-gray-500">Duration</span>
            </div>

            <div className="w-px h-8 bg-gray-100"></div>

            <div className="flex flex-col items-center gap-1.5">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <FileText className="w-4 h-4 text-blue-600" />
              </div>
              <span className="font-bold text-gray-900 text-xs">
                {quizData.questions?.length || 15}
              </span>
              <span className="text-[9px] text-gray-500">Questions</span>
            </div>

            <div className="w-px h-8 bg-gray-100"></div>

            <div className="flex flex-col items-center gap-1.5">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                <BarChart2 className="w-4 h-4 text-green-600" />
              </div>
              <span className="font-bold text-gray-900 text-xs">Beginner</span>
              <span className="text-[9px] text-gray-500">Difficulty</span>
            </div>

            <div className="w-px h-8 bg-gray-100"></div>

            <div className="flex flex-col items-center gap-1.5">
              <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                <Trophy className="w-4 h-4 text-orange-500" />
              </div>
              <span className="font-bold text-gray-900 text-xs">50 XP</span>
              <span className="text-[9px] text-gray-500">Reward</span>
            </div>

            <div className="w-px h-8 bg-gray-100"></div>

            <div className="flex flex-col items-center gap-1.5">
              <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                <Globe className="w-4 h-4 text-indigo-500" />
              </div>
              <span className="font-bold text-gray-900 text-xs">English</span>
              <span className="text-[9px] text-gray-500">Language</span>
            </div>
          </div>
        </div>

        {/* What You'll Learn */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-6 relative overflow-hidden">
          <h3 className="font-bold text-gray-900 text-base mb-4 relative z-10">
            What You&apos;ll Learn
          </h3>

          <div className="flex flex-col gap-3 relative z-10 pr-24">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-purple-600 fill-purple-100 mt-0.5 shrink-0" />
              <span className="text-xs font-medium text-gray-700">
                What is Artificial Intelligence?
              </span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-purple-600 fill-purple-100 mt-0.5 shrink-0" />
              <span className="text-xs font-medium text-gray-700">Machine Learning Basics</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-purple-600 fill-purple-100 mt-0.5 shrink-0" />
              <span className="text-xs font-medium text-gray-700">
                Neural Networks in Simple Terms
              </span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-purple-600 fill-purple-100 mt-0.5 shrink-0" />
              <span className="text-xs font-medium text-gray-700">Generative AI and its Uses</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-purple-600 fill-purple-100 mt-0.5 shrink-0" />
              <span className="text-xs font-medium text-gray-700">
                Real-world Applications of AI
              </span>
            </div>
          </div>

          {/* Book Illustration composite on the right */}
          <div className="absolute right-0 bottom-4 w-32 h-32 opacity-80 pointer-events-none">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                <BookOpen className="w-24 h-24 text-indigo-500/80 drop-shadow-md" strokeWidth={1} />
                <div className="absolute -top-8 left-1/2 -translate-x-1/2">
                  <div className="relative">
                    <div className="absolute inset-0 bg-purple-400/40 rounded-full blur-xl"></div>
                    <Lightbulb className="w-10 h-10 text-purple-600 fill-purple-100 drop-shadow-sm relative z-10" />
                  </div>
                </div>
                <Star className="absolute -top-12 -left-4 w-3 h-3 text-purple-300 fill-purple-300" />
                <Star className="absolute -top-4 -right-4 w-2 h-2 text-indigo-300 fill-indigo-300" />
              </div>
            </div>
          </div>
        </div>

        {/* Quiz Rewards */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-6">
          <h3 className="font-bold text-gray-900 text-base mb-4">Quiz Rewards</h3>
          <div className="flex justify-between items-start">
            <div className="flex flex-col items-center gap-2 w-1/4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center relative">
                <Hexagon className="w-8 h-8 text-purple-500 fill-purple-500 absolute" />
                <Star className="w-3 h-3 text-white fill-white relative z-10" />
              </div>
              <span className="text-[9px] text-gray-600 text-center leading-tight flex flex-col">
                <span>Achievement</span>
                <span>Badge</span>
              </span>
            </div>

            <div className="flex flex-col items-center gap-2 w-1/4">
              <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center">
                <Flame className="w-6 h-6 text-orange-500 fill-orange-500" />
              </div>
              <span className="text-[9px] text-gray-600 text-center leading-tight flex flex-col">
                <span>Streak</span>
                <span>XP</span>
              </span>
            </div>

            <div className="flex flex-col items-center gap-2 w-1/4">
              <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-500" strokeWidth={3} />
              </div>
              <span className="text-[9px] text-gray-600 text-center leading-tight flex flex-col">
                <span>Progress</span>
                <span>Tracking</span>
              </span>
            </div>

            <div className="flex flex-col items-center gap-2 w-1/4">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                <div className="relative">
                  <FileText className="w-6 h-6 text-blue-500" />
                  <BarChart2 className="w-3 h-3 text-blue-600 absolute bottom-1 right-1 bg-blue-50 rounded-sm" />
                </div>
              </div>
              <span className="text-[9px] text-gray-600 text-center leading-tight flex flex-col">
                <span>Detailed Report</span>
                <span>After Completion</span>
              </span>
            </div>
          </div>
        </div>

        {/* Your Progress */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-6">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold text-gray-900 text-base">Your Progress</h3>
            <span className="font-bold text-purple-600 text-xs">0%</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2 mb-2 overflow-hidden">
            <div className="bg-purple-600 h-2 rounded-full w-0"></div>
          </div>
          <p className="text-[10px] text-gray-500 font-medium">
            0 / {quizData.questions?.length || 15} Completed
          </p>
        </div>
      </div>

      {/* Fixed Bottom Actions */}
      <div className="fixed bottom-0 left-0 w-full bg-[#F8F9FA]/90 backdrop-blur-xl border-t border-gray-200 p-5 z-50">
        <div className="max-w-md mx-auto flex flex-col gap-3">
          <button
            onClick={() => setStarted(true)}
            className="w-full bg-[#1D4ED8] hover:bg-blue-800 text-white font-bold text-base py-3.5 rounded-xl shadow-[0_8px_16px_-4px_rgba(29,78,216,0.3)] flex items-center justify-center gap-2 transition-colors relative"
          >
            <div className="absolute left-6">
              <Play className="w-5 h-5 fill-white" />
            </div>
            Start Quiz
            <div className="absolute right-6">
              <ArrowLeft className="w-5 h-5 rotate-180" />
            </div>
          </button>

          <div className="flex items-center justify-center gap-1.5 mt-1">
            <Clock className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-[10px] text-gray-500 font-medium">
              Average completion time: 10 minutes
            </span>
          </div>

          {/* Safe Area padding */}
          <div className="h-[env(safe-area-inset-bottom)]"></div>
        </div>
      </div>
    </div>
  );
};
