'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface StatisticCardProps {
  value: string;
  label: string;
  delay?: number;
}

export const StatisticCard = ({ value, label, delay = 0 }: StatisticCardProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.6, delay }}
      className="flex flex-col items-center justify-center p-8 text-center"
    >
      <div className="text-4xl md:text-5xl font-black text-primary mb-2 tracking-tight">
        {isInView ? value : '0'}
      </div>
      <div className="text-sm font-semibold text-text-secondary uppercase tracking-wider">
        {label}
      </div>
    </motion.div>
  );
};
