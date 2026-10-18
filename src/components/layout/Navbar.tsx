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

  // 5 primary destinations on mobile bottom nav (matching Untitled-1.html)
  const mobileNavItems = [
    { label: 'Today', href: '/', icon: CheckCircle2 },
    { label: 'Plan', href: '/plan', icon: Calendar },
    { label: 'Routines', href: '/routines', icon: Sparkles },
    { label: 'Check-in', href: '/check-in', icon: HeartHandshake },
    { label: 'History', href: '/history', icon: RotateCcw },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 border-r border-stone-200/80 dark:border-white/[0.08] bg-surface dark:bg-surface-dark p-6 fixed inset-y-0 left-0 z-30 select-none">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-8 h-8 rounded-lg bg-amber-500 text-stone-950 flex items-center justify-center font-bold text-base shadow-sm">
            N
          </div>
          <div>
            <h1 className="font-bold text-base tracking-tight text-ink-primary dark:text-linen">Next</h1>
            <p className="text-[11px] text-ink-muted dark:text-linen-subtle">Next. Not everything.</p>
          </div>
        </div>

        {/* Quick Add Button */}
        <button
          type="button"
          onClick={() => openModal('create_task')}
          className="w-full flex items-center justify-center gap-2 py-2 px-3.5 mb-6 rounded-lg bg-stone-100 hover:bg-stone-200/80 dark:bg-white/[0.06] dark:hover:bg-white/[0.1] text-ink-primary dark:text-linen font-semibold text-xs transition-colors border border-stone-200/60 dark:border-white/[0.06]"
        >
          <Plus className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          <span>Add task</span>
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
                className={`flex items-center gap-3 px-3 py-2 rounded-lg font-medium text-xs transition-all ${
                  isActive
                    ? 'bg-amber-500/15 text-amber-900 dark:text-amber-300 font-bold'
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
          <p className="text-[11px] text-ink-subtle dark:text-linen-faint leading-relaxed">
            The minimum counts. Returning &gt; streaks.
          </p>
        </div>
      </aside>

      {/* Mobile Bottom Navigation (5 destinations) */}
      <nav 
        aria-label="Mobile Navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-stone-200/80 bg-surface/90 dark:border-white/[0.08] dark:bg-surface-dark/90 backdrop-blur-xl shadow-[0_-1px_12px_rgba(0,0,0,0.08)]"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        <div className="flex items-center justify-between h-14 px-1">
          {mobileNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? 'page' : undefined}
                className={`flex flex-col items-center justify-center flex-1 h-12 transition-colors rounded-lg ${
                  isActive
                    ? 'text-amber-700 dark:text-amber-400 font-bold'
                    : 'text-ink-muted dark:text-linen-subtle hover:text-ink-primary dark:hover:text-linen'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.4]' : 'stroke-[1.75]'}`} />
                <span className="text-[10px] mt-0.5 tracking-tight font-medium">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
