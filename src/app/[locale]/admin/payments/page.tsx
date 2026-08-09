import React from 'react';
import Link from 'next/link';
import {
  Shield,
  CreditCard,
  DollarSign,
  ArrowUpRight,
  CheckCircle2,
  TrendingUp,
} from 'lucide-react';
import { prisma } from '@/lib/prisma';

export default async function AdminPaymentsPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  let dbPayments: Array<{
    id: string;
    amount: number;
    currency: string;
    status: string;
    createdAt: Date;
    attempt?: {
      email?: string | null;
      sessionId: string;
    } | null;
  }> = [];

  let totalRevenueCents = 0;
  let unlocksCount = 0;

  try {
    dbPayments = await prisma.payment.findMany({
      take: 20,
      orderBy: { createdAt: 'desc' },
      include: { attempt: true },
    });

    const aggregate = await prisma.payment.aggregate({
      _sum: { amount: true },
      _count: { id: true },
    });

    totalRevenueCents = aggregate._sum.amount || 0;
    unlocksCount = aggregate._count.id || 0;
  } catch (err) {
    console.error('Error fetching payments from DB:', err);
  }

  const revenueFormatted = `$${(totalRevenueCents / 100).toFixed(2)}`;

  return (
    <div className="w-full min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-sans">
      {/* Header */}
      <header className="w-full border-b border-blue-100 bg-white/95 backdrop-blur-lg px-4 sm:px-8 py-4 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-center text-[#2563EB]">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-black text-base sm:text-lg text-slate-900">
              Stripe Payments ($1.00 Model)
            </h1>
            <span className="text-[11px] text-slate-500 font-semibold">
              Desktop, Tablet & Mobile Financial Dashboard
            </span>
          </div>
        </div>
        <Link
          href={`/${locale}/admin/dashboard`}
          className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-blue-50 text-xs sm:text-sm font-extrabold text-slate-700 hover:text-[#2563EB] border border-slate-200 transition-colors"
        >
          Back to Dashboard
        </Link>
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-8 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="bg-white border border-blue-100 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Total Stripe Revenue
              </span>
              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#2563EB]">
                <DollarSign className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-black text-slate-900 leading-none">
              {revenueFormatted}
            </div>
            <div className="text-xs text-[#2563EB] font-bold flex items-center gap-1 mt-2">
              <TrendingUp className="w-4 h-4" />
              <span>Live Prisma DB Query</span>
            </div>
          </div>

          <div className="bg-white border border-blue-100 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                $1.00 Unlocks Sold
              </span>
              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#2563EB]">
                <CreditCard className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-black text-slate-900 leading-none">{unlocksCount}</div>
            <div className="text-xs text-[#2563EB] font-bold flex items-center gap-1 mt-2">
              <TrendingUp className="w-4 h-4" />
              <span>{unlocksCount} Paid Transactions</span>
            </div>
          </div>

          <div className="bg-white border border-blue-100 rounded-2xl p-6 shadow-sm sm:col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Certificates Issued
              </span>
              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#2563EB]">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-black text-slate-900 leading-none">{unlocksCount}</div>
            <div className="text-xs text-slate-500 font-medium mt-2">
              <span>$1.00 single plan unlocks</span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-blue-100 rounded-2xl overflow-hidden shadow-sm">
          <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-black text-sm sm:text-base text-slate-900">
              Recent Database Stripe Transactions
            </h3>
            <a
              href="https://dashboard.stripe.com"
              target="_blank"
              rel="noreferrer"
              className="text-xs sm:text-sm text-[#2563EB] font-bold flex items-center gap-1 hover:underline"
            >
              <span>View in Stripe Dashboard</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>

          {dbPayments.length === 0 ? (
            <div className="p-10 text-center text-slate-500 text-xs sm:text-sm font-semibold">
              No live payments recorded in database yet. Completed $1.00 unlocks will appear here
              automatically.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-50 text-slate-500 uppercase font-bold border-b border-gray-100">
                  <tr>
                    <th className="p-4 sm:p-5">Customer Email / Session</th>
                    <th className="p-4 sm:p-5">Plan / Product</th>
                    <th className="p-4 sm:p-5">Amount</th>
                    <th className="p-4 sm:p-5">Date</th>
                    <th className="p-4 sm:p-5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-medium">
                  {dbPayments.map((t) => (
                    <tr key={t.id} className="hover:bg-blue-50/50 transition-colors">
                      <td className="p-4 sm:p-5 font-bold text-slate-900">
                        {t.attempt?.email ||
                          `Session ${t.attempt?.sessionId?.substring(0, 12) || t.id.substring(0, 8)}...`}
                      </td>
                      <td className="p-4 sm:p-5 text-slate-600">Results & Certificate Unlock</td>
                      <td className="p-4 sm:p-5 text-[#2563EB] font-black">
                        ${(t.amount / 100).toFixed(2)}
                      </td>
                      <td className="p-4 sm:p-5 text-slate-500">
                        {new Date(t.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-4 sm:p-5">
                        <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-blue-50 text-[#2563EB] border border-blue-100 uppercase">
                          {t.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
