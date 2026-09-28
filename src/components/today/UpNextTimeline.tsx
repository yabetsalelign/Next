'use client';

import React from 'react';
import { Task } from '@/types';
import { useApp } from '@/lib/store';
import { Coffee, ArrowUpRight, Check, Clock } from 'lucide-react';
import { sounds } from '@/lib/sounds';

interface UpNextTimelineProps {
  tasks: Task[];
}

export function UpNextTimeline({ tasks }: UpNextTimelineProps) {
  const { setCurrentTask, completeTask, openModal } = useApp();

  if (tasks.length === 0) {
    return (
      <div className="mt-8 pt-4 border-t border-slate-200/60 dark:border-slate-800 text-center">
        <p className="text-sm text-ink-muted dark:text-slate-400">
          No other tasks queued. Take your time or add something when you feel ready.
        </p>
      </div>
    );
  }

  const getSequenceLabel = (index: number, task: Task) => {
    if (index === 0) return 'NEXT';
    if (index === 1) return 'AFTER THAT';
    return 'LATER';
  };

  return (
    <section aria-label="Upcoming activities" className="mt-8 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold tracking-wider text-ink-muted dark:text-slate-400 uppercase">
          Up Next
        </h3>
        <span className="text-xs text-ink-subtle dark:text-slate-500">
          Sequence • No rigid clocks
        </span>
      </div>

      <div className="relative pl-4 sm:pl-6 space-y-3.5 before:absolute before:left-[11px] sm:before:left-[15px] before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200/80 dark:before:bg-slate-800">
        {tasks.map((task, idx) => {
          const isRest = task.category === 'rest';
          const seqLabel = getSequenceLabel(idx, task);

          return (
            <div
              key={task.id}
              className="relative group flex items-start gap-3.5 bg-surface dark:bg-surface-dark border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-4 shadow-card hover:border-slate-300 dark:hover:border-slate-700 transition-all"
            >
              {/* Timeline dot marker */}
              <div 
                className={`absolute -left-[21px] sm:-left-[29px] top-5 w-3.5 h-3.5 rounded-full border-2 bg-surface dark:bg-surface-dark transition-colors ${
                  isRest 
                    ? 'border-amber-400 bg-amber-50' 
                    : 'border-brand-500 bg-brand-50'
                }`}
                aria-hidden="true"
              />

              {/* Task Icon */}
              <div className="text-2xl select-none pt-0.5" role="img" aria-label="Activity icon">
                {task.icon || (isRest ? '☕' : '📌')}
              </div>

              {/* Card info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className={`text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-md ${
                    idx === 0 
                      ? 'bg-brand-100/70 text-brand-800 dark:bg-brand-950 dark:text-brand-300' 
                      : 'bg-slate-100 text-ink-secondary dark:bg-slate-800 dark:text-slate-400'
                  }`}>
                    {seqLabel}
                  </span>

                  {isRest && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-medium text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-md">
                      <Coffee className="w-2.5 h-2.5" />
                      Rest
                    </span>
                  )}

                  <span className="inline-flex items-center gap-1 text-[11px] text-ink-muted dark:text-slate-400 ml-auto">
                    <Clock className="w-3 h-3 text-ink-subtle" />
                    {task.durationMinutes} min
                  </span>
                </div>

                <h4 className="text-sm sm:text-base font-semibold text-ink-primary dark:text-slate-100 truncate">
                  {task.title}
                </h4>

                <p className="text-xs text-ink-muted dark:text-slate-400 mt-1 line-clamp-1">
                  <span className="font-medium text-ink-secondary dark:text-slate-300">Min: </span>
                  {task.minimum || 'Start 2 min'}
                </p>
              </div>

              {/* Quick Actions */}
              <div className="flex items-center gap-1.5 self-center shrink-0">
                <button
                  type="button"
                  onClick={() => setCurrentTask(task.id)}
                  title="Make this your active task now"
                  className="p-2 rounded-xl text-ink-muted dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <ArrowUpRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    sounds.playMinimumComplete();
                    completeTask(task.id, 'minimum');
                  }}
                  title="Quick complete minimum"
                  className="p-2 rounded-xl text-ink-muted dark:text-slate-400 hover:text-gentle-green dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition-colors"
                >
                  <Check className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
