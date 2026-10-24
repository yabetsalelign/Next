'use client';

import React, { useRef, useState } from 'react';
import { useApp } from '@/lib/store';
import { SymbolIcon } from '@/components/ui/SymbolIcon';
import { ChevronUp, ChevronDown, Trash2, Plus, AlertCircle } from 'lucide-react';
import { RoutineStep } from '@/types';

const ROUTINE_ICONS = ['✨', '🌅', '🌙', '☕', '💧', '🧘', '🚶', '📚'];

export function AddRoutineModal() {
  const { addRoutine, updateRoutine, closeModal, activeRoutineId, routines } = useApp();

  const existingRoutine = activeRoutineId ? routines.find((r) => r.id === activeRoutineId) : null;
  const isEditing = !!existingRoutine;

  const [title, setTitle] = useState(existingRoutine?.title ?? '');
  const [description, setDescription] = useState(existingRoutine?.description ?? '');
  const [icon, setIcon] = useState(existingRoutine?.icon ?? '✨');
  const [timeOfDay, setTimeOfDay] = useState<'morning' | 'afternoon' | 'evening' | 'anytime'>(
    existingRoutine?.timeOfDay ?? 'anytime'
  );

  const [steps, setSteps] = useState<RoutineStep[]>(
    existingRoutine?.steps ? existingRoutine.steps.map((s) => ({ ...s })) : []
  );
  const [newStepTitle, setNewStepTitle] = useState('');
  const [newStepDuration, setNewStepDuration] = useState(5);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const submittingRef = useRef(false);
  const stepInputRef = useRef<HTMLInputElement>(null);

  const handleAddStep = () => {
    const trimmed = newStepTitle.trim();
    if (!trimmed) {
      setErrorMessage('Please enter a step name before adding.');
      stepInputRef.current?.focus();
      return;
    }

    setSteps((prev) => [
      ...prev,
      {
        id: `step-${Date.now()}-${prev.length + 1}`,
        title: trimmed,
        durationMinutes: Number(newStepDuration) || 5,
        completed: false,
      },
    ]);
    setNewStepTitle('');
    setNewStepDuration(5);
    setErrorMessage(null);
    stepInputRef.current?.focus();
  };

  const handleUpdateStepTitle = (index: number, val: string) => {
    setSteps((prev) =>
      prev.map((s, i) => (i === index ? { ...s, title: val } : s))
    );
  };

  const handleMoveStep = (index: number, direction: 'up' | 'down') => {
    setSteps((prev) => {
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= prev.length) return prev;
      const next = [...prev];
      const temp = next[index];
      next[index] = next[targetIndex];
      next[targetIndex] = temp;
      return next;
    });
  };

  const handleRemoveStep = (index: number) => {
    setSteps((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSaveRoutine = (e: React.FormEvent) => {
    e.preventDefault();
    if (submittingRef.current) return;

    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setErrorMessage('Please enter a routine title.');
      return;
    }

    // Include any typed step title if user didn't hit "+ Add"
    let candidateSteps = [...steps];
    if (newStepTitle.trim()) {
      candidateSteps.push({
        id: `step-${Date.now()}-${candidateSteps.length + 1}`,
        title: newStepTitle.trim(),
        durationMinutes: Number(newStepDuration) || 5,
        completed: false,
      });
      setNewStepTitle('');
    }

    // Filter out blank or whitespace-only step names
    const validSteps = candidateSteps
      .map((s) => ({ ...s, title: s.title.trim() }))
      .filter((s) => s.title.length > 0);

    if (validSteps.length === 0) {
      setErrorMessage('Please add at least one step for this routine.');
      stepInputRef.current?.focus();
      return;
    }

    submittingRef.current = true;

    if (isEditing && existingRoutine) {
      updateRoutine(existingRoutine.id, {
        title: trimmedTitle,
        description: description.trim() || 'Custom routine',
        icon,
        timeOfDay,
        steps: validSteps.map((s) => {
          const prev = existingRoutine.steps?.find((ps) => ps.id === s.id);
          return {
            ...s,
            completed: prev ? prev.completed : false,
          };
        }),
      });
    } else {
      addRoutine({
        title: trimmedTitle,
        description: description.trim() || 'Custom routine',
        icon,
        enabled: true,
        timeOfDay,
        steps: validSteps,
      });
    }

    closeModal();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center pb-[env(safe-area-inset-bottom,0px)] sm:items-center sm:p-4 bg-black/60 backdrop-blur-[2px] animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="routine-modal-title"
      onClick={closeModal}
    >
      <section
        className="relative z-20 w-full max-w-lg max-h-[calc(100dvh-1rem)] overflow-y-auto overscroll-contain bg-surface-container-low border-t sm:border border-outline-variant rounded-t-[28px] sm:rounded-[28px] shadow-2xl px-5 pt-3 pb-8 flex flex-col animate-slide-up"
        onClick={(e) => e.stopPropagation()}
        data-purpose="routine-form-modal"
      >
        {/* Drawer Grab Handle */}
        <div className="w-full flex justify-center py-1">
          <div aria-hidden="true" className="w-10 h-1 rounded-full bg-surface-container-highest"></div>
        </div>

        {/* Modal Header */}
        <header className="flex justify-between items-center mt-2 mb-4">
          <div className="flex items-center space-x-2">
            <span className="text-xl select-none" role="img" aria-hidden="true">{icon}</span>
            <h2 id="routine-modal-title" className="text-lg font-bold text-on-surface tracking-tight font-headline-sm">
              {isEditing ? 'Edit Routine' : 'New Routine'}
            </h2>
          </div>
          <button
            type="button"
            aria-label="Close dialog"
            onClick={closeModal}
            className="w-8 h-8 flex items-center justify-center rounded-full text-on-surface-variant hover:text-on-surface transition-colors"
          >
            <SymbolIcon name="close" className="text-[20px]" />
          </button>
        </header>

        {/* Error / Validation Alert */}
        {errorMessage && (
          <div
            role="alert"
            className="mb-4 flex items-center gap-2 p-3 text-xs font-medium text-amber-900 bg-amber-500/15 border border-amber-500/30 dark:text-amber-200 rounded-xl"
          >
            <AlertCircle size={16} className="shrink-0 text-amber-600 dark:text-amber-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Routine Form Elements */}
        <form onSubmit={handleSaveRoutine} className="space-y-4">
          {/* SECTION 1: Routine Title */}
          <div className="space-y-1.5" data-purpose="routine-title-input">
            <label className="block text-xs font-semibold text-on-surface-variant font-label-md" htmlFor="routine-title">
              Routine Title
            </label>
            <input
              id="routine-title"
              type="text"
              required
              autoFocus={!isEditing}
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errorMessage) setErrorMessage(null);
              }}
              placeholder="e.g. Morning Awakening, Evening wind-down..."
              className="w-full h-12 px-4 py-3 bg-surface-container-lowest text-sm text-on-surface placeholder:text-on-surface-variant rounded-xl border border-outline-variant focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition duration-150 font-body-md"
            />
          </div>

          {/* SECTION 2: Description */}
          <div className="space-y-1.5" data-purpose="routine-description-input">
            <label className="block text-xs font-semibold text-on-surface-variant font-label-md" htmlFor="routine-description">
              Description
            </label>
            <textarea
              id="routine-description"
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Short note on what this routine is for"
              className="w-full px-4 py-2.5 bg-surface-container-lowest text-sm text-on-surface placeholder:text-on-surface-variant rounded-xl border border-outline-variant resize-none focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition duration-150 font-body-md"
            />
          </div>

          {/* SECTION 3: Icon Picker */}
          <div className="space-y-1.5" data-purpose="routine-icon-selector">
            <label className="block text-xs font-semibold text-on-surface-variant font-label-md">
              Icon
            </label>
            <div className="flex items-center space-x-2.5 overflow-x-auto no-scrollbar py-1">
              {ROUTINE_ICONS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setIcon(emoji)}
                  className={`flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center text-lg transition-all ${
                    icon === emoji
                      ? 'bg-surface-container-high border-2 border-primary-container text-primary-container shadow-sm scale-105'
                      : 'bg-surface-container-lowest border border-outline-variant hover:border-outline'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* SECTION 4: Time of Day Selector */}
          <div className="space-y-1.5" data-purpose="time-of-day-selector">
            <label className="block text-xs font-semibold text-on-surface-variant font-label-md">
              Time of Day
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { id: 'morning', label: 'Morning' },
                { id: 'afternoon', label: 'Midday' },
                { id: 'evening', label: 'Evening' },
                { id: 'anytime', label: 'Anytime' },
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTimeOfDay(t.id as any)}
                  className={`py-2 rounded-xl text-xs font-medium transition-all text-center ${
                    timeOfDay === t.id
                      ? 'bg-primary/10 border border-primary-container text-primary-container shadow-inner font-semibold'
                      : 'bg-surface-container-lowest border border-outline-variant text-on-surface hover:border-outline'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* SECTION 5: Ordered Routine Steps */}
          <div className="space-y-2 pt-2 border-t border-outline-variant/60" data-purpose="routine-steps-section">
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-xs font-semibold text-on-surface-variant font-label-md">
                  Steps {steps.length > 0 && <span className="text-primary font-bold">({steps.length})</span>}
                </label>
                <p className="text-[11px] text-on-surface-variant leading-tight">
                  Ordered actions in this flow. Run through them one step at a time.
                </p>
              </div>
            </div>

            {/* Steps List */}
            {steps.length === 0 ? (
              <div
                className="p-4 rounded-xl border border-dashed border-outline-variant bg-surface-container-lowest text-center space-y-1 my-1"
                data-purpose="steps-empty-state"
              >
                <p className="text-xs font-medium text-on-surface">No steps added yet.</p>
                <p className="text-[11px] text-on-surface-variant">
                  Add the first action below to build your routine sequence.
                </p>
              </div>
            ) : (
              <div className="space-y-2 max-h-56 overflow-y-auto pr-0.5" data-purpose="steps-list">
                {steps.map((step, index) => (
                  <div
                    key={step.id}
                    className="flex items-center gap-2 p-2 bg-surface-container-lowest rounded-xl border border-outline-variant hover:border-outline transition-colors"
                  >
                    {/* Step Number Order Badge */}
                    <span className="w-6 h-6 rounded-lg bg-surface-container-high text-on-surface-variant flex items-center justify-center text-[11px] font-semibold shrink-0">
                      {index + 1}
                    </span>

                    {/* Step Title Input */}
                    <input
                      type="text"
                      aria-label={`Step ${index + 1} title`}
                      value={step.title}
                      onChange={(e) => handleUpdateStepTitle(index, e.target.value)}
                      placeholder="Step action name..."
                      className="flex-1 min-w-0 px-2 py-1 bg-transparent text-xs text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:ring-1 focus:ring-primary-container rounded"
                    />

                    {/* Minutes Pill */}
                    <span className="text-[11px] text-on-surface-variant shrink-0 px-1.5 py-0.5 rounded bg-surface-container/60">
                      ~{step.durationMinutes || 5}m
                    </span>

                    {/* Reorder & Delete Controls */}
                    <div className="flex items-center gap-0.5 shrink-0">
                      <button
                        type="button"
                        aria-label={`Move step ${index + 1} up`}
                        disabled={index === 0}
                        onClick={() => handleMoveStep(index, 'up')}
                        className="w-7 h-7 flex items-center justify-center rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors disabled:opacity-20"
                      >
                        <ChevronUp size={15} />
                      </button>

                      <button
                        type="button"
                        aria-label={`Move step ${index + 1} down`}
                        disabled={index === steps.length - 1}
                        onClick={() => handleMoveStep(index, 'down')}
                        className="w-7 h-7 flex items-center justify-center rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors disabled:opacity-20"
                      >
                        <ChevronDown size={15} />
                      </button>

                      <button
                        type="button"
                        aria-label={`Remove step ${index + 1}`}
                        onClick={() => handleRemoveStep(index)}
                        className="w-7 h-7 flex items-center justify-center rounded-lg text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 transition-colors"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Add Step Input Field */}
            <div className="flex items-center gap-2 pt-1" data-purpose="add-step-input-row">
              <input
                ref={stepInputRef}
                type="text"
                placeholder="Add step name (e.g. Drink water)..."
                value={newStepTitle}
                onChange={(e) => {
                  setNewStepTitle(e.target.value);
                  if (errorMessage) setErrorMessage(null);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddStep();
                  }
                }}
                className="flex-1 h-10 px-3 bg-surface-container-lowest text-xs text-on-surface placeholder:text-on-surface-variant rounded-xl border border-outline-variant focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition font-body-md"
              />

              <button
                type="button"
                onClick={handleAddStep}
                disabled={!newStepTitle.trim()}
                className="h-10 px-3.5 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary font-semibold text-xs transition duration-150 flex items-center justify-center gap-1 shrink-0 disabled:opacity-40"
              >
                <Plus size={15} />
                <span>Add step</span>
              </button>
            </div>
          </div>

          {/* Primary Action CTA */}
          <div className="pt-2" data-purpose="create-routine-action">
            <button
              type="submit"
              disabled={!title.trim() || (steps.length === 0 && !newStepTitle.trim())}
              className="w-full py-3.5 px-4 bg-primary-container hover:bg-primary-fixed text-on-primary-fixed font-semibold text-sm rounded-xl transition duration-150 flex items-center justify-center shadow-md active:scale-[0.98] disabled:opacity-40"
            >
              {isEditing ? 'Save changes' : 'Create routine'}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
