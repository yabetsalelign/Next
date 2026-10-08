'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import { Routine } from '@/types';
import { 
  Play, 
  Check, 
  RotateCcw,
  Plus,
  BookOpen,
  ChevronDown,
  ChevronUp,
  X
} from 'lucide-react';
import { sounds } from '@/lib/sounds';

// Default routine IDs considered "My routines" initially
const CORE_ROUTINE_IDS = ['routine-morning-care', 'routine-night-care', 'routine-five-min-reset'];

function RoutineCard({ routine }: { routine: Routine }) {
  const { toggleRoutineStep, resetRoutineSteps, openModal, updateRoutine } = useApp();
  const [showSteps, setShowSteps] = useState(false);
  const [newStepText, setNewStepText] = useState('');

  const completedCount = routine.steps.filter(s => s.completed).length;
  const isAllDone = routine.steps.length > 0 && completedCount === routine.steps.length;

  // Short preview text of first 3 steps: "Water · bathroom · wash face"
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

  return (
    <article className="rounded-3xl bg-surface dark:bg-surface-dark border border-slate-200/90 dark:border-slate-800 shadow-sm transition-all overflow-hidden">
      {/* Collapsed / Summary Row */}
      <div className="p-5 flex items-center justify-between gap-4">
        <div 
          className="flex-1 min-w-0 cursor-pointer select-none"
          onClick={() => setShowSteps(!showSteps)}
        >
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-semibold text-ink-primary dark:text-slate-100">
              {routine.title}
            </h2>
            {isAllDone && (
              <span className="text-[10px] font-bold text-gentle-green bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full">
                Done ✓
              </span>
            )}
          </div>
          <p className="text-xs text-ink-muted dark:text-slate-400 mt-1 truncate">
            {previewText || routine.description}
          </p>
        </div>

        {/* Quick Start button */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => openModal('routine_runner', undefined, routine.id)}
            className="flex items-center gap-1.5 py-2 px-3.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs shadow-sm transition-all active:scale-95"
          >
            <Play className="w-3.5 h-3.5" />
            <span>Start</span>
          </button>

          <button
            type="button"
            onClick={() => setShowSteps(!showSteps)}
            className="p-2 rounded-xl text-ink-muted hover:text-ink-primary hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label={showSteps ? 'Collapse routine' : 'Expand routine'}
          >
            {showSteps ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Expanded Content: Inside a routine */}
      {showSteps && (
        <div className="px-5 pb-5 pt-1 border-t border-slate-100 dark:border-slate-800 space-y-4 animate-fade-in">
          {/* Steps ordered list */}
          <div className="space-y-2 pt-2">
            {routine.steps.map((step, idx) => (
              <div
                key={step.id}
                className="flex items-center justify-between gap-3 py-1.5 text-sm"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <button
                    type="button"
                    onClick={() => {
                      sounds.playMinimumComplete();
                      toggleRoutineStep(routine.id, step.id);
                    }}
                    className={`w-5 h-5 rounded-lg border flex items-center justify-center shrink-0 transition-colors ${
                      step.completed
                        ? 'bg-gentle-green text-white border-gentle-green'
                        : 'border-slate-300 dark:border-slate-600 hover:border-brand-500'
                    }`}
                    aria-label={step.completed ? 'Mark incomplete' : 'Mark complete'}
                  >
                    {step.completed && <Check className="w-3.5 h-3.5" />}
                  </button>

                  <span className={`text-xs sm:text-sm ${
                    step.completed 
                      ? 'line-through text-ink-muted' 
                      : 'text-ink-primary dark:text-slate-200'
                  }`}>
                    <span className="font-medium text-ink-muted mr-1.5">{idx + 1}.</span>
                    {step.title}
                  </span>
                </div>

                <span className="text-[11px] text-ink-subtle shrink-0">
                  ~{step.durationMinutes}m
                </span>
              </div>
            ))}
          </div>

          {/* Minimum rule banner */}
          <div className="p-3.5 rounded-2xl bg-brand-50/60 dark:bg-brand-950/30 border border-brand-200/60 dark:border-brand-900/40 text-left">
            <span className="text-[10px] font-bold uppercase tracking-wider text-brand-700 dark:text-brand-300 block">
              Minimum
            </span>
            <p className="text-xs text-brand-900 dark:text-brand-200 font-medium mt-0.5">
              Complete any one step. That counts as running the routine.
            </p>
          </div>

          {/* Action Row */}
          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={() => openModal('routine_runner', undefined, routine.id)}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs shadow-sm transition-all active:scale-[0.99]"
            >
              <Play className="w-3.5 h-3.5" />
              <span>Start routine</span>
            </button>

            <button
              type="button"
              onClick={() => resetRoutineSteps(routine.id)}
              title="Reset checkmarks"
              className="p-3 rounded-2xl border border-slate-200 dark:border-slate-700 text-ink-muted hover:text-ink-primary hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
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
              className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-900/60 text-ink-primary dark:text-slate-100 placeholder:text-ink-subtle focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
            <button
              type="button"
              onClick={handleAddStep}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-ink-primary dark:text-slate-200 hover:bg-slate-200"
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
  const { routines } = useApp();
  const [showLibrary, setShowLibrary] = useState(false);
  const [showAddRoutineModal, setShowAddRoutineModal] = useState(false);
  const [newRoutineTitle, setNewRoutineTitle] = useState('');
  const [newRoutineDesc, setNewRoutineDesc] = useState('');

  // Primary "My routines"
  const myRoutines = routines.filter(r => CORE_ROUTINE_IDS.includes(r.id));
  // Additional library routines
  const libraryRoutines = routines.filter(r => !CORE_ROUTINE_IDS.includes(r.id));

  return (
    <div className="max-w-xl mx-auto space-y-6 animate-fade-in pb-10">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-[1.75rem] font-semibold tracking-tight text-ink-primary dark:text-slate-100">
          Routines
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-ink-muted dark:text-slate-400">
          Flexible sequences to ease transitions. Complete any one step.
        </p>
      </div>

      {/* MY ROUTINES */}
      <section className="space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-ink-muted dark:text-slate-400">
          My routines
        </h2>

        <div className="space-y-3">
          {myRoutines.map((routine) => (
            <RoutineCard key={routine.id} routine={routine} />
          ))}
        </div>
      </section>

      {/* Action Links: + Add routine & Routine library */}
      <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
        <button
          type="button"
          onClick={() => setShowAddRoutineModal(true)}
          className="w-full sm:flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-surface dark:bg-surface-dark border border-slate-200/90 dark:border-slate-800 hover:border-slate-300 text-xs font-semibold text-ink-primary dark:text-slate-100 shadow-sm transition-all"
        >
          <Plus className="w-4 h-4 text-brand-600 dark:text-brand-400" />
          <span>Add routine</span>
        </button>

        <button
          type="button"
          onClick={() => setShowLibrary(true)}
          className="w-full sm:flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 text-xs font-semibold text-ink-secondary dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
        >
          <BookOpen className="w-4 h-4 text-ink-muted" />
          <span>Routine library</span>
        </button>
      </div>

      {/* Routine Library Modal / Drawer */}
      {showLibrary && (
        <div 
          className="fixed inset-0 z-50 flex items-end justify-center pb-[env(safe-area-inset-bottom,0px)] sm:items-center sm:p-4 bg-slate-900/40 dark:bg-slate-950/70 animate-fade-in"
          role="dialog"
          aria-modal="true"
          onClick={() => setShowLibrary(false)}
        >
          <div
            className="modal-sheet relative w-full sm:max-w-md bg-surface dark:bg-surface-dark border-t sm:border border-slate-200/90 dark:border-slate-800 sm:rounded-3xl rounded-t-3xl shadow-2xl p-6 overflow-y-auto animate-slide-up space-y-4"
            style={{ maxHeight: 'calc(100dvh - env(safe-area-inset-top, 0px) - env(safe-area-inset-bottom, 0px) - 1rem)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sm:hidden flex justify-center -mt-2 pb-1">
              <div className="w-10 h-1 rounded-full bg-slate-300 dark:bg-slate-600" />
            </div>

            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-ink-primary dark:text-slate-100">
                  Routine Library
                </h3>
                <p className="text-xs text-ink-muted">
                  Explore other gentle sequences.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowLibrary(false)}
                className="p-1.5 rounded-xl text-ink-muted hover:text-ink-primary hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 pt-1">
              {libraryRoutines.map((routine) => (
                <RoutineCard key={routine.id} routine={routine} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Add Routine Modal */}
      {showAddRoutineModal && (
        <div 
          className="fixed inset-0 z-50 flex items-end justify-center pb-[env(safe-area-inset-bottom,0px)] sm:items-center sm:p-4 bg-slate-900/40 dark:bg-slate-950/70 animate-fade-in"
          role="dialog"
          aria-modal="true"
          onClick={() => setShowAddRoutineModal(false)}
        >
          <div
            className="modal-sheet relative w-full sm:max-w-md bg-surface dark:bg-surface-dark border-t sm:border border-slate-200/90 dark:border-slate-800 sm:rounded-3xl rounded-t-3xl shadow-2xl p-6 overflow-y-auto animate-slide-up space-y-4"
            style={{ maxHeight: 'calc(100dvh - env(safe-area-inset-top, 0px) - env(safe-area-inset-bottom, 0px) - 0.5rem)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-lg font-bold text-ink-primary dark:text-slate-100">
                New Routine
              </h3>
              <button
                type="button"
                onClick={() => setShowAddRoutineModal(false)}
                className="p-1.5 rounded-xl text-ink-muted hover:text-ink-primary hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-ink-secondary dark:text-slate-300 block mb-1">
                  Routine Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Afternoon reset, Reading wind-down..."
                  value={newRoutineTitle}
                  onChange={(e) => setNewRoutineTitle(e.target.value)}
                  className="w-full px-3.5 py-3 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 text-ink-primary dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-ink-secondary dark:text-slate-300 block mb-1">
                  Description
                </label>
                <input
                  type="text"
                  placeholder="Short note on what this routine is for"
                  value={newRoutineDesc}
                  onChange={(e) => setNewRoutineDesc(e.target.value)}
                  className="w-full px-3.5 py-3 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 text-ink-primary dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  disabled={!newRoutineTitle.trim()}
                  onClick={() => {
                    // We can add routine logic here if needed
                    setShowAddRoutineModal(false);
                    setNewRoutineTitle('');
                    setNewRoutineDesc('');
                  }}
                  className="w-full py-3.5 px-5 rounded-2xl bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-semibold text-sm shadow-sm transition-all"
                >
                  Create routine
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
