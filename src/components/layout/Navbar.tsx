'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  CheckCircle2, 
  Calendar, 
  Sparkles, 
  RotateCcw, 
  Settings as SettingsIcon,
  Plus,
  HeartHandshake
} from 'lucide-react';
import { useApp } from '@/lib/store';

export function Navbar() {
  const pathname = usePathname();
  const { openModal, settings, hydrated } = useApp();

  // Hide navigation entirely during initial onboarding
  if (hydrated && !settings.hasCompletedOnboarding) {
    return null;
  }

  // All 6 items on desktop sidebar
  const desktopNavItems = [
    { label: 'Today', href: '/', icon: CheckCircle2 },
    { label: 'Plan', href: '/plan', icon: Calendar },
    { label: 'Routines', href: '/routines', icon: Sparkles },
    { label: 'Check-in', href: '/check-in', icon: HeartHandshake },
    { label: 'History', href: '/history', icon: RotateCcw },
    { label: 'Settings', href: '/settings', icon: SettingsIcon },
  ];

  // Primary 4 destinations on mobile bottom nav; history is accessible from the shared header and desktop nav.
  const mobileNavItems = [
    { label: 'Today', href: '/', icon: CheckCircle2 },
    { label: 'Plan', href: '/plan', icon: Calendar },
    { label: 'Routines', href: '/routines', icon: Sparkles },
    { label: 'Check-in', href: '/check-in', icon: HeartHandshake },
  ];

  return (
    <>
      {/* Desktop Sidebar (All destinations visible) */}
      <aside className="hidden md:flex flex-col w-64 border-r border-stone-200/80 dark:border-white/[0.08] bg-surface dark:bg-surface-dark p-6 fixed inset-y-0 left-0 z-30 select-none">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-9 h-9 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center font-bold text-lg shadow-[0_2px_12px_rgba(229,149,63,0.3)]">
            N
          </div>
          <div>
            <h1 className="font-semibold text-lg tracking-tight text-ink-primary dark:text-linen">Next</h1>
            <p className="text-xs text-ink-muted dark:text-linen-subtle">Next. Not everything.</p>
          </div>
        </div>

        {/* Quick Add Button */}
        <button
          type="button"
          onClick={() => openModal('create_task')}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 mb-6 rounded-xl bg-stone-100 dark:bg-surface-darkElevated hover:bg-stone-200/80 dark:hover:bg-white/[0.08] text-ink-primary dark:text-linen font-medium text-sm transition-colors border border-transparent dark:border-white/[0.06]"
        >
          <Plus className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          <span>Add something</span>
        </button>

        {/* Navigation Items */}
        <nav className="flex-1 space-y-1">
          {desktopNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all ${
                  isActive
                    ? 'bg-amber-500/10 dark:bg-amber-500/15 text-amber-800 dark:text-amber-400 font-semibold'
                    : 'text-ink-secondary dark:text-linen-subtle hover:bg-stone-100/70 dark:hover:bg-white/[0.04] hover:text-ink-primary dark:hover:text-linen'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-amber-600 dark:text-amber-400' : 'text-ink-muted dark:text-linen-faint'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Desktop Footer message */}
        <div className="pt-4 border-t border-stone-200/60 dark:border-white/[0.06]">
          <p className="text-xs text-ink-subtle dark:text-linen-faint leading-relaxed">
            The minimum counts. Returning &gt; streaks.
          </p>
        </div>
      </aside>

      {/* Mobile Bottom Navigation (Exactly 5 destinations) */}
      <nav 
        aria-label="Mobile Navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-stone-200/80 bg-surface/95 dark:border-white/[0.08] dark:bg-surface-dark/95 backdrop-blur-xl shadow-[0_-8px_25px_rgba(0,0,0,0.25)]"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        <div className="flex items-stretch justify-around px-1 py-1.5">
          {mobileNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? 'page' : undefined}
                className="flex-1 flex flex-col items-center justify-center min-h-[50px] px-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50 rounded-2xl"
              >
                <div
                  className={`w-full flex flex-col items-center justify-center py-1.5 px-0.5 rounded-2xl transition-all duration-200 ${
                    isActive
                      ? 'bg-amber-500/15 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 font-semibold shadow-[0_1px_8px_rgba(229,149,63,0.12)]'
                      : 'text-ink-muted dark:text-linen-subtle hover:text-ink-primary dark:hover:text-linen'
                  }`}
                >
                  <Icon
                    className={`w-[20px] h-[20px] transition-transform ${isActive ? 'scale-105 stroke-[2.2]' : 'stroke-[1.75]'}`}
                  />
                  <span className={`text-[11px] leading-tight mt-1 tracking-tight truncate max-w-full text-center ${isActive ? 'font-semibold text-amber-700 dark:text-amber-300' : 'font-medium'}`}>
                    {item.label}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
