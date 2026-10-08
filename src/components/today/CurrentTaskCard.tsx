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
      className="relative rounded-3xl border border-slate-200/90 bg-surface p-6 shadow-card transition-all duration-300 dark:border-slate-800 dark:bg-surface-dark"
    >
      {/* Primary Task Information */}
      <div className="space-y-3">
        <h2 className="text-xl sm:text-2xl font-semibold leading-snug tracking-tight text-ink-primary dark:text-slate-100">
          {task.title}
        </h2>

        {/* Integrated Minimum — NOT a separate card */}
        <p className="text-base leading-relaxed text-ink-secondary dark:text-slate-300">
          {minimumText}
        </p>

        {/* Time and category metadata */}
        {(Boolean(task.durationMinutes && task.durationMinutes > 0) || isRest) && (
          <div className="flex items-center gap-2 pt-1 text-xs text-ink-muted dark:text-slate-400">
            {task.durationMinutes && task.durationMinutes > 0 ? (
              <span>About {task.durationMinutes} min</span>
            ) : null}
            {task.durationMinutes && task.durationMinutes > 0 && isRest ? (
              <span>•</span>
            ) : null}
            {isRest && (
              <span className="inline-flex items-center gap-1 text-amber-700 dark:text-amber-400">
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
          className="flex w-full items-center justify-center rounded-2xl bg-brand-600 py-3.5 px-5 text-base font-semibold text-white shadow-sm transition-all hover:bg-brand-700 active:scale-[0.99]"
        >
          Help me start
        </button>

        {/* Action Row: Done · Later · Stuck */}
        <div className="flex items-center justify-center gap-2 text-sm font-medium text-ink-secondary dark:text-slate-300">
          <button
            type="button"
            onClick={handleDone}
            disabled={justCompletedMinimum}
            className="py-2.5 px-4 rounded-xl border border-slate-200/90 dark:border-slate-700/80 bg-white/80 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-ink-primary dark:text-slate-100 font-medium transition-colors min-h-[44px]"
          >
            Done
          </button>
          <span className="text-slate-300 dark:text-slate-700 select-none">·</span>
          <button
            type="button"
            onClick={handleLater}
            className="py-2.5 px-4 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-ink-muted hover:text-ink-primary dark:text-slate-400 dark:hover:text-slate-200 transition-colors min-h-[44px]"
          >
            Later
          </button>
          <span className="text-slate-300 dark:text-slate-700 select-none">·</span>
          <button
            type="button"
            onClick={handleStuck}
            className="py-2.5 px-4 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-ink-muted hover:text-gentle-coral dark:text-slate-400 dark:hover:text-gentle-coral transition-colors min-h-[44px]"
          >
            Stuck
          </button>
        </div>

        {/* Progressive Disclosure: See more */}
        <div className="pt-1 text-center">
          <button
            type="button"
            onClick={() => setShowDetails(!showDetails)}
            className="inline-flex items-center gap-1 text-xs font-medium text-ink-muted hover:text-ink-primary dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
          >
            <span>{showDetails ? 'Hide details' : 'See more'}</span>
            {showDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {showDetails && (
            <div className="mt-4 space-y-3.5 border-t border-slate-100 pt-4 text-left text-xs text-ink-muted dark:border-slate-800 dark:text-slate-400 sm:text-sm animate-fade-in">
              <div className="space-y-1">
                <span className="font-semibold text-ink-secondary dark:text-slate-300">Intended:</span>
                <p className="text-ink-primary dark:text-slate-200">{task.normal || `${task.durationMinutes} minutes`}</p>
              </div>

              {task.extra && (
                <div className="space-y-1">
                  <span className="font-semibold text-ink-secondary dark:text-slate-300">Extra:</span>
                  <p className="text-ink-primary dark:text-slate-200">{task.extra}</p>
                </div>
              )}

              {/* Steps breakdown checklist if present */}
              {task.steps && task.steps.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                  <span className="font-semibold text-ink-secondary dark:text-slate-300">Steps:</span>
                  <div className="space-y-1.5">
                    {task.steps.map((step) => (
                      <button
                        key={step.id}
                        type="button"
                        onClick={() => toggleStep(task.id, step.id)}
                        className="flex items-center gap-2.5 w-full text-left py-1 text-xs hover:text-ink-primary"
                      >
                        <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                          step.completed
                            ? 'bg-gentle-green border-gentle-green text-white'
                            : 'border-slate-300 dark:border-slate-600'
                        }`}>
                          {step.completed && <Check className="w-3 h-3" />}
                        </div>
                        <span className={step.completed ? 'line-through text-ink-muted' : 'text-ink-primary dark:text-slate-200'}>
                          {step.title}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {company && (
                <div className="flex items-center gap-2 pt-2 text-xs text-ink-muted dark:text-slate-400">
                  <company.icon className="w-3.5 h-3.5" />
                  <span>{company.label}</span>
                </div>
              )}

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => openModal('breakdown', task.id)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400"
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
        <div className="absolute inset-0 z-20 rounded-3xl bg-surface/95 dark:bg-surface-dark/95 flex flex-col items-center justify-center p-6 text-center animate-fade-in">
          <div className="w-12 h-12 rounded-full bg-gentle-greenBg text-gentle-green flex items-center justify-center mb-3">
            <Check className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-ink-primary dark:text-slate-100">
            You did the minimum.
          </h3>
          <p className="text-sm text-ink-muted dark:text-slate-400 mt-1">
            That counts. Every bit of progress matters.
          </p>
        </div>
      )}
    </article>
  );
}
