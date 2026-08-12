'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import {
  Shield,
  ArrowLeft,
  Save,
  Send,
  Eye,
  Plus,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  BookOpen,
  Sparkles,
  Info,
  X,
  Wand2,
} from 'lucide-react';
import { QuestionBlock, QuestionData } from './QuestionBlock';

export interface QuizFormData {
  id?: string;
  title: string;
  slug: string;
  category: string;
  difficulty: string;
  quizType: string;
  status: 'Draft' | 'Published';
  questions: QuestionData[];
}

interface QuizEditorFormProps {
  mode: 'create' | 'edit';
  initialData?: QuizFormData | null;
}

const CATEGORY_OPTIONS = [
  'AI',
  'Crypto & Blockchain',
  'Machine Learning',
  'Web3',
  'Python',
  'Data Science',
  'General Tech',
];

const DIFFICULTY_OPTIONS = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
];

export function QuizEditorForm({ mode, initialData }: QuizEditorFormProps) {
  const router = useRouter();
  const params = useParams() || {};
  const locale = (params.locale as string) || 'en';

  const [title, setTitle] = useState<string>(initialData?.title || '');
  const [slug, setSlug] = useState<string>(initialData?.slug || '');
  const [category, setCategory] = useState<string>(
    initialData?.category || initialData?.title || ''
  );
  const [difficulty, setDifficulty] = useState<string>(initialData?.difficulty || 'beginner');
  const [quizType, setQuizType] = useState<string>(initialData?.quizType || 'Build-Up/Leveled');
  const [status, setStatus] = useState<'Draft' | 'Published'>(initialData?.status || 'Draft');

  const [questions, setQuestions] = useState<QuestionData[]>(
    initialData?.questions && initialData.questions.length > 0
      ? initialData.questions
      : [
          {
            text: '',
            questionType: 'single-choice',
            options: ['', ''],
            correctOptionIndex: 0,
            correctIndexes: [0],
            explanation: '',
          },
        ]
  );

  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});
  const [generalError, setGeneralError] = useState<string>('');
  const [saving, setSaving] = useState<boolean>(false);
  const [aiGenerating, setAiGenerating] = useState<boolean>(false);

  // AI Generator Modal state
  const [showAiModal, setShowAiModal] = useState<boolean>(false);
  const [aiTopic, setAiTopic] = useState<string>('');
  const [aiCount, setAiCount] = useState<number>(10);
  const [isCustomCount, setIsCustomCount] = useState<boolean>(false);
  const [customCountInput, setCustomCountInput] = useState<string>('20');
  const [aiOptionsCount, setAiOptionsCount] = useState<number>(4);
  const [aiDifficulty, setAiDifficulty] = useState<string>('beginner');
  const [aiQuestionType, setAiQuestionType] = useState<string>('single-choice');
  const [aiCategory, setAiCategory] = useState<string>('');

  const handleOpenAiModal = () => {
    setAiTopic('');
    setAiCategory(category || title || 'AI');
    setAiDifficulty(difficulty || 'beginner');
    setShowAiModal(true);
  };

  const handleAiGenerateQuestionSubmit = async () => {
    setAiGenerating(true);
    const finalCount = isCustomCount
      ? Math.max(1, Math.min(50, parseInt(customCountInput, 10) || 1))
      : aiCount;

    try {
      const res = await fetch('/api/admin/generate-question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: aiTopic || title || undefined,
          category: aiCategory || category || 'AI',
          difficulty: aiDifficulty,
          questionType: aiQuestionType,
          count: finalCount,
          optionsCount: aiOptionsCount,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to generate question with AI');

      const newQs: QuestionData[] = [];
      const processQuestion = (q: any): QuestionData => {
        const qType = q.questionType || aiQuestionType || 'single-choice';
        let cIndexes =
          Array.isArray(q.correctIndexes) && q.correctIndexes.length > 0
            ? q.correctIndexes
            : [typeof q.correctOptionIndex === 'number' ? q.correctOptionIndex : 0];

        const opts = Array.isArray(q.options) && q.options.length >= 2 ? q.options : ['', ''];

        if (qType === 'multi-choice' && cIndexes.length < 2) {
          const primary = cIndexes[0] ?? 0;
          const second = (primary + 1) % opts.length;
          cIndexes = Array.from(new Set([primary, second])).sort((a, b) => a - b);
        }

        return {
          text: q.text || '',
          questionType: qType,
          options: opts,
          correctOptionIndex: qType === 'multi-choice' ? -1 : (cIndexes[0] ?? 0),
          correctIndexes: cIndexes,
          explanation: q.explanation || '',
          difficulty: q.difficulty || aiDifficulty,
        };
      };

      if (Array.isArray(data.questions) && data.questions.length > 0) {
        data.questions.forEach((q: any) => {
          newQs.push(processQuestion(q));
        });
      } else if (data.question) {
        newQs.push(processQuestion(data.question));
      }

      if (newQs.length > 0) {
        setQuestions((prev) => {
          const isInitialPlaceholder =
            prev.length === 1 &&
            !prev[0].text.trim() &&
            (!prev[0].options || prev[0].options.every((opt) => !opt.trim()));

          if (isInitialPlaceholder) {
            return newQs;
          }
          return [...prev, ...newQs];
        });
      }
      setShowAiModal(false);
    } catch (err: any) {
      alert(err.message || 'Error generating AI questions.');
    } finally {
      setAiGenerating(false);
    }
  };

  // Sync state if initialData loads asynchronously
  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setSlug(initialData.slug || '');
      setCategory(initialData.category || initialData.title || '');
      setDifficulty(initialData.difficulty || 'beginner');
      setQuizType(initialData.quizType || 'Build-Up/Leveled');
      setStatus(initialData.status || 'Draft');
      if (initialData.questions && initialData.questions.length > 0) {
        setQuestions(initialData.questions);
      }
    }
  }, [initialData]);

  // Auto-generate slug and sync category from Title
  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
    setCategory(newTitle);
    const generatedSlug = (newTitle || '')
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-');
    setSlug(generatedSlug);
  };

  // Question array manipulation
  const handleAddQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      {
        text: '',
        questionType: 'single-choice',
        options: ['', ''],
        correctOptionIndex: 0,
        correctIndexes: [0],
        explanation: '',
      },
    ]);
  };

  const handleRemoveQuestion = (idx: number) => {
    if (questions.length <= 1) return;
    setQuestions((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleMoveQuestion = (idx: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= questions.length) return;
    const updated = [...questions];
    const temp = updated[idx];
    updated[idx] = updated[targetIdx];
    updated[targetIdx] = temp;
    setQuestions(updated);
  };

  const handleUpdateQuestion = (idx: number, updatedQuestion: QuestionData) => {
    setQuestions((prev) => {
      const copy = [...prev];
      copy[idx] = updatedQuestion;
      return copy;
    });
  };

  // Client-side Validation
  const validateForm = (isPublishing: boolean): boolean => {
    const errors: { [key: string]: string } = {};

    if (!title.trim()) {
      errors.title = 'Quiz title is required.';
    }

    if (isPublishing) {
      if (questions.length === 0) {
        errors.questions = 'A published quiz must have at least 1 question.';
      }

      questions.forEach((q, idx) => {
        if (!q.text.trim()) {
          errors[`q_${idx}`] = `Question ${idx + 1} prompt cannot be empty.`;
        }

        const validOptions = q.options.filter((opt) => opt.trim().length > 0);
        if (validOptions.length < 2) {
          errors[`q_${idx}`] = `Question ${idx + 1} needs at least 2 valid answer options.`;
        }

        if (q.questionType === 'multi-choice') {
          if (!q.correctIndexes || q.correctIndexes.length === 0) {
            errors[`q_${idx}`] = `Question ${idx + 1} needs at least one correct answer marked.`;
          }
        } else {
          if (
            q.correctOptionIndex === undefined ||
            q.correctOptionIndex < 0 ||
            q.correctOptionIndex >= q.options.length
          ) {
            errors[`q_${idx}`] = `Question ${idx + 1} needs a correct answer marked.`;
          }
        }
      });
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Submit Handler (Post for create, Put for edit)
  const handleSubmit = async (targetStatus: 'Draft' | 'Published') => {
    setGeneralError('');
    const isValid = validateForm(targetStatus === 'Published');
    if (!isValid) return;

    setSaving(true);
    try {
      const payload = {
        id: initialData?.id,
        title: title.trim(),
        slug: slug.trim(),
        category,
        difficulty,
        quizType,
        status: targetStatus,
        isActive: targetStatus === 'Published',
        questions,
      };

      const method = mode === 'create' ? 'POST' : 'PUT';
      const res = await fetch('/api/admin/quiz', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save quiz.');

      // Redirect back to quizzes index on success
      router.push(`/${locale}/admin/quizzes`);
    } catch (err: any) {
      console.error('Quiz save error:', err);
      setGeneralError(err.message || 'An error occurred while saving the quiz.');
    } finally {
      setSaving(false);
    }
  };

  // Check preview availability (enabled once title/slug and at least 1 question prompt exist)
  const currentSlug =
    (slug || '').trim() ||
    (title || '')
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-');
  const isPreviewEnabled =
    currentSlug.length > 0 &&
    Array.isArray(questions) &&
    questions.length > 0 &&
    Boolean(questions[0]?.text?.trim().length);

  const handlePreview = () => {
    if (!isPreviewEnabled) return;
    window.open(`/${locale}/quiz/${currentSlug}`, '_blank');
  };

  return (
    <div className="w-full min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-sans">
      {/* Sticky Header */}
      <header className="w-full border-b border-blue-100 bg-white/95 backdrop-blur-lg px-4 sm:px-8 py-4 flex items-center justify-between sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-3">
          <Link
            href={`/${locale}/admin/quizzes`}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            title="Back to Quizzes"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="w-10 h-10 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-center text-[#2563EB] shrink-0">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-black text-base sm:text-lg text-slate-900">
              {mode === 'create' ? 'Create New Quiz' : 'Edit Quiz'}
            </h1>
            <span className="text-[11px] text-slate-500 font-semibold">
              {mode === 'create'
                ? 'Build and publish a new quiz'
                : `Quiz ID: ${initialData?.id || ''}`}
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={handlePreview}
            disabled={!isPreviewEnabled}
            className="px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-700 font-extrabold text-xs sm:text-sm flex items-center gap-1.5 transition-all"
            title="Preview Quiz Runner"
          >
            <Eye className="w-4 h-4 text-slate-600" />
            <span className="hidden sm:inline">Preview</span>
          </button>

          <button
            type="button"
            onClick={() => handleSubmit('Draft')}
            disabled={saving}
            className="px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 disabled:opacity-50 text-slate-800 font-extrabold text-xs sm:text-sm flex items-center gap-1.5 transition-all shadow-sm"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4 text-slate-600" />
            )}
            <span>Save Draft</span>
          </button>

          <button
            type="button"
            onClick={() => handleSubmit('Published')}
            disabled={saving}
            className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] disabled:opacity-50 text-white font-extrabold text-xs sm:text-sm flex items-center gap-1.5 transition-all shadow-md shadow-blue-500/20 active:scale-[0.98]"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            <span>Publish</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-5xl mx-auto p-4 sm:p-8 space-y-6">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 border-b border-gray-200 pb-3 overflow-x-auto text-xs font-bold text-slate-600">
          <Link
            href={`/${locale}/admin/dashboard`}
            className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-50"
          >
            Dashboard
          </Link>
          <span className="text-slate-400">/</span>
          <Link
            href={`/${locale}/admin/quizzes`}
            className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-50"
          >
            Quizzes Index
          </Link>
          <span className="text-slate-400">/</span>
          <span className="px-3 py-1.5 rounded-lg bg-blue-50 text-[#2563EB] font-extrabold border border-blue-100">
            {mode === 'create' ? 'New Quiz Authoring' : 'Edit Quiz Authoring'}
          </span>
        </div>

        {/* Global Error Banner */}
        {generalError && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3 text-sm text-red-700 font-semibold shadow-sm">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <span>{generalError}</span>
          </div>
        )}

        {/* 1. QUIZ METADATA SECTION */}
        <section className="bg-white border border-blue-100 rounded-2xl p-5 sm:p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 bg-blue-50 text-[#2563EB] text-xs font-black rounded-lg border border-blue-100">
                Step 1
              </span>
              <BookOpen className="w-5 h-5 text-[#2563EB]" />
              <h2 className="font-extrabold text-base text-slate-900">
                Quiz Metadata & Category Details
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500">Status:</span>
              <button
                type="button"
                onClick={() => setStatus(status === 'Published' ? 'Draft' : 'Published')}
                className={`px-3 py-1 rounded-xl text-xs font-extrabold border transition-all ${
                  status === 'Published'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-amber-50 text-amber-700 border-amber-200'
                }`}
              >
                {status}
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {/* Title Row */}
            <div>
              <label className="block text-xs font-extrabold text-slate-700 mb-1">
                Quiz Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Master Artificial Intelligence Essentials"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:border-[#2563EB] focus:bg-white transition-all ${
                  validationErrors.title ? 'border-red-400 bg-red-50/50' : 'border-slate-200'
                }`}
              />
              {validationErrors.title && (
                <p className="mt-1 text-[11px] text-red-600 font-semibold">
                  {validationErrors.title}
                </p>
              )}
            </div>

            {/* Category & Difficulty Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1">Category</label>
                <input
                  type="text"
                  list="category-suggestions"
                  placeholder="Defaults to Quiz Title"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:border-[#2563EB] focus:bg-white transition-all"
                />
                <datalist id="category-suggestions">
                  {CATEGORY_OPTIONS.map((cat) => (
                    <option key={cat} value={cat} />
                  ))}
                </datalist>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1">
                  Difficulty
                </label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:border-[#2563EB]"
                >
                  {DIFFICULTY_OPTIONS.map((diff) => (
                    <option key={diff.value} value={diff.value}>
                      {diff.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* 2. DYNAMIC QUESTIONS LIST SECTION */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 bg-purple-50 text-purple-700 text-xs font-black rounded-lg border border-purple-100">
                Step 2
              </span>
              <h2 className="font-black text-lg text-slate-900 flex items-center gap-2">
                <span>Questions List</span>
                <span className="text-xs font-extrabold text-slate-500 bg-slate-200/70 px-2 py-0.5 rounded-full">
                  {questions.length}
                </span>
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleOpenAiModal}
                disabled={aiGenerating}
                className="px-3.5 py-2 sm:px-4 sm:py-2.5 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-extrabold text-xs sm:text-sm rounded-xl flex items-center gap-1.5 transition-all shadow-md shadow-purple-500/20 active:scale-[0.98]"
                title="Configure and auto-generate questions using AI"
              >
                {aiGenerating ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4 fill-white" />
                )}
                <span>{aiGenerating ? 'Generating...' : 'AI Generate Question'}</span>
              </button>

              <button
                type="button"
                onClick={handleAddQuestion}
                className="px-4 py-2.5 bg-[#2563EB] hover:bg-[#1D4ED8] rounded-xl text-xs sm:text-sm font-extrabold text-white flex items-center gap-1.5 transition-all shadow-md shadow-blue-500/20 active:scale-[0.98]"
              >
                <Plus className="w-4 h-4" />
                <span>+ Add Question</span>
              </button>
            </div>
          </div>

          {/* Questions Stack */}
          <div className="space-y-4">
            {questions.map((q, idx) => (
              <QuestionBlock
                key={idx}
                index={idx}
                totalQuestions={questions.length}
                question={q}
                error={validationErrors[`q_${idx}`]}
                onChange={(updated) => handleUpdateQuestion(idx, updated)}
                onRemove={() => handleRemoveQuestion(idx)}
                onMoveUp={() => handleMoveQuestion(idx, 'up')}
                onMoveDown={() => handleMoveQuestion(idx, 'down')}
              />
            ))}
          </div>

          {/* Bottom Add Question Button */}
          <div className="pt-2 flex justify-center">
            <button
              type="button"
              onClick={handleAddQuestion}
              className="w-full py-3 border-2 border-dashed border-blue-200 hover:border-blue-400 bg-blue-50/50 hover:bg-blue-50 text-[#2563EB] font-extrabold text-xs sm:text-sm rounded-2xl flex items-center justify-center gap-2 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add Another Question</span>
            </button>
          </div>
        </section>
      </main>

      {/* AI Question Generator Modal Card */}
      {showAiModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white border border-purple-100 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6 relative">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600 shrink-0">
                  <Sparkles className="w-5 h-5 fill-purple-600" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base sm:text-lg text-slate-900">
                    AI Question Generator
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Configure parameters to auto-generate custom quiz questions
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAiModal(false)}
                disabled={aiGenerating}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form Details */}
            <div className="space-y-4 text-xs sm:text-sm">
              {/* Topic / Prompt */}
              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1">
                  Topic / Focus Prompt <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={2}
                  value={aiTopic}
                  onChange={(e) => setAiTopic(e.target.value)}
                  placeholder="Example: Focus on Transformer Attention Mechanisms, RLHF Alignment, or Python Decorators & Generators..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:border-purple-600 focus:bg-white transition-all"
                />
                <div className="mt-2 p-2.5 bg-purple-50/70 border border-purple-100 rounded-xl text-[11px] text-purple-900 font-medium space-y-1">
                  <span className="font-extrabold text-purple-950 block">
                    💡 Example Prompt for Best Results:
                  </span>
                  <p className="text-purple-800">
                    Specify exact concepts, sub-topics, or practical scenarios you want generated.
                  </p>
                  <p className="text-purple-700 italic font-semibold">
                    &quot;Generate high quality questions on Python Asyncio Event Loop, Memory
                    Management, and GIL multithreading&quot;
                  </p>
                </div>
              </div>

              {/* Number of Questions & Difficulty */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 mb-1">
                    Number of Questions
                  </label>
                  <div className="flex items-center gap-1.5 mb-2">
                    {[5, 10, 15].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => {
                          setIsCustomCount(false);
                          setAiCount(num);
                        }}
                        className={`flex-1 py-2 rounded-xl text-xs font-extrabold border transition-all ${
                          !isCustomCount && aiCount === num
                            ? 'bg-purple-600 text-white border-purple-600 shadow-sm shadow-purple-500/20'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {num} Qs
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => setIsCustomCount(true)}
                      className={`flex-1 py-2 rounded-xl text-xs font-extrabold border transition-all ${
                        isCustomCount
                          ? 'bg-purple-600 text-white border-purple-600 shadow-sm shadow-purple-500/20'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      Custom
                    </button>
                  </div>

                  {isCustomCount && (
                    <div className="flex items-center gap-2 bg-purple-50/60 p-2 rounded-xl border border-purple-200">
                      <span className="text-xs font-bold text-purple-900 shrink-0">
                        Custom Quantity:
                      </span>
                      <input
                        type="number"
                        min={1}
                        max={50}
                        value={customCountInput}
                        onChange={(e) => setCustomCountInput(e.target.value)}
                        placeholder="Enter number (1-50)"
                        className="w-full px-3 py-1.5 bg-white border border-purple-300 rounded-lg text-xs font-bold text-purple-950 focus:outline-none focus:border-purple-600"
                      />
                    </div>
                  )}
                </div>

                {/* Options per Question Selector */}
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 mb-1">
                    Answer Options per Question
                  </label>
                  <div className="flex items-center gap-1.5">
                    {[2, 3, 4, 5].map((optNum) => (
                      <button
                        key={optNum}
                        type="button"
                        onClick={() => setAiOptionsCount(optNum)}
                        className={`flex-1 py-2 rounded-xl text-xs font-extrabold border transition-all ${
                          aiOptionsCount === optNum
                            ? 'bg-purple-600 text-white border-purple-600 shadow-sm shadow-purple-500/20'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {optNum} Options
                      </button>
                    ))}
                  </div>
                </div>

                {/* Difficulty & Format Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-extrabold text-slate-700 mb-1">
                      Difficulty Level
                    </label>
                    <select
                      value={aiDifficulty}
                      onChange={(e) => setAiDifficulty(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:border-purple-600 focus:bg-white"
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-slate-700 mb-1">
                      Question Format
                    </label>
                    <select
                      value={aiQuestionType}
                      onChange={(e) => setAiQuestionType(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:border-purple-600 focus:bg-white"
                    >
                      <option value="single-choice">Single Choice (MCQ)</option>
                      <option value="multi-choice">Multiple Choice</option>
                      <option value="mixed">Mixed Formats</option>
                    </select>
                  </div>
                </div>

                {/* Category Tag */}
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 mb-1">
                    Category Tag
                  </label>
                  <input
                    type="text"
                    value={aiCategory}
                    onChange={(e) => setAiCategory(e.target.value)}
                    placeholder="e.g. AI, Python, Web3"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:border-purple-600 focus:bg-white transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Modal Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowAiModal(false)}
                disabled={aiGenerating}
                className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-extrabold text-xs sm:text-sm transition-all"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleAiGenerateQuestionSubmit}
                disabled={aiGenerating}
                className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-extrabold text-xs sm:text-sm rounded-xl flex items-center gap-2 transition-all shadow-md shadow-purple-500/20 active:scale-[0.98]"
              >
                {aiGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>
                      Generating {isCustomCount ? parseInt(customCountInput, 10) || 1 : aiCount}{' '}
                      Questions...
                    </span>
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4" />
                    <span>
                      Generate {isCustomCount ? parseInt(customCountInput, 10) || 1 : aiCount}{' '}
                      Questions
                    </span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
