'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { StepHeader } from '../StepHeader';
import { PrimaryButton } from '../PrimaryButton';
import { Trophy, ChevronRight, Brain, Bitcoin } from 'lucide-react';

interface StepReadyProps {
  onNext: () => void;
}

export const StepReady = ({ onNext }: StepReadyProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="flex-1 flex flex-col justify-between pb-6 h-full"
    >
      <div>
        <StepHeader
          title={<span className="text-[#0052FF]">You&apos;re all set!</span>}
          subtitle="Your personalized learning journey starts now."
        />

        {/* Custom Illustration */}
        <div className="w-full flex justify-center py-6">
          <div className="relative w-48 h-32 flex items-end justify-center">
            {/* Stars */}
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute top-2 left-6 text-[#A78BFA]"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
              </svg>
            </motion.div>
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2.5, repeat: Infinity }}
              className="absolute top-8 right-4 text-[#A78BFA]"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
              </svg>
            </motion.div>
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute bottom-6 left-0 text-[#A78BFA]"
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
              </svg>
            </motion.div>

            {/* Laptop Base */}
            <div className="absolute bottom-0 w-32 h-20 bg-white border-2 border-[#8B5CF6] rounded-t-lg z-10 flex flex-col items-center pt-2">
              <div className="w-6 h-6 rounded-full border-2 border-[#8B5CF6] flex items-center justify-center">
                <div className="w-2 h-3 border border-[#8B5CF6] rounded-full" />
              </div>
            </div>
            <div className="absolute -bottom-1 w-40 h-2 bg-[#8B5CF6] rounded-full z-20" />

            {/* Trophy */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: -10, opacity: 1 }}
              transition={{ delay: 0.3, type: 'spring' }}
              className="absolute bottom-16 z-0 text-[#0052FF]"
            >
              <Trophy className="w-16 h-16" strokeWidth={1.5} />
            </motion.div>
          </div>
        </div>

        <div className="mt-2">
          <h3 className="font-bold text-[15px] text-[#111827] mb-3">Recommended for you</h3>
          <div className="space-y-3">
            <div className="flex items-center p-3 border border-[#F3F4F6] rounded-[16px] shadow-sm bg-white">
              <div className="w-10 h-10 rounded-[10px] bg-[#F5F3FF] flex items-center justify-center mr-3">
                <Brain className="w-6 h-6 text-[#8B5CF6]" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-[14px] text-[#111827]">AI Awareness Quiz</h4>
                <p className="text-[12px] text-[#6B7280]">Beginner • 10-15 Qs</p>
              </div>
              <ChevronRight className="w-5 h-5 text-[#9CA3AF]" />
            </div>

            <div className="flex items-center p-3 border border-[#F3F4F6] rounded-[16px] shadow-sm bg-white">
              <div className="w-10 h-10 rounded-[10px] bg-[#F5F3FF] flex items-center justify-center mr-3">
                <Bitcoin className="w-6 h-6 text-[#8B5CF6]" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-[14px] text-[#111827]">Crypto Fundamentals</h4>
                <p className="text-[12px] text-[#6B7280]">Beginner • 10-15 Qs</p>
              </div>
              <ChevronRight className="w-5 h-5 text-[#9CA3AF]" />
            </div>
          </div>
        </div>
      </div>

      <div className="w-full mt-8 space-y-3">
        <PrimaryButton label="Start Exploring" onClick={onNext} />
        <button
          onClick={onNext}
          className="w-full py-4 text-[#6B7280] font-semibold text-[15px] hover:text-[#111827] transition-colors rounded-2xl"
        >
          Maybe later
        </button>
      </div>
    </motion.div>
  );
};
