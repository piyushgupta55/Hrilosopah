'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

interface FAQItemProps {
  question: string;
  answer: string;
}

const FAQItem = ({ question, answer }: FAQItemProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-border last:border-b-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between py-6 text-left focus:outline-none"
      >
        <span className="text-lg font-semibold text-text-primary pr-8">{question}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-text-secondary shrink-0"
        >
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="pb-6 text-text-secondary leading-relaxed pr-8">{answer}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const FAQAccordion = () => {
  const faqs = [
    {
      question: 'Is the quiz free?',
      answer:
        'Yes, taking the quiz is completely free. You can answer all questions and see your basic score without paying anything.',
    },
    {
      question: 'How does payment work?',
      answer:
        'We use Stripe for secure, one-time payments. There are no subscriptions or hidden fees. Just a flat $1 to unlock your in-depth analysis.',
    },
    {
      question: 'How long does a quiz take?',
      answer:
        'Most of our quizzes are designed to be completed in about 5 minutes, making them perfect for a quick learning session.',
    },
    {
      question: 'What do I unlock after payment?',
      answer:
        'You unlock a comprehensive breakdown of your performance, detailed explanations for every question, and personalized learning recommendations based on your weak points.',
    },
    {
      question: 'Can I retake the quiz?',
      answer:
        'Absolutely. You can retake the quizzes as many times as you like to improve your score and reinforce your knowledge.',
    },
  ];

  return (
    <div className="w-full max-w-3xl mx-auto bg-white rounded-3xl border border-border p-6 sm:p-10 shadow-sm">
      {faqs.map((faq, idx) => (
        <FAQItem key={idx} question={faq.question} answer={faq.answer} />
      ))}
    </div>
  );
};
