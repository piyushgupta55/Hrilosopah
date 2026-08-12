'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Shield,
  BookOpen,
  Plus,
  Search,
  Edit3,
  Trash2,
  X,
  Check,
  Loader2,
  Sparkles,
  HelpCircle,
  FolderPlus,
  ChevronRight,
  Sparkle,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export interface QuestionData {
  id: string;
  text: string;
  options: string[];
  correctOptionIndex: number;
  difficulty: string;
  explanation: string | null;
  category?: string;
  quizId?: string;
}

export interface QuizItem {
  id: string;
  slug: string;
  category: string;
  isActive: boolean;
  title: string;
  questionsCount: number;
  questions?: QuestionData[];
}

interface AdminQuizzesClientProps {
  locale: string;
  initialQuizzes: QuizItem[];
}

export function AdminQuizzesClient({ locale, initialQuizzes }: AdminQuizzesClientProps) {
  const router = useRouter();
  const [quizzes, setQuizzes] = useState<QuizItem[]>(initialQuizzes);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Quiz Modal State
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState<QuizItem | null>(null);

  // Manage Questions Drawer State
  const [managingQuiz, setManagingQuiz] = useState<QuizItem | null>(null);
  const [isAddQuestionOpen, setIsAddQuestionOpen] = useState(false);
  const [addQuestionTab, setAddQuestionTab] = useState<'ai' | 'manual'>('ai');
  const [editingQuestion, setEditingQuestion] = useState<QuestionData | null>(null);

  // Quiz Form State
  const [formTitle, setFormTitle] = useState('');
  const [formSlug, setFormSlug] = useState('');
  const [formCategory, setFormCategory] = useState('Coding');
  const [customCategory, setCustomCategory] = useState('');
  const [formDifficulty, setFormDifficulty] = useState('beginner');
  const [formQuizType, setFormQuizType] = useState('Build-Up/Leveled');
  const [formIsActive, setFormIsActive] = useState(true);

  // Question Form State
  const [qText, setQText] = useState('');
  const [qOpt0, setQOpt0] = useState('');
  const [qOpt1, setQOpt1] = useState('');
  const [qOpt2, setQOpt2] = useState('');
  const [qOpt3, setQOpt3] = useState('');
  const [qCorrectIdx, setQCorrectIdx] = useState(0);
  const [qDifficulty, setQDifficulty] = useState('beginner');
  const [qExplanation, setQExplanation] = useState('');
  const [aiTopicPrompt, setAiTopicPrompt] = useState('');

  // Statuses
  const [loading, setLoading] = useState(false);
  const [aiGenerating, setAiGenerating] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Extract all unique categories dynamically
  const uniqueCategories = Array.from(
    new Set([
      'Coding',
      'Python',
      'AI',
      'Crypto',
      'Machine Learning',
      'Web3',
      ...quizzes.map((q) => q.category).filter(Boolean),
    ])
  );

  const openCreateModal = () => {
    setFormTitle('');
    setFormSlug('');
    setFormCategory('Coding');
    setCustomCategory('');
    setFormDifficulty('beginner');
    setFormQuizType('Build-Up/Leveled');
    setFormIsActive(true);
    setErrorMsg('');
    setIsCreateOpen(true);
  };

  const openEditModal = (quiz: QuizItem) => {
    setEditingQuiz(quiz);
    setFormTitle(quiz.title);
    setFormSlug(quiz.slug);
    setFormCategory(quiz.category);
    setCustomCategory(uniqueCategories.includes(quiz.category) ? '' : quiz.category);
    setFormDifficulty((quiz as any).difficulty || 'beginner');
    setFormQuizType((quiz as any).quizType || 'Build-Up/Leveled');
    setFormIsActive(quiz.isActive);
    setErrorMsg('');
  };

  const openManageQuestions = (quiz: QuizItem) => {
    setManagingQuiz(quiz);
    setIsAddQuestionOpen(false);
    setErrorMsg('');
    setSuccessMsg('');
  };

  const openAddQuestionForm = () => {
    setQText('');
    setQOpt0('');
    setQOpt1('');
    setQOpt2('');
    setQOpt3('');
    setQCorrectIdx(0);
    setQDifficulty('beginner');
    setQExplanation('');
    setAiTopicPrompt('');
    setEditingQuestion(null);
    setAddQuestionTab('ai');
    setErrorMsg('');
    setSuccessMsg('');
    setIsAddQuestionOpen(true);
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle) {
      setErrorMsg('Please fill in the quiz title.');
      return;
    }

    const autoSlug =
      formSlug ||
      formTitle
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

    const finalCategory = formCategory === 'custom' ? customCategory || 'General' : formCategory;

    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/admin/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formTitle,
          slug: autoSlug,
          category: finalCategory,
          difficulty: formDifficulty,
          quizType: formQuizType,
          isActive: formIsActive,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to create quiz');
      }

      const newQuiz: QuizItem = {
        id: data.quiz.id || String(Date.now()),
        slug: data.quiz.slug || autoSlug,
        category: finalCategory,
        isActive: formIsActive,
        title: formTitle,
        questionsCount: 0,
        questions: [],
      };

      setQuizzes((prev) => [newQuiz, ...prev]);
      setIsCreateOpen(false);
      router.refresh();
    } catch (err: any) {
      setErrorMsg(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingQuiz || !formTitle) {
      setErrorMsg('Title is required.');
      return;
    }

    const finalCategory = formCategory === 'custom' ? customCategory || 'General' : formCategory;

    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/admin/quiz', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingQuiz.id,
          title: formTitle,
          category: finalCategory,
          difficulty: formDifficulty,
          quizType: formQuizType,
          isActive: formIsActive,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to update quiz');
      }

      setQuizzes((prev) =>
        prev.map((q) =>
          q.id === editingQuiz.id
            ? { ...q, title: formTitle, category: finalCategory, isActive: formIsActive }
            : q
        )
      );

      setEditingQuiz(null);
      router.refresh();
    } catch (err: any) {
      setErrorMsg(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteQuiz = async (quizId: string) => {
    if (!confirm('Are you sure you want to delete this quiz and all its questions?')) return;

    try {
      const res = await fetch(`/api/admin/quiz?id=${quizId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setQuizzes((prev) => prev.filter((q) => q.id !== quizId));
        if (managingQuiz?.id === quizId) setManagingQuiz(null);
        router.refresh();
      }
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  // Generate Question using Vercel AI Gateway
  const handleGenerateAIQuestion = async () => {
    if (!managingQuiz) return;
    setAiGenerating(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await fetch('/api/admin/generate-question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: aiTopicPrompt || managingQuiz.title,
          category: managingQuiz.category,
          difficulty: qDifficulty,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to generate question with AI');

      const generated = data.question;
      if (generated) {
        setQText(generated.text || '');
        setQOpt0(generated.options?.[0] || '');
        setQOpt1(generated.options?.[1] || '');
        setQOpt2(generated.options?.[2] || '');
        setQOpt3(generated.options?.[3] || '');
        setQCorrectIdx(generated.correctOptionIndex ?? 0);
        setQExplanation(generated.explanation || '');
        setAddQuestionTab('manual'); // Switch to manual preview so user can tweak or save!
        setSuccessMsg(
          '✨ Question generated with AI Gateway! Review below and click "Save Question".'
        );
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to generate AI question.');
    } finally {
      setAiGenerating(false);
    }
  };

  // Save Question to DB under current managingQuiz
  const handleSaveQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!managingQuiz || !qText || !qOpt0 || !qOpt1 || !qOpt2 || !qOpt3) {
      setErrorMsg('Please fill in question text and all 4 options.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    const optionsArray = [qOpt0, qOpt1, qOpt2, qOpt3];

    try {
      if (editingQuestion) {
        const res = await fetch('/api/admin/questions', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: editingQuestion.id,
            text: qText,
            options: optionsArray,
            correctOptionIndex: qCorrectIdx,
            difficulty: qDifficulty,
            explanation: qExplanation,
            quizId: managingQuiz.id,
          }),
        });

        if (!res.ok) throw new Error('Failed to update question');

        const updatedQ: QuestionData = {
          id: editingQuestion.id,
          text: qText,
          options: optionsArray,
          correctOptionIndex: qCorrectIdx,
          difficulty: qDifficulty,
          explanation: qExplanation,
          quizId: managingQuiz.id,
        };

        const updatedQuestions = (managingQuiz.questions || []).map((q) =>
          q.id === editingQuestion.id ? updatedQ : q
        );

        setManagingQuiz({
          ...managingQuiz,
          questions: updatedQuestions,
          questionsCount: updatedQuestions.length,
        });

        setQuizzes((prev) =>
          prev.map((qz) =>
            qz.id === managingQuiz.id
              ? { ...qz, questions: updatedQuestions, questionsCount: updatedQuestions.length }
              : qz
          )
        );

        setEditingQuestion(null);
        setIsAddQuestionOpen(false);
        setSuccessMsg('Question updated successfully!');
      } else {
        const res = await fetch('/api/admin/questions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: qText,
            options: optionsArray,
            correctOptionIndex: qCorrectIdx,
            difficulty: qDifficulty,
            explanation: qExplanation,
            quizId: managingQuiz.id,
            category: managingQuiz.category,
          }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to save question');

        const newQ: QuestionData = {
          id: data.question.id || String(Date.now()),
          text: qText,
          options: optionsArray,
          correctOptionIndex: qCorrectIdx,
          difficulty: qDifficulty,
          explanation: qExplanation,
          quizId: managingQuiz.id,
        };

        const updatedQuestions = [...(managingQuiz.questions || []), newQ];

        setManagingQuiz({
          ...managingQuiz,
          questions: updatedQuestions,
          questionsCount: updatedQuestions.length,
        });

        setQuizzes((prev) =>
          prev.map((qz) =>
            qz.id === managingQuiz.id
              ? { ...qz, questions: updatedQuestions, questionsCount: updatedQuestions.length }
              : qz
          )
        );

        setIsAddQuestionOpen(false);
        setSuccessMsg('Question saved to quiz!');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error saving question');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteQuestion = async (qId: string) => {
    if (!confirm('Are you sure you want to delete this question?')) return;
    try {
      const res = await fetch(`/api/admin/questions?id=${qId}`, { method: 'DELETE' });
      if (res.ok && managingQuiz) {
        const updatedQuestions = (managingQuiz.questions || []).filter((q) => q.id !== qId);
        setManagingQuiz({
          ...managingQuiz,
          questions: updatedQuestions,
          questionsCount: updatedQuestions.length,
        });

        setQuizzes((prev) =>
          prev.map((qz) =>
            qz.id === managingQuiz.id
              ? { ...qz, questions: updatedQuestions, questionsCount: updatedQuestions.length }
              : qz
          )
        );
      }
    } catch (err) {
      console.error('Delete question error:', err);
    }
  };

  const filteredQuizzes = quizzes.filter((q) => {
    const matchesSearch =
      q.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.category.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCat =
      categoryFilter === 'all' || q.category.toLowerCase() === categoryFilter.toLowerCase();

    return matchesSearch && matchesCat;
  });

  const adminNav = [
    { label: 'Overview', href: `/${locale}/admin/dashboard`, active: false },
    { label: 'Quizzes & Categories', href: `/${locale}/admin/quizzes`, active: true },
    { label: 'Users', href: `/${locale}/admin/users`, active: false },
    { label: 'Payments ($1)', href: `/${locale}/admin/payments`, active: false },
  ];

  return (
    <div className="w-full min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-sans">
      {/* Header */}
      <header className="w-full border-b border-blue-100 bg-white/95 backdrop-blur-lg px-4 sm:px-8 py-4 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-center text-[#2563EB]">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-black text-base sm:text-lg text-slate-900">
              Category & Quiz Management
            </h1>
            <span className="text-[11px] text-slate-500 font-semibold">
              Total Quizzes: {quizzes.length} • Categories: {uniqueCategories.length}
            </span>
          </div>
        </div>
        <Link
          href={`/${locale}/admin/dashboard`}
          className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-blue-50 text-xs sm:text-sm font-extrabold text-slate-700 hover:text-[#2563EB] border border-slate-200 transition-colors"
        >
          Back to Dashboard
        </Link>
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-8 space-y-6">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-gray-200 pb-4 overflow-x-auto no-scrollbar">
          {adminNav.map((tab) => (
            <Link
              key={tab.label}
              href={tab.href}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all whitespace-nowrap ${
                tab.active
                  ? 'bg-[#2563EB] text-white shadow-md shadow-blue-500/20'
                  : 'bg-white text-slate-600 hover:bg-blue-50 hover:text-[#2563EB] border border-blue-100'
              }`}
            >
              {tab.label}
            </Link>
          ))}
        </div>

        {/* Action Bar */}
        <div className="bg-white border border-blue-100 rounded-2xl p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search category, quiz title, or slug..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#2563EB]"
              />
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-xl shrink-0 overflow-x-auto no-scrollbar max-w-full">
              <button
                onClick={() => setCategoryFilter('all')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  categoryFilter === 'all' ? 'bg-white text-[#2563EB] shadow-sm' : 'text-slate-600'
                }`}
              >
                All ({quizzes.length})
              </button>
              {uniqueCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all whitespace-nowrap ${
                    categoryFilter.toLowerCase() === cat.toLowerCase()
                      ? 'bg-white text-[#2563EB] shadow-sm'
                      : 'text-slate-600'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={openCreateModal}
            className="flex items-center justify-center gap-2 px-5 py-3 bg-[#2563EB] hover:bg-[#1D4ED8] rounded-xl text-xs sm:text-sm font-bold text-white transition-all shadow-md shadow-blue-500/20 active:scale-[0.98] shrink-0"
          >
            <FolderPlus className="w-4.5 h-4.5" />
            <span>+ Create Category / Quiz</span>
          </button>
        </div>

        {/* Clean Quiz & Category Table */}
        <div className="bg-white border border-blue-100 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 text-slate-500 uppercase font-bold border-b border-gray-100">
                <tr>
                  <th className="p-4 sm:p-5">Quiz Title & Slug</th>
                  <th className="p-4 sm:p-5">Category</th>
                  <th className="p-4 sm:p-5">Questions</th>
                  <th className="p-4 sm:p-5">Status</th>
                  <th className="p-4 sm:p-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium">
                {filteredQuizzes.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-10 text-center text-slate-500 font-semibold">
                      No quizzes found. Click &quot;+ Create Category / Quiz&quot; above to add one.
                    </td>
                  </tr>
                ) : (
                  filteredQuizzes.map((q) => (
                    <tr key={q.id} className="hover:bg-blue-50/50 transition-colors">
                      <td className="p-4 sm:p-5 font-bold text-slate-900">
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#2563EB] shrink-0">
                            <BookOpen className="w-4.5 h-4.5" />
                          </div>
                          <div>
                            <span className="block font-extrabold text-slate-900 text-sm">
                              {q.title}
                            </span>
                            <span className="text-[11px] text-slate-400 font-normal">
                              slug: {q.slug}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 sm:p-5">
                        <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-blue-50 text-[#2563EB] border border-blue-100">
                          {q.category}
                        </span>
                      </td>
                      <td className="p-4 sm:p-5 text-slate-700 font-extrabold">
                        <button
                          onClick={() => openManageQuestions(q)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition-all hover:scale-[1.02]"
                        >
                          <span>Manage Questions ({q.questionsCount})</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </td>
                      <td className="p-4 sm:p-5">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-extrabold border ${
                            q.isActive
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-amber-50 text-amber-600 border-amber-200'
                          }`}
                        >
                          {q.isActive ? 'Active DB' : 'Draft'}
                        </span>
                      </td>
                      <td className="p-4 sm:p-5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditModal(q)}
                            className="px-3 py-1.5 bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-[#2563EB] font-extrabold text-xs rounded-xl border border-slate-200 transition-all flex items-center gap-1"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => handleDeleteQuiz(q.id)}
                            className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-xl border border-red-100 transition-all"
                            title="Delete Quiz"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* MANAGE QUESTIONS DRAWER FOR A QUIZ */}
      {managingQuiz && (
        <div className="fixed inset-0 z-[150] bg-slate-900/70 backdrop-blur-sm flex justify-end">
          <div className="bg-white w-full max-w-2xl h-full shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-300">
            {/* Drawer Header */}
            <div className="p-5 border-b border-gray-100 bg-slate-50 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-100 text-[#2563EB]">
                    {managingQuiz.category}
                  </span>
                  <h3 className="font-black text-slate-900 text-lg">{managingQuiz.title}</h3>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Quiz Slug: <code className="text-blue-600">{managingQuiz.slug}</code> •{' '}
                  {managingQuiz.questionsCount} questions
                </p>
              </div>

              <button
                onClick={() => setManagingQuiz(null)}
                className="w-9 h-9 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Notification Messages */}
            {errorMsg && (
              <div className="m-4 p-3 bg-red-50 text-red-600 text-xs font-bold rounded-xl border border-red-200">
                {errorMsg}
              </div>
            )}
            {successMsg && (
              <div className="m-4 p-3 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-xl border border-emerald-200">
                {successMsg}
              </div>
            )}

            {/* Drawer Actions */}
            <div className="px-5 py-3 border-b border-gray-100 bg-white flex items-center justify-between gap-3">
              <span className="text-xs font-extrabold text-slate-700">Questions List</span>
              <button
                onClick={openAddQuestionForm}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>+ Add Question to Quiz</span>
              </button>
            </div>

            {/* ADD/EDIT QUESTION FORM MODAL INSIDE DRAWER */}
            {isAddQuestionOpen && (
              <div className="p-5 border-b border-blue-100 bg-blue-50/50 space-y-4">
                <div className="flex items-center justify-between border-b border-blue-100 pb-2">
                  <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-blue-600" />
                    {editingQuestion ? 'Edit Question' : 'Add New Question to Quiz'}
                  </h4>
                  <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-blue-100">
                    <button
                      onClick={() => setAddQuestionTab('ai')}
                      className={`px-3 py-1 text-xs font-bold rounded-lg transition-all flex items-center gap-1 ${
                        addQuestionTab === 'ai'
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'text-slate-600 hover:text-blue-600'
                      }`}
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>AI Generator</span>
                    </button>
                    <button
                      onClick={() => setAddQuestionTab('manual')}
                      className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                        addQuestionTab === 'manual'
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'text-slate-600 hover:text-blue-600'
                      }`}
                    >
                      Manual Entry
                    </button>
                  </div>
                </div>

                {addQuestionTab === 'ai' ? (
                  <div className="bg-white p-4 rounded-2xl border border-blue-100 shadow-sm space-y-3">
                    <p className="text-xs text-slate-600 font-medium">
                      Generate an instant question tailored to category{' '}
                      <strong className="text-blue-600">{managingQuiz.category}</strong> using your
                      AI Gateway key!
                    </p>
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-700">
                        Topic or Keyword (Optional)
                      </label>
                      <input
                        type="text"
                        placeholder={`e.g. ${managingQuiz.title} key concepts`}
                        value={aiTopicPrompt}
                        onChange={(e) => setAiTopicPrompt(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleGenerateAIQuestion}
                      disabled={aiGenerating}
                      className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-extrabold rounded-xl shadow-md flex items-center justify-center gap-2 hover:opacity-95 disabled:opacity-50"
                    >
                      {aiGenerating ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Generating with AI Gateway...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 text-amber-300" />
                          <span>Generate Question with AI</span>
                        </>
                      )}
                    </button>
                  </div>
                ) : (
                  <form
                    onSubmit={handleSaveQuestion}
                    className="space-y-3 bg-white p-4 rounded-2xl border border-blue-100 shadow-sm"
                  >
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-700">Question Text</label>
                      <textarea
                        rows={2}
                        placeholder="Enter the question..."
                        value={qText}
                        onChange={(e) => setQText(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-700">Option 1</label>
                        <input
                          type="text"
                          value={qOpt0}
                          onChange={(e) => setQOpt0(e.target.value)}
                          className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                          required
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-700">Option 2</label>
                        <input
                          type="text"
                          value={qOpt1}
                          onChange={(e) => setQOpt1(e.target.value)}
                          className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                          required
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-700">Option 3</label>
                        <input
                          type="text"
                          value={qOpt2}
                          onChange={(e) => setQOpt2(e.target.value)}
                          className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                          required
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-700">Option 4</label>
                        <input
                          type="text"
                          value={qOpt3}
                          onChange={(e) => setQOpt3(e.target.value)}
                          className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-700">
                          Correct Option
                        </label>
                        <select
                          value={qCorrectIdx}
                          onChange={(e) => setQCorrectIdx(Number(e.target.value))}
                          className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                        >
                          <option value={0}>Option 1</option>
                          <option value={1}>Option 2</option>
                          <option value={2}>Option 3</option>
                          <option value={3}>Option 4</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-700">Difficulty</label>
                        <select
                          value={qDifficulty}
                          onChange={(e) => setQDifficulty(e.target.value)}
                          className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                        >
                          <option value="beginner">Beginner</option>
                          <option value="intermediate">Intermediate</option>
                          <option value="advanced">Advanced</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-700">Explanation</label>
                      <input
                        type="text"
                        placeholder="Explanation for correct answer..."
                        value={qExplanation}
                        onChange={(e) => setQExplanation(e.target.value)}
                        className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                      />
                    </div>

                    <div className="pt-2 flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setIsAddQuestionOpen(false)}
                        className="px-3 py-1.5 bg-slate-100 text-slate-600 font-bold text-xs rounded-xl"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm flex items-center gap-1 disabled:opacity-50"
                      >
                        {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                        <span>{editingQuestion ? 'Update Question' : 'Save Question to Quiz'}</span>
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* Questions List */}
            <div className="flex-1 overflow-y-auto p-5 space-y-3">
              {!managingQuiz.questions || managingQuiz.questions.length === 0 ? (
                <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  <HelpCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-xs text-slate-600 font-semibold mb-1">
                    No questions in this quiz yet.
                  </p>
                  <p className="text-[11px] text-slate-400 mb-3">
                    Click below to generate questions with AI or enter manually.
                  </p>
                  <button
                    onClick={openAddQuestionForm}
                    className="px-4 py-2 bg-blue-600 text-white font-bold text-xs rounded-xl shadow-sm"
                  >
                    + Add First Question
                  </button>
                </div>
              ) : (
                managingQuiz.questions.map((q, idx) => (
                  <div
                    key={q.id}
                    className="p-4 bg-white border border-slate-200 rounded-2xl shadow-sm hover:border-blue-200 transition-all space-y-2.5"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-2">
                        <span className="w-5 h-5 rounded-full bg-blue-100 text-[#2563EB] font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <h5 className="font-bold text-slate-900 text-xs sm:text-sm">{q.text}</h5>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => {
                            setEditingQuestion(q);
                            setQText(q.text);
                            setQOpt0(q.options[0] || '');
                            setQOpt1(q.options[1] || '');
                            setQOpt2(q.options[2] || '');
                            setQOpt3(q.options[3] || '');
                            setQCorrectIdx(q.correctOptionIndex);
                            setQDifficulty(q.difficulty);
                            setQExplanation(q.explanation || '');
                            setAddQuestionTab('manual');
                            setIsAddQuestionOpen(true);
                          }}
                          className="p-1 text-slate-400 hover:text-blue-600 rounded-lg"
                          title="Edit Question"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteQuestion(q.id)}
                          className="p-1 text-slate-400 hover:text-red-600 rounded-lg"
                          title="Delete Question"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pl-7">
                      {q.options.map((opt, optIdx) => (
                        <div
                          key={optIdx}
                          className={`p-2 rounded-xl text-xs font-semibold border ${
                            optIdx === q.correctOptionIndex
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200 flex items-center justify-between'
                              : 'bg-slate-50 text-slate-700 border-slate-100'
                          }`}
                        >
                          <span>{opt}</span>
                          {optIdx === q.correctOptionIndex && (
                            <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* CREATE CATEGORY / QUIZ MODAL */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-[200] bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-black text-slate-900 text-lg flex items-center gap-2">
                <FolderPlus className="w-5 h-5 text-[#2563EB]" />
                Create New Quiz & Category
              </h3>
              <button
                onClick={() => setIsCreateOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-900"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {errorMsg && (
              <div className="p-3 bg-red-50 text-red-600 text-xs font-semibold rounded-xl border border-red-200">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-extrabold text-slate-700">Quiz Title</label>
                <input
                  type="text"
                  placeholder="e.g. Python Basics, Cyber Security, React Mastery"
                  value={formTitle}
                  onChange={(e) => {
                    const titleVal = e.target.value;
                    setFormTitle(titleVal);
                    setFormSlug(
                      titleVal
                        .toLowerCase()
                        .replace(/[^a-z0-9]+/g, '-')
                        .replace(/(^-|-$)/g, '')
                    );
                    if (titleVal.trim()) {
                      const trimmed = titleVal.trim();
                      if (
                        ['Coding', 'Python', 'AI', 'Crypto', 'Machine Learning', 'Web3'].includes(
                          trimmed
                        )
                      ) {
                        setFormCategory(trimmed);
                        setCustomCategory('');
                      } else {
                        setFormCategory('custom');
                        setCustomCategory(trimmed);
                      }
                    }
                  }}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#2563EB]"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold text-slate-700">Category</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#2563EB]"
                  >
                    <option value="Coding">Coding</option>
                    <option value="Python">Python</option>
                    <option value="AI">AI</option>
                    <option value="Crypto">Crypto</option>
                    <option value="Machine Learning">Machine Learning</option>
                    <option value="Web3">Web3</option>
                    <option value="custom">+ New Category...</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold text-slate-700">Difficulty</label>
                  <select
                    value={formDifficulty}
                    onChange={(e) => setFormDifficulty(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#2563EB]"
                  >
                    <option value="beginner">Beginner / Easy</option>
                    <option value="intermediate">Intermediate / Medium</option>
                    <option value="advanced">Advanced / Hard</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold text-slate-700">Status</label>
                  <select
                    value={formIsActive ? 'active' : 'draft'}
                    onChange={(e) => setFormIsActive(e.target.value === 'active')}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#2563EB]"
                  >
                    <option value="active">Active DB</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
              </div>

              {formCategory === 'custom' && (
                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold text-slate-700">Category Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Robotics, Data Science, Cybersecurity"
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#2563EB]"
                    required
                  />
                </div>
              )}

              {/* Quiz Type Selector & Explanatory Note */}
              <div className="space-y-2 pt-1 border-t border-slate-100">
                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold text-slate-700">Quiz Type</label>
                  <select
                    value={formQuizType}
                    onChange={(e) => setFormQuizType(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#2563EB]"
                  >
                    <option value="Build-Up/Leveled">Build-Up / Leveled Quiz</option>
                    <option value="This or That">This or That (Rapid Choice)</option>
                    <option value="Timed Challenge">Timed Speed Challenge</option>
                    <option value="Daily Challenge">Daily Streak Challenge</option>
                  </select>
                </div>

                <div className="p-3 bg-blue-50/80 border border-blue-200 text-slate-700 text-xs rounded-xl leading-relaxed space-y-1">
                  <span className="font-black text-blue-700 flex items-center gap-1">
                    💡 Meaning of selected Quiz Type:
                  </span>
                  <p className="text-slate-600 font-medium">
                    {formQuizType === 'This or That' &&
                      'Binary choice quiz with 2 rapid options per question designed for quick decision-making and instant learning.'}
                    {formQuizType === 'Timed Challenge' &&
                      'Speed-focused challenge with a active countdown timer for each question to earn extra bonus XP.'}
                    {formQuizType === 'Daily Challenge' &&
                      'Special rotating daily challenge quiz designed to reward daily active players with extra streak bonus XP.'}
                    {(formQuizType === 'Build-Up/Leveled' || !formQuizType) &&
                      'Progressive level-based quiz (Level 1, Level 2, Level 3) where questions get progressively more challenging as users level up.'}
                  </p>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-4 py-2.5 bg-slate-100 text-slate-600 font-extrabold text-xs rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-extrabold text-xs rounded-xl shadow-md flex items-center gap-1.5 disabled:opacity-50"
                >
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>{loading ? 'Creating...' : 'Save Quiz'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT QUIZ MODAL */}
      {editingQuiz && (
        <div className="fixed inset-0 z-[200] bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-black text-slate-900 text-lg flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-[#2563EB]" />
                Edit Quiz ({editingQuiz.title})
              </h3>
              <button
                onClick={() => setEditingQuiz(null)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-900"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {errorMsg && (
              <div className="p-3 bg-red-50 text-red-600 text-xs font-semibold rounded-xl border border-red-200">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-extrabold text-slate-700">Quiz Title</label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => {
                    const titleVal = e.target.value;
                    setFormTitle(titleVal);
                    setFormSlug(
                      titleVal
                        .toLowerCase()
                        .replace(/[^a-z0-9]+/g, '-')
                        .replace(/(^-|-$)/g, '')
                    );
                  }}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#2563EB]"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold text-slate-700">Category</label>
                  <select
                    value={uniqueCategories.includes(formCategory) ? formCategory : 'custom'}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#2563EB]"
                  >
                    {uniqueCategories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                    <option value="custom">+ Custom Category...</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold text-slate-700">Difficulty</label>
                  <select
                    value={formDifficulty}
                    onChange={(e) => setFormDifficulty(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#2563EB]"
                  >
                    <option value="beginner">Beginner / Easy</option>
                    <option value="intermediate">Intermediate / Medium</option>
                    <option value="advanced">Advanced / Hard</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold text-slate-700">Status</label>
                  <select
                    value={formIsActive ? 'active' : 'draft'}
                    onChange={(e) => setFormIsActive(e.target.value === 'active')}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#2563EB]"
                  >
                    <option value="active">Active DB</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
              </div>

              {formCategory === 'custom' && (
                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold text-slate-700">Custom Category</label>
                  <input
                    type="text"
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#2563EB]"
                    required
                  />
                </div>
              )}

              {/* Quiz Type Selector & Explanatory Note */}
              <div className="space-y-2 pt-1 border-t border-slate-100">
                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold text-slate-700">Quiz Type</label>
                  <select
                    value={formQuizType}
                    onChange={(e) => setFormQuizType(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#2563EB]"
                  >
                    <option value="Build-Up/Leveled">Build-Up / Leveled Quiz</option>
                    <option value="This or That">This or That (Rapid Choice)</option>
                    <option value="Timed Challenge">Timed Speed Challenge</option>
                    <option value="Daily Challenge">Daily Streak Challenge</option>
                  </select>
                </div>

                <div className="p-3 bg-blue-50/80 border border-blue-200 text-slate-700 text-xs rounded-xl leading-relaxed space-y-1">
                  <span className="font-black text-blue-700 flex items-center gap-1">
                    💡 Meaning of selected Quiz Type:
                  </span>
                  <p className="text-slate-600 font-medium">
                    {formQuizType === 'This or That' &&
                      'Binary choice quiz with 2 rapid options per question designed for quick decision-making and instant learning.'}
                    {formQuizType === 'Timed Challenge' &&
                      'Speed-focused challenge with a active countdown timer for each question to earn extra bonus XP.'}
                    {formQuizType === 'Daily Challenge' &&
                      'Special rotating daily challenge quiz designed to reward daily active players with extra streak bonus XP.'}
                    {(formQuizType === 'Build-Up/Leveled' || !formQuizType) &&
                      'Progressive level-based quiz (Level 1, Level 2, Level 3) where questions get progressively more challenging as users level up.'}
                  </p>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingQuiz(null)}
                  className="px-4 py-2.5 bg-slate-100 text-slate-600 font-extrabold text-xs rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-extrabold text-xs rounded-xl shadow-md flex items-center gap-1.5 disabled:opacity-50"
                >
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>{loading ? 'Updating...' : 'Update Quiz'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
