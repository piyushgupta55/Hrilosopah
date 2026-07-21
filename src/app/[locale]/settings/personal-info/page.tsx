import React from 'react';
import { SettingsSubpageLayout } from '@/components/settings/SettingsSubpageLayout';
import { Save } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function PersonalInfoPage() {
  const t = useTranslations('Settings');

  return (
    <SettingsSubpageLayout title={t('personalInfo')}>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden p-5 flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-gray-700 ml-1">{t('fullName')}</label>
          <input
            type="text"
            defaultValue="Piyush Gupta"
            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-gray-700 ml-1">{t('username')}</label>
          <input
            type="text"
            defaultValue="@piyush_explorer"
            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-gray-700 ml-1">{t('phoneNumber')}</label>
          <input
            type="tel"
            placeholder={t('addPhone')}
            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
        </div>

        <button className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl shadow-md flex items-center justify-center gap-2 transition-colors">
          <Save className="w-4 h-4" />
          {t('saveChanges')}
        </button>
      </div>
    </SettingsSubpageLayout>
  );
}
