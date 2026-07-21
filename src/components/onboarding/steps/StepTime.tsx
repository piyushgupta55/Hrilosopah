'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { StepHeader } from '../StepHeader';
import { PrimaryButton } from '../PrimaryButton';
import { OptionCard } from '../OptionCard';

interface StepTimeProps {
  time: string;
  onChange: (time: string) => void;
  onNext: () => void;
}

const ClockIcon = ({ minutes }: { minutes: number }) => {
  // Simple clock icon where the filled segment represents the minutes.
  // 5m = 30deg, 10m = 60deg, 15m = 90deg, 20m = 120deg
  const degrees = (minutes / 60) * 360;

  return (
    <svg
      className="w-6 h-6"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <circle cx="12" cy="12" r="10" stroke="#9CA3AF" />
      <path
        d={`M12 12 L12 4 A8 8 0 0 1 ${12 + 8 * Math.sin((degrees * Math.PI) / 180)} ${12 - 8 * Math.cos((degrees * Math.PI) / 180)} Z`}
        fill="#3B82F6"
        stroke="none"
      />
    </svg>
  );
};

const TIME_OPTIONS = [
  { id: '5', label: '5 Minutes', desc: 'Quick and easy', icon: <ClockIcon minutes={5} /> },
  { id: '10', label: '10 Minutes', desc: 'Great start', icon: <ClockIcon minutes={10} /> },
  { id: '15', label: '15 Minutes', desc: 'Good progress', icon: <ClockIcon minutes={15} /> },
  { id: '20+', label: '20+ Minutes', desc: "Let's go all in", icon: <ClockIcon minutes={20} /> },
];

export const StepTime = ({ time, onChange, onNext }: StepTimeProps) => {
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
              Set your daily <br />
              <span className="text-[#0052FF]">learning goal</span>
            </>
          }
          subtitle="Small steps every day lead to big results."
        />

        <div className="flex flex-col space-y-3">
          {TIME_OPTIONS.map((option, i) => (
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
                selected={time === option.id}
                onClick={() => onChange(option.id)}
              />
            </motion.div>
          ))}
        </div>
      </div>

      <div className="w-full mt-8">
        <PrimaryButton label="Continue" onClick={onNext} disabled={!time} />
      </div>
    </motion.div>
  );
};
