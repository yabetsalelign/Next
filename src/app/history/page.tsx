'use client';

import React, { useState, useMemo } from 'react';
import { useApp } from '@/lib/store';
import { Header } from '@/components/layout/Header';
import {
  getCurrentWeekDateStrings,
  getLocalDateString,
  formatDayOfWeek,
  isSameDay,
  isAfterDay,
} from '@/lib/dateUtils';
import { 
  RotateCcw, 
  Check, 
  Minus, 
  Sparkles, 
  BookOpen, 
  ChevronDown, 
  ChevronUp, 
  Timer, 
  Users, 
  Headphones, 
  Coffee, 
  ListTree 
} from 'lucide-react';

export default function HistoryPage() {
  const { returns, helpfulInsights, tasks, stuckLogs, resets, journalEntries } = useApp();
  const [showFullHistory, setShowFullHistory] = useState(false);

  const completedTasks = tasks.filter(t => t.completed);
  const minimumsCount = completedTasks.filter(t => t.completedTier === 'minimum').length;
  const returnedDays = returns.filter(r => r.status === 'returned').length;

  const todayStr = useMemo(() => getLocalDateString(), []);

  // Generate current local calendar week (MON to SUN)
  const currentWeekDays = useMemo(() => {
    const dates = getCurrentWeekDateStrings();
    return dates.map(dateStr => {
      const dayOfWeek = formatDayOfWeek(dateStr);
      const isToday = isSameDay(dateStr, todayStr);
      const isFuture = isAfterDay(dateStr, todayStr);
      const record = returns.find(r => r.dateStr === dateStr);
      
      let status: 'active' | 'paused' | 'returned' | 'upcoming' = 'paused';
      if (record?.status === 'returned') {
        status = 'returned';
      } else if (record?.status === 'active') {
        status = 'active';
      } else if (isFuture) {
        status = 'upcoming';
      }

      return {
        dateStr,
        dayOfWeek,
        isToday,
        isFuture,
        status,
        note: record?.note,
      };
    });
  }, [returns, todayStr]);

  const recentReturns = useMemo(() => {
    return returns.filter(r => r.status === 'returned');
  }, [returns]);

  const hasRecordedInsights = useMemo(() => {
    return helpfulInsights.some(h => h.count > 0);
  }, [helpfulInsights]);

  const maxInsightCount = useMemo(() => {
    if (helpfulInsights.length === 0) return 1;
    return Math.max(...helpfulInsights.map(h => h.count), 1);
  }, [helpfulInsights]);

  const getInsightIcon = (id: string, label: string) => {
    const l = label.toLowerCase();
    if (id === 'h1' || l.includes('minute') || l.includes('start')) return Timer;
    if (id === 'h2' || l.includes('body double') || l.includes('nearby')) return Users;
    if (id === 'h3' || l.includes('headphone') || l.includes('noise')) return Headphones;
    if (id === 'h4' || l.includes('rest')) return Coffee;
    if (id === 'h5' || l.includes('step') || l.includes('break')) return ListTree;
    return Sparkles;
  };

  return (
    <div className="max-w-xl mx-auto space-y-6 animate-fade-in pb-28 md:pb-12">
      {/* Header */}
      <Header
        title="History & Reflection"
        subtitle="Returning matters more than unbroken lines."
      />

      {/* The Return Philosophy Banner */}
      <section className="p-4 sm:p-5 rounded-xl bg-amber-500/[0.08] dark:bg-amber-500/[0.08] border border-amber-500/25 space-y-2 shadow-sm">
        <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300">
          <RotateCcw className="w-4 h-4" />
          <h2 className="text-xs font-bold uppercase tracking-wider">
            The Return Philosophy
          </h2>
        </div>
        <p className="text-sm font-semibold text-ink-primary dark:text-linen leading-snug">
          &ldquo;You paused. Then you came back. That&rsquo;s a return.&rdquo;
        </p>
        <p className="text-xs text-ink-muted dark:text-linen-subtle leading-relaxed">
          Life naturally moves in cycles. Pausing is normal and guilt-free. We record continuity of presence, never the rigidity of an unbroken line.
        </p>
      </section>

      {/* Summary Metric Cards */}
      <section aria-label="Weekly summary counts" className="grid grid-cols-3 gap-2.5">
        <div className="p-3.5 sm:p-4 rounded-xl bg-surface dark:bg-surface-dark border border-stone-200/90 dark:border-white/[0.08] text-center shadow-sm">
          <p className="text-2xl font-bold tracking-tight text-sage-600 dark:text-sage-400">
            {completedTasks.length}
          </p>
          <p className="text-[11px] font-medium text-ink-muted dark:text-linen-subtle mt-1">
            {completedTasks.length === 1 ? 'Task done' : 'Tasks done'}
          </p>
        </div>

        <div className="p-3.5 sm:p-4 rounded-xl bg-surface dark:bg-surface-dark border border-stone-200/90 dark:border-white/[0.08] text-center shadow-sm">
          <p className="text-2xl font-bold tracking-tight text-amber-600 dark:text-amber-400">
            {minimumsCount}
          </p>
          <p className="text-[11px] font-medium text-ink-muted dark:text-linen-subtle mt-1">
            {minimumsCount === 1 ? 'Minimum done' : 'Minimums done'}
          </p>
        </div>

        <div className="p-3.5 sm:p-4 rounded-xl bg-surface dark:bg-surface-dark border border-stone-200/90 dark:border-white/[0.08] text-center shadow-sm">
          <p className="text-2xl font-bold tracking-tight text-terracotta">
            {returnedDays}
          </p>
          <p className="text-[11px] font-medium text-ink-muted dark:text-linen-subtle mt-1">
            {returnedDays === 1 ? 'Gentle return' : 'Gentle returns'}
          </p>
        </div>
      </section>

      {/* Centerpiece: Timeline & Weekly Rhythm */}
      <section className="p-4 sm:p-5 rounded-xl bg-surface dark:bg-surface-dark border border-stone-200/90 dark:border-white/[0.08] shadow-sm space-y-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-ink-muted dark:text-linen-subtle">
              This Week&apos;s Rhythm
            </h2>
            <p className="text-[11px] text-ink-subtle dark:text-linen-faint mt-0.5">
              Every return is celebrated. No reset streaks.
            </p>
          </div>

          {/* High-Contrast Legend */}
          <div className="flex items-center gap-3 text-[11px] font-medium shrink-0">
            <span className="flex items-center gap-1 text-sage-700 dark:text-sage-400">
              <span className="w-2 h-2 rounded-full bg-sage-500" /> Done
            </span>
            <span className="flex items-center gap-1 text-ink-muted dark:text-linen-subtle">
              <span className="w-2 h-2 rounded-full bg-stone-300 dark:bg-white/20" /> Pause
            </span>
            <span className="flex items-center gap-1 text-amber-700 dark:text-amber-400">
              <span className="w-2 h-2 rounded-full bg-amber-500" /> Return
            </span>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1.5 pt-1">
          {currentWeekDays.map((item) => {
            const isDone = item.status === 'active';
            const isReturn = item.status === 'returned';
            const isUpcoming = item.status === 'upcoming';
            const isPaused = item.status === 'paused';

            return (
              <div
                key={item.dateStr}
                className={`flex min-h-[78px] w-full flex-col items-center justify-center rounded-lg border p-1.5 text-center transition-all ${
                  item.isToday ? 'ring-2 ring-amber-500/50 ring-offset-1 dark:ring-offset-stone-900' : ''
                } ${
                  isReturn
                    ? 'bg-amber-500/15 dark:bg-amber-500/20 border-amber-500/40 text-amber-900 dark:text-amber-300'
                    : isDone
                    ? 'bg-sage-500/15 dark:bg-sage-500/20 border-sage-500/35 text-sage-900 dark:text-sage-300'
                    : isUpcoming
                    ? 'bg-stone-50/40 dark:bg-white/[0.01] border-stone-200/40 dark:border-white/[0.03] text-ink-subtle dark:text-linen-faint opacity-50'
                    : 'bg-stone-100/70 dark:bg-white/[0.03] border-stone-200/70 dark:border-white/[0.06] text-ink-muted dark:text-linen-subtle'
                }`}
              >
                <span className="text-[10px] font-bold tracking-wider leading-tight">
                  {item.dayOfWeek}
                </span>

                <div className="my-1.5 flex items-center justify-center w-6 h-6 rounded-md">
                  {isDone && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
                  {isPaused && <Minus className="w-3.5 h-3.5 stroke-[2]" />}
                  {isReturn && <RotateCcw className="w-3.5 h-3.5 stroke-[2.2]" />}
                  {isUpcoming && <span className="w-1.5 h-1.5 rounded-full bg-stone-300 dark:bg-white/20" />}
                </div>

                <span className="text-[9px] font-semibold tracking-tight">
                  {isReturn ? 'Return' : isDone ? 'Done' : isUpcoming ? 'Later' : 'Pause'}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Recent Returns Log */}
      <section className="p-4 sm:p-5 rounded-xl bg-surface dark:bg-surface-dark border border-stone-200/90 dark:border-white/[0.08] shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-ink-muted dark:text-linen-subtle">
            Recent Returns
          </h2>
          <span className="text-xs text-amber-700 dark:text-amber-400 font-medium">
            Recorded continuity
          </span>
        </div>

        {recentReturns.length === 0 ? (
          <div className="py-3 px-4 rounded-lg bg-stone-50/60 dark:bg-white/[0.02] border border-stone-200/50 dark:border-white/[0.04] text-xs text-ink-muted dark:text-linen-subtle text-center">
            You are here right now. When you take a pause and step back in, Next marks that gently.
          </div>
        ) : (
          <div className="space-y-2">
            {recentReturns.map((r, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 rounded-lg bg-amber-500/[0.06] dark:bg-amber-500/[0.08] border border-amber-500/20 text-xs"
              >
                <div>
                  <span className="font-semibold text-amber-900 dark:text-amber-300 block">
                    {r.dayOfWeek} • {r.dateStr}
                  </span>
                  <span className="text-ink-muted dark:text-linen-subtle">
                    {r.note || 'You came back after a pause.'}
                  </span>
                </div>
                <RotateCcw className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* "What Helped?" Observational Metrics */}
      <section className="p-4 sm:p-5 rounded-xl bg-surface dark:bg-surface-dark border border-stone-200/90 dark:border-white/[0.08] shadow-sm space-y-3">
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-ink-muted dark:text-linen-subtle">
            Supportive Patterns Noticed
          </h2>
          <p className="text-xs text-ink-subtle dark:text-linen-faint mt-0.5">
            Observations on supportive conditions, never a judgment.
          </p>
        </div>

        {!hasRecordedInsights ? (
          <div className="py-5 px-4 rounded-lg bg-stone-50/80 dark:bg-white/[0.02] border border-stone-200/60 dark:border-white/[0.04] text-center space-y-1">
            <p className="text-xs font-semibold text-ink-primary dark:text-linen">
              No conditions logged yet
            </p>
            <p className="text-xs text-ink-muted dark:text-linen-subtle max-w-xs mx-auto leading-relaxed">
              As you use the 2-minute start, body checks, and unstick tools, supportive patterns will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-2.5 pt-1">
            {helpfulInsights.filter(f => f.count > 0).map((factor) => {
              const Icon = getInsightIcon(factor.id, factor.label);
              const percentage = Math.round((factor.count / maxInsightCount) * 100);

              return (
                <div
                  key={factor.id}
                  className="p-3 rounded-lg bg-stone-50/80 dark:bg-white/[0.03] border border-stone-200/60 dark:border-white/[0.06] space-y-2"
                >
                  <div className="flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-6 h-6 rounded-md bg-amber-500/10 text-amber-700 dark:text-amber-400 flex items-center justify-center shrink-0">
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <span className="font-medium text-ink-primary dark:text-linen truncate">
                        {factor.label}
                      </span>
                    </div>
                    <span className="text-[11px] font-bold text-amber-800 dark:text-amber-300 bg-amber-500/15 px-2 py-0.5 rounded-md shrink-0">
                      {factor.count} {factor.count === 1 ? 'time' : 'times'}
                    </span>
                  </div>

                  <div className="w-full h-1.5 rounded-full bg-stone-200/70 dark:bg-white/[0.08] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-amber-500 transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Progressive Disclosure Toggle for Detailed History */}
      <div className="pt-1 text-center">
        <button
          type="button"
          onClick={() => setShowFullHistory(!showFullHistory)}
          className="inline-flex items-center gap-1.5 py-2.5 px-4 rounded-xl border border-stone-200/90 dark:border-white/[0.08] bg-surface dark:bg-surface-dark text-xs font-semibold text-ink-primary dark:text-linen shadow-sm hover:bg-stone-50 dark:hover:bg-white/[0.04] transition-colors"
        >
          <span>{showFullHistory ? 'Hide reflections & archives' : 'View reflections & archives'}</span>
          {showFullHistory ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Secondary Detailed History */}
      {showFullHistory && (
        <div className="space-y-4 pt-1 animate-fade-in">
          {journalEntries.length > 0 && (
            <section className="p-4 rounded-xl bg-surface dark:bg-surface-dark border border-stone-200/90 dark:border-white/[0.08] space-y-2.5 shadow-sm">
              <div className="flex items-center gap-2 text-ink-muted dark:text-linen-subtle">
                <BookOpen className="w-4 h-4" />
                <h3 className="text-xs font-bold uppercase tracking-wider">
                  Journal Reflections
                </h3>
              </div>
              <div className="space-y-2">
                {journalEntries.slice(0, 3).map((entry) => (
                  <div key={entry.id} className="p-3 rounded-lg bg-stone-50/70 dark:bg-white/[0.03] border border-stone-200/60 dark:border-white/[0.06] text-xs space-y-1">
                    <p className="text-[11px] text-ink-muted dark:text-linen-subtle italic">{entry.prompt}</p>
                    <p className="text-ink-secondary dark:text-linen">{entry.response}</p>
                    <p className="text-[10px] text-ink-subtle dark:text-linen-faint">{entry.date}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {resets.filter(r => r.archived).length > 0 && (
            <section className="p-4 rounded-xl bg-surface dark:bg-surface-dark border border-stone-200/90 dark:border-white/[0.08] space-y-2.5 shadow-sm">
              <div className="flex items-center gap-2 text-amber-500">
                <Sparkles className="w-4 h-4" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-ink-muted dark:text-linen-subtle">
                  Past Resets
                </h3>
              </div>
              <div className="space-y-2">
                {resets.filter(r => r.archived).map((reset) => (
                  <div key={reset.id} className="p-3 rounded-lg bg-stone-50 dark:bg-white/[0.03] border border-stone-200/60 dark:border-white/[0.06] text-xs flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-ink-primary dark:text-linen">{reset.name}</p>
                      <p className="text-[10px] text-ink-muted dark:text-linen-subtle">{reset.startDate} → {reset.endDate}</p>
                    </div>
                    <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400">Saved</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {stuckLogs.length > 0 && (
            <section className="p-4 rounded-xl bg-surface dark:bg-surface-dark border border-stone-200/90 dark:border-white/[0.08] space-y-2.5 shadow-sm">
              <h3 className="text-xs font-bold uppercase tracking-wider text-ink-muted dark:text-linen-subtle">
                Resolved Stuck Moments
              </h3>
              <div className="space-y-2 text-xs">
                {stuckLogs.slice(0, 3).map((log) => (
                  <div key={log.id} className="p-3 rounded-lg bg-stone-50 dark:bg-white/[0.03] border border-stone-200/60 dark:border-white/[0.06] flex items-center justify-between">
                    <span>
                      <strong className="text-ink-primary dark:text-linen">{log.taskTitle || 'Task'}:</strong>{' '}
                      <span className="text-ink-muted dark:text-linen-subtle">{log.actionTaken}</span>
                    </span>
                    <span className="text-[10px] text-ink-subtle dark:text-linen-faint">Resolved</span>
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
