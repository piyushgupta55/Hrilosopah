'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { StepHeader } from '../StepHeader';
import { PrimaryButton } from '../PrimaryButton';
import { Brain, Coins, FileQuestion } from 'lucide-react';

interface StepLearnProps {
  onNext: () => void;
}

export const StepLearn = ({ onNext }: StepLearnProps) => {
  const cards = [
    {
      title: 'Artificial Intelligence',
      desc: 'Understand the power of intelligent systems.',
      icon: <Brain className="w-8 h-8 text-[#8B5CF6]" />,
      bg: 'bg-[#F5F3FF]',
    },
    {
      title: 'Crypto & Blockchain',
      desc: "Learn the language of tomorrow's finance.",
      icon: <Coins className="w-8 h-8 text-[#8B5CF6]" />,
      bg: 'bg-[#F5F3FF]',
    },
    {
      title: 'Interactive Quizzes',
      desc: 'Bite-sized questions that make learning fun.',
      icon: <FileQuestion className="w-8 h-8 text-[#8B5CF6]" />,
      bg: 'bg-[#F5F3FF]',
    },
  ];

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
              Learn what <br />
              <span className="text-[#0052FF]">matters most</span>
            </>
          }
          subtitle="Explore topics that shape the future."
        />

        <div className="flex flex-col space-y-4">
          {cards.map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center p-4 bg-white border border-[#E5E7EB] rounded-[16px] shadow-sm"
            >
              <div
                className={`w-14 h-14 rounded-[12px] ${card.bg} flex items-center justify-center mr-4 shrink-0`}
              >
                {card.icon}
              </div>
              <div>
                <h3 className="text-[#111827] font-bold text-[16px] mb-1">{card.title}</h3>
                <p className="text-[#6B7280] text-[13px] leading-snug">{card.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="w-full mt-8">
        <PrimaryButton label="Continue" onClick={onNext} />
      </div>
    </motion.div>
  );
};
