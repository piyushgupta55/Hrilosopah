import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AnswerOption } from './AnswerOption';
import { Brain, Layout, CheckCircle2, Star } from 'lucide-react';

type Question = {
  id: string;
  text: string;
  options: string[];
};

type QuestionCardProps = {
  question: Question;
  selectedOptionIndex: number | null;
  onSelectOption: (index: number) => void;
};

export const QuestionCard = ({
  question,
  selectedOptionIndex,
  onSelectOption,
}: QuestionCardProps) => {
  const hasSelected = selectedOptionIndex !== null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={question.id}
        initial={{ x: 20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -20, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="w-full flex flex-col px-4 pb-6"
      >
        <div className="bg-white rounded-[24px] p-5 shadow-sm border border-gray-100 relative overflow-hidden">
          {/* Top Tag */}
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-purple-50 rounded-lg mb-4">
            <Brain className="w-3.5 h-3.5 text-purple-600" strokeWidth={2.5} />
            <span className="text-[10px] font-bold text-purple-600 tracking-wide">AI Basics</span>
          </div>

          <div className="flex flex-row gap-4 mb-6">
            <div className="flex-1">
              <h3 className="text-xl md:text-2xl font-extrabold text-gray-900 leading-tight mb-2">
                {question.text}
              </h3>
              <p className="text-xs text-gray-500 font-medium">Choose the best answer</p>
            </div>

            {/* Right illustration */}
            <div className="w-24 h-24 shrink-0 relative flex items-center justify-center">
              <div className="absolute inset-0 bg-blue-100 rounded-full blur-xl opacity-60"></div>
              <Layout
                className="w-16 h-16 text-indigo-100 fill-indigo-50 absolute -top-2 -right-2"
                strokeWidth={1}
              />
              <Brain
                className="w-16 h-16 text-indigo-500 drop-shadow-md relative z-10"
                strokeWidth={1}
              />
              <Star className="w-3 h-3 text-purple-300 fill-purple-300 absolute top-0 left-0" />
              <Star className="w-2 h-2 text-indigo-300 fill-indigo-300 absolute bottom-2 right-0" />
            </div>
          </div>

          {/* Options */}
          <div className="space-y-3 mb-4">
            {question.options.map((option, index) => (
              <AnswerOption
                key={index}
                index={index}
                text={option}
                isSelected={selectedOptionIndex === index}
                onClick={() => onSelectOption(index)}
              />
            ))}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
