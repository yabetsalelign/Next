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
      className="relative overflow-hidden rounded-3xl bg-surface dark:bg-surface-dark border border-slate-200/90 dark:border-slate-800 shadow-focus transition-all duration-300"
    >
      {/* Top Banner with subtle color accent */}
      <div className={`px-6 pt-5 pb-3 flex items-center justify-between border-b ${
        isRest 
          ? 'bg-amber-50/60 dark:bg-amber-950/20 border-amber-100/80 dark:border-amber-900/30' 
          : 'bg-slate-50/80 dark:bg-slate-800/40 border-slate-100 dark:border-slate-800/60'
      }`}>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wider uppercase bg-brand-600 dark:bg-brand-500 text-white">
            NOW
          </span>
          {isRest && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-amber-100/80 dark:bg-amber-900/40 text-amber-900 dark:text-amber-200">
              <Coffee className="w-3 h-3" />
              Rest activity
            </span>
          )}
        </div>

        {company && (
          <div className="flex items-center gap-1.5 text-xs text-ink-muted dark:text-slate-400">
            <company.icon className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">{company.label}</span>
          </div>
        )}
      </div>

      {/* Main Task Body */}
      <div className="p-6 sm:p-7">
        {/* Title and Icon */}
        <div className="flex items-start gap-3.5 mb-5">
          <span className="text-3xl sm:text-4xl select-none" role="img" aria-label="Task icon">
            {task.icon || (isRest ? '☕' : '📋')}
          </span>
          <div className="flex-1 min-w-0">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-ink-primary dark:text-slate-100 leading-snug break-words">
              {task.title}
            </h2>
            <p className="text-xs sm:text-sm text-ink-muted dark:text-slate-400 mt-0.5">
              Estimated ~{task.durationMinutes} min • Flexible
            </p>
          </div>
        </div>

        {/* Minimum Card (The heart of task initiation) */}
        <div className="mb-6 rounded-2xl bg-brand-50/70 dark:bg-brand-950/40 border border-brand-100/80 dark:border-brand-900/50 p-4 transition-all">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-700 dark:text-brand-300">
              Minimum (Counts as done)
            </span>
            <span className="text-[11px] font-medium text-brand-600/80 dark:text-brand-400/80">
              The minimum counts
            </span>
          </div>
          <p className="text-sm sm:text-base font-medium text-ink-primary dark:text-slate-100 leading-relaxed">
            {task.minimum || 'Start for 2 minutes and make one small step'}
          </p>
        </div>

        {/* Expandable Normal / Extra flexibility */}
        <div className="mb-6">
          <button
            type="button"
            onClick={() => setShowDetails(!showDetails)}
            className="flex items-center gap-1.5 text-xs font-medium text-ink-muted dark:text-slate-400 hover:text-ink-primary dark:hover:text-slate-200 transition-colors"
          >
            <span>{showDetails ? 'Hide intended & extra' : 'See intended & extra options'}</span>
            {showDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {showDetails && (
            <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2.5 text-xs sm:text-sm">
              <div className="flex items-start gap-2">
                <span className="font-semibold text-ink-secondary dark:text-slate-300 min-w-[60px]">Normal:</span>
                <span className="text-ink-muted dark:text-slate-400">{task.normal || `${task.durationMinutes} minutes`}</span>
              </div>
              {task.extra && (
                <div className="flex items-start gap-2">
                  <span className="font-semibold text-ink-secondary dark:text-slate-300 min-w-[60px]">Extra:</span>
                  <span className="text-ink-muted dark:text-slate-400">{task.extra}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Primary CTA: HELP ME START */}
        <div className="space-y-3">
          <button
            type="button"
            onClick={() => openModal('help_start', task.id)}
            className="w-full relative group overflow-hidden py-4 px-6 rounded-2xl bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white font-semibold text-base sm:text-lg tracking-tight shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2.5 active:scale-[0.99]"
          >
            <Sparkles className="w-5 h-5 text-brand-200 animate-pulse" />
            <span>HELP ME START</span>
          </button>

          {/* Secondary Actions Bar */}
          <div className="flex items-center justify-between gap-2 pt-1">
            {/* I'm Stuck (One tap emergency exit) */}
            <button
              type="button"
              onClick={() => openModal('stuck', task.id)}
              className="flex-1 min-h-[44px] flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200/90 dark:border-slate-700/80 bg-surface dark:bg-surface-dark hover:bg-slate-50 dark:hover:bg-slate-800/80 text-ink-secondary dark:text-slate-300 text-xs sm:text-sm font-medium transition-colors"
            >
              <HelpCircle className="w-4 h-4 text-gentle-coral" />
              <span>I&apos;m stuck</span>
            </button>

            {/* Break into steps */}
            <button
              type="button"
              onClick={() => openModal('breakdown', task.id)}
              className="min-h-[44px] flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200/90 dark:border-slate-700/80 bg-surface dark:bg-surface-dark hover:bg-slate-50 dark:hover:bg-slate-800/80 text-ink-secondary dark:text-slate-300 text-xs sm:text-sm font-medium transition-colors"
              title="Break into smaller steps"
            >
              <ListTree className="w-4 h-4 text-brand-500" />
              <span className="hidden sm:inline">Break down</span>
            </button>

            {/* Done (Minimum counts) */}
            <button
              type="button"
              onClick={handleCompleteMinimum}
              disabled={justCompletedMinimum}
              className="min-h-[44px] flex items-center justify-center gap-1 px-3 py-2 rounded-xl bg-gentle-greenBg dark:bg-emerald-950/40 text-gentle-green dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 text-xs sm:text-sm font-medium transition-colors"
              title="Mark minimum completed"
            >
              <Check className="w-4 h-4" />
              <span>Done min</span>
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
