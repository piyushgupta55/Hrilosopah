'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import {
  Shield,
  BookOpen,
  Plus,
  Search,
  Edit3,
  Trash2,
  X,
  CheckCircle,
  XCircle,
  Loader2,
  Filter,
  ArrowUpDown,
  AlertTriangle,
  FileQuestion,
  RefreshCw,
} from 'lucide-react';

export interface QuizAdminItem {
  id: string;
  slug: string;
  title: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | string;
  questionsCount: number;
  status: 'Published' | 'Draft' | string;
  isActive: boolean;
  updatedAt: string;
}

export function QuizIndexManager() {
  const router = useRouter();
  const params = useParams() || {};
  const locale = (params.locale as string) || 'en';

  const [quizzes, setQuizzes] = useState<QuizAdminItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  // Filters
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // Action states
  const [publishingId, setPublishingId] = useState<string | null>(null);
  const [deletingQuiz, setDeletingQuiz] = useState<QuizAdminItem | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);

  // Fetch quizzes on load
  const fetchQuizzes = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/quiz', { cache: 'no-store' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to load quizzes');
      setQuizzes(data.quizzes || []);
    } catch (err: any) {
      console.error('Fetch quizzes error:', err);
      setError(err.message || 'Failed to load quizzes from database.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);

  // Toggle Publish / Unpublish Status
  const handleTogglePublish = async (quiz: QuizAdminItem) => {
    const newIsActive = !quiz.isActive;
    const newStatus = newIsActive ? 'Published' : 'Draft';
    setPublishingId(quiz.id);

    try {
      const res = await fetch('/api/admin/quiz', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: quiz.id,
          isActive: newIsActive,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update quiz status');

      // Instant optimistic UI update
      setQuizzes((prev) =>
        prev.map((q) => (q.id === quiz.id ? { ...q, isActive: newIsActive, status: newStatus } : q))
      );
    } catch (err: any) {
      alert(err.message || 'Could not update status');
    } finally {
      setPublishingId(null);
    }
  };

  // Delete Quiz Confirmation & Handler
  const confirmDelete = async () => {
    if (!deletingQuiz) return;
    setDeleteLoading(true);

    try {
      const res = await fetch(`/api/admin/quiz?id=${deletingQuiz.id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete quiz');

      setQuizzes((prev) => prev.filter((q) => q.id !== deletingQuiz.id));
      setDeletingQuiz(null);
    } catch (err: any) {
      alert(err.message || 'Error deleting quiz');
    } finally {
      setDeleteLoading(false);
    }
  };

  // Dynamic unique categories from dataset
  const categoriesList = Array.from(
    new Set([
      'AI',
      'Crypto',
      'Machine Learning',
      'Web3',
      'Python',
      ...quizzes.map((q) => q.category),
    ])
  ).filter(Boolean);

  // Client-side Filtering
  const filteredQuizzes = quizzes.filter((q) => {
    const matchesTitle =
      q.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.slug.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCat =
      selectedCategory === 'all' || q.category.toLowerCase() === selectedCategory.toLowerCase();

    const matchesDiff =
      selectedDifficulty === 'all' ||
      q.difficulty.toLowerCase() === selectedDifficulty.toLowerCase();

    const matchesStatus =
      selectedStatus === 'all' || q.status.toLowerCase() === selectedStatus.toLowerCase();

    return matchesTitle && matchesCat && matchesDiff && matchesStatus;
  });

  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-sans">
      {/* Top Header */}
      <header className="w-full border-b border-blue-100 bg-white/95 backdrop-blur-lg px-4 sm:px-8 py-4 flex items-center justify-between sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-center text-[#2563EB]">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-black text-base sm:text-lg text-slate-900">Quiz Content Control</h1>
            <span className="text-[11px] text-slate-500 font-semibold">
              Manage live platform quizzes & publishing
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchQuizzes}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
            title="Refresh Quiz List"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <Link
            href={`/${locale}/admin/quizzes/new`}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-[#2563EB] hover:bg-[#1D4ED8] rounded-xl text-xs sm:text-sm font-extrabold text-white transition-all shadow-md shadow-blue-500/20 active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            <span>+ New Quiz</span>
          </Link>
        </div>
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-8 space-y-6">
        {/* Navigation Breadcrumb Tabs */}
        <div className="flex items-center gap-2 border-b border-gray-200 pb-3 overflow-x-auto no-scrollbar text-xs font-bold text-slate-600">
          <Link
            href={`/${locale}/admin/dashboard`}
            className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-50"
          >
            Dashboard
          </Link>
          <span className="text-slate-400">/</span>
          <span className="px-3 py-1.5 rounded-lg bg-blue-50 text-[#2563EB] font-extrabold border border-blue-100">
            Quizzes Index
          </span>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-white border border-blue-100 rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Search Bar */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by title or slug..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#2563EB]"
              />
            </div>

            {/* Category Filter Dropdown */}
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 font-medium focus:outline-none focus:border-[#2563EB] appearance-none"
              >
                <option value="all">All Categories</option>
                {categoriesList.map((cat) => (
                  <option key={cat} value={cat}>
                    Category: {cat}
                  </option>
                ))}
              </select>
              <Filter className="w-3.5 h-3.5 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Difficulty Filter Dropdown */}
            <div className="relative">
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 font-medium focus:outline-none focus:border-[#2563EB] appearance-none"
              >
                <option value="all">All Difficulties</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Status Filter Dropdown */}
            <div className="relative">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 font-medium focus:outline-none focus:border-[#2563EB] appearance-none"
              >
                <option value="all">All Statuses</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
              <Filter className="w-3.5 h-3.5 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-4 bg-red-50 text-red-600 text-xs sm:text-sm font-bold rounded-2xl border border-red-200 flex items-center justify-between">
            <span>{error}</span>
            <button
              onClick={fetchQuizzes}
              className="px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-xs font-bold"
            >
              Retry
            </button>
          </div>
        )}

        {/* Loading Skeleton */}
        {loading ? (
          <div className="bg-white border border-blue-100 rounded-2xl overflow-hidden shadow-sm p-6 space-y-4">
            <div className="h-6 bg-slate-100 rounded-lg w-1/4 animate-pulse mb-6"></div>
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="flex items-center justify-between py-3 border-b border-gray-100 animate-pulse"
              >
                <div className="flex items-center gap-3 w-1/3">
                  <div className="w-10 h-10 bg-slate-200 rounded-xl"></div>
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                    <div className="h-3 bg-slate-100 rounded w-1/2"></div>
                  </div>
                </div>
                <div className="h-4 bg-slate-200 rounded w-1/6"></div>
                <div className="h-4 bg-slate-200 rounded w-1/6"></div>
                <div className="h-8 bg-slate-200 rounded-xl w-24"></div>
              </div>
            ))}
          </div>
        ) : filteredQuizzes.length === 0 ? (
          /* Empty State */
          <div className="bg-white border border-blue-100 rounded-2xl p-12 text-center shadow-sm flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 text-[#2563EB] flex items-center justify-center mb-4 border border-blue-100">
              <FileQuestion className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-black text-slate-900 mb-1">
              No quizzes yet — create your first one
            </h3>
            <p className="text-xs text-slate-500 max-w-md mb-6">
              No quizzes found matching your filters or in the system database. Click below to add a
              new quiz.
            </p>
            <Link
              href={`/${locale}/admin/quizzes/new`}
              className="px-6 py-3 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md flex items-center gap-2 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>+ New Quiz</span>
            </Link>
          </div>
        ) : (
          /* Quizzes Table */
          <div className="bg-white border border-blue-100 rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-50 text-slate-500 uppercase font-bold border-b border-gray-100">
                  <tr>
                    <th className="p-4 sm:p-5">Title & Slug</th>
                    <th className="p-4 sm:p-5">Category</th>
                    <th className="p-4 sm:p-5">Difficulty</th>
                    <th className="p-4 sm:p-5">Question Count</th>
                    <th className="p-4 sm:p-5">Status</th>
                    <th className="p-4 sm:p-5">Last Updated</th>
                    <th className="p-4 sm:p-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-medium">
                  {filteredQuizzes.map((quiz) => (
                    <tr key={quiz.id} className="hover:bg-blue-50/40 transition-colors">
                      {/* Title Column */}
                      <td className="p-4 sm:p-5 font-bold text-slate-900">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#2563EB] shrink-0">
                            <BookOpen className="w-4.5 h-4.5" />
                          </div>
                          <div>
                            <span className="block font-extrabold text-slate-900 text-sm">
                              {quiz.title}
                            </span>
                            <span className="text-[11px] text-slate-400 font-normal">
                              slug: {quiz.slug}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Category Column */}
                      <td className="p-4 sm:p-5">
                        <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-blue-50 text-[#2563EB] border border-blue-100">
                          {quiz.category}
                        </span>
                      </td>

                      {/* Difficulty Column */}
                      <td className="p-4 sm:p-5 capitalize">
                        <span
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                            quiz.difficulty === 'advanced'
                              ? 'bg-purple-50 text-purple-700 border border-purple-200'
                              : quiz.difficulty === 'intermediate'
                                ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                                : 'bg-slate-100 text-slate-700 border border-slate-200'
                          }`}
                        >
                          {quiz.difficulty}
                        </span>
                      </td>

                      {/* Question Count Column */}
                      <td className="p-4 sm:p-5 font-extrabold text-slate-700">
                        {quiz.questionsCount} Questions
                      </td>

                      {/* Status Column */}
                      <td className="p-4 sm:p-5">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-extrabold border inline-flex items-center gap-1 ${
                            quiz.isActive
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-amber-50 text-amber-700 border-amber-200'
                          }`}
                        >
                          {quiz.isActive ? (
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <XCircle className="w-3.5 h-3.5 text-amber-600" />
                          )}
                          <span>{quiz.status}</span>
                        </span>
                      </td>

                      {/* Last Updated Column */}
                      <td className="p-4 sm:p-5 text-slate-500 text-xs font-medium">
                        {formatDate(quiz.updatedAt)}
                      </td>

                      {/* Actions Column */}
                      <td className="p-4 sm:p-5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {/* Edit Action */}
                          <Link
                            href={`/${locale}/admin/quizzes/${quiz.id}/edit`}
                            className="px-3 py-1.5 bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-[#2563EB] font-extrabold text-xs rounded-xl border border-slate-200 transition-all flex items-center gap-1"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </Link>

                          {/* Publish/Unpublish Action */}
                          <button
                            onClick={() => handleTogglePublish(quiz)}
                            disabled={publishingId === quiz.id}
                            className={`px-3 py-1.5 font-extrabold text-xs rounded-xl border transition-all flex items-center gap-1 ${
                              quiz.isActive
                                ? 'bg-amber-50 hover:bg-amber-100 text-amber-700 border-amber-200'
                                : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200'
                            }`}
                          >
                            {publishingId === quiz.id ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <span>{quiz.isActive ? 'Unpublish' : 'Publish'}</span>
                            )}
                          </button>

                          {/* Delete Action */}
                          <button
                            onClick={() => setDeletingQuiz(quiz)}
                            className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-xl border border-red-100 transition-all"
                            title="Delete Quiz"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* Delete Confirmation Modal */}
      {deletingQuiz && (
        <div className="fixed inset-0 z-[200] bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl space-y-4 border border-slate-200">
            <div className="flex items-center gap-3 text-red-600">
              <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center shrink-0 border border-red-100">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-black text-slate-900 text-base">Delete Quiz</h3>
                <p className="text-xs text-slate-500 font-medium">This action cannot be undone.</p>
              </div>
            </div>

            <p className="text-xs text-slate-700">
              Are you sure you want to permanently delete{' '}
              <strong className="text-slate-900">&quot;{deletingQuiz.title}&quot;</strong> and all
              of its associated questions from the system?
            </p>

            <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setDeletingQuiz(null)}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={deleteLoading}
                className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs rounded-xl shadow-md flex items-center gap-1.5 disabled:opacity-50"
              >
                {deleteLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                <span>{deleteLoading ? 'Deleting...' : 'Delete Quiz'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
