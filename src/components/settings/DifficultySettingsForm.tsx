'use client';

import React, { useState } from 'react';
import { Save, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface DifficultySettingsFormProps {
  initialDifficulty: string;
}

const ChartIcon = ({ level }: { level: number }) => (
  <div className="w-5 h-5 flex items-end justify-between space-x-[2px] shrink-0">
    <div
      className={`w-[4px] rounded-t-sm ${level >= 1 ? 'bg-blue-600 h-[6px]' : 'bg-gray-300 h-[6px]'}`}
    />
    <div
      className={`w-[4px] rounded-t-sm ${level >= 2 ? 'bg-blue-600 h-[12px]' : 'bg-gray-300 h-[12px]'}`}
    />
    <div
      className={`w-[4px] rounded-t-sm ${level >= 3 ? 'bg-blue-600 h-[18px]' : 'bg-gray-300 h-[18px]'}`}
    />
  </div>
);

export const DifficultySettingsForm = ({ initialDifficulty }: DifficultySettingsFormProps) => {
  const t = useTranslations('Settings');
  const [difficulty, setDifficulty] = useState(initialDifficulty);
  const [status, setStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const options = [
    {
      id: 'beginner',
      label: t('beginner'),
      desc: 'Tailored for absolute beginners to intermediate learners.',
      icon: <ChartIcon level={1} />,
    },
    {
      id: 'intermediate',
      label: t('intermediate'),
      desc: 'Moderate challenge with deeper concepts and practices.',
      icon: <ChartIcon level={2} />,
    },
    {
      id: 'advanced',
      label: t('advanced'),
      desc: 'Advanced level quizzes to master your capabilities.',
      icon: <ChartIcon level={3} />,
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('saving');
    setErrorMessage('');

    try {
      const res = await fetch('/api/user/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ experience: difficulty }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to update difficulty');
      }

      setStatus('success');
      setTimeout(() => setStatus('idle'), 3000);
    } catch (err: any) {
      console.error(err);
      setStatus('error');
      setErrorMessage(err.message || 'Something went wrong');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        {options.map((option) => {
          const isSelected = difficulty === option.id;
          return (
            <div
              key={option.id}
              onClick={() => setDifficulty(option.id)}
              className={`flex items-start p-4 border rounded-[16px] shadow-sm cursor-pointer transition-all ${
                isSelected
                  ? 'border-[#0052FF] bg-[#F0F5FF]/80 ring-2 ring-[#0052FF]/10'
                  : 'bg-white border-[#E5E7EB] hover:border-gray-300'
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center mr-4 shrink-0">
                {option.icon}
              </div>
              <div className="flex-1 min-w-0 pr-2">
                <h4 className="text-[#111827] font-bold text-[15px] mb-0.5">{option.label}</h4>
                <p className="text-[#6B7280] text-[12px] leading-snug">{option.desc}</p>
              </div>
              <div className="mt-2 shrink-0">
                <div
                  className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                    isSelected ? 'bg-[#0052FF] border-[#0052FF]' : 'border-gray-300'
                  }`}
                >
                  {isSelected && (
                    <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 14 14" fill="none">
                      <path
                        d="M11.6666 3.5L5.24992 9.91667L2.33325 7"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {status === 'success' && (
        <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-xl p-3 text-sm font-semibold animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>Default difficulty saved!</span>
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
            <span>Saving Difficulty...</span>
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
