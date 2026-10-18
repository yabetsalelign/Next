'use client';

import React from 'react';
import { useApp } from '@/lib/store';

export function TodayEmptyState() {
  const { openModal, setNotPlanningToday, addTask, tasks, pendingReturn, acknowledgeReturn } = useApp();

  const handleAddOneThing = () => {
    if (pendingReturn) acknowledgeReturn();
    openModal('create_task');
  };

  const handleJustCare = () => {
    if (pendingReturn) acknowledgeReturn();
    const existingTitles = tasks.map((t) => t.title.toLowerCase());
    const careActions = [
      {
        title: 'Drink a glass of water',
        category: 'wellness' as const,
        icon: '💧',
        durationMinutes: 2,
        minimum: 'Take three slow sips of water',
        normal: 'Drink a full glass of cool water',
      },
      {
        title: 'Rest your eyes & breathe',
        category: 'rest' as const,
        icon: 'spa',
        durationMinutes: 5,
        minimum: 'Close your eyes for 60 seconds',
        normal: 'Sit comfortably and take 5 deep breaths',
      },
    ];

    careActions.forEach((item) => {
      if (!existingTitles.includes(item.title.toLowerCase())) {
        addTask({
          title: item.title,
          category: item.category,
          icon: item.icon,
          timeCategory: 'now',
          durationMinutes: item.durationMinutes,
          priority: 'must',
          minimum: item.minimum,
          normal: item.normal,
          steps: [
            { id: `care-step-1-${Date.now()}`, title: item.minimum, completed: false, isMinimum: true },
          ],
          companyPreference: 'no_preference',
        });
      }
    });
  };

  const handleLater = () => {
    if (pendingReturn) acknowledgeReturn();
    setNotPlanningToday(true);
  };

  return (
    <section className="my-6 w-full max-w-md mx-auto select-none animate-fade-in" data-purpose="empty-state-card">
      <div className="bg-surface-container-low border border-surface-container-high rounded-[28px] p-6 sm:p-7 text-center shadow-2xl relative overflow-hidden backdrop-blur-sm">
        {/* Subtle Glow Highlight at Card Top */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-36 h-24 bg-primary-container/10 rounded-full blur-2xl pointer-events-none"></div>

        {/* Empty State Headline */}
        <h2 className="text-2xl font-bold tracking-tight text-on-surface mb-1.5 font-headline-lg-mobile">
          {pendingReturn ? 'Welcome back.' : 'Nothing planned yet.'}
        </h2>

        {/* Reassuring Subtext */}
        <p className="text-sm font-medium text-on-surface-variant mb-1">
          {pendingReturn ? 'Nothing needs catching up.' : "That's okay."}
        </p>
        <p className="text-xs text-outline mb-7">
          What would help right now?
        </p>

        {/* Action Buttons Group */}
        <div className="flex flex-col space-y-3">
          {/* Primary Amber Action: Add one thing */}
          <button
            type="button"
            onClick={handleAddOneThing}
            className="w-full py-3.5 px-6 rounded-2xl bg-primary-container hover:bg-primary-fixed text-on-primary-fixed font-semibold text-[15px] shadow-[0_8px_24px_-6px_rgba(255,185,99,0.35)] active:scale-[0.98] transition-all flex items-center justify-center space-x-2"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            <span>Add one thing</span>
          </button>

          {/* Secondary Action: Just care for yourself */}
          <button
            type="button"
            onClick={handleJustCare}
            className="w-full py-3.5 px-6 rounded-2xl bg-surface-container-high/80 hover:bg-surface-container-high border border-surface-container-highest text-primary-container hover:text-primary font-medium text-[14px] active:scale-[0.98] transition-all flex items-center justify-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">spa</span>
            <span>Just care for yourself</span>
          </button>

          {/* Tertiary Action: I'll figure it out later */}
          <button
            type="button"
            onClick={handleLater}
            className="w-full py-2.5 px-4 text-on-surface-variant hover:text-on-surface text-xs font-medium tracking-normal active:scale-[0.98] transition-colors mt-1"
          >
            I&apos;ll figure it out later
          </button>
        </div>
      </div>
    </section>
  );
}
