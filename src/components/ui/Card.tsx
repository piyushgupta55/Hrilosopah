import React from 'react';

export const Card = ({
  className = '',
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={`bg-surface rounded-xl shadow-sm border border-border overflow-hidden ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
