'use client';

import React, { useState, useMemo } from 'react';
import { useApp } from '@/lib/store';
import { Header } from '@/components/layout/Header';
import { Task } from '@/types';
import { WELLNESS_TASK_PRESETS } from '@/lib/sampleData';
import { getLocalDateString, isSameDay } from '@/lib/dateUtils';
import { 
  Plus, 
  Coffee, 
  Check, 
  Sparkles, 
  X, 
  Play,
  Clock,
  ChevronDown, 
  ChevronUp,
  Tag
} from 'lucide-react';
import { sounds } from '@/lib/sounds';

export default function PlanPage() {
  const { tasks, addTask, completeTask, setCurrentTask, openModal, deferTask } = useApp();
  const [filter, setFilter] = useState<'all' | 'must' | 'care' | 'rest'>('all');
  const [showCompleted, setShowCompleted] = useState(false);

  const restPresets = [
    { title: 'Sit quietly & breathe', icon: '☕', duration: 10 },
    { title: 'Listen to calming music', icon: '🎵', duration: 15 },
    { title: 'Slow walk outside', icon: '🚶', duration: 12 },
    { title: 'Do nothing guilt-free', icon: '🛋', duration: 15 },
  ];

  const handleAddRestPreset = (preset: typeof restPresets[0]) => {
    addTask({
      title: preset.title,
      category: 'rest',
      icon: preset.icon,
      timeCategory: 'today',
      durationMinutes: preset.duration,
      priority: 'should',
      minimum: 'Sit comfortably for 2 minutes',
      normal: `Enjoy ${preset.duration} minutes of real rest`,
      steps: [
        { id: `s1`, title: 'Settle in comfortable spot', completed: false },
        { id: `s2`, title: 'Take a long slow exhale', completed: false, isMinimum: true },
      ],
      companyPreference: 'no_preference',
    });
  };

  const todayStr = useMemo(() => getLocalDateString(), []);
  const uncompletedTasks = tasks.filter(t => !t.completed);
  const completedToday = tasks.filter(t => t.completed && t.completedAt && isSameDay(t.completedAt, todayStr));

  // Compute category counts for the filter pills
  const counts = useMemo(() => {
    return {
      all: uncompletedTasks.length,
      must: uncompletedTasks.filter(t => t.priority === 'must').length,
      care: uncompletedTasks.filter(t => t.category === 'wellness').length,
      rest: uncompletedTasks.filter(t => t.category === 'rest').length,
    };
  }, [uncompletedTasks]);

  const applyFilter = (list: Task[]) => {
    return list.filter(t => {
      if (filter === 'all') return true;
      if (filter === 'must') return t.priority === 'must';
      if (filter === 'care') return t.category === 'wellness';
      if (filter === 'rest') return t.category === 'rest';
      return true;
    });
  };

  const filteredUncompleted = applyFilter(uncompletedTasks);

  // Group into NOW, NEXT, LATER
  const nowTasks = filteredUncompleted.filter(t => t.timeCategory === 'now');
  const effectiveNow = nowTasks.length > 0 
    ? nowTasks 
    : (filteredUncompleted.length > 0 ? [filteredUncompleted[0]] : []);
  
  const effectiveNowIds = new Set(effectiveNow.map(t => t.id));
  const remaining = filteredUncompleted.filter(t => !effectiveNowIds.has(t.id));

  const nextTasks = remaining.filter(t => t.timeCategory === 'today' || t.timeCategory === 'scheduled');
  const laterTasks = remaining.filter(t => t.timeCategory === 'later' || t.timeCategory === 'notime');

  const renderTaskItem = (task: Task, section: 'NOW' | 'NEXT' | 'LATER') => {
    const isRest = task.category === 'rest';
    const isCare = task.category === 'wellness';

    return (
      <div
        key={task.id}
        className="rounded-xl bg-surface dark:bg-surface-dark border border-stone-200/90 dark:border-white/[0.08] p-4 shadow-sm space-y-3 transition-all hover:border-stone-300 dark:hover:border-white/[0.14]"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0 flex-1">
            <button
              type="button"
              onClick={() => {
                sounds.playMinimumComplete();
                completeTask(task.id, 'minimum');
              }}
              aria-label={`Complete ${task.title}`}
              className="mt-0.5 w-6 h-6 rounded-full border border-stone-300 dark:border-white/20 bg-stone-100/60 dark:bg-white/[0.04] flex items-center justify-center text-transparent hover:text-amber-600 dark:hover:text-amber-400 hover:border-amber-500 transition-all shrink-0"
            >
              <Check className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap mb-0.5">
                <h3 className="text-sm sm:text-base font-semibold text-ink-primary dark:text-linen break-words">
                  {task.title}
                </h3>
                {task.priority === 'must' && (
                  <span className="text-[10px] font-bold text-amber-800 dark:text-amber-300 bg-amber-500/15 px-2 py-0.5 rounded-md">
                    Must
                  </span>
                )}
                {isRest && (
                  <span className="text-[10px] font-bold text-amber-800 dark:text-amber-300 bg-amber-500/15 px-2 py-0.5 rounded-md">
                    Rest
                  </span>
                )}
                {isCare && (
                  <span className="text-[10px] font-bold text-sky-800 dark:text-sky-300 bg-sky-500/15 px-2 py-0.5 rounded-md">
                    Care
                  </span>
                )}
              </div>

              {task.minimum && (
                <p className="text-xs text-ink-muted dark:text-linen-subtle leading-relaxed">
                  {task.minimum}
                </p>
              )}
            </div>
          </div>

          {task.durationMinutes && task.durationMinutes > 0 ? (
            <span className="text-[11px] font-medium text-ink-subtle dark:text-linen-faint shrink-0 px-2 py-0.5 rounded-md bg-stone-100 dark:bg-white/[0.04]">
              {task.durationMinutes}m
            </span>
          ) : null}
        </div>

        {/* Micro-actions row */}
        <div className="flex items-center gap-2 pt-1 pl-9">
          <button
            type="button"
            onClick={() => {
              setCurrentTask(task.id);
              openModal('help_start', task.id);
            }}
            className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center gap-1 active:scale-95 transition-all shadow-sm"
          >
            <Play className="w-3 h-3 fill-current" />
            <span>2 min start</span>
          </button>

          <button
            type="button"
            onClick={() => deferTask(task.id)}
            className="px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 dark:bg-white/[0.06] dark:hover:bg-white/[0.1] text-ink-muted dark:text-linen-subtle hover:text-ink-primary dark:hover:text-linen font-medium text-xs flex items-center gap-1 active:scale-95 transition-all"
          >
            <Clock className="w-3 h-3" />
            <span>Postpone gently</span>
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-xl mx-auto space-y-6 animate-fade-in pb-28 md:pb-10">
      {/* Header */}
      <Header
        title="Plan"
        subtitle="Where am I in my day? Flexible sequence, zero guilt."
      />

      {/* Filter Model: All · Must · Care · Rest with counts */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {[
          { id: 'all', label: 'All', count: counts.all },
          { id: 'must', label: 'Must', count: counts.must },
          { id: 'care', label: 'Care', count: counts.care },
          { id: 'rest', label: 'Rest', count: counts.rest },
        ].map((tab) => {
          const isSelected = filter === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilter(tab.id as any)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-amber-500 text-stone-950 border-amber-500 shadow-sm'
                  : 'bg-surface dark:bg-surface-dark border-stone-200/90 dark:border-white/[0.08] text-ink-muted dark:text-linen-subtle hover:text-ink-primary dark:hover:text-linen'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                isSelected ? 'bg-stone-950/20 text-stone-950 font-bold' : 'bg-stone-100 dark:bg-white/[0.08] text-ink-subtle dark:text-linen-faint'
              }`}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Primary Agenda Sequence: NOW, NEXT, LATER */}
      <div className="space-y-6">
        {filteredUncompleted.length === 0 ? (
          <div className="py-8 px-5 rounded-xl bg-surface dark:bg-surface-dark border border-stone-200/90 dark:border-white/[0.08] text-center space-y-2 shadow-sm">
            <p className="text-sm font-semibold text-ink-primary dark:text-linen">
              {filter === 'all'
                ? 'No active tasks scheduled.'
                : `No ${filter.toUpperCase()} tasks right now.`}
            </p>
            <p className="text-xs text-ink-muted dark:text-linen-subtle max-w-xs mx-auto leading-relaxed">
              {filter === 'all'
                ? 'You have a clear day. Feel free to pick a gentle rest activity below or add a task.'
                : 'Switch back to "All" to view your full day, or add a task in this category.'}
            </p>
            {filter !== 'all' && (
              <button
                type="button"
                onClick={() => setFilter('all')}
                className="mt-2 text-xs font-semibold text-amber-700 dark:text-amber-400 hover:underline"
              >
                Show all tasks ({counts.all})
              </button>
            )}
          </div>
        ) : (
          <>
            {/* 1. SECTION: NOW */}
            <section className="space-y-2">
              <div className="flex items-center justify-between pb-1">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  <h2 className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                    Now
                  </h2>
                </div>
                <span className="text-[11px] text-ink-subtle dark:text-linen-faint font-medium">
                  Primary focus
                </span>
              </div>

              {effectiveNow.length > 0 ? (
                <div className="space-y-2.5">
                  {effectiveNow.map(t => renderTaskItem(t, 'NOW'))}
                </div>
              ) : (
                <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-white/[0.02] border border-stone-200/60 dark:border-white/[0.04] text-xs text-ink-muted dark:text-linen-subtle">
                  No task active. Tap &ldquo;2 min start&rdquo; on any task below to bring it into focus.
                </div>
              )}
            </section>

            {/* 2. SECTION: NEXT */}
            <section className="space-y-2">
              <div className="flex items-center justify-between pb-1">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-stone-400 dark:bg-white/40" />
                  <h2 className="text-xs font-bold uppercase tracking-wider text-ink-muted dark:text-linen-subtle">
                    Next
                  </h2>
                </div>
                <span className="text-[11px] text-ink-subtle dark:text-linen-faint font-medium">
                  {nextTasks.length} queued
                </span>
              </div>

              {nextTasks.length > 0 ? (
                <div className="space-y-2.5">
                  {nextTasks.map(t => renderTaskItem(t, 'NEXT'))}
                </div>
              ) : (
                <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-white/[0.02] border border-stone-200/60 dark:border-white/[0.04] text-xs text-ink-muted dark:text-linen-subtle">
                  Queue is clear. Flexible space ahead.
                </div>
              )}
            </section>

            {/* 3. SECTION: LATER (Optional / Deferred) */}
            {laterTasks.length > 0 && (
              <section className="space-y-2">
                <div className="flex items-center justify-between pb-1">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-stone-300 dark:bg-white/20" />
                    <h2 className="text-xs font-bold uppercase tracking-wider text-ink-subtle dark:text-linen-faint">
                      Later
                    </h2>
                  </div>
                  <span className="text-[11px] text-ink-subtle dark:text-linen-faint font-medium">
                    {laterTasks.length} deferred
                  </span>
                </div>

                <div className="space-y-2.5">
                  {laterTasks.map(t => renderTaskItem(t, 'LATER'))}
                </div>
              </section>
            )}
          </>
        )}
      </div>

      {/* Primary Intent Action: Add a task */}
      <div className="pt-2">
        <button
          type="button"
          onClick={() => openModal('create_task')}
          className="w-full h-11 rounded-xl bg-stone-100 hover:bg-stone-200/80 dark:bg-white/[0.06] dark:hover:bg-white/[0.1] text-ink-primary dark:text-linen flex items-center justify-center gap-2 text-xs font-semibold transition-all active:scale-95 shadow-sm border border-stone-200/70 dark:border-white/[0.06]"
        >
          <Plus className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          <span>Add a task to schedule</span>
        </button>
      </div>

      {/* Rest Suggestions: Subordinate, clearly non-obligatory */}
      <section className="p-4 sm:p-5 rounded-xl bg-amber-500/[0.06] dark:bg-amber-500/[0.07] border border-amber-500/20 space-y-3 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300">
            <Coffee className="w-4 h-4 shrink-0" />
            <h3 className="text-xs font-bold uppercase tracking-wider">
              Rest Suggestions
            </h3>
          </div>
          <span className="text-[11px] text-amber-800/80 dark:text-amber-400/80">
            Optional breaks
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {restPresets.map((r, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleAddRestPreset(r)}
              className="flex items-center gap-2 p-2.5 rounded-lg bg-surface dark:bg-surface-dark border border-amber-500/20 hover:border-amber-500/40 text-left transition-all active:scale-[0.98] shadow-sm group"
            >
              <span className="text-base select-none shrink-0">{r.icon}</span>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-ink-primary dark:text-linen leading-snug truncate">
                  {r.title}
                </p>
                <div className="flex items-center justify-between text-[10px] text-ink-muted dark:text-linen-subtle mt-0.5">
                  <span>~{r.duration}m</span>
                  <span className="text-amber-700 dark:text-amber-400 font-semibold group-hover:underline">+ Add</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Expandable Completed Section */}
      {completedToday.length > 0 && (
        <section className="pt-2">
          <button
            type="button"
            onClick={() => setShowCompleted(!showCompleted)}
            className="w-full flex items-center justify-between py-2 text-xs font-semibold text-ink-muted dark:text-linen-subtle hover:text-ink-primary dark:hover:text-linen transition-colors"
          >
            <span>Completed today ({completedToday.length})</span>
            {showCompleted ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showCompleted && (
            <div className="mt-2 space-y-2 rounded-xl bg-surface dark:bg-surface-dark border border-stone-200/90 dark:border-white/[0.08] p-3 shadow-sm divide-y divide-stone-100 dark:divide-white/[0.04]">
              {completedToday.map(t => (
                <div key={t.id} className="py-2 first:pt-0 last:pb-0 flex items-center justify-between gap-2 text-xs text-ink-muted dark:text-linen-subtle">
                  <div className="flex items-center gap-2 truncate">
                    <Check className="w-3.5 h-3.5 text-sage-600 dark:text-sage-400 shrink-0" />
                    <span className="line-through truncate">{t.title}</span>
                  </div>
                  <span className="text-[10px] text-ink-subtle dark:text-linen-faint shrink-0">Done ✓</span>
                </div>
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
}
