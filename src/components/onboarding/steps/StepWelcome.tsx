'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { PrimaryButton } from '../PrimaryButton';
import { StepHeader } from '../StepHeader';
import { Bitcoin, Brain } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface StepWelcomeProps {
  onNext: () => void;
  onSkip: () => void;
}

export const StepWelcome = ({ onNext, onSkip }: StepWelcomeProps) => {
  const t = useTranslations('Onboarding');

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="flex-1 flex flex-col justify-between pb-6 h-full"
    >
      <div>
        <StepHeader
          title={
            <>
              {t('welcomeTitle')} <br />
              <span className="text-[#1D4ED8]">Hrilosopah</span>
            </>
          }
          subtitle={t('welcomeSubtitle')}
        />

        {/* Custom SVG Illustration Area */}
        <div className="w-full aspect-square relative flex items-center justify-center my-6">
          <motion.div
            animate={{ y: [-5, 5, -5] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="relative w-full h-full max-w-[280px] max-h-[280px] flex items-center justify-center"
          >
            {/* Background shadow ellipse */}
            <div className="absolute bottom-0 w-[200px] h-[30px] bg-[#E5E7EB] rounded-[100%] blur-md opacity-70 translate-y-6" />

            {/* Tablet Device */}
            <div className="relative w-[180px] h-[220px] bg-white border-[3px] border-[#E5E7EB] rounded-[24px] shadow-sm transform -rotate-12 z-10 flex flex-col overflow-hidden">
              {/* Screen */}
              <div className="flex-1 m-2 border-[2px] border-[#F3F4F6] rounded-[16px] bg-gradient-to-b from-[#FAFAFA] to-white flex items-center justify-center">
                <div className="w-16 h-16 bg-[#1D4ED8] border-[3px] border-gray-200 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-3xl font-black text-white tracking-tighter">H</span>
                </div>
              </div>
            </div>

            {/* Floating Bitcoin Coin */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
              className="absolute left-[10%] bottom-[20%] w-14 h-14 bg-white border-[3px] border-[#10B981] rounded-full shadow-lg z-20 flex items-center justify-center text-[#10B981]"
            >
              <Bitcoin className="w-8 h-8" />
            </motion.div>

            {/* Floating Brain */}
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              className="absolute right-[5%] top-[15%] w-16 h-16 text-[#8B5CF6] z-20 flex items-center justify-center filter drop-shadow-lg"
            >
              <Brain className="w-16 h-16" strokeWidth={1.5} />
            </motion.div>

            {/* Decorative symbols */}
            <div className="absolute top-[30%] left-[10%] text-[#A78BFA] rotate-12">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M12 5v14M5 12h14" />
              </svg>
            </div>
            <div className="absolute top-[10%] right-[30%] text-[#3B82F6] rotate-45">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
              </svg>
            </div>
            <div className="absolute bottom-[10%] right-[10%] text-[#8B5CF6]">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              </svg>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="w-full space-y-4">
        <PrimaryButton label={t('getStarted')} onClick={onNext} />
        <button
          onClick={onSkip}
          className="w-full py-4 text-[#6B7280] font-semibold text-[15px] hover:text-[#111827] transition-colors rounded-2xl"
        >
          {t('skipForNow')}
        </button>
      </div>
    </motion.div>
  );
};
