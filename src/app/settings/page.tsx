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
  AlertTriangle,
  Sparkles,
  Sun,
  Moon,
  Laptop,
  Check,
  X
} from 'lucide-react';

export default function SettingsPage() {
  const { settings, updateSettings, resetToDemoData, resetToEmptyDay, clearAllData } = useApp();
  const [confirmModal, setConfirmModal] = useState<'empty_day' | 'reset_demo' | 'clear_all' | null>(null);
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [exportStatus, setExportStatus] = useState<string | null>(null);
  const [resetSuccessMessage, setResetSuccessMessage] = useState<string | null>(null);

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

  const currentTheme = settings.theme || 'dark';
  const themeLabel = {
    light: 'Light',
    dark: 'Dark',
    system: 'System',
  }[currentTheme];

  const currentDifficulty = settings.startingDifficulty || 'gentle';
  const difficultyLabel = {
    gentle: 'Gentle (Low friction)',
    balanced: 'Balanced (Standard)',
    structured: 'Structured (Full steps)',
  }[currentDifficulty];

  const handleSetTheme = (newTheme: 'light' | 'dark' | 'system') => {
    updateSettings({ theme: newTheme });
  };

  const handleCycleDifficulty = () => {
    const next = currentDifficulty === 'gentle'
      ? 'balanced'
      : currentDifficulty === 'balanced'
        ? 'structured'
        : 'gentle';
    updateSettings({ startingDifficulty: next });
  };

  const handleExportData = async () => {
    try {
      setExportStatus(null);
      const todayStr = getLocalDateString();
      const backupData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        tasks: JSON.parse(localStorage.getItem('next_tasks_v1') || '[]'),
        routines: JSON.parse(localStorage.getItem('next_routines_v1') || '[]'),
        returns: JSON.parse(localStorage.getItem('next_returns_v1') || '[]'),
        insights: JSON.parse(localStorage.getItem('next_insights_v1') || '[]'),
        settings: JSON.parse(localStorage.getItem('next_settings_v1') || '{}'),
        stuckLogs: JSON.parse(localStorage.getItem('next_stuck_logs_v1') || '[]'),
        resets: JSON.parse(localStorage.getItem('next_resets_v1') || '[]'),
        journal: JSON.parse(localStorage.getItem('next_journal_v1') || '[]'),
        checkins: JSON.parse(localStorage.getItem('next_checkins_v1') || '[]'),
        notPlanningToday: JSON.parse(localStorage.getItem('next_not_planning_v1') || 'false'),
        lastActiveDate: localStorage.getItem('next_last_active_date_v1') || todayStr,
        lastAckReturnDate: localStorage.getItem('next_last_ack_return_date_v1') || null,
      };

      const jsonString = JSON.stringify(backupData, null, 2);
      const fileName = `next-backup-${todayStr}.json`;

      // 1. Try modern Web Share API with File object
      if (typeof navigator !== 'undefined' && (navigator as any).canShare) {
        try {
          const file = new File([jsonString], fileName, { type: 'application/json' });
          if ((navigator as any).canShare({ files: [file] })) {
            await navigator.share({
              files: [file],
              title: fileName,
              text: 'Next planner backup file',
            });
            setExportStatus('Backup shared / saved successfully.');
            return;
          }
        } catch (shareErr: any) {
          if (shareErr.name === 'AbortError') {
            setExportStatus('Export cancelled.');
            return;
          }
          console.warn('Web Share fallback to download', shareErr);
        }
      }

      // 2. Standard browser download fallback
      try {
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(url), 5000);
        setExportStatus('Backup file downloaded.');
      } catch (dlErr: any) {
        console.error('Download fallback failed', dlErr);
        if (navigator.clipboard) {
          await navigator.clipboard.writeText(jsonString);
          setExportStatus('Backup copied to clipboard (file download was not supported).');
        } else {
          throw new Error('Unable to save file or copy to clipboard.');
        }
      }
    } catch (e: any) {
      console.error('Export failed', e);
      setExportStatus(`Export failed: ${e?.message || 'Unknown error'}`);
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

        if (!data || typeof data !== 'object' || Array.isArray(data)) {
          throw new Error('Root must be an object');
        }

        if (!data.tasks && !data.routines && !data.settings && !data.version) {
          throw new Error('Missing backup identifiers');
        }

        const arrayFields = ['tasks', 'routines', 'returns', 'insights', 'stuckLogs', 'resets', 'journal', 'checkins'] as const;
        for (const field of arrayFields) {
          if (data[field] !== undefined && !Array.isArray(data[field])) {
            throw new Error(`${field} must be an array`);
          }
        }

        const writes: Array<[string, string]> = [];
        if (data.tasks) writes.push(['next_tasks_v1', JSON.stringify(data.tasks)]);
        if (data.routines) writes.push(['next_routines_v1', JSON.stringify(data.routines)]);
        if (data.returns) writes.push(['next_returns_v1', JSON.stringify(data.returns)]);
        if (data.insights) writes.push(['next_insights_v1', JSON.stringify(data.insights)]);
        if (data.settings) writes.push(['next_settings_v1', JSON.stringify(data.settings)]);
        if (data.stuckLogs) writes.push(['next_stuck_logs_v1', JSON.stringify(data.stuckLogs)]);
        if (data.resets) writes.push(['next_resets_v1', JSON.stringify(data.resets)]);
        if (data.journal) writes.push(['next_journal_v1', JSON.stringify(data.journal)]);
        if (data.checkins) writes.push(['next_checkins_v1', JSON.stringify(data.checkins)]);
        if (data.notPlanningToday !== undefined) writes.push(['next_not_planning_v1', JSON.stringify(data.notPlanningToday)]);
        if (data.lastActiveDate) writes.push(['next_last_active_date_v1', String(data.lastActiveDate)]);
        if (data.lastAckReturnDate) writes.push(['next_last_ack_return_date_v1', String(data.lastAckReturnDate)]);

        for (const [key, value] of writes) {
          localStorage.setItem(key, value);
        }

        setImportStatus('Backup restored successfully. Reloading...');
        setTimeout(() => {
          window.location.reload();
        }, 800);
      } catch (err: any) {
        setImportStatus(err?.message ? `Failed to restore: ${err.message}` : 'Failed to restore: This file is not a valid Next backup.');
      }
    };
    reader.readAsText(file);
  };

  const handleExecuteReset = () => {
    if (confirmModal === 'empty_day') {
      resetToEmptyDay();
      setResetSuccessMessage('Active tasks for today have been cleared.');
    } else if (confirmModal === 'reset_demo') {
      resetToDemoData();
      setResetSuccessMessage('Sample templates and defaults have been restored.');
    } else if (confirmModal === 'clear_all') {
      clearAllData();
      setResetSuccessMessage('All personal local data has been erased completely.');
    }
    setConfirmModal(null);
    setTimeout(() => setResetSuccessMessage(null), 6000);
  };

  return (
    <div className="max-w-xl mx-auto space-y-6 animate-fade-in pb-28 md:pb-10">
      {/* Header */}
      <Header
        title="Settings"
        subtitle="Personalize your experience. Changes apply immediately."
      />

      {resetSuccessMessage && (
        <div className="p-3.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-900 dark:text-amber-300 text-xs font-medium flex items-center justify-between animate-fade-in shadow-sm">
          <span>{resetSuccessMessage}</span>
          <button
            type="button"
            onClick={() => setResetSuccessMessage(null)}
            className="text-amber-800 dark:text-amber-400 p-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 1. APPEARANCE */}
      <section className="space-y-2">
        <h2 className="text-xs font-bold uppercase tracking-wider text-ink-muted dark:text-linen-subtle px-1">
          Appearance
        </h2>
        <div className="rounded-xl bg-surface dark:bg-surface-dark border border-stone-200/90 dark:border-white/[0.08] shadow-sm divide-y divide-stone-100 dark:divide-white/[0.05] overflow-hidden">
          <div className="p-4 sm:p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-semibold text-sm text-ink-primary dark:text-linen block">Theme</span>
                <span className="text-xs text-ink-muted dark:text-linen-subtle mt-0.5 block">
                  Select your preferred display mode
                </span>
              </div>
              <span className="text-xs font-medium px-2 py-0.5 rounded-md bg-stone-100 dark:bg-white/[0.06] text-ink-secondary dark:text-linen">
                {themeLabel}
              </span>
            </div>

            {/* 3 Theme Chips */}
            <div className="grid grid-cols-3 gap-2 pt-1">
              {[
                { id: 'dark', label: 'Dark', icon: Moon },
                { id: 'light', label: 'Light', icon: Sun },
                { id: 'system', label: 'System', icon: Laptop },
              ].map(t => {
                const Icon = t.icon;
                const isSelected = currentTheme === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => handleSetTheme(t.id as any)}
                    className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-semibold transition-all border ${
                      isSelected
                        ? 'bg-amber-500 text-stone-950 border-amber-500 shadow-sm'
                        : 'bg-stone-50 dark:bg-white/[0.04] text-ink-muted dark:text-linen-subtle border-stone-200/70 dark:border-white/[0.06] hover:text-ink-primary dark:hover:text-linen'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{t.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 2. BEHAVIOR & SOUND */}
      <section className="space-y-2">
        <h2 className="text-xs font-bold uppercase tracking-wider text-ink-muted dark:text-linen-subtle px-1">
          Behavior &amp; Sound
        </h2>
        <div className="rounded-xl bg-surface dark:bg-surface-dark border border-stone-200/90 dark:border-white/[0.08] shadow-sm divide-y divide-stone-100 dark:divide-white/[0.05] overflow-hidden">
          {/* Starting difficulty */}
          <button
            type="button"
            onClick={handleCycleDifficulty}
            className="w-full flex items-center justify-between p-4 sm:p-5 text-sm transition-colors hover:bg-stone-50/70 dark:hover:bg-white/[0.03] text-left"
          >
            <div>
              <span className="font-semibold text-ink-primary dark:text-linen block">Starting difficulty</span>
              <span className="text-xs text-ink-muted dark:text-linen-subtle mt-0.5 block">
                Default scope when breaking tasks down
              </span>
            </div>
            <div className="flex items-center gap-2 text-ink-muted dark:text-linen-subtle font-medium shrink-0">
              <span className="px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-white/[0.06] text-xs text-ink-primary dark:text-linen">
                {difficultyLabel}
              </span>
              <ChevronRight className="w-4 h-4 opacity-70" />
            </div>
          </button>

          {/* Show extras toggle */}
          <div className="flex items-center justify-between p-4 sm:p-5 text-sm gap-4">
            <div className="flex-1 min-w-0">
              <span className="font-semibold text-ink-primary dark:text-linen block">Show extras</span>
              <span className="text-xs text-ink-muted dark:text-linen-subtle mt-0.5 block">
                Reveal optional extra steps in tasks when you have surplus energy
              </span>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={settings.showExtras ?? false}
              onClick={() => updateSettings({ showExtras: !settings.showExtras })}
              className={`w-11 h-6 rounded-full transition-colors relative p-0.5 shrink-0 ${
                settings.showExtras ? 'bg-amber-500' : 'bg-stone-300 dark:bg-white/20'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform shadow-sm ${
                  settings.showExtras ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Completion audio chime */}
          <div className="flex items-center justify-between p-4 sm:p-5 text-sm gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                <span className="font-semibold text-ink-primary dark:text-linen block">
                  Completion audio chime
                </span>
              </div>
              <span className="text-xs text-ink-muted dark:text-linen-subtle mt-1 block">
                Gentle harmonic tone played when finishing a task, step, or minimum.
              </span>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={settings.soundEnabled}
              onClick={() => updateSettings({ soundEnabled: !settings.soundEnabled })}
              className={`w-11 h-6 rounded-full transition-colors relative p-0.5 shrink-0 ${
                settings.soundEnabled ? 'bg-amber-500' : 'bg-stone-300 dark:bg-white/20'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform shadow-sm ${
                  settings.soundEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </section>

      {/* 3. REMINDERS & ALERTS */}
      <section className="space-y-2">
        <h2 className="text-xs font-bold uppercase tracking-wider text-ink-muted dark:text-linen-subtle px-1">
          Reminders &amp; Alerts
        </h2>
        <div className="rounded-xl bg-surface dark:bg-surface-dark border border-stone-200/90 dark:border-white/[0.08] shadow-sm p-4 sm:p-5 space-y-2">
          <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
            <BellOff className="w-4 h-4 shrink-0" />
            <h3 className="text-sm font-semibold text-ink-primary dark:text-linen">
              Quiet by design
            </h3>
          </div>
          <p className="text-xs text-ink-muted dark:text-linen-subtle leading-relaxed">
            Next does not run background push alarms or streak guilt notifications. Executive function support works best when the app is a welcoming, pressure-free doorway you choose to open—never a nagging interruption.
          </p>
        </div>
      </section>

      {/* 4. PRIVACY & LOCAL DATA */}
      <section className="space-y-2">
        <h2 className="text-xs font-bold uppercase tracking-wider text-ink-muted dark:text-linen-subtle px-1">
          Privacy &amp; Local Data
        </h2>
        <div className="rounded-xl bg-surface dark:bg-surface-dark border border-stone-200/90 dark:border-white/[0.08] shadow-sm divide-y divide-stone-100 dark:divide-white/[0.05] overflow-hidden">
          {/* Data Explanation & Backup Header */}
          <div className="p-4 sm:p-5 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-sm text-ink-primary dark:text-linen block">
                Local device storage
              </span>
              <span className="text-[11px] font-semibold text-sage-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full">
                100% Private
              </span>
            </div>
            <p className="text-xs text-ink-muted dark:text-linen-subtle leading-relaxed">
              All tasks, routines, check-in ratings, and journal reflections are stored exclusively in your browser/device LocalStorage. Backups are exported as unencrypted JSON files.
            </p>

            {/* Export & Import actions */}
            <div className="pt-2 flex flex-col sm:flex-row items-center gap-2.5">
              <button
                type="button"
                onClick={handleExportData}
                className="w-full sm:flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg border border-stone-200 dark:border-white/[0.08] hover:bg-stone-50 dark:hover:bg-white/[0.04] text-xs font-semibold text-ink-primary dark:text-linen transition-colors shadow-sm"
              >
                <Download className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                <span>Export JSON Backup</span>
              </button>

              <label className="w-full sm:flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg border border-stone-200 dark:border-white/[0.08] hover:bg-stone-50 dark:hover:bg-white/[0.04] text-xs font-semibold text-ink-primary dark:text-linen transition-colors shadow-sm cursor-pointer">
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
            {exportStatus && (
              <p className="text-xs text-amber-700 dark:text-amber-300 font-medium pt-1">
                {exportStatus}
              </p>
            )}
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
            className="w-full flex items-center justify-between p-4 sm:p-5 text-sm transition-colors hover:bg-stone-50/70 dark:hover:bg-white/[0.03] text-left"
          >
            <div>
              <span className="font-semibold text-ink-primary dark:text-linen block">
                Start with an empty day
              </span>
              <span className="text-xs text-ink-muted dark:text-linen-subtle mt-0.5 block">
                Clear active tasks for today without touching routines or history
              </span>
            </div>
            <Trash2 className="w-4 h-4 text-ink-muted dark:text-linen-subtle shrink-0" />
          </button>

          {/* Reset to sample data */}
          <button
            type="button"
            onClick={() => setConfirmModal('reset_demo')}
            className="w-full flex items-center justify-between p-4 sm:p-5 text-sm transition-colors hover:bg-stone-50/70 dark:hover:bg-white/[0.03] text-left"
          >
            <div>
              <span className="font-semibold text-ink-primary dark:text-linen block">
                Reset to sample templates
              </span>
              <span className="text-xs text-ink-muted dark:text-linen-subtle mt-0.5 block">
                Restore default tasks, sample routines, and fresh onboarding templates
              </span>
            </div>
            <RotateCcw className="w-4 h-4 text-ink-muted dark:text-linen-subtle shrink-0" />
          </button>

          {/* Clear everything (Genuine Wipe) */}
          <button
            type="button"
            onClick={() => setConfirmModal('clear_all')}
            className="w-full flex items-center justify-between p-4 sm:p-5 text-sm transition-colors hover:bg-rose-500/10 dark:hover:bg-rose-950/20 text-left text-rose-700 dark:text-rose-400 group"
          >
            <div>
              <span className="font-semibold block">
                Clear all personal data
              </span>
              <span className="text-xs text-rose-600/80 dark:text-rose-400/80 mt-0.5 block">
                Permanently erase all local tasks, reflections, routines, and reset to zero
              </span>
            </div>
            <AlertTriangle className="w-4 h-4 shrink-0 group-hover:scale-110 transition-transform" />
          </button>
        </div>
      </section>

      {/* CONFIRMATION MODAL */}
      {confirmModal && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center pb-[env(safe-area-inset-bottom,0px)] sm:items-center sm:p-4 bg-stone-900/60 dark:bg-black/80 backdrop-blur-[2px] animate-fade-in"
          role="dialog"
          aria-modal="true"
          onClick={() => setConfirmModal(null)}
        >
          <div
            className="modal-sheet relative w-full sm:max-w-md bg-surface dark:bg-surface-dark border-t sm:border border-stone-200/90 dark:border-white/[0.1] sm:rounded-xl rounded-t-xl shadow-2xl p-6 space-y-4 animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-stone-100 dark:border-white/[0.06]">
              <h3 className="text-base font-bold text-ink-primary dark:text-linen">
                {confirmModal === 'empty_day'
                  ? "Clear Today's Tasks?"
                  : confirmModal === 'reset_demo'
                  ? 'Restore Sample Templates?'
                  : 'Permanently Clear All Data?'}
              </h3>
              <button
                type="button"
                onClick={() => setConfirmModal(null)}
                className="p-1 rounded-lg text-ink-muted hover:text-ink-primary dark:text-linen-subtle dark:hover:text-linen"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {confirmModal === 'empty_day' && (
              <div className="space-y-3 text-xs sm:text-sm text-ink-secondary dark:text-linen-muted">
                <p>
                  This action clears your current active task list for today so you can start with a fresh, clean slate.
                </p>
                <div className="p-3.5 rounded-lg bg-stone-50 dark:bg-white/[0.03] border border-stone-200/80 dark:border-white/[0.06] space-y-1">
                  <p className="font-semibold text-ink-primary dark:text-linen">What is kept:</p>
                  <ul className="list-disc list-inside space-y-0.5 text-xs text-ink-muted dark:text-linen-subtle">
                    <li>Routines and library sequences</li>
                    <li>Completed task history and returns</li>
                    <li>Wellness check-ins and journal entries</li>
                    <li>All settings and preferences</li>
                  </ul>
                </div>
              </div>
            )}

            {confirmModal === 'reset_demo' && (
              <div className="space-y-3 text-xs sm:text-sm text-ink-secondary dark:text-linen-muted">
                <p>
                  This will reload the initial gentle tasks and routines. Use this if you want to test the default app configuration.
                </p>
                <p className="text-xs text-ink-muted dark:text-linen-subtle">
                  You can first export a JSON backup if you wish to preserve your current data.
                </p>
              </div>
            )}

            {confirmModal === 'clear_all' && (
              <div className="space-y-3 text-xs sm:text-sm text-rose-700 dark:text-rose-300">
                <p className="font-semibold">
                  This will genuinely and irreversibly erase ALL your stored tasks, routine completions, check-in history, reflections, and custom logs from this device.
                </p>
                <p className="text-xs text-ink-muted dark:text-linen-subtle">
                  Nothing is kept in the cloud. If you haven&apos;t downloaded a JSON backup, your data cannot be recovered.
                </p>
              </div>
            )}

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={handleExecuteReset}
                className={`flex-1 py-2.5 px-4 rounded-lg font-semibold text-xs sm:text-sm transition-all shadow-sm ${
                  confirmModal === 'clear_all'
                    ? 'bg-rose-600 hover:bg-rose-700 text-white'
                    : confirmModal === 'empty_day'
                    ? 'bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold'
                    : 'bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold'
                }`}
              >
                {confirmModal === 'empty_day'
                  ? 'Yes, clear today'
                  : confirmModal === 'reset_demo'
                  ? 'Yes, restore samples'
                  : 'Yes, permanently clear everything'}
              </button>
              <button
                type="button"
                onClick={() => setConfirmModal(null)}
                className="flex-1 py-2.5 px-4 rounded-lg bg-stone-100 dark:bg-white/[0.06] hover:bg-stone-200 dark:hover:bg-white/[0.1] text-ink-primary dark:text-linen font-medium text-xs sm:text-sm transition-all border border-stone-200 dark:border-white/[0.06]"
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
