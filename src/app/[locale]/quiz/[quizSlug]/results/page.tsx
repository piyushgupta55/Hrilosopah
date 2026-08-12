'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Award,
  BookOpen,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Loader2,
  Clock,
} from 'lucide-react';

interface ResultQuestion {
  id: string;
  text: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
  userChosenIdx?: number;
  isCorrect?: boolean;
}

const FALLBACK_AI_QUESTIONS: ResultQuestion[] = [
  {
    id: 'q1',
    text: 'What does "AI" stand for?',
    options: [
      'Automated Intelligence',
      'Artificial Intelligence',
      'Algorithmic Integration',
      'Advanced Iteration',
    ],
    correctOptionIndex: 1,
    explanation:
      'AI stands for Artificial Intelligence, which is the simulation of human intelligence processes by machines.',
  },
  {
    id: 'q2',
    text: 'Which of the following is considered a subset of AI?',
    options: ['Cloud Computing', 'Machine Learning', 'Blockchain', 'Quantum Computing'],
    correctOptionIndex: 1,
    explanation:
      'Machine Learning is a subset of AI that focuses on building systems that learn from data.',
  },
  {
    id: 'q3',
    text: 'What is a "Large Language Model" (LLM)?',
    options: [
      'A model that translates languages perfectly',
      'A huge database of words',
      'An AI model trained on vast amounts of text to understand and generate human language',
      'A programming language for AI',
    ],
    correctOptionIndex: 2,
    explanation:
      'LLMs like GPT-4 are trained on massive text datasets to predict and generate natural language.',
  },
  {
    id: 'q4',
    text: "Which test was proposed by Alan Turing to evaluate a machine's capability to exhibit intelligent behavior?",
    options: [
      'The Turing Test',
      'The AI Benchmark',
      'The Intelligence Quotient (IQ) Test',
      'The Machine Learning Exam',
    ],
    correctOptionIndex: 0,
    explanation:
      "The Turing Test is a classic measure of a machine's ability to converse indistinguishably from a human.",
  },
  {
    id: 'q5',
    text: 'What does "NLP" stand for in the context of AI?',
    options: [
      'Neural Language Programming',
      'Natural Language Processing',
      'New Learning Protocol',
      'Non-Linear Processing',
    ],
    correctOptionIndex: 1,
    explanation:
      'Natural Language Processing helps computers understand, interpret, and manipulate human language.',
  },
  {
    id: 'q6',
    text: 'What is an "algorithm" in computer science?',
    options: [
      'A type of computer hardware',
      'A programming language',
      'A set of instructions designed to perform a specific task',
      'A specific brand of AI',
    ],
    correctOptionIndex: 2,
    explanation:
      'Algorithms are step-by-step procedures or formulas for solving problems, forming the basis of all software, including AI.',
  },
  {
    id: 'q7',
    text: 'What does "Generative AI" primarily do?',
    options: [
      'Sorts large databases',
      'Generates new content, such as text, images, or audio',
      'Repairs broken computer code automatically',
      'Translates text into binary code',
    ],
    correctOptionIndex: 1,
    explanation:
      'Generative AI refers to algorithms (like ChatGPT or Midjourney) that can create new content based on learned patterns.',
  },
  {
    id: 'q8',
    text: 'What is a common ethical concern regarding AI?',
    options: [
      'It uses too much internet bandwidth',
      'AI systems might exhibit bias learned from their training data',
      'AI will forget how to speak human languages',
      'AI cannot be turned off',
    ],
    correctOptionIndex: 1,
    explanation:
      'AI models can inherit and amplify human biases present in the data they were trained on, leading to unfair outcomes.',
  },
  {
    id: 'q9',
    text: 'What is "Computer Vision"?',
    options: [
      'A monitor with very high resolution',
      'A field of AI that enables computers to derive meaning from digital images and videos',
      'A virtual reality headset',
      'A type of graphics card',
    ],
    correctOptionIndex: 1,
    explanation:
      'Computer vision allows AI to "see" and interpret visual data, used in facial recognition, self-driving cars, etc.',
  },
  {
    id: 'q10',
    text: 'Which of the following is NOT typically considered an application of AI today?',
    options: [
      'Self-driving cars',
      'Spam email filters',
      'Basic mechanical clocks',
      'Voice assistants like Siri or Alexa',
    ],
    correctOptionIndex: 2,
    explanation:
      'Basic mechanical clocks operate purely on mechanical physics without any learning, data processing, or AI.',
  },
];

