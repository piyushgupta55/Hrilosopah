'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Circle } from 'lucide-react';

interface OptionCardProps {
  label: string;
  description?: string;
  icon?: React.ReactNode;
  selected: boolean;
  onClick: () => void;
}

export const OptionCard = ({ label, description, icon, selected, onClick }: OptionCardProps) => {
  return (
    <motion.button
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      onClick={onClick}
      className={`w-full flex items-center p-4 rounded-[16px] border-[2px] transition-all text-left ${
        selected
          ? 'border-[#0052FF] bg-[#F5F8FF]'
          : 'border-[#F3F4F6] bg-white hover:border-[#E5E7EB]'
      }`}
    >
      {icon && (
        <div
          className={`w-10 h-10 rounded-lg flex items-center justify-center mr-4 shrink-0 transition-colors ${selected ? 'text-[#0052FF]' : 'text-[#6B7280]'}`}
        >
          {icon}
        </div>
      )}

      <div className="flex-1 pr-4">
        <h3 className={`font-bold text-[15px] ${selected ? 'text-[#111827]' : 'text-[#374151]'}`}>
          {label}
        </h3>
        {description && (
          <p className="text-[13px] text-[#6B7280] mt-0.5 leading-snug">{description}</p>
        )}
      </div>

      <div className="shrink-0 flex items-center justify-center">
        {selected ? (
          <CheckCircle2 className="w-6 h-6 text-[#0052FF]" fill="white" />
        ) : (
          <Circle className="w-6 h-6 text-[#E5E7EB]" strokeWidth={2} />
        )}
      </div>
    </motion.button>
  );
};
