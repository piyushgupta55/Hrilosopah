'use client';

import React from 'react';
import { LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';

interface SettingsLogoutButtonProps {
  label: string;
  locale: string;
}

export const SettingsLogoutButton = ({ label, locale }: SettingsLogoutButtonProps) => {
  return (
    <button
      onClick={() => signOut({ callbackUrl: `/${locale}` })}
      className="w-full bg-white rounded-xl shadow-sm border border-red-100 p-4 flex items-center justify-center gap-2 hover:bg-red-50 transition-colors text-red-500 group active:scale-[0.99] transition-transform"
    >
      <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
      <span className="font-bold text-sm">{label}</span>
    </button>
  );
};
