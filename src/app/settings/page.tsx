'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import { 
  ChevronRight, 
  RotateCcw,
  Check,
  X
} from 'lucide-react';

export default function SettingsPage() {
  const { settings, updateSettings, resetToDemoData, resetToEmptyDay } = useApp();
  const [activeDialog, setActiveDialog] = useState<'theme' | 'difficulty' | 'data' | 'about' | 'reminders' | null>(null);
  const [confirmAction, setConfirmAction] = useState<'empty_day' | 'reset_demo' | null>(null);

  const themeLabel = {
    light: 'Light',
    dark: 'Dark',
    system: 'System',
  }[settings.theme || 'system'];

  const difficultyLabel = {
    gentle: 'Gentle',
    balanced: 'Balanced',
    structured: 'Structured',
  }[settings.startingDifficulty || 'gentle'];

  const handleCycleTheme = () => {
    const next = settings.theme === 'light' ? 'dark' : settings.theme === 'dark' ? 'system' : 'light';
    updateSettings({ theme: next });
  };

  const handleCycleDifficulty = () => {
    const next = settings.startingDifficulty === 'gentle' 
      ? 'balanced' 
      : settings.startingDifficulty === 'balanced' 
      ? 'structured' 
      : 'gentle';
    updateSettings({ startingDifficulty: next });
  };

  return (
    <div className="max-w-xl mx-auto space-y-7 animate-fade-in pb-16">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-[1.75rem] font-semibold tracking-tight text-ink-primary dark:text-slate-100">
          Settings
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-ink-muted dark:text-slate-400">
          How do I want Next to work?
        </p>
      </div>

      {/* APPEARANCE */}
      <section className="space-y-2">
        <h2 className="text-xs font-bold uppercase tracking-wider text-ink-muted dark:text-slate-400 px-1">
          Appearance
        </h2>
        <div className="border-t border-slate-200/80 dark:border-slate-800">
          <button
            type="button"
            onClick={handleCycleTheme}
            className="w-full flex items-center justify-between py-3.5 px-1 text-sm transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-800/30"
          >
            <span className="font-medium text-ink-primary dark:text-slate-100">Theme</span>
            <div className="flex items-center gap-1.5 text-ink-muted dark:text-slate-400">
              <span className="capitalize">{themeLabel}</span>
              <ChevronRight className="w-4 h-4 opacity-70" />
            </div>
          </button>
        </div>
      </section>

      {/* BEHAVIOR */}
      <section className="space-y-2">
        <h2 className="text-xs font-bold uppercase tracking-wider text-ink-muted dark:text-slate-400 px-1">
          Behavior
        </h2>
        <div className="border-t border-slate-200/80 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800/80">
          {/* Starting difficulty */}
          <button
            type="button"
            onClick={handleCycleDifficulty}
            className="w-full flex items-center justify-between py-3.5 px-1 text-sm transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-800/30"
          >
            <span className="font-medium text-ink-primary dark:text-slate-100">Starting difficulty</span>
            <div className="flex items-center gap-1.5 text-ink-muted dark:text-slate-400">
              <span>{difficultyLabel}</span>
              <ChevronRight className="w-4 h-4 opacity-70" />
            </div>
          </button>

          {/* Show extras toggle */}
          <div className="flex items-center justify-between py-3.5 px-1 text-sm">
            <div>
              <span className="font-medium text-ink-primary dark:text-slate-100 block">Show extras</span>
              <span className="text-xs text-ink-muted dark:text-slate-400">Reveal optional extra steps in tasks</span>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={settings.showExtras ?? false}
              onClick={() => updateSettings({ showExtras: !settings.showExtras })}
              className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                settings.showExtras ? 'bg-brand-600' : 'bg-slate-200 dark:bg-slate-700'
              }`}
            >
              <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                settings.showExtras ? 'translate-x-5' : 'translate-x-0'
              }`} />
            </button>
          </div>

          {/* Calm Sound chimes */}
          <div className="flex items-center justify-between py-3.5 px-1 text-sm">
            <div>
              <span className="font-medium text-ink-primary dark:text-slate-100 block">Calm sound chimes</span>
              <span className="text-xs text-ink-muted dark:text-slate-400">Subtle harmonic tone when finishing the minimum</span>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={settings.soundEnabled}
              onClick={() => updateSettings({ soundEnabled: !settings.soundEnabled })}
              className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                settings.soundEnabled ? 'bg-brand-600' : 'bg-slate-200 dark:bg-slate-700'
              }`}
            >
              <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                settings.soundEnabled ? 'translate-x-5' : 'translate-x-0'
              }`} />
            </button>
          </div>
        </div>
      </section>

      {/* NOTIFICATIONS */}
      <section className="space-y-2">
        <h2 className="text-xs font-bold uppercase tracking-wider text-ink-muted dark:text-slate-400 px-1">
          Notifications
        </h2>
        <div className="border-t border-slate-200/80 dark:border-slate-800">
          <button
            type="button"
            onClick={() => setActiveDialog('reminders')}
            className="w-full flex items-center justify-between py-3.5 px-1 text-sm transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-800/30"
          >
            <span className="font-medium text-ink-primary dark:text-slate-100">Reminders</span>
            <div className="flex items-center gap-1.5 text-ink-muted dark:text-slate-400">
              <span>Gentle prompts</span>
              <ChevronRight className="w-4 h-4 opacity-70" />
            </div>
          </button>
        </div>
      </section>

      {/* PRIVACY & DATA */}
      <section className="space-y-2">
        <h2 className="text-xs font-bold uppercase tracking-wider text-ink-muted dark:text-slate-400 px-1">
          Privacy & data
        </h2>
        <div className="border-t border-slate-200/80 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800/80">
          <button
            type="button"
            onClick={() => setActiveDialog('data')}
            className="w-full flex items-center justify-between py-3.5 px-1 text-sm transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-800/30"
          >
            <span className="font-medium text-ink-primary dark:text-slate-100">Your data</span>
            <div className="flex items-center gap-1.5 text-ink-muted dark:text-slate-400">
              <span>Local only</span>
              <ChevronRight className="w-4 h-4 opacity-70" />
            </div>
          </button>

          {/* Start with empty day */}
          {confirmAction === 'empty_day' ? (
            <div className="py-3.5 px-1 space-y-2 animate-fade-in">
              <p className="text-sm font-medium text-ink-primary dark:text-slate-100">Clear all tasks and start with an empty day?</p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => { resetToEmptyDay(); setConfirmAction(null); }}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm transition-all"
                >
                  Clear day
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmAction(null)}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 text-ink-secondary dark:text-slate-200 font-medium text-sm transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setConfirmAction('empty_day')}
              className="w-full flex items-center justify-between py-3.5 px-1 text-sm transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-800/30 text-left"
            >
              <span className="font-medium text-ink-primary dark:text-slate-100">Start with an empty day</span>
              <span className="text-xs text-ink-muted">Clear today</span>
            </button>
          )}

          {/* Reset to sample data */}
          {confirmAction === 'reset_demo' ? (
            <div className="py-3.5 px-1 space-y-2 animate-fade-in">
              <p className="text-sm font-medium text-ink-primary dark:text-slate-100">Reset all tasks and routines to original sample data?</p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => { resetToDemoData(); setConfirmAction(null); }}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm transition-all"
                >
                  Reset
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmAction(null)}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 text-ink-secondary dark:text-slate-200 font-medium text-sm transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setConfirmAction('reset_demo')}
              className="w-full flex items-center justify-between py-3.5 px-1 text-sm transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-800/30 text-left"
            >
              <span className="font-medium text-ink-primary dark:text-slate-100">Reset to sample data</span>
              <RotateCcw className="w-4 h-4 text-ink-muted" />
            </button>
          )}
        </div>
      </section>

      {/* ABOUT */}
      <section className="space-y-2">
        <h2 className="text-xs font-bold uppercase tracking-wider text-ink-muted dark:text-slate-400 px-1">
          About
        </h2>
        <div className="border-t border-slate-200/80 dark:border-slate-800">
          <button
            type="button"
            onClick={() => setActiveDialog('about')}
            className="w-full flex items-center justify-between py-3.5 px-1 text-sm transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-800/30"
          >
            <span className="font-medium text-ink-primary dark:text-slate-100">About Next</span>
            <div className="flex items-center gap-1.5 text-ink-muted dark:text-slate-400">
              <span>v1.1</span>
              <ChevronRight className="w-4 h-4 opacity-70" />
            </div>
          </button>
        </div>
      </section>

      {/* Modals / Sheets for native options */}

      {/* Reminders dialog */}
      {activeDialog === 'reminders' && (
        <div 
          className="fixed inset-0 z-50 flex items-end justify-center pb-[env(safe-area-inset-bottom,0px)] sm:items-center sm:p-4 bg-slate-900/40 dark:bg-slate-950/70 animate-fade-in"
          onClick={() => setActiveDialog(null)}
        >
          <div
            className="modal-sheet relative w-full sm:max-w-md bg-surface dark:bg-surface-dark border-t sm:border border-slate-200/90 dark:border-slate-800 sm:rounded-3xl rounded-t-3xl shadow-2xl p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-lg font-bold text-ink-primary dark:text-slate-100">Reminders</h3>
              <button onClick={() => setActiveDialog(null)} className="p-1 rounded-xl text-ink-muted">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-ink-secondary dark:text-slate-300 leading-relaxed">
              Next does not send aggressive push notifications or streak alarms. You will only receive subtle cues when you choose to use the timer or routine runner.
            </p>
          </div>
        </div>
      )}

      {/* Data dialog */}
      {activeDialog === 'data' && (
        <div 
          className="fixed inset-0 z-50 flex items-end justify-center pb-[env(safe-area-inset-bottom,0px)] sm:items-center sm:p-4 bg-slate-900/40 dark:bg-slate-950/70 animate-fade-in"
          onClick={() => setActiveDialog(null)}
        >
          <div
            className="modal-sheet relative w-full sm:max-w-md bg-surface dark:bg-surface-dark border-t sm:border border-slate-200/90 dark:border-slate-800 sm:rounded-3xl rounded-t-3xl shadow-2xl p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-lg font-bold text-ink-primary dark:text-slate-100">Your Data</h3>
              <button onClick={() => setActiveDialog(null)} className="p-1 rounded-xl text-ink-muted">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-ink-secondary dark:text-slate-300 leading-relaxed">
              Your tasks, routines, journal reflections, and check-ins are stored 100% locally on this device using web storage. No accounts required, and nothing is shared with external tracking services.
            </p>
          </div>
        </div>
      )}

      {/* About dialog */}
      {activeDialog === 'about' && (
        <div 
          className="fixed inset-0 z-50 flex items-end justify-center pb-[env(safe-area-inset-bottom,0px)] sm:items-center sm:p-4 bg-slate-900/40 dark:bg-slate-950/70 animate-fade-in"
          onClick={() => setActiveDialog(null)}
        >
          <div
            className="modal-sheet relative w-full sm:max-w-md bg-surface dark:bg-surface-dark border-t sm:border border-slate-200/90 dark:border-slate-800 sm:rounded-3xl rounded-t-3xl shadow-2xl p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-brand-600 text-white font-bold flex items-center justify-center text-xs">
                  N
                </div>
                <h3 className="text-lg font-bold text-ink-primary dark:text-slate-100">About Next</h3>
              </div>
              <button onClick={() => setActiveDialog(null)} className="p-1 rounded-xl text-ink-muted">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm font-semibold text-ink-primary dark:text-slate-100">
              Next. Not everything.
            </p>
            <p className="text-xs sm:text-sm text-ink-muted dark:text-slate-400 leading-relaxed">
              Built for task initiation, overwhelm reduction, routines, self-care, and guilt-free returns after falling off.
            </p>
            <div className="space-y-1 text-xs text-ink-secondary dark:text-slate-300 pt-1">
              <p>• The minimum counts.</p>
              <p>• You don&apos;t have to catch up.</p>
              <p>• Returning matters more than streaks.</p>
              <p>• Take care of yourself before trying to optimize yourself.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
