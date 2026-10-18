'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '@/lib/store';

export function FloatingFocusBanner() {
  const pathname = usePathname();
  const { focusSession, pauseFocusSession, resumeFocusSession, stopFocusSession, currentTask, settings, hydrated } = useApp();

  // ONLY render when a session is actively running or paused!
  if (
    !hydrated ||
    !settings.hasCompletedOnboarding ||
    pathname === '/focus-session' ||
    (focusSession.status !== 'running' && focusSession.status !== 'paused')
  ) {
    return null;
  }

  const isPaused = focusSession.status === 'paused';
  const mins = Math.floor(focusSession.remainingSeconds / 60);
  const secs = focusSession.remainingSeconds % 60;
  const timeFormatted = `${mins}:${String(secs).padStart(2, '0')}`;

  const taskTitle = focusSession.taskTitle || currentTask?.title || 'Active Focus Session';

  return (
    <aside className="fixed bottom-20 inset-x-0 z-40 px-gutter-mobile pointer-events-none select-none">
      <div className="max-w-xl mx-auto pointer-events-auto">
        <div className="bg-surface-container-high/95 backdrop-blur-xl rounded-full px-space-md py-2 flex items-center justify-between shadow-[0_12px_32px_-4px_rgba(0,0,0,0.55)] border border-outline/30">
          <Link
            href="/focus-session"
            className="flex items-center gap-space-sm min-w-0 pr-2 group cursor-pointer flex-1"
          >
            <span className="relative flex h-2.5 w-2.5 shrink-0">
              <span
                className={`absolute inline-flex h-full w-full rounded-full bg-primary opacity-75 ${
                  !isPaused ? 'animate-ping' : ''
                }`}
              ></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
            </span>
            <span className="font-label-md text-label-md text-on-surface truncate group-hover:text-primary transition-colors font-medium">
              {taskTitle}
            </span>
          </Link>

          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Live Countdown Pill */}
            <Link
              href="/focus-session"
              className="px-space-sm py-0.5 rounded-full bg-primary-container/20 text-primary-container font-label-sm text-label-sm flex items-center gap-1 font-semibold"
            >
              <span className="material-symbols-outlined text-[14px]">timer</span>
              <span>{timeFormatted}</span>
            </Link>

            {/* Pause / Resume Button */}
            <button
              type="button"
              aria-label={isPaused ? 'Resume focus timer' : 'Pause focus timer'}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (isPaused) resumeFocusSession();
                else pauseFocusSession();
              }}
              className="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center text-on-surface hover:text-primary transition-colors active:scale-95"
            >
              <span className="material-symbols-outlined text-[16px]">
                {isPaused ? 'play_arrow' : 'pause'}
              </span>
            </button>

            {/* Stop Session Button */}
            <button
              type="button"
              aria-label="End focus session"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                stopFocusSession();
              }}
              className="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center text-on-surface-variant hover:text-on-surface transition-colors active:scale-95"
              title="Stop session"
            >
              <span className="material-symbols-outlined text-[16px]">stop</span>
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}

