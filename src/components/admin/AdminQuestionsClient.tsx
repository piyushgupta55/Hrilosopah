'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Shield,
  Plus,
  Search,
  Edit3,
  Trash2,
  X,
  Loader2,
  Sparkles,
  ArrowLeft,
  Code,
  Terminal,
  Brain,
  Cpu,
  Globe,
  Layers,
  ChevronRight,
  BookOpen,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export interface QuestionItem {
  id: string;
  text: string;
  options: string[];
  correctOptionIndex: number;
  difficulty: string;
  explanation: string | null;
  category: string;
  quizSlug: string;
}

interface AdminQuestionsClientProps {
  locale: string;
  initialQuestions: QuestionItem[];
}

interface CategoryInfo {
  name: string;
  icon: any;
  desc: string;
  color: string;
  badgeBg: string;
  badgeText: string;
}

const CATEGORY_METADATA: Record<string, CategoryInfo> = {
  Coding: {
    name: 'Coding',
    icon: Code,
    desc: 'Programming logic, algorithms, array manipulation & output tracing',
    color: 'from-blue-600 to-indigo-600',
    badgeBg: 'bg-blue-50 border-blue-200 text-[#2563EB]',
    badgeText: 'Coding',
  },
  Python: {
    name: 'Python',
    icon: Terminal,
    desc: 'Python syntax, decorators, recursion, list comprehensions & OOP',
    color: 'from-emerald-600 to-teal-600',
    badgeBg: 'bg-emerald-50 border-emerald-200 text-emerald-700',
    badgeText: 'Python',
  },
  AI: {
    name: 'AI',
    icon: Cpu,
    desc: 'Transformers, Neural Networks, RLHF & LLM fine-tuning',
    color: 'from-purple-600 to-violet-600',
    badgeBg: 'bg-purple-50 border-purple-200 text-purple-700',
    badgeText: 'AI',
  },
  Crypto: {
    name: 'Crypto',
    icon: Shield,
    desc: 'Proof-of-Stake, Bitcoin UTXO, Smart Contracts & Zero-Knowledge',
    color: 'from-amber-500 to-orange-600',
    badgeBg: 'bg-amber-50 border-amber-200 text-amber-700',
    badgeText: 'Crypto',
  },
  'Machine Learning': {
    name: 'Machine Learning',
    icon: Brain,
    desc: 'Supervised learning, gradient descent, feature engineering & models',
    color: 'from-rose-500 to-pink-600',
    badgeBg: 'bg-pink-50 border-pink-200 text-pink-700',
    badgeText: 'ML',
  },
  Web3: {
    name: 'Web3',
    icon: Globe,
    desc: 'DeFi protocol AMMs, dApps, Layer 2 rollups & Ethereum VM',
    color: 'from-cyan-600 to-blue-600',
    badgeBg: 'bg-cyan-50 border-cyan-200 text-cyan-700',
    badgeText: 'Web3',
  },
};

