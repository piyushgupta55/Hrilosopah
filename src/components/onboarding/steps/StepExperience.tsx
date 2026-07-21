'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { StepHeader } from '../StepHeader';
import { PrimaryButton } from '../PrimaryButton';
import { OptionCard } from '../OptionCard';
import { UserSearch } from 'lucide-react';

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
    label: 'Beginner',
    desc: 'Just getting started',
    icon: <ChartIcon level={1} />,
  },
  {
    id: 'intermediate',
    label: 'Intermediate',
    desc: 'Some knowledge',
    icon: <ChartIcon level={2} />,
  },
  { id: 'advanced', label: 'Advanced', desc: 'Very familiar', icon: <ChartIcon level={3} /> },
  {
    id: 'notsure',
    label: 'Not sure',
    desc: 'Help me decide',
    icon: <UserSearch className="w-5 h-5" strokeWidth={2} />,
  },
];

export const StepExperience = ({ experience, onChange, onNext }: StepExperienceProps) => {
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
              How familiar are <br />
              you with <span className="text-[#0052FF]">AI & Crypto?</span>
            </>
          }
          subtitle="We'll tailor the difficulty to your level."
        />

        <div className="flex flex-col space-y-3">
          {EXP_OPTIONS.map((option, i) => (
            <motion.div
              key={option.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <OptionCard
                label={option.label}
                description={option.desc}
                icon={option.icon}
                selected={experience === option.id}
                onClick={() => onChange(option.id)}
              />
            </motion.div>
          ))}
        </div>
      </div>

      <div className="w-full mt-8">
        <PrimaryButton label="Continue" onClick={onNext} disabled={!experience} />
      </div>
    </motion.div>
  );
};
