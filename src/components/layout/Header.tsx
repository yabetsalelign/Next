'use client';

import React, { useMemo } from 'react';

export function Header() {
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

  return (
    <header className="mb-6 pt-1 sm:pt-2">
      <p suppressHydrationWarning className="text-sm font-medium text-ink-muted dark:text-slate-400">
        {dateString}
      </p>
      <h1 suppressHydrationWarning className="mt-1 text-2xl sm:text-[1.75rem] font-semibold tracking-tight text-ink-primary dark:text-slate-100">
        {greeting}.
      </h1>
      <p className="mt-1 text-base sm:text-lg text-ink-secondary dark:text-slate-300">
        What&apos;s next?
      </p>
    </header>
  );
}
