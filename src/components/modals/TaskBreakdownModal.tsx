'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/lib/store';
import { generateBreakdown, BreakdownDetail } from '@/lib/breakdownEngine';
import { X, Plus, Check, Trash2, Play, Sparkles } from 'lucide-react';
import { TaskStep } from '@/types';

export function TaskBreakdownModal() {
  const { activeTaskId, tasks, closeModal, setTaskSteps, openModal } = useApp();
  const task = tasks.find(t => t.id === activeTaskId) || null;

  const [detail, setDetail] = useState<BreakdownDetail>('normal');
  const [steps, setSteps] = useState<TaskStep[]>([]);
  const [newStepText, setNewStepText] = useState('');

  useEffect(() => {
    if (task) {
      if (task.steps && task.steps.length > 0) {
        setSteps(task.steps);
      } else {
        const generated = generateBreakdown(task.title, detail);
        setSteps(
          generated.map((title, idx) => ({
            id: `gen-${Date.now()}-${idx}`,
            title,
            completed: false,
            isMinimum: idx === 0,
          }))
        );
      }
    }
  }, [task, detail]);

  if (!task) return null;

  const handleRegenerate = (newDetail: BreakdownDetail) => {
    setDetail(newDetail);
    const generated = generateBreakdown(task.title, newDetail);
    setSteps(
      generated.map((title, idx) => ({
        id: `gen-${Date.now()}-${idx}`,
        title,
        completed: false,
        isMinimum: idx === 0,
      }))
    );
  };

  const handleToggleStep = (stepId: string) => {
    setSteps(prev =>
      prev.map(s => (s.id === stepId ? { ...s, completed: !s.completed } : s))
    );
  };

  const handleRemoveStep = (stepId: string) => {
    setSteps(prev => prev.filter(s => s.id !== stepId));
  };

  const handleAddStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStepText.trim()) return;
    setSteps(prev => [
      ...prev,
      {
        id: `step-${Date.now()}`,
        title: newStepText.trim(),
        completed: false,
      },
    ]);
    setNewStepText('');
  };

  const handleSaveAndClose = () => {
    setTaskSteps(task.id, steps);
    closeModal();
  };

  const handleSaveAndStart = () => {
    setTaskSteps(task.id, steps);
    openModal('help_start', task.id);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-end justify-center pb-[env(safe-area-inset-bottom,0px)] sm:items-center sm:p-4 bg-slate-900/40 dark:bg-slate-950/70"
      role="dialog"
      aria-modal="true"
      aria-labelledby="breakdown-modal-title"
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
            <Sparkles className="w-4 h-4 text-brand-500" />
            <p className="text-xs font-bold uppercase tracking-wider text-ink-muted dark:text-slate-400">
              Task Breakdown • Micro-Steps
            </p>
          </div>
          <button
            onClick={closeModal}
            aria-label="Close"
            className="p-1.5 rounded-xl text-ink-muted hover:text-ink-primary dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 sm:p-7 overflow-y-auto space-y-5 flex-1">
          <div>
            <h3 id="breakdown-modal-title" className="text-xl sm:text-2xl font-bold tracking-tight text-ink-primary dark:text-slate-100">
              {task.title}
            </h3>
            <p className="text-xs sm:text-sm text-ink-muted dark:text-slate-400 mt-1">
              Reduce the weight of the task by converting it into atomic physical actions.
            </p>
          </div>

          {/* Level of detail selector */}
          <div className="flex items-center justify-between p-1 bg-slate-100 dark:bg-slate-800/80 rounded-2xl">
            {(['simpler', 'normal', 'detailed'] as BreakdownDetail[]).map((lvl) => (
              <button
                key={lvl}
                type="button"
                onClick={() => handleRegenerate(lvl)}
                className={`flex-1 py-2 px-3 text-xs font-semibold rounded-xl capitalize transition-all ${
                  detail === lvl
                    ? 'bg-surface dark:bg-surface-dark text-brand-700 dark:text-brand-300 shadow-sm'
                    : 'text-ink-muted hover:text-ink-primary'
                }`}
              >
                {lvl === 'simpler' ? 'Simpler (2-3)' : lvl === 'normal' ? 'Normal (4-5)' : 'Detailed (Micro)'}
              </button>
            ))}
          </div>

          {/* Steps List */}
          <div className="space-y-2">
            {steps.map((step, idx) => (
              <div
                key={step.id}
                className={`flex items-start gap-3 p-3 rounded-2xl border transition-all ${
                  step.completed 
                    ? 'bg-slate-50 dark:bg-slate-900/40 border-slate-200/50 dark:border-slate-800/50 opacity-60' 
                    : 'bg-surface dark:bg-surface-dark border-slate-200/80 dark:border-slate-800'
                }`}
              >
                <button
                  type="button"
                  onClick={() => handleToggleStep(step.id)}
                  className={`mt-0.5 w-5 h-5 rounded-lg border flex items-center justify-center transition-colors ${
                    step.completed
                      ? 'bg-gentle-green text-white border-gentle-green'
                      : 'border-slate-300 dark:border-slate-600 hover:border-brand-500'
                  }`}
                  aria-label={step.completed ? 'Mark step incomplete' : 'Mark step complete'}
                >
                  {step.completed && <Check className="w-3.5 h-3.5" />}
                </button>

                <div className="flex-1 min-w-0">
                  <p className={`text-sm text-ink-primary dark:text-slate-100 ${step.completed ? 'line-through text-ink-muted' : ''}`}>
                    {step.title}
                  </p>
                  {step.isMinimum && (
                    <span className="inline-block text-[10px] font-semibold text-brand-600 dark:text-brand-400 mt-0.5">
                      ★ Minimum start step
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => handleRemoveStep(step.id)}
                  aria-label="Remove step"
                  className="p-1 text-ink-subtle hover:text-gentle-coral transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          {/* Add custom step */}
          <form onSubmit={handleAddStep} className="flex gap-2">
            <input
              type="text"
              placeholder="Add another tiny step..."
              value={newStepText}
              onChange={(e) => setNewStepText(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-surface dark:bg-surface-dark text-sm text-ink-primary dark:text-slate-100 placeholder:text-ink-subtle focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
            <button
              type="submit"
              aria-label="Add step"
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-ink-primary dark:text-slate-200"
            >
              <Plus className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-900/30">
          <button
            type="button"
            onClick={handleSaveAndClose}
            className="flex-1 py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-700 text-ink-primary dark:text-slate-200 font-medium text-xs sm:text-sm hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Save Steps
          </button>
          <button
            type="button"
            onClick={handleSaveAndStart}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-medium text-xs sm:text-sm transition-all shadow-sm"
          >
            <Play className="w-4 h-4" />
            <span>Start Step 1</span>
          </button>
        </div>

      </div>
    </div>
  );
}
