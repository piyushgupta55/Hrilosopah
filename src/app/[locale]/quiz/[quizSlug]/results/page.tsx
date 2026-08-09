'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ArrowLeft,
  CheckCircle2,
  Award,
  BookOpen,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
} from 'lucide-react';

export default function QuizResultsPage() {
  const params = useParams() || {};
  const locale = (params.locale as string) || 'en';

  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(0);

  const sampleQuestions = [
    {
      id: 1,
      question: 'What is the primary function of a Transformer architecture in AI?',
      userAnswer: 'Processing sequential data with self-attention mechanisms',
      correctAnswer: 'Processing sequential data with self-attention mechanisms',
      isCorrect: true,
      explanation:
        'Transformers use self-attention mechanisms to weigh the significance of different words in a sequence simultaneously, making them faster and more effective than traditional RNNs.',
      topic: 'AI Fundamentals',
    },
    {
      id: 2,
      question: 'Which component ensures immutability in a blockchain ledger?',
      userAnswer: 'Cryptographic hashing and consensus algorithms',
      correctAnswer: 'Cryptographic hashing and consensus algorithms',
      isCorrect: true,
      explanation:
        'Each block contains a cryptographic hash of the previous block. Modifying any past transaction invalidates all subsequent block hashes across network nodes.',
      topic: 'Blockchain Architecture',
    },
    {
      id: 3,
      question: 'What is a Zero-Knowledge Proof (ZKP)?',
      userAnswer: 'A method to prove a statement is true without revealing extra information',
      correctAnswer: 'A method to prove a statement is true without revealing extra information',
      isCorrect: true,
      explanation:
        'Zero-Knowledge Proofs allow one party (the prover) to prove to another party (the verifier) that a statement is true without disclosing any information beyond the statement validity itself.',
      topic: 'Cryptography',
    },
    {
      id: 4,
      question: 'What is the key difference between Supervised and Unsupervised Learning?',
      userAnswer:
        'Supervised uses labeled datasets, unsupervised finds hidden patterns in unlabeled data',
      correctAnswer:
        'Supervised uses labeled datasets, unsupervised finds hidden patterns in unlabeled data',
      isCorrect: true,
      explanation:
        'Supervised learning relies on ground-truth target labels to train models, whereas unsupervised algorithms discover inherent clusterings and representations in unlabeled data.',
      topic: 'Machine Learning',
    },
    {
      id: 5,
      question: 'What is the function of a Smart Contract on Ethereum?',
      userAnswer: 'Self-executing code stored on the blockchain that runs when conditions are met',
      correctAnswer:
        'Self-executing code stored on the blockchain that runs when conditions are met',
      isCorrect: true,
      explanation:
        'Smart contracts are deterministic programs stored on Ethereum Virtual Machine (EVM) nodes that execute automatically without intermediaries.',
      topic: 'Ethereum & Web3',
    },
    {
      id: 6,
      question: 'What does RLHF stand for in AI language model training?',
      userAnswer: 'Reinforcement Learning from Human Feedback',
      correctAnswer: 'Reinforcement Learning from Human Feedback',
      isCorrect: true,
      explanation:
        'RLHF aligns language model responses with human preferences by training reward models based on human evaluators’ rankings.',
      topic: 'LLM Fine-tuning',
    },
    {
      id: 7,
      question: 'What is the Bitcoin halving event?',
      userAnswer: 'A 50% reduction in the block reward granted to miners every 210,000 blocks',
      correctAnswer: 'A 50% reduction in the block reward granted to miners every 210,000 blocks',
      isCorrect: true,
      explanation:
        'Occurring approximately every 4 years, halving controls Bitcoin token issuance and enforces its hard cap of 21 million BTC.',
      topic: 'Bitcoin Economics',
    },
    {
      id: 8,
      question: 'What is the purpose of Retrieval-Augmented Generation (RAG)?',
      userAnswer: 'Enhancing LLM responses with external real-time data knowledge bases',
      correctAnswer: 'Enhancing LLM responses with external real-time data knowledge bases',
      isCorrect: true,
      explanation:
        'RAG combines vector database searches with generative LLMs to provide accurate, up-to-date answers grounded in private data.',
      topic: 'AI Systems',
    },
    {
      id: 9,
      question: 'What is Layer-2 scaling in blockchain technology?',
      userAnswer: 'A secondary protocol built on top of Layer-1 to increase transaction throughput',
      correctAnswer:
        'A secondary protocol built on top of Layer-1 to increase transaction throughput',
      isCorrect: true,
      explanation:
        'Layer-2 networks like Arbitrum, Optimism, and Lightning process transactions off-chain to reduce fees while inheriting mainnet security.',
      topic: 'Scalability',
    },
    {
      id: 10,
      question: 'What is a Convolutional Neural Network (CNN) primarily used for?',
      userAnswer: 'Computer vision, image recognition, and visual pattern recognition',
      correctAnswer: 'Computer vision, image recognition, and visual pattern recognition',
      isCorrect: true,
      explanation:
        'CNNs utilize spatial feature extraction kernels to identify patterns like edges, textures, and objects in image data.',
      topic: 'Computer Vision',
    },
    {
      id: 11,
      question: 'What is the role of Proof of Stake (PoS) consensus?',
      userAnswer:
        'Validating block creation based on validator staked collateral rather than computation',
      correctAnswer:
        'Validating block creation based on validator staked collateral rather than computation',
      isCorrect: true,
      explanation:
        'PoS reduces network energy consumption by over 99% compared to PoW by selecting block creators proportional to their staked tokens.',
      topic: 'Consensus Mechanisms',
    },
    {
      id: 12,
      question: 'What is a Vector Database in modern AI stack?',
      userAnswer:
        'A database optimized for storing and querying high-dimensional embedding vectors',
      correctAnswer:
        'A database optimized for storing and querying high-dimensional embedding vectors',
      isCorrect: true,
      explanation:
        'Vector databases enable semantic similarity search across unstructured data such as text, images, and audio embeddings.',
      topic: 'AI Infrastructure',
    },
    {
      id: 13,
      question: 'What is Decentralized Finance (DeFi)?',
      userAnswer: 'Financial services operating on peer-to-peer smart contracts without banks',
      correctAnswer: 'Financial services operating on peer-to-peer smart contracts without banks',
      isCorrect: true,
      explanation:
        'DeFi enables lending, borrowing, trading, and yield generation via transparent smart contract protocols.',
      topic: 'DeFi Applications',
    },
    {
      id: 14,
      question: 'What is Overfitting in machine learning model development?',
      userAnswer: 'When a model learns training noise and performs poorly on unseen data',
      correctAnswer: 'When a model learns training noise and performs poorly on unseen data',
      isCorrect: true,
      explanation:
        'Overfitting occurs when a model fits training samples too tightly, losing generalization capability on validation datasets.',
      topic: 'Model Optimization',
    },
    {
      id: 15,
      question: 'What is a Non-Fungible Token (NFT)?',
      userAnswer: 'A unique digital asset token representing ownership of a specific item',
      correctAnswer: 'A unique digital asset token representing ownership of a specific item',
      isCorrect: true,
      explanation:
        'Unlike fungible cryptocurrencies, each NFT possesses unique metadata and token IDs certifying verifiable digital ownership.',
      topic: 'Digital Assets',
    },
  ];

  return (
    <div className="min-h-screen w-full bg-[#F8FAFC] text-slate-900 flex flex-col font-sans relative overflow-x-hidden">
      {/* Header */}
      <header className="w-full border-b border-blue-100 bg-white/90 backdrop-blur-lg px-6 py-4 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <Link
          href={`/${locale}`}
          className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors text-xs font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Home</span>
        </Link>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-blue-50 text-[#2563EB] border border-blue-200 text-[11px] font-bold rounded-full">
            Verified Pass
          </span>
        </div>
      </header>

      <div className="flex-1 max-w-3xl w-full mx-auto p-5 space-y-4 pb-14">
        {/* Certificate Hero Badge */}
        <div className="w-full bg-white border border-blue-100 rounded-xl p-5 sm:p-6 shadow-sm relative overflow-hidden flex flex-col items-center text-center">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-tr from-[#2563EB] to-[#60A5FA] flex items-center justify-center shadow-md shadow-blue-500/20 mb-3 text-white">
            <Award className="w-8 h-8" />
          </div>

          <span className="text-[10px] font-bold text-[#2563EB] uppercase tracking-widest mb-1">
            Official Hrilosopah Achievement
          </span>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 mb-1.5">
            AI & Crypto Knowledge Verification
          </h1>
          <p className="text-xs text-slate-500 max-w-md mb-3.5 leading-relaxed">
            Issued to <span className="text-slate-900 font-bold">Verified Learner</span> for
            completing all 15 questions with 100% accuracy.
          </p>

          <div className="flex items-center gap-3 text-xs font-semibold text-slate-700 bg-blue-50/80 border border-blue-100 px-4 py-2 rounded-xl">
            <ShieldCheck className="w-4 h-4 text-[#2563EB]" />
            <span>Certificate ID: HRL-{Date.now().toString().slice(-6)}</span>
            <span className="text-[#2563EB] font-bold">• Verified</span>
          </div>
        </div>

        {/* Score Overview Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <div className="bg-white border border-blue-100 rounded-xl p-3 text-center shadow-sm">
            <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Score</span>
            <span className="text-xl font-black text-[#2563EB]">100%</span>
          </div>
          <div className="bg-white border border-blue-100 rounded-xl p-3 text-center shadow-sm">
            <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
              Accuracy
            </span>
            <span className="text-xl font-black text-[#2563EB]">15 / 15 Correct</span>
          </div>
          <div className="bg-white border border-blue-100 rounded-xl p-3 text-center shadow-sm">
            <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
              Time Spent
            </span>
            <span className="text-xl font-black text-[#2563EB]">4m 12s</span>
          </div>
          <div className="bg-white border border-blue-100 rounded-xl p-3 text-center shadow-sm">
            <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
              Points
            </span>
            <span className="text-xl font-black text-[#2563EB]">1,500 pts</span>
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
                Review all 15 questions, correct answers, and explanations
              </p>
            </div>
            <span className="px-2.5 py-1 bg-blue-50 text-[#2563EB] text-[10px] font-bold rounded-full border border-blue-100">
              15 Questions
            </span>
          </div>

          <div className="space-y-3">
            {sampleQuestions.map((q, idx) => {
              const isExpanded = expandedQuestion === idx;
              return (
                <div
                  key={q.id}
                  className="border border-blue-100 rounded-2xl overflow-hidden bg-[#FAFCFF] transition-colors"
                >
                  <button
                    onClick={() => setExpandedQuestion(isExpanded ? null : idx)}
                    className="w-full p-4 text-left flex items-start justify-between gap-3 hover:bg-blue-50/50 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-7 h-7 rounded-full bg-blue-100 text-[#2563EB] flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                        <CheckCircle2 className="w-4 h-4 text-[#2563EB]" />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                          Question {idx + 1} • {q.topic}
                        </span>
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                          {q.question}
                        </h4>
                      </div>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-slate-400 shrink-0 mt-1" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400 shrink-0 mt-1" />
                    )}
                  </button>

                  {isExpanded && (
                    <div className="px-4 pb-4 pt-1 border-t border-blue-50 bg-white space-y-3 text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
                          Your Answer & Correct Option:
                        </span>
                        <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-[#1E40AF] font-semibold">
                          ✓ {q.correctAnswer}
                        </div>
                      </div>

                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
                          Explanation:
                        </span>
                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 leading-relaxed">
                          {q.explanation}
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
