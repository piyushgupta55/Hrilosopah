'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface ProgressIndicatorProps {
  currentStep: number; // 0 to 7
}

export const ProgressIndicator = ({ currentStep }: ProgressIndicatorProps) => {
  // Map absolute step (0 to 7) to local progress (0 to 3)
  const localStep = currentStep % 4; // 0, 1, 2, 3

  return (
    <div className="w-full flex items-center justify-between">
      {[0, 1, 2, 3].map((index) => {
        const isActive = index <= localStep;
        const isPassed = index < localStep;

        return (
          <React.Fragment key={index}>
            <div
              className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${
                isActive ? 'bg-[#0052FF]' : 'bg-[#E5E7EB]'
              }`}
            />
            {index < 3 && (
              <div className="flex-1 h-[2px] mx-1 bg-[#E5E7EB] overflow-hidden rounded-full">
                <motion.div
                  initial={false}
                  animate={{ width: isPassed ? '100%' : '0%' }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="h-full bg-[#0052FF]"
                />
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};
