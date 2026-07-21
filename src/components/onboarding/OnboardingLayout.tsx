'use client';

import React from 'react';
import { ProgressIndicator } from './ProgressIndicator';

interface OnboardingLayoutProps {
  children: React.ReactNode;
  currentStep?: number; // 0 to 7
}

export const OnboardingLayout = ({ children, currentStep = 0 }: OnboardingLayoutProps) => {
  // Format step number as "01", "02", etc.
  const stepNumber = String(currentStep + 1).padStart(2, '0');

  return (
    <div className="flex flex-col w-full h-[100dvh] relative overflow-hidden bg-white text-[#111827]">
      {/* Top Progress Bar Area */}
      <div className="w-full px-6 pt-12 pb-4 flex flex-col z-10">
        <div className="w-full max-w-sm mx-auto">
          <ProgressIndicator currentStep={currentStep} />

          <div className="mt-8 text-[15px] font-semibold text-[#6B7280]">{stepNumber}</div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 w-full max-w-sm mx-auto px-6 flex flex-col relative z-0 overflow-y-auto">
        {children}
      </div>
    </div>
  );
};
