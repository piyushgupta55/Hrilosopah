'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface PrimaryButtonProps {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

export const PrimaryButton = ({
  label,
  className = '',
  onClick,
  disabled,
  type = 'button',
}: PrimaryButtonProps) => {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`w-full py-[18px] bg-[#0052FF] text-white font-bold text-[17px] rounded-[16px] transition-colors hover:bg-[#0042CC] disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {label}
    </motion.button>
  );
};
