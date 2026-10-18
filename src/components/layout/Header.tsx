'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';

export interface HeaderProps {
  title?: string;
  subtitle?: React.ReactNode;
  showBack?: boolean;
  onBack?: () => void;
  showSettings?: boolean;
  className?: string;
  action?: React.ReactNode;
}

export function Header({
  title,
  showBack = false,
  onBack,
  showSettings = true,
  className = '',
  action,
}: HeaderProps = {}) {
  const router = useRouter();
  const pathname = usePathname();

  // If title is not specified, derive from current route
  const resolvedTitle =
    title ??
    (pathname === '/'
      ? 'Today'
      : pathname === '/plan'
      ? 'Plan'
      : pathname === '/routines'
      ? 'Routines'
      : pathname === '/check-in'
      ? 'Check In'
      : pathname === '/history'
      ? 'History'
      : pathname === '/settings'
      ? 'Settings'
      : pathname === '/focus-session'
      ? 'Focus Session'
      : 'Next');

  const isSettingsPage = pathname === '/settings';

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 bg-surface/85 backdrop-blur-xl pt-safe shadow-[0_1px_8px_rgba(0,0,0,0.12)] border-b border-surface-container-high/30 select-none ${className}`}
    >
      <div className="h-16 px-gutter-mobile flex items-center justify-between max-w-xl mx-auto">
        <div className="flex items-center gap-space-xs">
          {showBack ? (
            <button
              type="button"
              aria-label="Go back"
              onClick={onBack ? onBack : () => router.back()}
              className="w-11 h-11 flex items-center justify-center rounded-full text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors active:scale-95"
            >
              <span className="material-symbols-outlined text-[22px]">arrow_back</span>
            </button>
          ) : (
            <div className="flex items-center gap-space-sm pl-1">
              <div className="w-2.5 h-2.5 rounded-full bg-primary-container animate-pulse"></div>
              <h1 className="font-headline-sm text-headline-sm text-on-surface tracking-tight font-semibold">
                {resolvedTitle}
              </h1>
            </div>
          )}

          {showBack && (
            <h1 className="font-headline-sm text-headline-sm text-on-surface tracking-tight font-semibold ml-1">
              {resolvedTitle}
            </h1>
          )}
        </div>

        <div className="flex items-center gap-space-xs">
          {action}

          {showSettings && !isSettingsPage && (
            <Link
              href="/settings"
              aria-label="Settings"
              className="w-11 h-11 flex items-center justify-center rounded-full text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors active:scale-95"
            >
              <span className="material-symbols-outlined text-[22px]">settings</span>
            </Link>
          )}

          <div
            title="Profile"
            className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0 shadow-sm"
          >
            <span className="material-symbols-outlined text-on-primary text-[18px]">
              person
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
