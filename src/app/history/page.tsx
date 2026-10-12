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

  // Recent return days
  const recentReturns = useMemo(() => {
    return returns.filter(r => r.status === 'returned');
  }, [returns]);

  // Check if there are any genuine insight observations recorded
  const hasRecordedInsights = useMemo(() => {
    return helpfulInsights.some(h => h.count > 0);
  }, [helpfulInsights]);

  // Max count for the "What Helped?" observational bar chart
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
        title="History & Returns"
        subtitle="Zero streak pressure. Returning matters more than streaks."
      />

      {/* Soulful Return Philosophy Banner */}
      <section className="p-5 sm:p-6 rounded-3xl bg-amber-500/10 dark:bg-amber-500/[0.08] border border-amber-500/25 dark:border-amber-500/20 space-y-2 shadow-sm">
        <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
          <RotateCcw className="w-4 h-4" />
          <h2 className="text-xs font-bold uppercase tracking-wider">
            The Return Philosophy
          </h2>
        </div>
        <p className="text-sm font-semibold text-ink-primary dark:text-linen leading-snug">
          &ldquo;You paused. Then you came back. That&rsquo;s a return.&rdquo;
        </p>
        <p className="text-xs text-ink-muted dark:text-linen-subtle leading-relaxed">
          Life naturally moves in cycles. Pausing is normal and guilt-free. Having an easy, low-barrier doorway to step through is what counts.
        </p>
      </section>

      {/* Summary Metric Cards with Flawless Pluralization */}
      <section aria-label="Weekly summary counts" className="grid grid-cols-3 gap-2.5 sm:gap-3.5">
        <div className="p-4 sm:p-5 rounded-3xl bg-surface dark:bg-surface-dark border border-stone-200/90 dark:border-white/[0.08] text-center shadow-sm">
          <p className="text-2xl sm:text-3xl font-bold tracking-tight text-sage-600 dark:text-sage-400">
            {completedTasks.length}
          </p>
          <p className="text-[11px] font-medium text-ink-muted dark:text-linen-subtle mt-1">
            {completedTasks.length === 1 ? 'Task completed' : 'Tasks completed'}
          </p>
        </div>

        <div className="p-4 sm:p-5 rounded-3xl bg-surface dark:bg-surface-dark border border-stone-200/90 dark:border-white/[0.08] text-center shadow-sm">
          <p className="text-2xl sm:text-3xl font-bold tracking-tight text-amber-600 dark:text-amber-400">
            {minimumsCount}
          </p>
          <p className="text-[11px] font-medium text-ink-muted dark:text-linen-subtle mt-1">
            {minimumsCount === 1 ? 'Minimum done' : 'Minimums done'}
          </p>
        </div>

        <div className="p-4 sm:p-5 rounded-3xl bg-surface dark:bg-surface-dark border border-stone-200/90 dark:border-white/[0.08] text-center shadow-sm">
          <p className="text-2xl sm:text-3xl font-bold tracking-tight text-terracotta">
            {returnedDays}
          </p>
          <p className="text-[11px] font-medium text-ink-muted dark:text-linen-subtle mt-1">
            {returnedDays === 1 ? 'Gentle return' : 'Gentle returns'}
          </p>
        </div>
      </section>

      {/* This Week's Rhythm: Dynamic Local Calendar Week Pill Visualizer */}
      <section className="p-6 rounded-3xl bg-surface dark:bg-surface-dark border border-stone-200/90 dark:border-white/[0.08] shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-ink-muted dark:text-linen-subtle">
              This Week&apos;s Rhythm
            </h2>
            <p className="text-[11px] text-ink-subtle dark:text-linen-faint mt-0.5">
              Momentum without pressure. Every return is marked.
            </p>
          </div>

          {/* High-Contrast Legend */}
          <div className="flex items-center gap-3 text-[11px] font-medium shrink-0">
            <span className="flex items-center gap-1.5 text-sage-700 dark:text-sage-400">
              <span className="w-2 h-2 rounded-full bg-sage-500 shadow-[0_0_6px_rgba(78,155,120,0.4)]" /> Done
            </span>
            <span className="flex items-center gap-1.5 text-ink-muted dark:text-linen-subtle">
              <span className="w-2 h-2 rounded-full bg-stone-300 dark:bg-white/20" /> Pause
            </span>
            <span className="flex items-center gap-1.5 text-amber-700 dark:text-amber-400">
              <span className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_6px_rgba(229,149,63,0.4)]" /> Return
            </span>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1.5 sm:gap-2 pt-1">
          {currentWeekDays.map((item) => {
            const isDone = item.status === 'active';
            const isReturn = item.status === 'returned';
            const isUpcoming = item.status === 'upcoming';
            const isPaused = item.status === 'paused';

            return (
              <div
                key={item.dateStr}
                className={`flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-2xl border transition-all ${
                  item.isToday ? 'ring-2 ring-amber-500/40 ring-offset-1 dark:ring-offset-stone-900' : ''
                } ${
                  isReturn
                    ? 'bg-amber-500/15 dark:bg-amber-500/20 border-amber-500/40 text-amber-800 dark:text-amber-300 shadow-[0_2px_10px_rgba(229,149,63,0.12)]'
                    : isDone
                    ? 'bg-sage-500/15 dark:bg-sage-500/20 border-sage-500/35 text-sage-800 dark:text-sage-300 shadow-[0_2px_10px_rgba(78,155,120,0.12)]'
                    : isUpcoming
                    ? 'bg-stone-50/40 dark:bg-white/[0.01] border-stone-200/40 dark:border-white/[0.03] text-ink-subtle dark:text-linen-faint opacity-50'
                    : 'bg-stone-100/70 dark:bg-white/[0.03] border-stone-200/70 dark:border-white/[0.06] text-ink-muted dark:text-linen-subtle'
                }`}
              >
                <span className="text-[10px] sm:text-[11px] font-bold tracking-wider">
                  {item.dayOfWeek}
                </span>

                <div className="my-2 flex items-center justify-center w-7 h-7 rounded-xl">
                  {isDone && <Check className="w-4 h-4 stroke-[2.5]" />}
                  {isPaused && <Minus className="w-4 h-4 stroke-[2]" />}
                  {isReturn && <RotateCcw className="w-4 h-4 stroke-[2.2]" />}
                  {isUpcoming && <span className="w-1.5 h-1.5 rounded-full bg-stone-300 dark:bg-white/20" />}
                </div>

                <span className="text-[9px] text-center font-semibold tracking-tight opacity-90">
                  {isReturn ? 'Return' : isDone ? 'Done' : isUpcoming ? 'Later' : 'Pause'}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* "What Helped?" Observational Metrics with Horizontal Bars */}
      <section className="p-6 rounded-3xl bg-surface dark:bg-surface-dark border border-stone-200/90 dark:border-white/[0.08] shadow-sm space-y-4">
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-ink-muted dark:text-linen-subtle">
            What Helped?
          </h2>
          <p className="text-xs text-ink-subtle dark:text-linen-faint mt-0.5">
            Observations on supportive conditions, never a judgment.
          </p>
        </div>

        {!hasRecordedInsights ? (
          <div className="py-6 px-4 rounded-2xl bg-stone-50/80 dark:bg-white/[0.02] border border-stone-200/60 dark:border-white/[0.04] text-center space-y-1.5">
            <p className="text-xs font-semibold text-ink-primary dark:text-linen">
              No observations recorded yet
            </p>
            <p className="text-xs text-ink-muted dark:text-linen-subtle max-w-sm mx-auto leading-relaxed">
              As you use 2-minute mini starts, background audio, or body doubling, supportive conditions will appear here quietly.
            </p>
          </div>
        ) : (
          <div className="space-y-3 pt-1">
            {helpfulInsights.filter(f => f.count > 0).map((factor) => {
              const Icon = getInsightIcon(factor.id, factor.label);
              const percentage = Math.round((factor.count / maxInsightCount) * 100);

              return (
                <div
                  key={factor.id}
                  className="p-3.5 rounded-2xl bg-stone-50/80 dark:bg-white/[0.03] border border-stone-200/60 dark:border-white/[0.06] space-y-2 transition-all hover:border-stone-300 dark:hover:border-white/[0.12]"
                >
                  <div className="flex items-center justify-between gap-3 text-xs sm:text-sm">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-7 h-7 rounded-xl bg-amber-500/10 dark:bg-amber-500/15 text-amber-700 dark:text-amber-400 flex items-center justify-center shrink-0">
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="font-medium text-ink-primary dark:text-linen truncate">
                        {factor.label}
                      </span>
                    </div>
                    <span className="text-xs font-bold text-amber-800 dark:text-amber-300 bg-amber-500/15 dark:bg-amber-500/20 px-2.5 py-1 rounded-xl shrink-0">
                      {factor.count} {factor.count === 1 ? 'time' : 'times'}
                    </span>
                  </div>

                  {/* Horizontal Progress Bar */}
                  <div className="w-full h-1.5 rounded-full bg-stone-200/70 dark:bg-white/[0.08] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-400 transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Recent Returns Log */}
      <section className="p-5 sm:p-6 rounded-3xl bg-surface dark:bg-surface-dark border border-stone-200/90 dark:border-white/[0.08] shadow-sm space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-ink-muted dark:text-linen-subtle">
          Recent Returns
        </h2>

        {recentReturns.length === 0 ? (
          <div className="py-3 px-4 rounded-2xl bg-stone-50/60 dark:bg-white/[0.02] border border-stone-200/50 dark:border-white/[0.04] text-xs text-ink-muted dark:text-linen-subtle text-center">
            You are here right now. When you take a pause and step back in, Next marks that gently.
          </div>
        ) : (
          <div className="space-y-2">
            {recentReturns.map((r, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-amber-500/[0.06] dark:bg-amber-500/[0.08] border border-amber-500/20 text-xs"
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

      {/* Progressive Disclosure Toggle for Detailed Logs */}
      <div className="pt-2 text-center">
        <button
          type="button"
          onClick={() => setShowFullHistory(!showFullHistory)}
          className="inline-flex items-center gap-1.5 py-3 px-5 rounded-2xl border border-stone-200/90 dark:border-white/[0.08] bg-surface dark:bg-surface-dark text-xs font-semibold text-ink-primary dark:text-linen shadow-sm hover:bg-stone-50 dark:hover:bg-white/[0.04] transition-colors"
        >
          <span>{showFullHistory ? 'Hide detailed reflections' : 'View reflections & archives'}</span>
          {showFullHistory ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Secondary Detailed History (Revealed on tap) */}
      {showFullHistory && (
        <div className="space-y-6 pt-2 animate-fade-in">
          {/* Journal Reflections if any */}
          {journalEntries.length > 0 && (
            <section className="p-5 rounded-3xl bg-surface dark:bg-surface-dark border border-stone-200/90 dark:border-white/[0.08] space-y-3">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-ink-muted dark:text-linen-subtle" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-ink-muted dark:text-linen-subtle">
                  Journal Reflections
                </h3>
              </div>
              <div className="space-y-2.5">
                {journalEntries.slice(0, 3).map((entry) => (
                  <div key={entry.id} className="p-3.5 rounded-xl bg-stone-50/70 dark:bg-white/[0.03] border border-stone-200/60 dark:border-white/[0.06] text-xs space-y-1">
                    <p className="text-[11px] text-ink-muted dark:text-linen-subtle italic">{entry.prompt}</p>
                    <p className="text-ink-secondary dark:text-linen">{entry.response}</p>
                    <p className="text-[10px] text-ink-subtle dark:text-linen-faint">{entry.date}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Archived Resets if any */}
          {resets.filter(r => r.archived).length > 0 && (
            <section className="p-5 rounded-3xl bg-surface dark:bg-surface-dark border border-stone-200/90 dark:border-white/[0.08] space-y-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-ink-muted dark:text-linen-subtle">
                  Past Resets
                </h3>
              </div>
              <div className="space-y-2">
                {resets.filter(r => r.archived).map((reset) => (
                  <div key={reset.id} className="p-3.5 rounded-xl bg-stone-50 dark:bg-white/[0.03] border border-stone-200/60 dark:border-white/[0.06] text-xs flex items-center justify-between">
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

          {/* Recent Unstick moments */}
          {stuckLogs.length > 0 && (
            <section className="p-5 rounded-3xl bg-surface dark:bg-surface-dark border border-stone-200/90 dark:border-white/[0.08] space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-ink-muted dark:text-linen-subtle">
                Unstick Moments
              </h3>
              <div className="space-y-2 text-xs">
                {stuckLogs.slice(0, 3).map((log) => (
                  <div key={log.id} className="p-3.5 rounded-xl bg-stone-50 dark:bg-white/[0.03] border border-stone-200/60 dark:border-white/[0.06] flex items-center justify-between">
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