const FALLBACK_CRYPTO_QUESTIONS: ResultQuestion[] = [
  {
    id: 'c1',
    text: 'Who published the Bitcoin whitepaper in 2008?',
    options: ['Vitalik Buterin', 'Satoshi Nakamoto', 'Gavin Wood', 'Hal Finney'],
    correctOptionIndex: 1,
    explanation:
      'Satoshi Nakamoto authored Bitcoin: A Peer-to-Peer Electronic Cash System in October 2008.',
  },
  {
    id: 'c2',
    text: 'What is the maximum supply limit of Bitcoin?',
    options: ['100 Million', '21 Million', 'Unlimited', '18 Million'],
    correctOptionIndex: 1,
    explanation: 'Bitcoin supply is capped by protocol consensus at 21,000,000 BTC.',
  },
  {
    id: 'c3',
    text: 'What is a blockchain?',
    options: [
      'A centralized server',
      'A decentralized, immutable distributed ledger',
      'A web browser',
      'A banking app',
    ],
    correctOptionIndex: 1,
    explanation:
      'A blockchain is a decentralized distributed database maintained across a network of nodes.',
  },
  {
    id: 'c4',
    text: 'What is a smart contract?',
    options: [
      'A paper legal document',
      'Self-executing code stored on a blockchain',
      'A trading algorithm',
      'An email verification system',
    ],
    correctOptionIndex: 1,
    explanation:
      'Smart contracts automatically execute agreements directly in code when pre-defined conditions are met.',
  },
  {
    id: 'c5',
    text: 'What does EVM stand for in Ethereum?',
    options: [
      'Ethereum Virtual Machine',
      'External Value Method',
      'Electronic Verified Money',
      'Encryption Vault Module',
    ],
    correctOptionIndex: 0,
    explanation:
      'The Ethereum Virtual Machine (EVM) is the decentralized runtime environment for Ethereum smart contracts.',
  },
];

