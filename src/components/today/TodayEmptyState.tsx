'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Plus } from 'lucide-react';
import { useApp } from '@/lib/store';

export function TodayEmptyState() {
  const router = useRouter();
  const { openModal, setNotPlanningToday, pendingReturn, acknowledgeReturn, tasks } = useApp();
  const allDone = tasks.length > 0 && tasks.every((task) => task.completed);

  const beginPlanning = () => {
    if (pendingReturn) acknowledgeReturn();
    openModal('create_task');
  };

  const takeRest = () => {
    if (pendingReturn) acknowledgeReturn();
    setNotPlanningToday(true);
  };

  return (
    <section className="w-full rounded-3xl bg-surface-container-low border border-outline-variant p-6 sm:p-8" aria-labelledby="empty-today-heading">
      <p className="text-sm font-medium text-primary mb-2">{allDone ? 'That is enough' : pendingReturn ? 'Welcome back' : 'A fresh page'}</p>
      <h2 id="empty-today-heading" className="text-2xl sm:text-3xl font-semibold tracking-tight">{allDone ? 'You’ve done what you planned.' : pendingReturn ? 'Nothing to catch up on.' : 'What would help right now?'}</h2>
      <p className="mt-2 text-base leading-relaxed text-on-surface-variant">{allDone ? 'You can stop here, rest, or add something else if it would help.' : 'You don’t need a complete plan. One small thing is enough, and an open day is okay too.'}</p>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <button type="button" onClick={beginPlanning} className="min-h-12 px-4 rounded-xl bg-primary text-on-primary font-semibold flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.99]">
          <Plus size={18} /> Add one thing
        </button>
        <button type="button" onClick={() => router.push('/focus-session')} className="min-h-12 px-4 rounded-xl bg-surface-container-high text-on-surface font-medium flex items-center justify-center gap-2 hover:bg-surface-container-highest active:scale-[0.99]">
          Help me start <ArrowRight size={17} />
        </button>
      </div>
      <button type="button" onClick={takeRest} className="mt-4 min-h-11 px-2 text-sm font-medium text-on-surface-variant underline decoration-outline underline-offset-4 hover:text-on-surface">Take the day off</button>
    </section>
  );
}
