'use client';

import React, { useState, useMemo } from 'react';
import { useApp } from '@/lib/store';
import { Header } from '@/components/layout/Header';
import {
  getCurrentWeekDateStrings,
  getLocalDateString,
  formatDayOfWeek,
  isSameDay,
} from '@/lib/dateUtils';

export default function HistoryPage() {
  const { returns, helpfulInsights, tasks, journalEntries } = useApp();
  const [isArchivesOpen, setIsArchivesOpen] = useState(false);

  const completedTasks = tasks.filter((t) => t.completed);
  const minimumsCount = completedTasks.filter((t) => t.completedTier === 'minimum').length;
  const returnedDays = returns.filter((r) => r.status === 'returned').length;

  const todayStr = useMemo(() => getLocalDateString(), []);

  // 7-day strip (Mon to Sun)
  const currentWeekDays = useMemo(() => {
    const dates = getCurrentWeekDateStrings();
    return dates.map((dateStr) => {
      const dayOfWeek = formatDayOfWeek(dateStr).slice(0, 3);
      const isToday = isSameDay(dateStr, todayStr);
      const record = returns.find((r) => r.dateStr === dateStr);

      let status: 'done' | 'pause' | 'return' = 'pause';
      if (record?.status === 'returned') {
        status = 'return';
      } else if (record?.status === 'active' || isToday) {
        status = 'done';
      }

      return {
        dateStr,
        dayOfWeek,
        isToday,
        status,
      };
    });
  }, [returns, todayStr]);

  return (
    <div className="min-h-screen bg-background text-on-surface font-body-md text-body-md flex flex-col selection:bg-primary-container selection:text-on-primary-container">
      {/* Header */}
      <Header />

      <main className="flex flex-col relative w-full pt-16 pb-36 px-gutter-mobile bg-background flex-1 max-w-xl mx-auto">
        <div className="flex flex-col w-full pb-8 space-y-4 select-none">
          {/* Subtitle note just beneath the header slot */}
          <div className="px-1 pt-1 pb-1">
            <p className="font-body-sm text-body-sm text-on-surface-variant/80">
              Returning matters more than unbroken lines.
            </p>
          </div>

          {/* Section 1: The Return Philosophy */}
          <section className="bg-surface-container-low rounded-2xl p-space-md shadow-sm transition-all hover:bg-surface-container/70 border border-surface-container-high/40">
            <div className="flex items-center gap-space-xs text-primary-container mb-2.5">
              <span className="material-symbols-outlined text-[18px]">replay</span>
              <span className="font-label-sm text-label-sm uppercase tracking-wider font-semibold">
                The Return Philosophy
              </span>
            </div>
            <h2 className="font-headline-sm text-headline-sm text-on-surface mb-2 tracking-tight">
              &ldquo;You paused. Then you came back. That&rsquo;s a return.&rdquo;
            </h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
              Life naturally moves in cycles. Pausing is normal and guilt-free. We record continuity of presence,
              never the rigidity of an unbroken line.
            </p>
          </section>

          {/* Section 2: Metric Stat Counters */}
          <section className="grid grid-cols-3 gap-2.5">
            <div className="bg-surface-container-low rounded-2xl p-3.5 flex flex-col items-center justify-center text-center shadow-sm border border-surface-container-high/30">
              <span className="font-headline-xl-mobile text-headline-xl-mobile text-on-surface font-semibold">
                {completedTasks.length}
              </span>
              <span className="font-label-sm text-label-sm text-on-surface-variant mt-0.5">Tasks done</span>
            </div>
            <div className="bg-surface-container-low rounded-2xl p-3.5 flex flex-col items-center justify-center text-center shadow-sm border border-surface-container-high/30">
              <span className="font-headline-xl-mobile text-headline-xl-mobile text-on-surface font-semibold">
                {minimumsCount}
              </span>
              <span className="font-label-sm text-label-sm text-on-surface-variant mt-0.5">Minimums done</span>
            </div>
            <div className="bg-surface-container-low rounded-2xl p-3.5 flex flex-col items-center justify-center text-center shadow-sm border border-surface-container-high/30">
              <span className="font-headline-xl-mobile text-headline-xl-mobile text-primary-container font-semibold">
                {returnedDays}
              </span>
              <span className="font-label-sm text-label-sm text-on-surface-variant mt-0.5">Gentle returns</span>
            </div>
          </section>

          {/* Section 3: This Week's Rhythm */}
          <section className="bg-surface-container-low rounded-2xl p-space-md shadow-sm flex flex-col gap-3.5 border border-surface-container-high/30">
            <div className="flex flex-col gap-0.5">
              <div className="flex items-center justify-between">
                <h3 className="font-label-lg text-label-lg text-on-surface uppercase tracking-wider font-semibold">
                  This Week&apos;s Rhythm
                </h3>
                <span className="font-label-sm text-label-sm text-primary-container/90 font-medium">
                  Recorded continuity
                </span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Every return is celebrated. No reset streaks.
              </p>
            </div>

            {/* Status Legend */}
            <div className="flex items-center gap-4 text-on-surface-variant py-0.5">
              <div className="flex items-center gap-1.5 font-label-sm text-label-sm">
                <span className="w-2 h-2 rounded-full bg-secondary"></span>
                <span className="text-on-surface">Done</span>
              </div>
              <div className="flex items-center gap-1.5 font-label-sm text-label-sm">
                <span className="w-2 h-2 rounded-full bg-surface-container-highest"></span>
                <span>Pause</span>
              </div>
              <div className="flex items-center gap-1.5 font-label-sm text-label-sm">
                <span className="w-2 h-2 rounded-full bg-primary-container"></span>
                <span className="text-primary-container">Return</span>
              </div>
            </div>

            {/* 7-Day Day Rhythm Strip */}
            <div className="grid grid-cols-7 gap-1 pt-1">
              {currentWeekDays.map((d) => {
                if (d.isToday) {
                  return (
                    <div
                      key={d.dateStr}
                      className="flex flex-col items-center justify-between bg-surface-container-high rounded-xl py-2 px-1 h-20 text-center shadow-[0_0_16px_rgba(255,185,99,0.15)] relative overflow-hidden border border-primary-container/40"
                    >
                      <div className="absolute inset-0 bg-primary-container/10 pointer-events-none"></div>
                      <span className="font-label-sm text-label-sm text-primary-container uppercase font-bold relative z-10">
                        {d.dayOfWeek}
                      </span>
                      <span className="material-symbols-outlined text-[17px] text-secondary relative z-10 font-bold">
                        check
                      </span>
                      <span className="font-label-sm text-label-sm text-primary-container text-[10px] font-semibold relative z-10">
                        Done
                      </span>
                    </div>
                  );
                }

                if (d.status === 'done') {
                  return (
                    <div
                      key={d.dateStr}
                      className="flex flex-col items-center justify-between bg-secondary-container/20 rounded-xl py-2 px-1 h-20 text-center border border-secondary/20"
                    >
                      <span className="font-label-sm text-label-sm text-secondary uppercase font-semibold">
                        {d.dayOfWeek}
                      </span>
                      <span className="material-symbols-outlined text-[17px] text-secondary">check</span>
                      <span className="font-label-sm text-label-sm text-secondary text-[10px] font-medium">Done</span>
                    </div>
                  );
                }

                if (d.status === 'return') {
                  return (
                    <div
                      key={d.dateStr}
                      className="flex flex-col items-center justify-between bg-primary-container/20 rounded-xl py-2 px-1 h-20 text-center border border-primary-container/25"
                    >
                      <span className="font-label-sm text-label-sm text-primary-container uppercase font-semibold">
                        {d.dayOfWeek}
                      </span>
                      <span className="material-symbols-outlined text-[17px] text-primary-container">replay</span>
                      <span className="font-label-sm text-label-sm text-primary-container text-[10px] font-medium">Return</span>
                    </div>
                  );
                }

                return (
                  <div
                    key={d.dateStr}
                    className="flex flex-col items-center justify-between bg-surface-container rounded-xl py-2 px-1 h-20 text-center"
                  >
                    <span className="font-label-sm text-label-sm text-on-surface-variant uppercase font-medium">
                      {d.dayOfWeek}
                    </span>
                    <span className="text-on-surface-variant font-label-md">–</span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant/70 text-[10px]">Pause</span>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Section 4: Recent Returns Banner */}
          <section className="bg-surface-container-low rounded-2xl p-space-md shadow-sm border border-surface-container-high/30">
            <div className="flex items-center justify-between mb-2">
              <span className="font-label-lg text-label-lg text-on-surface uppercase tracking-wider font-semibold">
                Recent Returns
              </span>
              <span className="font-label-sm text-label-sm text-primary-container font-medium">Active state</span>
            </div>
            <div className="bg-surface-container-lowest/80 rounded-xl p-3.5 border border-surface-container-high/20">
              <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed text-center">
                You are here right now. When you take a pause and step back in, Next marks that gently.
              </p>
            </div>
          </section>

          {/* Section 5: Supportive Patterns Noticed */}
          <section className="bg-surface-container-low rounded-2xl p-space-md shadow-sm flex flex-col gap-4 border border-surface-container-high/30">
            <div className="flex flex-col gap-0.5">
              <h3 className="font-label-lg text-label-lg text-on-surface uppercase tracking-wider font-semibold">
                Supportive Patterns Noticed
              </h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Observations on supportive conditions, never a judgment.
              </p>
            </div>

            {/* Rows with Progress Bars */}
            <div className="space-y-3">
              {/* Item 1 */}
              <div className="bg-surface-container-lowest/70 rounded-xl p-3 flex flex-col gap-2 border border-surface-container-high/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-on-surface">
                    <span className="material-symbols-outlined text-primary-container text-[20px]">timer</span>
                    <span className="font-label-md text-label-md font-medium">2-minute mini starts</span>
                  </div>
                  <span className="font-label-sm text-label-sm text-primary-container font-semibold bg-surface-container-high px-2 py-0.5 rounded-full">
                    7 times
                  </span>
                </div>
                <div className="w-full h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
                  <div className="h-full bg-primary-container rounded-full" style={{ width: '82%' }}></div>
                </div>
              </div>

              {/* Item 2 */}
              <div className="bg-surface-container-lowest/70 rounded-xl p-3 flex flex-col gap-2 border border-surface-container-high/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-on-surface">
                    <span className="material-symbols-outlined text-primary-container text-[20px]">headphones</span>
                    <span className="font-label-md text-label-md font-medium">Noise reduction / headphones</span>
                  </div>
                  <span className="font-label-sm text-label-sm text-on-surface-variant font-medium bg-surface-container-high px-2 py-0.5 rounded-full">
                    1 time
                  </span>
                </div>
                <div className="w-full h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
                  <div className="h-full bg-primary-container rounded-full" style={{ width: '20%' }}></div>
                </div>
              </div>

              {/* Item 3 */}
              <div className="bg-surface-container-lowest/70 rounded-xl p-3 flex flex-col gap-2 border border-surface-container-high/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-on-surface">
                    <span className="material-symbols-outlined text-primary-container text-[20px]">local_cafe</span>
                    <span className="font-label-md text-label-md font-medium">Intentional quiet rest first</span>
                  </div>
                  <span className="font-label-sm text-label-sm text-primary-container font-semibold bg-surface-container-high px-2 py-0.5 rounded-full">
                    3 times
                  </span>
                </div>
                <div className="w-full h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
                  <div className="h-full bg-primary-container rounded-full" style={{ width: '44%' }}></div>
                </div>
              </div>
            </div>

            {/* Expandable Trigger Accordion */}
            <button
              type="button"
              onClick={() => setIsArchivesOpen((o) => !o)}
              className="w-full py-2.5 px-3 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface transition-colors flex items-center justify-center gap-1.5 text-center cursor-pointer"
            >
              <span className="font-label-md text-label-md font-medium">View reflections &amp; archives</span>
              <span
                className={`material-symbols-outlined text-[18px] transition-transform duration-200 ${
                  isArchivesOpen ? 'rotate-180' : ''
                }`}
              >
                keyboard_arrow_down
              </span>
            </button>

            {/* Collapsible Archive Content */}
            {isArchivesOpen && (
              <div className="flex flex-col gap-2.5 pt-1 animate-fade-in">
                {journalEntries.length > 0 ? (
                  journalEntries.map((e) => (
                    <div
                      key={e.id}
                      className="bg-surface-container-lowest/60 rounded-xl p-3 flex items-start gap-3 border border-surface-container-high/20"
                    >
                      <div className="w-7 h-7 rounded-full bg-primary-container/20 text-primary-container flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="material-symbols-outlined text-[15px]">psychology</span>
                      </div>
                      <div className="flex flex-col gap-0.5 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="font-label-sm text-label-sm text-on-surface font-medium truncate">
                            {e.prompt}
                          </span>
                          <span className="text-[10px] text-outline ml-2 shrink-0">{e.date}</span>
                        </div>
                        <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                          &ldquo;{e.response}&rdquo;
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="bg-surface-container-lowest/60 rounded-xl p-3 text-center border border-surface-container-high/20">
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      No past reflections archived yet.
                    </p>
                  </div>
                )}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
