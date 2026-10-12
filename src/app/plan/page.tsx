'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/store';
import { Header } from '@/components/layout/Header';
import { Task } from '@/types';
import { WELLNESS_TASK_PRESETS } from '@/lib/sampleData';
import { getLocalDateString, isSameDay } from '@/lib/dateUtils';
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

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowAddMenu(false);
        setAddMode('menu');
      }
    };
    if (showAddMenu) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [showAddMenu]);

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
  const todayStr = useMemo(() => getLocalDateString(), []);
  const uncompletedTasks = tasks.filter(t => !t.completed);
  const completedToday = tasks.filter(t => t.completed && t.completedAt && isSameDay(t.completedAt, todayStr));

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
        className="flex items-start gap-3.5 p-4 sm:p-4.5 rounded-2xl bg-surface dark:bg-surface-dark border border-stone-200/80 dark:border-white/[0.08] shadow-sm transition-all hover:border-stone-300 dark:hover:border-white/[0.15]"
      >
        <span className="text-xl sm:text-2xl select-none pt-0.5" role="img" aria-hidden="true">
          {task.icon || (isRest ? '☕' : isCare ? '✨' : '📋')}
        </span>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            {task.priority === 'must' && (
              <span className="text-[10px] font-medium text-amber-800 dark:text-amber-300 bg-amber-500/15 border border-amber-500/20 px-2 py-0.5 rounded-md">
                Must
              </span>
            )}

            {isRest && (
              <span className="text-[10px] font-medium text-amber-800 dark:text-amber-300 bg-amber-500/15 border border-amber-500/20 px-2 py-0.5 rounded-md">
                Rest
              </span>
            )}

            {isCare && (
              <span className="text-[10px] font-medium text-terracotta bg-terracotta/15 border border-terracotta/20 px-2 py-0.5 rounded-md">
                Care
              </span>
            )}

            {task.durationMinutes && task.durationMinutes > 0 ? (
              <span className="text-[11px] text-ink-muted dark:text-linen-subtle ml-auto">
                {task.durationMinutes} min
              </span>
            ) : null}
          </div>

          <h3 className="text-sm sm:text-base font-semibold text-ink-primary dark:text-linen break-words">
            {task.title}
          </h3>

          <p className="text-xs text-ink-muted dark:text-linen-subtle mt-0.5 break-words">
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
              className="w-11 h-11 flex items-center justify-center rounded-xl text-ink-muted hover:text-amber-600 dark:hover:text-amber-400 hover:bg-stone-100 dark:hover:bg-white/[0.04] transition-colors"
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
            className="w-11 h-11 flex items-center justify-center rounded-xl text-ink-muted hover:text-sage-600 dark:hover:text-sage-300 hover:bg-sage-500/10 transition-colors"
          >
            <Check className="w-4 h-4 stroke-[2.2]" />
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

      {/* Rest Recommendations Section */}
      <section className="p-5 rounded-3xl bg-amber-500/10 dark:bg-amber-500/[0.08] border border-amber-500/25 dark:border-amber-500/20 space-y-3 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Coffee className="w-4 h-4 text-amber-700 dark:text-amber-400 shrink-0" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-amber-900 dark:text-amber-300">
              Rest Recommendations
            </h2>
          </div>
          <span className="text-[11px] text-amber-800/80 dark:text-amber-400/80 font-medium">
            Tap to add to schedule
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {restPresets.map((r, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleAddRestPreset(r)}
              className="flex items-center gap-2.5 p-2.5 rounded-2xl bg-surface dark:bg-surface-dark border border-amber-500/20 hover:border-amber-500/40 text-left transition-all active:scale-[0.98] shadow-sm group"
            >
              <span className="text-base select-none shrink-0">{r.icon}</span>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-ink-primary dark:text-linen leading-snug break-words">
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

      {/* Filter Tabs: All · Must · Care · Rest */}
      <div className="flex items-center gap-1.5 p-1 bg-stone-100 dark:bg-white/[0.04] rounded-2xl border border-transparent dark:border-white/[0.04]">
        {[
          { id: 'all', label: 'All' },
          { id: 'must', label: 'Must' },
          { id: 'care', label: 'Care' },
          { id: 'rest', label: 'Rest' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            aria-pressed={filter === tab.id}
            onClick={() => setFilter(tab.id as any)}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold text-center transition-all border ${
              filter === tab.id
                ? 'border-amber-500/40 bg-amber-500 text-stone-950 shadow-[0_2px_12px_rgba(224,142,69,0.28)] ring-2 ring-amber-500/20'
                : 'border-transparent text-ink-muted dark:text-linen-subtle hover:text-ink-primary dark:hover:text-linen hover:bg-stone-200/70 dark:hover:bg-white/[0.04]'
            }`}
          >
            <span className="inline-flex items-center justify-center gap-1.5">
              {filter === tab.id && (
                <span className="w-1.5 h-1.5 rounded-full bg-stone-950 shrink-0" aria-hidden="true" />
              )}
              <span>{tab.label}</span>
            </span>
          </button>
        ))}
      </div>

      {/* Scheduled Tasks Header */}
      <div className="flex items-center justify-between pt-1 gap-2">
        <h2 className="text-xs font-bold uppercase tracking-wider text-ink-muted dark:text-linen-subtle">
          Scheduled Tasks {filter !== 'all' ? `• ${filter.toUpperCase()}` : ''}
        </h2>
        <span className="text-[11px] text-ink-subtle dark:text-linen-faint shrink-0">
          {filteredUncompleted.length} {filteredUncompleted.length === 1 ? 'task' : 'tasks'}
        </span>
      </div>

      {/* Timeline Sections: NOW, NEXT, LATER */}
      <div className="space-y-5">
        {filteredUncompleted.length === 0 ? (
          <div className="py-10 text-center space-y-2 p-6 rounded-3xl bg-surface dark:bg-surface-dark border border-stone-200/80 dark:border-white/[0.08]">
            <p className="text-sm font-semibold text-ink-primary dark:text-linen">
              {filter === 'must'
                ? 'No Must tasks scheduled right now.'
                : filter === 'care'
                ? 'No Self-care activities scheduled right now.'
                : filter === 'rest'
                ? 'No Rest periods scheduled right now.'
                : 'No tasks scheduled for today.'}
            </p>
            <p className="text-xs text-ink-muted dark:text-linen-subtle max-w-sm mx-auto leading-relaxed">
              {filter === 'all'
                ? 'Take your time. You can choose a rest recommendation above or tap "+ Add something" below when you\'re ready.'
                : 'You can switch back to "All" to view your full day, or add something below.'}
            </p>
          </div>
        ) : (
          <>
            {/* NOW section */}
            {effectiveNow.length > 0 && (
              <section className="space-y-2">
                <h2 className="text-xs font-bold uppercase tracking-wider text-ink-muted dark:text-linen-subtle">
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
      <hr className="border-stone-200/80 dark:border-white/[0.08] my-6" />

      {/* Universal + Add something */}
      <div>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setShowAddMenu(true);
            setAddMode('menu');
          }}
          className="w-full flex items-center justify-center gap-2 min-h-[48px] py-3.5 px-5 rounded-2xl bg-surface dark:bg-surface-dark border border-stone-200/90 dark:border-white/[0.08] hover:border-stone-300 dark:hover:border-white/[0.15] text-sm font-semibold text-ink-primary dark:text-linen shadow-sm transition-all active:scale-95"
        >
          <Plus className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          <span>Add something</span>
        </button>
      </div>

      {/* Completed tasks toggle (subtle and secondary) */}
      {completedToday.length > 0 && (
        <div className="pt-2 text-center">
          <button
            type="button"
            onClick={() => setShowCompleted(!showCompleted)}
            className="inline-flex items-center gap-1.5 text-xs text-ink-muted hover:text-ink-primary dark:text-slate-400 dark:hover:text-slate-200 transition-colors py-1.5 px-3 rounded-xl"
          >
            <span>{completedToday.length} completed today</span>
            {showCompleted ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {showCompleted && (
            <div className="mt-3 space-y-2 text-left animate-fade-in">
              {completedToday.map((t) => (
                <div
                  key={t.id}
                  className="flex items-center justify-between p-3 rounded-2xl bg-stone-50/70 dark:bg-white/[0.04] border border-stone-200/60 dark:border-white/[0.06] opacity-70"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-base select-none">{t.icon || '✓'}</span>
                    <span className="text-xs line-through text-ink-muted dark:text-linen-subtle truncate">{t.title}</span>
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
          className="fixed inset-0 z-50 flex items-end justify-center pb-[env(safe-area-inset-bottom,0px)] sm:items-center sm:p-4 bg-stone-900/40 dark:bg-black/60 backdrop-blur-[1px] animate-fade-in"
          role="dialog"
          aria-modal="true"
          onClick={() => {
            setShowAddMenu(false);
            setAddMode('menu');
          }}
        >
          <div
            className="modal-sheet relative w-full sm:max-w-md bg-surface dark:bg-surface-dark border-t sm:border border-stone-200/90 dark:border-white/[0.08] sm:rounded-3xl rounded-t-3xl shadow-2xl p-6 overflow-y-auto animate-slide-up space-y-5"
            style={{ maxHeight: 'calc(100dvh - env(safe-area-inset-top, 0px) - env(safe-area-inset-bottom, 0px) - 1rem)' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drag handle */}
            <div className="sm:hidden flex justify-center -mt-2 pb-1">
              <div className="w-10 h-1 rounded-full bg-stone-300 dark:bg-white/20" />
            </div>

            <div className="flex items-center justify-between pb-2 border-b border-stone-100 dark:border-white/[0.06]">
              <h3 className="text-lg font-bold text-ink-primary dark:text-linen">
                {addMode === 'care' ? 'Choose Self-Care' : addMode === 'rest' ? 'Choose Rest' : 'Add something'}
              </h3>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (addMode !== 'menu') setAddMode('menu');
                  else setShowAddMenu(false);
                }}
                aria-label="Close"
                className="p-1.5 rounded-xl text-ink-muted hover:text-ink-primary dark:hover:text-linen hover:bg-stone-100 dark:hover:bg-white/[0.04]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {addMode === 'menu' && (
              <div className="space-y-2.5">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowAddMenu(false);
                    openModal('create_task');
                  }}
                  className="w-full flex items-center gap-3.5 min-h-[44px] p-4 rounded-2xl border border-stone-200/80 dark:border-white/[0.08] hover:bg-stone-50 dark:hover:bg-white/[0.04] text-left transition-all active:scale-95"
                >
                  <span className="text-xl">📋</span>
                  <div>
                    <h4 className="text-sm font-semibold text-ink-primary dark:text-linen">Task</h4>
                    <p className="text-xs text-ink-muted dark:text-linen-subtle">Any activity or project you want to step into.</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setAddMode('care');
                  }}
                  className="w-full flex items-center gap-3.5 min-h-[44px] p-4 rounded-2xl border border-brand-200/70 dark:border-brand-900/50 bg-brand-50/40 dark:bg-brand-950/20 hover:bg-brand-50 dark:hover:bg-brand-950/40 text-left transition-all active:scale-95"
                >
                  <span className="text-xl">💧</span>
                  <div>
                    <h4 className="text-sm font-semibold text-brand-900 dark:text-brand-200">Self-care</h4>
                    <p className="text-xs text-brand-700/80 dark:text-brand-300/80">Water, teeth, face, food, gentle movement.</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setAddMode('rest');
                  }}
                  className="w-full flex items-center gap-3.5 min-h-[44px] p-4 rounded-2xl border border-amber-200/70 dark:border-amber-900/50 bg-amber-50/40 dark:bg-amber-950/20 hover:bg-amber-50 dark:hover:bg-amber-950/40 text-left transition-all active:scale-95"
                >
                  <span className="text-xl">☕</span>
                  <div>
                    <h4 className="text-sm font-semibold text-amber-900 dark:text-amber-200">Rest</h4>
                    <p className="text-xs text-amber-800/80 dark:text-amber-300/80">True rest is a legitimate activity, not earned guilt.</p>
                  </div>
                </button>

                <Link
                  href="/routines"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowAddMenu(false);
                  }}
                  className="w-full flex items-center gap-3.5 min-h-[44px] p-4 rounded-2xl border border-stone-200/80 dark:border-white/[0.08] hover:bg-stone-50 dark:hover:bg-white/[0.04] text-left transition-all active:scale-95"
                >
                  <span className="text-xl">✨</span>
                  <div>
                    <h4 className="text-sm font-semibold text-ink-primary dark:text-linen">Routine</h4>
                    <p className="text-xs text-ink-muted dark:text-linen-subtle">Run a sequence like Morning Care or 5-Minute Reset.</p>
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
                      <span className="text-xs font-medium text-ink-primary dark:text-linen break-words leading-snug">{preset.title}</span>
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
                        <span className="text-xs font-medium text-ink-primary dark:text-linen block break-words leading-snug">{r.title}</span>
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
