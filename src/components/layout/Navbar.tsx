'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '@/lib/store';

export function Navbar() {
  const pathname = usePathname();
  const { openModal, settings, hydrated } = useApp();

  // Hide navigation entirely during initial onboarding or in focus session
  if ((hydrated && !settings.hasCompletedOnboarding) || pathname === '/focus-session') {
    return null;
  }

  // 5 primary destinations (matching Untitled-1.html)
  const navItems = [
    { label: 'Today', href: '/', icon: 'wb_sunny' },
    { label: 'Plan', href: '/plan', icon: 'calendar_today' },
    { label: 'Routines', href: '/routines', icon: 'auto_awesome' },
    { label: 'Check-in', href: '/check-in', icon: 'spa' },
    { label: 'History', href: '/history', icon: 'history' },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 border-r border-surface-container-high bg-surface-container-low p-6 fixed inset-y-0 left-0 z-30 select-none">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-8 h-8 rounded-full bg-primary-container text-on-primary-fixed flex items-center justify-center font-bold text-base shadow-sm">
            <span className="material-symbols-outlined text-[20px]">bolt</span>
          </div>
          <div>
            <h1 className="font-headline-sm text-headline-sm font-semibold tracking-tight text-on-surface">Next</h1>
            <p className="font-label-sm text-label-sm text-on-surface-variant">Next. Not everything.</p>
          </div>
        </div>

        {/* Quick Add Button */}
        <button
          type="button"
          onClick={() => openModal('create_task')}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-3.5 mb-6 rounded-full bg-primary-container text-on-primary-container font-label-md text-label-md font-semibold hover:bg-primary-fixed transition-all shadow-sm active:scale-95"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          <span>Add task</span>
        </button>

        {/* Navigation Items */}
        <nav className="flex-1 space-y-1.5">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-full font-label-md text-label-md transition-colors ${
                  isActive
                    ? 'bg-surface-container-high text-primary-container font-semibold'
                    : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                }`}
              >
                <span className={`material-symbols-outlined text-[20px] ${isActive ? 'text-primary-container' : 'text-on-surface-variant'}`}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </Link>
            );
          })}

          <Link
            href="/settings"
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-full font-label-md text-label-md transition-colors ${
              pathname === '/settings'
                ? 'bg-surface-container-high text-primary-container font-semibold'
                : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">settings</span>
            <span>Settings</span>
          </Link>
        </nav>

        {/* Desktop Footer philosophy note */}
        <div className="pt-4 border-t border-surface-container">
          <p className="font-body-sm text-body-sm text-outline leading-relaxed">
            The minimum counts. Returning &gt; streaks.
          </p>
        </div>
      </aside>

      {/* Mobile Bottom Navigation (Matching Untitled-1.html) */}
      <nav
        aria-label="Mobile Navigation"
        className="md:hidden fixed bottom-0 inset-x-0 z-50 pb-safe bg-surface-container-low/95 backdrop-blur-xl shadow-[0_-4px_24px_rgba(0,0,0,0.4)] border-t border-surface-container-high/40 select-none"
      >
        <div className="flex items-center justify-around h-16 max-w-xl mx-auto px-space-xs">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? 'page' : undefined}
                className={`flex flex-col items-center justify-center min-w-[54px] h-12 transition-colors gap-0.5 active:scale-95 ${
                  isActive
                    ? 'text-primary-container font-semibold'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-[24px]">
                  {item.icon}
                </span>
                <span className="font-label-sm text-label-sm">
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
