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
      <p suppressHydrationWarning className="text-xs sm:text-sm font-medium text-ink-muted dark:text-linen-subtle">
        {dateString}
      </p>
      <h1 suppressHydrationWarning className="mt-1 text-2xl sm:text-[1.75rem] font-semibold tracking-tight text-ink-primary dark:text-linen">
        {greeting}.
      </h1>
      <p className="mt-1 text-sm sm:text-base text-ink-secondary dark:text-linen-muted">
        What&apos;s next?
      </p>
    </header>
  );
}
