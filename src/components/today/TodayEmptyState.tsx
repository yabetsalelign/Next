'use client';

import React, { useMemo } from 'react';
import { useApp } from '@/lib/store';
import { Plus, Coffee, Heart, RotateCcw } from 'lucide-react';

function WelcomeBackState() {
  const { openModal, setNotPlanningToday, addTask, tasks, resetToDemoData } = useApp();

  const handleOneSmallThing = () => {
    addTask({
      title: 'One small thing',
      category: 'productive',
      icon: '🌱',
      timeCategory: 'now',
      durationMinutes: 5,
      priority: 'must',
      minimum: 'Spend 2 minutes on anything that feels easy',
      normal: '5 minutes of low-pressure focus',
      steps: [
        { id: `wb-min-1`, title: 'Choose one small physical action', completed: false, isMinimum: true },
        { id: `wb-min-2`, title: 'Do it gently without hurry', completed: false },
      ],
      companyPreference: 'no_preference',
    });
  };

  const handleNormalDay = () => {
    resetToDemoData();
  };

  const handleJustCare = () => {
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
    <div className="my-6 p-7 sm:p-8 rounded-3xl bg-surface dark:bg-surface-dark border border-slate-200/90 dark:border-slate-800 text-center space-y-6 max-w-md mx-auto animate-fade-in shadow-card">
      <div className="space-y-2">
        <h3 className="text-2xl font-bold tracking-tight text-ink-primary dark:text-slate-100">
          Welcome back.
        </h3>
        <p className="text-base text-ink-secondary dark:text-slate-300">
          Nothing needs catching up.
        </p>
        <p className="text-sm text-ink-muted dark:text-slate-400 pt-1">
          What&apos;s manageable today?
        </p>
      </div>

      <div className="flex flex-col gap-2.5 pt-1">
        <button
          type="button"
          onClick={handleOneSmallThing}
          className="w-full py-3.5 px-4 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm shadow-sm transition-all active:scale-[0.99]"
        >
          One small thing
        </button>

        <button
          type="button"
          onClick={handleNormalDay}
          className="w-full py-3.5 px-4 rounded-2xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-ink-primary dark:text-slate-200 font-medium text-sm transition-colors"
        >
          A normal day
        </button>

        <button
          type="button"
          onClick={handleJustCare}
          className="w-full py-3.5 px-4 rounded-2xl border border-brand-200 dark:border-brand-800/80 hover:bg-brand-50/60 dark:hover:bg-brand-950/40 text-brand-700 dark:text-brand-300 font-medium text-sm transition-colors"
        >
          Just care
        </button>

        <button
          type="button"
          onClick={() => setNotPlanningToday(true)}
          className="w-full py-2.5 px-4 text-xs font-medium text-ink-muted hover:text-ink-secondary dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
        >
          I don&apos;t know yet
        </button>
      </div>
    </div>
  );
}

export function TodayEmptyState() {
  const { openModal, notPlanningToday, setNotPlanningToday, returns, addTask } = useApp();

  // Detect multi-day absence or return flag
  const isReturning = useMemo(() => {
    if (returns.length < 2) return false;
    const recent = returns.slice(-2);
    return recent.every(r => r.status === 'paused');
  }, [returns]);

  const handleJustCareForSelf = () => {
    addTask({
      title: 'Care for yourself',
      category: 'wellness',
      icon: '✨',
      timeCategory: 'now',
      durationMinutes: 5,
      priority: 'must',
      minimum: 'Sit comfortably and drink a sip of water',
      normal: 'Take 5 gentle minutes for yourself',
      steps: [
        { id: `c-1`, title: 'Settle in comfortably', completed: false, isMinimum: true },
        { id: `c-2`, title: 'Take a slow, gentle exhale', completed: false }
      ],
      companyPreference: 'no_preference',
    });
  };

  if (notPlanningToday) {
    return (
      <div className="my-6 p-7 sm:p-8 rounded-3xl bg-surface dark:bg-surface-dark border border-slate-200/90 dark:border-slate-800 text-center space-y-4 max-w-md mx-auto animate-fade-in shadow-card">
        <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 mx-auto flex items-center justify-center">
          <Coffee className="w-6 h-6" />
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

  if (isReturning) {
    return <WelcomeBackState />;
  }

  return (
    <div className="my-6 p-7 sm:p-8 rounded-3xl bg-surface dark:bg-surface-dark border border-slate-200/90 dark:border-slate-800 text-center space-y-6 max-w-md mx-auto shadow-card animate-fade-in">
      <div className="space-y-2">
        <h3 className="text-2xl font-bold tracking-tight text-ink-primary dark:text-slate-100">
          Nothing planned yet.
        </h3>
        <p className="text-base text-ink-secondary dark:text-slate-300">
          That&apos;s okay.
        </p>
        <p className="text-sm text-ink-muted dark:text-slate-400 pt-1">
          What would help right now?
        </p>
      </div>

      <div className="flex flex-col gap-2.5 pt-1">
        <button
          type="button"
          onClick={() => openModal('create_task')}
          className="w-full py-3.5 px-4 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm shadow-sm transition-all active:scale-[0.99]"
        >
          Add one thing
        </button>

        <button
          type="button"
          onClick={handleJustCareForSelf}
          className="w-full py-3.5 px-4 rounded-2xl border border-brand-200 dark:border-brand-800/80 hover:bg-brand-50/60 dark:hover:bg-brand-950/40 text-brand-700 dark:text-brand-300 font-medium text-sm transition-colors"
        >
          Just care for yourself
        </button>

        <button
          type="button"
          onClick={() => setNotPlanningToday(true)}
          className="w-full py-2.5 px-4 text-xs font-medium text-ink-muted hover:text-ink-secondary dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
        >
          I&apos;ll figure it out later
        </button>
      </div>
    </div>
  );
}
