'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import { Routine } from '@/types';
import { 
  Plus, 
  Play, 
  Check, 
  Clock, 
  RotateCcw,
  Leaf,
  Heart,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { sounds } from '@/lib/sounds';

function RoutineCard({ routine }: { routine: Routine }) {
  const { toggleRoutineStep, resetRoutineSteps, openModal, updateRoutine } = useApp();
  const [newStepText, setNewStepText] = useState('');
  const [showSteps, setShowSteps] = useState(false);

  const completedCount = routine.steps.filter(s => s.completed).length;
  const totalMinutes = routine.steps.reduce((acc, s) => acc + s.durationMinutes, 0);
  const isWellness = routine.category === 'wellness';

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
    <article
      className={`rounded-3xl bg-surface dark:bg-surface-dark border shadow-card overflow-hidden ${
        isWellness 
          ? 'border-brand-200/60 dark:border-brand-900/50' 
          : 'border-slate-200/90 dark:border-slate-800'
      }`}
    >
      {/* Routine Header */}
      <div className={`p-6 pb-4 flex items-start justify-between gap-4 ${
        isWellness
          ? 'border-b border-brand-100/60 dark:border-brand-900/30'
          : 'border-b border-slate-100 dark:border-slate-800'
      }`}>
        <div className="flex items-center gap-3.5">
          <span className="text-3xl select-none" role="img" aria-hidden="true">
            {routine.icon}
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-bold text-ink-primary dark:text-slate-100">
                {routine.title}
              </h2>
              {isWellness && (
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-brand-100 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300">
                  Care
                </span>
              )}
            </div>
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

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => openModal('routine_runner', undefined, routine.id)}
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

      {/* Steps — collapsible */}
      <div className="p-6 pt-4 space-y-2">
        <button
          type="button"
          onClick={() => setShowSteps(!showSteps)}
          className="flex items-center gap-1.5 text-xs font-medium text-ink-muted hover:text-ink-primary transition-colors mb-2"
        >
          {showSteps ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          {showSteps ? 'Hide steps' : `Show ${routine.steps.length} steps`}
        </button>

        {showSteps && (
          <div className="space-y-2 animate-fade-in">
            {routine.steps.map((step) => (
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

            {/* Inline Add Step */}
            <div className="pt-2 flex items-center gap-2">
              <input
                type="text"
                placeholder="Add step to routine..."
                value={newStepText}
                onChange={(e) => setNewStepText(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleAddStep(); }}
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
      </div>
    </article>
  );
}

export default function RoutinesPage() {
  const { routines } = useApp();
  const [showAll, setShowAll] = useState(false);

  const wellnessRoutines = routines.filter(r => r.category === 'wellness');
  const generalRoutines = routines.filter(r => r.category !== 'wellness');

  return (
    <div className="max-w-2xl mx-auto space-y-7 animate-fade-in">
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

      {/* Self-Care Routines */}
      {wellnessRoutines.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-brand-500 dark:text-brand-400" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-ink-muted dark:text-slate-400">
              Self-Care
            </h2>
          </div>

          <div className="p-4 rounded-2xl bg-brand-50/50 dark:bg-brand-950/20 border border-brand-200/50 dark:border-brand-900/30">
            <p className="text-xs text-brand-800/80 dark:text-brand-300/70 leading-relaxed">
              These routines support basic self-care. Steps are collapsed by default — tap to expand. The minimum always counts.
            </p>
          </div>

          <div className="space-y-5">
            {wellnessRoutines.map((routine) => (
              <RoutineCard key={routine.id} routine={routine} />
            ))}
          </div>
        </section>
      )}

      {/* General Routines */}
      {generalRoutines.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Leaf className="w-4 h-4 text-ink-muted dark:text-slate-400" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-ink-muted dark:text-slate-400">
              Daily Rhythms
            </h2>
          </div>

          <div className="space-y-5">
            {generalRoutines.map((routine) => (
              <RoutineCard key={routine.id} routine={routine} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
