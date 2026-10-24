'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import { Routine } from '@/types';
import { sounds } from '@/lib/sounds';
import { X, PlusCircle, Check, Play, ChevronDown, ChevronUp, RotateCcw, MinusCircle, Plus, Pencil } from 'lucide-react';

function LibraryRoutineCard({
  routine,
}: {
  routine: Routine;
}) {
  const { openModal, updateRoutine, resetRoutineSteps, toggleRoutineStep } = useApp();
  const [showSteps, setShowSteps] = useState(false);
  const [newStepText, setNewStepText] = useState('');

  const isEnabled = routine.enabled !== false;
  const routineSteps = routine.steps || [];
  const completedStepsCount = routineSteps.filter(s => s.completed).length;
  const totalStepsCount = routineSteps.length;
  const isAllDone = totalStepsCount > 0 && completedStepsCount === totalStepsCount;

  const handleToggleActive = (e: React.MouseEvent) => {
    e.stopPropagation();
    updateRoutine(routine.id, { enabled: !isEnabled });
  };

  const handleStartRoutine = (e: React.MouseEvent) => {
    e.stopPropagation();
    openModal('routine_runner', undefined, routine.id);
  };

  const handleAddStep = () => {
    if (!newStepText.trim()) return;
    const updatedSteps = [
      ...routineSteps,
      {
        id: `step-${Date.now()}-${routineSteps.length + 1}`,
        title: newStepText.trim(),
        durationMinutes: 5,
        completed: false,
      },
    ];
    updateRoutine(routine.id, { steps: updatedSteps });
    setNewStepText('');
  };

  const previewText = routineSteps.slice(0, 3).map(s => s.title).join(' · ');

  return (
    <article className="rounded-2xl bg-surface dark:bg-surface-dark border border-stone-200/90 dark:border-white/[0.08] shadow-sm transition-all overflow-hidden">
      {/* Collapsed / Summary Row */}
      <div className="p-3.5 sm:p-4 flex items-start justify-between gap-3">
        <div
          className="flex-1 min-w-0 cursor-pointer select-none"
          onClick={() => setShowSteps(!showSteps)}
        >
          <div className="flex items-start gap-2.5">
            <span className="text-xl select-none pt-0.5 shrink-0" role="img" aria-hidden="true">
              {routine.icon}
            </span>
            <div className="min-w-0 flex-1">
              <h4 className="text-sm sm:text-base font-semibold text-ink-primary dark:text-linen break-words leading-snug">
                {routine.title}
              </h4>
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
        <div className="flex items-center gap-1.5 shrink-0 pt-0.5">
          <button
            type="button"
            onClick={handleToggleActive}
            className={`flex items-center gap-1.5 min-h-[38px] py-1.5 px-3 rounded-xl font-semibold text-xs transition-all active:scale-95 ${
              isEnabled
                ? 'bg-amber-500/15 text-amber-800 dark:text-amber-300 border border-amber-500/30'
                : 'bg-stone-100 dark:bg-white/[0.06] text-ink-secondary dark:text-linen hover:bg-stone-200 dark:hover:bg-white/[0.1]'
            }`}
          >
            {isEnabled ? <Check className="w-3.5 h-3.5" /> : <PlusCircle className="w-3.5 h-3.5" />}
            <span>{isEnabled ? 'Active' : '+ Add'}</span>
          </button>

          <button
            type="button"
            onClick={() => setShowSteps(!showSteps)}
            aria-label={showSteps ? 'Collapse routine details' : 'Expand routine details'}
            className="p-1.5 min-h-[38px] min-w-[38px] flex items-center justify-center text-ink-muted hover:text-ink-primary dark:text-linen-subtle dark:hover:text-linen rounded-xl hover:bg-stone-100 dark:hover:bg-white/[0.04] transition-colors"
          >
            {showSteps ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Expanded details */}
      {showSteps && (
        <div className="px-4 pb-4 pt-1 border-t border-stone-100 dark:border-white/[0.06] space-y-3.5 animate-fade-in">
          {/* Steps list */}
          <div className="space-y-2 pt-1">
            {routineSteps.map((step, idx) => (
              <div
                key={step.id}
                className="flex items-start justify-between gap-2.5 py-1 text-sm"
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

                <span className="text-[11px] text-ink-subtle dark:text-linen-faint shrink-0 pt-0.5">
                  ~{step.durationMinutes}m
                </span>
              </div>
            ))}
          </div>

          {/* Action Row */}
          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={handleStartRoutine}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs shadow-sm transition-all active:scale-[0.99]"
            >
              <Play className="w-3.5 h-3.5" />
              <span>Start routine</span>
            </button>

            <button
              type="button"
              onClick={() => openModal('add_routine', undefined, routine.id)}
              title="Edit routine and steps"
              aria-label="Edit routine and steps"
              className="p-2.5 rounded-xl border border-stone-200 dark:border-white/[0.08] text-ink-muted hover:text-ink-primary hover:bg-stone-50 dark:hover:bg-white/[0.04] transition-colors"
            >
              <Pencil className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => resetRoutineSteps(routine.id)}
              title="Reset checkmarks"
              aria-label="Reset routine steps"
              className="p-2.5 rounded-xl border border-stone-200 dark:border-white/[0.08] text-ink-muted hover:text-ink-primary hover:bg-stone-50 dark:hover:bg-white/[0.04] transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={handleToggleActive}
              title={isEnabled ? 'Hide from My Routines' : 'Add to My Routines'}
              aria-label={isEnabled ? 'Hide from My Routines' : 'Add to My Routines'}
              className="p-2.5 rounded-xl border border-stone-200 dark:border-white/[0.08] text-ink-muted hover:text-ink-primary hover:bg-stone-50 dark:hover:bg-white/[0.04] transition-colors text-xs font-medium"
            >
              {isEnabled ? <MinusCircle className="w-4 h-4 text-stone-400" /> : <PlusCircle className="w-4 h-4 text-amber-600" />}
            </button>
          </div>

          {/* Add step */}
          <div className="flex items-center gap-2 pt-0.5">
            <input
              type="text"
              placeholder="Add step..."
              value={newStepText}
              onChange={(e) => setNewStepText(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleAddStep(); }}
              inputMode="text"
              enterKeyHint="done"
              className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-stone-200 dark:border-white/[0.12] bg-stone-50/60 dark:bg-white/[0.04] text-ink-primary dark:text-linen placeholder:text-ink-subtle focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <button
              type="button"
              onClick={handleAddStep}
              aria-label="Add step"
              className="p-1.5 rounded-xl bg-stone-100 dark:bg-white/[0.06] text-ink-primary dark:text-linen hover:bg-stone-200"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </article>
  );
}

export function RoutineLibraryModal() {
  const { routines, closeModal } = useApp();

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center pb-[env(safe-area-inset-bottom,0px)] sm:items-center sm:p-4 bg-stone-900/40 dark:bg-black/60 backdrop-blur-[1px] animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="routine-library-title"
      onClick={closeModal}
    >
      <div
        className="modal-sheet relative w-full sm:max-w-md bg-surface dark:bg-surface-dark border-t sm:border border-stone-200/90 dark:border-white/[0.08] sm:rounded-3xl rounded-t-3xl shadow-2xl p-5 sm:p-6 overflow-y-auto overscroll-contain animate-slide-up space-y-4"
        style={{ maxHeight: 'calc(100dvh - env(safe-area-inset-top, 0px) - env(safe-area-inset-bottom, 0px) - 1rem)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sm:hidden flex justify-center -mt-2 pb-1">
          <div className="w-10 h-1 rounded-full bg-stone-300 dark:bg-white/20" />
        </div>

        <div className="flex items-center justify-between pb-2 border-b border-stone-100 dark:border-white/[0.06]">
          <div>
            <h3 id="routine-library-title" className="text-lg font-bold text-ink-primary dark:text-linen">
              Routine Library
            </h3>
            <p className="text-xs text-ink-muted dark:text-linen-subtle break-words">
              Tap &ldquo;+ Add&rdquo; to keep a sequence in My Routines.
            </p>
          </div>
          <button
            type="button"
            onClick={closeModal}
            aria-label="Close"
            className="p-2 rounded-xl text-ink-muted hover:text-ink-primary dark:hover:text-linen hover:bg-stone-100 dark:hover:bg-white/[0.04] transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3 pt-1">
          {routines.map((routine) => (
            <LibraryRoutineCard key={routine.id} routine={routine} />
          ))}
        </div>
      </div>
    </div>
  );
}
