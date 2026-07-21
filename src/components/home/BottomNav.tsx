'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { Home, Compass, Gamepad2, BarChart2, User } from 'lucide-react';

export const BottomNav = () => {
  const pathname = usePathname() || '';
  const t = useTranslations('Navigation');
  const locale = useLocale();

  const navItems = [
    { name: t('forYou'), href: '/', icon: Home, activeRegex: new RegExp(`^(\/${locale})?$`) },
    {
      name: t('explore'),
      href: '/explore',
      icon: Compass,
      activeRegex: new RegExp(`\/${locale}\/explore$|\/explore$`),
    },
    {
      name: t('play'),
      href: '/play',
      icon: Gamepad2,
      activeRegex: new RegExp(`\/${locale}\/play$|\/play$`),
    },
    {
      name: t('progress'),
      href: '/progress',
      icon: BarChart2,
      activeRegex: new RegExp(`\/${locale}\/progress$|\/progress$`),
    },
    {
      name: t('profile'),
      href: '/profile',
      icon: User,
      activeRegex: new RegExp(`\/${locale}\/profile$|\/profile$`),
    },
  ];

  return (
    <footer className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md md:max-w-3xl lg:max-w-5xl shrink-0 bg-white/95 dark:bg-[#0B0D12]/95 backdrop-blur-lg border-t border-border dark:border-[#1F2533] shadow-[0_-8px_16px_rgba(0,0,0,0.05)] pb-[env(safe-area-inset-bottom)] md:rounded-b-3xl z-50">
      <div className="flex justify-around items-center px-4 py-3">
        {navItems.map((item) => {
          const isActive = item.activeRegex.test(pathname);
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={`/${locale}${item.href === '/' ? '' : item.href}`}
              className="flex flex-col items-center flex-1"
            >
              <div className="flex flex-col items-center transition-colors">
                <Icon
                  className={`w-6 h-6 mb-1 transition-colors ${
                    isActive
                      ? 'fill-blue-600/20 stroke-blue-600 dark:stroke-[#4F7DFF] dark:fill-[#4F7DFF]/10'
                      : 'stroke-gray-400 dark:stroke-[#8B93A7] hover:stroke-gray-600 dark:hover:stroke-[#FFFFFF]'
                  }`}
                  strokeWidth={isActive ? 2.5 : 2}
                />
                <span
                  className={`text-[10px] sm:text-xs transition-colors ${
                    isActive
                      ? 'font-bold text-blue-600 dark:text-[#FFFFFF]'
                      : 'font-medium text-gray-400 dark:text-[#8B93A7] hover:text-gray-600 dark:hover:text-[#FFFFFF]'
                  }`}
                >
                  {item.name}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </footer>
  );
};
