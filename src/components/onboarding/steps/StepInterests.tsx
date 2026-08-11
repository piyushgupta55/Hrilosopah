'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { StepHeader } from '../StepHeader';
import { PrimaryButton } from '../PrimaryButton';
import { InterestChip } from '../InterestChip';
import {
  Brain,
  Link as LinkIcon,
  Bitcoin,
  Network,
  BarChart3,
  Cpu,
  Briefcase,
  Lightbulb,
} from 'lucide-react';
import { useTranslations } from 'next-intl';

interface StepInterestsProps {
  interests: string[];
  onChange: (interests: string[]) => void;
  onNext: () => void;
}

const INTEREST_OPTIONS = [
  { id: 'ai', icon: <Brain className="w-8 h-8" strokeWidth={1.5} /> },
  { id: 'blockchain', icon: <LinkIcon className="w-8 h-8" strokeWidth={1.5} /> },
  { id: 'crypto', icon: <Bitcoin className="w-8 h-8" strokeWidth={1.5} /> },
  { id: 'ml', icon: <Network className="w-8 h-8" strokeWidth={1.5} /> },
  { id: 'finance', icon: <BarChart3 className="w-8 h-8" strokeWidth={1.5} /> },
  { id: 'tech', icon: <Cpu className="w-8 h-8" strokeWidth={1.5} /> },
  { id: 'business', icon: <Briefcase className="w-8 h-8" strokeWidth={1.5} /> },
  { id: 'innovation', icon: <Lightbulb className="w-8 h-8" strokeWidth={1.5} /> },
];

export const StepInterests = ({ interests, onChange, onNext }: StepInterestsProps) => {
  const t = useTranslations('Onboarding');

  const toggleInterest = (id: string) => {
    if (interests.includes(id)) {
      onChange(interests.filter((i) => i !== id));
    } else {
      onChange([...interests, id]);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="flex-1 flex flex-col min-h-full"
    >
      {/* Fixed Step Header */}
      <div className="shrink-0 mb-1">
        <StepHeader
          title={
            <>
              {t('personalizeTitle')} <br />
              <span className="text-[#0052FF]">{t('personalizeTitleHighlight')}</span>
            </>
          }
          subtitle={t('personalizeSubtitle')}
        />
      </div>

      {/* Middle Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto no-scrollbar py-1 px-1 min-h-0">
        <div className="grid grid-cols-2 gap-3 pb-2">
          {INTEREST_OPTIONS.map((option, i) => (
            <motion.div
              key={option.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <InterestChip
                label={t(`interest_${option.id}`)}
                icon={option.icon}
                selected={interests.includes(option.id)}
                onClick={() => toggleInterest(option.id)}
              />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Fixed Bottom Footer */}
      <div className="shrink-0 pt-3 pb-2 bg-white border-t border-gray-100/80 z-10 mt-auto">
        <PrimaryButton label={t('continue')} onClick={onNext} disabled={interests.length === 0} />
      </div>
    </motion.div>
  );
};