export function AdminQuestionsClient({ locale, initialQuestions }: AdminQuestionsClientProps) {
  const router = useRouter();
  const [questions, setQuestions] = useState<QuestionItem[]>(initialQuestions);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Modal State
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [activeAddTab, setActiveAddTab] = useState<'ai' | 'manual'>('ai');
  const [editingQuestion, setEditingQuestion] = useState<QuestionItem | null>(null);

  // Form State
  const [formText, setFormText] = useState('');
  const [formOption0, setFormOption0] = useState('');
  const [formOption1, setFormOption1] = useState('');
  const [formOption2, setFormOption2] = useState('');
  const [formOption3, setFormOption3] = useState('');
  const [formCorrectIndex, setFormCorrectIndex] = useState(0);
  const [formDifficulty, setFormDifficulty] = useState('beginner');
  const [formCategory, setFormCategory] = useState<string>('Coding');
  const [customCategory, setCustomCategory] = useState('');
  const [formExplanation, setFormExplanation] = useState('');

  // AI Generator State
  const [aiTopic, setAiTopic] = useState('');
  const [generatingAI, setGeneratingAI] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Extract all unique categories dynamically
  const uniqueCategories = Array.from(
    new Set([
      'Coding',
      'Python',
      'AI',
      'Crypto',
      'Machine Learning',
      'Web3',
      ...questions.map((q) => q.category).filter(Boolean),
    ])
  );

  const openAddModal = (catToUse?: string) => {
    setFormText('');
    setFormOption0('');
    setFormOption1('');
    setFormOption2('');
    setFormOption3('');
    setFormCorrectIndex(0);
    setFormDifficulty('beginner');
    const targetCategory = catToUse || selectedCategory || 'Coding';
    if (['Coding', 'Python', 'AI', 'Crypto', 'Machine Learning', 'Web3'].includes(targetCategory)) {
      setFormCategory(targetCategory);
      setCustomCategory('');
    } else {
      setFormCategory('custom');
      setCustomCategory(targetCategory);
    }
    setFormExplanation('');
    setAiTopic('');
    setActiveAddTab('ai');
    setErrorMsg('');
    setIsAddOpen(true);
  };

  const openEditModal = (q: QuestionItem) => {
    setEditingQuestion(q);
    setFormText(q.text);
    setFormOption0(q.options[0] || '');
    setFormOption1(q.options[1] || '');
    setFormOption2(q.options[2] || '');
    setFormOption3(q.options[3] || '');
    setFormCorrectIndex(q.correctOptionIndex);
    setFormDifficulty(q.difficulty);
    setFormCategory(q.category || 'Coding');
    setCustomCategory(
      ['Coding', 'Python', 'AI', 'Crypto', 'Machine Learning', 'Web3'].includes(q.category)
        ? ''
        : q.category
    );
    setFormExplanation(q.explanation || '');
    setErrorMsg('');
  };

  const handleGenerateWithAI = async (selectedTopicPrompt?: string) => {
    const promptTopic = selectedTopicPrompt || aiTopic;
    const finalCat = formCategory === 'custom' ? customCategory || 'General' : formCategory;
    setGeneratingAI(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/admin/generate-question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: promptTopic,
          category: finalCat,
          difficulty: formDifficulty,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate question with AI');
      }

      const q = data.question;
      if (q) {
        if (q.text) setFormText(q.text);
        if (Array.isArray(q.options)) {
          setFormOption0(q.options[0] || '');
          setFormOption1(q.options[1] || '');
          setFormOption2(q.options[2] || '');
          setFormOption3(q.options[3] || '');
        }
        if (q.correctOptionIndex !== undefined) setFormCorrectIndex(q.correctOptionIndex);
        if (q.difficulty) setFormDifficulty(q.difficulty);
        if (q.explanation) setFormExplanation(q.explanation);

        setActiveAddTab('manual');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'AI generation failed.');
    } finally {
      setGeneratingAI(false);
    }
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formText || !formOption0 || !formOption1) {
      setErrorMsg('Please fill in question text and at least 2 options.');
      return;
    }

    const finalCat = formCategory === 'custom' ? customCategory || 'General' : formCategory;

    setLoading(true);
    setErrorMsg('');

    const optionsArray = [formOption0, formOption1, formOption2, formOption3].filter(Boolean);

    try {
      const res = await fetch('/api/admin/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: formText,
          options: optionsArray,
          correctOptionIndex: formCorrectIndex,
          difficulty: formDifficulty,
          category: finalCat,
          explanation: formExplanation,
          quizSlug: finalCat.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to add question');
      }

      const newQ: QuestionItem = {
        id: data.question.id || String(Date.now()),
        text: formText,
        options: optionsArray,
        correctOptionIndex: formCorrectIndex,
        difficulty: formDifficulty,
        category: finalCat,
        explanation: formExplanation,
        quizSlug: finalCat.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      };

      setQuestions((prev) => [newQ, ...prev]);
      setIsAddOpen(false);
      router.refresh();
    } catch (err: any) {
      setErrorMsg(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingQuestion || !formText) {
      setErrorMsg('Question text is required.');
      return;
    }

    const finalCat = formCategory === 'custom' ? customCategory || 'General' : formCategory;

    setLoading(true);
    setErrorMsg('');

    const optionsArray = [formOption0, formOption1, formOption2, formOption3].filter(Boolean);

    try {
      const res = await fetch('/api/admin/questions', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingQuestion.id,
          text: formText,
          options: optionsArray,
          correctOptionIndex: formCorrectIndex,
          difficulty: formDifficulty,
          category: finalCat,
          explanation: formExplanation,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to update question');
      }

      setQuestions((prev) =>
        prev.map((q) =>
          q.id === editingQuestion.id
            ? {
                ...q,
                text: formText,
                options: optionsArray,
                correctOptionIndex: formCorrectIndex,
                difficulty: formDifficulty,
                category: finalCat,
                explanation: formExplanation,
              }
            : q
        )
      );

      setEditingQuestion(null);
      router.refresh();
    } catch (err: any) {
      setErrorMsg(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (qId: string) => {
    if (!confirm('Are you sure you want to delete this question?')) return;

    try {
      const res = await fetch(`/api/admin/questions?id=${qId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setQuestions((prev) => prev.filter((q) => q.id !== qId));
        router.refresh();
      }
    } catch (err) {
      console.error('Delete question error:', err);
    }
  };

  // Filtered questions based on search & selected category
  const filteredQuestions = questions.filter((q) => {
    const matchesSearch =
      q.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.options.some((opt) => opt.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory = selectedCategory
      ? q.category.toLowerCase() === selectedCategory.toLowerCase()
      : true;

    return matchesSearch && matchesCategory;
  });

  const adminNav = [
    { label: 'Overview', href: `/${locale}/admin/dashboard`, active: false },
    { label: 'Quizzes', href: `/${locale}/admin/quizzes`, active: false },
    { label: 'Questions Bank', href: `/${locale}/admin/questions`, active: true },
    { label: 'Users', href: `/${locale}/admin/users`, active: false },
    { label: 'Payments ($1)', href: `/${locale}/admin/payments`, active: false },
  ];

  return (
    <div className="w-full min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-sans">
      {/* Top Header */}
      <header className="w-full border-b border-blue-100 bg-white/95 backdrop-blur-lg px-4 sm:px-8 py-4 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-center text-[#2563EB]">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-black text-base sm:text-lg text-slate-900">Manage Questions</h1>
            <span className="text-[11px] text-slate-500 font-semibold">
              {selectedCategory
                ? `Viewing Category: ${selectedCategory} (${filteredQuestions.length} Questions)`
                : `Total Question Bank: ${questions.length} Questions across ${uniqueCategories.length} Categories`}
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

        {/* VIEW LEVEL 1: CATEGORY CARDS OVERVIEW (When no category is selected) */}
        {!selectedCategory ? (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-blue-500/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-2 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold">
                  <Layers className="w-4 h-4 text-blue-200" />
                  <span>Category Overview</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black">
                  Select a Category to Manage Questions
                </h2>
                <p className="text-xs sm:text-sm text-blue-100">
                  Click on any category card below to view, edit, update, or generate new questions
                  specifically for that domain.
                </p>
              </div>

              <button
                onClick={() => openAddModal('Coding')}
                className="px-5 py-3 bg-white hover:bg-blue-50 text-[#2563EB] font-black text-xs sm:text-sm rounded-2xl shadow-lg transition-all flex items-center gap-2 shrink-0 active:scale-95"
              >
                <Plus className="w-4.5 h-4.5" />
                <span>+ Add Question to Any Category</span>
              </button>
            </div>

            {/* CATEGORY GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {uniqueCategories.map((catName) => {
                const count = questions.filter(
                  (q) => q.category.toLowerCase() === catName.toLowerCase()
                ).length;
                const meta = CATEGORY_METADATA[catName] || {
                  name: catName,
                  icon: BookOpen,
                  desc: `Questions and quizzes for ${catName} topics`,
                  color: 'from-blue-600 to-indigo-600',
                  badgeBg: 'bg-blue-50 border-blue-200 text-[#2563EB]',
                  badgeText: catName,
                };
                const IconComp = meta.icon;

                return (
                  <div
                    key={catName}
                    onClick={() => setSelectedCategory(catName)}
                    className="group bg-white rounded-3xl p-6 border border-blue-100/80 hover:border-blue-300 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between space-y-5 transform hover:-translate-y-1 relative overflow-hidden"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div
                          className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${meta.color} flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-110 transition-transform`}
                        >
                          <IconComp className="w-6 h-6" />
                        </div>

                        <span
                          className={`px-3 py-1 rounded-full text-xs font-black border ${meta.badgeBg}`}
                        >
                          {count} Questions
                        </span>
                      </div>

                      <div className="space-y-1">
                        <h3 className="font-black text-lg text-slate-900 group-hover:text-[#2563EB] transition-colors">
                          {catName}
                        </h3>
                        <p className="text-xs text-slate-500 leading-relaxed font-medium">
                          {meta.desc}
                        </p>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold">
                      <span className="text-[#2563EB] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        <span>Manage Questions</span>
                        <ChevronRight className="w-4 h-4" />
                      </span>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openAddModal(catName);
                        }}
                        className="px-3 py-1.5 bg-blue-50 hover:bg-[#2563EB] hover:text-white text-[#2563EB] rounded-xl border border-blue-100 font-extrabold text-xs transition-colors flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>+ Add</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* VIEW LEVEL 2: SELECTED CATEGORY QUESTIONS DETAIL VIEW */
          <div className="space-y-6">
            {/* Header & Back Button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-blue-100 rounded-3xl p-5 sm:p-6 shadow-sm">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-[#2563EB] text-xs font-extrabold rounded-xl border border-slate-200 transition-colors flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>All Categories</span>
                </button>

                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-black text-slate-900">{selectedCategory}</h2>
                    <span className="px-3 py-0.5 rounded-full text-xs font-extrabold bg-blue-50 text-[#2563EB] border border-blue-200">
                      {filteredQuestions.length} Questions
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium">
                    Questions listed below belong to the category{' '}
                    <strong className="text-slate-800">{selectedCategory}</strong>.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => openAddModal(selectedCategory)}
                  className="flex items-center gap-2 px-5 py-3 bg-[#2563EB] hover:bg-[#1D4ED8] rounded-xl text-xs sm:text-sm font-bold text-white transition-all shadow-md shadow-blue-500/20 active:scale-[0.98]"
                >
                  <Plus className="w-4.5 h-4.5" />
                  <span>+ Add New Question</span>
                </button>
              </div>
            </div>

            {/* Search Bar */}
            <div className="bg-white border border-blue-100 rounded-2xl p-4 shadow-sm flex items-center justify-between gap-4">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder={`Search inside ${selectedCategory} questions...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#2563EB]"
                />
              </div>
              <span className="text-xs text-slate-500 font-bold shrink-0">
                Showing {filteredQuestions.length} Questions
              </span>
            </div>

            {/* Questions List: Mobile Cards + Desktop Table */}
            <div className="space-y-4">
              {/* Mobile Cards (Visible on screens < md) */}
              <div className="block md:hidden space-y-3">
                {filteredQuestions.length === 0 ? (
                  <div className="bg-white border border-blue-100 rounded-3xl p-8 text-center space-y-3">
                    <p className="text-slate-500 font-bold text-sm">
                      No questions found in {selectedCategory}.
                    </p>
                    <button
                      onClick={() => openAddModal(selectedCategory)}
                      className="px-4 py-2.5 bg-[#2563EB] text-white text-xs font-bold rounded-xl shadow-sm"
                    >
                      + Add Question to {selectedCategory}
                    </button>
                  </div>
                ) : (
                  filteredQuestions.map((q, idx) => {
                    const correctAnswerText = q.options[q.correctOptionIndex] || q.options[0];
                    return (
                      <div
                        key={q.id}
                        className="bg-white border border-blue-100 rounded-2xl p-4 shadow-sm space-y-3"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="font-black text-xs text-[#2563EB] bg-blue-50 px-2 py-0.5 rounded-lg border border-blue-100">
                            Q{idx + 1}
                          </span>
                          <span className="px-2.5 py-0.5 bg-slate-100 text-slate-700 text-[10px] font-extrabold rounded-lg uppercase">
                            {q.difficulty}
                          </span>
                        </div>

                        <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm leading-snug">
                          {q.text}
                        </h4>

                        <div className="p-2.5 bg-emerald-50/60 border border-emerald-200 rounded-xl space-y-1">
                          <span className="text-[10px] font-bold text-slate-500 uppercase block">
                            Correct Answer
                          </span>
                          <span className="text-xs font-extrabold text-emerald-800 block">
                            ✓ {correctAnswerText}
                          </span>
                        </div>

                        {q.explanation && (
                          <p className="text-[11px] text-slate-500 italic bg-slate-50 p-2 rounded-lg">
                            Explain: {q.explanation}
                          </p>
                        )}

                        <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-2">
                          <button
                            onClick={() => openEditModal(q)}
                            className="py-2 bg-blue-50 hover:bg-blue-100 text-[#2563EB] font-extrabold text-xs rounded-xl border border-blue-100 flex items-center justify-center gap-1 transition-all shadow-sm"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>Edit / Update</span>
                          </button>
                          <button
                            onClick={() => handleDelete(q.id)}
                            className="py-2 bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs rounded-xl border border-red-100 transition-all flex items-center justify-center gap-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Desktop Table (Visible on screens >= md) */}
              <div className="hidden md:block bg-white border border-blue-100 rounded-3xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs sm:text-sm">
                    <thead className="bg-slate-50 text-slate-500 uppercase font-bold border-b border-gray-100">
                      <tr>
                        <th className="p-4 w-12 text-center">#</th>
                        <th className="p-4">Question Text & Correct Answer</th>
                        <th className="p-4 w-28">Difficulty</th>
                        <th className="p-4 w-40 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 font-medium">
                      {filteredQuestions.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="p-12 text-center space-y-3">
                            <p className="text-slate-500 font-bold text-sm">
                              No questions found in {selectedCategory}.
                            </p>
                            <button
                              onClick={() => openAddModal(selectedCategory)}
                              className="px-4 py-2 bg-[#2563EB] text-white text-xs font-bold rounded-xl shadow-sm"
                            >
                              + Add Question to {selectedCategory}
                            </button>
                          </td>
                        </tr>
                      ) : (
                        filteredQuestions.map((q, idx) => {
                          const correctAnswerText = q.options[q.correctOptionIndex] || q.options[0];
                          return (
                            <tr key={q.id} className="hover:bg-blue-50/40 transition-colors">
                              <td className="p-4 text-center font-black text-slate-400">
                                {idx + 1}
                              </td>
                              <td className="p-4 space-y-1.5">
                                <h4 className="font-extrabold text-slate-900 leading-snug whitespace-pre-wrap">
                                  {q.text}
                                </h4>
                                <div className="flex flex-wrap items-center gap-2 text-xs">
                                  <span className="font-bold text-slate-400">Correct Answer:</span>
                                  <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 font-extrabold rounded-md border border-emerald-200">
                                    ✓ {correctAnswerText}
                                  </span>
                                </div>
                                {q.explanation && (
                                  <p className="text-[11px] text-slate-500 italic">
                                    Explain: {q.explanation}
                                  </p>
                                )}
                              </td>
                              <td className="p-4">
                                <span className="px-2.5 py-1 bg-slate-100 text-slate-700 text-xs font-bold rounded-lg uppercase">
                                  {q.difficulty}
                                </span>
                              </td>
                              <td className="p-4">
                                <div className="flex items-center justify-center gap-2">
                                  <button
                                    onClick={() => openEditModal(q)}
                                    className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-[#2563EB] font-extrabold text-xs rounded-xl border border-blue-100 flex items-center gap-1 transition-all shadow-sm"
                                  >
                                    <Edit3 className="w-3.5 h-3.5" />
                                    <span>Edit / Update</span>
                                  </button>
                                  <button
                                    onClick={() => handleDelete(q.id)}
                                    className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-xl border border-red-100 transition-all"
                                    title="Delete Question"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ADD QUESTION MODAL */}
      {isAddOpen && (
        <div className="fixed inset-0 z-[200] bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-xl rounded-3xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-black text-slate-900 text-lg flex items-center gap-2">
                <Plus className="w-5 h-5 text-[#2563EB]" />
                Add New Question ({formCategory})
              </h3>
              <button
                onClick={() => setIsAddOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-900"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* AI vs Manual Tabs */}
            <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl">
              <button
                type="button"
                onClick={() => setActiveAddTab('ai')}
                className={`flex-1 py-2 text-xs font-black rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                  activeAddTab === 'ai' ? 'bg-[#2563EB] text-white shadow-sm' : 'text-slate-600'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>✨ 1-Click AI Generator</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveAddTab('manual')}
                className={`flex-1 py-2 text-xs font-black rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  activeAddTab === 'manual' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
                }`}
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>✍️ Manual Question Input</span>
              </button>
            </div>

            {errorMsg && (
              <div className="p-3 bg-red-50 text-red-600 text-xs font-semibold rounded-xl border border-red-200">
                {errorMsg}
              </div>
            )}

            {/* TAB 1: AI GENERATOR */}
            {activeAddTab === 'ai' && (
              <div className="p-5 bg-blue-50/60 border border-blue-100 rounded-2xl space-y-4">
                <div className="space-y-1">
                  <h4 className="font-black text-sm text-slate-900">Generate Question with AI</h4>
                  <p className="text-xs text-slate-500">
                    Select a category and write a detailed topic prompt to generate an accurate
                    question, 4 choice options, and explanation.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-extrabold text-slate-700">Target Category</label>
                    <select
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-blue-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none"
                    >
                      <option value="Coding">Coding</option>
                      <option value="Python">Python</option>
                      <option value="AI">AI</option>
                      <option value="Crypto">Crypto</option>
                      <option value="Machine Learning">Machine Learning</option>
                      <option value="Web3">Web3</option>
                      <option value="custom">Custom Category...</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-extrabold text-slate-700">Difficulty</label>
                    <select
                      value={formDifficulty}
                      onChange={(e) => setFormDifficulty(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-blue-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none"
                    >
                      <option value="beginner">Beginner / Easy</option>
                      <option value="intermediate">Intermediate / Medium</option>
                      <option value="advanced">Advanced / Hard</option>
                    </select>
                  </div>
                </div>

                {formCategory === 'custom' && (
                  <div className="space-y-1">
                    <label className="text-xs font-extrabold text-slate-700">
                      Custom Category Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. JavaScript, React, Data Structures"
                      value={customCategory}
                      onChange={(e) => setCustomCategory(e.target.value)}
                      className="w-full px-3.5 py-2 bg-white border border-blue-200 rounded-xl text-xs text-slate-900"
                    />
                  </div>
                )}

                {/* Quick Topic Chips */}
                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold text-slate-700 block">
                    Popular Topic Suggestions (Click to select):
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {(formCategory === 'Crypto'
                      ? [
                          'Proof of Stake',
                          'Zero Knowledge',
                          'Smart Contracts',
                          'Bitcoin UTXO',
                          'DeFi AMM',
                        ]
                      : formCategory === 'Machine Learning'
                        ? [
                            'Supervised Learning',
                            'Gradient Descent',
                            'Overfitting Mitigation',
                            'Random Forests',
                          ]
                        : formCategory === 'Python' || formCategory === 'Coding'
                          ? [
                              'Python recursion & base case output',
                              'List comprehensions & lambda',
                              'Async/Await event loop',
                              'Data Structures & Array manipulation',
                              'OOP Inheritance & Polymorphism',
                            ]
                          : [
                              'Self Attention Transformer',
                              'RLHF Alignment',
                              'Vector Embeddings',
                              'Fine Tuning LLMs',
                              'Neural Networks',
                            ]
                    ).map((tItem) => (
                      <button
                        key={tItem}
                        type="button"
                        onClick={() => {
                          setAiTopic(tItem);
                          handleGenerateWithAI(tItem);
                        }}
                        className="px-3 py-1 bg-white hover:bg-[#2563EB] hover:text-white text-slate-700 text-xs font-bold rounded-lg border border-blue-200 transition-colors shadow-sm"
                      >
                        ⚡ {tItem}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5 pt-2">
                  <label className="text-xs font-extrabold text-slate-700">
                    Write in detail about topic to get accurate question:
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Write in detail about topic to get accurate question (e.g. 'Python recursive function calls, base cases, and step-by-step output tracing')"
                    value={aiTopic}
                    onChange={(e) => setAiTopic(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-blue-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#2563EB]"
                  />
                  <div className="flex justify-end pt-1">
                    <button
                      type="button"
                      onClick={() => handleGenerateWithAI()}
                      disabled={generatingAI}
                      className="px-5 py-2.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-extrabold rounded-xl shadow-md flex items-center gap-1.5 disabled:opacity-50"
                    >
                      {generatingAI ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Sparkles className="w-4 h-4" />
                      )}
                      <span>
                        {generatingAI ? 'Generating Question...' : '✨ Generate Question with AI'}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: MANUAL INPUT & REVIEW FORM */}
            {(activeAddTab === 'manual' || formText) && (
              <form onSubmit={handleAddSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold text-slate-700">Question Text</label>
                  <textarea
                    placeholder="Enter question text..."
                    value={formText}
                    onChange={(e) => setFormText(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#2563EB]"
                    required
                  />
                </div>

                {/* 4 Options */}
                <div className="space-y-2">
                  <label className="text-xs font-extrabold text-slate-700 block">
                    4 Choice Options (Select radio for Correct Answer)
                  </label>
                  {[
                    { val: formOption0, set: setFormOption0, letter: 'A', index: 0 },
                    { val: formOption1, set: setFormOption1, letter: 'B', index: 1 },
                    { val: formOption2, set: setFormOption2, letter: 'C', index: 2 },
                    { val: formOption3, set: setFormOption3, letter: 'D', index: 3 },
                  ].map((opt) => (
                    <div key={opt.index} className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="correctOption"
                        checked={formCorrectIndex === opt.index}
                        onChange={() => setFormCorrectIndex(opt.index)}
                        className="w-4 h-4 text-[#2563EB] focus:ring-blue-500"
                      />
                      <span className="w-6 font-extrabold text-xs text-slate-700">
                        Opt {opt.letter}:
                      </span>
                      <input
                        type="text"
                        placeholder={`Option ${opt.letter}`}
                        value={opt.val}
                        onChange={(e) => opt.set(e.target.value)}
                        className="flex-1 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#2563EB]"
                      />
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-extrabold text-slate-700">Category</label>
                    <select
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value)}
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none"
                    >
                      <option value="Coding">Coding</option>
                      <option value="Python">Python</option>
                      <option value="AI">AI</option>
                      <option value="Crypto">Crypto</option>
                      <option value="Machine Learning">Machine Learning</option>
                      <option value="Web3">Web3</option>
                      <option value="custom">Custom Category...</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-extrabold text-slate-700">Difficulty</label>
                    <select
                      value={formDifficulty}
                      onChange={(e) => setFormDifficulty(e.target.value)}
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none"
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>
                </div>

                {formCategory === 'custom' && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-extrabold text-slate-700">
                      Custom Category Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Machine Learning, Data Science"
                      value={customCategory}
                      onChange={(e) => setCustomCategory(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#2563EB]"
                    />
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold text-slate-700">Explanation</label>
                  <textarea
                    placeholder="Briefly explain why this option is correct..."
                    value={formExplanation}
                    onChange={(e) => setFormExplanation(e.target.value)}
                    rows={2}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#2563EB]"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddOpen(false)}
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
                    <span>{loading ? 'Saving...' : 'Save Question to DB'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* EDIT QUESTION MODAL */}
      {editingQuestion && (
        <div className="fixed inset-0 z-[200] bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-xl rounded-3xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-black text-slate-900 text-lg flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-[#2563EB]" />
                Edit / Update Question ({formCategory})
              </h3>
              <button
                onClick={() => setEditingQuestion(null)}
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
                <label className="text-xs font-extrabold text-slate-700">Question Text</label>
                <textarea
                  value={formText}
                  onChange={(e) => setFormText(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#2563EB]"
                  required
                />
              </div>

              {/* 4 Options */}
              <div className="space-y-2">
                <label className="text-xs font-extrabold text-slate-700 block">
                  4 Choice Options (Select radio for Correct Answer)
                </label>
                {[
                  { val: formOption0, set: setFormOption0, letter: 'A', index: 0 },
                  { val: formOption1, set: setFormOption1, letter: 'B', index: 1 },
                  { val: formOption2, set: setFormOption2, letter: 'C', index: 2 },
                  { val: formOption3, set: setFormOption3, letter: 'D', index: 3 },
                ].map((opt) => (
                  <div key={opt.index} className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="editCorrectOption"
                      checked={formCorrectIndex === opt.index}
                      onChange={() => setFormCorrectIndex(opt.index)}
                      className="w-4 h-4 text-[#2563EB] focus:ring-blue-500"
                    />
                    <span className="w-6 font-extrabold text-xs text-slate-700">
                      Opt {opt.letter}:
                    </span>
                    <input
                      type="text"
                      placeholder={`Option ${opt.letter}`}
                      value={opt.val}
                      onChange={(e) => opt.set(e.target.value)}
                      className="flex-1 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#2563EB]"
                    />
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold text-slate-700">Category</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none"
                  >
                    <option value="Coding">Coding</option>
                    <option value="Python">Python</option>
                    <option value="AI">AI</option>
                    <option value="Crypto">Crypto</option>
                    <option value="Machine Learning">Machine Learning</option>
                    <option value="Web3">Web3</option>
                    <option value="custom">Custom Category...</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold text-slate-700">Difficulty</label>
                  <select
                    value={formDifficulty}
                    onChange={(e) => setFormDifficulty(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
              </div>

              {formCategory === 'custom' && (
                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold text-slate-700">
                    Custom Category Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Machine Learning, Data Science"
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#2563EB]"
                  />
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-extrabold text-slate-700">Explanation</label>
                <textarea
                  placeholder="Briefly explain why this option is correct..."
                  value={formExplanation}
                  onChange={(e) => setFormExplanation(e.target.value)}
                  rows={2}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#2563EB]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingQuestion(null)}
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
                  <span>{loading ? 'Updating...' : 'Update Question'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
