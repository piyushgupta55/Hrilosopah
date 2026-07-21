import React from 'react';

export const HorizontalFeed = ({
  title,
  subtitle,
  actionText = 'See all',
  children,
}: {
  title: string;
  subtitle?: string;
  actionText?: string;
  children: React.ReactNode;
}) => {
  return (
    <div className="w-full mt-10">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
        <h3 className="text-xl sm:text-2xl font-bold text-text-primary">{title}</h3>
        {actionText && (
          <button className="text-sm font-semibold text-text-secondary bg-surface px-3 py-1.5 rounded-full hover:bg-border transition-colors shrink-0">
            {actionText}
          </button>
        )}
      </div>
      {subtitle && <p className="text-text-secondary text-sm mb-4">{subtitle}</p>}

      {/* 
        Horizontal scroll container. 
        Uses standard web overflow for native feel without iOS native dependencies.
      */}
      <div className="flex space-x-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
        {children}
      </div>
    </div>
  );
};
