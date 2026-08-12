'use client';

import React from 'react';
import {
  GripVertical,
  Trash2,
  Plus,
  Check,
  AlertCircle,
  HelpCircle,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';

export interface QuestionData {
  id?: string;
  text: string;
  questionType: 'single-choice' | 'multi-choice';
  options: string[];
  correctOptionIndex: number;
  correctIndexes?: number[];
  explanation: string;
  difficulty?: string;
  order?: number;
}

interface QuestionBlockProps {
  index: number;
  totalQuestions: number;
  question: QuestionData;
  error?: string;
  onChange: (updatedQuestion: QuestionData) => void;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

export function QuestionBlock({
  index,
  totalQuestions,
  question,
  error,
  onChange,
  onRemove,
  onMoveUp,
  onMoveDown,
}: QuestionBlockProps) {
  const isMulti = question.questionType === 'multi-choice';
  const currentCorrectIndexes = question.correctIndexes || [question.correctOptionIndex ?? 0];

  const handleTextChange = (text: string) => {
    onChange({ ...question, text });
  };

  const handleTypeChange = (type: 'single-choice' | 'multi-choice') => {
    const isNowMulti = type === 'multi-choice';
    onChange({
      ...question,
      questionType: type,
      correctOptionIndex: isNowMulti ? -1 : (currentCorrectIndexes[0] ?? 0),
      correctIndexes: isNowMulti
        ? currentCorrectIndexes.length
          ? currentCorrectIndexes
          : [0]
        : [currentCorrectIndexes[0] ?? 0],
    });
  };

  const handleOptionTextChange = (optIdx: number, val: string) => {
    const newOpts = [...question.options];
    newOpts[optIdx] = val;
    onChange({ ...question, options: newOpts });
  };

  const handleAddOption = () => {
    const newOpts = [...question.options, ''];
    onChange({ ...question, options: newOpts });
  };

  const handleRemoveOption = (optIdx: number) => {
    if (question.options.length <= 2) return;
    const newOpts = question.options.filter((_, i) => i !== optIdx);

    // Adjust correct option selection
    let newCorrectIndex = question.correctOptionIndex;
    let newCorrectIndexes = (question.correctIndexes || [0])
      .filter((i) => i !== optIdx)
      .map((i) => (i > optIdx ? i - 1 : i));

    if (newCorrectIndexes.length === 0) newCorrectIndexes = [0];

    if (!isMulti) {
      if (newCorrectIndex === optIdx) {
        newCorrectIndex = 0;
      } else if (newCorrectIndex > optIdx) {
        newCorrectIndex -= 1;
      }
    }

    onChange({
      ...question,
      options: newOpts,
      correctOptionIndex: newCorrectIndex,
      correctIndexes: newCorrectIndexes,
    });
  };

  const toggleCorrectAnswer = (optIdx: number) => {
    if (isMulti) {
      let updated: number[];
      if (currentCorrectIndexes.includes(optIdx)) {
        updated = currentCorrectIndexes.filter((i) => i !== optIdx);
      } else {
        updated = [...currentCorrectIndexes, optIdx].sort((a, b) => a - b);
      }
      onChange({
        ...question,
        correctIndexes: updated,
        correctOptionIndex: updated[0] ?? 0,
      });
    } else {
      onChange({
        ...question,
        correctOptionIndex: optIdx,
        correctIndexes: [optIdx],
      });
    }
  };

  const isOptionCorrect = (optIdx: number) => {
    if (isMulti) {
      return currentCorrectIndexes.includes(optIdx);
    }
    return question.correctOptionIndex === optIdx;
  };

  return (
    <div
      className={`bg-white border rounded-2xl p-5 shadow-sm transition-all relative ${
        error ? 'border-red-300 ring-2 ring-red-100' : 'border-slate-200 hover:border-blue-200'
      }`}
    >
      {/* Question Block Header */}
      <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 text-slate-400 bg-slate-50 rounded-lg cursor-grab active:cursor-grabbing hover:text-slate-600">
            <GripVertical className="w-4 h-4" />
          </div>
          <span className="font-black text-xs sm:text-sm text-slate-800 bg-blue-50 text-[#2563EB] px-2.5 py-1 rounded-lg border border-blue-100">
            Q{index + 1}
          </span>
          <span className="text-xs font-semibold text-slate-500 hidden sm:inline">
            Question Details
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Reordering Controls */}
          <div className="flex items-center gap-1 bg-slate-50 rounded-lg border border-slate-200 p-0.5">
            <button
              type="button"
              onClick={onMoveUp}
              disabled={index === 0}
              className="p-1 hover:bg-slate-200 disabled:opacity-30 rounded text-slate-600 transition-colors"
              title="Move Up"
            >
              <ChevronUp className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={onMoveDown}
              disabled={index === totalQuestions - 1}
              className="p-1 hover:bg-slate-200 disabled:opacity-30 rounded text-slate-600 transition-colors"
              title="Move Down"
            >
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Remove Question Button */}
          <button
            type="button"
            onClick={onRemove}
            disabled={totalQuestions <= 1}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 disabled:opacity-40 disabled:hover:bg-red-50 font-bold text-xs rounded-xl border border-red-100 transition-all"
            title="Remove Question"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Remove</span>
          </button>
        </div>
      </div>

      {/* Inline Validation Error Banner if any */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs font-semibold text-red-700">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Fields Grid */}
      <div className="space-y-4">
        {/* Question Text & Type Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="md:col-span-3">
            <label className="block text-xs font-extrabold text-slate-700 mb-1">
              Question Prompt <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. What does AI stand for?"
              value={question.text}
              onChange={(e) => handleTextChange(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:border-[#2563EB] focus:bg-white transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-extrabold text-slate-700 mb-1">
              Question Type
            </label>
            <select
              value={question.questionType}
              onChange={(e) => handleTypeChange(e.target.value as any)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:border-[#2563EB] focus:bg-white"
            >
              <option value="single-choice">Single Choice</option>
              <option value="multi-choice">Multiple Choice</option>
            </select>
          </div>
        </div>

        {/* Options List */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-extrabold text-slate-700 flex items-center gap-1.5">
              <span>Answer Options (Select correct answer)</span>
              <span className="text-[11px] text-slate-400 font-normal">
                ({isMulti ? 'Multiple select allowed' : 'Select one correct answer'})
              </span>
            </label>
            <button
              type="button"
              onClick={handleAddOption}
              className="text-xs font-extrabold text-[#2563EB] hover:text-[#1D4ED8] flex items-center gap-1 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100 hover:bg-blue-100 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Option</span>
            </button>
          </div>

          <div className="space-y-2">
            {question.options.map((optionText, optIdx) => {
              const selected = isOptionCorrect(optIdx);
              return (
                <div
                  key={optIdx}
                  className={`flex items-center gap-2 p-1.5 rounded-xl border transition-all ${
                    selected
                      ? 'bg-emerald-50/60 border-emerald-300'
                      : 'bg-slate-50/80 border-slate-200'
                  }`}
                >
                  {/* Select Correct Radio / Checkbox */}
                  <button
                    type="button"
                    onClick={() => toggleCorrectAnswer(optIdx)}
                    className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 transition-all ${
                      selected
                        ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-500/30'
                        : 'bg-white border border-slate-300 text-slate-400 hover:border-emerald-400 hover:text-emerald-600'
                    }`}
                    title={selected ? 'Marked as Correct' : 'Click to mark as Correct'}
                  >
                    {selected ? <Check className="w-4 h-4" /> : String.fromCharCode(65 + optIdx)}
                  </button>

                  {/* Option Text Input */}
                  <input
                    type="text"
                    placeholder={`Option ${String.fromCharCode(65 + optIdx)}...`}
                    value={optionText}
                    onChange={(e) => handleOptionTextChange(optIdx, e.target.value)}
                    className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#2563EB]"
                  />

                  {/* Remove Option Button */}
                  <button
                    type="button"
                    onClick={() => handleRemoveOption(optIdx)}
                    disabled={question.options.length <= 2}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 disabled:opacity-20 rounded-lg transition-colors"
                    title="Delete option"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Explanation Field */}
        <div>
          <label className="block text-xs font-extrabold text-slate-700 mb-1 flex items-center gap-1">
            <span>Explanation / Learner Feedback</span>
            <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
          </label>
          <textarea
            rows={2}
            placeholder="Explain why the answer is correct (shown to learners post-submission)..."
            value={question.explanation}
            onChange={(e) => onChange({ ...question, explanation: e.target.value })}
            className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-[#2563EB] focus:bg-white transition-all"
          />
        </div>
      </div>
    </div>
  );
}
