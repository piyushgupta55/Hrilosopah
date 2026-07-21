'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { useParams } from 'next/navigation';

interface SettingsSubpageLayoutProps {
  title: string;
  children: React.ReactNode;
}

export function SettingsSubpageLayout({ title, children }: SettingsSubpageLayoutProps) {
  const params = useParams();
  const locale = params?.locale || 'en';

  return (
    <div className="flex-1 w-full bg-[#F8F9FA] flex flex-col min-h-screen overflow-x-hidden relative">
      {/* Header */}
      <div className="px-5 w-full flex items-center justify-between py-2 bg-white sticky top-0 z-20 border-b border-gray-100 shadow-sm">
        <Link
          href={`/${locale}/settings`}
          className="w-10 h-10 -ml-2 rounded-full flex items-center justify-center text-gray-900 hover:bg-gray-100 transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-xl font-bold text-gray-900 tracking-tight">{title}</h1>
        <div className="w-10 h-10"></div> {/* Placeholder to balance header */}
      </div>

      {/* Content Area */}
      <div className="p-5 pb-12 flex-1">{children}</div>
    </div>
  );
}
