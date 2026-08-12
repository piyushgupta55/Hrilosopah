'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { QuizEditorForm, QuizFormData } from '@/components/admin/QuizEditorForm';
import { Loader2, AlertCircle } from 'lucide-react';

export default function EditQuizPage() {
  const params = useParams() || {};
  const quizId = params.id as string;

  const [quizData, setQuizData] = useState<QuizFormData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (!quizId) return;

    const fetchQuizDetails = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch(`/api/admin/quiz?id=${quizId}`, { cache: 'no-store' });
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || 'Failed to load quiz details.');
        }

        setQuizData(data.quiz);
      } catch (err: any) {
        console.error('Fetch quiz edit error:', err);
        setError(err.message || 'Could not load quiz details.');
      } finally {
        setLoading(false);
      }
    };

    fetchQuizDetails();
  }, [quizId]);

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6">
        <div className="flex items-center gap-3 bg-white px-6 py-4 rounded-2xl border border-blue-100 shadow-sm text-slate-700 font-extrabold text-sm">
          <Loader2 className="w-5 h-5 text-[#2563EB] animate-spin" />
          <span>Loading quiz editor...</span>
        </div>
      </div>
    );
  }

  if (error || !quizData) {
    return (
      <div className="w-full min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6">
        <div className="bg-white p-6 rounded-2xl border border-red-200 shadow-sm text-center space-y-3 max-w-md">
          <div className="w-12 h-12 bg-red-50 text-red-600 rounded-xl flex items-center justify-center mx-auto border border-red-100">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="font-extrabold text-slate-900 text-base">Error Loading Quiz</h2>
          <p className="text-xs text-slate-600 font-medium">{error || 'Quiz not found'}</p>
        </div>
      </div>
    );
  }

  return <QuizEditorForm mode="edit" initialData={quizData} />;
}
