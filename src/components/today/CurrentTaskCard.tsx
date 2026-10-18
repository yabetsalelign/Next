'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Task } from '@/types';
import { useApp } from '@/lib/store';
import { sounds } from '@/lib/sounds';

interface CurrentTaskCardProps {
  task: Task;
}

export function CurrentTaskCard({ task }: CurrentTaskCardProps) {
  const router = useRouter();
  const { openModal, completeTask, deferTask } = useApp();
  const [isCompletedAnim, setIsCompletedAnim] = useState(false);

  const handleDone = () => {
    sounds.playMinimumComplete();
    setIsCompletedAnim(true);
    setTimeout(() => {
      completeTask(task.id, 'minimum');
      setIsCompletedAnim(false);
    }, 400);
  };

  const handlePostpone = () => {
    deferTask(task.id);
  };

  const handleStuck = () => {
    openModal('stuck', task.id);
  };

  const handleHelpStart = () => {
    router.push('/focus-session');
  };

  const durationStr = task.durationMinutes ? `${task.durationMinutes}m` : '15m';
  const priorityStr = task.priority === 'must' ? 'Must' : task.priority === 'should' ? 'Should' : 'Care';

  return (
    <section className="relative w-full rounded-[24px] bg-surface-container-low p-space-md sm:p-space-lg shadow-xl overflow-hidden group border border-surface-container-high/40 select-none">
      {/* Ambient Warm Accent Sheen */}
      <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-primary-container/10 blur-3xl pointer-events-none"></div>

      <div className="flex flex-col gap-space-md relative z-10">
        {/* Card Badge Row */}
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-container opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-container"></span>
            </span>
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-primary-container font-semibold">
              Now • Primary Focus
            </span>
          </div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container-high text-on-surface">
            <span className="material-symbols-outlined text-[13px] text-primary-container">schedule</span>
            <span className="font-label-sm text-label-sm font-medium">{priorityStr} • {durationStr}</span>
          </div>
        </div>

        {/* Core Objective & Tiny Anchor Step */}
        <div className="flex items-start gap-space-sm pt-0.5">
          <button
            type="button"
            aria-label="Mark task done gently"
            onClick={handleDone}
            className={`mt-1 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 shrink-0 ${
              isCompletedAnim
                ? 'bg-secondary text-surface-container-lowest'
                : 'bg-surface-container-high text-transparent hover:text-secondary hover:bg-surface-container-highest'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">check</span>
          </button>
          <div className="min-w-0 flex-1">
            <h3 className="font-headline-md text-headline-md text-on-surface tracking-tight leading-snug font-semibold">
              {task.title}
            </h3>
            <p className="font-body-md text-body-md text-on-surface-variant mt-1 leading-relaxed">
              {task.minimum
                ? `Take 1 small step towards: ${task.minimum}`
                : 'Take 1 small step towards: open notes and read the first paragraph.'}
            </p>
          </div>
        </div>

        {/* 2-Minute Micro-Warmup Hero Action */}
        <div className="pt-space-xs">
          <button
            type="button"
            onClick={handleHelpStart}
            className="w-full flex items-center justify-center gap-2.5 py-3.5 px-space-md rounded-full bg-primary-container text-on-primary-container font-label-lg text-label-lg shadow-[0_8px_24px_-4px_rgba(255,185,99,0.35)] hover:opacity-95 active:scale-[0.98] transition-all font-semibold"
          >
            <span className="material-symbols-outlined text-[19px]">bolt</span>
            <span>Help me start (2 min warmup)</span>
          </button>
        </div>

        {/* Emotional Safety Net Actions */}
        <div className="grid grid-cols-3 gap-space-xs pt-1">
          <button
            type="button"
            onClick={handleDone}
            className="py-2 px-space-xs rounded-full bg-surface-container-high text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest font-label-sm text-label-sm flex items-center justify-center gap-1 transition-colors active:scale-95"
          >
            <span className="material-symbols-outlined text-[15px]">done</span>
            <span>Done</span>
          </button>
          <button
            type="button"
            onClick={handlePostpone}
            className="py-2 px-space-xs rounded-full bg-surface-container-high text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest font-label-sm text-label-sm flex items-center justify-center gap-1 transition-colors active:scale-95"
          >
            <span className="material-symbols-outlined text-[15px]">snooze</span>
            <span className="truncate">Postpone</span>
          </button>
          <button
            type="button"
            onClick={handleStuck}
            className="py-2 px-space-xs rounded-full bg-surface-container-high text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest font-label-sm text-label-sm flex items-center justify-center gap-1 transition-colors active:scale-95"
          >
            <span className="material-symbols-outlined text-[15px]">sentiment_neutral</span>
            <span className="truncate">I'm stuck</span>
          </button>
        </div>
      </div>
    </section>
  );
}
