'use client';

import React, { useMemo } from 'react';
import { useApp } from '@/lib/store';
import { Plus, Coffee, RotateCcw } from 'lucide-react';

function WelcomeBackState() {
  const { openModal, setNotPlanningToday, addTask, tasks } = useApp();

  const handleStartAgain = () => {
    // Add the minimum recovery tasks if they don't already exist today
    const existingTitles = tasks.map(t => t.title.toLowerCase());
    const minimums = [
      { title: 'Drink water', icon: '💧', minimum: 'Even just three sips', normal: 'Drink a full glass of water' },
      { title: 'Brush teeth', icon: '🪥', minimum: 'A quick 30-second brush', normal: 'Brush for 2 minutes' },
      { title: 'Wash face', icon: '💦', minimum: 'Splash cold water on your face', normal: 'Wash gently with cleanser' },
    ];

    minimums.forEach((m) => {
      if (!existingTitles.includes(m.title.toLowerCase())) {
        addTask({
          title: m.title,
          category: 'wellness',
          icon: m.icon,
          timeCategory: 'now',
          durationMinutes: 3,
          priority: 'must',
          minimum: m.minimum,
          normal: m.normal,
          steps: [
            { id: `wb-${m.title}-1`, title: m.minimum, completed: false, isMinimum: true },
            { id: `wb-${m.title}-2`, title: m.normal, completed: false },
          ],
          companyPreference: 'no_preference',
        });
      }
    });
  };

  return (
    <div className="my-8 p-8 rounded-3xl bg-brand-50/60 dark:bg-brand-950/30 border border-brand-200/70 dark:border-brand-900/50 text-center space-y-5 max-w-md mx-auto animate-fade-in shadow-card">
      <div className="w-14 h-14 rounded-2xl bg-brand-100 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 mx-auto flex items-center justify-center">
        <RotateCcw className="w-7 h-7" />
      </div>

      <div className="space-y-2">
        <h3 className="text-xl font-bold text-ink-primary dark:text-slate-100">
          Welcome back.
        </h3>
        <p className="text-sm text-ink-secondary dark:text-slate-300 leading-relaxed">
          You don&apos;t need to catch up.
        </p>
        <p className="text-xs text-ink-muted dark:text-slate-400 leading-relaxed pt-1">
          Start with today&apos;s minimum. One small thing. That&apos;s enough.
        </p>
      </div>

      {/* Minimum suggestions */}
      <div className="text-left space-y-2 pt-1">
        {[
          { icon: '💧', text: 'Drink water' },
          { icon: '🪥', text: 'Brush teeth' },
          { icon: '💦', text: 'Wash face' },
        ].map((item) => (
          <div
            key={item.text}
            className="flex items-center gap-3 px-3 py-2 rounded-xl bg-white/60 dark:bg-slate-900/40 border border-brand-100/60 dark:border-brand-900/40"
          >
            <span className="text-base">{item.icon}</span>
            <span className="text-sm text-ink-secondary dark:text-slate-300">{item.text}</span>
          </div>
        ))}
      </div>

      <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          type="button"
          onClick={handleStartAgain}
          className="w-full sm:w-auto flex items-center justify-center gap-2 py-3 px-5 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm shadow-sm transition-all active:scale-[0.98]"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Start again</span>
        </button>

        <button
          type="button"
          onClick={() => openModal('create_task')}
          className="w-full sm:w-auto flex items-center justify-center gap-2 py-3 px-4 rounded-2xl border border-brand-200 dark:border-brand-800 hover:bg-brand-50 dark:hover:bg-brand-950/50 text-brand-700 dark:text-brand-300 font-medium text-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add something else</span>
        </button>
      </div>

      <button
        type="button"
        onClick={() => setNotPlanningToday(true)}
        className="text-xs text-ink-subtle hover:text-ink-muted transition-colors underline underline-offset-2"
      >
        I&apos;m taking today off
      </button>
    </div>
  );
}

export function TodayEmptyState() {
  const { openModal, notPlanningToday, setNotPlanningToday, returns } = useApp();

  // Detect multi-day absence: check if the last 2+ return days were paused
  const isReturning = useMemo(() => {
    if (returns.length < 2) return false;
    // Get the last 2 entries; if both were paused, show the welcome-back screen
    const recent = returns.slice(-2);
    return recent.every(r => r.status === 'paused');
  }, [returns]);

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

  // Show return state if user has been absent for 2+ paused days
  if (isReturning) {
    return <WelcomeBackState />;
  }

  return (
    <div className="my-8 p-8 rounded-3xl bg-surface dark:bg-surface-dark border border-slate-200/80 dark:border-slate-800 text-center space-y-5 max-w-md mx-auto shadow-card animate-fade-in">
      <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 text-brand-600 dark:text-brand-400 mx-auto flex items-center justify-center">
        <span className="text-2xl">🙂</span>
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
