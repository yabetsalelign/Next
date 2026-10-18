'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/lib/store';
import { Header } from '@/components/layout/Header';
import { getLocalDateString } from '@/lib/dateUtils';
import { 
  Sparkles, 
  Coffee, 
  Check, 
  ChevronRight,
  SunMedium,
  Heart,
  Moon,
  Droplets,
  Zap,
  Lock,
  PauseCircle,
  Play
} from 'lucide-react';
import { sounds } from '@/lib/sounds';

export default function CheckInPage() {
  const { openModal, notPlanningToday, setNotPlanningToday, activeReset, journalEntries, addJournalEntry } = useApp();
  const [energyState, setEnergyState] = useState<'low' | 'steady' | 'energized'>('steady');
  const [reflectionText, setReflectionText] = useState('');
  const [saveToast, setSaveToast] = useState(false);

  // Load today's recorded energy if present
  useEffect(() => {
    try {
      const stored = localStorage.getItem('next_checkins_v1');
      if (stored) {
        const parsed = JSON.parse(stored);
        const todayStr = getLocalDateString();
        const todayEntry = parsed.find((c: any) => c.date === todayStr);
        if (todayEntry?.energyState) {
          setEnergyState(todayEntry.energyState);
        }
      }
    } catch {}
  }, []);

  const handleSelectEnergy = (state: 'low' | 'steady' | 'energized') => {
    setEnergyState(state);
    try {
      const todayStr = getLocalDateString();
      const stored = localStorage.getItem('next_checkins_v1');
      const parsed = stored ? JSON.parse(stored) : [];
      const updated = [
        { date: todayStr, energyState: state, timestamp: new Date().toISOString() },
        ...parsed.filter((c: any) => c.date !== todayStr),
      ];
      localStorage.setItem('next_checkins_v1', JSON.stringify(updated));
    } catch {}
  };

  const handleSaveReflection = () => {
    const text = reflectionText.trim();
    if (!text) return;
    const todayStr = getLocalDateString();
    addJournalEntry({
      date: todayStr,
      prompt: 'Quiet Reflection',
      response: text,
    });
    setReflectionText('');
    setSaveToast(true);
    sounds.playStepComplete();
    setTimeout(() => setSaveToast(false), 4000);
  };

  return (
    <div className="max-w-xl mx-auto space-y-6 animate-fade-in pb-28 md:pb-12">
      {/* Header */}
      <Header
        title="Check In"
        subtitle="Notice how you are right now. No pressure, no obligations, no streaks."
      />

      {/* 1. Energy & Pace Section */}
      <section className="space-y-3">
        <div className="flex items-baseline justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-ink-muted dark:text-linen-subtle">
            Energy &amp; Pace
          </h2>
          <span className="text-xs text-amber-700 dark:text-amber-400 font-medium">
            {energyState === 'low' ? 'Gentle pace' : energyState === 'steady' ? 'Rhythmic flow' : 'Driven energy'}
          </span>
        </div>

        {/* 3 Ergonomic Chips */}
        <div className="grid grid-cols-3 gap-2.5">
          <button
            type="button"
            onClick={() => handleSelectEnergy('low')}
            className={`py-4 px-2 rounded-xl flex flex-col items-center justify-center gap-1.5 transition-all border ${
              energyState === 'low'
                ? 'bg-amber-500/15 text-amber-900 dark:text-amber-200 border-amber-500/40 shadow-sm'
                : 'bg-surface dark:bg-surface-dark border-stone-200/90 dark:border-white/[0.08] text-ink-muted dark:text-linen-subtle hover:text-ink-primary dark:hover:text-linen'
            }`}
          >
            <div className={`w-9 h-9 rounded-full flex items-center justify-center ${
              energyState === 'low' ? 'bg-amber-500 text-stone-950 font-bold' : 'bg-stone-100 dark:bg-white/[0.06]'
            }`}>
              <Moon className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold">Low</span>
            <span className="text-[10px] opacity-80">Gentle</span>
          </button>

          <button
            type="button"
            onClick={() => handleSelectEnergy('steady')}
            className={`py-4 px-2 rounded-xl flex flex-col items-center justify-center gap-1.5 transition-all border ${
              energyState === 'steady'
                ? 'bg-amber-500/15 text-amber-900 dark:text-amber-200 border-amber-500/40 shadow-sm'
                : 'bg-surface dark:bg-surface-dark border-stone-200/90 dark:border-white/[0.08] text-ink-muted dark:text-linen-subtle hover:text-ink-primary dark:hover:text-linen'
            }`}
          >
            <div className={`w-9 h-9 rounded-full flex items-center justify-center ${
              energyState === 'steady' ? 'bg-amber-500 text-stone-950 font-bold' : 'bg-stone-100 dark:bg-white/[0.06]'
            }`}>
              <Droplets className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold">Steady</span>
            <span className="text-[10px] opacity-80">Rhythmic</span>
          </button>

          <button
            type="button"
            onClick={() => handleSelectEnergy('energized')}
            className={`py-4 px-2 rounded-xl flex flex-col items-center justify-center gap-1.5 transition-all border ${
              energyState === 'energized'
                ? 'bg-amber-500/15 text-amber-900 dark:text-amber-200 border-amber-500/40 shadow-sm'
                : 'bg-surface dark:bg-surface-dark border-stone-200/90 dark:border-white/[0.08] text-ink-muted dark:text-linen-subtle hover:text-ink-primary dark:hover:text-linen'
            }`}
          >
            <div className={`w-9 h-9 rounded-full flex items-center justify-center ${
              energyState === 'energized' ? 'bg-amber-500 text-stone-950 font-bold' : 'bg-stone-100 dark:bg-white/[0.06]'
            }`}>
              <Zap className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold">Energized</span>
            <span className="text-[10px] opacity-80">Driven</span>
          </button>
        </div>
      </section>

      {/* 2. Quiet Reflection Section */}
      <section className="space-y-3">
        <div className="flex items-baseline justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-ink-muted dark:text-linen-subtle">
              Quiet Reflection
            </h2>
            <span className="text-[10px] text-ink-subtle dark:text-linen-faint px-2 py-0.5 rounded-full bg-stone-100 dark:bg-white/[0.06]">
              Optional
            </span>
          </div>
          <span className="text-xs text-ink-subtle dark:text-linen-faint">
            A sentence is plenty
          </span>
        </div>

        <div className="rounded-xl bg-surface dark:bg-surface-dark border border-stone-200/90 dark:border-white/[0.08] p-4 space-y-3 shadow-sm">
          <textarea
            value={reflectionText}
            onChange={(e) => setReflectionText(e.target.value)}
            placeholder="What feels easiest to let go of today? (A sentence or a few words is plenty...)"
            rows={3}
            className="w-full bg-transparent text-sm text-ink-primary dark:text-linen placeholder:text-ink-subtle dark:placeholder:text-linen-faint resize-none focus:outline-none"
          />

          <div className="flex items-center justify-between pt-2 border-t border-stone-100 dark:border-white/[0.05]">
            <div className="flex items-center gap-1.5 text-ink-subtle dark:text-linen-faint text-xs">
              <Lock className="w-3.5 h-3.5" />
              <span>Private record on device</span>
            </div>

            <button
              type="button"
              onClick={handleSaveReflection}
              disabled={!reflectionText.trim()}
              className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-stone-950 font-bold text-xs flex items-center gap-1.5 transition-all active:scale-95 shadow-sm"
            >
              <Check className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Save reflection</span>
            </button>
          </div>
        </div>

        {saveToast && (
          <p className="text-xs text-amber-700 dark:text-amber-400 font-medium flex items-center gap-1.5 px-1 animate-fade-in">
            <Check className="w-3.5 h-3.5" />
            <span>Saved to your personal reflections.</span>
          </p>
        )}
      </section>

      {/* 3. Wellbeing & Pacing Options */}
      <section className="space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-ink-muted dark:text-linen-subtle">
          Wellbeing &amp; Pacing
        </h2>

        <div className="space-y-3">
          {/* Taking the day off — Real working toggle */}
          <div className="rounded-xl bg-surface dark:bg-surface-dark border border-stone-200/90 dark:border-white/[0.08] p-4 flex items-center justify-between gap-3 shadow-sm">
            <div className="flex items-start gap-3 min-w-0 flex-1">
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-700 dark:text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                <PauseCircle className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-semibold text-ink-primary dark:text-linen">
                  Taking the day off
                </h3>
                <p className="text-xs text-ink-muted dark:text-linen-subtle leading-relaxed">
                  {notPlanningToday
                    ? 'Rest day is active today. Demands cleared, zero overdue tags.'
                    : 'Clear today\'s active task pressure for genuine rest.'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setNotPlanningToday(!notPlanningToday)}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold shrink-0 transition-all active:scale-95 ${
                notPlanningToday
                  ? 'bg-stone-100 dark:bg-white/[0.08] text-ink-primary dark:text-linen border border-stone-200 dark:border-white/[0.1]'
                  : 'bg-amber-500 hover:bg-amber-400 text-stone-950 shadow-sm'
              }`}
            >
              {notPlanningToday ? 'Resume planning' : 'Take day off'}
            </button>
          </div>

          {/* 7-Day Fresh Start */}
          <div className="rounded-xl bg-surface dark:bg-surface-dark border border-stone-200/90 dark:border-white/[0.08] p-4 flex items-center justify-between gap-3 shadow-sm">
            <div className="flex items-start gap-3 min-w-0 flex-1">
              <div className="w-10 h-10 rounded-lg bg-sky-500/10 text-sky-700 dark:text-sky-400 flex items-center justify-center shrink-0 mt-0.5">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-ink-primary dark:text-linen">
                    {activeReset ? activeReset.name : '7-Day Fresh Start'}
                  </h3>
                  {activeReset && (
                    <span className="text-[10px] font-bold text-amber-800 dark:text-amber-300 bg-amber-500/15 px-2 py-0.5 rounded-full">
                      Active
                    </span>
                  )}
                </div>
                <p className="text-xs text-ink-muted dark:text-linen-subtle leading-relaxed">
                  A low-pressure week of basic self-care and micro-momentum.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => openModal('fresh_start')}
              className="px-3.5 py-2 rounded-lg bg-stone-100 hover:bg-stone-200 dark:bg-white/[0.06] dark:hover:bg-white/[0.1] text-ink-primary dark:text-linen text-xs font-semibold shrink-0 transition-all border border-stone-200/60 dark:border-white/[0.04]"
            >
              {activeReset ? 'View reset' : 'Explore'}
            </button>
          </div>

          {/* Body & Energy Check */}
          <div className="rounded-xl bg-surface dark:bg-surface-dark border border-stone-200/90 dark:border-white/[0.08] p-4 flex items-center justify-between gap-3 shadow-sm">
            <div className="flex items-start gap-3 min-w-0 flex-1">
              <div className="w-10 h-10 rounded-lg bg-stone-100 dark:bg-white/[0.04] text-ink-secondary dark:text-linen-muted flex items-center justify-center shrink-0 mt-0.5">
                <Heart className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-semibold text-ink-primary dark:text-linen">
                  Body &amp; tension check
                </h3>
                <p className="text-xs text-ink-muted dark:text-linen-subtle leading-relaxed">
                  Screen for physical fatigue, hydration, and environmental friction.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => openModal('body_check')}
              className="px-3.5 py-2 rounded-lg bg-stone-100 hover:bg-stone-200 dark:bg-white/[0.06] dark:hover:bg-white/[0.1] text-ink-primary dark:text-linen text-xs font-semibold shrink-0 transition-all border border-stone-200/60 dark:border-white/[0.04]"
            >
              Check in
            </button>
          </div>
        </div>
      </section>

      {/* 4. Recent Reflections */}
      {journalEntries.length > 0 && (
        <section className="space-y-3 pt-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-ink-muted dark:text-linen-subtle">
            Recent Reflections
          </h2>

          <div className="space-y-2">
            {journalEntries.slice(0, 3).map((entry) => (
              <div
                key={entry.id}
                className="p-3.5 rounded-xl bg-surface dark:bg-surface-dark border border-stone-200/90 dark:border-white/[0.08] text-xs space-y-1 shadow-sm"
              >
                <div className="flex items-center justify-between text-ink-subtle dark:text-linen-faint text-[10px]">
                  <span>{entry.prompt}</span>
                  <span>{entry.date}</span>
                </div>
                <p className="text-ink-primary dark:text-linen leading-relaxed">
                  {entry.response}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
