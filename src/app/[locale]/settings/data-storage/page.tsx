import React from 'react';
import { SettingsSubpageLayout } from '@/components/settings/SettingsSubpageLayout';

export default function PlaceholderPage() {
  return (
    <SettingsSubpageLayout title="Data & Storage">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden p-8 flex flex-col items-center justify-center text-center gap-4 min-h-[300px]">
        <h2 className="text-xl font-bold text-gray-900">Data & Storage</h2>
        <p className="text-sm text-gray-500 max-w-[250px]">
          This section is currently under construction. Check back soon for updates!
        </p>
      </div>
    </SettingsSubpageLayout>
  );
}
