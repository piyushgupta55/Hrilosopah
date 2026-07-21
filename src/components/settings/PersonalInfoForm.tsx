'use client';

import React, { useState } from 'react';
import { Save, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface PersonalInfoFormProps {
  initialName: string;
  initialUsername: string;
  initialPhone: string;
}

export const PersonalInfoForm = ({
  initialName,
  initialUsername,
  initialPhone,
}: PersonalInfoFormProps) => {
  const t = useTranslations('Settings');
  const [name, setName] = useState(initialName);
  const [username, setUsername] = useState(initialUsername);
  const [phone, setPhone] = useState(initialPhone);

  const [status, setStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('saving');
    setErrorMessage('');

    try {
      // Remove leading '@' if entered in username
      const cleanUsername = username.replace(/^@/, '').trim();

      const res = await fetch('/api/user/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          username: cleanUsername,
          phone: phone.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to update settings');
      }

      setStatus('success');
      // Clear success message after 3 seconds
      setTimeout(() => setStatus('idle'), 3000);
    } catch (err: any) {
      console.error(err);
      setStatus('error');
      setErrorMessage(err.message || 'Something went wrong');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <label className="text-sm font-bold text-gray-700 ml-1">{t('fullName')}</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          placeholder="Enter full name"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-bold text-gray-700 ml-1">{t('username')}</label>
        <div className="relative flex items-center">
          <span className="absolute left-4 text-gray-400 text-sm font-semibold select-none">@</span>
          <input
            type="text"
            value={username.replace(/^@/, '')}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-8 pr-4 py-3 text-sm text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            placeholder="username"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-bold text-gray-700 ml-1">{t('phoneNumber')}</label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder={t('addPhone')}
          className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
        />
      </div>

      {status === 'success' && (
        <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-xl p-3 text-sm font-semibold animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>Changes saved successfully!</span>
        </div>
      )}

      {status === 'error' && (
        <div className="flex items-center gap-2 text-rose-600 bg-rose-50 border border-rose-100 rounded-xl p-3 text-sm font-semibold animate-fadeIn">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={status === 'saving'}
        className="w-full mt-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-3.5 rounded-xl shadow-md flex items-center justify-center gap-2 transition-colors active:scale-[0.99]"
      >
        {status === 'saving' ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Saving...</span>
          </>
        ) : (
          <>
            <Save className="w-4 h-4" />
            <span>{t('saveChanges')}</span>
          </>
        )}
      </button>
    </form>
  );
};
