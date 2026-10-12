'use client';

import React, { useState, useRef } from 'react';
import { useApp } from '@/lib/store';
import { 
  ChevronRight, 
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Check,
  X,
  Download,
  Upload,
  ShieldCheck,
  Bell,
  Trash2
} from 'lucide-react';

export default function SettingsPage() {
  const { settings, updateSettings, resetToDemoData, resetToEmptyDay } = useApp();
  const [activeDialog, setActiveDialog] = useState<'about' | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<'empty_day' | 'reset_demo' | null>(null);
  const [showDataSection, setShowDataSection] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleExportBackup = () => {
    try {
      const backupData: Record<string, any> = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('next_')) {
          backupData[key] = JSON.parse(localStorage.getItem(key) || 'null');
        }
      }
      const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `next-backup-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error('Backup export failed:', e);
    }
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (typeof data !== 'object' || !data) throw new Error('Invalid format');
        Object.entries(data).forEach(([k, v]) => {
          if (k.startsWith('next_')) {
            localStorage.setItem(k, JSON.stringify(v));
          }
        });
        window.location.reload();
      } catch {
        alert('Could not read backup file. Please select a valid JSON backup.');
      }
    };
    reader.readAsText(file);
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
            className="w-full flex items-center justify-between py-3.5 px-1 text-sm transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-800/30 min-h-[44px]"
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
            className="w-full flex items-center justify-between py-3.5 px-1 text-sm transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-800/30 min-h-[44px]"
          >
            <span className="font-medium text-ink-primary dark:text-slate-100">Starting difficulty</span>
            <div className="flex items-center gap-1.5 text-ink-muted dark:text-slate-400">
              <span>{difficultyLabel}</span>
              <ChevronRight className="w-4 h-4 opacity-70" />
            </div>
          </button>

          {/* Show extras toggle */}
          <div className="flex items-center justify-between py-3.5 px-1 text-sm min-h-[44px]">
            <div>
              <span className="font-medium text-ink-primary dark:text-slate-100 block">Show extras</span>
              <span className="text-xs text-ink-muted dark:text-slate-400">Reveal optional extra steps in tasks</span>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={settings.showExtras ?? false}
              onClick={() => updateSettings({ showExtras: !settings.showExtras })}
              className={`w-11 h-6 rounded-full transition-colors relative p-0.5 shrink-0 ${
                settings.showExtras ? 'bg-brand-600' : 'bg-slate-200 dark:bg-slate-700'
              }`}
            >
              <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                settings.showExtras ? 'translate-x-5' : 'translate-x-0'
              }`} />
            </button>
          </div>

          {/* Calm Sound chimes */}
          <div className="flex items-center justify-between py-3.5 px-1 text-sm min-h-[44px]">
            <div>
              <span className="font-medium text-ink-primary dark:text-slate-100 block">Calm sound chimes</span>
              <span className="text-xs text-ink-muted dark:text-slate-400">Subtle harmonic tone when finishing the minimum</span>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={settings.soundEnabled}
              onClick={() => updateSettings({ soundEnabled: !settings.soundEnabled })}
              className={`w-11 h-6 rounded-full transition-colors relative p-0.5 shrink-0 ${
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

      {/* NOTIFICATIONS & REMINDERS (Real, clear setting) */}
      <section className="space-y-2">
        <h2 className="text-xs font-bold uppercase tracking-wider text-ink-muted dark:text-slate-400 px-1">
          Reminders & Cues
        </h2>
        <div className="border-t border-slate-200/80 dark:border-slate-800 p-4 rounded-2xl bg-surface dark:bg-surface-dark border border-slate-200/70 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Bell className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <div>
                <span className="font-medium text-sm text-ink-primary dark:text-slate-100 block">Gentle timer audio cues</span>
                <span className="text-xs text-ink-muted dark:text-slate-400">Soft chime when timer or routine finishes</span>
              </div>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={settings.soundEnabled}
              onClick={() => updateSettings({ soundEnabled: !settings.soundEnabled })}
              className={`w-11 h-6 rounded-full transition-colors relative p-0.5 shrink-0 ${
                settings.soundEnabled ? 'bg-brand-600' : 'bg-slate-200 dark:bg-slate-700'
              }`}
            >
              <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                settings.soundEnabled ? 'translate-x-5' : 'translate-x-0'
              }`} />
            </button>
          </div>
          <p className="text-[11px] text-ink-subtle dark:text-slate-500 leading-relaxed pt-1 border-t border-slate-100 dark:border-slate-800">
            Next intentionally avoids intrusive push alerts or nagging streak alarms. Cues are subtle reminders only when you initiate a timer or routine.
          </p>
        </div>
      </section>

      {/* PRIVACY & DATA MANAGEMENT */}
      <section className="space-y-2">
        <h2 className="text-xs font-bold uppercase tracking-wider text-ink-muted dark:text-slate-400 px-1">
          Privacy & data
        </h2>
        <div className="border-t border-slate-200/80 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800/80">
          {/* Your Data expandable section */}
          <div>
            <button
              type="button"
              onClick={() => setShowDataSection(!showDataSection)}
              className="w-full flex items-center justify-between py-3.5 px-1 text-sm transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-800/30 min-h-[44px]"
            >
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span className="font-medium text-ink-primary dark:text-slate-100">Your data</span>
              </div>
              <div className="flex items-center gap-1.5 text-ink-muted dark:text-slate-400">
                <span className="text-xs">100% Local</span>
                {showDataSection ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </div>
            </button>

            {showDataSection && (
              <div className="p-4 mb-2 rounded-2xl bg-slate-50/70 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-800/60 space-y-3.5 animate-fade-in">
                <p className="text-xs text-ink-secondary dark:text-slate-300 leading-relaxed">
                  Your tasks, routines, reflections, and check-ins are stored privately in your browser storage. No accounts, no external tracking.
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={handleExportBackup}
                    className="w-full sm:flex-1 flex items-center justify-center gap-2 py-2.5 px-3.5 rounded-xl bg-surface dark:bg-surface-dark border border-slate-200 dark:border-slate-700 text-xs font-semibold text-ink-primary dark:text-slate-100 hover:border-slate-300 dark:hover:border-slate-600 transition-colors shadow-sm min-h-[44px]"
                  >
                    <Download className="w-3.5 h-3.5 text-amber-600" />
                    <span>Export backup (JSON)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full sm:flex-1 flex items-center justify-center gap-2 py-2.5 px-3.5 rounded-xl bg-surface dark:bg-surface-dark border border-slate-200 dark:border-slate-700 text-xs font-semibold text-ink-primary dark:text-slate-100 hover:border-slate-300 dark:hover:border-slate-600 transition-colors shadow-sm min-h-[44px]"
                  >
                    <Upload className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Restore backup</span>
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept=".json"
                    onChange={handleImportBackup}
                    className="hidden"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Start with empty day (triggers clean modal) */}
          <button
            type="button"
            onClick={() => setConfirmDialog('empty_day')}
            className="w-full flex items-center justify-between py-3.5 px-1 text-sm transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-800/30 text-left min-h-[44px]"
          >
            <div>
              <span className="font-medium text-ink-primary dark:text-slate-100 block">Clear today&apos;s tasks</span>
              <span className="text-xs text-ink-muted">Start fresh with an empty day</span>
            </div>
            <Trash2 className="w-4 h-4 text-ink-muted opacity-70" />
          </button>

          {/* Reset to sample data (triggers clean modal) */}
          <button
            type="button"
            onClick={() => setConfirmDialog('reset_demo')}
            className="w-full flex items-center justify-between py-3.5 px-1 text-sm transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-800/30 text-left min-h-[44px]"
          >
            <div>
              <span className="font-medium text-ink-primary dark:text-slate-100 block">Reset to sample data</span>
              <span className="text-xs text-ink-muted">Restore initial example tasks and routines</span>
            </div>
            <RotateCcw className="w-4 h-4 text-ink-muted opacity-70" />
          </button>
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
            className="w-full flex items-center justify-between py-3.5 px-1 text-sm transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-800/30 min-h-[44px]"
          >
            <span className="font-medium text-ink-primary dark:text-slate-100">About Next</span>
            <div className="flex items-center gap-1.5 text-ink-muted dark:text-slate-400">
              <span>v1.1</span>
              <ChevronRight className="w-4 h-4 opacity-70" />
            </div>
          </button>
        </div>
      </section>

      {/* Modals & Dialogs */}

      {/* Clear Day Confirmation Modal */}
      {confirmDialog === 'empty_day' && (
        <div 
          className="fixed inset-0 z-50 flex items-end justify-center pb-[env(safe-area-inset-bottom,0px)] sm:items-center sm:p-4 bg-slate-900/40 dark:bg-slate-950/70 animate-fade-in"
          role="dialog"
          aria-modal="true"
          onClick={() => setConfirmDialog(null)}
        >
          <div
            className="modal-sheet relative w-full sm:max-w-md bg-surface dark:bg-surface-dark border-t sm:border border-slate-200/90 dark:border-slate-800 sm:rounded-3xl rounded-t-3xl shadow-2xl p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/15 text-amber-700 dark:text-amber-400 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-ink-primary dark:text-slate-100">Clear today&apos;s tasks?</h3>
                <p className="text-xs text-ink-muted dark:text-slate-400">Start with a calm, empty day</p>
              </div>
            </div>

            <p className="text-sm text-ink-secondary dark:text-slate-300 leading-relaxed">
              This will remove today&apos;s tasks from your active plan.
            </p>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800 text-xs text-ink-muted space-y-1">
              <p className="font-semibold text-ink-primary dark:text-slate-200">What remains safe:</p>
              <p>• Your routines, check-in history, journal entries, and settings will not be affected.</p>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  resetToEmptyDay();
                  setConfirmDialog(null);
                }}
                className="flex-1 py-3 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm transition-all min-h-[44px]"
              >
                Clear day
              </button>
              <button
                type="button"
                onClick={() => setConfirmDialog(null)}
                className="flex-1 py-3 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-ink-secondary dark:text-slate-200 font-medium text-sm transition-all min-h-[44px]"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reset Demo Confirmation Modal */}
      {confirmDialog === 'reset_demo' && (
        <div 
          className="fixed inset-0 z-50 flex items-end justify-center pb-[env(safe-area-inset-bottom,0px)] sm:items-center sm:p-4 bg-slate-900/40 dark:bg-slate-950/70 animate-fade-in"
          role="dialog"
          aria-modal="true"
          onClick={() => setConfirmDialog(null)}
        >
          <div
            className="modal-sheet relative w-full sm:max-w-md bg-surface dark:bg-surface-dark border-t sm:border border-slate-200/90 dark:border-slate-800 sm:rounded-3xl rounded-t-3xl shadow-2xl p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/15 text-amber-700 dark:text-amber-400 flex items-center justify-center shrink-0">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-ink-primary dark:text-slate-100">Reset to sample data?</h3>
                <p className="text-xs text-ink-muted dark:text-slate-400">Restore original starter content</p>
              </div>
            </div>

            <p className="text-sm text-ink-secondary dark:text-slate-300 leading-relaxed">
              This will replace current tasks and routines with the original starter demonstration content.
            </p>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  resetToDemoData();
                  setConfirmDialog(null);
                }}
                className="flex-1 py-3 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm transition-all min-h-[44px]"
              >
                Reset demo data
              </button>
              <button
                type="button"
                onClick={() => setConfirmDialog(null)}
                className="flex-1 py-3 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-ink-secondary dark:text-slate-200 font-medium text-sm transition-all min-h-[44px]"
              >
                Cancel
              </button>
            </div>
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
              <button onClick={() => setActiveDialog(null)} className="p-1 rounded-xl text-ink-muted min-h-[44px] min-w-[44px] flex items-center justify-center">
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
