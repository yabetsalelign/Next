'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import { sounds } from '@/lib/sounds';
import { X, Check, ChevronRight, Sparkles, RotateCcw } from 'lucide-react';

export function RoutineRunnerModal() {
  const { activeRoutineId, routines, closeModal, toggleRoutineStep } = useApp();
  const routine = routines.find(r => r.id === activeRoutineId) || null;

  const [stepIndex, setStepIndex] = useState(0);

  if (!routine) return null;

  const currentStep = routine.steps[stepIndex];
  const isFinished = stepIndex >= routine.steps.length;

  const handleCompleteStep = () => {
    sounds.playMinimumComplete();
    if (currentStep) {
      toggleRoutineStep(routine.id, currentStep.id);
    }
    setStepIndex(prev => prev + 1);
  };

  const handleSkipStep = () => {
    setStepIndex(prev => prev + 1);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-end justify-center pb-[env(safe-area-inset-bottom,0px)] sm:items-center sm:p-4 bg-slate-900/40 dark:bg-slate-950/70"
      role="dialog"
      aria-modal="true"
      aria-labelledby="routine-runner-title"
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
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <span className="text-xl select-none">{routine.icon}</span>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-ink-primary dark:text-slate-200">
                {routine.title}
              </h4>
              <p className="text-[10px] text-ink-muted">
                Step {!isFinished ? stepIndex + 1 : routine.steps.length} of {routine.steps.length}
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
        <div className="p-6 sm:p-8">
          {isFinished ? (
            <div className="text-center py-6 space-y-4 animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-gentle-greenBg text-gentle-green mx-auto flex items-center justify-center">
                <Check className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-ink-primary dark:text-slate-100">
                Routine Complete
              </h3>
              <p className="text-sm text-ink-muted dark:text-slate-400 max-w-xs mx-auto">
                You completed this flow with zero rush. Return to your day whenever you are ready.
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="w-full py-3.5 px-4 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-medium text-sm transition-all"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 p-6 text-center space-y-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-400">
                  Focus on just this step:
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-ink-primary dark:text-slate-100 leading-snug">
                  {currentStep.title}
                </h3>
                <p className="text-xs text-ink-muted dark:text-slate-400">
                  Approx. {currentStep.durationMinutes} min • Take whatever time you need
                </p>
              </div>

              {/* Step Action Buttons */}
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={handleCompleteStep}
                  className="w-full flex items-center justify-center gap-2 py-4 px-5 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-base shadow-sm transition-all active:scale-[0.99]"
                >
                  <Check className="w-5 h-5" />
                  <span>Done with this step</span>
                </button>

                <button
                  type="button"
                  onClick={handleSkipStep}
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-medium text-ink-muted hover:text-ink-primary dark:hover:text-slate-200 transition-colors"
                >
                  Skip this step for today
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
