'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  delay?: number;
}

export const FeatureCard = ({ title, description, icon, delay = 0 }: FeatureCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay }}
      className="p-8 rounded-3xl bg-white border border-border shadow-sm hover:shadow-lg transition-shadow group cursor-default"
    >
      <div className="w-14 h-14 rounded-2xl bg-surface border border-border flex items-center justify-center text-text-secondary group-hover:text-primary group-hover:bg-primary/5 group-hover:border-primary/20 transition-all mb-6">
        {icon}
      </div>
      <h4 className="text-xl font-bold text-text-primary mb-3">{title}</h4>
      <p className="text-text-secondary leading-relaxed">{description}</p>
    </motion.div>
  );
};
