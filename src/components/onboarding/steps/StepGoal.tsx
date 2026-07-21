'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { StepHeader } from '../StepHeader';
import { PrimaryButton } from '../PrimaryButton';
import { OptionCard } from '../OptionCard';
import { Briefcase, BookOpen, UserCircle, Bell, Smile } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface StepGoalProps {
  goal: string;
  onChange: (goal: string) => void;
  onNext: () => void;
}

const GOAL_OPTIONS = [
  {
    id: 'career',
    icon: <Briefcase className="w-5 h-5" strokeWidth={2} />,
  },
  {
    id: 'learn',
    icon: <BookOpen className="w-5 h-5" strokeWidth={2} />,
  },
  {
    id: 'interviews',
    icon: <UserCircle className="w-5 h-5" strokeWidth={2} />,
  },
  { id: 'updated', icon: <Bell className="w-5 h-5" strokeWidth={2} /> },
  { id: 'curious', icon: <Smile className="w-5 h-5" strokeWidth={2} /> },
];

export const StepGoal = ({ goal, onChange, onNext }: StepGoalProps) => {
  const t = useTranslations('Onboarding');

  // Map option ID to translation key
  const getLabelKey = (id: string) => {
    if (id === 'learn') return 'goalLearn';
    return `goal${id.charAt(0).toUpperCase() + id.slice(1)}`;
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
              {t('goalTitle')} <br />
              <span className="text-[#0052FF]">{t('goalTitleHighlight')}</span>
            </>
          }
          subtitle={t('goalSubtitle')}
        />

        <div className="flex flex-col space-y-3">
          {GOAL_OPTIONS.map((option, i) => (
            <motion.div
              key={option.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <OptionCard
                label={t(getLabelKey(option.id))}
                icon={option.icon}
                selected={goal === option.id}
                onClick={() => onChange(option.id)}
              />
            </motion.div>
          ))}
        </div>
      </div>

      <div className="w-full mt-8">
        <PrimaryButton label={t('continue')} onClick={onNext} disabled={!goal} />
      </div>
    </motion.div>
  );
};
