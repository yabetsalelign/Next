'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Check, Circle, Coffee, Plus } from 'lucide-react';
import { useApp } from '@/lib/store';
import { Header } from '@/components/layout/Header';
import { CurrentTaskCard } from '@/components/today/CurrentTaskCard';
import { TodayEmptyState } from '@/components/today/TodayEmptyState';
import { OnboardingFlow } from '@/components/today/OnboardingFlow';
import { getLocalDateString } from '@/lib/dateUtils';

export default function TodayPage() {
  const router = useRouter();
  const { currentTask, upNextTasks, hydrated, notPlanningToday, pendingReturn, settings, openModal, completeTask, setCurrentTask, setNotPlanningToday, focusSession } = useApp();
  const [todayEnergy, setTodayEnergy] = useState<'low' | 'steady' | 'energized' | null>(null);

  useEffect(() => {
    try {
      const savedCheckIns = localStorage.getItem('next_checkins_v1');
      const entries = savedCheckIns ? JSON.parse(savedCheckIns) : [];
      const entry = Array.isArray(entries)
        ? entries.find((item) => item.date === getLocalDateString())
        : undefined;
      if (entry?.energyState === 'low' || entry?.energyState === 'steady' || entry?.energyState === 'energized') {
        setTodayEnergy(entry.energyState);
      }
    } catch {
      setTodayEnergy(null);
    }
  }, []);

  const { dateFormatted, greeting } = useMemo(() => {
    const now = new Date();
    const dateFormatted = now.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' });
    const hour = now.getHours();
    return { dateFormatted, greeting: hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening' };
  }, []);

  if (hydrated && !settings.hasCompletedOnboarding) return <OnboardingFlow />;

  const hasActiveSession = focusSession.status === 'running' || focusSession.status === 'paused';

  return (
      <div className="w-full min-w-0 min-h-full bg-background text-on-surface flex flex-col">
      <Header />
      <main className="w-full min-w-0 max-w-xl mx-auto flex-1 px-5 pt-[calc(6rem+var(--sat))] pb-40 sm:px-8">
        <div className="space-y-8">
          <section aria-labelledby="today-heading" className="space-y-1">
            <p className="text-sm font-medium text-on-surface-variant">{dateFormatted}</p>
            <h1 id="today-heading" className="text-3xl sm:text-4xl font-semibold tracking-tight">{greeting}.</h1>
            <p className="text-base text-on-surface-variant">The minimum counts. Start wherever you are.</p>
          </section>

          {hasActiveSession && (
            <button onClick={() => router.push('/focus-session')} className="w-full min-h-12 flex items-center justify-between gap-3 rounded-2xl border border-primary/30 bg-primary/10 px-4 py-3 text-left hover:bg-primary/15">
              <span className="font-medium">{focusSession.status === 'paused' ? 'Focus session paused' : 'Focus session in progress'}</span>
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-primary">Return to session <ArrowRight size={16} /></span>
            </button>
          )}

          {notPlanningToday ? (
            <section className="rounded-3xl bg-surface-container-low p-6 sm:p-8 border border-outline-variant">
              <div className="w-11 h-11 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4"><Coffee size={21} /></div>
              <h2 className="text-2xl font-semibold tracking-tight">Today can be a rest day.</h2>
              <p className="mt-2 text-on-surface-variant">Nothing is waiting to be caught up. Return when you feel ready.</p>
              <button onClick={() => setNotPlanningToday(false)} className="mt-5 min-h-11 px-4 rounded-xl bg-surface-container-high font-medium hover:bg-surface-container-highest">Make a plan for today</button>
            </section>
          ) : pendingReturn || !currentTask ? (
            <TodayEmptyState />
          ) : (
            <CurrentTaskCard task={currentTask} energy={todayEnergy} pace={settings.startingDifficulty || 'gentle'} />
          )}

          {!notPlanningToday && (
            <section aria-labelledby="up-next-heading" className="space-y-3">
              <div className="flex items-end justify-between gap-3">
                <div>
                  <h2 id="up-next-heading" className="text-xl font-semibold tracking-tight">On your mind</h2>
                  <p className="text-sm text-on-surface-variant mt-0.5">These can wait until you’re ready.</p>
                </div>
                <span className="text-sm text-on-surface-variant">{upNextTasks.length} {upNextTasks.length === 1 ? 'task' : 'tasks'}</span>
              </div>

              {upNextTasks.length > 0 ? (
                <ul className="divide-y divide-outline-variant border-y border-outline-variant">
                  {upNextTasks.map((task) => (
                    <li key={task.id} className="flex items-center gap-3 py-3.5">
                      <button type="button" aria-label={`Complete ${task.title}`} onClick={() => completeTask(task.id, 'minimum')} className="w-11 h-11 -ml-1 shrink-0 rounded-full grid place-items-center text-on-surface-variant hover:bg-surface-container-high hover:text-secondary">
                        <Circle size={21} strokeWidth={1.7} />
                      </button>
                      <button type="button" aria-label={`Make ${task.title} the current focus task`} onClick={() => setCurrentTask(task.id)} className="flex-1 min-w-0 text-left rounded-lg py-1">
                        <span className="block font-medium leading-snug break-words">{task.title}</span>
                        <span className="block text-sm text-on-surface-variant mt-1">{task.durationMinutes ? `${task.durationMinutes} min` : 'No time estimate'}{task.category ? ` · ${task.category}` : ''}</span>
                      </button>
                      <button type="button" aria-label={`Make ${task.title} your next task`} onClick={() => setCurrentTask(task.id)} className="w-11 h-11 shrink-0 rounded-full grid place-items-center text-primary hover:bg-primary/10"><ArrowRight size={19} /></button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="py-4 text-on-surface-variant border-y border-outline-variant">Nothing else is planned. You can leave the day open.</p>
              )}

              <button type="button" onClick={() => openModal('create_task')} className="min-h-12 w-full flex items-center justify-center gap-2 rounded-xl border border-outline bg-transparent text-on-surface font-medium hover:bg-surface-container-low active:bg-surface-container-high">
                <Plus size={18} /> Add one thing
              </button>
            </section>
          )}

          {!notPlanningToday && !hasActiveSession && (
            <button type="button" onClick={() => router.push('/focus-session')} className="flex items-center gap-2 text-sm font-medium text-on-surface-variant hover:text-primary py-2">
              <span>Need help getting started?</span><ArrowRight size={16} />
            </button>
          )}
        </div>
      </main>
    </div>
  );
}
