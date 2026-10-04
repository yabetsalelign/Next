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
  Plus
} from 'lucide-react';
import { useApp } from '@/lib/store';

export function Navbar() {
  const pathname = usePathname();
  const { openModal } = useApp();

  const navItems = [
    { label: 'Today', href: '/', icon: CheckCircle2 },
    { label: 'Plan', href: '/plan', icon: Calendar },
    { label: 'Routines', href: '/routines', icon: Sparkles },
    { label: 'History', href: '/history', icon: RotateCcw },
    { label: 'Settings', href: '/settings', icon: SettingsIcon },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 border-r border-slate-200/80 dark:border-slate-800 bg-surface dark:bg-surface-dark p-6 fixed inset-y-0 left-0 z-30 select-none">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-9 h-9 rounded-xl bg-brand-600 dark:bg-brand-500 text-white flex items-center justify-center font-bold text-lg shadow-sm">
            N
          </div>
          <div>
            <h1 className="font-semibold text-lg tracking-tight text-ink-primary dark:text-slate-100">Next</h1>
            <p className="text-xs text-ink-muted dark:text-slate-400">Next. Not everything.</p>
          </div>
        </div>

        {/* Quick Add Button */}
        <button
          onClick={() => openModal('create_task')}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 mb-6 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200/80 dark:hover:bg-slate-700/80 text-ink-primary dark:text-slate-200 font-medium text-sm transition-colors"
        >
          <Plus className="w-4 h-4 text-brand-600 dark:text-brand-400" />
          <span>Add something</span>
        </button>

        {/* Navigation Items */}
        <nav className="flex-1 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all ${
                  isActive
                    ? 'bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 font-semibold'
                    : 'text-ink-secondary dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-ink-primary dark:hover:text-slate-200'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-brand-600 dark:text-brand-400' : 'text-ink-muted dark:text-slate-500'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Desktop Footer message */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80">
          <p className="text-xs text-ink-subtle dark:text-slate-500 leading-relaxed">
            The minimum counts. You can always stop or keep going.
          </p>
        </div>
      </aside>

      {/* Mobile Bottom Navigation
          - Fixed to bottom, sits above Android gesture area via pb-safe
          - Height: ~56px nav bar + safe-area-inset-bottom
          - Active state: colored icon + label + subtle pill background
          - Touch targets: min 52px height per item for comfortable tap
      */}
      <nav 
        aria-label="Mobile Navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200/60 bg-surface/95 dark:border-slate-800/80 dark:bg-surface-dark/95 backdrop-blur-xl shadow-[0_-10px_24px_rgba(15,23,42,0.08)]"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        <div className="flex items-stretch justify-around px-1 pb-1.5 pt-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? 'page' : undefined}
                className={`relative flex flex-col items-center justify-center gap-0.5 flex-1 rounded-2xl py-2 min-h-[56px] transition-all ${
                  isActive
                    ? 'text-brand-600 dark:text-brand-400'
                    : 'text-ink-muted dark:text-slate-400'
                }`}
              >
                {isActive && (
                  <span
                    className="absolute inset-x-2 top-1 h-8 rounded-full bg-brand-50 dark:bg-brand-950/70"
                    aria-hidden="true"
                  />
                )}
                <span className="relative z-10">
                  <Icon
                    className={`w-[22px] h-[22px] transition-transform ${isActive ? 'scale-[1.08]' : ''}`}
                    strokeWidth={isActive ? 2.25 : 1.75}
                  />
                </span>
                <span className={`relative z-10 text-[11px] leading-none font-medium tracking-tight ${isActive ? 'font-semibold' : ''}`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
      {pathname === '/' && (
        <button
          type="button"
          onClick={() => openModal('create_task')}
          aria-label="Add new task"
          className="fixed bottom-[calc(4.5rem+env(safe-area-inset-bottom,0px))] right-4 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-brand-600 text-white shadow-lg shadow-brand-600/30 active:scale-95 sm:hidden"
        >
          <Plus className="h-6 w-6" />
        </button>
      )}
    </>
  );
}
