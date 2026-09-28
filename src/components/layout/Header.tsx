'use client';

import React, { useMemo } from 'react';
import { useApp } from '@/lib/store';
import { Plus, HelpCircle, HeartHandshake } from 'lucide-react';

export function Header() {
  const { tasks, openModal } = useApp();

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
    return tasks.filter(t => t.completed).length;
  }, [tasks]);

  return (
    <header className="pt-2 pb-5 flex items-start justify-between">
      <div>
        <p suppressHydrationWarning className="text-xs sm:text-sm font-medium text-ink-muted dark:text-slate-400 tracking-wide uppercase">
          {dateString}
        </p>
        <h1 suppressHydrationWarning className="text-2xl sm:text-3xl font-semibold tracking-tight text-ink-primary dark:text-slate-100 mt-0.5">
          {greeting}.
        </h1>
        <div className="flex items-center gap-2 mt-1.5">
          <span className="text-xs sm:text-sm text-ink-secondary dark:text-slate-300">
            What&apos;s next?
          </span>
          {completedCount > 0 && (
            <>
              <span className="text-slate-300 dark:text-slate-700 text-xs">•</span>
              <span className="text-xs text-brand-600 dark:text-brand-300 bg-brand-50 dark:bg-brand-950/50 px-2 py-0.5 rounded-full font-medium">
                {completedCount} completed today
              </span>
            </>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1.5">
        <button
          onClick={() => openModal('body_check')}
          title="Optional check-in: How are you right now?"
          aria-label="Body and energy check-in"
          className="p-2.5 rounded-xl text-ink-muted dark:text-slate-400 hover:text-ink-primary dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <HeartHandshake className="w-5 h-5" />
        </button>

        <button
          onClick={() => openModal('create_task')}
          aria-label="Add new task"
          className="flex items-center gap-1.5 py-2 px-3 sm:px-3.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-medium text-xs sm:text-sm shadow-sm transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden xs:inline sm:inline">Add</span>
        </button>
      </div>
    </header>
  );
}
