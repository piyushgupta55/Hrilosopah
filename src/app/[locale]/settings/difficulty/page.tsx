import React from 'react';
import { SettingsSubpageLayout } from '@/components/settings/SettingsSubpageLayout';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { DifficultySettingsForm } from '@/components/settings/DifficultySettingsForm';

interface Props {
  params: {
    locale: string;
  };
}

export default async function DifficultySettingsPage({ params: { locale } }: Props) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    redirect(`/${locale}/login`);
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  const currentDifficulty = user?.experience || 'beginner';

  return (
    <SettingsSubpageLayout title="Default Quiz Difficulty">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden p-5">
        <DifficultySettingsForm initialDifficulty={currentDifficulty} />
      </div>
    </SettingsSubpageLayout>
  );
}
