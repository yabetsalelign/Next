'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import { Header } from '@/components/layout/Header';
import { Routine } from '@/types';
import { 
  Play, 
  Check, 
  RotateCcw,
  Plus, 
  BookOpen, 
  ChevronDown, 
  ChevronUp, 
  X,
  MinusCircle,
  PlusCircle
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
  const { toggleRoutineStep, resetRoutineSteps, openModal, updateRoutine } = useApp();
  const [showSteps, setShowSteps] = useState(false);
  const [newStepText, setNewStepText] = useState('');

  const completedCount = routine.steps.filter(s => s.completed).length;
  const isAllDone = routine.steps.length > 0 && completedCount === routine.steps.length;
  const isEnabled = routine.enabled !== false;

  // Short preview text of first 3 steps
  const previewText = routine.steps.slice(0, 3).map(s => s.title).join(' · ');

  const handleAddStep = () => {
    const text = newStepText.trim();
    if (!text) return;
    updateRoutine(routine.id, {
      steps: [
        ...routine.steps,
        { id: `step-${Date.now()}`, title: text, durationMinutes: 5, completed: false }
      ]
    });
    setNewStepText('');
  };

  const handleToggleActive = (e: React.MouseEvent) => {
    e.stopPropagation();
    updateRoutine(routine.id, { enabled: !isEnabled });
  };

  return (
    <article className={`rounded-3xl bg-surface dark:bg-surface-dark border shadow-sm transition-all overflow-hidden ${
      showSteps ? 'border-amber-500/35 dark:border-amber-500/25 ring-1 ring-amber-500/15' : 'border-stone-200/90 dark:border-white/[0.08]'
    }`}>
      {/* Collapsed / Summary Row */}
      <div className="p-4 sm:p-5 flex items-start sm:items-center justify-between gap-3">
        <div 
          className="flex-1 min-w-0 cursor-pointer select-none"
          onClick={() => setShowSteps(!showSteps)}
        >
          <div className="flex items-start gap-2.5">
            <span className="text-xl select-none pt-0.5 shrink-0" role="img" aria-hidden="true">{routine.icon}</span>
            <div className="min-w-0 flex-1">
              <h3 className="text-base sm:text-lg font-semibold text-ink-primary dark:text-linen break-words leading-snug">
                {routine.title}
              </h3>
              {isAllDone && (
                <span className="inline-block mt-1 text-[10px] font-bold text-sage-700 dark:text-sage-300 bg-sage-500/15 px-2 py-0.5 rounded-full">
                  Done ✓
                </span>
              )}
              <p className="text-xs text-ink-muted dark:text-linen-subtle mt-1 leading-relaxed break-words">
                {previewText || routine.description}
              </p>
            </div>
          </div>
        </div>

        {/* Action controls */}
        <div className="flex items-center gap-1.5 shrink-0">
          {isLibrary ? (
            <button
              type="button"
              onClick={handleToggleActive}
              className={`flex items-center gap-1.5 min-h-[44px] py-2 px-3 rounded-xl font-semibold text-xs transition-all active:scale-95 ${
                isEnabled
                  ? 'bg-amber-500/15 text-amber-800 dark:text-amber-300 border border-amber-500/30'
                  : 'bg-stone-100 dark:bg-white/[0.06] text-ink-secondary dark:text-linen hover:bg-stone-200'
              }`}
            >
              {isEnabled ? <Check className="w-3.5 h-3.5" /> : <PlusCircle className="w-3.5 h-3.5" />}
              <span>{isEnabled ? 'Active' : '+ Add'}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onStart?.();
                openModal('routine_runner', undefined, routine.id);
              }}
              className="flex items-center gap-1.5 min-h-[44px] py-2.5 px-3.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs shadow-sm transition-all active:scale-95"
            >
              <Play className="w-3.5 h-3.5" />
              <span>Start</span>
            </button>
          )}

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setShowSteps(!showSteps);
            }}
            className="w-11 h-11 flex items-center justify-center rounded-xl text-ink-muted hover:text-ink-primary hover:bg-stone-100 dark:hover:bg-white/[0.04] transition-colors"
            aria-label={showSteps ? 'Collapse routine' : 'Expand routine'}
          >
            {showSteps ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Expanded Content: Inside a routine */}
      {showSteps && (
        <div className="px-5 pb-5 pt-1 border-t border-stone-100 dark:border-white/[0.06] space-y-4 animate-fade-in">
          {/* Steps ordered list */}
          <div className="space-y-2 pt-2">
            {routine.steps.map((step, idx) => (
              <div
                key={step.id}
                className="flex items-center justify-between gap-3 py-1.5 text-sm"
              >
                <div className="flex items-start gap-2.5 min-w-0 flex-1">
                  <button
                    type="button"
                    onClick={() => {
                      sounds.playMinimumComplete();
                      toggleRoutineStep(routine.id, step.id);
                    }}
                    className={`w-5 h-5 mt-0.5 rounded-lg border flex items-center justify-center shrink-0 transition-colors ${
                      step.completed
                        ? 'bg-sage-600 text-white border-sage-600'
                        : 'border-stone-300 dark:border-white/[0.2] hover:border-amber-500'
                    }`}
                    aria-label={step.completed ? 'Mark incomplete' : 'Mark complete'}
                  >
                    {step.completed && <Check className="w-3.5 h-3.5" />}
                  </button>

                  <span className={`text-xs sm:text-sm break-words leading-relaxed ${
                    step.completed 
                      ? 'line-through text-ink-muted dark:text-linen-subtle' 
                      : 'text-ink-primary dark:text-linen'
                  }`}>
                    <span className="font-medium text-ink-muted mr-1.5">{idx + 1}.</span>
                    {step.title}
                  </span>
                </div>

                <span className="text-[11px] text-ink-subtle dark:text-linen-faint shrink-0">
                  ~{step.durationMinutes}m
                </span>
              </div>
            ))}
          </div>

          {/* Minimum rule banner */}
          <div className="p-3.5 rounded-2xl bg-amber-500/10 dark:bg-amber-500/[0.08] border border-amber-500/20 text-left">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300 block">
              The Minimum Rule
            </span>
            <p className="text-xs text-amber-900 dark:text-amber-200 font-medium mt-0.5">
              Complete any one step. That counts as running the routine.
            </p>
          </div>

          {/* Action Row */}
          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onStart?.();
                openModal('routine_runner', undefined, routine.id);
              }}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs shadow-sm transition-all active:scale-[0.99]"
            >
              <Play className="w-3.5 h-3.5" />
              <span>Start routine</span>
            </button>

            <button
              type="button"
              onClick={() => resetRoutineSteps(routine.id)}
              title="Reset checkmarks"
              aria-label="Reset routine steps"
              className="p-3 rounded-2xl border border-stone-200 dark:border-white/[0.08] text-ink-muted hover:text-ink-primary hover:bg-stone-50 dark:hover:bg-white/[0.04] transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Toggle active / hide */}
            <button
              type="button"
              onClick={handleToggleActive}
              title={isEnabled ? 'Hide from My Routines' : 'Add to My Routines'}
              aria-label={isEnabled ? 'Hide from My Routines' : 'Add to My Routines'}
              className="p-3 rounded-2xl border border-stone-200 dark:border-white/[0.08] text-ink-muted hover:text-ink-primary hover:bg-stone-50 dark:hover:bg-white/[0.04] transition-colors text-xs font-medium"
            >
              {isEnabled ? <MinusCircle className="w-4 h-4 text-stone-400" /> : <PlusCircle className="w-4 h-4 text-amber-600" />}
            </button>
          </div>

          {/* Inline Add Step */}
          <div className="flex items-center gap-2 pt-1">
            <input
              type="text"
              placeholder="Add step to routine..."
              value={newStepText}
              onChange={(e) => setNewStepText(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleAddStep(); }}
              inputMode="text"
              enterKeyHint="done"
              className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-stone-200 dark:border-white/[0.12] bg-stone-50/60 dark:bg-white/[0.04] text-ink-primary dark:text-linen placeholder:text-ink-subtle focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <button
              type="button"
              onClick={handleAddStep}
              aria-label="Add step"
              className="p-2 rounded-xl bg-stone-100 dark:bg-white/[0.06] text-ink-primary dark:text-linen hover:bg-stone-200"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </article>
  );
}

