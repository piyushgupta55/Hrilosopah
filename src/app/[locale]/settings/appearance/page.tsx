'use client';

import React, { useState, useEffect } from 'react';
import { SettingsSubpageLayout } from '@/components/settings/SettingsSubpageLayout';
import { Check } from 'lucide-react';
import { useTranslations } from 'next-intl';

type ThemeType = 'light' | 'dark' | 'system';

export default function AppearancePage() {
  const t = useTranslations('Settings');
  const [selectedTheme, setSelectedTheme] = useState<ThemeType>('light');

  // Load theme on mount
  useEffect(() => {
    const saved = localStorage.getItem('hrilosopah_theme') as ThemeType;
    if (saved) {
      setSelectedTheme(saved);
    } else {
      setSelectedTheme('light');
    }
  }, []);

  const changeTheme = (theme: ThemeType) => {
    setSelectedTheme(theme);
    localStorage.setItem('hrilosopah_theme', theme);

    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (theme === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      // System
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  };

  return (
    <SettingsSubpageLayout title={t('appearance')}>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
        <button
          onClick={() => changeTheme('light')}
          className="w-full px-5 py-4 flex items-center justify-between border-b border-gray-50 hover:bg-gray-50 transition-colors text-left"
        >
          <div className="flex flex-col gap-1">
            <span className="font-bold text-sm text-gray-900">{t('lightMode')}</span>
            <span className="text-[10px] text-gray-500 font-medium">{t('lightModeDesc')}</span>
          </div>
          {selectedTheme === 'light' ? (
            <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
              <Check className="w-3 h-3 text-white" strokeWidth={3} />
            </div>
          ) : (
            <div className="w-5 h-5 rounded-full border-2 border-gray-200"></div>
          )}
        </button>

        <button
          onClick={() => changeTheme('dark')}
          className="w-full px-5 py-4 flex items-center justify-between border-b border-gray-50 hover:bg-gray-50 transition-colors text-left"
        >
          <div className="flex flex-col gap-1">
            <span className="font-bold text-sm text-gray-900">{t('darkMode')}</span>
            <span className="text-[10px] text-gray-500 font-medium">{t('darkModeDesc')}</span>
          </div>
          {selectedTheme === 'dark' ? (
            <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
              <Check className="w-3 h-3 text-white" strokeWidth={3} />
            </div>
          ) : (
            <div className="w-5 h-5 rounded-full border-2 border-gray-200"></div>
          )}
        </button>

        <button
          onClick={() => changeTheme('system')}
          className="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors text-left"
        >
          <div className="flex flex-col gap-1">
            <span className="font-bold text-sm text-gray-900">{t('systemMode')}</span>
            <span className="text-[10px] text-gray-500 font-medium">{t('systemModeDesc')}</span>
          </div>
          {selectedTheme === 'system' ? (
            <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
              <Check className="w-3 h-3 text-white" strokeWidth={3} />
            </div>
          ) : (
            <div className="w-5 h-5 rounded-full border-2 border-gray-200"></div>
          )}
        </button>
      </div>
    </SettingsSubpageLayout>
  );
}
