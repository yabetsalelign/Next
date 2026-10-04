'use client';

import React from 'react';
import { useApp } from '@/lib/store';
import { Header } from '@/components/layout/Header';
import { CurrentTaskCard } from '@/components/today/CurrentTaskCard';
import { UpNextTimeline } from '@/components/today/UpNextTimeline';
import { TodayEmptyState } from '@/components/today/TodayEmptyState';
import { Sparkles, Check, ChevronRight } from 'lucide-react';

function ActiveResetCard() {
  const { activeReset, openModal } = useApp();
  if (!activeReset) return null;

  const today = new Date().toISOString().split('T')[0];
  const currentDayIdx = activeReset.days.findIndex(d => d.date === today);
  const currentDay = activeReset.days[Math.max(0, currentDayIdx)];
  const dayNumber = currentDayIdx >= 0 ? currentDayIdx + 1 : activeReset.totalDays;

  const required = currentDay?.tasks.filter(t => !t.isOptional) ?? [];
  const completed = required.filter(t => t.completed);

  return (
    <button
      type="button"
      onClick={() => openModal('fresh_start')}
      className="w-full flex items-center gap-3 p-4 rounded-2xl bg-brand-50/70 dark:bg-brand-950/40 border border-brand-200/70 dark:border-brand-800/60 text-left transition-all hover:bg-brand-50 dark:hover:bg-brand-950/60 active:scale-[0.99] mb-4"
      aria-label="View active reset"
    >
      <div className="w-9 h-9 rounded-xl bg-brand-600 text-white flex items-center justify-center shrink-0 shadow-sm">
        <Sparkles className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-1.5">
          <p className="text-xs font-bold text-brand-700 dark:text-brand-300 truncate">{activeReset.name}</p>
          <span className="text-[11px] text-brand-600/70 dark:text-brand-400/70 shrink-0">
            Day {dayNumber} / {activeReset.totalDays}
          </span>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <div className="flex-1 h-1.5 rounded-full bg-brand-200/60 dark:bg-brand-900/60 overflow-hidden">
            <div
              className="h-full rounded-full bg-brand-500 transition-all"
              style={{ width: `${required.length > 0 ? (completed.length / required.length) * 100 : 0}%` }}
            />
          </div>
          <span className="text-[11px] text-brand-600 dark:text-brand-400 font-semibold shrink-0">
            {completed.length} / {required.length}
          </span>
        </div>
      </div>
      <ChevronRight className="w-4 h-4 text-brand-500/70 shrink-0" />
    </button>
  );
}

export default function TodayPage() {
  const { currentTask, upNextTasks, hydrated, notPlanningToday, activeReset } = useApp();

  return (
    <div className="max-w-xl mx-auto animate-fade-in">
      {/* Calm Header */}
      <Header />

      {/* Active Reset Card — shown if a reset is running */}
      {activeReset && <ActiveResetCard />}

      {/* Main Focus: NOW */}
      {notPlanningToday || !currentTask ? (
        <TodayEmptyState />
      ) : (
        <>
          <CurrentTaskCard task={currentTask} />

          {/* UP NEXT */}
          <UpNextTimeline tasks={upNextTasks} />
        </>
      )}
    </div>
  );
}
