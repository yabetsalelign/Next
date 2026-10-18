'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Settings as SettingsIcon } from 'lucide-react';

export interface HeaderProps {
  title?: string;
  subtitle?: React.ReactNode;
  date?: string;
  showSettings?: boolean;
  className?: string;
  action?: React.ReactNode;
}

export function Header({
  title,
  subtitle,
  date,
  showSettings = true,
  className = '',
  action,
}: HeaderProps = {}) {
  const pathname = usePathname();

  const { greeting, dateString } = useMemo(() => {
    const now = new Date();
    const hours = now.getHours();
    let greet = 'Good morning';
    if (hours >= 12 && hours < 17) greet = 'Good afternoon';
    else if (hours >= 17) greet = 'Good evening';

    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric' 
    };
    const dateFormatted = now.toLocaleDateString('en-US', options);

    return { greeting: greet, dateString: dateFormatted };
  }, []);

  const displayTitle = title ?? `${greeting}.`;
  const displayDate = title ? date : (date ?? dateString);
  const displaySubtitle = title !== undefined ? subtitle : (subtitle ?? "What's realistic today?");

  const isSettingsActive = pathname === '/settings';
  const shouldRenderSettings = showSettings && !isSettingsActive;

  return (
    <header className={`mb-5 pt-1 sm:pt-2 flex items-start justify-between gap-3 ${className}`}>
      <div className="min-w-0 flex-1">
        {displayDate && (
          <p 
            suppressHydrationWarning 
            className="text-[11px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400/90"
          >
            {displayDate}
          </p>
        )}
        <h1 
          suppressHydrationWarning={!title} 
          className="mt-0.5 text-2xl sm:text-[1.65rem] font-bold tracking-tight text-ink-primary dark:text-linen"
        >
          {displayTitle}
        </h1>
        {displaySubtitle && (
          <p className="mt-0.5 text-xs sm:text-sm text-ink-muted dark:text-linen-subtle">
            {displaySubtitle}
          </p>
        )}
      </div>

      {(shouldRenderSettings || action) && (
        <div className="flex items-center gap-2 shrink-0 pt-0.5">
          {action}

          {shouldRenderSettings && (
            <Link
              href="/settings"
              aria-label="Settings"
              title="Settings"
              className="flex items-center justify-center w-10 h-10 rounded-xl border transition-all active:scale-95 bg-surface dark:bg-surface-dark text-ink-muted dark:text-linen-subtle border-stone-200/80 dark:border-white/[0.08] hover:text-ink-primary dark:hover:text-linen hover:border-stone-300 dark:hover:border-white/[0.15] hover:bg-stone-100/70 dark:hover:bg-white/[0.04]"
            >
              <SettingsIcon className="w-4 h-4 transition-transform hover:rotate-45" />
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
