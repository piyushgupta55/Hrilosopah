'use client';

import React, { useState } from 'react';
import {
  Award,
  Plus,
  Edit3,
  Trash2,
  AlertTriangle,
  Loader2,
  X,
  CheckCircle2,
  XCircle,
} from 'lucide-react';

export interface AchievementItem {
  id: string;
  name: string;
  description: string;
  icon: string;
  conditionType:
    'quiz_count' | 'streak_length' | 'accuracy_threshold' | 'category_mastery' | string;
  thresholdValue: number;
  isActive: boolean;
}

interface AchievementsTabProps {
  achievements: AchievementItem[];
  onRefresh: () => void;
}

const CONDITION_TYPES = [
  { value: 'quiz_count', label: 'Quiz Count (e.g. 10 Quizzes Completed)' },
  { value: 'streak_length', label: 'Streak Length (e.g. 7-Day Active Streak)' },
  { value: 'accuracy_threshold', label: 'Accuracy Threshold (e.g. 100% Score)' },
  { value: 'category_mastery', label: 'Category Mastery (e.g. 5 AI Quizzes)' },
];

export function AchievementsTab({ achievements, onRefresh }: AchievementsTabProps) {
  const [modalMode, setModalMode] = useState<'create' | 'edit' | null>(null);
  const [editingAch, setEditingAch] = useState<AchievementItem | null>(null);
  const [deletingAch, setDeletingAch] = useState<AchievementItem | null>(null);

  // Form State
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [icon, setIcon] = useState<string>('🏆');
  const [conditionType, setConditionType] = useState<string>('quiz_count');
  const [thresholdValue, setThresholdValue] = useState<number>(1);
  const [isActive, setIsActive] = useState<boolean>(true);

  const [saving, setSaving] = useState<boolean>(false);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const openCreateModal = () => {
    setName('');
    setDescription('');
    setIcon('🏆');
    setConditionType('quiz_count');
    setThresholdValue(1);
    setIsActive(true);
    setEditingAch(null);
    setModalMode('create');
  };

  const openEditModal = (ach: AchievementItem) => {
    setEditingAch(ach);
    setName(ach.name);
    setDescription(ach.description);
    setIcon(ach.icon || '🏆');
    setConditionType(ach.conditionType || 'quiz_count');
    setThresholdValue(ach.thresholdValue || 1);
    setIsActive(ach.isActive);
    setModalMode('edit');
  };

  // Toggle Active/Inactive status
  const handleToggleActive = async (ach: AchievementItem) => {
    setTogglingId(ach.id);
    try {
      const res = await fetch('/api/admin/gamification', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: ach.id,
          isActive: !ach.isActive,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to toggle status');
      onRefresh();
    } catch (err: any) {
      alert(err.message || 'Error toggling status');
    } finally {
      setTogglingId(null);
    }
  };

  // Save Achievement (Create or Edit)
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !description.trim()) return;

    setSaving(true);
    try {
      if (modalMode === 'create') {
        const res = await fetch('/api/admin/gamification', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'create_achievement',
            achievement: {
              name,
              description,
              icon,
              conditionType,
              thresholdValue,
              isActive,
            },
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to create achievement');
      } else if (modalMode === 'edit' && editingAch) {
        const res = await fetch('/api/admin/gamification', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: editingAch.id,
            name,
            description,
            icon,
            conditionType,
            thresholdValue,
            isActive,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to update achievement');
      }

      setModalMode(null);
      onRefresh();
    } catch (err: any) {
      alert(err.message || 'Error saving achievement');
    } finally {
      setSaving(false);
    }
  };

  // Delete Achievement
  const handleDelete = async () => {
    if (!deletingAch) return;
    setDeleteLoading(true);
    try {
      const res = await fetch(`/api/admin/gamification?id=${deletingAch.id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete achievement');

      setDeletingAch(null);
      onRefresh();
    } catch (err: any) {
      alert(err.message || 'Error deleting achievement');
    } finally {
      setDeleteLoading(false);
    }
  };

  const getConditionLabel = (type: string, val: number) => {
    switch (type) {
      case 'quiz_count':
        return `Complete ${val} Quizzes`;
      case 'streak_length':
        return `${val}-Day Active Streak`;
      case 'accuracy_threshold':
        return `${val}% Accuracy Score`;
      case 'category_mastery':
        return `Master ${val} Category Quizzes`;
      default:
        return `Threshold: ${val}`;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white border border-blue-100 p-5 rounded-2xl shadow-sm">
        <div>
          <h2 className="font-black text-slate-900 text-base flex items-center gap-2">
            <Award className="w-5 h-5 text-[#2563EB]" />
            <span>Platform Achievements & Badges</span>
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Manage unlockable learner badges and milestone thresholds
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="px-4 py-2.5 bg-[#2563EB] hover:bg-[#1D4ED8] rounded-xl text-xs sm:text-sm font-extrabold text-white flex items-center justify-center gap-1.5 transition-all shadow-md shadow-blue-500/20 active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" />
          <span>+ New Achievement</span>
        </button>
      </div>

      {/* Table Card */}
      <div className="bg-white border border-blue-100 rounded-2xl overflow-hidden shadow-sm">
        {achievements.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#2563EB] flex items-center justify-center mx-auto border border-blue-100">
              <Award className="w-6 h-6" />
            </div>
            <h4 className="font-extrabold text-slate-900 text-base">No Achievements Configured</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Create your first achievement badge to motivate platform learners.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 text-slate-500 uppercase font-bold border-b border-slate-100">
                <tr>
                  <th className="p-4 sm:p-5">Icon & Badge Name</th>
                  <th className="p-4 sm:p-5">Description</th>
                  <th className="p-4 sm:p-5">Unlock Condition</th>
                  <th className="p-4 sm:p-5">Status</th>
                  <th className="p-4 sm:p-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {achievements.map((ach) => (
                  <tr key={ach.id} className="hover:bg-blue-50/30 transition-colors">
                    {/* Icon & Name */}
                    <td className="p-4 sm:p-5 font-bold text-slate-900">
                      <div className="flex items-center gap-3">
                        <span className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-xl shrink-0">
                          {ach.icon || '🏆'}
                        </span>
                        <div>
                          <span className="block font-black text-slate-900">{ach.name}</span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            ID: {ach.id.slice(0, 8)}...
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Description */}
                    <td className="p-4 sm:p-5 text-slate-600 max-w-xs truncate">
                      {ach.description}
                    </td>

                    {/* Unlock Condition */}
                    <td className="p-4 sm:p-5">
                      <span className="px-2.5 py-1 bg-blue-50 text-[#2563EB] font-extrabold text-xs rounded-xl border border-blue-100">
                        {getConditionLabel(ach.conditionType, ach.thresholdValue)}
                      </span>
                    </td>

                    {/* Active Toggle */}
                    <td className="p-4 sm:p-5">
                      <button
                        type="button"
                        onClick={() => handleToggleActive(ach)}
                        disabled={togglingId === ach.id}
                        className={`px-3 py-1 rounded-full text-xs font-extrabold border transition-all flex items-center gap-1 ${
                          ach.isActive
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                            : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                        }`}
                      >
                        {togglingId === ach.id ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : ach.isActive ? (
                          <>
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>Active</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3 h-3 text-slate-400" />
                            <span>Inactive</span>
                          </>
                        )}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="p-4 sm:p-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => openEditModal(ach)}
                          className="p-1.5 bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-[#2563EB] font-bold rounded-xl border border-slate-200 transition-all"
                          title="Edit Achievement"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeletingAch(ach)}
                          className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-xl border border-red-100 transition-all"
                          title="Delete Achievement"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create / Edit Achievement Modal */}
      {modalMode && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleSave}
            className="bg-white w-full max-w-lg rounded-2xl p-6 shadow-2xl space-y-4 border border-slate-200"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
                <Award className="w-5 h-5 text-[#2563EB]" />
                <span>
                  {modalMode === 'create' ? 'Create New Achievement' : 'Edit Achievement'}
                </span>
              </h3>
              <button
                type="button"
                onClick={() => setModalMode(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-4 gap-3">
                <div>
                  <label className="block font-extrabold text-slate-700 mb-1">Badge Icon</label>
                  <input
                    type="text"
                    value={icon}
                    onChange={(e) => setIcon(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-lg text-center focus:outline-none focus:border-[#2563EB]"
                    maxLength={4}
                  />
                </div>

                <div className="col-span-3">
                  <label className="block font-extrabold text-slate-700 mb-1">
                    Achievement Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Streak Master"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:border-[#2563EB]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-extrabold text-slate-700 mb-1">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Maintain a 7-day active learning streak"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#2563EB]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-extrabold text-slate-700 mb-1">Condition Type</label>
                  <select
                    value={conditionType}
                    onChange={(e) => setConditionType(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#2563EB]"
                  >
                    {CONDITION_TYPES.map((ct) => (
                      <option key={ct.value} value={ct.value}>
                        {ct.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-extrabold text-slate-700 mb-1">
                    Threshold Value
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={thresholdValue}
                    onChange={(e) => setThresholdValue(parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-[#2563EB]"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="isActiveCheck"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4 text-[#2563EB] rounded focus:ring-blue-500"
                />
                <label
                  htmlFor="isActiveCheck"
                  className="font-extrabold text-slate-700 select-none"
                >
                  Enable & publish achievement immediately
                </label>
              </div>
            </div>

            <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setModalMode(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-extrabold text-xs rounded-xl shadow-md flex items-center gap-1.5 disabled:opacity-50"
              >
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                <span>{saving ? 'Saving...' : 'Save Achievement'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingAch && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl space-y-4 border border-slate-200">
            <div className="flex items-center gap-3 text-red-600">
              <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center shrink-0 border border-red-100">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-black text-slate-900 text-base">Delete Achievement</h3>
                <p className="text-xs text-slate-500 font-medium">This cannot be undone.</p>
              </div>
            </div>

            <p className="text-xs text-slate-600">
              Are you sure you want to delete{' '}
              <strong className="text-slate-900">&quot;{deletingAch.name}&quot;</strong>?
            </p>

            <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setDeletingAch(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleteLoading}
                className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs rounded-xl shadow-md flex items-center gap-1.5 disabled:opacity-50"
              >
                {deleteLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                <span>{deleteLoading ? 'Deleting...' : 'Delete Achievement'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
