'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { StepHeader } from '../StepHeader';
import { PrimaryButton } from '../PrimaryButton';
import { InterestChip } from '../InterestChip';
import {
  Bot,
  Link as LinkIcon,
  Bitcoin,
  Network,
  BarChart3,
  Cpu,
  Briefcase,
  Lightbulb,
} from 'lucide-react';

interface StepInterestsProps {
  interests: string[];
  onChange: (interests: string[]) => void;
  onNext: () => void;
}

const INTEREST_OPTIONS = [
  { id: 'ai', label: 'AI', icon: <Bot className="w-8 h-8" strokeWidth={1.5} /> },
  {
    id: 'blockchain',
    label: 'Blockchain',
    icon: <LinkIcon className="w-8 h-8" strokeWidth={1.5} />,
  },
  { id: 'crypto', label: 'Crypto', icon: <Bitcoin className="w-8 h-8" strokeWidth={1.5} /> },
  { id: 'ml', label: 'Machine Learning', icon: <Network className="w-8 h-8" strokeWidth={1.5} /> },
  { id: 'finance', label: 'Finance', icon: <BarChart3 className="w-8 h-8" strokeWidth={1.5} /> },
  { id: 'tech', label: 'Technology', icon: <Cpu className="w-8 h-8" strokeWidth={1.5} /> },
  { id: 'business', label: 'Business', icon: <Briefcase className="w-8 h-8" strokeWidth={1.5} /> },
  {
    id: 'innovation',
    label: 'Innovation',
    icon: <Lightbulb className="w-8 h-8" strokeWidth={1.5} />,
  },
];

export const StepInterests = ({ interests, onChange, onNext }: StepInterestsProps) => {
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
      className="flex-1 flex flex-col justify-between pb-6 h-full"
    >
      <div>
        <StepHeader
          title={
            <>
              Personalize <br />
              <span className="text-[#0052FF]">your experience</span>
            </>
          }
          subtitle="Choose the topics you're most interested in."
        />

        <div className="grid grid-cols-2 gap-4 px-2 pt-2">
          {INTEREST_OPTIONS.map((option, i) => (
            <motion.div
              key={option.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <InterestChip
                label={option.label}
                icon={option.icon}
                selected={interests.includes(option.id)}
                onClick={() => toggleInterest(option.id)}
              />
            </motion.div>
          ))}
        </div>
      </div>

      <div className="w-full mt-8">
        <PrimaryButton label="Continue" onClick={onNext} disabled={interests.length === 0} />
      </div>
    </motion.div>
  );
};
