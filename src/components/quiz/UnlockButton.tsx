'use client';

import React, { useState } from 'react';
import { Lock, ArrowRight, Loader2 } from 'lucide-react';

interface UnlockButtonProps {
  attemptId?: string;
  quizSlug?: string;
  locale?: string;
}

export const UnlockButton = ({
  attemptId,
  quizSlug = 'ai-awareness',
  locale = 'en',
}: UnlockButtonProps) => {
  const [loading, setLoading] = useState(false);

  const handleUnlock = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ attemptId, quizSlug, locale }),
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || 'Failed to initialize Stripe checkout session');
        setLoading(false);
      }
    } catch (err) {
      console.error('Checkout error:', err);
      alert('Network error. Please try again.');
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleUnlock}
      disabled={loading}
      className="w-full bg-[#4F7DFF] hover:bg-[#3B6BE8] text-white font-bold text-sm py-4 rounded-[18px] shadow-lg shadow-[#4F7DFF]/25 flex items-center justify-center gap-2 active:scale-98 transition-all disabled:opacity-50 cursor-pointer"
    >
      {loading ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : (
        <>
          <Lock className="w-4 h-4" />
          <span>Unlock Full Results • $1</span>
          <ArrowRight className="w-4 h-4 ml-1" />
        </>
      )}
    </button>
  );
};
