'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Check, Clock3, Pause, RefreshCw } from 'lucide-react';
import { Task } from '@/types';
import { useApp } from '@/lib/store';

interface CurrentTaskCardProps {
  task: Task;
  energy?: 'low' | 'steady' | 'energized' | null;
  pace?: 'gentle' | 'balanced' | 'structured';
}

export function CurrentTaskCard({ task, energy = null, pace = 'gentle' }: CurrentTaskCardProps) {
  const router = useRouter();
  const { openModal, completeTask, deferTask } = useApp();
  const focusMinutes = energy === 'low' ? 2 : energy === 'energized' ? 10 : 5;
  const paceGuidance = pace === 'gentle'
    ? 'One small step is enough; you can stop there.'
    : pace === 'balanced'
      ? 'Take this step, then decide what feels right next.'
      : 'Keep this task in view and use a focus session if it helps.';
  const energyGuidance = energy === 'low'
    ? 'Low energy: 2 minutes is enough to begin.'
    : energy === 'energized'
      ? 'More energy today? A longer start is optional.'
      : null;

  return (
    <section className="rounded-3xl bg-surface-container-low border border-outline-variant p-5 sm:p-7" aria-labelledby="current-task-heading">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold text-primary">Your next step</p>
        <span className="inline-flex items-center gap-1.5 text-sm text-on-surface-variant"><Clock3 size={15} /> {task.durationMinutes ? `${task.durationMinutes} min` : 'Flexible'}</span>
      </div>
      <h2 id="current-task-heading" className="mt-3 text-2xl sm:text-3xl font-semibold tracking-tight break-words">{task.title}</h2>
      <p className="mt-2 text-base leading-relaxed text-on-surface-variant">{task.minimum || 'Take one small step. Any step counts.'}</p>
      <p className="mt-2 text-sm leading-relaxed text-on-surface-variant">{paceGuidance}</p>
      {energyGuidance && <p className="mt-2 text-sm leading-relaxed text-on-surface-variant">{energyGuidance}</p>}

      <button type="button" onClick={() => router.push(`/focus-session?minutes=${focusMinutes}`)} className={`mt-6 min-h-12 w-full rounded-xl bg-primary px-4 font-semibold text-on-primary flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.99] ${pace === 'structured' ? 'shadow-md ring-1 ring-primary/20' : ''}`}>
        {pace === 'structured' ? `Focus for ${focusMinutes} minutes` : `Try ${focusMinutes} minutes`} <ArrowRight size={18} />
      </button>

      <div className="mt-3 grid grid-cols-3 gap-2">
        <button type="button" onClick={() => completeTask(task.id, 'minimum')} className="min-h-11 flex items-center justify-center gap-1.5 rounded-xl bg-surface-container-high px-2 text-sm font-medium hover:bg-surface-container-highest"><Check size={16} /> Done</button>
        <button type="button" onClick={() => deferTask(task.id)} className="min-h-11 flex items-center justify-center gap-1.5 rounded-xl bg-surface-container-high px-2 text-sm font-medium hover:bg-surface-container-highest"><Pause size={15} /> Later</button>
        <button type="button" onClick={() => openModal('stuck', task.id)} className="min-h-11 flex items-center justify-center gap-1.5 rounded-xl bg-surface-container-high px-2 text-sm font-medium hover:bg-surface-container-highest"><RefreshCw size={15} /> Help</button>
      </div>
    </section>
  );
}
