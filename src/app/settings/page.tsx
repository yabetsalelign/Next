'use client';

import React, { useState, useRef } from 'react';
import { useApp } from '@/lib/store';
import { Header } from '@/components/layout/Header';
import { getLocalDateString } from '@/lib/dateUtils';

export default function SettingsPage() {
  const { settings, updateSettings, resetToDemoData, resetToEmptyDay, clearAllData } = useApp();
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const selectedAccent = (settings.accentPalette as 'amber' | 'mint') || 'amber';
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentTheme = settings.theme || 'dark';

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSetTheme = (theme: 'dark' | 'light' | 'system') => {
    updateSettings({ theme });
    triggerToast(`${theme.charAt(0).toUpperCase() + theme.slice(1)} mode enabled`);
  };

  const handleSetAccent = (accent: 'amber' | 'mint') => {
    updateSettings({ accentPalette: accent });
    triggerToast(`${accent === 'amber' ? 'Warm Amber' : 'Gentle Mint'} accent selected`);
  };

  const handleToggleSound = () => {
    const nextVal = !settings.soundEnabled;
    updateSettings({ soundEnabled: nextVal });
    triggerToast(nextVal ? 'Chimes enabled' : 'Chimes muted');
  };

  const handleToggleExtras = () => {
    const nextVal = !settings.showExtras;
    updateSettings({ showExtras: nextVal });
    triggerToast(nextVal ? 'Optional extras visible' : 'Optional extras hidden');
  };

  const handleCycleDifficulty = () => {
    const current = settings.startingDifficulty || 'gentle';
    const next = current === 'gentle' ? 'balanced' : current === 'balanced' ? 'structured' : 'gentle';
    updateSettings({ startingDifficulty: next });
    const label = next === 'gentle' ? 'Gentle (Low friction)' : next === 'balanced' ? 'Balanced (Standard)' : 'Structured';
    triggerToast(`Starting difficulty: ${label}`);
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
        stuckLogs: JSON.parse(localStorage.getItem('next_stuck_logs_v1') || '[]'),
        resets: JSON.parse(localStorage.getItem('next_resets_v1') || '[]'),
        journal: JSON.parse(localStorage.getItem('next_journal_v1') || '[]'),
        checkins: JSON.parse(localStorage.getItem('next_checkins_v1') || '[]'),
      };

      const jsonString = JSON.stringify(backupData, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `next-backup-${todayStr}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      triggerToast('JSON backup saved to downloads');
    } catch {
      triggerToast('Export failed');
    }
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const raw = event.target?.result as string;
        const data = JSON.parse(raw);
        if (data.tasks) localStorage.setItem('next_tasks_v1', JSON.stringify(data.tasks));
        if (data.routines) localStorage.setItem('next_routines_v1', JSON.stringify(data.routines));
        if (data.returns) localStorage.setItem('next_returns_v1', JSON.stringify(data.returns));
        if (data.settings) localStorage.setItem('next_settings_v1', JSON.stringify(data.settings));
        if (data.journal) localStorage.setItem('next_journal_v1', JSON.stringify(data.journal));
        triggerToast('Backup restored successfully');
        setTimeout(() => window.location.reload(), 800);
      } catch {
        triggerToast('Invalid backup file');
      }
    };
    reader.readAsText(file);
  };

  const handleEmptyDay = () => {
    resetToEmptyDay();
    triggerToast('Today reset with a calm slate');
  };

  const handleResetTemplates = () => {
    resetToDemoData();
    triggerToast('Sample templates refreshed');
  };

  const handleConfirmClearAll = () => {
    if (confirm('Are you sure you want to erase all local data? This action cannot be undone.')) {
      clearAllData();
      triggerToast('All personal data cleared');
      setTimeout(() => window.location.reload(), 600);
    }
  };

  const difficultyLabel =
    settings.startingDifficulty === 'structured'
      ? 'Structured'
      : settings.startingDifficulty === 'balanced'
      ? 'Balanced'
      : 'Gentle (Low friction)';

  return (
    <div className="min-h-screen bg-background text-on-surface font-body-md text-body-md flex flex-col selection:bg-primary-container selection:text-on-primary-container">
      {/* Header */}
      <Header />

      <main className="flex flex-col relative w-full pt-[calc(4rem+var(--sat))] pb-36 px-gutter-mobile bg-background flex-1 max-w-xl mx-auto">
        <div className="flex flex-col w-full pb-10 space-y-space-lg select-none">
          {/* Subtitle & Context Note */}
          <div className="px-space-xs pt-1">
            <p className="font-body-md text-body-md text-on-surface-variant">
              Personalize your experience. Changes apply immediately.
            </p>
          </div>

          {/* SECTION 1: APPEARANCE */}
          <section className="flex flex-col space-y-space-sm">
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline px-space-xs font-semibold">
              Appearance
            </span>
            <div className="bg-surface-container-low rounded-2xl p-space-md flex flex-col space-y-space-md border border-surface-container-high/30">
              {/* Theme Selection Header */}
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="font-headline-sm text-headline-sm text-on-surface font-medium">Theme</span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">
                    Select your preferred display mode
                  </span>
                </div>
                <span className="font-label-md text-label-md px-space-sm py-1 rounded-full bg-surface-container-high text-on-surface-variant font-medium capitalize">
                  {currentTheme}
                </span>
              </div>

              {/* Segmented Control Pills */}
              <div className="grid grid-cols-3 gap-space-xs p-1 bg-surface-container-lowest rounded-full border border-surface-container-high/40">
                <button
                  type="button"
                  onClick={() => handleSetTheme('dark')}
                  className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-full transition-all duration-200 active:scale-95 ${
                    currentTheme === 'dark'
                      ? 'bg-primary-container text-on-primary-container font-semibold shadow-sm'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">dark_mode</span>
                  <span className="font-label-md text-label-md">Dark</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSetTheme('light')}
                  className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-full transition-all duration-200 active:scale-95 ${
                    currentTheme === 'light'
                      ? 'bg-primary-container text-on-primary-container font-semibold shadow-sm'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">light_mode</span>
                  <span className="font-label-md text-label-md">Light</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSetTheme('system')}
                  className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-full transition-all duration-200 active:scale-95 ${
                    currentTheme === 'system'
                      ? 'bg-primary-container text-on-primary-container font-semibold shadow-sm'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">computer</span>
                  <span className="font-label-md text-label-md">System</span>
                </button>
              </div>

              {/* Accent Tint Selector */}
              <div className="flex items-center justify-between pt-2">
                <div className="flex flex-col">
                  <span className="font-body-md text-body-md text-on-surface font-medium">Accent palette</span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">
                    Warm Amber or Gentle Mint
                  </span>
                </div>
                <div className="flex items-center gap-space-sm">
                  <button
                    type="button"
                    aria-label="Warm Amber accent"
                    onClick={() => handleSetAccent('amber')}
                    className={`w-8 h-8 rounded-full bg-primary-container flex items-center justify-center shadow-sm relative transition-all active:scale-95 ${
                      selectedAccent === 'amber' ? 'ring-2 ring-primary-container ring-offset-2 ring-offset-background' : 'opacity-60'
                    }`}
                  >
                    {selectedAccent === 'amber' && (
                      <span className="material-symbols-outlined text-on-primary-container text-[16px] font-bold">
                        check
                      </span>
                    )}
                  </button>
                  <button
                    type="button"
                    aria-label="Gentle Mint accent"
                    onClick={() => handleSetAccent('mint')}
                    className={`w-8 h-8 rounded-full bg-secondary flex items-center justify-center relative transition-all active:scale-95 ${
                      selectedAccent === 'mint' ? 'ring-2 ring-secondary ring-offset-2 ring-offset-background' : 'opacity-60 hover:opacity-100'
                    }`}
                  >
                    {selectedAccent === 'mint' && (
                      <span className="material-symbols-outlined text-on-secondary text-[16px] font-bold">
                        check
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 2: BEHAVIOR & SOUND */}
          <section className="flex flex-col space-y-space-sm">
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline px-space-xs font-semibold">
              Behavior &amp; Sound
            </span>
            <div className="bg-surface-container-low rounded-2xl flex flex-col border border-surface-container-high/30">
              {/* Starting difficulty */}
              <div className="p-space-md flex items-center justify-between gap-space-md">
                <div className="flex flex-col min-w-0 pr-space-xs">
                  <span className="font-headline-sm text-headline-sm text-on-surface font-medium">
                    Starting difficulty
                  </span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">
                    Default scope when breaking tasks down
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleCycleDifficulty}
                  className="shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-full bg-surface-container-high hover:bg-surface-variant text-on-surface transition-all active:scale-95"
                >
                  <span className="font-label-md text-label-md font-medium">{difficultyLabel}</span>
                  <span className="material-symbols-outlined text-[16px] text-on-surface-variant">chevron_right</span>
                </button>
              </div>

              <div className="h-px bg-surface-container mx-space-md"></div>

              {/* Show extras */}
              <div className="p-space-md flex items-center justify-between gap-space-md">
                <div className="flex flex-col min-w-0 pr-space-xs">
                  <span className="font-headline-sm text-headline-sm text-on-surface font-medium">
                    Show extras
                  </span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">
                    Reveal optional extra steps in tasks when you have surplus energy
                  </span>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={settings.showExtras ?? false}
                  onClick={handleToggleExtras}
                  className={`shrink-0 w-12 h-7 rounded-full p-1 flex items-center transition-colors duration-200 cursor-pointer ${
                    settings.showExtras ? 'bg-primary-container' : 'bg-surface-container-high'
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-full transition-transform duration-200 ${
                      settings.showExtras
                        ? 'bg-surface-container-lowest translate-x-5'
                        : 'bg-on-surface-variant translate-x-0'
                    }`}
                  ></span>
                </button>
              </div>

              <div className="h-px bg-surface-container mx-space-md"></div>

              {/* Completion audio chime */}
              <div className="p-space-md flex items-center justify-between gap-space-md">
                <div className="flex flex-col min-w-0 pr-space-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-primary-container text-[20px]">volume_up</span>
                    <span className="font-headline-sm text-headline-sm text-on-surface font-medium">
                      Completion audio chime
                    </span>
                  </div>
                  <span className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                    Gentle harmonic tone played when finishing a task, step, or minimum.
                  </span>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={settings.soundEnabled}
                  onClick={handleToggleSound}
                  className={`shrink-0 w-12 h-7 rounded-full p-1 flex items-center transition-colors duration-200 cursor-pointer ${
                    settings.soundEnabled ? 'bg-primary-container' : 'bg-surface-container-high'
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-full transition-transform duration-200 ${
                      settings.soundEnabled
                        ? 'bg-surface-container-lowest translate-x-5'
                        : 'bg-on-surface-variant translate-x-0'
                    }`}
                  ></span>
                </button>
              </div>
            </div>
          </section>

          {/* SECTION 3: REMINDERS & ALERTS */}
          <section className="flex flex-col space-y-space-sm">
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline px-space-xs font-semibold">
              Reminders &amp; Alerts
            </span>
            <div className="bg-surface-container-low rounded-2xl p-space-md flex flex-col space-y-space-xs border border-surface-container-high/30">
              <div className="flex items-center gap-space-xs text-on-surface">
                <span className="material-symbols-outlined text-outline text-[20px]">notifications_off</span>
                <span className="font-headline-sm text-headline-sm font-semibold">Quiet by design</span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                Next does not run background push alarms or streak guilt notifications. Executive function
                support works best when the app is a welcoming, pressure-free doorway you choose to open—never a
                nagging interruption.
              </p>
            </div>
          </section>

          {/* SECTION 4: PRIVACY & LOCAL DATA */}
          <section className="flex flex-col space-y-space-sm">
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline px-space-xs font-semibold">
              Privacy &amp; Local Data
            </span>

            {/* Local Device Storage Card */}
            <div className="bg-surface-container-low rounded-2xl p-space-md flex flex-col space-y-space-md border border-surface-container-high/30">
              <div className="flex items-center justify-between">
                <span className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                  Local device storage
                </span>
                <span className="font-label-sm text-label-sm px-2.5 py-0.5 rounded-full bg-secondary-fixed/15 text-secondary font-semibold">
                  100% Private
                </span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                All tasks, routines, check-in ratings, and journal reflections are stored exclusively in your
                browser/device LocalStorage. Backups are exported as unencrypted JSON files.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col gap-space-xs pt-1">
                <button
                  type="button"
                  onClick={handleExportData}
                  className="w-full flex items-center justify-center gap-2 py-3 px-space-md rounded-full bg-surface-container-high hover:bg-surface-variant text-on-surface font-label-lg text-label-lg transition-transform active:scale-98 font-semibold"
                >
                  <span className="material-symbols-outlined text-[18px]">download</span>
                  <span>Export JSON Backup</span>
                </button>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full flex items-center justify-center gap-2 py-3 px-space-md rounded-full bg-transparent hover:bg-surface-container-high text-on-surface font-label-lg text-label-lg transition-colors font-medium border border-surface-container-high"
                >
                  <span className="material-symbols-outlined text-[18px]">upload</span>
                  <span>Restore Backup</span>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json,application/json"
                  className="hidden"
                  onChange={handleImportFile}
                />
              </div>
            </div>

            {/* Management List */}
            <div className="bg-surface-container-low rounded-2xl flex flex-col border border-surface-container-high/30">
              {/* Start with an empty day */}
              <button
                type="button"
                onClick={handleEmptyDay}
                className="p-space-md flex items-center justify-between gap-space-md text-left hover:bg-surface-container transition-colors rounded-t-2xl group"
              >
                <div className="flex flex-col min-w-0 pr-space-xs">
                  <span className="font-body-md text-body-md text-on-surface font-medium group-hover:text-primary-container transition-colors">
                    Start with an empty day
                  </span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">
                    Clear active tasks for today without touching routines or history
                  </span>
                </div>
                <span className="material-symbols-outlined text-outline group-hover:text-on-surface text-[20px] shrink-0 transition-colors">
                  delete_outline
                </span>
              </button>

              <div className="h-px bg-surface-container mx-space-md"></div>

              {/* Reset to sample templates */}
              <button
                type="button"
                onClick={handleResetTemplates}
                className="p-space-md flex items-center justify-between gap-space-md text-left hover:bg-surface-container transition-colors group"
              >
                <div className="flex flex-col min-w-0 pr-space-xs">
                  <span className="font-body-md text-body-md text-on-surface font-medium group-hover:text-primary-container transition-colors">
                    Reset to sample templates
                  </span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">
                    Restore default tasks, sample routines, and fresh onboarding templates
                  </span>
                </div>
                <span className="material-symbols-outlined text-outline group-hover:text-on-surface text-[20px] shrink-0 transition-colors">
                  restart_alt
                </span>
              </button>

              <div className="h-px bg-surface-container mx-space-md"></div>

              {/* Clear all personal data (Danger Zone) */}
              <button
                type="button"
                onClick={handleConfirmClearAll}
                className="p-space-md flex items-center justify-between gap-space-md text-left hover:bg-surface-container transition-colors rounded-b-2xl group"
              >
                <div className="flex flex-col min-w-0 pr-space-xs">
                  <span className="font-body-md text-body-md text-error font-medium group-hover:underline">
                    Clear all personal data
                  </span>
                  <span className="font-body-sm text-body-sm text-error/80">
                    Permanently erase all local tasks, reflections, routines, and reset to zero
                  </span>
                </div>
                <span className="material-symbols-outlined text-error text-[20px] shrink-0">warning</span>
              </button>
            </div>
          </section>
        </div>
      </main>

      {/* Ambient Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-24 inset-x-6 mx-auto max-w-sm bg-surface-container-highest text-on-surface px-4 py-3 rounded-full shadow-2xl flex items-center justify-center gap-2 transition-all duration-300 z-50 animate-fade-in border border-primary-container/30">
          <span className="material-symbols-outlined text-primary-container text-[18px]">check_circle</span>
          <span className="font-body-sm text-body-sm font-medium">{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
