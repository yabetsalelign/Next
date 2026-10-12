'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { RotateCcw, Settings as SettingsIcon } from 'lucide-react';

export interface HeaderProps {
  title?: string;
  subtitle?: React.ReactNode;
  date?: string;
  showHistory?: boolean;
  showSettings?: boolean;
  className?: string;
  action?: React.ReactNode;
}

export function Header({
  title,
  subtitle,
  date,
  showHistory = true,
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
  const displaySubtitle = title !== undefined ? subtitle : (subtitle ?? "What's next?");

  const isHistoryActive = pathname === '/history';
  const isSettingsActive = pathname === '/settings';

  const shouldRenderHistory = showHistory && !isHistoryActive;
  const shouldRenderSettings = showSettings && !isSettingsActive;

  return (
    <header className={`mb-6 pt-1 sm:pt-2 flex items-start justify-between gap-3 sm:gap-4 ${className}`}>
      <div className="min-w-0 flex-1">
        {displayDate && (
          <p suppressHydrationWarning className="text-xs sm:text-sm font-medium text-ink-muted dark:text-linen-subtle">
            {displayDate}
          </p>
        )}
        <h1 suppressHydrationWarning={!title} className="mt-1 text-2xl sm:text-[1.75rem] font-semibold tracking-tight text-ink-primary dark:text-linen">
          {displayTitle}
        </h1>
        {displaySubtitle && (
          <p className={title ? "mt-1 text-xs sm:text-sm text-ink-muted dark:text-linen-subtle" : "mt-1 text-sm sm:text-base text-ink-secondary dark:text-linen-muted"}>
            {displaySubtitle}
          </p>
        )}
      </div>

      {(shouldRenderHistory || shouldRenderSettings || action) && (
        <div className="flex items-center gap-2 shrink-0 pt-0.5">
          {action}

          {shouldRenderHistory && (
            <Link
              href="/history"
              aria-label="History"
              title="History"
              className="flex items-center justify-center gap-1.5 h-11 px-3 sm:px-3.5 rounded-2xl border transition-all duration-200 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-stone-900 bg-surface dark:bg-surface-dark text-ink-secondary dark:text-linen-subtle border-stone-200/80 dark:border-white/[0.08] hover:text-ink-primary dark:hover:text-linen hover:border-stone-300 dark:hover:border-white/[0.15] hover:bg-stone-100/70 dark:hover:bg-white/[0.04] text-xs sm:text-sm font-medium"
            >
              <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[1.85] text-ink-muted dark:text-linen-subtle" />
              <span className="tracking-tight">History</span>
            </Link>
          )}

          {shouldRenderSettings && (
            <Link
              href="/settings"
              aria-label="Settings"
              title="Settings"
              className="flex items-center justify-center w-11 h-11 rounded-2xl border transition-all duration-200 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-stone-900 bg-surface dark:bg-surface-dark text-ink-muted dark:text-linen-subtle border-stone-200/80 dark:border-white/[0.08] hover:text-ink-primary dark:hover:text-linen hover:border-stone-300 dark:hover:border-white/[0.15] hover:bg-stone-100/70 dark:hover:bg-white/[0.04]"
            >
              <SettingsIcon className="w-5 h-5 transition-transform duration-300 hover:rotate-45 stroke-[1.75]" />
            </Link>
          )}
        </div>
      )}
    </header>
  );
}

