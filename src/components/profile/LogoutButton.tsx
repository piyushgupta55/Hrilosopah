'use client';

import React from 'react';
import { LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';

export const LogoutButton = () => {
  return (
    <button
      onClick={() => signOut({ callbackUrl: '/en' })}
      className="w-full bg-white border border-border rounded-2xl p-4 shadow-sm flex items-center justify-between active:scale-[0.98] transition-transform mt-6"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-red-500">
          <LogOut className="w-5 h-5" />
        </div>
        <span className="font-semibold text-red-500">Log Out</span>
      </div>
    </button>
  );
};
