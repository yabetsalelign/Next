'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import { X, HeartHandshake, Check } from 'lucide-react';

export function BodyEnvCheckModal() {
  const { closeModal } = useApp();
  const [energy, setEnergy] = useState<number>(3);
  const [bodyState, setBodyState] = useState<string>('okay');
  const [environment, setEnvironment] = useState<string>('alone');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => {
      closeModal();
    }, 600);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 dark:bg-slate-950/70 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="checkin-modal-title"
    >
      <div className="relative w-full max-w-md bg-surface dark:bg-surface-dark border border-slate-200/90 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden animate-fade-in">
        
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
        <div className="p-6 sm:p-7 space-y-6">
          <div>
            <h3 id="checkin-modal-title" className="text-xl font-bold tracking-tight text-ink-primary dark:text-slate-100">
              How are you right now?
            </h3>
            <p className="text-xs sm:text-sm text-ink-muted dark:text-slate-400 mt-1">
              Checking in helps calibrate your pace. Feel free to skip anytime.
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
              {[
                { id: 'okay', label: '🙂 Okay' },
                { id: 'tense', label: '😐 Tense' },
                { id: 'overwhelmed', label: '😣 Overwhelmed' },
                { id: 'uncomfortable', label: '🤢 Physically bad' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setBodyState(item.id)}
                  className={`p-3 rounded-xl text-xs sm:text-sm font-medium border text-left transition-all ${
                    bodyState === item.id
                      ? 'bg-brand-50/80 dark:bg-brand-950/50 border-brand-300 dark:border-brand-700 text-brand-900 dark:text-brand-200 font-semibold'
                      : 'border-slate-200/80 dark:border-slate-800 text-ink-secondary dark:text-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
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
                      : 'border-slate-200/80 dark:border-slate-800 text-ink-secondary dark:text-slate-300 hover:bg-slate-50'
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
