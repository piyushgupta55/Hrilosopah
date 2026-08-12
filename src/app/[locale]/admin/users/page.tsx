'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  Shield,
  Users,
  Search,
  Mail,
  Filter,
  Eye,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  UserCheck,
  UserX,
  Zap,
  Flame,
  Globe,
} from 'lucide-react';

export interface UserAdminItem {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  currentStreak: number;
  longestStreak: number;
  xp: number;
  language: string;
  status: 'Active' | 'Suspended' | string;
  attemptsCount: number;
}

export default function AdminUsersPage() {
  const params = useParams() || {};
  const locale = (params.locale as string) || 'en';

  const [users, setUsers] = useState<UserAdminItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  // Filters
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Pagination (25 users per page)
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 25;

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/users', { cache: 'no-store' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to fetch learners');
      setUsers(data.users || []);
    } catch (err: any) {
      console.error('Fetch learners error:', err);
      setError(err.message || 'Failed to load learners from database.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Filter logic
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' || u.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

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

  const adminNav = [
    { label: 'Overview', href: `/${locale}/admin/dashboard`, active: false },
    { label: 'Quizzes', href: `/${locale}/admin/quizzes`, active: false },
    { label: 'Learners & Moderation', href: `/${locale}/admin/users`, active: true },
    { label: 'Payments ($1)', href: `/${locale}/admin/payments`, active: false },
  ];

  return (
    <div className="w-full min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-sans">
      {/* Header */}
      <header className="w-full border-b border-blue-100 bg-white/95 backdrop-blur-lg px-4 sm:px-8 py-4 flex items-center justify-between sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-center text-[#2563EB]">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-black text-base sm:text-lg text-slate-900">
              Learner Moderation & Support
            </h1>
            <span className="text-[11px] text-slate-500 font-semibold">
              Manage platform learners, streaks & account statuses
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={fetchUsers}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
            title="Refresh Users List"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
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

        {/* Filter Controls Bar */}
        <div className="bg-white border border-blue-100 rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Search Bar */}
            <div className="relative sm:col-span-2">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search learner by name or email..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#2563EB]"
              />
            </div>

            {/* Status Dropdown Filter */}
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 font-medium focus:outline-none focus:border-[#2563EB] appearance-none"
              >
                <option value="all">All Account Statuses</option>
                <option value="active">Active Only</option>
                <option value="suspended">Suspended Only</option>
              </select>
              <Filter className="w-3.5 h-3.5 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* User Table Card */}
        <div className="bg-white border border-blue-100 rounded-2xl overflow-hidden shadow-sm">
          {/* Table Header Summary */}
          <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
              <Users className="w-4 h-4 text-[#2563EB]" />
              <span>Learners Directory</span>
              <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                {filteredUsers.length} total
              </span>
            </h3>
            <span className="text-xs text-slate-400 font-medium hidden sm:inline">
              Page {currentPage} of {totalPages}
            </span>
          </div>

          {/* Loading Skeleton */}
          {loading ? (
            <div className="p-8 space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-12 bg-slate-100 animate-pulse rounded-xl" />
              ))}
            </div>
          ) : error ? (
            <div className="p-8 text-center text-red-600 font-semibold text-sm">{error}</div>
          ) : filteredUsers.length === 0 ? (
            /* Empty State */
            <div className="p-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#2563EB] flex items-center justify-center mx-auto border border-blue-100">
                <Users className="w-6 h-6" />
              </div>
              <h4 className="font-extrabold text-slate-900 text-base">No Learners Found</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                No users match your search query or filter criteria. Try clearing search parameters.
              </p>
            </div>
          ) : (
            /* Main Table & Mobile Cards */
            <div className="space-y-4">
              {/* Mobile Cards (Visible on screens < md) */}
              <div className="block md:hidden divide-y divide-slate-100">
                {paginatedUsers.map((u) => (
                  <div
                    key={u.id}
                    className="p-4 space-y-3 bg-white hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-[#2563EB] font-black text-sm shrink-0">
                          {(u.name || 'L').charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <span className="block text-slate-900 font-extrabold text-sm">
                            {u.name}
                          </span>
                          <span className="text-xs text-slate-500 font-normal flex items-center gap-1">
                            <Mail className="w-3 h-3 text-slate-400" />
                            {u.email}
                          </span>
                        </div>
                      </div>

                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border shrink-0 inline-flex items-center gap-1 ${
                          u.status === 'Active'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-red-50 text-red-700 border-red-200'
                        }`}
                      >
                        {u.status === 'Active' ? (
                          <UserCheck className="w-3 h-3 text-emerald-600" />
                        ) : (
                          <UserX className="w-3 h-3 text-red-600" />
                        )}
                        <span>{u.status}</span>
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-50">
                      <div className="flex items-center gap-1 text-amber-600 font-black">
                        <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                        <span>{u.currentStreak} Days</span>
                      </div>

                      <div className="flex items-center gap-1 text-purple-600 font-black">
                        <Zap className="w-3.5 h-3.5 fill-purple-500 text-purple-500" />
                        <span>{u.xp.toLocaleString()} XP</span>
                      </div>

                      <div className="flex items-center gap-1 text-slate-500 font-medium">
                        <Globe className="w-3 h-3 text-slate-400" />
                        <span>{u.language}</span>
                      </div>
                    </div>

                    <div className="pt-2 flex items-center justify-between text-xs">
                      <span className="text-[11px] text-slate-400 font-medium">
                        Joined {formatDate(u.createdAt)}
                      </span>
                      <Link
                        href={`/${locale}/admin/users/${u.id}`}
                        className="px-3.5 py-1.5 bg-blue-50 hover:bg-[#2563EB] hover:text-white text-[#2563EB] font-extrabold text-xs rounded-xl border border-blue-100 transition-all inline-flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View Profile</span>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop Table (Visible on screens >= md) */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-slate-50 text-slate-500 uppercase font-bold border-b border-slate-100">
                    <tr>
                      <th className="p-4 sm:p-5">Name / Email</th>
                      <th className="p-4 sm:p-5">Joined Date</th>
                      <th className="p-4 sm:p-5">Streak</th>
                      <th className="p-4 sm:p-5">Total XP</th>
                      <th className="p-4 sm:p-5">Language</th>
                      <th className="p-4 sm:p-5">Status</th>
                      <th className="p-4 sm:p-5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {paginatedUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-blue-50/40 transition-colors">
                        {/* Name / Email Column */}
                        <td className="p-4 sm:p-5 font-bold text-slate-900">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-[#2563EB] font-black text-sm shrink-0">
                              {(u.name || 'L').charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <span className="block text-slate-900 font-extrabold">{u.name}</span>
                              <span className="text-xs text-slate-500 font-normal flex items-center gap-1">
                                <Mail className="w-3 h-3 text-slate-400" />
                                {u.email}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Signup Date */}
                        <td className="p-4 sm:p-5 text-slate-600 font-medium">
                          {formatDate(u.createdAt)}
                        </td>

                        {/* Current Streak */}
                        <td className="p-4 sm:p-5">
                          <div className="flex items-center gap-1 text-amber-600 font-black text-xs">
                            <Flame className="w-4 h-4 fill-amber-500 text-amber-500" />
                            <span>{u.currentStreak} Days</span>
                          </div>
                        </td>

                        {/* Total XP */}
                        <td className="p-4 sm:p-5">
                          <div className="flex items-center gap-1 text-purple-600 font-black text-xs">
                            <Zap className="w-4 h-4 fill-purple-500 text-purple-500" />
                            <span>{u.xp.toLocaleString()} XP</span>
                          </div>
                        </td>

                        {/* Language */}
                        <td className="p-4 sm:p-5 text-slate-600">
                          <div className="flex items-center gap-1">
                            <Globe className="w-3.5 h-3.5 text-slate-400" />
                            <span>{u.language}</span>
                          </div>
                        </td>

                        {/* Account Status */}
                        <td className="p-4 sm:p-5">
                          <span
                            className={`px-2.5 py-1 rounded-full text-xs font-extrabold border flex items-center gap-1 w-fit ${
                              u.status === 'Active'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : 'bg-red-50 text-red-700 border-red-200'
                            }`}
                          >
                            {u.status === 'Active' ? (
                              <UserCheck className="w-3 h-3 text-emerald-600" />
                            ) : (
                              <UserX className="w-3 h-3 text-red-600" />
                            )}
                            <span>{u.status}</span>
                          </span>
                        </td>

                        {/* View Action */}
                        <td className="p-4 sm:p-5 text-right">
                          <Link
                            href={`/${locale}/admin/users/${u.id}`}
                            className="px-3.5 py-1.5 bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-[#2563EB] font-extrabold text-xs rounded-xl border border-slate-200 transition-all inline-flex items-center gap-1"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>View Profile</span>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Pagination Bar */}
          {!loading && filteredUsers.length > 0 && totalPages > 1 && (
            <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-semibold">
                Showing {startIndex + 1} to{' '}
                {Math.min(startIndex + itemsPerPage, filteredUsers.length)} of{' '}
                {filteredUsers.length} learners
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 disabled:opacity-30 text-slate-700 font-bold transition-all"
                  title="Previous Page"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-xs font-extrabold text-slate-800 px-2">
                  {currentPage} / {totalPages}
                </span>
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 disabled:opacity-30 text-slate-700 font-bold transition-all"
                  title="Next Page"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
