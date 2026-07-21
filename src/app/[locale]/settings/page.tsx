import React from 'react';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import {
  ChevronLeft,
  ChevronRight,
  User,
  Mail,
  Bell,
  Moon,
  Globe,
  Sliders,
  Database,
  HelpCircle,
  MessageSquare,
  Star,
  Info,
} from 'lucide-react';
import { SettingsLogoutButton } from '@/components/settings/SettingsLogoutButton';

export default async function SettingsPage({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations('Settings');
  const session = await getServerSession(authOptions);

  let dbUser = null;
  if (session?.user?.email) {
    dbUser = await prisma.user.findUnique({
      where: { email: session.user.email },
    });
  }

  const userDifficulty = dbUser?.experience || 'beginner';

  return (
    <div className="flex-1 w-full bg-[#F8F9FA] flex flex-col overflow-y-auto overflow-x-hidden relative">
      {/* Header */}
      <div className="px-5 w-full flex items-center justify-between py-2 bg-white sticky top-0 z-10 border-b border-gray-100 shadow-sm">
        <Link
          href={`/${locale}/profile`}
          className="w-10 h-10 -ml-2 rounded-full flex items-center justify-center text-gray-900 hover:bg-gray-100 transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-xl font-bold text-gray-900 tracking-tight">{t('title')}</h1>
        <div className="w-10 h-10"></div> {/* Placeholder to balance header */}
      </div>

      <div className="p-5 flex flex-col gap-8 pb-12">
        {/* Account Section */}
        <div className="w-full">
          <h3 className="font-bold text-gray-900 text-sm mb-3 px-1">{t('account')}</h3>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
            <Link
              href={`/${locale}/settings/personal-info`}
              className="w-full px-5 py-4 flex items-center justify-between border-b border-gray-50 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-gray-500" />
                <span className="font-semibold text-sm text-gray-900">{t('personalInfo')}</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </Link>
            <Link
              href={`/${locale}/settings/email-password`}
              className="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-gray-500" />
                <span className="font-semibold text-sm text-gray-900">{t('emailPassword')}</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </Link>
          </div>
        </div>

        {/* Preferences Section */}
        <div className="w-full">
          <h3 className="font-bold text-gray-900 text-sm mb-3 px-1">{t('preferences')}</h3>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
            <Link
              href={`/${locale}/settings/appearance`}
              className="w-full px-5 py-4 flex items-center justify-between border-b border-gray-50 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Moon className="w-5 h-5 text-gray-500" />
                <span className="font-semibold text-sm text-gray-900">{t('appearance')}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 font-medium">{t('lightMode')}</span>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </Link>
            <Link
              href={`/${locale}/settings/language`}
              className="w-full px-5 py-4 flex items-center justify-between border-b border-gray-50 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-gray-500" />
                <span className="font-semibold text-sm text-gray-900">{t('language')}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 font-medium">
                  {(() => {
                    const languageNames: Record<string, string> = {
                      en: 'English',
                      ru: 'Русский',
                      hi: 'हिंदी',
                      pl: 'Polski',
                      lt: 'Lietuvių',
                      es: 'Español',
                      fr: 'Français',
                      it: 'Italiano',
                      ro: 'Română',
                      he: 'עברית',
                      zh: '中文',
                      ar: 'العربية',
                      ur: 'اردו',
                    };
                    return languageNames[locale] || 'English';
                  })()}
                </span>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </Link>
            <Link
              href={`/${locale}/settings/difficulty`}
              className="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Sliders className="w-5 h-5 text-gray-500" />
                <span className="font-semibold text-sm text-gray-900">{t('difficulty')}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 font-medium">{t(userDifficulty)}</span>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </Link>
          </div>
        </div>

        {/* Support Section */}
        <div className="w-full">
          <h3 className="font-bold text-gray-900 text-sm mb-3 px-1">{t('support')}</h3>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
            <Link
              href={`/${locale}/settings/help`}
              className="w-full px-5 py-4 flex items-center justify-between border-b border-gray-50 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <HelpCircle className="w-5 h-5 text-gray-500" />
                <span className="font-semibold text-sm text-gray-900">{t('helpCenter')}</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </Link>
            <Link
              href={`/${locale}/settings/contact`}
              className="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <MessageSquare className="w-5 h-5 text-gray-500" />
                <span className="font-semibold text-sm text-gray-900">{t('contactUs')}</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </Link>
          </div>
        </div>

        {/* Log Out Button */}
        <SettingsLogoutButton label={t('logout')} locale={locale} />
      </div>
    </div>
  );
}
