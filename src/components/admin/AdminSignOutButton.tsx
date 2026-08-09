'use client';

import React from 'react';
import { LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';

export function AdminSignOutButton({ locale }: { locale: string }) {
  return (
    <button
      onClick={() => signOut({ callbackUrl: `/${locale}/admin/login` })}
      className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-600 text-xs font-bold transition-colors border border-slate-200"
    >
      <LogOut className="w-4 h-4" />
      <span>Sign Out</span>
    </button>
  );
}
