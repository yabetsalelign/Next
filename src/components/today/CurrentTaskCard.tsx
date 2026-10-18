'use client';

import React, { useState } from 'react';
import { Task } from '@/types';
import { useApp } from '@/lib/store';
import { 
  Check, 
  ChevronDown, 
  ChevronUp, 
  Coffee, 
  Sparkles,
  Clock,
  LifeBuoy,
  Zap,
  Tag
} from 'lucide-react';
import { sounds } from '@/lib/sounds';

interface CurrentTaskCardProps {
  task: Task;
}

export function CurrentTaskCard({ task }: CurrentTaskCardProps) {
  const { openModal, completeTask, deferTask } = useApp();
  const [showDetails, setShowDetails] = useState(false);
  const [justCompletedMinimum, setJustCompletedMinimum] = useState(false);

  const isRest = task.category === 'rest';
  const isCare = task.category === 'wellness';

  const handleDone = () => {
    sounds.playMinimumComplete();
    setJustCompletedMinimum(true);
    setTimeout(() => {
      completeTask(task.id, 'minimum');
      setJustCompletedMinimum(false);
    }, 600);
  };

  const handleLater = () => {
    deferTask(task.id);
  };

  const handleStuck = () => {
    openModal('stuck', task.id);
  };

  const minimumText = task.minimum || 'Start for 2 minutes and make one small step';

  return (
    <article 
      aria-label={`Current task: ${task.title}`}
      className="relative rounded-xl border border-stone-200/90 dark:border-white/[0.08] bg-surface dark:bg-surface-dark p-5 sm:p-6 shadow-md transition-all overflow-hidden"
    >
      {/* Subtle warm halo accent at top of card */}
      <div className="absolute top-0 inset-x-6 h-px bg-gradient-to-r from-transparent via-amber-500/40 dark:via-amber-400/30 to-transparent pointer-events-none" />

      {/* Centerpiece Header: NOW Badge + Metadata */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <span className="text-amber-700 dark:text-amber-400 font-bold text-xs uppercase tracking-widest flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          NOW
        </span>

        <div className="flex items-center gap-1.5 text-xs text-ink-muted dark:text-linen-subtle font-medium">
          {task.durationMinutes && task.durationMinutes > 0 ? (
            <span className="px-2 py-0.5 rounded-md bg-stone-100 dark:bg-white/[0.06] text-ink-secondary dark:text-linen">
              ~{task.durationMinutes} min
            </span>
          ) : null}

          {isRest && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-800 dark:text-amber-300 font-semibold">
              <Coffee className="w-3 h-3" />
              Rest
            </span>
          )}

          {isCare && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-sky-500/15 text-sky-800 dark:text-sky-300 font-semibold">
              <Sparkles className="w-3 h-3" />
              Care
            </span>
          )}
        </div>
      </div>

      {/* Task Title & Context */}
      <div className="space-y-1 mb-4">
        <h2 className="text-xl sm:text-2xl font-bold leading-tight tracking-tight text-ink-primary dark:text-linen break-words">
          {task.title}
        </h2>
        {task.category && (
          <p className="text-xs text-ink-muted dark:text-linen-subtle flex items-center gap-1 pt-0.5">
            <Tag className="w-3 h-3 opacity-60" />
            <span className="capitalize">{task.category}</span>
            {task.priority === 'must' && <span className="font-semibold text-amber-700 dark:text-amber-400">• Must</span>}
          </p>
        )}
      </div>

      {/* 2-Minute Minimum Accent Box */}
      <div className="border-l-2 border-amber-500/80 pl-3.5 py-1.5 my-3 bg-amber-500/[0.06] dark:bg-amber-500/[0.08] rounded-r-lg space-y-0.5">
        <div className="text-amber-800 dark:text-amber-400 font-bold text-[11px] uppercase tracking-wider flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 fill-current" />
          <span>The 2-Minute Minimum</span>
        </div>
        <p className="text-ink-primary dark:text-linen text-sm leading-relaxed">
          {minimumText}
        </p>
      </div>

      {/* Action Flow */}
      <div className="mt-5 space-y-2.5">
        {/* Primary CTA */}
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); openModal('help_start', task.id); }}
          className="w-full h-12 bg-amber-500 hover:bg-amber-400 active:bg-amber-600 rounded-xl flex items-center justify-center gap-2 text-stone-950 font-bold text-sm shadow-sm active:scale-[0.99] transition-all"
        >
          <Sparkles className="w-4 h-4" />
          <span>Help me start</span>
        </button>

        {/* 3-Column Micro-Actions: Done · Later · Stuck */}
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={handleDone}
            disabled={justCompletedMinimum}
            className="h-10 rounded-lg bg-stone-100 hover:bg-stone-200/80 dark:bg-white/[0.06] dark:hover:bg-white/[0.1] flex items-center justify-center gap-1.5 text-xs font-semibold text-sage-700 dark:text-sage-300 transition-colors"
          >
            <Check className="w-4 h-4 stroke-[2.5]" />
            <span>Done</span>
          </button>

          <button
            type="button"
            onClick={handleLater}
            className="h-10 rounded-lg bg-stone-100 hover:bg-stone-200/80 dark:bg-white/[0.06] dark:hover:bg-white/[0.1] flex items-center justify-center gap-1.5 text-xs font-medium text-ink-muted dark:text-linen-subtle hover:text-ink-primary dark:hover:text-linen transition-colors"
          >
            <Clock className="w-4 h-4" />
            <span>Later</span>
          </button>

          <button
            type="button"
            onClick={handleStuck}
            className="h-10 rounded-lg bg-stone-100 hover:bg-stone-200/80 dark:bg-white/[0.06] dark:hover:bg-white/[0.1] flex items-center justify-center gap-1.5 text-xs font-medium text-ink-muted dark:text-linen-subtle hover:text-ink-primary dark:hover:text-linen transition-colors"
          >
            <LifeBuoy className="w-4 h-4" />
            <span>I&apos;m stuck</span>
          </button>
        </div>
      </div>

      {/* Progressive Disclosure: Details */}
      <div className="pt-3 text-center">
        <button
          type="button"
          onClick={() => setShowDetails(!showDetails)}
          className="inline-flex items-center gap-1 text-xs font-medium text-ink-muted hover:text-ink-primary dark:text-linen-subtle dark:hover:text-linen transition-colors py-1"
        >
          <span>{showDetails ? 'Hide details' : 'See details'}</span>
          {showDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        {showDetails && (
          <div className="mt-3 space-y-2 border-t border-stone-200/60 dark:border-white/[0.06] pt-3 text-left text-xs text-ink-muted dark:text-linen-subtle animate-fade-in">
            {task.normal && (
              <div className="space-y-0.5">
                <span className="font-semibold text-ink-primary dark:text-linen">Standard goal:</span>
                <p>{task.normal}</p>
              </div>
            )}
            {task.steps && task.steps.length > 0 && (
              <div className="space-y-1 pt-1">
                <span className="font-semibold text-ink-primary dark:text-linen">Sequence steps:</span>
                <ul className="list-disc list-inside space-y-0.5">
                  {task.steps.map(s => (
                    <li key={s.id} className={s.completed ? 'line-through opacity-60' : ''}>
                      {s.title}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
