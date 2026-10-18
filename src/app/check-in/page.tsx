'use client';

import { SymbolIcon } from '@/components/ui/SymbolIcon';
import React, { useState, useEffect } from 'react';
import { useApp } from '@/lib/store';
import { Header } from '@/components/layout/Header';
import { getLocalDateString } from '@/lib/dateUtils';
import { sounds } from '@/lib/sounds';

export default function CheckInPage() {
  const { openModal, setNotPlanningToday, journalEntries, addJournalEntry } = useApp();
  const [energyState, setEnergyState] = useState<'low' | 'steady' | 'energized' | null>(null);
  const [reflectionText, setReflectionText] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

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

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSelectEnergy = (state: 'low' | 'steady' | 'energized') => {
    setEnergyState(state);
    sounds.playTap();
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
    if (!text) {
      triggerToast('Write a thought or a word to record');
      return;
    }
    const todayStr = getLocalDateString();
    addJournalEntry({
      date: todayStr,
      prompt: 'What feels easiest to let go of today?',
      response: text,
    });
    setReflectionText('');
    sounds.playStepComplete();
    triggerToast('Reflection quietly saved');
  };

  const handleTakeDayOff = () => {
    setNotPlanningToday(true);
    triggerToast('Rest day recorded. Rest well.');
  };

  const paceLabel = !energyState ? 'Choose what feels right' :
    energyState === 'low'
      ? 'Gentle restoration'
      : energyState === 'steady'
      ? 'Rhythmic flow'
      : 'Driven momentum';

  return (
    <div className="min-h-screen bg-background text-on-surface font-body-md text-body-md flex flex-col selection:bg-primary-container selection:text-on-primary-container">
      {/* Header */}
      <Header />

      <main className="flex flex-col relative w-full pt-[calc(4rem+var(--sat))] pb-36 px-gutter-mobile bg-background flex-1 max-w-xl mx-auto">
        <div className="flex flex-col w-full pb-8 space-y-6 select-none">
          {/* Ambient Intro Note */}
          <div className="flex flex-col px-1 pt-1">
            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
              Notice how you are right now. No pressure, no obligations, no streaks.
            </p>
          </div>

          {/* SECTION 1: Energy & Pace */}
          <section className="flex flex-col space-y-3">
            <div className="flex items-center justify-between px-1">
              <span className="font-label-sm text-label-sm tracking-wider uppercase text-on-surface-variant">
                Energy &amp; Pace
              </span>
              <span className="font-label-sm text-label-sm text-primary-container font-semibold transition-all">
                {paceLabel}
              </span>
            </div>

            {/* 3-Choice Energy Selector Grid */}
            <div className="grid grid-cols-3 gap-2.5" role="radiogroup">
              {/* Option 1: Low */}
              <button
                type="button"
                onClick={() => handleSelectEnergy('low')}
                className={`energy-card group relative flex flex-col items-center justify-center p-3.5 rounded-2xl transition-all duration-200 active:scale-95 text-center min-h-[110px] border ${
                  energyState === 'low'
                    ? 'bg-surface-container-high shadow-[0_0_24px_-6px_rgba(255,185,99,0.22)] border-primary-container/40'
                    : 'bg-surface-container-low hover:bg-surface-container border-surface-container-high/30'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-colors ${
                    energyState === 'low'
                      ? 'bg-primary-container text-on-primary-container shadow-sm'
                      : 'bg-surface-container-high text-on-surface-variant group-hover:text-on-surface'
                  }`}
                >
                  <SymbolIcon name="dark_mode" className="text-[20px]" />
                </div>
                <span
                  className={`font-label-lg text-label-lg leading-none mb-1 ${
                    energyState === 'low' ? 'text-primary font-semibold' : 'text-on-surface font-medium'
                  }`}
                >
                  Low
                </span>
                <span className="font-label-sm text-label-sm text-on-surface-variant">Gentle</span>
              </button>

              {/* Option 2: Steady */}
              <button
                type="button"
                onClick={() => handleSelectEnergy('steady')}
                className={`energy-card group relative flex flex-col items-center justify-center p-3.5 rounded-2xl transition-all duration-200 active:scale-95 text-center min-h-[110px] border ${
                  energyState === 'steady'
                    ? 'bg-surface-container-high shadow-[0_0_24px_-6px_rgba(255,185,99,0.22)] border-primary-container/40'
                    : 'bg-surface-container-low hover:bg-surface-container border-surface-container-high/30'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 shadow-sm transition-colors ${
                    energyState === 'steady'
                      ? 'bg-primary-container text-on-primary-container'
                      : 'bg-surface-container-high text-on-surface-variant group-hover:text-on-surface'
                  }`}
                >
                  <SymbolIcon name="all_inclusive" className="text-[20px]" />
                </div>
                <span
                  className={`font-label-lg text-label-lg leading-none mb-1 ${
                    energyState === 'steady' ? 'text-primary font-semibold' : 'text-on-surface font-medium'
                  }`}
                >
                  Steady
                </span>
                <span className="font-label-sm text-label-sm text-on-surface-variant">Rhythmic</span>
              </button>

              {/* Option 3: Energized */}
              <button
                type="button"
                onClick={() => handleSelectEnergy('energized')}
                className={`energy-card group relative flex flex-col items-center justify-center p-3.5 rounded-2xl transition-all duration-200 active:scale-95 text-center min-h-[110px] border ${
                  energyState === 'energized'
                    ? 'bg-surface-container-high shadow-[0_0_24px_-6px_rgba(255,185,99,0.22)] border-primary-container/40'
                    : 'bg-surface-container-low hover:bg-surface-container border-surface-container-high/30'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-colors ${
                    energyState === 'energized'
                      ? 'bg-primary-container text-on-primary-container shadow-sm'
                      : 'bg-surface-container-high text-on-surface-variant group-hover:text-on-surface'
                  }`}
                >
                  <SymbolIcon name="bolt" className="text-[20px]" />
                </div>
                <span
                  className={`font-label-lg text-label-lg leading-none mb-1 ${
                    energyState === 'energized' ? 'text-primary font-semibold' : 'text-on-surface font-medium'
                  }`}
                >
                  Energized
                </span>
                <span className="font-label-sm text-label-sm text-on-surface-variant">Driven</span>
              </button>
            </div>
          </section>

          {/* SECTION 2: Quiet Reflection */}
          <section className="flex flex-col space-y-3">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <span className="font-label-sm text-label-sm tracking-wider uppercase text-on-surface-variant">
                  Quiet Reflection
                </span>
                <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm">
                  Optional
                </span>
              </div>
              <span className="font-label-sm text-label-sm text-on-surface-variant">A sentence is plenty</span>
            </div>

            <div className="bg-surface-container-low rounded-2xl p-4 flex flex-col space-y-4 shadow-sm border border-surface-container-high/30">
              <div className="relative">
                <textarea
                  id="reflection-input"
                  rows={3}
                  value={reflectionText}
                  onChange={(e) => setReflectionText(e.target.value)}
                  placeholder="What feels easiest to let go of today? (A sentence or a few words is plenty...)"
                  className="w-full bg-surface-container-lowest text-on-surface placeholder:text-on-surface-variant font-body-md text-body-md rounded-xl p-3.5 focus:outline-none focus:ring-1 focus:ring-primary-container transition-colors resize-none leading-relaxed border border-surface-container-high/40"
                ></textarea>
              </div>
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-1.5 text-on-surface-variant">
                  <SymbolIcon name="lock" className="text-[16px]" />
                  <span className="font-label-sm text-label-sm">Private record on device</span>
                </div>
                <button
                  type="button"
                  onClick={handleSaveReflection}
                  className="px-4 py-2 rounded-full bg-primary-container text-on-primary-container font-label-lg text-label-lg font-semibold flex items-center gap-1.5 active:scale-95 transition-all shadow-[0_4px_16px_rgba(255,185,99,0.2)] hover:bg-primary-fixed"
                >
                  <SymbolIcon name="check" className="text-[16px]" />
                  <span>Save reflection</span>
                </button>
              </div>
            </div>
          </section>

          {/* SECTION 3: Wellbeing & Pacing Action Cards */}
          <section className="flex flex-col space-y-3">
            <div className="flex items-center justify-between px-1">
              <span className="font-label-sm text-label-sm tracking-wider uppercase text-on-surface-variant">
                Wellbeing &amp; Pacing
              </span>
            </div>

            <div className="flex flex-col space-y-2.5">
              {/* Card 1: Taking the day off */}
              <div className="bg-surface-container-low rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm hover:bg-surface-container transition-colors border border-surface-container-high/30">
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-surface-container-high flex items-center justify-center flex-shrink-0 text-primary-container">
                    <SymbolIcon name="pause_circle" className="text-[20px]" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-label-lg text-label-lg text-on-surface font-semibold break-words">
                      Taking the day off
                    </span>
                    <p className="font-body-sm text-body-sm text-on-surface-variant break-words">
                      Clear today&apos;s active task pressure for genuine rest.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleTakeDayOff}
                  className="min-h-11 self-start sm:self-auto flex-shrink-0 px-3.5 py-2 rounded-xl bg-primary-container text-on-primary-container font-label-md text-label-md font-semibold hover:bg-primary-fixed transition-all active:scale-95 shadow-sm"
                >
                  Take day off
                </button>
              </div>

              {/* Card 2: 7-Day Fresh Start */}
              <div className="bg-surface-container-low rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm hover:bg-surface-container transition-colors border border-surface-container-high/30">
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-surface-container-high flex items-center justify-center flex-shrink-0 text-tertiary">
                    <SymbolIcon name="auto_awesome" className="text-[20px]" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-label-lg text-label-lg text-on-surface font-semibold break-words">
                      7-Day Fresh Start
                    </span>
                    <p className="font-body-sm text-body-sm text-on-surface-variant break-words">
                      A low-pressure week of basic self-care and micro-momentum.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => openModal('fresh_start')}
                  className="min-h-11 self-start sm:self-auto flex-shrink-0 px-4 py-2 rounded-xl bg-surface-container-high text-on-surface font-label-md text-label-md font-medium hover:bg-surface-container-highest transition-all active:scale-95"
                >
                  Explore
                </button>
              </div>

              {/* Card 3: Body & tension check */}
              <div className="bg-surface-container-low rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm hover:bg-surface-container transition-colors border border-surface-container-high/30">
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-surface-container-high flex items-center justify-center flex-shrink-0 text-secondary">
                    <SymbolIcon name="favorite" className="text-[20px]" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-label-lg text-label-lg text-on-surface font-semibold break-words">
                      Body &amp; tension check
                    </span>
                    <p className="font-body-sm text-body-sm text-on-surface-variant break-words">
                      Screen for physical fatigue, hydration, and friction.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => openModal('body_check')}
                  className="min-h-11 self-start sm:self-auto flex-shrink-0 px-4 py-2 rounded-xl bg-surface-container-high text-on-surface font-label-md text-label-md font-medium hover:bg-surface-container-highest transition-all active:scale-95"
                >
                  Check in
                </button>
              </div>
            </div>
          </section>

          {/* SECTION 4: Recent Reflections */}
          <section className="flex flex-col space-y-3">
            <div className="flex items-center justify-between px-1">
              <span className="font-label-sm text-label-sm tracking-wider uppercase text-on-surface-variant">
                Recent Reflections
              </span>
            </div>

            <div className="flex flex-col space-y-2">
              {journalEntries.length === 0 ? (
                <div className="bg-surface-container-low rounded-2xl p-4 text-center border border-surface-container-high/30">
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    No reflections recorded yet. Write a few words above when you feel like it.
                  </p>
                </div>
              ) : (
                journalEntries.slice(0, 5).map((entry) => (
                  <div
                    key={entry.id}
                    className="bg-surface-container-low rounded-2xl p-4 flex flex-col space-y-1.5 shadow-sm border border-surface-container-high/30"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-label-md text-label-md text-on-surface-variant">
                        {entry.prompt || 'How does my body feel today?'}
                      </span>
                      <span className="font-label-sm text-label-sm text-on-surface-variant">
                        {entry.date}
                      </span>
                    </div>
                    <p className="font-body-md text-body-md text-on-surface font-normal">
                      {entry.response}
                    </p>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      </main>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-surface-container-highest text-primary font-label-md text-label-md shadow-xl transition-all duration-300 animate-fade-in border border-primary-container/30">
          {toastMessage}
        </div>
      )}
    </div>
  );
}
