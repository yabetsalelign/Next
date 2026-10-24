'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '@/lib/store';
import { sounds } from '@/lib/sounds';
import { X, Check, RotateCcw, Plus, Sparkles } from 'lucide-react';

export function RoutineRunnerModal() {
  const { activeRoutineId, routines, closeModal, setRoutineStepCompleted, resetRoutineSteps, openModal } = useApp();
  const routine = routines.find((r) => r.id === activeRoutineId) || null;

  const steps = routine?.steps || [];

  const [stepIndex, setStepIndex] = useState(() => {
    if (!routine || steps.length === 0) return 0;
    const firstIncomplete = steps.findIndex((s) => !s.completed);
    return firstIncomplete >= 0 ? firstIncomplete : steps.length;
  });

  const completingRef = useRef(false);

  useEffect(() => {
    if (!routine) {
      closeModal();
    }
  }, [routine, closeModal]);

  if (!routine) return null;

  const hasNoSteps = steps.length === 0;
  const isFinished = !hasNoSteps && stepIndex >= steps.length;
  const currentStep = !hasNoSteps && !isFinished ? steps[stepIndex] : null;

  const handleCompleteStep = () => {
    if (completingRef.current || !currentStep) return;
    completingRef.current = true;

    sounds.playMinimumComplete();
    setRoutineStepCompleted(routine.id, currentStep.id, true);

    const nextIndex = stepIndex + 1;
    setStepIndex(nextIndex);

    if (nextIndex >= steps.length) {
      sounds.playMinimumComplete();
    }

    setTimeout(() => {
      completingRef.current = false;
    }, 200);
  };

  const handleSkipStep = () => {
    setStepIndex((prev) => Math.min(steps.length, prev + 1));
  };

  const handleResetAndRestart = () => {
    resetRoutineSteps(routine.id);
    setStepIndex(0);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center pb-[env(safe-area-inset-bottom,0px)] sm:items-center sm:p-4 bg-stone-900/40 dark:bg-black/60 backdrop-blur-[1px] animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="routine-runner-title"
      onClick={closeModal}
    >
      <div
        className="modal-sheet relative w-full sm:max-w-lg bg-surface dark:bg-surface-dark border-t sm:border border-stone-200/90 dark:border-white/[0.08] sm:rounded-3xl rounded-t-3xl shadow-2xl overflow-y-auto overscroll-contain animate-slide-up flex flex-col"
        style={{ maxHeight: 'calc(100dvh - env(safe-area-inset-top, 0px) - env(safe-area-inset-bottom, 0px) - 0.5rem)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag handle (mobile) */}
        <div className="sm:hidden flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-stone-300 dark:bg-white/20" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 pt-4 pb-3 border-b border-stone-100 dark:border-white/[0.06]">
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <span className="text-xl select-none shrink-0" role="img" aria-hidden="true">{routine.icon}</span>
            <div className="min-w-0 flex-1">
              <h4 id="routine-runner-title" className="text-xs font-bold uppercase tracking-wider text-ink-primary dark:text-linen break-words leading-snug">
                {routine.title}
              </h4>
              <p className="text-[10px] text-ink-muted dark:text-linen-subtle">
                {hasNoSteps
                  ? 'No steps configured'
                  : isFinished
                  ? `${steps.length} of ${steps.length} steps complete`
                  : `Step ${stepIndex + 1} of ${steps.length}`}
              </p>
            </div>
          </div>
          <button
            onClick={closeModal}
            aria-label="Close"
            className="p-1.5 rounded-xl text-ink-muted hover:text-ink-primary dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 space-y-6">
          {hasNoSteps ? (
            /* Graceful empty state when routine has 0 steps */
            <div className="text-center py-6 space-y-4 animate-fade-in" data-purpose="runner-no-steps">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 mx-auto flex items-center justify-center text-2xl">
                ✨
              </div>
              <h3 className="text-lg font-bold text-ink-primary dark:text-slate-100">
                This routine has no steps yet
              </h3>
              <p className="text-xs text-ink-muted dark:text-slate-400 max-w-xs mx-auto">
                Add ordered steps to build out this rhythm and run through it whenever you are ready.
              </p>
              <div className="pt-2 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => openModal('add_routine', undefined, routine.id)}
                  className="w-full py-3 px-4 rounded-xl bg-primary text-on-primary font-semibold text-xs flex items-center justify-center gap-1.5 hover:opacity-90 transition-all shadow-sm"
                >
                  <Plus size={16} />
                  <span>Add steps to routine</span>
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-medium text-ink-muted hover:text-ink-primary dark:hover:text-slate-200 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          ) : isFinished ? (
            /* Complete State */
            <div className="text-center py-6 space-y-4 animate-fade-in" data-purpose="runner-finished">
              <div className="w-16 h-16 rounded-full bg-gentle-greenBg text-gentle-green mx-auto flex items-center justify-center">
                <Check className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-ink-primary dark:text-slate-100">
                Routine Complete
              </h3>
              <p className="text-sm text-ink-muted dark:text-slate-400 max-w-xs mx-auto">
                You completed this flow with zero rush. Return to your day whenever you are ready.
              </p>
              <div className="pt-2 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="w-full py-3.5 px-4 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-medium text-sm transition-all"
                >
                  Done
                </button>
                <button
                  type="button"
                  onClick={handleResetAndRestart}
                  className="w-full py-2.5 px-3 rounded-xl text-xs font-medium text-ink-muted hover:text-ink-primary dark:hover:text-slate-200 transition-colors inline-flex items-center justify-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Run again</span>
                </button>
              </div>
            </div>
          ) : (
            /* Active Step Runner */
            <div className="space-y-6" data-purpose="runner-active-step">
              {/* Focused Current Step Card */}
              <div className="rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 p-6 text-center space-y-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                  Step {stepIndex + 1} of {steps.length}
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-ink-primary dark:text-slate-100 leading-snug break-words">
                  {currentStep?.title}
                </h3>
                <p className="text-xs text-ink-muted dark:text-slate-400">
                  Approx. {currentStep?.durationMinutes || 5} min • Take whatever time you need
                </p>
              </div>

              {/* Step Action Buttons */}
              <div className="space-y-2.5">
                <button
                  type="button"
                  onClick={handleCompleteStep}
                  className="w-full flex items-center justify-center gap-2 py-4 px-5 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-base shadow-sm transition-all active:scale-[0.99]"
                >
                  <Check className="w-5 h-5" />
                  <span>Done with this step</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleSkipStep}
                    className="flex-1 py-2.5 px-3 rounded-xl text-xs font-medium text-ink-muted hover:text-ink-primary dark:hover:text-slate-200 transition-colors border border-transparent hover:border-stone-200 dark:hover:border-white/[0.08]"
                  >
                    Skip step
                  </button>

                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 py-2.5 px-3 rounded-xl text-xs font-medium text-amber-700 dark:text-amber-400 hover:underline transition-colors"
                  >
                    Finish now (1 step counts)
                  </button>
                </div>
              </div>

              {/* Steps Sequence Overview (See which step comes next) */}
              <div className="pt-2 border-t border-stone-200/80 dark:border-white/[0.06] space-y-2" data-purpose="runner-step-overview">
                <span className="block text-[11px] font-semibold text-ink-muted dark:text-linen-subtle uppercase tracking-wider">
                  Flow sequence
                </span>
                <div className="space-y-1.5 max-h-40 overflow-y-auto pr-0.5">
                  {steps.map((step, idx) => {
                    const isPast = idx < stepIndex;
                    const isCurrent = idx === stepIndex;
                    const isUpcoming = idx > stepIndex;

                    return (
                      <div
                        key={step.id}
                        className={`flex items-center justify-between text-xs p-2 rounded-xl border transition-colors ${
                          isCurrent
                            ? 'bg-primary/10 border-primary text-on-surface font-semibold'
                            : isPast
                            ? 'bg-surface-container-low/50 border-transparent text-on-surface-variant line-through'
                            : 'bg-surface-container-lowest border-outline-variant/50 text-on-surface-variant'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <span
                            className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                              isPast
                                ? 'bg-sage-600 text-white'
                                : isCurrent
                                ? 'bg-primary text-on-primary'
                                : 'bg-surface-container-high text-on-surface-variant'
                            }`}
                          >
                            {isPast ? '✓' : idx + 1}
                          </span>
                          <span className="truncate">{step.title}</span>
                        </div>
                        <span className="text-[10px] shrink-0 opacity-70">
                          {isCurrent ? 'Current' : `~${step.durationMinutes || 5}m`}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