export default function QuizResultsPage() {
  const params = useParams() || {};
  const searchParams = useSearchParams();
  const locale = (params.locale as string) || 'en';
  const quizSlug = (params.quizSlug as string) || '';
  const attemptId = searchParams.get('attemptId') || '';

  const [loading, setLoading] = useState<boolean>(true);
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(null);
  const [quizDetails, setQuizDetails] = useState<any>(null);
  const [evaluatedQuestions, setEvaluatedQuestions] = useState<ResultQuestion[]>([]);
  const [actualScore, setActualScore] = useState<number>(0);
  const [totalQs, setTotalQs] = useState<number>(0);
  const [timeSpentText, setTimeSpentText] = useState<string>('2m 30s');

  useEffect(() => {
    async function loadAttemptResults() {
      setLoading(true);
      try {
        let storedAnswers: Record<string, number> = {};
        if (typeof window !== 'undefined') {
          try {
            if (attemptId) {
              const raw = sessionStorage.getItem(`attempt_${attemptId}_answers`);
              if (raw) storedAnswers = JSON.parse(raw);
            }
            if (Object.keys(storedAnswers).length === 0) {
              for (let i = 0; i < sessionStorage.length; i++) {
                const key = sessionStorage.key(i);
                if (key && key.startsWith('attempt_') && key.endsWith('_answers')) {
                  const raw = sessionStorage.getItem(key);
                  if (raw) {
                    storedAnswers = JSON.parse(raw);
                    break;
                  }
                }
              }
            }
          } catch {
            storedAnswers = {};
          }
        }

        let dataToUse: any = null;

        if (attemptId) {
          const res = await fetch(`/api/attempt/${attemptId}/details`);
          if (res.ok) {
            const result = await res.json();
            if (result.success && result.data) {
              dataToUse = result.data;
            }
          }
        }

        if ((!dataToUse || !dataToUse.questions || dataToUse.questions.length === 0) && quizSlug) {
          const res = await fetch(`/api/quiz/${quizSlug}`);
          if (res.ok) {
            const result = await res.json();
            if (result.success && result.data && result.data.questions?.length > 0) {
              dataToUse = {
                ...(dataToUse || {}),
                quizTitle:
                  result.data.title ||
                  quizSlug
                    .split('-')
                    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
                    .join(' '),
                category: result.data.category || 'general',
                totalQuestions: result.data.questions.length,
                questions: result.data.questions,
              };
            }
          }
        }

        if ((!dataToUse || !dataToUse.questions || dataToUse.questions.length === 0) && quizSlug) {
          const res = await fetch(`/api/admin/quiz?slug=${quizSlug}`);
          if (res.ok) {
            const result = await res.json();
            if (result.quiz && result.quiz.questions?.length > 0) {
              const quiz = result.quiz;
              dataToUse = {
                ...(dataToUse || {}),
                quizTitle: quiz.title || quizSlug,
                category: quiz.category,
                totalQuestions: quiz.questions.length,
                questions: quiz.questions,
              };
            }
          }
        }

        if (!dataToUse || !dataToUse.questions || dataToUse.questions.length === 0) {
          const isCrypto =
            quizSlug.includes('crypto') ||
            quizSlug.includes('bitcoin') ||
            quizSlug.includes('block');
          const fallbackQs = isCrypto ? FALLBACK_CRYPTO_QUESTIONS : FALLBACK_AI_QUESTIONS;
          dataToUse = {
            ...(dataToUse || {}),
            quizTitle: quizSlug
              .split('-')
              .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
              .join(' '),
            category: isCrypto ? 'crypto' : 'ai',
            totalQuestions: fallbackQs.length,
            questions: fallbackQs,
          };
        }

        setQuizDetails(dataToUse);
        if (dataToUse.timeSpentFormatted) {
          setTimeSpentText(dataToUse.timeSpentFormatted);
        }

        let correctCount = 0;
        const questionsList: ResultQuestion[] = (dataToUse.questions || []).map(
          (q: any, idx: number) => {
            let rawUserChoice: any = undefined;
            if (q.id && storedAnswers[q.id] !== undefined) {
              rawUserChoice = storedAnswers[q.id];
            } else if (storedAnswers[`q_${idx}`] !== undefined) {
              rawUserChoice = storedAnswers[`q_${idx}`];
            } else if (storedAnswers[`q${idx + 1}`] !== undefined) {
              rawUserChoice = storedAnswers[`q${idx + 1}`];
            } else {
              const keys = Object.keys(storedAnswers);
              if (keys[idx] !== undefined) {
                rawUserChoice = storedAnswers[keys[idx]];
              }
            }

            const correctOptIdx = Number(q.correctOptionIndex ?? 0);
            const hasChosen = rawUserChoice !== undefined && rawUserChoice !== null;
            const chosenIdx = hasChosen ? Number(rawUserChoice) : -1;
            const isCorrect = hasChosen && chosenIdx === correctOptIdx;

            if (isCorrect) correctCount++;

            let parsedOpts: string[] = [];
            if (Array.isArray(q.options)) {
              parsedOpts = q.options;
            } else if (typeof q.options === 'string') {
              try {
                parsedOpts = JSON.parse(q.options);
              } catch {
                parsedOpts = [q.options];
              }
            }

            return {
              id: q.id || `q_${idx}`,
              text: q.text,
              options: parsedOpts,
              correctOptionIndex: correctOptIdx,
              explanation: q.explanation || 'Evaluates key principles and foundational knowledge.',
              userChosenIdx: chosenIdx,
              isCorrect,
            };
          }
        );

        setEvaluatedQuestions(questionsList);
        setTotalQs(dataToUse.totalQuestions || questionsList.length || 5);
        setActualScore(
          dataToUse.score !== undefined && dataToUse.score !== null ? dataToUse.score : correctCount
        );
      } catch (err) {
        console.error('Error loading attempt results:', err);
      } finally {
        setLoading(false);
      }
    }

    loadAttemptResults();
  }, [attemptId, quizSlug]);

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-[#F8FAFC] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-[#2563EB] animate-spin" />
          <p className="text-xs font-extrabold text-slate-600">Calculating your results...</p>
        </div>
      </div>
    );
  }

  const accuracyPct = totalQs > 0 ? Math.round((actualScore / totalQs) * 100) : 0;
  const totalPoints = actualScore * 100;
  const isPerfect = actualScore === totalQs && totalQs > 0;

  return (
    <div className="min-h-screen w-full bg-[#F8FAFC] text-slate-900 flex flex-col font-sans relative overflow-x-hidden">
      {/* Header */}
      <header className="w-full border-b border-blue-100 bg-white/90 backdrop-blur-lg px-6 py-4 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <Link
          href={`/${locale}`}
          className="flex items-center gap-2 text-slate-600 hover:text-[#2563EB] transition-colors text-xs font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Home</span>
        </Link>
        <div className="flex items-center gap-2">
          <span
            className={`px-3 py-1 text-[11px] font-bold rounded-full border ${
              isPerfect
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-blue-50 text-[#2563EB] border-blue-200'
            }`}
          >
            {isPerfect ? 'Verified Pass' : 'Completed'}
          </span>
        </div>
      </header>

      <div className="flex-1 max-w-3xl w-full mx-auto p-5 space-y-4 pb-14">
        {/* Certificate Hero Badge */}
        <div className="w-full bg-white border border-blue-100 rounded-xl p-5 sm:p-6 shadow-sm relative overflow-hidden flex flex-col items-center text-center">
          <div
            className={`w-14 h-14 rounded-xl flex items-center justify-center shadow-md mb-3 text-white ${
              isPerfect
                ? 'bg-gradient-to-tr from-emerald-600 to-teal-400 shadow-emerald-500/20'
                : 'bg-gradient-to-tr from-[#2563EB] to-[#60A5FA] shadow-blue-500/20'
            }`}
          >
            <Award className="w-8 h-8" />
          </div>

          <span className="text-[10px] font-bold text-[#2563EB] uppercase tracking-widest mb-1">
            Official Hrilosopah Achievement
          </span>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 mb-1.5">
            {quizDetails?.quizTitle || 'Quiz Knowledge Verification'}
          </h1>
          <p className="text-xs text-slate-500 max-w-md leading-relaxed">
            Issued to <span className="text-slate-900 font-bold">Verified Learner</span> for
            completing {actualScore} of {totalQs} questions correctly ({accuracyPct}% accuracy).
          </p>
        </div>

        {/* Score Overview Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <div className="bg-white border border-blue-100 rounded-xl p-3 text-center shadow-sm">
            <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Score</span>
            <span className="text-xl font-black text-[#2563EB]">{accuracyPct}%</span>
          </div>
          <div className="bg-white border border-blue-100 rounded-xl p-3 text-center shadow-sm">
            <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
              Accuracy
            </span>
            <span className="text-xl font-black text-[#2563EB]">
              {actualScore} / {totalQs} Correct
            </span>
          </div>
          <div className="bg-white border border-blue-100 rounded-xl p-3 text-center shadow-sm">
            <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1 flex items-center justify-center gap-1">
              <Clock className="w-3 h-3 text-slate-400" />
              Time Spent
            </span>
            <span className="text-xl font-black text-[#2563EB]">{timeSpentText}</span>
          </div>
          <div className="bg-white border border-blue-100 rounded-xl p-3 text-center shadow-sm">
            <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
              Points
            </span>
            <span className="text-xl font-black text-[#2563EB]">
              {totalPoints.toLocaleString()} pts
            </span>
          </div>
        </div>

        {/* Question-by-Question Detailed Breakdown */}
        <div className="bg-white border border-blue-100 rounded-xl p-5 sm:p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-3.5">
            <div>
              <h3 className="text-sm sm:text-base font-extrabold text-slate-900 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#2563EB]" />
                Full Question Answers & Explanations
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Detailed view of all questions, options, your choices, and explanation notes
              </p>
            </div>
            <span className="px-2.5 py-1 bg-blue-50 text-[#2563EB] text-[10px] font-bold rounded-full border border-blue-100">
              {evaluatedQuestions.length} Questions
            </span>
          </div>

          <div className="space-y-4">
            {evaluatedQuestions.map((q, idx) => {
              const isCollapsed = expandedQuestion !== null && expandedQuestion !== idx;

              return (
                <div
                  key={q.id || idx}
                  className={`border rounded-2xl overflow-hidden transition-all ${
                    q.isCorrect
                      ? 'border-emerald-200 bg-emerald-50/10'
                      : 'border-rose-200 bg-rose-50/10'
                  }`}
                >
                  <button
                    onClick={() => setExpandedQuestion(isCollapsed ? idx : null)}
                    className="w-full p-4 text-left flex items-start justify-between gap-3 hover:bg-slate-50/80 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs ${
                          q.isCorrect
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-rose-100 text-rose-700'
                        }`}
                      >
                        {q.isCorrect ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <XCircle className="w-4 h-4 text-rose-600" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            Question {idx + 1}
                          </span>
                          <span
                            className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full ${
                              q.isCorrect
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {q.isCorrect ? '✓ Correct' : '✗ Incorrect'}
                          </span>
                        </div>
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                          {q.text}
                        </h4>
                      </div>
                    </div>
                    {isCollapsed ? (
                      <ChevronDown className="w-4 h-4 text-slate-400 shrink-0 mt-1" />
                    ) : (
                      <ChevronUp className="w-4 h-4 text-slate-400 shrink-0 mt-1" />
                    )}
                  </button>

                  {!isCollapsed && (
                    <div className="px-4 pb-4 pt-2 border-t border-slate-100 bg-white space-y-3.5 text-xs">
                      {/* Options List */}
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1.5">
                          Answer Options:
                        </span>
                        <div className="space-y-1.5">
                          {q.options.map((optText, optIdx) => {
                            const isUserSelection = q.userChosenIdx === optIdx;
                            const isCorrectOpt = q.correctOptionIndex === optIdx;

                            let optStyle = 'bg-slate-50 border-slate-200 text-slate-700';
                            if (isCorrectOpt) {
                              optStyle =
                                'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold';
                            } else if (isUserSelection && !q.isCorrect) {
                              optStyle =
                                'bg-rose-50 border-rose-300 text-rose-900 font-bold line-through';
                            }

                            return (
                              <div
                                key={optIdx}
                                className={`p-2.5 rounded-xl border text-xs flex items-center justify-between transition-colors ${optStyle}`}
                              >
                                <span className="flex items-center gap-2">
                                  <span className="font-extrabold text-[10px] opacity-60">
                                    {String.fromCharCode(65 + optIdx)}.
                                  </span>
                                  <span>{optText}</span>
                                </span>
                                <div className="flex items-center gap-1.5 shrink-0">
                                  {isUserSelection && (
                                    <span
                                      className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full ${
                                        q.isCorrect
                                          ? 'bg-emerald-200 text-emerald-900'
                                          : 'bg-rose-200 text-rose-900'
                                      }`}
                                    >
                                      Your Selection
                                    </span>
                                  )}
                                  {isCorrectOpt && (
                                    <span className="text-[9px] font-extrabold bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-full">
                                      ✓ Correct Answer
                                    </span>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Explanation Note */}
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
                          Explanation Note:
                        </span>
                        <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-100 text-slate-700 leading-relaxed text-xs">
                          {q.explanation ||
                            'This question evaluates core concepts and fundamentals.'}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Bottom Bar */}
        <div className="flex items-center gap-3">
          <Link
            href={`/${locale}/play`}
            className="flex-1 py-3.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-xl font-bold text-xs shadow-md shadow-blue-500/20 text-center transition-all active:scale-[0.98]"
          >
            Play Next Quiz
          </Link>
          <Link
            href={`/${locale}`}
            className="px-5 py-3.5 bg-white hover:bg-slate-100 text-slate-700 rounded-2xl font-bold text-xs border border-gray-200 text-center transition-colors shadow-sm"
          >
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}
