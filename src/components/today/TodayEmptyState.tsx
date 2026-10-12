'use client';

import React, { useMemo } from 'react';
import { useApp } from '@/lib/store';
import { Plus, Coffee, Heart, RotateCcw } from 'lucide-react';

function WelcomeBackState() {
  const { openModal, setNotPlanningToday, addTask, tasks, acknowledgeReturn } = useApp();

  const handleOneSmallThing = () => {
    acknowledgeReturn();
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
    // Resume normal planning without deleting or resetting user data
    setNotPlanningToday(false);
    acknowledgeReturn();
  };

  const handleJustCare = () => {
    acknowledgeReturn();
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
    <div className="my-6 p-7 sm:p-8 rounded-3xl bg-surface dark:bg-surface-dark border border-stone-200/90 dark:border-white/[0.08] text-center space-y-6 max-w-md mx-auto animate-fade-in shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
      <div className="space-y-2">
        <h3 className="text-2xl font-bold tracking-tight text-ink-primary dark:text-linen">
          Welcome back.
        </h3>
        <p className="text-base text-ink-secondary dark:text-linen-muted">
          Nothing needs catching up.
        </p>
        <p className="text-sm text-ink-muted dark:text-linen-subtle pt-1">
          What&apos;s manageable today?
        </p>
      </div>

      <div className="flex flex-col gap-2.5 pt-1">
        <button
          type="button"
          onClick={handleOneSmallThing}
          className="w-full py-3.5 px-4 rounded-2xl bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-stone-950 font-bold text-sm shadow-[0_4px_18px_rgba(229,149,63,0.25)] transition-all active:scale-[0.99]"
        >
          One small thing
        </button>

        <button
          type="button"
          onClick={handleNormalDay}
          className="w-full py-3.5 px-4 rounded-2xl border border-stone-200 dark:border-white/[0.1] hover:bg-stone-50 dark:hover:bg-white/[0.04] text-ink-primary dark:text-linen font-medium text-sm transition-colors"
        >
          A normal day
        </button>

        <button
          type="button"
          onClick={handleJustCare}
          className="w-full py-3.5 px-4 rounded-2xl border border-terracotta/30 dark:border-terracotta/40 hover:bg-terracotta/10 text-terracotta font-medium text-sm transition-colors"
        >
          Just care
        </button>

        <button
          type="button"
          onClick={() => {
            setNotPlanningToday(true);
            acknowledgeReturn();
          }}
          className="w-full py-2.5 px-4 text-xs font-medium text-ink-muted hover:text-ink-secondary dark:text-linen-subtle dark:hover:text-linen transition-colors"
        >
          I don&apos;t know yet
        </button>
      </div>
    </div>
  );
}

export function TodayEmptyState() {
  const { openModal, notPlanningToday, setNotPlanningToday, pendingReturn, addTask } = useApp();

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
      <div className="my-6 p-7 sm:p-8 rounded-3xl bg-surface dark:bg-surface-dark border border-stone-200/90 dark:border-white/[0.08] text-center space-y-4 max-w-md mx-auto animate-fade-in shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
        <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/20 text-amber-600 dark:text-amber-400 mx-auto flex items-center justify-center">
          <Coffee className="w-6 h-6" />
        </div>
        <h3 className="text-xl font-bold text-ink-primary dark:text-linen">
          Resting today.
        </h3>
        <p className="text-sm text-ink-muted dark:text-linen-subtle leading-relaxed">
          You chose not to plan today. That is completely valid.
          No obligations or overdue badges will appear.
        </p>
        <div className="pt-2">
          <button
            type="button"
            onClick={() => setNotPlanningToday(false)}
            className="py-2.5 px-4 rounded-xl text-xs font-semibold text-amber-700 dark:text-amber-400 hover:bg-stone-100 dark:hover:bg-white/[0.04] transition-colors"
          >
            Switch back to planning mode
          </button>
        </div>
      </div>
    );
  }

  if (pendingReturn) {
    return <WelcomeBackState />;
  }

  return (
    <div className="my-6 p-7 sm:p-8 rounded-3xl bg-surface dark:bg-surface-dark border border-stone-200/90 dark:border-white/[0.08] text-center space-y-6 max-w-md mx-auto shadow-[0_8px_32px_rgba(0,0,0,0.3)] animate-fade-in">
      <div className="space-y-2">
        <h3 className="text-2xl font-bold tracking-tight text-ink-primary dark:text-linen">
          Nothing planned yet.
        </h3>
        <p className="text-base text-ink-secondary dark:text-linen-muted">
          That&apos;s okay.
        </p>
        <p className="text-sm text-ink-muted dark:text-linen-subtle pt-1">
          What would help right now?
        </p>
      </div>

      <div className="flex flex-col gap-2.5 pt-1">
        <button
          type="button"
          onClick={() => openModal('create_task')}
          className="w-full py-3.5 px-4 rounded-2xl bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-stone-950 font-bold text-sm shadow-[0_4px_18px_rgba(229,149,63,0.25)] transition-all active:scale-[0.99]"
        >
          Add one thing
        </button>

        <button
          type="button"
          onClick={handleJustCareForSelf}
          className="w-full py-3.5 px-4 rounded-2xl border border-terracotta/30 dark:border-terracotta/40 hover:bg-terracotta/10 text-terracotta font-medium text-sm transition-colors"
        >
          Just care for yourself
        </button>

        <button
          type="button"
          onClick={() => setNotPlanningToday(true)}
          className="w-full py-2.5 px-4 text-xs font-medium text-ink-muted hover:text-ink-secondary dark:text-linen-subtle dark:hover:text-linen transition-colors"
        >
          I&apos;ll figure it out later
        </button>
      </div>
    </div>
  );
}
