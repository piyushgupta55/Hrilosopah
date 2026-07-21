import React from 'react';

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
}

export const SectionTitle = ({ title, subtitle, align = 'center' }: SectionTitleProps) => {
  return (
    <div className={`mb-12 ${align === 'center' ? 'text-center mx-auto' : 'text-left'} max-w-2xl`}>
      <h2 className="text-3xl md:text-4xl font-extrabold text-text-primary tracking-tight mb-4">
        {title}
      </h2>
      {subtitle && <p className="text-lg text-text-secondary">{subtitle}</p>}
    </div>
  );
};
