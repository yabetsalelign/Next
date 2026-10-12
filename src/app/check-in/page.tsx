'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/lib/store';
import { Header } from '@/components/layout/Header';
import { 
  HeartHandshake, 
  BookOpen, 
  Sparkles, 
  Coffee, 
  Check, 
  ChevronRight,
  SunMedium
} from 'lucide-react';

export default function CheckInPage() {
  const { openModal, notPlanningToday, setNotPlanningToday, activeReset, journalEntries } = useApp();
  const [recentCheckins, setRecentCheckins] = useState<any[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('next_checkins_v1');
      if (stored) {
        setRecentCheckins(JSON.parse(stored).slice(0, 5));
      }
    } catch {}
  }, []);

  return (
    <div className="max-w-xl mx-auto space-y-6 animate-fade-in pb-28 md:pb-12">
      {/* Header */}
      <Header
        title="Check In"
        subtitle="Notice how you are right now. No pressure, no obligations, no streaks."
      />

      {/* Primary Actions Grid */}
      <div className="space-y-3">
        {/* Body & Energy Check */}
        <button
          type="button"
          onClick={() => openModal('body_check')}
          className="w-full flex items-center justify-between gap-4 p-4 sm:p-5 rounded-3xl bg-surface dark:bg-surface-dark border border-slate-200/90 dark:border-slate-800 shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition-all text-left active:scale-[0.99] group"
        >
          <div className="flex items-center gap-4 min-w-0 flex-1">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-700 dark:text-amber-400 flex items-center justify-center shrink-0">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-base font-semibold text-ink-primary dark:text-slate-100 break-words leading-snug">
                Body & energy check
              </h2>
              <p className="text-xs text-ink-muted dark:text-slate-400 mt-0.5 leading-relaxed break-words">
                Physical fatigue, tension, hydration, and gentle advice.
              </p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-ink-muted group-hover:translate-x-0.5 transition-transform shrink-0" />
        </button>

        {/* Quick Reflection Journal */}
        <button
          type="button"
          onClick={() => openModal('journal')}
          className="w-full flex items-center justify-between gap-4 p-4 sm:p-5 rounded-3xl bg-surface dark:bg-surface-dark border border-slate-200/90 dark:border-slate-800 shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition-all text-left active:scale-[0.99] group"
        >
          <div className="flex items-center gap-4 min-w-0 flex-1">
            <div className="w-12 h-12 rounded-2xl bg-stone-100 dark:bg-slate-800 text-ink-secondary dark:text-slate-300 flex items-center justify-center shrink-0">
              <BookOpen className="w-6 h-6" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-base font-semibold text-ink-primary dark:text-slate-100 break-words leading-snug">
                Quiet quick reflection
              </h2>
              <p className="text-xs text-ink-muted dark:text-slate-400 mt-0.5 leading-relaxed break-words">
                What did I accomplish? What felt easier? What do I need tomorrow?
              </p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-ink-muted group-hover:translate-x-0.5 transition-transform shrink-0" />
        </button>

        {/* 7-Day Fresh Start */}
        <button
          type="button"
          onClick={() => openModal('fresh_start')}
          className="w-full flex items-center justify-between gap-4 p-4 sm:p-5 rounded-3xl bg-amber-500/10 dark:bg-amber-500/[0.08] border border-amber-500/25 dark:border-amber-500/20 shadow-sm hover:border-amber-500/40 transition-all text-left active:scale-[0.99] group"
        >
          <div className="flex items-center gap-4 min-w-0 flex-1">
            <div className="w-12 h-12 rounded-2xl bg-amber-500 text-stone-950 flex items-center justify-center font-bold shrink-0 shadow-sm">
              <Sparkles className="w-6 h-6" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base font-semibold text-amber-950 dark:text-amber-200 break-words leading-snug">
                  {activeReset ? activeReset.name : '7-Day Fresh Start'}
                </h2>
                {activeReset && (
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded-full">
                    Active
                  </span>
                )}
              </div>
              <p className="text-xs text-amber-900/80 dark:text-amber-300/80 mt-0.5 leading-relaxed break-words">
                {activeReset ? 'View your daily progress and gentle routine' : 'A low-pressure week of basic self-care and renewal'}
              </p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-amber-700 group-hover:translate-x-0.5 transition-transform shrink-0" />
        </button>

        {/* Taking the day off */}
        <div className="p-4 sm:p-5 rounded-3xl bg-surface dark:bg-surface-dark border border-slate-200/90 dark:border-slate-800 shadow-sm flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0 flex-1">
            <div className="w-12 h-12 rounded-2xl bg-stone-100 dark:bg-slate-800/80 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <Coffee className="w-6 h-6" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-base font-semibold text-ink-primary dark:text-slate-100 break-words leading-snug">
                Taking the day off
              </h2>
              <p className="text-xs text-ink-muted dark:text-slate-400 mt-0.5 leading-relaxed break-words">
                {notPlanningToday 
                  ? 'Active today: No demands, no overdue marks.' 
                  : 'Clear today\'s active pressure for genuine rest.'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setNotPlanningToday(!notPlanningToday)}
            className={`py-2 px-3.5 rounded-xl text-xs font-semibold shrink-0 transition-all ${
              notPlanningToday
                ? 'bg-stone-100 dark:bg-slate-800 text-ink-primary dark:text-slate-200 border border-stone-200 dark:border-slate-700 hover:bg-stone-200 dark:hover:bg-slate-700'
                : 'bg-amber-500 text-stone-950 shadow-[0_4px_18px_rgba(229,149,63,0.28)] hover:bg-amber-400'
            }`}
          >
            {notPlanningToday ? 'Turn off' : 'Take off'}
          </button>
        </div>
      </div>

      {/* Recent Reflections & Wellness Logs */}
      {(journalEntries.length > 0 || recentCheckins.length > 0) && (
        <section className="space-y-3 pt-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-ink-muted dark:text-slate-400">
            Recent reflections & check-ins
          </h2>
          
          <div className="space-y-2.5">
            {journalEntries.slice(0, 3).map((entry) => (
              <div 
                key={entry.id}
                className="p-4 rounded-2xl bg-surface dark:bg-surface-dark border border-slate-200/80 dark:border-slate-800 space-y-1.5 shadow-sm"
              >
                <div className="flex items-center justify-between text-xs text-ink-muted dark:text-slate-400">
                  <span className="font-semibold text-amber-700 dark:text-amber-400">Journal prompt</span>
                  <span>{entry.date}</span>
                </div>
                <p className="text-xs text-ink-secondary dark:text-slate-300 italic break-words">
                  &ldquo;{entry.prompt}&rdquo;
                </p>
                <p className="text-xs sm:text-sm font-medium text-ink-primary dark:text-slate-100 break-words leading-relaxed">
                  {entry.response}
                </p>
              </div>
            ))}

            {recentCheckins.slice(0, 2).map((checkin, idx) => (
              <div 
                key={idx}
                className="p-3.5 rounded-2xl bg-surface dark:bg-surface-dark border border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-2 text-xs shadow-sm"
              >
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <SunMedium className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                  <span className="font-medium text-ink-primary dark:text-slate-200 break-words leading-snug">
                    Energy: {checkin.energy}/5 · {checkin.bodyState}
                  </span>
                </div>
                <span className="text-ink-muted dark:text-slate-400 text-[11px] shrink-0">
                  {checkin.date}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Gentle reassurance reminder */}
      <div className="p-4 rounded-2xl bg-stone-100/70 dark:bg-white/[0.04] text-center">
        <p className="text-xs text-ink-muted dark:text-slate-400 leading-relaxed">
          &ldquo;The minimum counts. Returning &gt; streaks.&rdquo;
        </p>
      </div>
    </div>
  );
}
