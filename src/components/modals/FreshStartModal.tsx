'use client';

import React, { useState, useMemo } from 'react';
import { useApp } from '@/lib/store';
import { FRESH_START_TEMPLATE } from '@/lib/sampleData';
import { X, Check, Sparkles, RotateCcw, Calendar, ChevronDown, ChevronUp } from 'lucide-react';

export function FreshStartModal() {
  const { activeReset, activateFreshStart, archiveReset, completeResetDayTask, closeModal } = useApp();
  const [expanded, setExpanded] = useState<number | null>(null);

  const today = new Date().toISOString().split('T')[0];

  // Find which day we're on
  const currentDayIndex = useMemo(() => {
    if (!activeReset) return 0;
    const idx = activeReset.days.findIndex(d => d.date === today);
    return idx >= 0 ? idx : 0;
  }, [activeReset, today]);

  const currentDay = activeReset?.days[currentDayIndex];
  const completedRequired = currentDay?.tasks.filter(t => !t.isOptional && t.completed).length ?? 0;
  const totalRequired = currentDay?.tasks.filter(t => !t.isOptional).length ?? 0;
  const completedOptional = currentDay?.tasks.filter(t => t.isOptional && t.completed).length ?? 0;

  // Overall reset progress
  const totalActiveDays = activeReset?.days.filter(d => {
    const required = d.tasks.filter(t => !t.isOptional);
    const done = required.filter(t => t.completed);
    return done.length >= Math.ceil(required.length / 2);
  }).length ?? 0;

  if (!activeReset) {
    // Pre-activation screen
    return (
      <div 
        className="fixed inset-0 z-50 flex items-end justify-center pb-[env(safe-area-inset-bottom,0px)] sm:items-center sm:p-4 bg-slate-900/40 dark:bg-slate-950/70"
        role="dialog"
        aria-modal="true"
        aria-labelledby="fresh-start-title"
        onClick={closeModal}
      >
        <div
          className="modal-sheet relative w-full sm:max-w-lg bg-surface dark:bg-surface-dark border-t sm:border border-slate-200/90 dark:border-slate-800 sm:rounded-3xl rounded-t-3xl shadow-2xl overflow-y-auto animate-slide-up flex flex-col"
          style={{ maxHeight: 'calc(100dvh - env(safe-area-inset-top, 0px) - env(safe-area-inset-bottom, 0px) - 0.5rem)' }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Drag handle (mobile) */}
          <div className="sm:hidden flex justify-center pt-3 pb-1">
            <div className="w-10 h-1 rounded-full bg-slate-300 dark:bg-slate-600" />
          </div>
          
          <div className="flex items-center justify-between px-6 pt-5 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-brand-600 dark:text-brand-400" />
              <p className="text-xs font-bold uppercase tracking-wider text-ink-muted dark:text-slate-400">
                Reset • 7-Day Fresh Start
              </p>
            </div>
            <button onClick={closeModal} aria-label="Close" className="p-1.5 rounded-xl text-ink-muted hover:text-ink-primary dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 sm:p-7 space-y-5 max-h-[80vh] overflow-y-auto">
            <div>
              <h3 id="fresh-start-title" className="text-xl sm:text-2xl font-bold text-ink-primary dark:text-slate-100">
                7-Day Fresh Start
              </h3>
              <p className="text-sm text-ink-muted dark:text-slate-400 mt-2 leading-relaxed">
                {FRESH_START_TEMPLATE.goal}
              </p>
            </div>

            {/* What this is NOT */}
            <div className="p-3.5 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40">
              <p className="text-xs font-semibold text-amber-900 dark:text-amber-200 mb-1">This is not:</p>
              <p className="text-xs text-amber-800/80 dark:text-amber-300/70 leading-relaxed">
                A weight-loss challenge. No crash dieting. No excessive exercise. No harsh skincare. Just basic care, done consistently.
              </p>
            </div>

            {/* Daily minimum */}
            <div className="space-y-2">
              <p className="text-xs font-bold uppercase tracking-wider text-ink-muted dark:text-slate-400">Daily minimum (required)</p>
              <div className="space-y-1.5">
                {FRESH_START_TEMPLATE.dailyMinimumTasks.map((t, i) => (
                  <div key={i} className="flex items-center gap-2.5 p-2.5 rounded-xl bg-surface dark:bg-surface-dark border border-slate-200/60 dark:border-slate-800">
                    <div className="w-4 h-4 rounded-md border-2 border-brand-500 flex items-center justify-center shrink-0">
                      <div className="w-2 h-2 rounded-sm bg-brand-500" />
                    </div>
                    <span className="text-xs text-ink-primary dark:text-slate-200">{t.title}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Optional */}
            <div className="space-y-2">
              <p className="text-xs font-bold uppercase tracking-wider text-ink-muted dark:text-slate-400">Optional extras</p>
              <div className="flex flex-wrap gap-2">
                {FRESH_START_TEMPLATE.dailyOptionalTasks.map((t, i) => (
                  <span key={i} className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-ink-secondary dark:text-slate-300 font-medium">
                    {t.title}
                  </span>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                activateFreshStart();
              }}
              className="w-full py-4 px-6 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm sm:text-base shadow-md transition-all active:scale-[0.99]"
            >
              START 7-DAY FRESH START
            </button>
            <p className="text-[11px] text-ink-subtle text-center">
              Tasks feed into your Today page each day. Archive it anytime.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Active reset view
  return (
    <div 
      className="fixed inset-0 z-50 flex items-end justify-center pb-[env(safe-area-inset-bottom,0px)] sm:items-center sm:p-4 bg-slate-900/40 dark:bg-slate-950/70"
      role="dialog"
      aria-modal="true"
      aria-labelledby="fresh-start-active-title"
      onClick={closeModal}
    >
      <div
        className="modal-sheet relative w-full sm:max-w-lg bg-surface dark:bg-surface-dark border-t sm:border border-slate-200/90 dark:border-slate-800 sm:rounded-3xl rounded-t-3xl shadow-2xl overflow-y-auto animate-slide-up flex flex-col"
        style={{ maxHeight: 'calc(100dvh - env(safe-area-inset-top, 0px) - env(safe-area-inset-bottom, 0px) - 0.5rem)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag handle (mobile) */}
        <div className="sm:hidden flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-slate-300 dark:bg-slate-600" />
        </div>
        
        <div className="flex items-center justify-between px-6 pt-5 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-brand-600 dark:text-brand-400" />
            <p className="text-xs font-bold uppercase tracking-wider text-ink-muted dark:text-slate-400">
              Active Reset
            </p>
          </div>
          <button onClick={closeModal} aria-label="Close" className="p-1.5 rounded-xl text-ink-muted hover:text-ink-primary dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 sm:p-7 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Reset header */}
          <div>
            <h3 id="fresh-start-active-title" className="text-xl font-bold text-ink-primary dark:text-slate-100">
              {activeReset.name}
            </h3>
            <p className="text-xs text-ink-muted dark:text-slate-400 mt-1">{activeReset.goal}</p>
          </div>

          {/* Day progress dots */}
          <div className="flex items-center gap-2">
            {activeReset.days.map((day, idx) => {
              const isToday = day.date === today;
              const required = day.tasks.filter(t => !t.isOptional);
              const done = required.filter(t => t.completed);
              const isPast = day.date < today;
              const isDone = done.length >= Math.ceil(required.length / 2);
              return (
                <div key={idx} className={`flex flex-col items-center gap-1 flex-1`}>
                  <div className={`w-full h-1.5 rounded-full transition-all ${
                    isDone ? 'bg-gentle-green' : isToday ? 'bg-brand-400' : isPast ? 'bg-slate-300 dark:bg-slate-700' : 'bg-slate-200 dark:bg-slate-800'
                  }`} />
                  <span className={`text-[9px] font-bold ${isToday ? 'text-brand-600 dark:text-brand-400' : 'text-ink-subtle'}`}>
                    D{day.day}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Today's progress */}
          <div className="p-4 rounded-2xl bg-brand-50/70 dark:bg-brand-950/40 border border-brand-200/70 dark:border-brand-800/60">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-700 dark:text-brand-300">
                Day {currentDayIndex + 1} / {activeReset.totalDays}
              </span>
              <span className="text-xs font-semibold text-brand-600 dark:text-brand-400">
                {completedRequired} / {totalRequired} done
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-brand-200/60 dark:bg-brand-900/60 mt-2">
              <div
                className="h-2 rounded-full bg-brand-500 transition-all"
                style={{ width: `${totalRequired > 0 ? (completedRequired / totalRequired) * 100 : 0}%` }}
              />
            </div>
          </div>

          {/* Today's tasks */}
          {currentDay && (
            <div className="space-y-3">
              <p className="text-xs font-bold uppercase tracking-wider text-ink-muted dark:text-slate-400">Today&apos;s tasks</p>
              
              {/* Required */}
              <div className="space-y-1.5">
                {currentDay.tasks.filter(t => !t.isOptional).map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => completeResetDayTask(activeReset.id, currentDayIndex, t.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                      t.completed 
                        ? 'bg-gentle-greenBg/40 dark:bg-emerald-950/30 border-emerald-200/60 dark:border-emerald-900/40 opacity-70' 
                        : 'bg-surface dark:bg-surface-dark border-slate-200/70 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center shrink-0 transition-all ${
                      t.completed ? 'bg-gentle-green border-gentle-green' : 'border-slate-300 dark:border-slate-600'
                    }`}>
                      {t.completed && <Check className="w-3 h-3 text-white" />}
                    </div>
                    <span className={`text-sm font-medium ${t.completed ? 'line-through text-ink-muted' : 'text-ink-primary dark:text-slate-100'}`}>
                      {t.title}
                    </span>
                  </button>
                ))}
              </div>

              {/* Optional */}
              <button
                type="button"
                onClick={() => setExpanded(expanded === -1 ? null : -1)}
                className="flex items-center gap-1.5 text-xs font-medium text-ink-muted dark:text-slate-400 hover:text-ink-primary pt-1"
              >
                {expanded === -1 ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                Optional extras ({completedOptional} done)
              </button>

              {expanded === -1 && (
                <div className="space-y-1.5 pt-1">
                  {currentDay.tasks.filter(t => t.isOptional).map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => completeResetDayTask(activeReset.id, currentDayIndex, t.id)}
                      className={`w-full flex items-center gap-3 p-2.5 rounded-xl border text-left transition-all ${
                        t.completed 
                          ? 'bg-gentle-greenBg/30 dark:bg-emerald-950/20 border-emerald-200/40 dark:border-emerald-900/30 opacity-60' 
                          : 'bg-slate-50/80 dark:bg-slate-900/40 border-slate-200/60 dark:border-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800/50'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-md border-2 flex items-center justify-center shrink-0 transition-all ${
                        t.completed ? 'bg-gentle-green border-gentle-green' : 'border-slate-300 dark:border-slate-600'
                      }`}>
                        {t.completed && <Check className="w-2.5 h-2.5 text-white" />}
                      </div>
                      <span className={`text-xs ${t.completed ? 'line-through text-ink-subtle' : 'text-ink-secondary dark:text-slate-300'}`}>
                        {t.title}
                      </span>
                      <span className="ml-auto text-[10px] text-ink-subtle shrink-0">optional</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Archive button */}
          <button
            type="button"
            onClick={() => {
              if (confirm('Archive this reset? Your progress will be saved.')) {
                archiveReset(activeReset.id);
                closeModal();
              }
            }}
            className="w-full py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-medium text-ink-muted hover:text-ink-primary hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-center"
          >
            Archive this reset
          </button>
        </div>
      </div>
    </div>
  );
}
