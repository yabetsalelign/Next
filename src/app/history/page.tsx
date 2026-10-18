'use client';

import React, { useMemo } from 'react';
import { Check, RotateCcw, BookOpen } from 'lucide-react';
import { useApp } from '@/lib/store';
import { Header } from '@/components/layout/Header';
import { getCurrentWeekDateStrings, getLocalDateString, formatDayOfWeek, isSameDay } from '@/lib/dateUtils';

export default function HistoryPage() {
  const { returns, helpfulInsights, tasks, journalEntries } = useApp();
  const today = useMemo(() => getLocalDateString(), []);
  const completedTasks = tasks.filter((task) => task.completed);
  const minimums = completedTasks.filter((task) => task.completedTier === 'minimum').length;
  const returnedDays = returns.filter((day) => day.status === 'returned').length;
  const completedToday = completedTasks.some((task) => task.completedAt && isSameDay(task.completedAt, today));
  const week = useMemo(() => getCurrentWeekDateStrings().map((date) => {
    const record = returns.find((item) => item.dateStr === date);
    const didWork = tasks.some((task) => task.completed && task.completedAt && isSameDay(task.completedAt, date));
    return { date, day: formatDayOfWeek(date).slice(0, 2), isToday: date === today, state: record?.status === 'returned' ? 'return' : didWork || record?.status === 'active' ? 'done' : 'quiet' } as const;
  }), [returns, tasks, today]);
  const recentCompletions = [...completedTasks].sort((a, b) => (b.completedAt || '').localeCompare(a.completedAt || '')).slice(0, 8);
  const recordedFactors = helpfulInsights.filter((factor) => factor.count > 0).sort((a, b) => b.count - a.count);

  return (
    <div className="min-h-full bg-background text-on-surface flex flex-col">
      <Header />
      <main className="w-full max-w-xl mx-auto flex-1 px-5 pt-[calc(6rem+var(--sat))] pb-36 sm:px-8">
        <div className="space-y-8">
          <header>
            <p className="text-sm font-medium text-primary">Your history</p>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight">A record of showing up.</h1>
            <p className="mt-2 text-base text-on-surface-variant">Pauses are part of the picture. There are no streaks to protect.</p>
          </header>

          <section className="grid grid-cols-3 divide-x divide-outline-variant rounded-2xl border border-outline-variant bg-surface-container-low py-4" aria-label="Saved activity totals">
            {[{ value: completedTasks.length, label: 'Tasks done' }, { value: minimums, label: 'Minimum steps' }, { value: returnedDays, label: 'Returns' }].map((item) => <div key={item.label} className="px-2 text-center"><div className="text-2xl font-semibold tabular-nums">{item.value}</div><div className="mt-1 text-xs sm:text-sm text-on-surface-variant">{item.label}</div></div>)}
          </section>

          <section className="space-y-3">
            <div><h2 className="text-xl font-semibold">This week</h2><p className="text-sm text-on-surface-variant mt-1">Days with saved activity, returns, or room to rest.</p></div>
            <div className="grid grid-cols-7 gap-2">
              {week.map((day) => <div key={day.date} className={`min-h-20 rounded-xl border px-1 py-2 flex flex-col items-center justify-between ${day.isToday ? 'border-primary/50 bg-primary/10' : 'border-outline-variant bg-surface-container-low'}`}>
                <span className="text-xs font-medium text-on-surface-variant">{day.day}</span>
                {day.state === 'done' ? <Check size={17} className="text-secondary" /> : day.state === 'return' ? <RotateCcw size={16} className="text-primary" /> : <span className="text-on-surface-variant">·</span>}
                <span className="text-[11px] text-on-surface-variant">{day.state === 'done' ? 'Done' : day.state === 'return' ? 'Return' : day.isToday ? (completedToday ? 'Done' : 'Today') : 'Rest'}</span>
              </div>)}
            </div>
          </section>

          <section className="space-y-3">
            <div><h2 className="text-xl font-semibold">Completed tasks</h2><p className="text-sm text-on-surface-variant mt-1">Recent saved completions.</p></div>
            {recentCompletions.length > 0 ? <ul className="divide-y divide-outline-variant border-y border-outline-variant">{recentCompletions.map((task) => <li key={task.id} className="py-3 flex items-start gap-3"><span className="mt-0.5 w-7 h-7 rounded-full bg-secondary/10 text-secondary grid place-items-center shrink-0"><Check size={16} /></span><span className="min-w-0 flex-1"><span className="block font-medium break-words">{task.title}</span><span className="block mt-1 text-sm text-on-surface-variant">{task.completedAt ? new Date(task.completedAt).toLocaleDateString() : 'Date not recorded'}{task.completedTier === 'minimum' ? ' · Minimum counted' : ''}</span></span></li>)}</ul> : <p className="py-4 border-y border-outline-variant text-on-surface-variant">Completed tasks will appear here as you record them.</p>}
          </section>

          <section className="space-y-3">
            <div><h2 className="text-xl font-semibold">What has helped</h2><p className="text-sm text-on-surface-variant mt-1">Only factors you have recorded appear here.</p></div>
            {recordedFactors.length ? <ul className="divide-y divide-outline-variant border-y border-outline-variant">{recordedFactors.map((factor) => <li key={factor.id} className="py-3 flex items-center justify-between gap-3"><span className="font-medium">{factor.label}</span><span className="text-sm text-on-surface-variant">{factor.count} {factor.count === 1 ? 'time' : 'times'}</span></li>)}</ul> : <p className="py-4 border-y border-outline-variant text-on-surface-variant">No helpful factors recorded yet. You can add them as you go.</p>}
          </section>

          <section className="space-y-3">
            <div className="flex items-center gap-2"><BookOpen size={19} className="text-primary" /><h2 className="text-xl font-semibold">Reflections</h2></div>
            {journalEntries.length ? <div className="space-y-3">{[...journalEntries].sort((a, b) => b.date.localeCompare(a.date)).map((entry) => <article key={entry.id} className="rounded-2xl bg-surface-container-low border border-outline-variant p-4"><p className="text-sm text-on-surface-variant">{entry.date} · {entry.prompt}</p><p className="mt-2 leading-relaxed break-words">{entry.response}</p></article>)}</div> : <p className="py-4 border-y border-outline-variant text-on-surface-variant">Saved reflections will be here when you write one.</p>}
          </section>
        </div>
      </main>
    </div>
  );
}
