'use client';

import React from 'react';
import { motion, PanInfo } from 'framer-motion';

interface IllustrationCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  colorClass: string;
  onDragEnd?: (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => void;
  drag?: 'x' | 'y' | boolean;
  style?: any;
}

export const IllustrationCard = ({
  title,
  description,
  icon,
  colorClass,
  onDragEnd,
  drag,
  style,
}: IllustrationCardProps) => {
  return (
    <motion.div
      drag={drag}
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={onDragEnd}
      style={style}
      className={`w-full max-w-[320px] mx-auto rounded-[32px] p-8 flex flex-col items-center justify-center text-center shadow-xl shadow-black/5 ${colorClass} cursor-grab active:cursor-grabbing`}
    >
      <div className="w-32 h-32 mb-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md">
        <div className="text-white drop-shadow-md">{icon}</div>
      </div>
      <h3 className="text-2xl font-bold text-white mb-3">{title}</h3>
      <p className="text-white/90 text-[15px] leading-relaxed">{description}</p>
    </motion.div>
  );
};
