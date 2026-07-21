'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useLocale, useTranslations } from 'next-intl';
import { StepHeader } from '../StepHeader';
import { PrimaryButton } from '../PrimaryButton';
import { OptionCard } from '../OptionCard';

interface StepLanguageProps {
  onNext: (locale: string) => void;
}

const LANGUAGES = [
  { code: 'en', name: 'English', native: 'English' },
  { code: 'ru', name: 'Russian', native: 'Русский' },
  { code: 'hi', name: 'Hindi', native: 'हिंदी' },
  { code: 'pl', name: 'Polish', native: 'Polski' },
  { code: 'lt', name: 'Lithuanian', native: 'Lietuvių' },
  { code: 'es', name: 'Spanish', native: 'Español' },
  { code: 'fr', name: 'French', native: 'Français' },
  { code: 'it', name: 'Italian', native: 'Italiano' },
  { code: 'ro', name: 'Romanian', native: 'Română' },
  { code: 'he', name: 'Hebrew', native: 'עברית' },
  { code: 'zh', name: 'Mandarin', native: '中文' },
  { code: 'ar', name: 'Arabic', native: 'العربية' },
  { code: 'ur', name: 'Urdu', native: 'اردو' },
];

export const StepLanguage = ({ onNext }: StepLanguageProps) => {
  const currentLocale = useLocale();
  const [selected, setSelected] = useState(currentLocale);
  const t = useTranslations('Settings');

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="flex-1 flex flex-col justify-between pb-6 h-full"
    >
      <div className="flex-grow flex flex-col min-h-0">
        <StepHeader title={t('chooseLangTitle')} subtitle={t('chooseLangSubtitle')} />

        <div className="flex-grow overflow-y-auto space-y-3 pr-1 max-h-[50vh]">
          {LANGUAGES.map((lang, i) => (
            <motion.div
              key={lang.code}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i * 0.03, 0.3) }}
            >
              <OptionCard
                label={lang.name}
                description={lang.native}
                selected={selected === lang.code}
                onClick={() => setSelected(lang.code)}
              />
            </motion.div>
          ))}
        </div>
      </div>

      <div className="w-full mt-6 shrink-0">
        <PrimaryButton label={t('saveChanges')} onClick={() => onNext(selected)} />
      </div>
    </motion.div>
  );
};
