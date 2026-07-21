'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { StepHeader } from '../StepHeader';
import { PrimaryButton } from '../PrimaryButton';
import { OptionCard } from '../OptionCard';
import { UserSearch } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface StepExperienceProps {
  experience: string;
  onChange: (experience: string) => void;
  onNext: () => void;
}

const ChartIcon = ({ level }: { level: number }) => (
  <div className="w-5 h-5 flex items-end justify-between space-x-[2px]">
    <div
      className={`w-[4px] rounded-t-sm ${level >= 1 ? 'bg-blue-600 h-[6px]' : 'bg-gray-300 h-[6px]'}`}
    />
    <div
      className={`w-[4px] rounded-t-sm ${level >= 2 ? 'bg-blue-600 h-[12px]' : 'bg-gray-300 h-[12px]'}`}
    />
    <div
      className={`w-[4px] rounded-t-sm ${level >= 3 ? 'bg-blue-600 h-[18px]' : 'bg-gray-300 h-[18px]'}`}
    />
  </div>
);

const EXP_OPTIONS = [
  {
    id: 'beginner',
    icon: <ChartIcon level={1} />,
  },
  {
    id: 'intermediate',
    icon: <ChartIcon level={2} />,
  },
  { id: 'advanced', icon: <ChartIcon level={3} /> },
  {
    id: 'notsure',
    icon: <UserSearch className="w-5 h-5" strokeWidth={2} />,
  },
];

export const StepExperience = ({ experience, onChange, onNext }: StepExperienceProps) => {
  const t = useTranslations('Onboarding');

  const getKeys = (id: string) => {
    if (id === 'notsure') {
      return { labelKey: 'expNotSure', descKey: 'expNotSureDesc' };
    }
    const cap = id.charAt(0).toUpperCase() + id.slice(1);
    return { labelKey: `exp${cap}`, descKey: `exp${cap}Desc` };
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
              {t('familiarTitle')} <br />
              you with <span className="text-[#0052FF]">{t('familiarTitleHighlight')}</span>
            </>
          }
          subtitle={t('familiarSubtitle')}
        />

        <div className="flex flex-col space-y-3">
          {EXP_OPTIONS.map((option, i) => {
            const { labelKey, descKey } = getKeys(option.id);
            return (
              <motion.div
                key={option.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <OptionCard
                  label={t(labelKey)}
                  description={t(descKey)}
                  icon={option.icon}
                  selected={experience === option.id}
                  onClick={() => onChange(option.id)}
                />
              </motion.div>
            );
          })}
        </div>
      </div>

      <div className="w-full mt-8">
        <PrimaryButton label={t('continue')} onClick={onNext} disabled={!experience} />
      </div>
    </motion.div>
  );
};
