'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import { BodyState, HydrationLevel } from '@/types';
import { X, HeartHandshake, Check } from 'lucide-react';

const BODY_STATES: { id: BodyState; label: string }[] = [
  { id: 'comfortable', label: '🙂 Comfortable' },
  { id: 'tired', label: '😴 Tired' },
  { id: 'stressed', label: '😣 Stressed' },
  { id: 'dehydrated', label: '💧 Dehydrated' },
  { id: 'heavy', label: '😶 Heavy / Flat' },
  { id: 'energized', label: '✨ Energized' },
];

const HYDRATION_LEVELS: { id: HydrationLevel; label: string }[] = [
  { id: 'low', label: '🔴 Low' },
  { id: 'okay', label: '🟡 Okay' },
  { id: 'good', label: '🟢 Good' },
];

const BODY_STATE_TIPS: Partial<Record<BodyState, string>> = {
  tired: 'Start small. Even the minimum counts.',
  stressed: 'Pick one Must. Set a 5-minute timer. That\'s enough.',
  dehydrated: 'Drink some water before anything else.',
  heavy: 'Be gentle with yourself. Rest is valid.',
  comfortable: 'Nice. Use that ease — even a small task counts.',
  energized: 'You have energy. Use it gently, not all at once.',
};

export function BodyEnvCheckModal() {
  const { closeModal } = useApp();
  const [energy, setEnergy] = useState<number>(3);
  const [bodyState, setBodyState] = useState<BodyState>('comfortable');
  const [hydration, setHydration] = useState<HydrationLevel>('okay');
  const [environment, setEnvironment] = useState<string>('alone');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    // Store check-in in localStorage directly (keeps store lean)
    try {
      const entry = {
        date: new Date().toISOString().split('T')[0],
        energy,
        bodyState,
        hydration,
        environment,
        completedAt: new Date().toISOString(),
      };
      const existing = JSON.parse(localStorage.getItem('next_checkins_v1') || '[]');
      localStorage.setItem('next_checkins_v1', JSON.stringify([entry, ...existing].slice(0, 30)));
    } catch {}
    setSaved(true);
    setTimeout(() => {
      closeModal();
    }, 600);
  };

  const tip = BODY_STATE_TIPS[bodyState];

  return (
    <div 
      className="fixed inset-0 z-50 flex items-end justify-center pb-[env(safe-area-inset-bottom,0px)] sm:items-center sm:p-4 bg-slate-900/40 dark:bg-slate-950/70"
      role="dialog"
      aria-modal="true"
      aria-labelledby="checkin-modal-title"
      onClick={closeModal}
    >
      <div
        className="modal-sheet relative w-full sm:max-w-md bg-surface dark:bg-surface-dark border-t sm:border border-slate-200/90 dark:border-slate-800 sm:rounded-3xl rounded-t-3xl shadow-2xl overflow-y-auto animate-slide-up flex flex-col"
        style={{ maxHeight: 'calc(100dvh - env(safe-area-inset-top, 0px) - env(safe-area-inset-bottom, 0px) - 0.5rem)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag handle (mobile) */}
        <div className="sm:hidden flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-slate-300 dark:bg-slate-600" />
        </div>
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <HeartHandshake className="w-4 h-4 text-brand-600 dark:text-brand-400" />
            <p className="text-xs font-bold uppercase tracking-wider text-ink-muted dark:text-slate-400">
              Check-In • Totally Optional
            </p>
          </div>
          <button
            onClick={closeModal}
            aria-label="Skip and Close"
            className="p-1.5 rounded-xl text-ink-muted hover:text-ink-primary dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 sm:p-7 space-y-5 max-h-[80vh] overflow-y-auto">
          <div>
            <h3 id="checkin-modal-title" className="text-xl font-bold tracking-tight text-ink-primary dark:text-slate-100">
              How are you right now?
            </h3>
            <p className="text-xs sm:text-sm text-ink-muted dark:text-slate-400 mt-1">
              Just noticing, not judging. Skip anytime.
            </p>
          </div>

          {/* Energy 1-5 */}
          <div className="space-y-2.5">
            <div className="flex justify-between items-center text-xs font-semibold uppercase tracking-wider text-ink-secondary dark:text-slate-300">
              <span>Energy</span>
              <span className="text-brand-600 dark:text-brand-400 font-bold">{energy} of 5</span>
            </div>
            <div className="flex items-center justify-between gap-2 bg-slate-50 dark:bg-slate-900/60 p-3 rounded-2xl border border-slate-200/70 dark:border-slate-800">
              {[1, 2, 3, 4, 5].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setEnergy(val)}
                  className={`w-10 h-10 rounded-xl font-semibold text-sm transition-all ${
                    energy === val
                      ? 'bg-brand-600 text-white shadow-sm scale-105'
                      : 'text-ink-muted hover:bg-slate-200 dark:hover:bg-slate-800'
                  }`}
                >
                  {val}
                </button>
              ))}
            </div>
          </div>

          {/* Body feeling */}
          <div className="space-y-2.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-ink-secondary dark:text-slate-300">
              Body
            </span>
            <div className="grid grid-cols-2 gap-2">
              {BODY_STATES.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setBodyState(item.id)}
                  className={`p-3 rounded-xl text-xs sm:text-sm font-medium border text-left transition-all ${
                    bodyState === item.id
                      ? 'bg-brand-50/80 dark:bg-brand-950/50 border-brand-300 dark:border-brand-700 text-brand-900 dark:text-brand-200 font-semibold'
                      : 'border-slate-200/80 dark:border-slate-800 text-ink-secondary dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
            {tip && (
              <p className="text-xs text-brand-700 dark:text-brand-300 bg-brand-50/60 dark:bg-brand-950/30 border border-brand-100/60 dark:border-brand-900/40 rounded-xl px-3 py-2 leading-relaxed">
                {tip}
              </p>
            )}
          </div>

          {/* Hydration */}
          <div className="space-y-2.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-ink-secondary dark:text-slate-300">
              Hydration
            </span>
            <div className="grid grid-cols-3 gap-2">
              {HYDRATION_LEVELS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setHydration(item.id)}
                  className={`p-3 rounded-xl text-xs font-medium border text-center transition-all ${
                    hydration === item.id
                      ? 'bg-brand-50/80 dark:bg-brand-950/50 border-brand-300 dark:border-brand-700 text-brand-900 dark:text-brand-200 font-semibold'
                      : 'border-slate-200/80 dark:border-slate-800 text-ink-secondary dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
            {hydration === 'low' && (
              <p className="text-xs text-amber-700 dark:text-amber-300 bg-amber-50/60 dark:bg-amber-950/30 border border-amber-100/60 dark:border-amber-900/40 rounded-xl px-3 py-2">
                💧 Drink some water before anything else.
              </p>
            )}
          </div>

          {/* Environment */}
          <div className="space-y-2.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-ink-secondary dark:text-slate-300">
              Environment
            </span>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'alone', label: '👤 Alone' },
                { id: 'someone_nearby', label: '👥 Someone nearby' },
                { id: 'observed', label: '👀 Being watched' },
                { id: 'noisy', label: '🔊 Noisy / busy' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setEnvironment(item.id)}
                  className={`p-3 rounded-xl text-xs sm:text-sm font-medium border text-left transition-all ${
                    environment === item.id
                      ? 'bg-brand-50/80 dark:bg-brand-950/50 border-brand-300 dark:border-brand-700 text-brand-900 dark:text-brand-200 font-semibold'
                      : 'border-slate-200/80 dark:border-slate-800 text-ink-secondary dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={closeModal}
              className="flex-1 py-3 px-4 rounded-2xl border border-slate-200 dark:border-slate-700 text-ink-muted hover:text-ink-primary font-medium text-xs sm:text-sm transition-colors text-center"
            >
              SKIP
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="flex-1 flex items-center justify-center gap-1.5 py-3 px-4 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-medium text-xs sm:text-sm shadow-sm transition-all"
            >
              {saved ? <Check className="w-4 h-4" /> : null}
              <span>{saved ? 'Recorded' : 'DONE'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
