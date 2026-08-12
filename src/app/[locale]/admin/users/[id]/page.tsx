'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  Shield,
  ArrowLeft,
  User,
  Mail,
  Calendar,
  Globe,
  Flame,
  Zap,
  Award,
  Clock,
  Target,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  UserX,
  UserCheck,
  Loader2,
  BookOpen,
  Phone,
} from 'lucide-react';

interface UserDetailData {
  id: string;
  name: string;
  email: string;
  username: string;
  phone: string;
  createdAt: string;
  status: 'Active' | 'Suspended';
  language: string;
  experience: string;
  goal: string;
  interests: string;
  currentStreak: number;
  longestStreak: number;
  xp: number;
  stats: {
    totalQuizzesCompleted: number;
    accuracyPct: number;
    totalTimeSpentSeconds: number;
  };
  badges: Array<{
    id: string;
    name: string;
    icon: string;
    description: string;
  }>;
  recentAttempts: Array<{
    id: string;
    quizTitle: string;
    quizSlug: string;
    score: number;
    totalQuestions: number;
    startedAt: string;
    completedAt: string | null;
  }>;
}

export default function AdminUserDetailPage() {
  const params = useParams() || {};
  const router = useRouter();
  const locale = (params.locale as string) || 'en';
  const userId = params.id as string;

  const [user, setUser] = useState<UserDetailData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  // Modals & Action States
  const [showResetStreakModal, setShowResetStreakModal] = useState<boolean>(false);
  const [newStreakValue, setNewStreakValue] = useState<number>(0);
  const [resetStreakLoading, setResetStreakLoading] = useState<boolean>(false);

  const [showStatusModal, setShowStatusModal] = useState<boolean>(false);
  const [statusLoading, setStatusLoading] = useState<boolean>(false);

  const fetchUserDetails = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/admin/users?id=${userId}`, { cache: 'no-store' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to load learner details.');
      setUser(data.user);
      setNewStreakValue(data.user.currentStreak || 0);
    } catch (err: any) {
      console.error('Fetch user detail error:', err);
      setError(err.message || 'Learner record not found.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) fetchUserDetails();
  }, [userId]);

  // Reset streak handler
  const handleConfirmResetStreak = async () => {
    if (!user) return;
    setResetStreakLoading(true);
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: user.id,
          action: 'reset_streak',
          streak: newStreakValue,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update streak.');

      setUser((prev) => (prev ? { ...prev, currentStreak: newStreakValue } : prev));
      setShowResetStreakModal(false);
    } catch (err: any) {
      alert(err.message || 'Error updating streak');
    } finally {
      setResetStreakLoading(false);
    }
  };

  // Toggle account status (Active / Suspended)
  const handleToggleStatus = async () => {
    if (!user) return;
    setStatusLoading(true);
    const targetStatus = user.status === 'Active' ? 'Suspended' : 'Active';

    try {
      const res = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: user.id,
          action: 'update_status',
          status: targetStatus,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update account status.');

      setUser((prev) => (prev ? { ...prev, status: targetStatus } : prev));
      setShowStatusModal(false);
    } catch (err: any) {
      alert(err.message || 'Error toggling account status');
    } finally {
      setStatusLoading(false);
    }
  };

  const formatTimeSpent = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    const mins = Math.floor(seconds / 60);
    const hrs = (mins / 60).toFixed(1);
    return mins > 60 ? `${hrs} hrs` : `${mins} mins`;
  };

  const formatDate = (isoString: string) => {
    try {
      return new Date(isoString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return isoString;
    }
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6">
        <div className="flex items-center gap-3 bg-white px-6 py-4 rounded-2xl border border-blue-100 shadow-sm text-slate-700 font-extrabold text-sm">
          <Loader2 className="w-5 h-5 text-[#2563EB] animate-spin" />
          <span>Loading learner profile...</span>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="w-full min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6">
        <div className="bg-white p-6 rounded-2xl border border-red-200 shadow-sm text-center space-y-3 max-w-md">
          <div className="w-12 h-12 bg-red-50 text-red-600 rounded-xl flex items-center justify-center mx-auto border border-red-100">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h2 className="font-extrabold text-slate-900 text-base">Learner Profile Error</h2>
          <p className="text-xs text-slate-600 font-medium">{error || 'Learner not found'}</p>
          <Link
            href={`/${locale}/admin/users`}
            className="inline-block px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl"
          >
            Back to Learners List
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-sans">
      {/* Header */}
      <header className="w-full border-b border-blue-100 bg-white/95 backdrop-blur-lg px-4 sm:px-8 py-4 flex items-center justify-between sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-3">
          <Link
            href={`/${locale}/admin/users`}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            title="Back to Learners List"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="w-10 h-10 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-center text-[#2563EB] shrink-0 font-black text-base">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="font-black text-base sm:text-lg text-slate-900">{user.name}</h1>
            <span className="text-[11px] text-slate-500 font-semibold">{user.email}</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => setShowResetStreakModal(true)}
            className="px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 font-extrabold text-xs sm:text-sm flex items-center gap-1.5 transition-all shadow-sm"
          >
            <RotateCcw className="w-4 h-4 text-amber-600" />
            <span>Reset Streak</span>
          </button>

          <button
            type="button"
            onClick={() => setShowStatusModal(true)}
            className={`px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl font-extrabold text-xs sm:text-sm flex items-center gap-1.5 transition-all shadow-sm border ${
              user.status === 'Active'
                ? 'bg-red-50 hover:bg-red-100 border-red-200 text-red-700'
                : 'bg-emerald-50 hover:bg-emerald-100 border-emerald-200 text-emerald-700'
            }`}
          >
            {user.status === 'Active' ? (
              <>
                <UserX className="w-4 h-4" />
                <span>Suspend Account</span>
              </>
            ) : (
              <>
                <UserCheck className="w-4 h-4" />
                <span>Reactivate Account</span>
              </>
            )}
          </button>
        </div>
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-8 space-y-6">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 border-b border-gray-200 pb-3 text-xs font-bold text-slate-600">
          <Link href={`/${locale}/admin/dashboard`} className="hover:text-[#2563EB]">
            Dashboard
          </Link>
          <span className="text-slate-400">/</span>
          <Link href={`/${locale}/admin/users`} className="hover:text-[#2563EB]">
            Learners & Moderation
          </Link>
          <span className="text-slate-400">/</span>
          <span className="text-blue-600 font-extrabold">{user.name}</span>
        </div>

        {/* TOP ROW: Profile Overview & Quick Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Overview Card */}
          <div className="bg-white border border-blue-100 rounded-2xl p-6 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h2 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                <User className="w-5 h-5 text-[#2563EB]" />
                <span>Profile Info</span>
              </h2>
              <span
                className={`px-3 py-1 rounded-full text-xs font-extrabold border ${
                  user.status === 'Active'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-red-50 text-red-700 border-red-200'
                }`}
              >
                {user.status}
              </span>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="flex items-center justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500 font-medium flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" /> Email Address
                </span>
                <span className="font-bold text-slate-900">{user.email}</span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500 font-medium flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" /> Joined Date
                </span>
                <span className="font-bold text-slate-900">{formatDate(user.createdAt)}</span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500 font-medium flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-slate-400" /> Preferred Language
                </span>
                <span className="font-bold text-slate-900">{user.language}</span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500 font-medium flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5 text-slate-400" /> Experience Level
                </span>
                <span className="font-bold text-slate-900 capitalize">{user.experience}</span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500 font-medium flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-slate-400" /> Learning Goal
                </span>
                <span className="font-bold text-slate-900">{user.goal}</span>
              </div>
            </div>
          </div>

          {/* Learning Stats Grid */}
          <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="bg-white border border-blue-100 rounded-2xl p-5 shadow-sm space-y-1">
              <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                <BookOpen className="w-4 h-4 text-blue-500" /> Quizzes Completed
              </span>
              <p className="text-2xl font-black text-slate-900">
                {user.stats.totalQuizzesCompleted}
              </p>
            </div>

            <div className="bg-white border border-blue-100 rounded-2xl p-5 shadow-sm space-y-1">
              <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                <Target className="w-4 h-4 text-emerald-500" /> Accuracy Rate
              </span>
              <p className="text-2xl font-black text-slate-900">{user.stats.accuracyPct}%</p>
            </div>

            <div className="bg-white border border-blue-100 rounded-2xl p-5 shadow-sm space-y-1">
              <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                <Clock className="w-4 h-4 text-purple-500" /> Total Time Spent
              </span>
              <p className="text-2xl font-black text-slate-900">
                {formatTimeSpent(user.stats.totalTimeSpentSeconds)}
              </p>
            </div>

            <div className="bg-white border border-amber-100 rounded-2xl p-5 shadow-sm space-y-1">
              <span className="text-xs font-bold text-amber-600 flex items-center gap-1">
                <Flame className="w-4 h-4 text-amber-500 fill-amber-500" /> Current Streak
              </span>
              <p className="text-2xl font-black text-amber-600">{user.currentStreak} Days</p>
            </div>

            <div className="bg-white border border-amber-100 rounded-2xl p-5 shadow-sm space-y-1">
              <span className="text-xs font-bold text-amber-600 flex items-center gap-1">
                <Flame className="w-4 h-4 text-amber-400" /> Longest Streak
              </span>
              <p className="text-2xl font-black text-slate-900">{user.longestStreak} Days</p>
            </div>

            <div className="bg-white border border-purple-100 rounded-2xl p-5 shadow-sm space-y-1">
              <span className="text-xs font-bold text-purple-600 flex items-center gap-1">
                <Zap className="w-4 h-4 text-purple-500 fill-purple-500" /> Total XP
              </span>
              <p className="text-2xl font-black text-purple-600">{user.xp.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* MIDDLE ROW: Achievement Badges */}
        <section className="bg-white border border-blue-100 rounded-2xl p-6 shadow-sm space-y-4">
          <h2 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
            <Award className="w-5 h-5 text-[#2563EB]" />
            <span>Earned Achievement Badges</span>
          </h2>

          {user.badges.length === 0 ? (
            <p className="text-xs text-slate-500 italic">No achievement badges unlocked yet.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {user.badges.map((b) => (
                <div
                  key={b.id}
                  className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-3"
                >
                  <span className="text-2xl">{b.icon}</span>
                  <div>
                    <h4 className="font-black text-xs text-slate-900">{b.name}</h4>
                    <p className="text-[10px] text-slate-500">{b.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* BOTTOM ROW: Recent Quiz Activity Log */}
        <section className="bg-white border border-blue-100 rounded-2xl p-6 shadow-sm space-y-4">
          <h2 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#2563EB]" />
            <span>Recent Quiz Attempts</span>
          </h2>

          {user.recentAttempts.length === 0 ? (
            <p className="text-xs text-slate-500 italic">
              No quiz attempts recorded for this learner.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase font-bold border-b border-slate-100">
                  <tr>
                    <th className="p-3 sm:p-4">Quiz Title</th>
                    <th className="p-3 sm:p-4">Score</th>
                    <th className="p-3 sm:p-4">Started At</th>
                    <th className="p-3 sm:p-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {user.recentAttempts.map((att) => (
                    <tr key={att.id} className="hover:bg-blue-50/30 transition-colors">
                      <td className="p-3 sm:p-4 font-extrabold text-slate-900">{att.quizTitle}</td>
                      <td className="p-3 sm:p-4 font-black text-slate-800">
                        {att.score} / {att.totalQuestions}
                      </td>
                      <td className="p-3 sm:p-4 text-slate-500">{formatDate(att.startedAt)}</td>
                      <td className="p-3 sm:p-4">
                        <span
                          className={`px-2 py-0.5 rounded-md font-bold text-[11px] ${
                            att.completedAt
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          {att.completedAt ? 'Completed' : 'In Progress'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>

      {/* Reset Streak Modal */}
      {showResetStreakModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl space-y-4 border border-slate-200">
            <div className="flex items-center gap-3 text-amber-600">
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center shrink-0 border border-amber-200">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-black text-slate-900 text-base">Reset Learner Streak</h3>
                <p className="text-xs text-slate-500 font-medium">Support case override</p>
              </div>
            </div>

            <p className="text-xs text-slate-600">
              Set the current streak count for <strong>{user.name}</strong>. Use this if a streak
              broke due to a platform issue.
            </p>

            <div>
              <label className="block text-xs font-extrabold text-slate-700 mb-1">
                New Streak Count (Days)
              </label>
              <input
                type="number"
                min="0"
                value={newStreakValue}
                onChange={(e) => setNewStreakValue(parseInt(e.target.value) || 0)}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:border-[#2563EB]"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowResetStreakModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmResetStreak}
                disabled={resetStreakLoading}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs rounded-xl shadow-md flex items-center gap-1.5 disabled:opacity-50"
              >
                {resetStreakLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                <span>Confirm Reset</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Suspend / Reactivate Status Confirmation Modal */}
      {showStatusModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl space-y-4 border border-slate-200">
            <div className="flex items-center gap-3 text-red-600">
              <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center shrink-0 border border-red-200">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="font-black text-slate-900 text-base">
                  {user.status === 'Active'
                    ? 'Suspend Learner Account'
                    : 'Reactivate Learner Account'}
                </h3>
                <p className="text-xs text-slate-500 font-medium">Moderation confirmation</p>
              </div>
            </div>

            <p className="text-xs text-slate-600">
              Are you sure you want to {user.status === 'Active' ? 'suspend' : 'reactivate'} account
              access for <strong>{user.name}</strong> ({user.email})?
            </p>

            <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowStatusModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleToggleStatus}
                disabled={statusLoading}
                className={`px-4 py-2 text-white font-extrabold text-xs rounded-xl shadow-md flex items-center gap-1.5 disabled:opacity-50 ${
                  user.status === 'Active'
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-emerald-600 hover:bg-emerald-700'
                }`}
              >
                {statusLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                <span>
                  {statusLoading
                    ? 'Updating...'
                    : user.status === 'Active'
                      ? 'Suspend Account'
                      : 'Reactivate Account'}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
