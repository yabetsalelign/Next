'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/store';
import { Header } from '@/components/layout/Header';
import { CurrentTaskCard } from '@/components/today/CurrentTaskCard';
import { TodayEmptyState } from '@/components/today/TodayEmptyState';
import { OnboardingFlow } from '@/components/today/OnboardingFlow';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function TodayPage() {
  const { currentTask, upNextTasks, hydrated, notPlanningToday, settings, openModal } = useApp();
  const [showUpcoming, setShowUpcoming] = useState(false);

  // If first launch has not been completed, present intentional onboarding
  if (hydrated && !settings.hasCompletedOnboarding) {
    return <OnboardingFlow />;
  }

  return (
    <div className="max-w-xl mx-auto animate-fade-in pb-8">
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
                className="inline-flex items-center gap-1.5 text-xs font-medium text-ink-muted hover:text-ink-primary dark:text-slate-400 dark:hover:text-slate-200 transition-colors py-2 px-3 rounded-xl hover:bg-slate-100/70 dark:hover:bg-slate-800/50"
              >
                <span>{upNextTasks.length} more {upNextTasks.length === 1 ? 'thing' : 'things'} today</span>
                {showUpcoming ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>

              {showUpcoming && (
                <div className="mt-3 text-left space-y-2 animate-fade-in max-w-md mx-auto">
                  {upNextTasks.map((t) => (
                    <div
                      key={t.id}
                      className="flex items-center justify-between p-3.5 rounded-2xl bg-surface dark:bg-surface-dark border border-slate-200/80 dark:border-slate-800"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="text-base select-none">{t.icon || '📌'}</span>
                        <span className="text-xs sm:text-sm font-medium text-ink-primary dark:text-slate-100 truncate">
                          {t.title}
                        </span>
                      </div>
                      <span className="text-[11px] text-ink-subtle shrink-0">~{t.durationMinutes} min</span>
                    </div>
                  ))}
                  <div className="pt-1 text-center">
                    <Link href="/plan" className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline">
                      View full day in Plan →
                    </Link>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Secondary Features Access: Check in */}
          <div className="pt-2 text-center">
            <button
              type="button"
              onClick={() => openModal('check_in')}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-ink-muted hover:text-ink-primary dark:text-slate-400 dark:hover:text-slate-200 transition-colors py-2.5 px-4 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 min-h-[44px]"
            >
              <span>Check in</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
