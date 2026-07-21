'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { AuthLayout } from '@/components/auth/AuthLayout';

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { signIn } = await import('next-auth/react');
      const res = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {
        setError('Invalid email or password');
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
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-60">
        <div className="w-[80%] h-[80%] bg-blue-600/30 blur-[100px] rounded-full translate-y-10" />
      </div>

      <div className="relative z-10 flex flex-col items-center">
        <div className="w-20 h-20 bg-gradient-to-tr from-gray-300 to-white rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(255,255,255,0.2)] border-[5px] border-white/10 mb-4">
          <span className="text-4xl font-black text-gray-900 tracking-tighter">H</span>
        </div>

        <h1 className="text-4xl font-bold text-white tracking-tight mb-2">Hrilosopah</h1>

        <p className="text-white/90 font-medium text-[16px] tracking-wide">
          <span className="text-blue-400">Learn.</span>{' '}
          <span className="text-emerald-400">Quiz.</span>{' '}
          <span className="text-green-400">Grow.</span> Repeat.
        </p>
      </div>
    </div>
  );

  return (
    <AuthLayout headerContent={Header} onBack={() => router.back()}>
      <div className="flex flex-col flex-1">
        <h2 className="text-[28px] font-extrabold text-[#111827] mb-2 tracking-tight">
          Welcome Back
        </h2>
        <p className="text-[#4B5563] text-[15px] leading-relaxed mb-8">
          Log in to continue your learning journey.
        </p>

        <form className="space-y-5" onSubmit={handleLogin}>
          {error && (
            <div className="p-3 text-sm text-red-500 bg-red-50 border border-red-100 rounded-xl mb-4 text-center">
              {error}
            </div>
          )}
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
                placeholder="Enter your password"
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

          <div className="flex items-center justify-between mt-2">
            <label className="flex items-center gap-2 cursor-pointer group">
              <div
                className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${rememberMe ? 'bg-blue-600 border-blue-600' : 'bg-white border-gray-300 group-hover:border-blue-500'}`}
              >
                {rememberMe && (
                  <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 14 14" fill="none">
                    <path
                      d="M11.6666 3.5L5.24992 9.91667L2.33325 7"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </div>
              <input
                type="checkbox"
                className="hidden"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
              />
              <span className="text-[13px] font-medium text-gray-600">Remember me</span>
            </label>

            <button type="button" className="text-[13px] font-bold text-blue-600 hover:underline">
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-[56px] mt-6 rounded-[16px] bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold text-[17px] shadow-[0_8px_20px_rgba(37,99,235,0.3)] flex items-center justify-center space-x-2 hover:opacity-90 active:scale-[0.98] transition-all group disabled:opacity-70 disabled:active:scale-100"
          >
            <span>{loading ? 'Logging in...' : 'Log In'}</span>
            {!loading && (
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            )}
          </button>
        </form>

        <div className="mt-auto pt-6 text-center text-[15px] font-medium text-gray-500">
          Don&apos;t have an account?{' '}
          <Link href="/en/signup" className="text-blue-600 font-bold hover:underline">
            Sign up
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}
