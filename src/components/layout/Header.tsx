'use client';

import React, { useMemo } from 'react';
import { useApp } from '@/lib/store';
import { Plus, HeartHandshake, BookOpen, Sparkles } from 'lucide-react';

export function Header() {
  const { tasks, openModal, activeReset } = useApp();

  const { greeting, dateString } = useMemo(() => {
    const now = new Date();
    const hours = now.getHours();
    let greet = 'Good morning';
    if (hours >= 12 && hours < 17) greet = 'Good afternoon';
    else if (hours >= 17) greet = 'Good evening';

    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric' 
    };
    const dateFormatted = now.toLocaleDateString('en-US', options);

    return { greeting: greet, dateString: dateFormatted };
  }, []);

  const completedCount = useMemo(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const day = today.getDate();

    return tasks.filter(t => {
      if (!t.completedAt) return false;
      const completedAt = new Date(t.completedAt);
      return completedAt.getFullYear() === year &&
        completedAt.getMonth() === month &&
        completedAt.getDate() === day;
    }).length;
  }, [tasks]);

  return (
    <header className="sticky top-0 z-20 -mx-1 mb-3 bg-canvas/90 px-1 pb-2 pt-2 backdrop-blur-sm dark:bg-canvas-dark/85">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p suppressHydrationWarning className="text-[11px] font-medium tracking-[0.16em] text-ink-muted uppercase dark:text-slate-400">
            {dateString}
          </p>
          <h1 suppressHydrationWarning className="mt-1 text-2xl font-semibold tracking-tight text-ink-primary dark:text-slate-100 sm:text-3xl">
            {greeting}.
          </h1>
          <div className="mt-1.5 flex items-center gap-2 text-left">
            <span className="text-xs text-ink-secondary dark:text-slate-300 sm:text-sm">
              What&apos;s next?
            </span>
            {completedCount > 0 && (
              <>
                <span className="text-xs text-slate-300 dark:text-slate-700">•</span>
                <span className="rounded-full bg-brand-50 px-2 py-0.5 text-[11px] font-medium text-brand-600 dark:bg-brand-950/50 dark:text-brand-300">
                  {completedCount} done today
                </span>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => openModal('journal')}
            title="Quick journal (optional)"
            aria-label="Open journal"
            className="flex h-10 w-10 items-center justify-center rounded-xl text-ink-muted transition-colors hover:bg-slate-100 hover:text-ink-primary dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
          >
            <BookOpen className="h-5 w-5" />
          </button>

          <button
            onClick={() => openModal('body_check')}
            title="Optional check-in: How are you right now?"
            aria-label="Body and energy check-in"
            className="flex h-10 w-10 items-center justify-center rounded-xl text-ink-muted transition-colors hover:bg-slate-100 hover:text-ink-primary dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
          >
            <HeartHandshake className="h-5 w-5" />
          </button>

          <button
            onClick={() => openModal('fresh_start')}
            title={activeReset ? `Active: ${activeReset.name}` : '7-Day Fresh Start'}
            aria-label="Fresh Start reset"
            className={`flex h-10 w-10 items-center justify-center rounded-xl transition-colors ${
              activeReset
                ? 'bg-brand-50 text-brand-600 dark:bg-brand-950/50 dark:text-brand-400'
                : 'text-ink-muted hover:bg-slate-100 hover:text-ink-primary dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100'
            }`}
          >
            <Sparkles className="h-5 w-5" />
          </button>

          <button
            onClick={() => openModal('create_task')}
            aria-label="Add new task"
            className="hidden items-center gap-1.5 rounded-xl bg-brand-600 px-3 py-2 text-xs font-medium text-white shadow-sm transition-all hover:bg-brand-700 active:scale-95 sm:flex"
          >
            <Plus className="h-4 w-4" />
            <span>Add</span>
          </button>
        </div>
      </div>

    </header>
  );
}
