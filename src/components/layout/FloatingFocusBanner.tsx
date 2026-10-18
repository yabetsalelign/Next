'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Pause, Play, Square, Timer } from 'lucide-react';
import { useApp } from '@/lib/store';

export function FloatingFocusBanner() {
  const pathname = usePathname();
  const { focusSession, pauseFocusSession, resumeFocusSession, stopFocusSession, currentTask, settings, hydrated } = useApp();
  if (!hydrated || !settings.hasCompletedOnboarding || pathname === '/focus-session' || (focusSession.status !== 'running' && focusSession.status !== 'paused')) return null;

  const paused = focusSession.status === 'paused';
  const time = `${Math.floor(focusSession.remainingSeconds / 60)}:${String(focusSession.remainingSeconds % 60).padStart(2, '0')}`;
  const title = focusSession.taskTitle || currentTask?.title || 'Focus session';

  return (
    <aside className="fixed bottom-[calc(var(--bottom-nav-h)+0.5rem)] md:bottom-5 inset-x-0 z-40 px-3 pointer-events-none" aria-label="Active focus session">
      <div className="max-w-xl mx-auto pointer-events-auto rounded-2xl border border-outline-variant bg-surface shadow-lg">
        <div className="min-h-14 flex items-center gap-2 px-3 py-1.5">
          <Link href="/focus-session" className="flex-1 min-w-0 min-h-11 flex items-center gap-2.5 rounded-lg text-left">
            <Timer size={18} className="shrink-0 text-primary" />
            <span className="min-w-0 flex-1"><span className="block text-xs text-on-surface-variant">{paused ? 'Paused' : 'Focus session'}</span><span className="block font-medium leading-tight break-words">{title}</span></span>
            <span className="font-mono font-semibold text-primary tabular-nums">{time}</span>
          </Link>
          <button type="button" aria-label={paused ? 'Resume focus timer' : 'Pause focus timer'} onClick={paused ? resumeFocusSession : pauseFocusSession} className="w-11 h-11 shrink-0 rounded-xl grid place-items-center text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface"><span className="sr-only">{paused ? 'Resume' : 'Pause'}</span>{paused ? <Play size={18} /> : <Pause size={18} />}</button>
          <button type="button" aria-label="Stop focus session" onClick={stopFocusSession} className="w-11 h-11 shrink-0 rounded-xl grid place-items-center text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface"><Square size={17} /></button>
        </div>
      </div>
    </aside>
  );
}
