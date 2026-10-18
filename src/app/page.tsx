'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/store';
import { Header } from '@/components/layout/Header';
import { CurrentTaskCard } from '@/components/today/CurrentTaskCard';
import { TodayEmptyState } from '@/components/today/TodayEmptyState';
import { OnboardingFlow } from '@/components/today/OnboardingFlow';
import { 
  Sparkles, 
  Check, 
  Plus, 
  ArrowRight,
  Heart
} from 'lucide-react';
import { sounds } from '@/lib/sounds';

export default function TodayPage() {
  const { currentTask, upNextTasks, hydrated, notPlanningToday, pendingReturn, settings, openModal, completeTask } = useApp();

  // If first launch has not been completed, present intentional onboarding
  if (hydrated && !settings.hasCompletedOnboarding) {
    return <OnboardingFlow />;
  }

  const handleQuickComplete = (taskId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    sounds.playMinimumComplete();
    completeTask(taskId, 'minimum');
  };

  return (
    <div className="max-w-xl mx-auto space-y-6 animate-fade-in pb-28 md:pb-8">
      {/* Editorial Header */}
      <Header
        subtitle="What's realistic today?"
      />

      {/* Main Focus: What do I do next? */}
      {pendingReturn || notPlanningToday || !currentTask ? (
        <TodayEmptyState />
      ) : (
        <div className="space-y-6">
          {/* Centerpiece Active Task */}
          <CurrentTaskCard task={currentTask} />

          {/* Upcoming When Ready (Quiet Preview) */}
          {upNextTasks.length > 0 && (
            <section className="space-y-3 pt-1">
              <div className="flex items-center justify-between pb-1 border-b border-stone-200/60 dark:border-white/[0.06]">
                <h3 className="text-xs font-bold uppercase tracking-wider text-ink-muted dark:text-linen-subtle">
                  Upcoming when ready
                </h3>
                <span className="text-xs text-ink-subtle dark:text-linen-faint font-medium">
                  {upNextTasks.length} queued
                </span>
              </div>

              <div className="rounded-xl bg-surface dark:bg-surface-dark border border-stone-200/90 dark:border-white/[0.08] divide-y divide-stone-100 dark:divide-white/[0.05] shadow-sm overflow-hidden">
                {upNextTasks.map((t) => (
                  <div
                    key={t.id}
                    className="p-3.5 sm:p-4 flex items-center justify-between gap-3 hover:bg-stone-50/60 dark:hover:bg-white/[0.02] transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <button
                        type="button"
                        onClick={(e) => handleQuickComplete(t.id, e)}
                        aria-label={`Mark ${t.title} done`}
                        className="w-6 h-6 rounded-full border border-stone-300 dark:border-white/20 bg-stone-100/60 dark:bg-white/[0.04] flex items-center justify-center text-transparent hover:text-amber-600 dark:hover:text-amber-400 hover:border-amber-500 transition-all shrink-0"
                      >
                        <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                      </button>

                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-ink-primary dark:text-linen truncate">
                          {t.title}
                        </p>
                        <p className="text-xs text-ink-muted dark:text-linen-subtle truncate">
                          {t.minimum || (t.category ? `Category: ${t.category}` : 'Gentle step')}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {t.durationMinutes && t.durationMinutes > 0 ? (
                        <span className="text-[11px] text-ink-subtle dark:text-linen-faint font-medium">
                          ~{t.durationMinutes}m
                        </span>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-right pt-0.5">
                <Link
                  href="/plan"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-300 transition-colors"
                >
                  <span>View full sequence in Plan</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </section>
          )}

          {/* Quiet Wellbeing Bar */}
          <aside className="rounded-xl bg-surface dark:bg-surface-dark border border-stone-200/90 dark:border-white/[0.08] p-3.5 sm:p-4 flex items-center justify-between gap-3 shadow-sm">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-700 dark:text-amber-400 flex items-center justify-center shrink-0">
                <Heart className="w-4 h-4" />
              </span>
              <p className="text-xs text-ink-secondary dark:text-linen-muted truncate">
                Need a pause? Take an intentional moment.
              </p>
            </div>
            <Link
              href="/check-in"
              className="text-xs font-bold text-amber-700 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-300 shrink-0 whitespace-nowrap pl-2 hover:underline"
            >
              Check in →
            </Link>
          </aside>

          {/* Bottom Action Row: Add Task & Reassurance */}
          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={() => openModal('create_task')}
              className="h-10 px-4 rounded-lg bg-stone-100 hover:bg-stone-200/80 dark:bg-white/[0.06] dark:hover:bg-white/[0.1] text-ink-primary dark:text-linen flex items-center gap-2 text-xs font-semibold transition-all active:scale-95 shadow-sm border border-stone-200/70 dark:border-white/[0.06]"
            >
              <Plus className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span>Add task</span>
            </button>
            <span className="text-xs text-ink-subtle dark:text-linen-faint italic select-none">
              Today is unhurried
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
