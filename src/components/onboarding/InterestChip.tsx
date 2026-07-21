'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

interface InterestChipProps {
  label: string;
  icon: React.ReactNode;
  selected: boolean;
  onClick: () => void;
}

export const InterestChip = ({ label, icon, selected, onClick }: InterestChipProps) => {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`relative w-full aspect-square flex flex-col items-center justify-center rounded-[16px] border-[2px] transition-all ${
        selected
          ? 'border-[#0052FF] bg-blue-50/30'
          : 'border-[#F3F4F6] bg-white hover:border-[#E5E7EB]'
      }`}
    >
      <div className="text-gray-700 mb-2">{icon}</div>
      <span
        className={`text-[13px] font-semibold text-center leading-tight px-2 ${selected ? 'text-[#0052FF]' : 'text-[#4B5563]'}`}
      >
        {label}
      </span>

      {/* Selection Checkmark */}
      <div
        className={`absolute -top-2 -right-2 w-6 h-6 rounded-full bg-white transition-opacity ${selected ? 'opacity-100' : 'opacity-0'}`}
      >
        <CheckCircle2 className="w-6 h-6 text-[#0052FF]" fill="white" />
      </div>
      {/* Empty circle when unselected */}
      <div
        className={`absolute -top-2 -right-2 w-6 h-6 rounded-full border-2 border-[#E5E7EB] bg-white transition-opacity ${!selected ? 'opacity-100' : 'opacity-0'}`}
      />
    </motion.button>
  );
};
