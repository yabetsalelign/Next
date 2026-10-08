'use client';

import React, { useState, useMemo } from 'react';
import { useApp } from '@/lib/store';
import { RotateCcw, Check, Minus, Sparkles, BookOpen, ChevronDown, ChevronUp } from 'lucide-react';

export default function HistoryPage() {
  const { returns, helpfulInsights, tasks, stuckLogs, resets, journalEntries } = useApp();
  const [showFullHistory, setShowFullHistory] = useState(false);

  const completedTasks = tasks.filter(t => t.completed);
  const minimumsCount = completedTasks.filter(t => t.completedTier === 'minimum').length;
  const returnedDays = returns.filter(r => r.status === 'returned').length;

  const topInsight = helpfulInsights.length > 0 
    ? [...helpfulInsights].sort((a, b) => b.count - a.count)[0] 
    : null;

  // Recent return days
  const recentReturns = useMemo(() => {
    return returns.filter(r => r.status === 'returned');
  }, [returns]);

  return (
    <div className="max-w-xl mx-auto space-y-6 animate-fade-in pb-10">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-[1.75rem] font-semibold tracking-tight text-ink-primary dark:text-slate-100">
          History
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-ink-muted dark:text-slate-400">
          Zero streak pressure. Returning matters more than streaks.
        </p>
      </div>

      {/* Your week summary */}
      <section className="p-6 rounded-3xl bg-surface dark:bg-surface-dark border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-2">
        <h2 className="text-xs font-bold uppercase tracking-wider text-ink-muted dark:text-slate-400">
          Your week
        </h2>
        <p className="text-2xl font-bold tracking-tight text-ink-primary dark:text-slate-100">
          You came back {returnedDays === 0 ? 'today' : `${returnedDays} ${returnedDays === 1 ? 'time' : 'times'}`}.
        </p>
        <p className="text-xs text-ink-muted dark:text-slate-400 leading-relaxed pt-0.5">
          Pauses are natural. Having an easy, low-guilt doorway to step through is what counts.
        </p>
      </section>

      {/* Things that helped & Minimums completed */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <section className="p-5 rounded-3xl bg-surface dark:bg-surface-dark border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-ink-muted dark:text-slate-400">
            Things that helped
          </h2>
          <p className="text-sm font-semibold text-ink-primary dark:text-slate-100 leading-relaxed">
            {topInsight 
              ? `${topInsight.label} made starting easier.`
              : '2-minute mini starts were easiest to begin.'}
          </p>
          <p className="text-[11px] text-ink-muted dark:text-slate-400">
            Helpful observation, never a judgment.
          </p>
        </section>

        <section className="p-5 rounded-3xl bg-surface dark:bg-surface-dark border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-ink-muted dark:text-slate-400">
            You completed
          </h2>
          <p className="text-2xl font-bold tracking-tight text-brand-600 dark:text-brand-400">
            {minimumsCount} minimums
          </p>
          <p className="text-[11px] text-ink-muted dark:text-slate-400">
            Every minimum counts as full progress.
          </p>
        </section>
      </div>

      {/* Recent returns */}
      <section className="p-5 rounded-3xl bg-surface dark:bg-surface-dark border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-ink-muted dark:text-slate-400">
          Recent returns
        </h2>

        {recentReturns.length === 0 ? (
          <div className="py-2 text-xs text-ink-muted dark:text-slate-400">
            You are here right now. When you pause and step back in, Next marks that gently.
          </div>
        ) : (
          <div className="space-y-2">
            {recentReturns.map((r, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 rounded-2xl bg-brand-50/50 dark:bg-brand-950/20 border border-brand-100 dark:border-brand-900/40 text-xs"
              >
                <div>
                  <span className="font-semibold text-brand-900 dark:text-brand-200 block">
                    {r.dayOfWeek}
                  </span>
                  <span className="text-ink-muted dark:text-slate-400">
                    {r.note || 'You came back after a pause.'}
                  </span>
                </div>
                <RotateCcw className="w-4 h-4 text-brand-600 dark:text-brand-400" />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* View all history toggle */}
      <div className="pt-2 text-center">
        <button
          type="button"
          onClick={() => setShowFullHistory(!showFullHistory)}
          className="inline-flex items-center gap-1.5 py-3 px-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-surface dark:bg-surface-dark text-xs font-semibold text-ink-primary dark:text-slate-100 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
        >
          <span>{showFullHistory ? 'Hide detailed history' : 'View all history'}</span>
          {showFullHistory ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Secondary Detailed History (Revealed on tap) */}
      {showFullHistory && (
        <div className="space-y-6 pt-2 animate-fade-in">
          {/* Weekly Rhythm Map */}
          <section className="p-5 rounded-3xl bg-surface dark:bg-surface-dark border border-slate-200/90 dark:border-slate-800 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-ink-muted dark:text-slate-400">
              Week Rhythm
            </h3>
            <div className="grid grid-cols-7 gap-1.5 pt-1">
              {returns.map((item) => {
                const isDone = item.status === 'active';
                const isPaused = item.status === 'paused';
                const isReturn = item.status === 'returned';

                return (
                  <div
                    key={item.dayOfWeek}
                    className={`flex flex-col items-center justify-center p-2 rounded-xl border text-center ${
                      isReturn
                        ? 'bg-brand-50 dark:bg-brand-950/60 border-brand-300 dark:border-brand-700 text-brand-700'
                        : isDone
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 text-gentle-green'
                        : 'bg-slate-50 dark:bg-slate-900/40 border-slate-200/60 text-ink-muted'
                    }`}
                  >
                    <span className="text-[10px] font-bold">{item.dayOfWeek}</span>
                    <div className="my-1.5">
                      {isDone && <Check className="w-3.5 h-3.5" />}
                      {isPaused && <Minus className="w-3.5 h-3.5" />}
                      {isReturn && <RotateCcw className="w-3.5 h-3.5" />}
                    </div>
                    <span className="text-[8px] opacity-75">{isReturn ? 'Return' : isDone ? 'Done' : 'Pause'}</span>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Journal Entries if any */}
          {journalEntries.length > 0 && (
            <section className="p-5 rounded-3xl bg-surface dark:bg-surface-dark border border-slate-200/90 dark:border-slate-800 space-y-3">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-ink-muted" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-ink-muted">
                  Journal Reflections
                </h3>
              </div>
              <div className="space-y-2.5">
                {journalEntries.slice(0, 3).map((entry) => (
                  <div key={entry.id} className="p-3 rounded-xl bg-slate-50/70 dark:bg-slate-900/40 border border-slate-200/60 text-xs space-y-1">
                    <p className="text-[11px] text-ink-muted italic">{entry.prompt}</p>
                    <p className="text-ink-secondary dark:text-slate-300">{entry.response}</p>
                    <p className="text-[10px] text-ink-subtle">{entry.date}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Archived Resets if any */}
          {resets.filter(r => r.archived).length > 0 && (
            <section className="p-5 rounded-3xl bg-surface dark:bg-surface-dark border border-slate-200/90 dark:border-slate-800 space-y-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-brand-500" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-ink-muted">
                  Past Resets
                </h3>
              </div>
              <div className="space-y-2">
                {resets.filter(r => r.archived).map((reset) => (
                  <div key={reset.id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200/60 text-xs flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-ink-primary dark:text-slate-100">{reset.name}</p>
                      <p className="text-[10px] text-ink-muted">{reset.startDate} → {reset.endDate}</p>
                    </div>
                    <span className="text-[11px] font-semibold text-brand-600">Saved</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Recent Unstick moments */}
          {stuckLogs.length > 0 && (
            <section className="p-5 rounded-3xl bg-surface dark:bg-surface-dark border border-slate-200/90 dark:border-slate-800 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-ink-muted">
                Unstick Moments
              </h3>
              <div className="space-y-2 text-xs">
                {stuckLogs.slice(0, 3).map((log) => (
                  <div key={log.id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200/60 flex items-center justify-between">
                    <span>{log.taskTitle || 'Task'}: <span className="text-ink-muted">{log.actionTaken}</span></span>
                    <span className="text-[10px] text-ink-subtle">Resolved</span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
