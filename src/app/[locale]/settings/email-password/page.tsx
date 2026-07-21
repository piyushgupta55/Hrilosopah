import React from 'react';
import { SettingsSubpageLayout } from '@/components/settings/SettingsSubpageLayout';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { ChangePasswordForm } from '@/components/settings/ChangePasswordForm';

interface Props {
  params: {
    locale: string;
  };
}

export default async function EmailPasswordPage({ params: { locale } }: Props) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    redirect(`/${locale}/login`);
  }

  return (
    <SettingsSubpageLayout title="Email & Password">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden p-5">
        <ChangePasswordForm email={session.user.email} />
      </div>
    </SettingsSubpageLayout>
  );
}
