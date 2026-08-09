'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import {
  ShieldCheck,
  Zap,
  Check,
  Award,
  ArrowLeft,
  Loader2,
  CheckCircle2,
  FileText,
  HelpCircle,
  Lock,
} from 'lucide-react';
import { BottomNav } from '@/components/home/BottomNav';

export default function PricingPage() {
  const params = useParams() || {};
  const searchParams = useSearchParams();
  const locale = (params.locale as string) || 'en';

  const [loading, setLoading] = useState(false);
  const isSuccess = searchParams.get('payment') === 'success';

  const handleCheckout = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quizSlug: 'ai-awareness', locale }),
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || 'Failed to initialize checkout');
        setLoading(false);
      }
    } catch (err) {
      console.error('Checkout error:', err);
      alert('Network error. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen w-full bg-[#0B0D12] text-white flex flex-col font-sans relative overflow-x-hidden"
      style={{ paddingBottom: 'calc(5.5rem + env(safe-area-inset-bottom))' }}
    >
      {/* Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header */}
      <header className="w-full border-b border-white/10 bg-[#161B26]/80 backdrop-blur-lg px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <Link
          href={`/${locale}`}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-xs font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
        <div className="flex items-center gap-1.5 px-3 py-1 bg-blue-500/10 border border-blue-500/30 text-blue-400 rounded-full text-[11px] font-bold">
          <span>Pay Per Quiz Result</span>
        </div>
      </header>

      <div className="flex-1 max-w-2xl w-full mx-auto px-5 pt-8 pb-12 flex flex-col items-center">
        {/* Payment Success Banner */}
        {isSuccess && (
          <div className="w-full mb-8 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 shrink-0" />
            <div>
              <h4 className="font-bold text-sm">Payment Successful!</h4>
              <p className="text-xs text-emerald-300/80">
                Your full question breakdown & official certificate have been unlocked!
              </p>
            </div>
          </div>
        )}

        {/* Title */}
        <div className="text-center max-w-md mb-8">
          <span className="inline-block px-3 py-1 bg-blue-500/20 text-blue-400 text-xs font-bold rounded-full uppercase tracking-wider mb-3 border border-blue-500/30">
            Hrilosopah Single Plan
          </span>
          <h1 className="text-3xl font-extrabold text-white tracking-tight mb-3">
            Free to Play • $1 to Unlock Results
          </h1>
          <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
            Answer all questions for free. Pay just $1.00 after completion to view complete question
            answers, explanations, and get your official certificate!
          </p>
        </div>

        {/* Single Plan Card */}
        <div className="w-full bg-[#161B26] border-2 border-blue-500/50 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Award className="w-6 h-6 text-amber-400" />
              <h3 className="font-extrabold text-xl text-white">Full Quiz Result Pass</h3>
            </div>
            <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-[11px] font-black uppercase rounded-full border border-emerald-500/30">
              Only $1.00
            </span>
          </div>

          <div className="flex items-baseline gap-1 mb-6">
            <span className="text-5xl font-black text-white">$1.00</span>
            <span className="text-xs text-gray-400 font-semibold">/ completed quiz</span>
          </div>

          {/* Features */}
          <div className="space-y-3.5 mb-8">
            {[
              'Complete 100% of all Quiz Questions for FREE',
              'Unlock correct answers & step-by-step explanations for every question',
              'View performance score breakdown and topic strength insights',
              'Download official Hrilosopah PDF Certificate with unique verification code',
              'Secure instant payment via Stripe Checkout',
            ].map((feature, i) => (
              <div key={i} className="flex items-start gap-3 text-xs text-gray-200">
                <Check className="w-4.5 h-4.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>{feature}</span>
              </div>
            ))}
          </div>

          <button
            onClick={handleCheckout}
            disabled={loading}
            className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-extrabold text-sm shadow-xl shadow-blue-600/30 flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Lock className="w-4 h-4" />
                <span>Unlock Full Results Now • $1.00</span>
              </>
            )}
          </button>
        </div>

        {/* Security Trust */}
        <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Encrypted & Secured by Stripe Payment Gateway</span>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
