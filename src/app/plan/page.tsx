'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/store';
import { Task } from '@/types';
import { WELLNESS_TASK_PRESETS } from '@/lib/sampleData';
import { 
  Plus, 
  Coffee, 
  Check, 
  ArrowUpRight, 
  Heart,
  Sparkles,
  X,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { sounds } from '@/lib/sounds';

export default function PlanPage() {
  const { tasks, addTask, completeTask, setCurrentTask, openModal } = useApp();
  const [filter, setFilter] = useState<'all' | 'must' | 'care' | 'rest'>('all');
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [addMode, setAddMode] = useState<'menu' | 'care' | 'rest'>('menu');
  const [showCompleted, setShowCompleted] = useState(false);

  const restPresets = [
    { title: 'Sit quietly & breathe', icon: '☕', duration: 10 },
    { title: 'Listen to calming music', icon: '🎵', duration: 15 },
    { title: 'Read a gentle chapter', icon: '📖', duration: 15 },
    { title: 'Slow walk outside', icon: '🚶', duration: 12 },
    { title: 'Play a relaxing game', icon: '🎮', duration: 20 },
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
    setShowAddMenu(false);
    setAddMode('menu');
  };

  const handleAddWellnessPreset = (preset: typeof WELLNESS_TASK_PRESETS[0]) => {
    addTask({
      title: preset.title,
      category: preset.category,
      icon: preset.icon,
      timeCategory: 'today',
      durationMinutes: preset.durationMinutes,
      priority: preset.priority,
      minimum: preset.minimum,
      normal: preset.normal,
      extra: (preset as any).extra,
      steps: [
        { id: `ws1`, title: preset.minimum, completed: false, isMinimum: true },
        { id: `ws2`, title: preset.normal, completed: false },
      ],
      companyPreference: 'no_preference',
    });
    setShowAddMenu(false);
    setAddMode('menu');
  };

  // Filter tasks
  const uncompletedTasks = tasks.filter(t => !t.completed);
  const completedTasks = tasks.filter(t => t.completed);

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
  // If no task has 'now' timeCategory, the first one is practically NOW
  const effectiveNow = nowTasks.length > 0 
    ? nowTasks 
    : (filteredUncompleted.length > 0 ? [filteredUncompleted[0]] : []);
  
  const effectiveNowIds = new Set(effectiveNow.map(t => t.id));
  const remaining = filteredUncompleted.filter(t => !effectiveNowIds.has(t.id));

  const nextTasks = remaining.filter(t => t.timeCategory === 'today' || t.timeCategory === 'scheduled');
  const laterTasks = remaining.filter(t => t.timeCategory === 'later' || t.timeCategory === 'notime');

  const renderTaskItem = (task: Task, timelineLabel: 'NOW' | 'NEXT' | 'LATER') => {
    const isRest = task.category === 'rest';
    const isCare = task.category === 'wellness';

    return (
      <div
        key={task.id}
        className="flex items-start gap-3.5 p-4 sm:p-4.5 rounded-2xl bg-surface dark:bg-surface-dark border border-slate-200/80 dark:border-slate-800 shadow-sm transition-all hover:border-slate-300 dark:hover:border-slate-700"
      >
        <span className="text-xl sm:text-2xl select-none pt-0.5" role="img" aria-hidden="true">
          {task.icon || (isRest ? '☕' : isCare ? '✨' : '📋')}
        </span>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            {task.priority === 'must' && (
              <span className="text-[10px] font-medium text-brand-700 dark:text-brand-300 bg-brand-50 dark:bg-brand-950/40 px-2 py-0.5 rounded-md">
                Must
              </span>
            )}

            {isRest && (
              <span className="text-[10px] font-medium text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-md">
                Rest
              </span>
            )}

            {isCare && (
              <span className="text-[10px] font-medium text-brand-700 dark:text-brand-300 bg-brand-50 dark:bg-brand-950/40 px-2 py-0.5 rounded-md">
                Care
              </span>
            )}

            {task.durationMinutes && task.durationMinutes > 0 ? (
              <span className="text-[11px] text-ink-muted dark:text-slate-400 ml-auto">
                {task.durationMinutes} min
              </span>
            ) : null}
          </div>

          <h3 className="text-sm sm:text-base font-semibold text-ink-primary dark:text-slate-100 truncate">
            {task.title}
          </h3>

          <p className="text-xs text-ink-muted dark:text-slate-400 mt-0.5 line-clamp-1">
            {task.minimum}
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-1.5 self-center shrink-0">
          {timelineLabel !== 'NOW' && (
            <button
              type="button"
              onClick={() => setCurrentTask(task.id)}
              title="Make this your active task now"
              aria-label="Make active task now"
              className="w-11 h-11 flex items-center justify-center rounded-xl text-ink-muted hover:text-brand-600 dark:hover:text-brand-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <ArrowUpRight className="w-4 h-4" />
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              sounds.playMinimumComplete();
              completeTask(task.id, 'minimum');
            }}
            title="Mark minimum completed"
            aria-label="Mark minimum completed"
            className="w-11 h-11 flex items-center justify-center rounded-xl text-ink-muted hover:text-ink-primary dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Check className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-xl mx-auto space-y-6 animate-fade-in pb-10">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-[1.75rem] font-semibold tracking-tight text-ink-primary dark:text-slate-100">
          Plan
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-ink-muted dark:text-slate-400">
          Where am I in my day? Flexible sequence, zero guilt.
        </p>
      </div>

      {/* Filter Tabs: All · Must · Care · Rest */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/70 rounded-2xl">
        {[
          { id: 'all', label: 'All' },
          { id: 'must', label: 'Must' },
          { id: 'care', label: 'Care' },
          { id: 'rest', label: 'Rest' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setFilter(tab.id as any)}
            className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-semibold text-center transition-all ${
              filter === tab.id
                ? 'bg-surface dark:bg-surface-dark text-ink-primary dark:text-slate-100 shadow-sm'
                : 'text-ink-muted hover:text-ink-primary'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Timeline Sections: NOW, NEXT, LATER */}
      <div className="space-y-5">
        {filteredUncompleted.length === 0 ? (
          <div className="py-12 text-center space-y-2">
            <p className="text-sm font-medium text-ink-secondary dark:text-slate-300">
              No tasks in this view.
            </p>
            <p className="text-xs text-ink-muted dark:text-slate-400">
              Take your time, or tap below to add something when ready.
            </p>
          </div>
        ) : (
          <>
            {/* NOW section */}
            {effectiveNow.length > 0 && (
              <section className="space-y-2">
                <h2 className="text-xs font-bold uppercase tracking-wider text-ink-muted dark:text-slate-400">
                  Now
                </h2>
                <div className="space-y-2.5">
                  {effectiveNow.map(t => renderTaskItem(t, 'NOW'))}
                </div>
              </section>
            )}

            {/* NEXT section */}
            {nextTasks.length > 0 && (
              <section className="space-y-2">
                <h2 className="text-xs font-bold uppercase tracking-wider text-ink-muted dark:text-slate-400">
                  Next
                </h2>
                <div className="space-y-2.5">
                  {nextTasks.map(t => renderTaskItem(t, 'NEXT'))}
                </div>
              </section>
            )}

            {/* LATER section */}
            {laterTasks.length > 0 && (
              <section className="space-y-2">
                <h2 className="text-xs font-bold uppercase tracking-wider text-ink-muted dark:text-slate-400">
                  Later
                </h2>
                <div className="space-y-2.5">
                  {laterTasks.map(t => renderTaskItem(t, 'LATER'))}
                </div>
              </section>
            )}
          </>
        )}
      </div>

      {/* Divider */}
      <hr className="border-slate-200/80 dark:border-slate-800 my-6" />

      {/* Universal + Add something */}
      <div>
        <button
          type="button"
          onClick={() => {
            setShowAddMenu(true);
            setAddMode('menu');
          }}
          className="w-full flex items-center justify-center gap-2 py-3.5 px-5 rounded-2xl bg-surface dark:bg-surface-dark border border-slate-200/90 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-sm font-semibold text-ink-primary dark:text-slate-100 shadow-sm transition-all active:scale-[0.99]"
        >
          <Plus className="w-4 h-4 text-brand-600 dark:text-brand-400" />
          <span>Add something</span>
        </button>
      </div>

      {/* Completed tasks toggle (subtle and secondary) */}
      {completedTasks.length > 0 && (
        <div className="pt-2 text-center">
          <button
            type="button"
            onClick={() => setShowCompleted(!showCompleted)}
            className="inline-flex items-center gap-1.5 text-xs text-ink-muted hover:text-ink-primary dark:text-slate-400 dark:hover:text-slate-200 transition-colors py-1.5 px-3 rounded-xl"
          >
            <span>{completedTasks.length} completed today</span>
            {showCompleted ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {showCompleted && (
            <div className="mt-3 space-y-2 text-left animate-fade-in">
              {completedTasks.map((t) => (
                <div
                  key={t.id}
                  className="flex items-center justify-between p-3 rounded-2xl bg-slate-50/70 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800/60 opacity-70"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-base select-none">{t.icon || '✓'}</span>
                    <span className="text-xs line-through text-ink-muted truncate">{t.title}</span>
                  </div>
                  <span className="text-[11px] text-gentle-green">Done ✓</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* + Add something Sheet */}
      {showAddMenu && (
        <div 
          className="fixed inset-0 z-50 flex items-end justify-center pb-[env(safe-area-inset-bottom,0px)] sm:items-center sm:p-4 bg-slate-900/40 dark:bg-slate-950/70 animate-fade-in"
          role="dialog"
          aria-modal="true"
          onClick={() => {
            setShowAddMenu(false);
            setAddMode('menu');
          }}
        >
          <div
            className="modal-sheet relative w-full sm:max-w-md bg-surface dark:bg-surface-dark border-t sm:border border-slate-200/90 dark:border-slate-800 sm:rounded-3xl rounded-t-3xl shadow-2xl p-6 overflow-y-auto animate-slide-up space-y-5"
            style={{ maxHeight: 'calc(100dvh - env(safe-area-inset-top, 0px) - env(safe-area-inset-bottom, 0px) - 1rem)' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drag handle */}
            <div className="sm:hidden flex justify-center -mt-2 pb-1">
              <div className="w-10 h-1 rounded-full bg-slate-300 dark:bg-slate-600" />
            </div>

            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-lg font-bold text-ink-primary dark:text-slate-100">
                {addMode === 'care' ? 'Choose Self-Care' : addMode === 'rest' ? 'Choose Rest' : 'Add something'}
              </h3>
              <button
                type="button"
                onClick={() => {
                  if (addMode !== 'menu') setAddMode('menu');
                  else setShowAddMenu(false);
                }}
                className="p-1.5 rounded-xl text-ink-muted hover:text-ink-primary hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {addMode === 'menu' && (
              <div className="space-y-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddMenu(false);
                    openModal('create_task');
                  }}
                  className="w-full flex items-center gap-3.5 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-left transition-all active:scale-[0.99]"
                >
                  <span className="text-xl">📋</span>
                  <div>
                    <h4 className="text-sm font-semibold text-ink-primary dark:text-slate-100">Task</h4>
                    <p className="text-xs text-ink-muted">Any activity or project you want to step into.</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setAddMode('care')}
                  className="w-full flex items-center gap-3.5 p-4 rounded-2xl border border-brand-200/70 dark:border-brand-900/50 bg-brand-50/40 dark:bg-brand-950/20 hover:bg-brand-50 dark:hover:bg-brand-950/40 text-left transition-all active:scale-[0.99]"
                >
                  <span className="text-xl">💧</span>
                  <div>
                    <h4 className="text-sm font-semibold text-brand-900 dark:text-brand-200">Self-care</h4>
                    <p className="text-xs text-brand-700/80 dark:text-brand-300/80">Water, teeth, face, food, gentle movement.</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setAddMode('rest')}
                  className="w-full flex items-center gap-3.5 p-4 rounded-2xl border border-amber-200/70 dark:border-amber-900/50 bg-amber-50/40 dark:bg-amber-950/20 hover:bg-amber-50 dark:hover:bg-amber-950/40 text-left transition-all active:scale-[0.99]"
                >
                  <span className="text-xl">☕</span>
                  <div>
                    <h4 className="text-sm font-semibold text-amber-900 dark:text-amber-200">Rest</h4>
                    <p className="text-xs text-amber-800/80 dark:text-amber-300/80">True rest is a legitimate activity, not earned guilt.</p>
                  </div>
                </button>

                <Link
                  href="/routines"
                  onClick={() => setShowAddMenu(false)}
                  className="w-full flex items-center gap-3.5 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-left transition-all active:scale-[0.99]"
                >
                  <span className="text-xl">✨</span>
                  <div>
                    <h4 className="text-sm font-semibold text-ink-primary dark:text-slate-100">Routine</h4>
                    <p className="text-xs text-ink-muted">Run a sequence like Morning Care or 5-Minute Reset.</p>
                  </div>
                </Link>
              </div>
            )}

            {addMode === 'care' && (
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  {WELLNESS_TASK_PRESETS.slice(0, 8).map((preset, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleAddWellnessPreset(preset)}
                      className="flex items-center gap-2 p-2.5 rounded-xl border border-brand-200/60 dark:border-brand-900/40 hover:bg-brand-50 dark:hover:bg-brand-950/30 text-left transition-all"
                    >
                      <span className="text-base">{preset.icon}</span>
                      <span className="text-xs font-medium text-ink-primary dark:text-slate-200 truncate">{preset.title}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {addMode === 'rest' && (
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  {restPresets.map((r, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleAddRestPreset(r)}
                      className="flex items-center gap-2 p-2.5 rounded-xl border border-amber-200/60 dark:border-amber-900/40 hover:bg-amber-50 dark:hover:bg-amber-950/30 text-left transition-all"
                    >
                      <span className="text-base">{r.icon}</span>
                      <div className="min-w-0 flex-1">
                        <span className="text-xs font-medium text-ink-primary dark:text-slate-200 block truncate">{r.title}</span>
                        <span className="text-[10px] text-ink-muted block">{r.duration}m</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
}
