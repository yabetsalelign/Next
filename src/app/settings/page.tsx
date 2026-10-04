'use client';

import React from 'react';
import { useApp } from '@/lib/store';
import { 
  Moon, 
  Sun, 
  Volume2, 
  VolumeX, 
  RotateCcw, 
  Heart, 
  Clock,
  Sparkles,
  BookOpen,
  RefreshCw
} from 'lucide-react';

export default function SettingsPage() {
  const { settings, updateSettings, resetToDemoData, activeReset, archiveReset } = useApp();

  return (
    <div className="max-w-2xl mx-auto space-y-7 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-ink-primary dark:text-slate-100">
          Settings
        </h1>
        <p className="text-xs sm:text-sm text-ink-muted dark:text-slate-400 mt-1">
          Adjust the app to match your sensory and initiation preferences.
        </p>
      </div>

      {/* Appearance */}
      <section className="p-6 rounded-3xl bg-surface dark:bg-surface-dark border border-slate-200/90 dark:border-slate-800 shadow-card space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-ink-muted dark:text-slate-400">
          Appearance
        </h2>

        <div className="grid grid-cols-3 gap-2.5">
          {[
            { id: 'light', label: 'Light', icon: Sun },
            { id: 'dark', label: 'Dark', icon: Moon },
            { id: 'system', label: 'System', icon: RefreshCw },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => updateSettings({ theme: item.id as any })}
              className={`flex flex-col items-center justify-center p-3.5 rounded-2xl border text-xs font-semibold transition-all ${
                settings.theme === item.id
                  ? 'bg-brand-50 dark:bg-brand-950/50 border-brand-500 text-brand-700 dark:text-brand-300 shadow-sm'
                  : 'border-slate-200 dark:border-slate-800 text-ink-secondary dark:text-slate-300 hover:bg-slate-50'
              }`}
            >
              <item.icon className="w-4 h-4 mb-1.5" />
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Activation Timer Defaults */}
      <section className="p-6 rounded-3xl bg-surface dark:bg-surface-dark border border-slate-200/90 dark:border-slate-800 shadow-card space-y-4">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-brand-600 dark:text-brand-400" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-ink-muted dark:text-slate-400">
            Default Start Timer
          </h2>
        </div>
        <p className="text-xs text-ink-subtle">
          The default duration suggested in &ldquo;Help Me Start&rdquo;.
        </p>

        <div className="grid grid-cols-3 gap-2.5">
          {[2, 5, 10].map((mins) => (
            <button
              key={mins}
              type="button"
              onClick={() => updateSettings({ defaultTimerMinutes: mins as any })}
              className={`py-3 px-4 rounded-2xl border text-xs font-semibold text-center transition-all ${
                settings.defaultTimerMinutes === mins
                  ? 'bg-brand-50 dark:bg-brand-950/50 border-brand-500 text-brand-700 dark:text-brand-300 shadow-sm'
                  : 'border-slate-200 dark:border-slate-800 text-ink-secondary dark:text-slate-300 hover:bg-slate-50'
              }`}
            >
              {mins} Minutes
            </button>
          ))}
        </div>
      </section>

      {/* Wellness Features */}
      <section className="p-6 rounded-3xl bg-surface dark:bg-surface-dark border border-slate-200/90 dark:border-slate-800 shadow-card space-y-4">
        <div className="flex items-center gap-2">
          <Heart className="w-4 h-4 text-brand-500 dark:text-brand-400" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-ink-muted dark:text-slate-400">
            Self-Care & Wellness
          </h2>
        </div>

        <div className="space-y-3">
          {/* Wellness enabled */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50/60 dark:bg-slate-900/40">
            <div className="flex items-center gap-3">
              <Heart className="w-5 h-5 text-brand-500" />
              <div>
                <p className="text-xs sm:text-sm font-semibold text-ink-primary dark:text-slate-100">
                  Wellness features
                </p>
                <p className="text-[11px] text-ink-muted">
                  Self-care routines, presets, and body-care tracking.
                </p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={settings.wellnessEnabled ?? true}
              onChange={(e) => updateSettings({ wellnessEnabled: e.target.checked })}
              className="w-5 h-5 rounded text-brand-600 focus:ring-brand-500 cursor-pointer"
            />
          </div>

          {/* Active Reset */}
          {activeReset && (
            <div className="p-3.5 rounded-2xl bg-brand-50/60 dark:bg-brand-950/30 border border-brand-200/60 dark:border-brand-900/40 space-y-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                <p className="text-xs font-semibold text-brand-800 dark:text-brand-200">Active Reset</p>
              </div>
              <p className="text-sm font-semibold text-ink-primary dark:text-slate-100">{activeReset.name}</p>
              <p className="text-xs text-ink-muted dark:text-slate-400">
                {activeReset.startDate} → {activeReset.endDate}
              </p>
              <button
                type="button"
                onClick={() => {
                  if (confirm('Archive this reset? Your progress will be saved.')) {
                    archiveReset(activeReset.id);
                  }
                }}
                className="text-xs text-ink-muted hover:text-ink-primary font-medium underline underline-offset-2"
              >
                Archive this reset
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Audio & Sensory */}
      <section className="p-6 rounded-3xl bg-surface dark:bg-surface-dark border border-slate-200/90 dark:border-slate-800 shadow-card space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-ink-muted dark:text-slate-400">
          Sensory & Accessibility
        </h2>

        <div className="space-y-3">
          {/* Sound chimes */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50/60 dark:bg-slate-900/40">
            <div className="flex items-center gap-3">
              {settings.soundEnabled ? <Volume2 className="w-5 h-5 text-brand-500" /> : <VolumeX className="w-5 h-5 text-ink-muted" />}
              <div>
                <p className="text-xs sm:text-sm font-semibold text-ink-primary dark:text-slate-100">
                  Calm sound chimes
                </p>
                <p className="text-[11px] text-ink-muted">
                  Subtle, gentle harmonic frequencies when completing the minimum.
                </p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={settings.soundEnabled}
              onChange={(e) => updateSettings({ soundEnabled: e.target.checked })}
              className="w-5 h-5 rounded text-brand-600 focus:ring-brand-500 cursor-pointer"
            />
          </div>

          {/* Reduced motion */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50/60 dark:bg-slate-900/40">
            <div>
              <p className="text-xs sm:text-sm font-semibold text-ink-primary dark:text-slate-100">
                Reduced motion
              </p>
              <p className="text-[11px] text-ink-muted">
                Minimizes subtle UI transitions and breathing pulses.
              </p>
            </div>
            <input
              type="checkbox"
              checked={settings.reducedMotion}
              onChange={(e) => updateSettings({ reducedMotion: e.target.checked })}
              className="w-5 h-5 rounded text-brand-600 focus:ring-brand-500 cursor-pointer"
            />
          </div>
        </div>
      </section>

      {/* Demo & Storage Data */}
      <section className="p-6 rounded-3xl bg-surface dark:bg-surface-dark border border-slate-200/90 dark:border-slate-800 shadow-card space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-ink-muted dark:text-slate-400">
          Data & Prototype
        </h2>

        <p className="text-xs text-ink-muted">
          Your tasks, routines, wellness data, and journal entries are stored locally in your browser (LocalStorage). No external servers are tracking your day.
        </p>

        <div className="pt-1">
          <button
            type="button"
            onClick={() => {
              if (window.confirm('Reset all tasks and routines to original realistic sample data?')) {
                resetToDemoData();
              }
            }}
            className="flex items-center gap-2 py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-ink-secondary dark:text-slate-200 transition-colors"
          >
            <RotateCcw className="w-4 h-4 text-brand-500" />
            <span>Reset to realistic sample data</span>
          </button>
        </div>
      </section>

      {/* About */}
      <section className="p-6 rounded-3xl bg-surface dark:bg-surface-dark border border-slate-200/90 dark:border-slate-800 shadow-card space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-brand-600 text-white font-bold flex items-center justify-center text-xs">
            N
          </div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-ink-primary dark:text-slate-200">
            About Next
          </h2>
        </div>

        <p className="text-xs sm:text-sm text-ink-secondary dark:text-slate-300 leading-relaxed">
          <span className="font-semibold text-ink-primary dark:text-slate-100">Next. Not everything.</span> Designed for task initiation, overwhelm reduction, routines, self-care, and guilt-free returns after falling off.
        </p>
        <div className="space-y-1 text-[11px] text-ink-subtle">
          <p>The minimum counts.</p>
          <p>You don&apos;t have to catch up.</p>
          <p>Returning matters more than streaks.</p>
          <p>Take care of yourself before trying to optimize yourself.</p>
        </div>
        <p className="text-[11px] text-ink-subtle">
          Version 1.1 • Built with Next.js, TypeScript & Tailwind CSS.
        </p>
      </section>
    </div>
  );
}
