import React from 'react';
import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { ProfilePageClient } from '@/components/profile/ProfilePageClient';

export default async function ProfilePage({ params: { locale } }: { params: { locale: string } }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect(`/${locale}/login`);
  }

  const userEmail = session.user?.email || '';

  let dbUser = null;
  if (userEmail) {
    dbUser = await prisma.user.findUnique({
      where: { email: userEmail },
    });
  }

  const userName = dbUser?.name || userEmail.split('@')[0] || 'Learner';
  const userAvatarInitial = userName.charAt(0).toUpperCase();

  return (
    <ProfilePageClient
      locale={locale}
      userName={userName}
      userEmail={userEmail}
      userAvatarInitial={userAvatarInitial}
    />
  );
}
