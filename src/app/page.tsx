'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/store';
import { Header } from '@/components/layout/Header';
import { CurrentTaskCard } from '@/components/today/CurrentTaskCard';
import { TodayEmptyState } from '@/components/today/TodayEmptyState';
import { OnboardingFlow } from '@/components/today/OnboardingFlow';
import { ChevronDown, ChevronUp, Coffee, Sparkles, Clock, CheckCircle2 } from 'lucide-react';


function TaskCategoryIcon({ category, icon }: { category?: string; icon?: string }) {
  if (icon) {
    return <span className="text-sm select-none">{icon}</span>;
  }
  if (category === 'rest') {
    return <Coffee className="w-4 h-4 text-amber-500/90 shrink-0" />;
  }
  if (category === 'wellness') {
    return <Sparkles className="w-4 h-4 text-terracotta shrink-0" />;
  }
  if (category === 'routine') {
    return <Clock className="w-4 h-4 text-sage-500 shrink-0" />;
  }
  return <CheckCircle2 className="w-4 h-4 text-stone-400 dark:text-linen-subtle shrink-0" />;
}

export default function TodayPage() {
  const { currentTask, upNextTasks, hydrated, notPlanningToday, settings } = useApp();
  const [showUpcoming, setShowUpcoming] = useState(false);

  // If first launch has not been completed, present intentional onboarding
  if (hydrated && !settings.hasCompletedOnboarding) {
    return <OnboardingFlow />;
  }

  return (
    <div className="max-w-xl mx-auto animate-fade-in pb-28 md:pb-8">
      {/* Calm Header */}
      <Header />

      {/* Main Focus: What do I do next? */}
      {notPlanningToday || !currentTask ? (
        <TodayEmptyState />
      ) : (
        <div className="space-y-6">
          <CurrentTaskCard task={currentTask} />

          {/* Up Next Summary: "N more things today" */}
          {upNextTasks.length > 0 && (
            <div className="text-center">
              <button
                type="button"
                onClick={() => setShowUpcoming(!showUpcoming)}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-ink-muted hover:text-ink-primary dark:text-linen-subtle dark:hover:text-linen transition-colors py-2 px-3 rounded-xl hover:bg-stone-100/70 dark:hover:bg-white/[0.04]"
              >
                <span>{upNextTasks.length} more {upNextTasks.length === 1 ? 'thing' : 'things'} today</span>
                {showUpcoming ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>

              {showUpcoming && (
                <div className="mt-3 text-left space-y-2 animate-fade-in max-w-md mx-auto">
                  {upNextTasks.map((t) => (
                    <div
                      key={t.id}
                      className="flex items-center justify-between p-3.5 rounded-2xl bg-surface dark:bg-surface-dark border border-stone-200/80 dark:border-white/[0.08] shadow-sm"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-7 h-7 rounded-xl bg-stone-100 dark:bg-white/[0.04] flex items-center justify-center shrink-0">
                          <TaskCategoryIcon category={t.category} icon={t.icon} />
                        </div>
                        <span className="text-xs sm:text-sm font-medium text-ink-primary dark:text-linen truncate">
                          {t.title}
                        </span>
                      </div>
                      <span className="text-[11px] text-ink-subtle dark:text-linen-faint shrink-0">~{t.durationMinutes} min</span>
                    </div>
                  ))}
                  <div className="pt-1 text-center">
                    <Link href="/plan" className="text-xs font-semibold text-amber-700 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-300 hover:underline">
                      View full day in Plan →
                    </Link>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Secondary Features Access: Check in */}
          <div className="pt-2 text-center">
            <Link
              href="/check-in"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-ink-muted hover:text-ink-primary dark:text-linen-subtle dark:hover:text-linen transition-colors py-2.5 px-4 rounded-xl hover:bg-stone-100 dark:hover:bg-white/[0.04] min-h-[44px]"
            >
              <span>Check in</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
