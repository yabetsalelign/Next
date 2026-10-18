'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import { Header } from '@/components/layout/Header';
import { Routine } from '@/types';
import { 
  Play, 
  Check, 
  Plus, 
  BookOpen, 
  ChevronDown, 
  ChevronUp, 
  ArrowRight,
  Sparkles,
  Sun,
  Moon,
  Coffee
} from 'lucide-react';
import { sounds } from '@/lib/sounds';

function RoutineCard({ 
  routine, 
  onStart, 
  isLibrary = false 
}: { 
  routine: Routine; 
  onStart?: () => void;
  isLibrary?: boolean;
}) {
  const { toggleRoutineStep, openModal, updateRoutine } = useApp();
  const [showSteps, setShowSteps] = useState(false);

  const completedCount = routine.steps.filter(s => s.completed).length;
  const isAllDone = routine.steps.length > 0 && completedCount === routine.steps.length;
  const isEnabled = routine.enabled !== false;

  const totalMinutes = routine.steps.reduce((acc, s) => acc + (s.durationMinutes || 3), 0);

  return (
    <article className="rounded-xl bg-surface dark:bg-surface-dark border border-stone-200/90 dark:border-white/[0.08] shadow-sm p-4 sm:p-5 flex flex-col gap-3.5 transition-all hover:border-stone-300 dark:hover:border-white/[0.14] overflow-hidden">
      {/* Header Row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0 flex-1">
          <span className="text-2xl select-none pt-0.5 shrink-0" role="img" aria-hidden="true">
            {routine.icon || '✨'}
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base font-bold text-ink-primary dark:text-linen leading-snug break-words">
                {routine.title}
              </h3>
              {isAllDone && (
                <span className="text-[10px] font-bold text-sage-700 dark:text-sage-300 bg-sage-500/15 px-2 py-0.5 rounded-md">
                  Done ✓
                </span>
              )}
            </div>
            <p className="text-xs text-ink-muted dark:text-linen-subtle mt-0.5">
              {routine.steps.length} {routine.steps.length === 1 ? 'step' : 'steps'} • ~{totalMinutes} min • Flexible order
            </p>
          </div>
        </div>

        {isLibrary && (
          <button
            type="button"
            onClick={() => updateRoutine(routine.id, { enabled: !isEnabled })}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 ${
              isEnabled
                ? 'bg-amber-500/15 text-amber-800 dark:text-amber-300 border border-amber-500/30'
                : 'bg-stone-100 dark:bg-white/[0.06] text-ink-secondary dark:text-linen'
            }`}
          >
            {isEnabled ? 'Active' : '+ Add'}
          </button>
        )}
      </div>

      {/* Stepper Pill Track: Intended Flow */}
      {routine.steps.length > 0 && (
        <div className="bg-stone-50 dark:bg-white/[0.03] rounded-lg p-3 border border-stone-200/60 dark:border-white/[0.04] space-y-2">
          <div className="flex items-center justify-between text-[11px] text-ink-muted dark:text-linen-subtle font-medium">
            <span>Intended Flow</span>
            <span className="text-amber-700 dark:text-amber-400 font-semibold">Any order ok</span>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            {routine.steps.map((step, idx) => (
              <React.Fragment key={step.id}>
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                    step.completed
                      ? 'bg-sage-500/15 text-sage-800 dark:text-sage-300 line-through'
                      : 'bg-surface dark:bg-surface-dark border border-stone-200/80 dark:border-white/[0.08] text-ink-primary dark:text-linen'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${step.completed ? 'bg-sage-500' : 'bg-amber-500'}`} />
                  <span className="truncate max-w-[120px]">{step.title}</span>
                </span>
                {idx < routine.steps.length - 1 && (
                  <span className="text-stone-300 dark:text-white/20 text-xs">→</span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}

      {/* Action Row */}
      <div className="flex items-center gap-2 pt-1">
        <button
          type="button"
          onClick={() => {
            onStart?.();
            openModal('routine_runner', undefined, routine.id);
          }}
          className="flex-1 h-11 rounded-lg bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-stone-950 font-bold text-xs flex items-center justify-center gap-2 shadow-sm active:scale-[0.98] transition-all"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>Start routine</span>
        </button>

        <button
          type="button"
          onClick={() => setShowSteps(!showSteps)}
          className="h-11 px-3.5 rounded-lg bg-stone-100 hover:bg-stone-200 dark:bg-white/[0.06] dark:hover:bg-white/[0.1] text-ink-primary dark:text-linen text-xs font-semibold flex items-center gap-1 transition-colors border border-stone-200/60 dark:border-white/[0.04]"
        >
          <span>{showSteps ? 'Hide steps' : 'View steps'}</span>
          {showSteps ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Expanded Checklist */}
      {showSteps && (
        <div className="pt-2 border-t border-stone-200/60 dark:border-white/[0.06] space-y-1.5 animate-fade-in">
          {routine.steps.map((step) => (
            <div
              key={step.id}
              onClick={() => {
                sounds.playStepComplete();
                toggleRoutineStep(routine.id, step.id);
              }}
              className="flex items-center justify-between p-2 rounded-lg hover:bg-stone-50 dark:hover:bg-white/[0.02] cursor-pointer text-xs"
            >
              <div className="flex items-center gap-2.5 truncate">
                <span className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-colors ${
                  step.completed
                    ? 'bg-sage-500 border-sage-500 text-white'
                    : 'border-stone-300 dark:border-white/20 bg-surface dark:bg-surface-dark'
                }`}>
                  {step.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </span>
                <span className={`truncate ${step.completed ? 'line-through text-ink-muted dark:text-linen-subtle' : 'text-ink-primary dark:text-linen font-medium'}`}>
                  {step.title}
                </span>
              </div>
              <span className="text-[10px] text-ink-subtle dark:text-linen-faint shrink-0">
                {step.durationMinutes}m
              </span>
            </div>
          ))}
        </div>
      )}
    </article>
  );
}

