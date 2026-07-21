'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { StepHeader } from '../StepHeader';
import { PrimaryButton } from '../PrimaryButton';
import { Brain, Coins, FileQuestion } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface StepLearnProps {
  selectedInterests: string[];
  onChange: (interests: string[]) => void;
  onNext: () => void;
}

export const StepLearn = ({ selectedInterests, onChange, onNext }: StepLearnProps) => {
  const t = useTranslations('Onboarding');

  const cards = [
    {
      id: 'ai',
      title: t('aiTitle'),
      desc: t('aiDesc'),
      icon: <Brain className="w-8 h-8 text-[#8B5CF6]" />,
      bg: 'bg-[#F5F3FF]',
    },
    {
      id: 'crypto',
      title: t('cryptoTitle'),
      desc: t('cryptoDesc'),
      icon: <Coins className="w-8 h-8 text-[#8B5CF6]" />,
      bg: 'bg-[#F5F3FF]',
    },
    {
      id: 'tech',
      title: t('quizTitle'),
      desc: t('quizDesc'),
      icon: <FileQuestion className="w-8 h-8 text-[#8B5CF6]" />,
      bg: 'bg-[#F5F3FF]',
    },
  ];

  const toggleInterest = (id: string) => {
    if (selectedInterests.includes(id)) {
      onChange(selectedInterests.filter((item) => item !== id));
    } else {
      onChange([...selectedInterests, id]);
    }
  };

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
              {t('learnTitle')} <br />
              <span className="text-[#0052FF]">{t('learnTitleHighlight')}</span>
            </>
          }
          subtitle={t('learnSubtitle')}
        />

        <div className="flex flex-col space-y-4">
          {cards.map((card, i) => {
            const isSelected = selectedInterests.includes(card.id);
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                onClick={() => toggleInterest(card.id)}
                className={`flex items-center p-4 border rounded-[16px] shadow-sm cursor-pointer transition-all ${
                  isSelected
                    ? 'border-[#0052FF] bg-[#F0F5FF]/80 ring-2 ring-[#0052FF]/10'
                    : 'bg-white border-[#E5E7EB] hover:border-gray-300'
                }`}
              >
                <div
                  className={`w-14 h-14 rounded-[12px] ${card.bg} flex items-center justify-center mr-4 shrink-0`}
                >
                  {card.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-[#111827] font-bold text-[16px] mb-1">{card.title}</h3>
                  <p className="text-[#6B7280] text-[13px] leading-snug">{card.desc}</p>
                </div>
                <div className="ml-2 shrink-0">
                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                      isSelected ? 'bg-[#0052FF] border-[#0052FF]' : 'border-gray-300'
                    }`}
                  >
                    {isSelected && (
                      <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 14 14" fill="none">
                        <path
                          d="M11.6666 3.5L5.24992 9.91667L2.33325 7"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <div className="w-full mt-8">
        <PrimaryButton label={t('continue')} onClick={onNext} />
      </div>
    </motion.div>
  );
};
