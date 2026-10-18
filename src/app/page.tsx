'use client';

import React, { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/lib/store';
import { Header } from '@/components/layout/Header';
import { CurrentTaskCard } from '@/components/today/CurrentTaskCard';
import { TodayEmptyState } from '@/components/today/TodayEmptyState';
import { OnboardingFlow } from '@/components/today/OnboardingFlow';
import { sounds } from '@/lib/sounds';

const REST_SUGGESTIONS = [
  { id: 'rest-breathe', title: 'Sit quietly & breathe', duration: '~10 min', icon: 'air', color: 'text-primary-container' },
  { id: 'rest-walk', title: 'Slow walk outside', duration: '~12 min', icon: 'directions_walk', color: 'text-secondary' },
  { id: 'rest-tracks', title: 'Listen to calming tracks', duration: '~15 min', icon: 'headphones', color: 'text-tertiary' },
  { id: 'rest-nothing', title: 'Do nothing guilt-free', duration: '~15 min', icon: 'bedtime', color: 'text-primary-fixed-dim' },
];

export default function TodayPage() {
  const router = useRouter();
  const {
    currentTask,
    upNextTasks,
    hydrated,
    notPlanningToday,
    pendingReturn,
    settings,
    openModal,
    completeTask,
    setCurrentTask,
    addTask,
  } = useApp();

  const { dateFormatted, greeting } = useMemo(() => {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', month: 'long', day: 'numeric' };
    const dateStr = now.toLocaleDateString('en-US', options);

    const h = now.getHours();
    let greet = 'Good morning.';
    if (h >= 12 && h < 17) greet = 'Good afternoon.';
    else if (h >= 17) greet = 'Good evening.';

    return { dateFormatted: dateStr, greeting: greet };
  }, []);

  if (hydrated && !settings.hasCompletedOnboarding) {
    return <OnboardingFlow />;
  }

  const handleQuickComplete = (taskId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    sounds.playMinimumComplete();
    completeTask(taskId, 'minimum');
  };

  const handleAddRestSuggestion = (item: (typeof REST_SUGGESTIONS)[0]) => {
    addTask({
      title: item.title,
      category: 'rest',
      icon: item.icon,
      timeCategory: 'now',
      durationMinutes: 10,
      priority: 'could',
      minimum: 'Pause and take 3 deep breaths',
      normal: `Enjoy ${item.title.toLowerCase()}`,
      steps: [
        { id: `rest-step-${Date.now()}`, title: 'Give yourself permission to pause', completed: false, isMinimum: true },
      ],
      companyPreference: 'no_preference',
    });
    sounds.playTap();
  };

  return (
    <div className="min-h-screen bg-background text-on-surface font-body-md text-body-md flex flex-col selection:bg-primary-container selection:text-on-primary-container">
      {/* Editorial Fixed Header */}
      <Header />

      <main className="flex flex-col relative w-full pt-16 pb-36 px-gutter-mobile bg-background flex-1 max-w-xl mx-auto">
        <div className="flex flex-col w-full gap-space-lg select-none">
          {/* Friendly Welcome & Cadence Header */}
          <section className="flex flex-col pt-space-xs">
            <div className="flex items-center justify-between">
              <span className="font-label-sm text-label-sm tracking-wider uppercase text-outline">
                {dateFormatted}
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                Gentle pace
              </span>
            </div>
            <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface font-semibold tracking-tight mt-1">
              {greeting}
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant mt-0.5">
              What&apos;s realistic right now?
            </p>
          </section>

          {/* Energy & Rhythm Bar (Compassionate Calibration) */}
          <section className="w-full bg-surface-container-low rounded-xl px-space-md py-2.5 shadow-sm border border-surface-container-high/40">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0">
                <span className="material-symbols-outlined text-primary-container text-[18px] shrink-0">
                  vital_signs
                </span>
                <div className="flex items-center gap-1.5 truncate">
                  <span className="font-label-md text-label-md text-on-surface font-medium">
                    Energy: Steady rhythmic
                  </span>
                  <span className="text-outline-variant font-body-sm text-body-sm hidden sm:inline">•</span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant hidden sm:inline">
                    No rush required
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => router.push('/check-in')}
                className="shrink-0 px-3 py-1 rounded-full bg-surface-container-high text-primary font-label-sm text-label-sm hover:bg-surface-container-highest transition-colors active:scale-95"
                id="adjust-energy-btn"
              >
                Adjust
              </button>
            </div>
          </section>

          {/* Primary Focus Card or Empty State */}
          {pendingReturn || notPlanningToday || !currentTask ? (
            <TodayEmptyState />
          ) : (
            <CurrentTaskCard task={currentTask} />
          )}

          {/* Upcoming When Ready */}
          <section className="flex flex-col gap-space-sm">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-outline"></span>
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline font-semibold">
                  Upcoming When Ready
                </span>
              </div>
              <span className="font-label-sm text-label-sm text-on-surface-variant">
                {upNextTasks.length} queued
              </span>
            </div>

            <div className="flex flex-col gap-2">
              {upNextTasks.length === 0 ? (
                <div className="bg-surface-container-low rounded-2xl p-space-md text-center border border-surface-container-high/30">
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    No upcoming tasks queued. Add one realistic thing when you feel ready.
                  </p>
                </div>
              ) : (
                upNextTasks.map((t) => (
                  <div
                    key={t.id}
                    className="w-full bg-surface-container-low rounded-2xl p-space-md flex items-center justify-between gap-space-sm hover:bg-surface-container transition-colors shadow-sm border border-surface-container-high/30"
                  >
                    <div className="flex items-center gap-space-sm min-w-0 flex-1">
                      <button
                        type="button"
                        aria-label="Mark task done"
                        onClick={(e) => handleQuickComplete(t.id, e)}
                        className="w-5 h-5 rounded-full bg-surface-container-high hover:bg-secondary/40 flex items-center justify-center text-transparent hover:text-secondary transition-colors shrink-0"
                      >
                        <span className="material-symbols-outlined text-[13px]">check</span>
                      </button>
                      <div className="min-w-0 flex-1">
                        <h4 className="font-body-md text-body-md text-on-surface font-medium truncate">
                          {t.title}
                        </h4>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-secondary font-label-sm text-label-sm capitalize">
                            {t.category || 'Care'}
                          </span>
                          <span className="font-label-sm text-label-sm text-outline">
                            {t.durationMinutes ? `${t.durationMinutes}m` : '10m'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setCurrentTask(t.id)}
                      className="shrink-0 px-3 py-1.5 rounded-full bg-surface-container-high text-on-surface font-label-sm text-label-sm hover:bg-surface-container-highest transition-colors active:scale-95"
                    >
                      Start small
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Add One Realistic Thing Button */}
            <button
              type="button"
              onClick={() => openModal('create_task')}
              className="w-full py-3 px-space-md rounded-2xl bg-surface-container-low text-on-surface-variant hover:text-primary hover:bg-surface-container font-label-md text-label-md flex items-center justify-center gap-2 transition-all shadow-sm border border-surface-container-high/40 active:scale-[0.99]"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              <span>Add one realistic thing</span>
            </button>
          </section>

          {/* Rest & Pause Suggestions */}
          <section className="flex flex-col gap-space-sm">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary-container text-[18px]">coffee</span>
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline font-semibold">
                  Rest Suggestions
                </span>
              </div>
              <span className="font-label-sm text-label-sm text-outline">Optional breaks</span>
            </div>

            <div className="grid grid-cols-2 gap-space-sm">
              {REST_SUGGESTIONS.map((item) => (
                <div
                  key={item.id}
                  className="bg-surface-container-low rounded-2xl p-space-md flex flex-col justify-between gap-space-md hover:bg-surface-container transition-colors shadow-sm border border-surface-container-high/30"
                >
                  <div className="flex flex-col gap-1.5">
                    <div className={`w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center ${item.color}`}>
                      <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
                    </div>
                    <h5 className="font-label-lg text-label-lg text-on-surface leading-tight mt-1">
                      {item.title}
                    </h5>
                    <span className="font-label-sm text-label-sm text-outline">{item.duration}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleAddRestSuggestion(item)}
                    className="self-start px-3 py-1 rounded-full bg-surface-container-high text-on-surface-variant hover:text-primary font-label-sm text-label-sm flex items-center gap-1 transition-colors active:scale-95"
                  >
                    <span className="material-symbols-outlined text-[14px]">add</span>
                    <span>Add</span>
                  </button>
                </div>
              ))}
            </div>

            {/* Reassuring Mindset Note */}
            <div className="flex items-center justify-center gap-2 py-space-sm text-center">
              <span className="material-symbols-outlined text-outline text-[16px]">spa</span>
              <p className="font-body-sm text-body-sm text-outline">
                Zero guilt. Pausing is part of the work.
              </p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
