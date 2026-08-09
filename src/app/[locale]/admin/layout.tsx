import React from 'react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-[100] bg-[#F8FAFC] text-slate-900 overflow-y-auto w-full h-full min-h-screen flex flex-col font-sans">
      {children}
    </div>
  );
}
