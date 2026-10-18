'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/lib/store';

const INTERVALS = [
  { label: '2 min', seconds: 120 },
  { label: '5 min', seconds: 300 },
  { label: '10 min', seconds: 600 },
  { label: '25 min', seconds: 1500 },
];

export default function FocusSessionPage() {
  const router = useRouter();
  const {
    currentTask,
    focusSession,
    startFocusSession,
    pauseFocusSession,
    resumeFocusSession,
    stopFocusSession,
    completeFocusSession,
    deferTask,
    settings,
  } = useApp();

  // Local state for duration selection while idle — does NOT start the timer
  const [selectedDuration, setSelectedDuration] = useState<number>(
    focusSession.durationSeconds || 120
  );

  const isIdle = focusSession.status === 'idle';
  const isRunning = focusSession.status === 'running';
  const isPaused = focusSession.status === 'paused';
  const isFinished = focusSession.status === 'completed';
  const isActive = isRunning || isPaused || isFinished;

  // When a session is active, show its duration; when idle show local selection
  const displayDuration = isActive ? (focusSession.durationSeconds || 120) : selectedDuration;
  const remainingSeconds = isActive ? (focusSession.remainingSeconds ?? displayDuration) : displayDuration;

  const radius = 102;
  const circumference = 2 * Math.PI * radius;
  const fraction = displayDuration > 0 ? remainingSeconds / displayDuration : 1;
  const strokeDashoffset = isIdle
    ? 0  // full ring shown when idle (ready to start)
    : circumference * (1 - fraction);

  const minutes = Math.floor(remainingSeconds / 60);
  const secs = remainingSeconds % 60;
  const displayTime = `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

  const taskTitle = (isActive ? focusSession.taskTitle : null) || currentTask?.title || 'Gentle Focus';
  const taskMinimum = currentTask?.minimum || 'Take one small step. Any step counts.';

  // Duration pill: only changes local selection when idle. Restarts when active.
  const handleSelectDuration = (sec: number) => {
    if (isIdle) {
      setSelectedDuration(sec);
      // DO NOT call startFocusSession here
    } else {
      // User tapped a different duration mid-session: restart with new duration
      startFocusSession(sec, currentTask ? { id: currentTask.id, title: currentTask.title } : undefined);
    }
  };

  // Explicit Start (idle state only)
  const handleStart = () => {
    startFocusSession(
      selectedDuration,
      currentTask ? { id: currentTask.id, title: currentTask.title } : undefined
    );
  };

  // Pause / Resume toggle (running or paused)
  const handleTogglePause = () => {
    if (isRunning) pauseFocusSession();
    else if (isPaused) resumeFocusSession();
  };

  // Repeat: requires explicit tap — resets to idle display then user taps Start
  const handleRepeat = () => {
    stopFocusSession();
    setSelectedDuration(displayDuration);
    // Now idle — user must tap Start explicitly
  };

  // "Counts as success!" — mark complete once, then go home
  const handleCompleteSuccess = () => {
    if (!isFinished) completeFocusSession();
    setTimeout(() => { router.push('/'); }, 800);
  };

  // Postpone: stop session, defer task, go home
  const handlePostpone = () => {
    stopFocusSession();
    if (currentTask) deferTask(currentTask.id);
    router.push('/');
  };

  // Close/minimize: if session is running or paused, keep it alive in banner
  const handleClose = () => {
    if (isIdle || isFinished) {
      if (isFinished) stopFocusSession();
    }
    // Navigate home — banner shows if still running/paused
    router.push('/');
  };

  const statusLabel = isPaused ? 'Paused' : isFinished ? 'Finished' : isRunning ? 'Gentle Focus' : 'Ready';

  return (
    <div className="min-h-screen bg-background text-on-surface font-body-md text-body-md flex flex-col selection:bg-primary-container selection:text-on-primary-container">
      {/* Top Header */}
      <header className="fixed top-0 inset-x-0 z-50 bg-surface/85 backdrop-blur-xl pt-safe shadow-[0_1px_8px_rgba(0,0,0,0.12)] border-b border-surface-container-high/30">
        <div className="h-16 px-gutter-mobile flex items-center justify-between max-w-xl mx-auto">
          <div className="flex items-center gap-space-xs">
            <button
              type="button"
              aria-label="Go back"
              onClick={() => router.back()}
              className="w-11 h-11 flex items-center justify-center rounded-full text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors active:scale-95"
            >
              <span className="material-symbols-outlined text-[22px]">arrow_back</span>
            </button>
            <h1 className="font-headline-sm text-headline-sm text-on-surface font-semibold tracking-tight ml-1">Focus Session</h1>
          </div>
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-sm">
            <span className="material-symbols-outlined text-on-primary text-[18px]">person</span>
          </div>
        </div>
      </header>

      <main className="flex flex-col relative w-full pt-20 pb-safe px-gutter-mobile bg-background flex-1 max-w-xl mx-auto">
        <div className="flex flex-col w-full pb-8 select-none">

          {/* Sub-header row */}
          <div className="flex items-center justify-between py-2 px-1 text-on-surface-variant">
            <button
              type="button"
              aria-label="Minimize focus session"
              onClick={handleClose}
              className="w-11 h-11 flex items-center justify-center rounded-full bg-surface-container-low hover:bg-surface-container-high transition-colors active:scale-95"
            >
              <span className="material-symbols-outlined text-[20px] text-on-surface">close</span>
            </button>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-low border border-surface-container-high/50">
              <span className={`w-2 h-2 rounded-full bg-primary-container ${isRunning ? 'animate-pulse' : ''}`}></span>
              <span className="font-label-md text-label-md text-on-surface font-medium">{statusLabel}</span>
            </div>
            <div className="w-11 h-11 flex items-center justify-center">
              <span className={`material-symbols-outlined text-[20px] ${settings.soundEnabled ? 'text-primary-container' : 'text-on-surface-variant'}`}>
                {settings.soundEnabled ? 'notifications_active' : 'notifications_paused'}
              </span>
            </div>
          </div>

          {/* Task context card */}
          <div className="relative mt-3 p-space-md rounded-[24px] bg-surface-container-low overflow-hidden shadow-md border border-surface-container-high/40">
            <div className="absolute -right-10 -top-10 w-32 h-32 rounded-full bg-primary-container/10 blur-2xl pointer-events-none"></div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 text-primary-fixed-dim">
                <span className="material-symbols-outlined text-[16px]">all_inclusive</span>
                <span className="font-label-sm text-label-sm tracking-wider uppercase font-semibold">Active Intention</span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-surface-container-highest text-on-surface-variant font-label-sm text-label-sm">Low pressure</span>
            </div>
            <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface font-semibold tracking-tight">{taskTitle}</h2>
            <div className="mt-2 flex items-start gap-2 bg-surface-container-lowest/80 p-2.5 rounded-xl border border-surface-container-high/30">
              <span className="material-symbols-outlined text-[18px] text-primary-fixed-dim mt-0.5 shrink-0">subdirectory_arrow_right</span>
              <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                <span className="text-on-surface font-medium">Step 1:</span> {taskMinimum}
              </p>
            </div>
          </div>

          {/* Circular ring timer */}
          <div className="relative flex flex-col items-center justify-center my-6">
            <div className="absolute w-64 h-64 rounded-full bg-primary-container/10 blur-3xl pointer-events-none"></div>
            <div className="relative w-64 h-64 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 240 240">
                <circle cx="120" cy="120" fill="transparent" r={radius} stroke="#1f1f23" strokeLinecap="round" strokeWidth="10" />
                <circle
                  className="transition-all duration-1000 ease-out"
                  cx="120" cy="120" fill="transparent" r={radius}
                  stroke="#ffb963"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round" strokeWidth="10"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center text-center px-4">
                <span className="font-headline-xl text-[44px] leading-tight font-bold text-on-surface tracking-tight font-mono">
                  {isFinished ? '✓' : displayTime}
                </span>
                <span className="mt-1 font-label-md text-label-md text-primary-container font-semibold tracking-wide">
                  {isFinished ? 'STEP COMPLETE' : isIdle ? 'READY TO START' : `${Math.round(displayDuration / 60)}-MIN FOCUS`}
                </span>
                <div className="mt-1 flex items-center gap-1 text-on-surface-variant/80">
                  <span className="material-symbols-outlined text-[14px]">spa</span>
                  <span className="font-label-sm text-label-sm">{isIdle ? 'Choose a duration' : 'Pure presence'}</span>
                </div>
              </div>
            </div>
            <p className="mt-3 text-center font-body-sm text-body-sm text-on-surface-variant max-w-xs leading-relaxed">
              {isIdle
                ? 'Select a duration and tap Start when ready. No pressure.'
                : 'Every second counts. You are free to stop whenever the timer chimes.'}
            </p>
          </div>

          {/* Duration pill selectors */}
          <div className="flex items-center justify-center gap-2 mb-6">
            {INTERVALS.map((item) => {
              const active = (isIdle ? selectedDuration : displayDuration) === item.seconds;
              return (
                <button
                  key={item.seconds}
                  type="button"
                  onClick={() => handleSelectDuration(item.seconds)}
                  className={`duration-chip px-3.5 py-1.5 rounded-full font-label-md text-label-md transition-all active:scale-95 ${
                    active
                      ? 'bg-surface-container-high text-primary-fixed-dim shadow-sm border border-primary-container/30'
                      : 'bg-surface-container-low text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>

          {/* Primary action buttons — context-aware */}
          <div className="flex flex-col gap-3 px-1 w-full">

            {/* IDLE: Show single Start button */}
            {isIdle && (
              <button
                type="button"
                onClick={handleStart}
                className="w-full h-14 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center gap-2.5 font-label-lg text-label-lg shadow-lg shadow-primary-container/10 active:scale-[0.98] transition-all font-semibold"
              >
                <span className="material-symbols-outlined text-[24px]">play_arrow</span>
                <span>Start focus</span>
              </button>
            )}

            {/* RUNNING or PAUSED: Show Pause/Resume */}
            {(isRunning || isPaused) && (
              <button
                type="button"
                onClick={handleTogglePause}
                className="w-full h-14 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center gap-2.5 font-label-lg text-label-lg shadow-lg shadow-primary-container/10 active:scale-[0.98] transition-all font-semibold"
              >
                <span className="material-symbols-outlined text-[24px]">
                  {isRunning ? 'pause' : 'play_arrow'}
                </span>
                <span>{isRunning ? 'Pause gently' : 'Resume step'}</span>
              </button>
            )}

            {/* FINISHED: Show Repeat (explicit tap required) */}
            {isFinished && (
              <button
                type="button"
                onClick={handleRepeat}
                className="w-full h-14 rounded-full bg-surface-container-high text-on-surface flex items-center justify-center gap-2.5 font-label-lg text-label-lg active:scale-[0.98] transition-all font-semibold border border-surface-container-highest"
              >
                <span className="material-symbols-outlined text-[24px]">replay</span>
                <span>Repeat step</span>
              </button>
            )}

            {/* Secondary row: always available */}
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={handleCompleteSuccess}
                className="h-12 rounded-full bg-surface-container-high hover:bg-surface-variant text-secondary flex items-center justify-center gap-1.5 px-3 font-label-md text-label-md active:scale-[0.98] transition-all font-medium border border-secondary/20"
              >
                <span className="material-symbols-outlined text-[18px]">check_circle</span>
                <span className="truncate">Counts as success!</span>
              </button>
              <button
                type="button"
                onClick={handlePostpone}
                className="h-12 rounded-full bg-surface-container-low hover:bg-surface-container-high text-on-surface-variant flex items-center justify-center gap-1.5 px-3 font-label-md text-label-md active:scale-[0.98] transition-all"
              >
                <span className="material-symbols-outlined text-[18px]">schedule</span>
                <span className="truncate">Postpone gently</span>
              </button>
            </div>
          </div>

          {/* Zero-Guilt Guarantee */}
          <div className="mt-6 p-4 rounded-2xl bg-surface-container-lowest flex items-start gap-3 border border-surface-container-high/40 shadow-sm">
            <div className="w-9 h-9 rounded-full bg-secondary-container/20 text-secondary flex items-center justify-center shrink-0 mt-0.5">
              <span className="material-symbols-outlined text-[20px]">nature</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-label-md text-label-md text-on-surface font-semibold">Zero Guilt Guarantee</span>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5 leading-snug">
                Action cures doubt, but rest restores strength. Any fraction of this step is stored as quiet progress.
              </p>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
