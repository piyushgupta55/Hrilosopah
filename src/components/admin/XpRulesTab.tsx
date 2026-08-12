'use client';

import React, { useState, useEffect } from 'react';
import {
  Zap,
  Save,
  RotateCcw,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Flame,
  Clock,
  Award,
} from 'lucide-react';

export interface XpConfigItem {
  id: string;
  baseXpPerCorrect: number;
  speedBonusMultiplier: number;
  accuracyBonus100: number;
  streakMultiplierPerDay: number;
  streakCapDays: number;
  dailyChallengeBonusXp: number;
}

interface XpRulesTabProps {
  initialConfig?: XpConfigItem | null;
  onRefresh: () => void;
}

const DEFAULT_XP = {
  baseXpPerCorrect: 10,
  speedBonusMultiplier: 1.5,
  accuracyBonus100: 50,
  streakMultiplierPerDay: 1.1,
  streakCapDays: 30,
  dailyChallengeBonusXp: 100,
};

export function XpRulesTab({ initialConfig, onRefresh }: XpRulesTabProps) {
  const [baseXpPerCorrect, setBaseXpPerCorrect] = useState<number>(
    initialConfig?.baseXpPerCorrect ?? 10
  );
  const [speedBonusMultiplier, setSpeedBonusMultiplier] = useState<number>(
    initialConfig?.speedBonusMultiplier ?? 1.5
  );
  const [accuracyBonus100, setAccuracyBonus100] = useState<number>(
    initialConfig?.accuracyBonus100 ?? 50
  );
  const [streakMultiplierPerDay, setStreakMultiplierPerDay] = useState<number>(
    initialConfig?.streakMultiplierPerDay ?? 1.1
  );
  const [streakCapDays, setStreakCapDays] = useState<number>(initialConfig?.streakCapDays ?? 30);
  const [dailyChallengeBonusXp, setDailyChallengeBonusXp] = useState<number>(
    initialConfig?.dailyChallengeBonusXp ?? 100
  );

  const [saving, setSaving] = useState<boolean>(false);
  const [resetting, setResetting] = useState<boolean>(false);
  const [showResetModal, setShowResetModal] = useState<boolean>(false);
  const [successMsg, setSuccessMsg] = useState<string>('');

  useEffect(() => {
    if (initialConfig) {
      setBaseXpPerCorrect(initialConfig.baseXpPerCorrect ?? 10);
      setSpeedBonusMultiplier(initialConfig.speedBonusMultiplier ?? 1.5);
      setAccuracyBonus100(initialConfig.accuracyBonus100 ?? 50);
      setStreakMultiplierPerDay(initialConfig.streakMultiplierPerDay ?? 1.1);
      setStreakCapDays(initialConfig.streakCapDays ?? 30);
      setDailyChallengeBonusXp(initialConfig.dailyChallengeBonusXp ?? 100);
    }
  }, [initialConfig]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');
    try {
      const res = await fetch('/api/admin/gamification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'save_xp_config',
          xpConfig: {
            baseXpPerCorrect,
            speedBonusMultiplier,
            accuracyBonus100,
            streakMultiplierPerDay,
            streakCapDays,
            dailyChallengeBonusXp,
          },
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save XP rules.');

      setSuccessMsg('XP Formula settings saved successfully!');
      setTimeout(() => setSuccessMsg(''), 4000);
      onRefresh();
    } catch (err: any) {
      alert(err.message || 'Error saving XP rules');
    } finally {
      setSaving(false);
    }
  };

  const handleConfirmReset = async () => {
    setResetting(true);
    try {
      const res = await fetch('/api/admin/gamification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reset_xp_config' }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to reset XP rules.');

      setBaseXpPerCorrect(DEFAULT_XP.baseXpPerCorrect);
      setSpeedBonusMultiplier(DEFAULT_XP.speedBonusMultiplier);
      setAccuracyBonus100(DEFAULT_XP.accuracyBonus100);
      setStreakMultiplierPerDay(DEFAULT_XP.streakMultiplierPerDay);
      setStreakCapDays(DEFAULT_XP.streakCapDays);
      setDailyChallengeBonusXp(DEFAULT_XP.dailyChallengeBonusXp);

      setShowResetModal(false);
      setSuccessMsg('XP Formula reset to factory defaults!');
      setTimeout(() => setSuccessMsg(''), 4000);
      onRefresh();
    } catch (err: any) {
      alert(err.message || 'Error resetting XP rules');
    } finally {
      setResetting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-white border border-blue-100 p-5 rounded-2xl shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-black text-slate-900 text-base flex items-center gap-2">
            <Zap className="w-5 h-5 text-purple-600 fill-purple-600" />
            <span>Global XP Formula Tuning</span>
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Tune platform-wide XP rewards, streak multipliers, and accuracy bonuses
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowResetModal(true)}
          className="px-4 py-2.5 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 font-extrabold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-1.5 transition-all"
        >
          <RotateCcw className="w-4 h-4 text-amber-600" />
          <span>Reset to Defaults</span>
        </button>
      </div>

      {/* Success Notification */}
      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2 text-xs font-extrabold text-emerald-800">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* XP Settings Form */}
      <form
        onSubmit={handleSave}
        className="bg-white border border-blue-100 rounded-2xl p-6 shadow-sm space-y-6"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Base XP per correct answer */}
          <div className="space-y-1.5">
            <label className="block text-xs font-extrabold text-slate-800 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-purple-600" /> Base XP per Correct Answer
              </span>
              <span className="text-[11px] text-slate-400 font-normal">Base Points</span>
            </label>
            <input
              type="number"
              min="1"
              value={baseXpPerCorrect}
              onChange={(e) => setBaseXpPerCorrect(parseInt(e.target.value) || 0)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-slate-900 focus:outline-none focus:border-[#2563EB]"
            />
            <p className="text-[11px] text-slate-500 font-medium">
              Standard XP earned for every correctly answered question.
            </p>
          </div>

          {/* Speed bonus multiplier */}
          <div className="space-y-1.5">
            <label className="block text-xs font-extrabold text-slate-800 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-blue-600" /> Speed Bonus Multiplier
              </span>
              <span className="text-[11px] text-slate-400 font-normal">Speed Factor</span>
            </label>
            <input
              type="number"
              step="0.1"
              min="1"
              value={speedBonusMultiplier}
              onChange={(e) => setSpeedBonusMultiplier(parseFloat(e.target.value) || 1.0)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-slate-900 focus:outline-none focus:border-[#2563EB]"
            />
            <p className="text-[11px] text-slate-500 font-medium">
              Multiplier applied when answers are submitted quickly (e.g. 1.5x).
            </p>
          </div>

          {/* Accuracy bonus thresholds (100% score) */}
          <div className="space-y-1.5">
            <label className="block text-xs font-extrabold text-slate-800 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-emerald-600" /> 100% Accuracy Bonus XP
              </span>
              <span className="text-[11px] text-slate-400 font-normal">Bonus XP</span>
            </label>
            <input
              type="number"
              min="0"
              value={accuracyBonus100}
              onChange={(e) => setAccuracyBonus100(parseInt(e.target.value) || 0)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-slate-900 focus:outline-none focus:border-[#2563EB]"
            />
            <p className="text-[11px] text-slate-500 font-medium">
              Flat bonus XP awarded for achieving a perfect 100% quiz score.
            </p>
          </div>

          {/* Daily Challenge Bonus XP */}
          <div className="space-y-1.5">
            <label className="block text-xs font-extrabold text-slate-800 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-amber-500" /> Daily Challenge Bonus XP
              </span>
              <span className="text-[11px] text-slate-400 font-normal">Bonus XP</span>
            </label>
            <input
              type="number"
              min="0"
              value={dailyChallengeBonusXp}
              onChange={(e) => setDailyChallengeBonusXp(parseInt(e.target.value) || 0)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-slate-900 focus:outline-none focus:border-[#2563EB]"
            />
            <p className="text-[11px] text-slate-500 font-medium">
              Extra reward for completing the featured daily challenge quiz.
            </p>
          </div>

          {/* Streak multiplier per day */}
          <div className="space-y-1.5">
            <label className="block text-xs font-extrabold text-slate-800 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-amber-600" /> Streak Multiplier per Day
              </span>
              <span className="text-[11px] text-slate-400 font-normal">Daily Factor</span>
            </label>
            <input
              type="number"
              step="0.05"
              min="1.0"
              value={streakMultiplierPerDay}
              onChange={(e) => setStreakMultiplierPerDay(parseFloat(e.target.value) || 1.0)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-slate-900 focus:outline-none focus:border-[#2563EB]"
            />
            <p className="text-[11px] text-slate-500 font-medium">
              Percentage boost added for each consecutive active streak day (e.g. 1.1x).
            </p>
          </div>

          {/* Streak cap days */}
          <div className="space-y-1.5">
            <label className="block text-xs font-extrabold text-slate-800 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-amber-700" /> Streak Multiplier Cap (Days)
              </span>
              <span className="text-[11px] text-slate-400 font-normal">Max Days Cap</span>
            </label>
            <input
              type="number"
              min="1"
              value={streakCapDays}
              onChange={(e) => setStreakCapDays(parseInt(e.target.value) || 1)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-slate-900 focus:outline-none focus:border-[#2563EB]"
            />
            <p className="text-[11px] text-slate-500 font-medium">
              Maximum day count limit for compounding streak XP multipliers.
            </p>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md shadow-blue-500/20 flex items-center gap-2 disabled:opacity-50 transition-all active:scale-[0.98]"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Save Formula Changes</span>
          </button>
        </div>
      </form>

      {/* Reset Confirmation Modal */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl space-y-4 border border-slate-200">
            <div className="flex items-center gap-3 text-amber-600">
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center shrink-0 border border-amber-200">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-black text-slate-900 text-base">Reset XP Formula</h3>
                <p className="text-xs text-slate-500 font-medium">Restore platform defaults</p>
              </div>
            </div>

            <p className="text-xs text-slate-600">
              Are you sure you want to reset all XP reward rules to factory default settings?
            </p>

            <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowResetModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmReset}
                disabled={resetting}
                className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs rounded-xl shadow-md flex items-center gap-1.5 disabled:opacity-50"
              >
                {resetting && <Loader2 className="w-4 h-4 animate-spin" />}
                <span>Reset to Defaults</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
