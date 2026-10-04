'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import { Task, TaskPriority } from '@/types';
import { WELLNESS_TASK_PRESETS } from '@/lib/sampleData';
import { 
  Plus, 
  Coffee, 
  Clock, 
  Check, 
  ArrowUpRight, 
  Heart,
  Droplets
} from 'lucide-react';
import { sounds } from '@/lib/sounds';

export default function PlanPage() {
  const { tasks, addTask, completeTask, setCurrentTask, openModal } = useApp();
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'must' | 'should' | 'could' | 'rest' | 'wellness'>('all');
  const [showWellnessPresets, setShowWellnessPresets] = useState(false);

  const filteredTasks = tasks.filter(t => {
    if (priorityFilter === 'all') return true;
    if (priorityFilter === 'rest') return t.category === 'rest';
    if (priorityFilter === 'wellness') return t.category === 'wellness';
    return t.priority === priorityFilter;
  });

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
  };

  const getPriorityBadge = (p: TaskPriority, isRest: boolean, isWellness: boolean) => {
    if (isRest) {
      return (
        <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300">
          Rest
        </span>
      );
    }
    if (isWellness) {
      return (
        <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-md bg-brand-100 dark:bg-brand-950/60 text-brand-800 dark:text-brand-300">
          Care
        </span>
      );
    }
    switch (p) {
      case 'must':
        return (
          <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-md bg-brand-100 dark:bg-brand-950 text-brand-800 dark:text-brand-300">
            Must
          </span>
        );
      case 'should':
        return (
          <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-ink-secondary dark:text-slate-300">
            Should
          </span>
        );
      case 'could':
        return (
          <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-md bg-slate-100/70 dark:bg-slate-800/60 text-ink-muted dark:text-slate-400">
            Could
          </span>
        );
    }
  };

  return (
    <div className="mx-auto max-w-2xl animate-fade-in space-y-5 sm:space-y-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-ink-primary dark:text-slate-100 sm:text-3xl">
            Visual Plan
          </h1>
          <p className="mt-1 text-xs text-ink-muted dark:text-slate-400 sm:text-sm">
            A flexible sequence of your day. No contracts, zero guilt.
          </p>
        </div>

        <button
          onClick={() => openModal('create_task')}
          className="hidden items-center gap-1.5 rounded-xl bg-brand-600 px-3 py-2 text-xs font-medium text-white shadow-sm transition-all hover:bg-brand-700 active:scale-95 sm:flex"
        >
          <Plus className="w-4 h-4" />
          <span>Add</span>
        </button>
      </div>

      {/* Self-Care Presets */}
      <section className="p-5 rounded-3xl bg-brand-50/40 dark:bg-brand-950/20 border border-brand-200/60 dark:border-brand-900/40 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-brand-600 dark:text-brand-400" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-brand-900 dark:text-brand-200">
              Add Self-Care Task
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setShowWellnessPresets(!showWellnessPresets)}
            className="text-[11px] text-brand-700 dark:text-brand-300 font-semibold hover:underline"
          >
            {showWellnessPresets ? 'Hide' : 'Show all'}
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {(showWellnessPresets ? WELLNESS_TASK_PRESETS : WELLNESS_TASK_PRESETS.slice(0, 6)).map((preset, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleAddWellnessPreset(preset)}
              className="flex items-center gap-2 p-2.5 rounded-xl bg-surface dark:bg-surface-dark border border-brand-200/50 dark:border-brand-900/40 hover:border-brand-400 dark:hover:border-brand-700 text-left transition-all active:scale-[0.98]"
            >
              <span className="text-lg select-none">{preset.icon}</span>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-ink-primary dark:text-slate-100 truncate">
                  {preset.title}
                </p>
                <p className="text-[10px] text-ink-muted capitalize">{preset.priority}</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Rest Presets Carousel/Bar */}
      <section className="p-5 rounded-3xl bg-amber-50/40 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Coffee className="w-4 h-4 text-amber-700 dark:text-amber-400" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-amber-900 dark:text-amber-200">
              Schedule True Rest
            </h2>
          </div>
          <span className="text-[11px] text-amber-800/80 dark:text-amber-300/80">
            Rest is an essential activity
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {restPresets.map((r, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleAddRestPreset(r)}
              className="flex items-center gap-2 p-2.5 rounded-xl bg-surface dark:bg-surface-dark border border-amber-200/50 dark:border-amber-900/40 hover:border-amber-400 text-left transition-all active:scale-[0.98]"
            >
              <span className="text-lg select-none">{r.icon}</span>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-ink-primary dark:text-slate-100 truncate">
                  {r.title}
                </p>
                <p className="text-[10px] text-ink-muted">~{r.duration} min</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/70 rounded-2xl overflow-x-auto">
        {[
          { id: 'all', label: 'All' },
          { id: 'must', label: 'Must' },
          { id: 'should', label: 'Should' },
          { id: 'could', label: 'Could' },
          { id: 'wellness', label: 'Care 💧' },
          { id: 'rest', label: 'Rest ☕' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setPriorityFilter(tab.id as any)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              priorityFilter === tab.id
                ? 'bg-surface dark:bg-surface-dark text-ink-primary dark:text-slate-100 shadow-sm'
                : 'text-ink-muted hover:text-ink-primary'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Activities Timeline */}
      <section aria-label="Activities sequence" className="space-y-3">
        {filteredTasks.length === 0 && (
          <div className="text-center py-10 text-ink-muted dark:text-slate-400">
            <p className="text-sm">No tasks in this category yet.</p>
          </div>
        )}
        {filteredTasks.map((task) => {
          const isRest = task.category === 'rest';
          const isWellness = task.category === 'wellness';

          return (
            <div
              key={task.id}
              className={`flex items-start gap-3.5 p-4 sm:p-5 rounded-2xl border transition-all ${
                task.completed
                  ? 'bg-slate-50/80 dark:bg-slate-900/30 border-slate-200/50 dark:border-slate-800/40 opacity-70'
                  : 'bg-surface dark:bg-surface-dark border-slate-200/80 dark:border-slate-800 shadow-card'
              }`}
            >
              <span className="text-2xl select-none pt-0.5" role="img" aria-hidden="true">
                {task.icon || (isRest ? '☕' : isWellness ? '✨' : '📋')}
              </span>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  {getPriorityBadge(task.priority, isRest, isWellness)}
                  {task.timeCategory === 'now' && (
                    <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-md bg-brand-600 text-white">
                      Current Task
                    </span>
                  )}
                  {task.scheduledTime && (
                    <span className="inline-flex items-center gap-1 text-[11px] text-ink-muted">
                      <Clock className="w-3 h-3" />
                      {task.scheduledTime}
                    </span>
                  )}
                  <span className="text-[11px] text-ink-subtle ml-auto">
                    ~{task.durationMinutes} min
                  </span>
                </div>

                <h3 className={`text-base font-semibold text-ink-primary dark:text-slate-100 ${
                  task.completed ? 'line-through text-ink-muted' : ''
                }`}>
                  {task.title}
                </h3>

                <p className="text-xs text-ink-muted dark:text-slate-400 mt-1">
                  <span className="font-medium text-ink-secondary dark:text-slate-300">Minimum: </span>
                  {task.minimum}
                </p>

                {task.extra && (
                  <p className="text-xs text-ink-subtle mt-0.5">
                    <span className="font-medium">Extra: </span>{task.extra}
                  </p>
                )}
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-1.5 self-center shrink-0">
                {!task.completed && task.timeCategory !== 'now' && (
                  <button
                    type="button"
                    onClick={() => setCurrentTask(task.id)}
                    title="Make this the current task"
                    className="p-2 rounded-xl text-ink-muted hover:text-brand-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
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
                  disabled={task.completed}
                  title={task.completed ? 'Completed' : 'Complete minimum'}
                  className={`p-2 rounded-xl transition-colors ${
                    task.completed
                      ? 'text-gentle-green bg-emerald-50 dark:bg-emerald-950/30'
                      : 'text-ink-muted hover:text-gentle-green hover:bg-emerald-50 dark:hover:bg-emerald-950/30'
                  }`}
                >
                  <Check className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
}
