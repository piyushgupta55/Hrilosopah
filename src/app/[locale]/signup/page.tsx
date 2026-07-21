'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Mail,
  Lock,
  Eye,
  EyeOff,
  BrainCircuit,
  Bitcoin,
  ShieldCheck,
  User,
} from 'lucide-react';
import { AuthLayout } from '@/components/auth/AuthLayout';

export default function SignupPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Get state from onboarding if available
      let onboardingState = {};
      try {
        const stored = localStorage.getItem('hrilosopah_onboarding');
        if (stored) {
          onboardingState = JSON.parse(stored);
        }
      } catch (err) {}

      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, ...onboardingState }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Registration failed');
        setLoading(false);
        return;
      }

      // Login
      const { signIn } = await import('next-auth/react');
      const signInRes = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (signInRes?.error) {
        setError('Failed to login after registration');
        setLoading(false);
        return;
      }

      router.push('/en/profile');
    } catch (err) {
      setError('An error occurred. Please try again.');
      setLoading(false);
    }
  };

  const Header = (
    <div className="flex flex-col items-center justify-center w-full h-full pb-8">
      {/* Decorative background glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[80%] h-[80%] bg-blue-500/20 blur-3xl rounded-full" />
        <div className="absolute w-[60%] h-[60%] bg-emerald-500/10 blur-2xl rounded-full translate-x-1/4" />
      </div>

      <div className="relative flex items-center justify-center mb-8 mt-4 w-full h-32">
        {/* Brain Element */}
        <motion.div
          animate={{ y: [-5, 5, -5] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute left-[20%] w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(37,99,235,0.4)] border border-blue-400/30 z-10"
        >
          <div className="absolute inset-0 rounded-full border border-white/20" />
          <BrainCircuit className="w-12 h-12 text-white" />
        </motion.div>

        {/* H Coin Element */}
        <motion.div
          animate={{ y: [5, -5, 5], rotate: [0, 5, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute z-20 w-28 h-28 bg-gradient-to-tr from-gray-200 to-white rounded-full flex items-center justify-center shadow-2xl border-4 border-white/90"
        >
          <span className="text-4xl font-black text-gray-800">H</span>
        </motion.div>

        {/* Ethereum Element */}
        <motion.div
          animate={{ y: [-8, 8, -8] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute right-[20%] w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.4)] border border-emerald-300/30 z-10"
        >
          <div className="absolute inset-0 rounded-full border border-white/20" />
          <svg className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="currentColor">
            <path d="M11.944 17.97L4.58 13.62 11.943 24l7.37-10.38-7.372 4.35h.003zM12.056 0L4.69 12.22l7.365 4.354 7.365-4.35L12.056 0z" />
          </svg>
        </motion.div>
      </div>

      <div className="flex items-center gap-2 mb-2 z-10">
        <div className="w-8 h-8 bg-white text-black rounded-full flex items-center justify-center font-bold text-xl leading-none">
          H
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Hrilosopah</h1>
      </div>
      <p className="text-white/80 font-medium text-[15px] z-10 tracking-wide">
        Master <span className="text-blue-400 font-bold">AI</span> &{' '}
        <span className="text-emerald-400 font-bold">Crypto</span> Knowledge
      </p>
    </div>
  );

  return (
    <AuthLayout headerContent={Header} onBack={() => router.back()}>
      <div className="flex flex-col flex-1">
        <h2 className="text-[28px] font-extrabold text-[#111827] mb-2 tracking-tight">
          Create Account
        </h2>
        <p className="text-[#4B5563] text-[15px] leading-relaxed mb-8">
          Create an account to track your progress and unlock your personalized learning journey.
        </p>

        <form className="space-y-5" onSubmit={handleCreateAccount}>
          {error && (
            <div className="p-3 text-sm text-red-500 bg-red-50 border border-red-100 rounded-xl mb-4 text-center">
              {error}
            </div>
          )}
          <div className="space-y-1.5">
            <label className="text-[14px] font-bold text-[#111827]">Full Name</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-11 pr-4 py-4 bg-white border border-border/80 rounded-[16px] focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:outline-none transition-all placeholder:text-gray-400 text-[#111827] font-medium"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[14px] font-bold text-[#111827]">Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-11 pr-4 py-4 bg-white border border-border/80 rounded-[16px] focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:outline-none transition-all placeholder:text-gray-400 text-[#111827] font-medium"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[14px] font-bold text-[#111827]">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Create a strong password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-11 pr-12 py-4 bg-white border border-border/80 rounded-[16px] focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:outline-none transition-all placeholder:text-gray-400 text-[#111827] font-medium"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span className="text-xs text-gray-500 font-medium">
              At least 8 characters with a number and symbol
            </span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-[56px] mt-6 rounded-[16px] bg-gradient-to-r from-emerald-500 to-emerald-400 text-white font-bold text-[17px] shadow-[0_8px_20px_rgba(16,185,129,0.3)] flex items-center justify-center space-x-2 hover:opacity-90 active:scale-[0.98] transition-all group disabled:opacity-70 disabled:active:scale-100"
          >
            <span>{loading ? 'Creating...' : 'Create Account'}</span>
            {!loading && (
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            )}
          </button>
        </form>

        <div className="mt-auto pt-6 text-center text-[15px] font-medium text-gray-500">
          Already have an account?{' '}
          <Link href="/en/login" className="text-blue-600 font-bold hover:underline">
            Log in
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}
