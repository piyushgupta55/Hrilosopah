'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Clock, HelpCircle, User } from 'lucide-react';

interface QuizCardProps {
  title: string;
  illustration: string;
  questionsCount: string;
  difficulty: string;
  duration: string;
  href: string;
  accentColor: 'primary' | 'accent';
}

export const QuizCard = ({
  title,
  illustration,
  questionsCount,
  difficulty,
  duration,
  href,
  accentColor,
}: QuizCardProps) => {
  const isPrimary = accentColor === 'primary';
  const colorClass = isPrimary ? 'text-primary' : 'text-accent';
  const bgClass = isPrimary ? 'bg-primary/5' : 'bg-accent/5';

  return (
    <Link href={href} passHref legacyBehavior>
      <motion.a
        whileHover={{ y: -8 }}
        className="block w-full rounded-[32px] bg-white border border-border shadow-[0_4px_24px_-8px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.1)] transition-shadow overflow-hidden group"
      >
        <div
          className={`w-full h-48 ${bgClass} flex items-center justify-center relative overflow-hidden`}
        >
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: 'spring', stiffness: 300 }}
            className="text-7xl relative z-10"
          >
            {illustration}
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent" />
        </div>

        <div className="p-8">
          <h3 className="text-2xl font-bold text-text-primary mb-6 group-hover:text-primary transition-colors">
            {title}
          </h3>

          <div className="space-y-3 mb-8">
            <div className="flex items-center text-text-secondary text-sm font-medium">
              <HelpCircle className={`w-4 h-4 mr-3 ${colorClass}`} />
              {questionsCount} Questions
            </div>
            <div className="flex items-center text-text-secondary text-sm font-medium">
              <User className={`w-4 h-4 mr-3 ${colorClass}`} />
              {difficulty}
            </div>
            <div className="flex items-center text-text-secondary text-sm font-medium">
              <Clock className={`w-4 h-4 mr-3 ${colorClass}`} />
              Approx. {duration}
            </div>
          </div>

          <div className="w-full py-3.5 rounded-full bg-surface text-text-primary font-semibold text-center border border-border group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all">
            Start Quiz
          </div>
        </div>
      </motion.a>
    </Link>
  );
};
