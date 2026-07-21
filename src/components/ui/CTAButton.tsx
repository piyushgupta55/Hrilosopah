'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface CTAButtonProps {
  href: string;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  className?: string;
}

export const CTAButton = ({
  href,
  children,
  variant = 'primary',
  className = '',
}: CTAButtonProps) => {
  const isPrimary = variant === 'primary';

  const baseClasses =
    'inline-flex items-center justify-center px-6 py-3.5 rounded-full font-semibold text-base transition-all';
  const primaryClasses =
    'bg-primary text-white shadow-[0_8px_20px_-6px_rgba(0,102,255,0.4)] hover:shadow-[0_12px_24px_-6px_rgba(0,102,255,0.6)]';
  const secondaryClasses =
    'bg-surface text-text-primary border border-border hover:border-silver shadow-sm hover:shadow-md';

  return (
    <Link href={href} passHref legacyBehavior>
      <motion.a
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
        className={`${baseClasses} ${isPrimary ? primaryClasses : secondaryClasses} ${className}`}
      >
        {children}
      </motion.a>
    </Link>
  );
};
