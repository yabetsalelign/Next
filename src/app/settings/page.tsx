'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/lib/store';
import { Header } from '@/components/layout/Header';
import { getLocalDateString } from '@/lib/dateUtils';
import {
  ChevronRight,
  RotateCcw,
  Volume2,
  BellOff,
  Download,
  Upload,
  Trash2,
  Info,
  Check,
  X
} from 'lucide-react';

export default function SettingsPage() {
  const { settings, updateSettings, resetToDemoData, resetToEmptyDay } = useApp();
  const [confirmModal, setConfirmModal] = useState<'empty_day' | 'reset_demo' | null>(null);
  const [showDataSection, setShowDataSection] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  // Close modals with Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setConfirmModal(null);
      }
    };
    if (confirmModal) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [confirmModal]);

  const themeLabel = {
    light: 'Light',
    dark: 'Dark',
    system: 'System',
  }[settings.theme || 'dark'];

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

  const handleExportData = () => {
    try {
      const todayStr = getLocalDateString();
      const backupData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        tasks: JSON.parse(localStorage.getItem('next_tasks_v1') || '[]'),
        routines: JSON.parse(localStorage.getItem('next_routines_v1') || '[]'),
        returns: JSON.parse(localStorage.getItem('next_returns_v1') || '[]'),
        insights: JSON.parse(localStorage.getItem('next_insights_v1') || '[]'),
        settings: JSON.parse(localStorage.getItem('next_settings_v1') || '{}'),
        resets: JSON.parse(localStorage.getItem('next_resets_v1') || '[]'),
        journal: JSON.parse(localStorage.getItem('next_journal_v1') || '[]'),
        checkins: JSON.parse(localStorage.getItem('next_checkins_v1') || '[]'),
        lastActiveDate: localStorage.getItem('next_last_active_date_v1') || todayStr,
      };
      const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `next-backup-${todayStr}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error('Export failed', e);
    }
  };

  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const raw = event.target?.result as string;
        const data = JSON.parse(raw);

        // Validate structure before committing to state
        if (!data || typeof data !== 'object' || Array.isArray(data)) {
          throw new Error('Root must be an object');
        }

        // Must have at least tasks, routines, or settings to be a valid backup
        if (!data.tasks && !data.routines && !data.settings && !data.version) {
          throw new Error('Missing backup identifiers');
        }

        if (data.tasks !== undefined && !Array.isArray(data.tasks)) {
          throw new Error('Tasks must be an array');
        }
        if (data.routines !== undefined && !Array.isArray(data.routines)) {
          throw new Error('Routines must be an array');
        }
        if (data.settings !== undefined && (typeof data.settings !== 'object' || Array.isArray(data.settings))) {
          throw new Error('Settings must be an object');
        }

        // Apply validated backup safely
        if (data.tasks) localStorage.setItem('next_tasks_v1', JSON.stringify(data.tasks));
        if (data.routines) localStorage.setItem('next_routines_v1', JSON.stringify(data.routines));
        if (data.returns) localStorage.setItem('next_returns_v1', JSON.stringify(data.returns));
        if (data.insights) localStorage.setItem('next_insights_v1', JSON.stringify(data.insights));
        if (data.settings) localStorage.setItem('next_settings_v1', JSON.stringify(data.settings));
        if (data.resets) localStorage.setItem('next_resets_v1', JSON.stringify(data.resets));
        if (data.journal) localStorage.setItem('next_journal_v1', JSON.stringify(data.journal));
        if (data.checkins) localStorage.setItem('next_checkins_v1', JSON.stringify(data.checkins));
        if (data.lastActiveDate) localStorage.setItem('next_last_active_date_v1', String(data.lastActiveDate));

        setImportStatus('Backup restored successfully. Reloading...');
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } catch (err) {
        setImportStatus('Failed to restore: This file is not a valid Next backup.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="max-w-xl mx-auto space-y-7 animate-fade-in pb-28 md:pb-10">
      {/* Header */}
      <Header
        title="Settings"
        subtitle="Personalize your experience. Changes apply immediately."
        showSettings={false}
      />

      {/* APPEARANCE */}
      <section className="space-y-2">
        <h2 className="text-xs font-bold uppercase tracking-wider text-ink-muted dark:text-slate-400 px-1">
          Appearance
        </h2>
        <div className="rounded-3xl bg-surface dark:bg-surface-dark border border-slate-200/90 dark:border-slate-800 shadow-sm overflow-hidden">
          <button
            type="button"
            onClick={handleCycleTheme}
            className="w-full flex items-center justify-between p-4 sm:p-5 text-sm transition-colors hover:bg-slate-50/70 dark:hover:bg-slate-800/40"
          >
            <div>
              <span className="font-semibold text-ink-primary dark:text-slate-100 block">Theme</span>
              <span className="text-xs text-ink-muted dark:text-slate-400 mt-0.5 block">
                Automatic system detection or fixed light/dark mode
              </span>
            </div>
            <div className="flex items-center gap-2 text-ink-muted dark:text-slate-300 font-medium shrink-0">
              <span className="px-2.5 py-1 rounded-xl bg-stone-100 dark:bg-slate-800 text-xs">
                {themeLabel}
              </span>
              <ChevronRight className="w-4 h-4 opacity-70" />
            </div>
          </button>
        </div>
      </section>

      {/* BEHAVIOR & PACING */}
      <section className="space-y-2">
        <h2 className="text-xs font-bold uppercase tracking-wider text-ink-muted dark:text-slate-400 px-1">
          Behavior &amp; Pacing
        </h2>
        <div className="rounded-3xl bg-surface dark:bg-surface-dark border border-slate-200/90 dark:border-slate-800 shadow-sm divide-y divide-slate-100 dark:divide-slate-800/80 overflow-hidden">
          {/* Starting difficulty */}
          <button
            type="button"
            onClick={handleCycleDifficulty}
            className="w-full flex items-center justify-between p-4 sm:p-5 text-sm transition-colors hover:bg-slate-50/70 dark:hover:bg-slate-800/40 text-left"
          >
            <div>
              <span className="font-semibold text-ink-primary dark:text-slate-100 block">Starting difficulty</span>
              <span className="text-xs text-ink-muted dark:text-slate-400 mt-0.5 block">
                Default scope when breaking tasks down
              </span>
            </div>
            <div className="flex items-center gap-2 text-ink-muted dark:text-slate-300 font-medium shrink-0">
              <span className="px-2.5 py-1 rounded-xl bg-stone-100 dark:bg-slate-800 text-xs">
                {difficultyLabel}
              </span>
              <ChevronRight className="w-4 h-4 opacity-70" />
            </div>
          </button>

          {/* Show extras toggle */}
          <div className="flex items-center justify-between p-4 sm:p-5 text-sm gap-4">
            <div className="flex-1 min-w-0">
              <span className="font-semibold text-ink-primary dark:text-slate-100 block">Show extras</span>
              <span className="text-xs text-ink-muted dark:text-slate-400 mt-0.5 block">
                Reveal optional extra steps in tasks when you have surplus energy
              </span>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={settings.showExtras ?? false}
              onClick={() => updateSettings({ showExtras: !settings.showExtras })}
              className={`w-12 h-7 rounded-full transition-colors relative p-0.5 shrink-0 ${
                settings.showExtras ? 'bg-amber-500' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full bg-white transition-transform shadow-sm ${
                  settings.showExtras ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </section>

      {/* AUDIO FEEDBACK */}
      <section className="space-y-2">
        <h2 className="text-xs font-bold uppercase tracking-wider text-ink-muted dark:text-slate-400 px-1">
          Audio Feedback
        </h2>
        <div className="rounded-3xl bg-surface dark:bg-surface-dark border border-slate-200/90 dark:border-slate-800 shadow-sm p-4 sm:p-5">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                <span className="font-semibold text-ink-primary dark:text-slate-100 block">
                  Completion audio chime
                </span>
              </div>
              <span className="text-xs text-ink-muted dark:text-slate-400 mt-1 block">
                Plays a gentle harmonic tone when completing a task, step, or minimum.
              </span>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={settings.soundEnabled}
              onClick={() => updateSettings({ soundEnabled: !settings.soundEnabled })}
              className={`w-12 h-7 rounded-full transition-colors relative p-0.5 shrink-0 ${
                settings.soundEnabled ? 'bg-amber-500' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full bg-white transition-transform shadow-sm ${
                  settings.soundEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </section>

      {/* NOTIFICATIONS & REMINDERS (HONEST & PRACTICAL) */}
      <section className="space-y-2">
        <h2 className="text-xs font-bold uppercase tracking-wider text-ink-muted dark:text-slate-400 px-1">
          Reminders &amp; Alerts
        </h2>
        <div className="rounded-3xl bg-surface dark:bg-surface-dark border border-slate-200/90 dark:border-slate-800 shadow-sm p-4 sm:p-5 space-y-2.5">
          <div className="flex items-center gap-2.5 text-amber-700 dark:text-amber-400">
            <BellOff className="w-4 h-4 shrink-0" />
            <h3 className="text-sm font-semibold text-ink-primary dark:text-slate-100">
              Quiet by design
            </h3>
          </div>
          <p className="text-xs text-ink-muted dark:text-slate-400 leading-relaxed">
            Next does not run background push alarms or streak notifications. Executive function support works best when the app is a welcoming, pressure-free doorway you choose to open—never a nagging interruption.
          </p>
        </div>
      </section>

      {/* PRIVACY & DATA MANAGEMENT */}
      <section className="space-y-2">
        <h2 className="text-xs font-bold uppercase tracking-wider text-ink-muted dark:text-slate-400 px-1">
          Your Data (Local-First)
        </h2>
        <div className="rounded-3xl bg-surface dark:bg-surface-dark border border-slate-200/90 dark:border-slate-800 shadow-sm divide-y divide-slate-100 dark:divide-slate-800/80 overflow-hidden">
          {/* Data Explanation & Backup Header */}
          <div className="p-4 sm:p-5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-ink-primary dark:text-slate-100 block">
                Local device storage
              </span>
              <span className="text-[11px] font-semibold text-sage-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full">
                100% Private
              </span>
            </div>
            <p className="text-xs text-ink-muted dark:text-slate-400 leading-relaxed">
              All tasks, routines, check-in ratings, and journal reflections are stored exclusively in your browser/device LocalStorage. No tracking, no cloud databases.
            </p>

            {/* Export & Import actions */}
            <div className="pt-2 flex flex-col sm:flex-row items-center gap-2.5">
              <button
                type="button"
                onClick={handleExportData}
                className="w-full sm:flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-ink-primary dark:text-slate-200 transition-colors shadow-sm"
              >
                <Download className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                <span>Export JSON Backup</span>
              </button>

              <label className="w-full sm:flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-ink-primary dark:text-slate-200 transition-colors shadow-sm cursor-pointer">
                <Upload className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                <span>Restore Backup</span>
                <input
                  type="file"
                  accept=".json,application/json"
                  onChange={handleImportData}
                  className="hidden"
                />
              </label>
            </div>
            {importStatus && (
              <p className="text-xs text-amber-700 dark:text-amber-300 font-medium pt-1">
                {importStatus}
              </p>
            )}
          </div>

          {/* Clear today */}
          <button
            type="button"
            onClick={() => setConfirmModal('empty_day')}
            className="w-full flex items-center justify-between p-4 sm:p-5 text-sm transition-colors hover:bg-slate-50/70 dark:hover:bg-slate-800/40 text-left"
          >
            <div>
              <span className="font-semibold text-ink-primary dark:text-slate-100 block">
                Start with an empty day
              </span>
              <span className="text-xs text-ink-muted dark:text-slate-400 mt-0.5 block">
                Clear all active tasks for today without touching routines or history
              </span>
            </div>
            <Trash2 className="w-4 h-4 text-ink-muted shrink-0" />
          </button>

          {/* Reset to sample data */}
          <button
            type="button"
            onClick={() => setConfirmModal('reset_demo')}
            className="w-full flex items-center justify-between p-4 sm:p-5 text-sm transition-colors hover:bg-slate-50/70 dark:hover:bg-slate-800/40 text-left"
          >
            <div>
              <span className="font-semibold text-ink-primary dark:text-slate-100 block">
                Reset to sample templates
              </span>
              <span className="text-xs text-ink-muted dark:text-slate-400 mt-0.5 block">
                Restore default tasks and routines
              </span>
            </div>
            <RotateCcw className="w-4 h-4 text-ink-muted shrink-0" />
          </button>
        </div>
      </section>

      {/* CONFIRMATION MODALS (NEVER SHIFTING THE PAGE INLINE) */}
      {confirmModal && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center pb-[env(safe-area-inset-bottom,0px)] sm:items-center sm:p-4 bg-slate-900/50 dark:bg-slate-950/75 animate-fade-in"
          role="dialog"
          aria-modal="true"
          onClick={() => setConfirmModal(null)}
        >
          <div
            className="modal-sheet relative w-full sm:max-w-md bg-surface dark:bg-surface-dark border-t sm:border border-slate-200/90 dark:border-slate-800 sm:rounded-3xl rounded-t-3xl shadow-2xl p-6 space-y-4 animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-lg font-bold text-ink-primary dark:text-slate-100">
                {confirmModal === 'empty_day' ? 'Clear Today\'s Day?' : 'Reset to Sample Data?'}
              </h3>
              <button
                type="button"
                onClick={() => setConfirmModal(null)}
                className="p-1 rounded-xl text-ink-muted hover:text-ink-primary"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {confirmModal === 'empty_day' ? (
              <div className="space-y-3 text-xs sm:text-sm text-ink-secondary dark:text-slate-300">
                <p>
                  This action clears your current active task list for today so you can start with a fresh, clean slate.
                </p>
                <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 space-y-1">
                  <p className="font-semibold text-ink-primary dark:text-slate-200">What is kept:</p>
                  <ul className="list-disc list-inside space-y-0.5 text-xs text-ink-muted dark:text-slate-400">
                    <li>Routines and library sequences</li>
                    <li>Completed task history and returns</li>
                    <li>Wellness check-ins and journal entries</li>
                    <li>All settings and preferences</li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="space-y-3 text-xs sm:text-sm text-ink-secondary dark:text-slate-300">
                <p>
                  This will reload the initial gentle tasks and routines. Use this if you want to test the default app configuration.
                </p>
                <p className="text-xs text-ink-muted dark:text-slate-400">
                  You can first export a JSON backup above if you want to keep your current custom data.
                </p>
              </div>
            )}

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  if (confirmModal === 'empty_day') resetToEmptyDay();
                  else resetToDemoData();
                  setConfirmModal(null);
                }}
                className="flex-1 py-3 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm transition-all"
              >
                {confirmModal === 'empty_day' ? 'Yes, clear today' : 'Yes, reset to samples'}
              </button>
              <button
                type="button"
                onClick={() => setConfirmModal(null)}
                className="flex-1 py-3 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-ink-primary dark:text-slate-200 font-medium text-sm transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
