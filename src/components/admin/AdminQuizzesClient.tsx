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
  Layers,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export interface QuizItem {
  id: string;
  slug: string;
  category: string;
  isActive: boolean;
  title: string;
  questionsCount: number;
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

  // Modal State
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState<QuizItem | null>(null);

  // Form State
  const [formTitle, setFormTitle] = useState('');
  const [formSlug, setFormSlug] = useState('');
  const [formCategory, setFormCategory] = useState('AI');
  const [customCategory, setCustomCategory] = useState('');
  const [formIsActive, setFormIsActive] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const openCreateModal = () => {
    setFormTitle('');
    setFormSlug('');
    setFormCategory('AI');
    setCustomCategory('');
    setFormIsActive(true);
    setErrorMsg('');
    setIsCreateOpen(true);
  };

  const openEditModal = (quiz: QuizItem) => {
    setEditingQuiz(quiz);
    setFormTitle(quiz.title);
    setFormSlug(quiz.slug);
    setFormCategory(quiz.category);
    setCustomCategory(
      ['AI', 'Crypto', 'Machine Learning', 'Web3', 'Python'].includes(quiz.category)
        ? ''
        : quiz.category
    );
    setFormIsActive(quiz.isActive);
    setErrorMsg('');
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle || !formSlug) {
      setErrorMsg('Please fill in title and slug.');
      return;
    }

    const finalCategory = formCategory === 'custom' ? customCategory || 'General' : formCategory;

    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/admin/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formTitle,
          slug: formSlug,
          category: finalCategory,
          isActive: formIsActive,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to create quiz');
      }

      const newQuiz: QuizItem = {
        id: data.quiz.id || String(Date.now()),
        slug: data.quiz.slug || formSlug,
        category: finalCategory,
        isActive: formIsActive,
        title: formTitle,
        questionsCount: 0,
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

  const handleDelete = async (quizId: string) => {
    if (!confirm('Are you sure you want to delete this quiz from DB?')) return;

    try {
      const res = await fetch(`/api/admin/quiz?id=${quizId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setQuizzes((prev) => prev.filter((q) => q.id !== quizId));
        router.refresh();
      }
    } catch (err) {
      console.error('Delete error:', err);
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
    { label: 'Quizzes', href: `/${locale}/admin/quizzes`, active: true },
    { label: 'Questions', href: `/${locale}/admin/questions`, active: false },
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
            <h1 className="font-black text-base sm:text-lg text-slate-900">Quiz Management</h1>
            <span className="text-[11px] text-slate-500 font-semibold">
              Total Quizzes: {quizzes.length}
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
                placeholder="Search quiz title, category, or slug..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#2563EB]"
              />
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl shrink-0">
              <button
                onClick={() => setCategoryFilter('all')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  categoryFilter === 'all' ? 'bg-white text-[#2563EB] shadow-sm' : 'text-slate-600'
                }`}
              >
                All ({quizzes.length})
              </button>
              <button
                onClick={() => setCategoryFilter('AI')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  categoryFilter === 'AI' ? 'bg-white text-[#2563EB] shadow-sm' : 'text-slate-600'
                }`}
              >
                AI
              </button>
              <button
                onClick={() => setCategoryFilter('Crypto')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  categoryFilter === 'Crypto'
                    ? 'bg-white text-[#2563EB] shadow-sm'
                    : 'text-slate-600'
                }`}
              >
                Crypto
              </button>
            </div>
          </div>

          <button
            onClick={openCreateModal}
            className="flex items-center justify-center gap-2 px-5 py-3 bg-[#2563EB] hover:bg-[#1D4ED8] rounded-xl text-xs sm:text-sm font-bold text-white transition-all shadow-md shadow-blue-500/20 active:scale-[0.98] shrink-0"
          >
            <Plus className="w-4.5 h-4.5" />
            <span>+ Create New Quiz</span>
          </button>
        </div>

        {/* Clean Quiz Table */}
        <div className="bg-white border border-blue-100 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 text-slate-500 uppercase font-bold border-b border-gray-100">
                <tr>
                  <th className="p-4 sm:p-5">Quiz Title & Slug</th>
                  <th className="p-4 sm:p-5">Category</th>
                  <th className="p-4 sm:p-5">Questions Count</th>
                  <th className="p-4 sm:p-5">Status</th>
                  <th className="p-4 sm:p-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium">
                {filteredQuizzes.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-10 text-center text-slate-500 font-semibold">
                      No quizzes found matching your search. Click &quot;+ Create New Quiz&quot;
                      above to add one.
                    </td>
                  </tr>
                ) : (
                  filteredQuizzes.map((q) => (
                    <tr key={q.id} className="hover:bg-blue-50/50 transition-colors">
                      <td className="p-4 sm:p-5 font-bold text-slate-900">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-[#2563EB]">
                            <BookOpen className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="block font-extrabold text-slate-900">{q.title}</span>
                            <span className="text-[11px] text-slate-400 font-normal">
                              slug: {q.slug}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 sm:p-5">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-extrabold border ${
                            q.category === 'Crypto'
                              ? 'bg-amber-50 text-amber-700 border-amber-200'
                              : 'bg-blue-50 text-[#2563EB] border-blue-100'
                          }`}
                        >
                          {q.category}
                        </span>
                      </td>
                      <td className="p-4 sm:p-5 text-slate-700 font-bold">
                        {q.questionsCount} Questions
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
                            className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-[#2563EB] font-extrabold text-xs rounded-xl border border-blue-100 flex items-center gap-1 transition-all"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>Edit Quiz</span>
                          </button>
                          <button
                            onClick={() => handleDelete(q.id)}
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

      {/* CREATE QUIZ MODAL */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-[200] bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-black text-slate-900 text-lg flex items-center gap-2">
                <Plus className="w-5 h-5 text-[#2563EB]" />
                Create New Quiz
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
                  placeholder="e.g. Artificial Intelligence & LLM Masterclass"
                  value={formTitle}
                  onChange={(e) => {
                    setFormTitle(e.target.value);
                    setFormSlug(
                      e.target.value
                        .toLowerCase()
                        .replace(/[^a-z0-9]+/g, '-')
                        .replace(/(^-|-$)/g, '')
                    );
                  }}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#2563EB]"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-extrabold text-slate-700">Quiz URL Slug</label>
                <input
                  type="text"
                  placeholder="ai-llm-masterclass"
                  value={formSlug}
                  onChange={(e) => setFormSlug(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#2563EB]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold text-slate-700">Category</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#2563EB]"
                  >
                    <option value="AI">AI</option>
                    <option value="Crypto">Crypto</option>
                    <option value="Machine Learning">Machine Learning</option>
                    <option value="Web3">Web3</option>
                    <option value="Python">Python</option>
                    <option value="custom">Custom Category...</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold text-slate-700">Status</label>
                  <select
                    value={formIsActive ? 'active' : 'draft'}
                    onChange={(e) => setFormIsActive(e.target.value === 'active')}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#2563EB]"
                  >
                    <option value="active">Active DB</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
              </div>

              {formCategory === 'custom' && (
                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold text-slate-700">
                    Enter Custom Category
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Cybersecurity, Robotics, Data Science"
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#2563EB]"
                  />
                </div>
              )}

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
                  <span>{loading ? 'Creating...' : 'Save Quiz to DB'}</span>
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
                Edit Quiz ({editingQuiz.slug})
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
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#2563EB]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold text-slate-700">Category</label>
                  <select
                    value={
                      ['AI', 'Crypto', 'Machine Learning', 'Web3', 'Python'].includes(formCategory)
                        ? formCategory
                        : 'custom'
                    }
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#2563EB]"
                  >
                    <option value="AI">AI</option>
                    <option value="Crypto">Crypto</option>
                    <option value="Machine Learning">Machine Learning</option>
                    <option value="Web3">Web3</option>
                    <option value="Python">Python</option>
                    <option value="custom">Custom Category...</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold text-slate-700">Status</label>
                  <select
                    value={formIsActive ? 'active' : 'draft'}
                    onChange={(e) => setFormIsActive(e.target.value === 'active')}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#2563EB]"
                  >
                    <option value="active">Active DB</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
              </div>

              {(formCategory === 'custom' ||
                (!['AI', 'Crypto', 'Machine Learning', 'Web3', 'Python'].includes(formCategory) &&
                  formCategory !== '')) && (
                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold text-slate-700">
                    Enter Custom Category
                  </label>
                  <input
                    type="text"
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#2563EB]"
                  />
                </div>
              )}

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
                  <span>{loading ? 'Updating...' : 'Update Quiz DB'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
