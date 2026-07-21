import React from 'react';

interface StepHeaderProps {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
}

export const StepHeader = ({ title, subtitle }: StepHeaderProps) => {
  return (
    <div className="w-full flex flex-col items-start mb-8">
      <h1 className="text-[32px] md:text-[34px] font-bold leading-[1.1] tracking-[-0.02em] text-[#111827] mb-4">
        {title}
      </h1>
      {subtitle && <p className="text-[15px] leading-relaxed text-[#6B7280]">{subtitle}</p>}
    </div>
  );
};