export default function RoutinesPage() {
  const { routines, openModal } = useApp();

  const myRoutines = routines.filter(r => r.enabled !== false);
  const libraryRoutines = routines.filter(r => r.enabled === false);

  return (
    <div className="max-w-xl mx-auto space-y-6 animate-fade-in pb-28 md:pb-10">
      {/* Header */}
      <Header
        title="Routines"
        subtitle="Self-paced anchor flows. No alarms, no streaks, no guilt."
      />

      {/* Top Action Row */}
      <div className="flex items-center justify-between pt-1">
        <h2 className="text-xs font-bold uppercase tracking-wider text-ink-muted dark:text-linen-subtle">
          Active Routines
        </h2>
        <button
          type="button"
          onClick={() => openModal('add_routine')}
          className="h-8 px-3 rounded-lg bg-stone-100 hover:bg-stone-200 dark:bg-white/[0.06] dark:hover:bg-white/[0.1] text-ink-primary dark:text-linen text-xs font-semibold flex items-center gap-1.5 transition-colors border border-stone-200/70 dark:border-white/[0.06]"
        >
          <Plus className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
          <span>New routine</span>
        </button>
      </div>

      {/* Routine Cards Grid */}
      <div className="space-y-4">
        {myRoutines.length === 0 ? (
          <div className="p-8 rounded-xl bg-surface dark:bg-surface-dark border border-stone-200/90 dark:border-white/[0.08] text-center space-y-2 shadow-sm">
            <p className="text-sm font-semibold text-ink-primary dark:text-linen">
              No active routines yet.
            </p>
            <p className="text-xs text-ink-muted dark:text-linen-subtle max-w-xs mx-auto leading-relaxed">
              Create a custom anchor routine or activate one of the gentle templates below.
            </p>
          </div>
        ) : (
          myRoutines.map((routine) => (
            <RoutineCard key={routine.id} routine={routine} />
          ))
        )}
      </div>

      {/* Routine Templates / Exploration Section */}
      {libraryRoutines.length > 0 && (
        <section className="space-y-3 pt-4 border-t border-stone-200/60 dark:border-white/[0.06]">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-ink-muted dark:text-linen-subtle">
              Explore Routine Templates
            </h2>
            <span className="text-xs text-ink-subtle dark:text-linen-faint">
              Tap + Add to activate
            </span>
          </div>

          <div className="space-y-3">
            {libraryRoutines.map((routine) => (
              <RoutineCard key={routine.id} routine={routine} isLibrary />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
