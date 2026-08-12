import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

type AnswerOptionProps = {
  text: string;
  index: number;
  isSelected: boolean;
  onClick: () => void;
};

export const AnswerOption = ({ text, index, isSelected, onClick }: AnswerOptionProps) => {
  const letter = String.fromCharCode(65 + index); // 0 -> A, 1 -> B, etc.

  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`w-full flex items-center p-4 rounded-xl transition-all duration-200 border text-left ${
        isSelected
          ? 'bg-blue-50/60 border-[#2563EB] shadow-sm ring-1 ring-[#2563EB]/20'
          : 'bg-white border-gray-100 hover:border-gray-200 shadow-sm'
      }`}
    >
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mr-4 font-bold text-sm ${
          isSelected ? 'bg-[#2563EB] text-white' : 'bg-gray-100 text-gray-500'
        }`}
      >
        {letter}
      </div>

      <span
        className={`text-sm md:text-base font-semibold flex-1 pr-4 ${
          isSelected ? 'text-slate-900' : 'text-gray-700'
        }`}
      >
        {text}
      </span>

      {isSelected && (
        <div className="w-6 h-6 rounded-full bg-[#2563EB] flex items-center justify-center shrink-0 shadow-sm">
          <Check className="w-4 h-4 text-white" strokeWidth={3} />
        </div>
      )}
    </motion.button>
  );
};
