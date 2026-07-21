import React from 'react';
import { SettingsSubpageLayout } from '@/components/settings/SettingsSubpageLayout';

export default function NotificationsPage() {
  return (
    <SettingsSubpageLayout title="Notifications">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col p-5 gap-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1 pr-4">
            <span className="font-bold text-sm text-gray-900">Push Notifications</span>
            <span className="text-[10px] text-gray-500 font-medium">
              Receive daily reminders and updates on your device.
            </span>
          </div>
          <div className="w-12 h-6 bg-blue-600 rounded-full relative shrink-0">
            <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 right-0.5 shadow-sm"></div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1 pr-4">
            <span className="font-bold text-sm text-gray-900">Email Notifications</span>
            <span className="text-[10px] text-gray-500 font-medium">
              Weekly progress reports and new quiz alerts.
            </span>
          </div>
          <div className="w-12 h-6 bg-blue-600 rounded-full relative shrink-0">
            <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 right-0.5 shadow-sm"></div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1 pr-4">
            <span className="font-bold text-sm text-gray-900">Marketing Emails</span>
            <span className="text-[10px] text-gray-500 font-medium">
              Special offers and promotions from Hrilosopah.
            </span>
          </div>
          <div className="w-12 h-6 bg-gray-200 rounded-full relative shrink-0">
            <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 left-0.5 shadow-sm"></div>
          </div>
        </div>
      </div>
    </SettingsSubpageLayout>
  );
}
