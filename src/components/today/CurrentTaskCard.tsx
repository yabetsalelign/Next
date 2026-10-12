'use client';

import React, { useState } from 'react';
import { Task } from '@/types';
import { useApp } from '@/lib/store';
import { 
  Check, 
  ChevronDown, 
  ChevronUp, 
  ListTree, 
  Coffee, 
  Users, 
  User, 
  Headphones 
} from 'lucide-react';
import { sounds } from '@/lib/sounds';

interface CurrentTaskCardProps {
  task: Task;
}

export function CurrentTaskCard({ task }: CurrentTaskCardProps) {
  const { openModal, completeTask, deferTask, toggleStep } = useApp();
  const [showDetails, setShowDetails] = useState(false);
  const [justCompletedMinimum, setJustCompletedMinimum] = useState(false);

  const isRest = task.category === 'rest';

  const handleDone = () => {
    sounds.playMinimumComplete();
    setJustCompletedMinimum(true);
    setTimeout(() => {
      completeTask(task.id, 'minimum');
      setJustCompletedMinimum(false);
    }, 1200);
  };

  const handleLater = () => {
    deferTask(task.id);
  };

  const handleStuck = () => {
    openModal('stuck', task.id);
  };

  const getCompanyLabel = () => {
    switch (task.companyPreference) {
      case 'someone_nearby':
        return { label: 'Someone nearby', icon: Users };
      case 'body_double':
        return { label: 'Body double', icon: Users };
      case 'background_company':
        return { label: 'Background noise / cafe', icon: Headphones };
      case 'alone':
        return { label: 'Quiet & alone', icon: User };
      default:
        return null;
    }
  };

  const company = getCompanyLabel();
  const minimumText = task.minimum || 'Start for 2 minutes and make one small step';

  return (
    <article 
      aria-label={`Current task: ${task.title}`}
      className="relative rounded-3xl border border-stone-200/90 bg-surface p-6 shadow-[0_4px_20px_rgba(0,0,0,0.05)] dark:border-white/[0.08] dark:bg-surface-dark dark:shadow-[0_10px_36px_rgba(0,0,0,0.4)] transition-all duration-300"
    >
      {/* Subtle warm halo accent at top of card in dark mode */}
      <div className="absolute top-0 inset-x-8 h-px bg-gradient-to-r from-transparent via-amber-500/30 dark:via-amber-400/20 to-transparent pointer-events-none" />

      {/* Primary Task Information */}
      <div className="space-y-3">
        <div className="flex items-start gap-3">
          <span className="text-2xl sm:text-3xl select-none pt-0.5 shrink-0" role="img" aria-hidden="true">
            {task.icon || (isRest ? '☕' : task.category === 'wellness' ? '💧' : '📌')}
          </span>
          <h2 className="text-xl sm:text-2xl font-semibold leading-snug tracking-tight text-ink-primary dark:text-linen">
            {task.title}
          </h2>
        </div>

        {/* Integrated Minimum — NOT a separate card */}
        <p className="text-base leading-relaxed text-ink-secondary dark:text-linen-muted">
          {minimumText}
        </p>

        {/* Time and category metadata */}
        {(Boolean(task.durationMinutes && task.durationMinutes > 0) || isRest) && (
          <div className="flex items-center gap-2 pt-1 text-xs text-ink-muted dark:text-linen-subtle">
            {task.durationMinutes && task.durationMinutes > 0 ? (
              <span>About {task.durationMinutes} min</span>
            ) : null}
            {task.durationMinutes && task.durationMinutes > 0 && isRest ? (
              <span>•</span>
            ) : null}
            {isRest && (
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-amber-500/15 border border-amber-500/20 text-amber-700 dark:text-amber-400 font-medium">
                <Coffee className="w-3 h-3" />
                Rest
              </span>
            )}
          </div>
        )}
      </div>

      {/* Main Action: Help me start */}
      <div className="mt-6 space-y-4">
        <button
          type="button"
          onClick={() => openModal('help_start', task.id)}
          className="flex w-full items-center justify-center rounded-2xl bg-amber-500 hover:bg-amber-400 active:bg-amber-600 py-3.5 px-5 text-base font-bold text-stone-950 shadow-[0_4px_20px_rgba(229,149,63,0.28)] transition-all active:scale-[0.99]"
        >
          Help me start
        </button>

        {/* Action Row: Done · Later · Stuck */}
        <div className="flex items-center justify-center gap-2 text-sm font-medium text-ink-secondary dark:text-linen-muted">
          <button
            type="button"
            onClick={handleDone}
            disabled={justCompletedMinimum}
            className="py-2.5 px-4 rounded-xl border border-sage-500/30 dark:border-sage-500/40 bg-sage-500/10 dark:bg-sage-500/15 hover:bg-sage-500/20 text-sage-800 dark:text-sage-300 font-semibold transition-colors min-h-[44px]"
          >
            Done
          </button>
          <span className="text-stone-300 dark:text-white/20 select-none">·</span>
          <button
            type="button"
            onClick={handleLater}
            className="py-2.5 px-4 rounded-xl hover:bg-stone-100 dark:hover:bg-white/[0.04] text-ink-muted hover:text-ink-primary dark:text-linen-subtle dark:hover:text-linen transition-colors min-h-[44px]"
          >
            Later
          </button>
          <span className="text-stone-300 dark:text-white/20 select-none">·</span>
          <button
            type="button"
            onClick={handleStuck}
            className="py-2.5 px-4 rounded-xl hover:bg-stone-100 dark:hover:bg-terracotta/10 text-ink-muted hover:text-terracotta dark:text-linen-subtle dark:hover:text-terracotta transition-colors min-h-[44px]"
          >
            Stuck
          </button>
        </div>

        {/* Progressive Disclosure: See more (Flat layout, eliminating box-in-a-box) */}
        <div className="pt-1 text-center">
          <button
            type="button"
            onClick={() => setShowDetails(!showDetails)}
            className="inline-flex items-center gap-1 text-xs font-medium text-ink-muted hover:text-ink-primary dark:text-linen-subtle dark:hover:text-linen transition-colors"
          >
            <span>{showDetails ? 'Hide details' : 'See more'}</span>
            {showDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {showDetails && (
            <div className="mt-4 space-y-3.5 border-t border-stone-200/60 dark:border-white/[0.06] pt-4 text-left text-xs text-ink-muted dark:text-linen-subtle sm:text-sm animate-fade-in">
              <div className="space-y-1">
                <span className="font-semibold text-ink-secondary dark:text-linen-muted">Intended:</span>
                <p className="text-ink-primary dark:text-linen">{task.normal || `${task.durationMinutes} minutes`}</p>
              </div>

              {task.extra && (
                <div className="space-y-1">
                  <span className="font-semibold text-ink-secondary dark:text-linen-muted">Extra:</span>
                  <p className="text-ink-primary dark:text-linen">{task.extra}</p>
                </div>
              )}

              {/* Steps breakdown checklist if present */}
              {task.steps && task.steps.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-stone-200/60 dark:border-white/[0.06]">
                  <span className="font-semibold text-ink-secondary dark:text-linen-muted">Steps:</span>
                  <div className="space-y-1.5">
                    {task.steps.map((step) => (
                      <button
                        key={step.id}
                        type="button"
                        onClick={() => toggleStep(task.id, step.id)}
                        className="flex items-center gap-2.5 w-full text-left py-1 text-xs hover:text-ink-primary dark:hover:text-linen transition-colors"
                      >
                        <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${
                          step.completed
                            ? 'bg-sage-500 border-sage-500 text-stone-950 font-bold'
                            : 'border-stone-300 dark:border-white/25 hover:border-amber-400'
                        }`}>
                          {step.completed && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <span className={step.completed ? 'line-through text-ink-muted dark:text-linen-faint' : 'text-ink-primary dark:text-linen'}>
                          {step.title}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {company && (
                <div className="flex items-center gap-2 pt-2 text-xs text-ink-muted dark:text-linen-subtle">
                  <company.icon className="w-3.5 h-3.5 text-amber-500/80" />
                  <span>{company.label}</span>
                </div>
              )}

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => openModal('breakdown', task.id)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-300"
                >
                  <ListTree className="w-3.5 h-3.5" />
                  <span>Break into smaller steps</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quiet completion overlay */}
      {justCompletedMinimum && (
        <div className="absolute inset-0 z-20 rounded-3xl bg-surface/95 dark:bg-surface-dark/95 flex flex-col items-center justify-center p-6 text-center animate-fade-in backdrop-blur-sm">
          <div className="w-12 h-12 rounded-full bg-sage-500/20 border border-sage-500/30 text-sage-600 dark:text-sage-300 flex items-center justify-center mb-3 shadow-[0_2px_12px_rgba(78,155,120,0.2)]">
            <Check className="w-6 h-6 stroke-[2.5]" />
          </div>
          <h3 className="text-lg font-bold text-ink-primary dark:text-linen">
            You did the minimum.
          </h3>
          <p className="text-sm text-ink-muted dark:text-linen-subtle mt-1">
            That counts. Every bit of progress matters.
          </p>
        </div>
      )}
    </article>
  );
}