export default function RoutinesPage() {
  const { routines, openModal } = useApp();

  // Explicit active routines (user chosen or enabled by default)
  const myRoutines = routines.filter(r => r.enabled !== false);
  const libraryRoutines = routines;

  return (
    <div className="max-w-xl mx-auto space-y-6 animate-fade-in pb-28 md:pb-10">
      {/* Header */}
      <Header
        title="Routines"
        subtitle="Flexible sequences to ease transitions. Complete any one step."
      />

      {/* MY ROUTINES */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-ink-muted dark:text-linen-subtle">
            My routines
          </h2>
          <span className="text-[11px] text-ink-subtle dark:text-linen-faint">
            {myRoutines.length} active
          </span>
        </div>

        <div className="space-y-3">
          {myRoutines.length > 0 ? (
            myRoutines.map((routine) => (
              <RoutineCard key={routine.id} routine={routine} />
            ))
          ) : (
            <div className="p-6 text-center rounded-3xl bg-surface dark:bg-surface-dark border border-stone-200/90 dark:border-white/[0.08] space-y-3">
              <p className="text-sm font-medium text-ink-primary dark:text-linen">
                No active routines right now.
              </p>
              <p className="text-xs text-ink-muted dark:text-linen-subtle max-w-sm mx-auto leading-relaxed">
                Routines are low-pressure step sequences to ease transitions. Pick a template from the library or create a small personal sequence.
              </p>
              <div className="flex items-center justify-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => openModal('routine_library')}
                  className="py-2 px-3.5 rounded-xl border border-stone-200 dark:border-white/[0.12] text-xs font-semibold text-ink-primary dark:text-linen hover:bg-stone-50 dark:hover:bg-white/[0.04] transition-colors"
                >
                  Browse library
                </button>
                <button
                  type="button"
                  onClick={() => openModal('add_routine')}
                  className="py-2 px-3.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shadow-sm transition-colors"
                >
                  Create routine
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Action Links: + Add routine & Routine library */}
      <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
        <button
          type="button"
          onClick={() => openModal('add_routine')}
          className="w-full sm:flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-surface dark:bg-surface-dark border border-stone-200/90 dark:border-white/[0.08] hover:border-stone-300 text-xs font-semibold text-ink-primary dark:text-linen shadow-sm transition-all"
        >
          <Plus className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          <span>Add routine</span>
        </button>

        <button
          type="button"
          onClick={() => openModal('routine_library')}
          className="w-full sm:flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-2xl border border-stone-200/80 dark:border-white/[0.08] text-xs font-semibold text-ink-secondary dark:text-linen-subtle hover:bg-stone-50 dark:hover:bg-white/[0.04] transition-colors"
        >
          <BookOpen className="w-4 h-4 text-ink-muted" />
          <span>Routine library ({libraryRoutines.length})</span>
        </button>
      </div>
    </div>
  );
}
