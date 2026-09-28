'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import { Routine } from '@/types';
import { 
  Plus, 
  Play, 
  Check, 
  Sparkles, 
  Clock, 
  MoreVertical, 
  RotateCcw,
  ChevronRight,
  ListPlus
} from 'lucide-react';
import { sounds } from '@/lib/sounds';

export default function RoutinesPage() {
  const { routines, toggleRoutineStep, resetRoutineSteps, openModal, updateRoutine } = useApp();
  const [newStepText, setNewStepText] = useState<{ [routineId: string]: string }>({});

  const handleStartRoutine = (routineId: string) => {
    openModal('routine_runner', undefined, routineId);
  };

  const handleAddStepToRoutine = (routineId: string) => {
    const text = newStepText[routineId]?.trim();
    if (!text) return;

    const routine = routines.find(r => r.id === routineId);
    if (!routine) return;

    updateRoutine(routineId, {
      steps: [
        ...routine.steps,
        {
          id: `step-${Date.now()}`,
          title: text,
          durationMinutes: 5,
          completed: false,
        }
      ]
    });

    setNewStepText(prev => ({ ...prev, [routineId]: '' }));
  };

  return (
    <div className="max-w-2xl mx-auto pb-24 md:pb-12 space-y-7 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-ink-primary dark:text-slate-100">
            Routines
          </h1>
          <p className="text-xs sm:text-sm text-ink-muted dark:text-slate-400 mt-1">
            Flexible sequences to ease transitions. No strict clock times required.
          </p>
        </div>
      </div>

      {/* Routine Cards List */}
      <div className="space-y-6">
        {routines.map((routine) => {
          const completedCount = routine.steps.filter(s => s.completed).length;
          const totalMinutes = routine.steps.reduce((acc, s) => acc + s.durationMinutes, 0);

          return (
            <article
              key={routine.id}
              className="rounded-3xl bg-surface dark:bg-surface-dark border border-slate-200/90 dark:border-slate-800 shadow-card overflow-hidden"
            >
              {/* Routine Header */}
              <div className="p-6 pb-4 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <span className="text-3xl select-none" role="img" aria-hidden="true">
                    {routine.icon}
                  </span>
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold text-ink-primary dark:text-slate-100">
                      {routine.title}
                    </h2>
                    <p className="text-xs text-ink-muted dark:text-slate-400 mt-0.5">
                      {routine.description}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="inline-flex items-center gap-1 text-[11px] text-ink-secondary dark:text-slate-300 font-medium">
                        <Clock className="w-3 h-3 text-ink-subtle" />
                        ~{totalMinutes} min total
                      </span>
                      <span className="text-slate-300 text-xs">•</span>
                      <span className="text-[11px] text-brand-600 dark:text-brand-300 font-medium">
                        {completedCount} of {routine.steps.length} done
                      </span>
                    </div>
                  </div>
                </div>

                {/* Routine Runner CTA */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleStartRoutine(routine.id)}
                    className="flex items-center gap-1.5 py-2 px-3.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs shadow-sm transition-all active:scale-95"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>Step Through</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => resetRoutineSteps(routine.id)}
                    title="Reset completed checkmarks"
                    className="p-2 rounded-xl text-ink-muted hover:text-ink-primary hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Steps Sequence */}
              <div className="p-6 pt-4 space-y-2">
                <div className="space-y-2">
                  {routine.steps.map((step, idx) => (
                    <div
                      key={step.id}
                      className={`flex items-center gap-3 p-3 rounded-2xl border transition-all ${
                        step.completed
                          ? 'bg-slate-50/70 dark:bg-slate-900/40 border-slate-200/50 dark:border-slate-800/50 opacity-60'
                          : 'bg-surface dark:bg-surface-dark border-slate-200/80 dark:border-slate-800'
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => {
                          sounds.playMinimumComplete();
                          toggleRoutineStep(routine.id, step.id);
                        }}
                        className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-colors ${
                          step.completed
                            ? 'bg-gentle-green text-white border-gentle-green'
                            : 'border-slate-300 dark:border-slate-600 hover:border-brand-500'
                        }`}
                        aria-label={step.completed ? 'Mark incomplete' : 'Mark complete'}
                      >
                        {step.completed && <Check className="w-3.5 h-3.5" />}
                      </button>

                      <div className="flex-1 min-w-0 flex items-center justify-between">
                        <span className={`text-sm text-ink-primary dark:text-slate-100 ${
                          step.completed ? 'line-through text-ink-muted' : ''
                        }`}>
                          {step.title}
                        </span>
                        <span className="text-[11px] text-ink-subtle">
                          ~{step.durationMinutes}m
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Inline Add Step */}
                <div className="pt-2 flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Add step to routine..."
                    value={newStepText[routine.id] || ''}
                    onChange={(e) => setNewStepText(prev => ({ ...prev, [routine.id]: e.target.value }))}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleAddStepToRoutine(routine.id);
                    }}
                    className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-900/60 text-ink-primary dark:text-slate-100 placeholder:text-ink-subtle focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddStepToRoutine(routine.id)}
                    className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-ink-primary dark:text-slate-200 hover:bg-slate-200"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
