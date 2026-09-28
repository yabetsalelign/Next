'use client';

import React from 'react';
import { useApp } from '@/lib/store';
import { Header } from '@/components/layout/Header';
import { CurrentTaskCard } from '@/components/today/CurrentTaskCard';
import { UpNextTimeline } from '@/components/today/UpNextTimeline';
import { TodayEmptyState } from '@/components/today/TodayEmptyState';

export default function TodayPage() {
  const { currentTask, upNextTasks, hydrated, notPlanningToday } = useApp();



  return (
    <div className="max-w-xl mx-auto pb-24 md:pb-12 animate-fade-in">
      {/* Calm Header */}
      <Header />

      {/* Main Focus: NOW */}
      {notPlanningToday || !currentTask ? (
        <TodayEmptyState />
      ) : (
        <>
          <CurrentTaskCard task={currentTask} />

          {/* UP NEXT */}
          <UpNextTimeline tasks={upNextTasks} />
        </>
      )}
    </div>
  );
}
