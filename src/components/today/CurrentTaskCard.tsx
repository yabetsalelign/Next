'use client';

import React, { useState } from 'react';
import { Task } from '@/types';
import { useApp } from '@/lib/store';
import { 
  Sparkles, 
  HelpCircle, 
  Check, 
  ListTree, 
  Coffee, 
  Users, 
  User, 
  Headphones,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { sounds } from '@/lib/sounds';

interface CurrentTaskCardProps {
  task: Task;
}

export function CurrentTaskCard({ task }: CurrentTaskCardProps) {
  const { openModal, completeTask } = useApp();
  const [showDetails, setShowDetails] = useState(false);
  const [justCompletedMinimum, setJustCompletedMinimum] = useState(false);

  const isRest = task.category === 'rest';

  const handleCompleteMinimum = () => {
    sounds.playMinimumComplete();
    setJustCompletedMinimum(true);
    setTimeout(() => {
      completeTask(task.id, 'minimum');
      setJustCompletedMinimum(false);
    }, 1200);
  };

  const handleCompleteFull = () => {
    sounds.playMinimumComplete();
    completeTask(task.id, 'normal');
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

  return (
    <article 
      aria-label={`Current task: ${task.title}`}
      className="relative overflow-hidden rounded-[28px] border border-slate-200/80 bg-surface shadow-[0_10px_30px_-18px_rgba(15,23,42,0.28)] transition-all duration-300 dark:border-slate-800 dark:bg-surface-dark"
    >
      <div className={`flex items-center justify-between border-b px-4 pb-3 pt-4 ${
        isRest 
          ? 'border-amber-100 bg-amber-50/70 dark:border-amber-900/40 dark:bg-amber-950/20' 
          : 'border-slate-100 bg-slate-50/80 dark:border-slate-800/70 dark:bg-slate-800/40'
      }`}>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center rounded-full bg-brand-600 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-white dark:bg-brand-500">
            NOW
          </span>
          {isRest && (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-[10px] font-medium text-amber-900 dark:bg-amber-900/40 dark:text-amber-200">
              <Coffee className="w-3 h-3" />
              Rest
            </span>
          )}
        </div>

        {company && (
          <div className="flex items-center gap-1.5 text-[11px] text-ink-muted dark:text-slate-400">
            <company.icon className="w-3.5 h-3.5" />
            <span>{company.label}</span>
          </div>
        )}
      </div>

      <div className="p-4 sm:p-5">
        <div className="mb-4 flex items-start gap-3">
          <span className="select-none text-3xl sm:text-4xl" role="img" aria-label="Task icon">
            {task.icon || (isRest ? '☕' : '📋')}
          </span>
          <div className="min-w-0 flex-1">
            <h2 className="text-xl font-bold leading-snug tracking-tight text-ink-primary dark:text-slate-100 sm:text-[1.75rem]">
              {task.title}
            </h2>
            <p className="mt-1 text-xs text-ink-muted dark:text-slate-400 sm:text-sm">
              ~{task.durationMinutes} min • flexible
            </p>
          </div>
        </div>

        <div className="mb-4 rounded-2xl border border-brand-100 bg-brand-50/80 p-3.5 dark:border-brand-900/50 dark:bg-brand-950/35">
          <div className="mb-1.5 flex items-center justify-between gap-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-brand-700 dark:text-brand-300">
              Minimum
            </span>
            <span className="text-[10px] font-medium text-brand-600/80 dark:text-brand-400/80">
              Counts as done
            </span>
          </div>
          <p className="text-sm font-medium leading-relaxed text-ink-primary dark:text-slate-100 sm:text-base">
            {task.minimum || 'Start for 2 minutes and make one small step'}
          </p>
        </div>

        <div className="mb-4">
          <button
            type="button"
            onClick={() => setShowDetails(!showDetails)}
            className="flex items-center gap-1.5 text-[11px] font-medium text-ink-muted transition-colors hover:text-ink-primary dark:text-slate-400 dark:hover:text-slate-200"
          >
            <span>{showDetails ? 'Hide details' : 'See intended & extra'}</span>
            {showDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {showDetails && (
            <div className="mt-3 space-y-2 border-t border-slate-100 pt-3 text-xs text-ink-muted dark:border-slate-800 dark:text-slate-400 sm:text-sm">
              <div className="flex items-start gap-2">
                <span className="min-w-[54px] font-semibold text-ink-secondary dark:text-slate-300">Normal:</span>
                <span>{task.normal || `${task.durationMinutes} minutes`}</span>
              </div>
              {task.extra && (
                <div className="flex items-start gap-2">
                  <span className="min-w-[54px] font-semibold text-ink-secondary dark:text-slate-300">Extra:</span>
                  <span>{task.extra}</span>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="space-y-3">
          <button
            type="button"
            onClick={() => openModal('help_start', task.id)}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-brand-600 px-5 py-4 text-base font-semibold tracking-tight text-white shadow-[0_12px_20px_-10px_rgba(43,82,121,0.65)] transition-all hover:bg-brand-700 active:scale-[0.99]"
          >
            <Sparkles className="h-5 w-5 text-brand-200" />
            <span>Help me start</span>
          </button>

          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => openModal('stuck', task.id)}
              className="flex min-h-[52px] flex-col items-center justify-center gap-1 rounded-xl border border-slate-200 bg-surface px-2 py-2 text-[11px] font-medium text-ink-secondary transition-colors active:bg-slate-50 dark:border-slate-700 dark:bg-surface-dark dark:text-slate-300"
            >
              <HelpCircle className="h-[18px] w-[18px] text-gentle-coral" />
              <span>Stuck</span>
            </button>

            <button
              type="button"
              onClick={() => openModal('breakdown', task.id)}
              className="flex min-h-[52px] flex-col items-center justify-center gap-1 rounded-xl border border-slate-200 bg-surface px-2 py-2 text-[11px] font-medium text-ink-secondary transition-colors active:bg-slate-50 dark:border-slate-700 dark:bg-surface-dark dark:text-slate-300"
              aria-label="Break into smaller steps"
            >
              <ListTree className="h-[18px] w-[18px] text-brand-500" />
              <span>Break down</span>
            </button>

            <button
              type="button"
              onClick={handleCompleteMinimum}
              disabled={justCompletedMinimum}
              className="flex min-h-[52px] flex-col items-center justify-center gap-1 rounded-xl bg-gentle-greenBg px-2 py-2 text-[11px] font-medium text-gentle-green transition-colors active:bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-300"
              aria-label="Mark minimum completed"
            >
              <Check className="h-[18px] w-[18px]" />
              <span>Done</span>
            </button>
          </div>
        </div>

        {/* Quiet completion overlay */}
        {justCompletedMinimum && (
          <div className="absolute inset-0 z-20 bg-surface/95 dark:bg-surface-dark/95 flex flex-col items-center justify-center p-6 text-center animate-fade-in">
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
      </div>
    </article>
  );
}
