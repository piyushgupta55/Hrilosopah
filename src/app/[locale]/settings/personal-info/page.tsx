import React from 'react';
import { SettingsSubpageLayout } from '@/components/settings/SettingsSubpageLayout';
import { getTranslations } from 'next-intl/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { PersonalInfoForm } from '@/components/settings/PersonalInfoForm';

export default async function PersonalInfoPage() {
  const session = await getServerSession(authOptions);
  const userEmail = session?.user?.email;

  let dbUser = null;
  if (userEmail) {
    dbUser = await prisma.user.findUnique({
      where: { email: userEmail },
    });
  }

  const defaultName = dbUser?.name || userEmail?.split('@')[0] || '';

  const t = await getTranslations('Settings');

  return (
    <SettingsSubpageLayout title={t('personalInfo')}>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden p-5">
        <PersonalInfoForm initialName={defaultName} />
      </div>
    </SettingsSubpageLayout>
  );
}
