'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface StepCardProps {
  number: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  delay?: number;
}

export const StepCard = ({ number, title, description, icon, delay = 0 }: StepCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay }}
      className="relative flex flex-col p-8 rounded-3xl bg-surface border border-border shadow-sm hover:shadow-md transition-shadow h-full"
    >
      <div className="w-12 h-12 rounded-xl bg-white border border-border flex items-center justify-center text-primary mb-6 shadow-sm">
        {icon}
      </div>
      <div className="absolute top-8 right-8 text-6xl font-black text-silver/20 select-none">
        {number}
      </div>
      <h4 className="text-xl font-bold text-text-primary mb-3">{title}</h4>
      <p className="text-text-secondary leading-relaxed">{description}</p>
    </motion.div>
  );
};
