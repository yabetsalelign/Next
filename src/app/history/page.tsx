'use client';

import React from 'react';
import { useApp } from '@/lib/store';
import { RotateCcw, Check, Minus, Sparkles, Heart } from 'lucide-react';

export default function HistoryPage() {
  const { returns, helpfulInsights, tasks, stuckLogs } = useApp();

  const completedTasks = tasks.filter(t => t.completed);
  const minimumsCount = completedTasks.filter(t => t.completedTier === 'minimum').length;

  return (
    <div className="max-w-2xl mx-auto pb-24 md:pb-12 space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-ink-primary dark:text-slate-100">
          History & Returns
        </h1>
        <p className="text-xs sm:text-sm text-ink-muted dark:text-slate-400 mt-1">
          Zero streak pressure. We honor stopping and celebrate returning.
        </p>
      </div>

      {/* Gentle Philosophy Banner */}
      <section className="p-5 sm:p-6 rounded-3xl bg-brand-50/70 dark:bg-brand-950/40 border border-brand-100/80 dark:border-brand-900/60 space-y-2">
        <div className="flex items-center gap-2 text-brand-700 dark:text-brand-300">
          <RotateCcw className="w-4 h-4" />
          <h2 className="text-xs font-bold uppercase tracking-wider">
            The Return Philosophy
          </h2>
        </div>
        <p className="text-sm font-semibold text-ink-primary dark:text-slate-100 leading-snug">
          “You paused. Then you came back. That’s a return.”
        </p>
        <p className="text-xs text-ink-muted dark:text-slate-400 leading-relaxed">
          Life has ebbs and flows. Pausing is normal. What matters is having an easy, low-guilt doorway to step through when you are ready.
        </p>
      </section>

      {/* Weekly Returns Map */}
      <section className="p-6 rounded-3xl bg-surface dark:bg-surface-dark border border-slate-200/90 dark:border-slate-800 shadow-card space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-ink-muted dark:text-slate-400">
            This Week&apos;s Rhythm
          </h3>
          <div className="flex items-center gap-3 text-[11px] text-ink-subtle">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-gentle-green" /> Done
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-slate-300" /> Pause
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-brand-500" /> Return
            </span>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2 pt-2">
          {returns.map((item) => {
            const isDone = item.status === 'active';
            const isPaused = item.status === 'paused';
            const isReturn = item.status === 'returned';

            return (
              <div
                key={item.dayOfWeek}
                className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all ${
                  isReturn
                    ? 'bg-brand-50/80 dark:bg-brand-950/60 border-brand-300 dark:border-brand-700 text-brand-700 dark:text-brand-300'
                    : isDone
                    ? 'bg-gentle-greenBg/50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-gentle-green'
                    : 'bg-slate-50 dark:bg-slate-900/40 border-slate-200/60 dark:border-slate-800 text-ink-muted'
                }`}
              >
                <span className="text-[11px] font-bold tracking-wider">
                  {item.dayOfWeek}
                </span>

                <div className="my-2 flex items-center justify-center w-7 h-7 rounded-xl">
                  {isDone && <Check className="w-4 h-4 text-gentle-green" />}
                  {isPaused && <Minus className="w-4 h-4 text-slate-400" />}
                  {isReturn && <RotateCcw className="w-4 h-4 text-brand-600 dark:text-brand-400" />}
                </div>

                <span className="text-[9px] text-center font-medium opacity-80 truncate max-w-full">
                  {isReturn ? 'Return' : isDone ? 'Done' : 'Pause'}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Simple Summary Cards */}
      <section className="grid grid-cols-3 gap-3">
        <div className="p-4 sm:p-5 rounded-2xl bg-surface dark:bg-surface-dark border border-slate-200/80 dark:border-slate-800 text-center">
          <p className="text-2xl sm:text-3xl font-bold text-ink-primary dark:text-slate-100">
            {completedTasks.length + 3}
          </p>
          <p className="text-xs text-ink-muted dark:text-slate-400 mt-1">
            Tasks started
          </p>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-surface dark:bg-surface-dark border border-slate-200/80 dark:border-slate-800 text-center">
          <p className="text-2xl sm:text-3xl font-bold text-brand-600 dark:text-brand-400">
            {minimumsCount + 4}
          </p>
          <p className="text-xs text-ink-muted dark:text-slate-400 mt-1">
            Minimums done
          </p>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-surface dark:bg-surface-dark border border-slate-200/80 dark:border-slate-800 text-center">
          <p className="text-2xl sm:text-3xl font-bold text-ink-primary dark:text-slate-100">
            2
          </p>
          <p className="text-xs text-ink-muted dark:text-slate-400 mt-1">
            Gentle returns
          </p>
        </div>
      </section>

      {/* Descriptive "What Helped?" */}
      <section className="p-6 rounded-3xl bg-surface dark:bg-surface-dark border border-slate-200/90 dark:border-slate-800 shadow-card space-y-4">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-ink-muted dark:text-slate-400">
            What Helped?
          </h3>
          <p className="text-xs text-ink-subtle mt-0.5">
            Observations on supportive conditions, never a judgment.
          </p>
        </div>

        <div className="space-y-2.5">
          {helpfulInsights.map((factor) => (
            <div
              key={factor.id}
              className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50/70 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800"
            >
              <div className="flex items-center gap-3">
                <span className="text-lg select-none">{factor.icon}</span>
                <span className="text-sm font-medium text-ink-primary dark:text-slate-200">
                  {factor.label}
                </span>
              </div>
              <span className="text-xs font-semibold text-brand-700 dark:text-brand-300 bg-brand-50 dark:bg-brand-950 px-2.5 py-1 rounded-xl">
                {factor.count} times
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Friendly log of friction unblocked */}
      {stuckLogs.length > 0 && (
        <section className="p-6 rounded-3xl bg-surface dark:bg-surface-dark border border-slate-200/90 dark:border-slate-800 shadow-card space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-ink-muted dark:text-slate-400">
            Recent Unstick Moments
          </h3>
          <div className="space-y-2 text-xs">
            {stuckLogs.slice(0, 4).map((log) => (
              <div key={log.id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/40 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-ink-primary dark:text-slate-200">
                    {log.taskTitle || 'Task'}:
                  </span>{' '}
                  <span className="text-ink-muted">{log.actionTaken}</span>
                </div>
                <span className="text-[10px] text-ink-subtle">
                  Resolved gently
                </span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
