'use client';

import React from 'react';
import { SettingsSubpageLayout } from '@/components/settings/SettingsSubpageLayout';
import { Check } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';

export default function LanguagePage() {
  const t = useTranslations('Settings');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const languages = [
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

  const handleLanguageChange = (newLocale: string) => {
    const segments = pathname.split('/');
    segments[1] = newLocale;
    router.push(segments.join('/'));
  };

  return (
    <SettingsSubpageLayout title={t('language')}>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
        {languages.map((lang, idx) => {
          const isActive = lang.code === locale;
          return (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={`w-full px-5 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors ${
                idx !== languages.length - 1 ? 'border-b border-gray-50' : ''
              }`}
            >
              <div className="flex flex-col gap-1">
                <span className="font-bold text-sm text-gray-900">{lang.name}</span>
                <span className="text-[10px] text-gray-500 font-medium">{lang.native}</span>
              </div>
              {isActive ? (
                <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                  <Check className="w-3 h-3 text-white" strokeWidth={3} />
                </div>
              ) : (
                <div className="w-5 h-5 rounded-full border-2 border-gray-200"></div>
              )}
            </button>
          );
        })}
      </div>
    </SettingsSubpageLayout>
  );
}
