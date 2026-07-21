'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface AuthLayoutProps {
  headerContent: React.ReactNode;
  children: React.ReactNode;
  onBack?: () => void;
}

export const AuthLayout = ({ headerContent, children, onBack }: AuthLayoutProps) => {
  const router = useRouter();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  return (
    <div className="flex flex-col w-full h-[100dvh] bg-[#0A101D] relative overflow-hidden">
      {/* Back Button */}
      <div className="absolute top-12 left-6 z-50">
        <button
          onClick={handleBack}
          className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white backdrop-blur-md hover:bg-white/20 transition-colors"
          aria-label="Go back"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      </div>

      {/* Top Dark Section */}
      <div className="relative w-full h-[45%] min-h-[340px] flex flex-col items-center justify-center pt-8 overflow-hidden z-0">
        {headerContent}
      </div>

      {/* Bottom White Card Section */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 25 }}
        className="flex-1 w-full bg-[#FAFBFF] rounded-t-[32px] sm:rounded-t-[40px] relative z-10 flex flex-col pt-8 pb-10 px-6 sm:px-8 overflow-y-auto"
      >
        <div className="w-full max-w-md mx-auto flex-1 flex flex-col">{children}</div>
      </motion.div>
    </div>
  );
};
