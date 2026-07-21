'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { StepHeader } from '../StepHeader';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface StepLoadingPlanProps {
  onComplete: () => void;
}

export const StepLoadingPlan = ({ onComplete }: StepLoadingPlanProps) => {
  const [step, setStep] = useState(0);
  const t = useTranslations('Onboarding');

  useEffect(() => {
    const t1 = setTimeout(() => setStep(1), 800);
    const t2 = setTimeout(() => setStep(2), 1600);
    const t3 = setTimeout(() => setStep(3), 2400);
    const t4 = setTimeout(() => onComplete(), 3000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [onComplete]);

  const loadingSteps = [t('planInterests'), t('planQuizzes'), t('planJourney')];

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="flex-1 flex flex-col items-center pt-8 pb-6 h-full"
    >
      <div className="w-full">
        <StepHeader
          title={
            <>
              {t('planTitle')} <br />
              <span className="text-[#0052FF]">{t('planTitleHighlight')}</span>
            </>
          }
          subtitle={t('planSubtitle')}
        />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-[280px]">
        {/* Animated Glowing H */}
        <div className="relative w-40 h-40 flex items-center justify-center mb-12">
          {/* Outer glow 1 */}
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute inset-0 bg-[#E0E7FF] rounded-full blur-xl"
          />
          {/* Outer glow 2 */}
          <motion.div
            animate={{ scale: [1.1, 1.3, 1.1], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute inset-0 bg-[#C7D2FE] rounded-full blur-2xl"
          />

          {/* Center H */}
          <div className="relative z-10 w-24 h-24 bg-white rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.08)] flex items-center justify-center">
            <span className="text-4xl font-black text-[#0052FF]">H</span>
          </div>
        </div>

        {/* Loading Checklist */}
        <div className="w-full space-y-4">
          {loadingSteps.map((text, i) => (
            <div key={i} className="flex items-center space-x-3">
              {step > i ? (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                  <CheckCircle2 className="w-5 h-5 text-[#0052FF]" fill="white" strokeWidth={2} />
                </motion.div>
              ) : (
                <Loader2 className="w-5 h-5 text-[#A78BFA] animate-spin" />
              )}
              <span
                className={`text-[14px] font-semibold transition-colors duration-300 ${step > i ? 'text-[#111827]' : 'text-[#6B7280]'}`}
              >
                {text}
              </span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
