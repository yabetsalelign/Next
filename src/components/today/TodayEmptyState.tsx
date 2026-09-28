'use client';

import React from 'react';
import { useApp } from '@/lib/store';
import { Plus, Coffee, Sparkles, Smile } from 'lucide-react';

export function TodayEmptyState() {
  const { openModal, notPlanningToday, setNotPlanningToday } = useApp();

  if (notPlanningToday) {
    return (
      <div className="my-8 p-8 rounded-3xl bg-surface dark:bg-surface-dark border border-slate-200/80 dark:border-slate-800 text-center space-y-4 max-w-md mx-auto animate-fade-in shadow-card">
        <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 mx-auto flex items-center justify-center">
          <Coffee className="w-7 h-7" />
        </div>
        <h3 className="text-xl font-bold text-ink-primary dark:text-slate-100">
          Resting today.
        </h3>
        <p className="text-sm text-ink-muted dark:text-slate-400 leading-relaxed">
          You chose not to plan today. That is completely valid.
          No obligations or overdue badges will appear.
        </p>
        <div className="pt-2">
          <button
            type="button"
            onClick={() => setNotPlanningToday(false)}
            className="py-2.5 px-4 rounded-xl text-xs font-semibold text-brand-600 dark:text-brand-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Switch back to planning mode
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="my-8 p-8 rounded-3xl bg-surface dark:bg-surface-dark border border-slate-200/80 dark:border-slate-800 text-center space-y-5 max-w-md mx-auto shadow-card animate-fade-in">
      <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 text-brand-600 dark:text-brand-400 mx-auto flex items-center justify-center">
        <Smile className="w-7 h-7" />
      </div>

      <div className="space-y-1.5">
        <h3 className="text-xl font-bold text-ink-primary dark:text-slate-100">
          Nothing scheduled.
        </h3>
        <p className="text-sm text-ink-secondary dark:text-slate-300 font-medium">
          That&apos;s completely okay.
        </p>
        <p className="text-xs sm:text-sm text-ink-muted dark:text-slate-400 leading-relaxed pt-1">
          You can add something small, or just move at your own pace with whatever you need right now.
        </p>
      </div>

      <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => openModal('create_task')}
          className="w-full sm:w-auto flex items-center justify-center gap-2 py-3 px-5 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add something</span>
        </button>

        <button
          type="button"
          onClick={() => setNotPlanningToday(true)}
          className="w-full sm:w-auto py-3 px-4 rounded-2xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-ink-secondary dark:text-slate-300 font-medium text-sm transition-colors"
        >
          I&apos;m not planning today
        </button>
      </div>
    </div>
  );
}
