'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import { Check } from 'lucide-react';

const GOAL_OPTIONS = [
  { id: 'starting', label: 'Starting things' },
  { id: 'routines', label: 'Daily routines' },
  { id: 'care', label: 'Taking care of myself' },
  { id: 'returning', label: 'Getting back on track' },
];

const STRUCTURE_OPTIONS: { id: 'gentle' | 'balanced' | 'structured'; label: string; desc: string }[] = [
  { id: 'gentle', label: 'Gentle', desc: 'Focus strictly on the next minimum. Zero pressure.' },
  { id: 'balanced', label: 'Balanced', desc: 'A modest sequence with gentle reminders.' },
  { id: 'structured', label: 'Structured', desc: 'Clear routines, time estimates, and step breakdowns.' },
];

export function OnboardingFlow() {
  const { completeOnboarding } = useApp();
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedGoals, setSelectedGoals] = useState<string[]>(['starting']);
  const [selectedStructure, setSelectedStructure] = useState<'gentle' | 'balanced' | 'structured'>('gentle');

  const toggleGoal = (id: string) => {
    setSelectedGoals(prev => 
      prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]
    );
  };

  const handleFinish = (mode: 'empty' | 'example') => {
    completeOnboarding(mode, selectedGoals, selectedStructure);
  };

  return (
    <div className="max-w-md mx-auto my-6 sm:my-10 p-6 sm:p-8 rounded-3xl bg-surface dark:bg-surface-dark border border-slate-200/90 dark:border-slate-800 shadow-card animate-fade-in text-center space-y-6">
      
      {/* Step 1: Welcome to Next */}
      {step === 1 && (
        <div className="space-y-6 animate-fade-in">
          <div className="w-12 h-12 rounded-2xl bg-brand-600 text-white font-bold text-xl flex items-center justify-center mx-auto shadow-sm">
            N
          </div>

          <div className="space-y-3">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-ink-primary dark:text-slate-100">
              Welcome to Next
            </h2>
            <p className="text-base text-ink-secondary dark:text-slate-300 leading-relaxed max-w-xs mx-auto">
              You don&apos;t need to organize your whole life.
            </p>
            <p className="text-sm text-ink-muted dark:text-slate-400">
              Let&apos;s make the next thing easier.
            </p>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="w-full py-3.5 px-6 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-base shadow-sm transition-all active:scale-[0.99]"
            >
              Get started
            </button>
          </div>
        </div>
      )}

      {/* Step 2: What would you like help with? */}
      {step === 2 && (
        <div className="space-y-6 animate-fade-in text-left">
          <div className="text-center space-y-1">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-ink-primary dark:text-slate-100">
              What would you like help with?
            </h2>
            <p className="text-xs sm:text-sm text-ink-muted dark:text-slate-400">
              Select any areas that resonate right now.
            </p>
          </div>

          <div className="space-y-2.5">
            {GOAL_OPTIONS.map((g) => {
              const isChecked = selectedGoals.includes(g.id);
              return (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => toggleGoal(g.id)}
                  className={`w-full flex items-center gap-3.5 p-4 rounded-2xl border transition-all text-left ${
                    isChecked
                      ? 'border-brand-500 bg-brand-50/70 dark:bg-brand-950/40 text-brand-900 dark:text-brand-200'
                      : 'border-slate-200/80 dark:border-slate-800 bg-surface dark:bg-surface-dark text-ink-primary dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-lg border flex items-center justify-center shrink-0 transition-colors ${
                    isChecked
                      ? 'bg-brand-600 border-brand-600 text-white'
                      : 'border-slate-300 dark:border-slate-600'
                  }`}>
                    {isChecked && <Check className="w-3.5 h-3.5" />}
                  </div>
                  <span className="text-sm font-medium">{g.label}</span>
                </button>
              );
            })}
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={() => setStep(3)}
              className="w-full py-3.5 px-6 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-base shadow-sm transition-all active:scale-[0.99]"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* Step 3: How much structure feels right? */}
      {step === 3 && (
        <div className="space-y-6 animate-fade-in text-left">
          <div className="text-center space-y-1">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-ink-primary dark:text-slate-100">
              How much structure feels right?
            </h2>
            <p className="text-xs sm:text-sm text-ink-muted dark:text-slate-400">
              You can change this anytime in Settings.
            </p>
          </div>

          <div className="space-y-2.5">
            {STRUCTURE_OPTIONS.map((opt) => {
              const isSelected = selectedStructure === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setSelectedStructure(opt.id)}
                  className={`w-full p-4 rounded-2xl border transition-all text-left ${
                    isSelected
                      ? 'border-brand-500 bg-brand-50/70 dark:bg-brand-950/40'
                      : 'border-slate-200/80 dark:border-slate-800 bg-surface dark:bg-surface-dark hover:bg-slate-50 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-ink-primary dark:text-slate-100">
                      {opt.label}
                    </span>
                    {isSelected && (
                      <span className="w-2 h-2 rounded-full bg-brand-600 dark:bg-brand-400" />
                    )}
                  </div>
                  <p className="text-xs text-ink-muted dark:text-slate-400 mt-1">
                    {opt.desc}
                  </p>
                </button>
              );
            })}
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={() => setStep(4)}
              className="w-full py-3.5 px-6 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-base shadow-sm transition-all active:scale-[0.99]"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* Step 4: How would you like to begin? */}
      {step === 4 && (
        <div className="space-y-6 animate-fade-in">
          <div className="space-y-1.5">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-ink-primary dark:text-slate-100">
              How would you like to begin?
            </h2>
            <p className="text-xs sm:text-sm text-ink-muted dark:text-slate-400">
              Pick what feels lowest friction today.
            </p>
          </div>

          <div className="flex flex-col gap-3 pt-2">
            <button
              type="button"
              onClick={() => handleFinish('empty')}
              className="w-full py-3.5 px-5 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm sm:text-base shadow-sm transition-all active:scale-[0.99]"
            >
              Start with an empty day
            </button>

            <button
              type="button"
              onClick={() => handleFinish('example')}
              className="w-full py-3.5 px-5 rounded-2xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-ink-primary dark:text-slate-200 font-semibold text-sm sm:text-base transition-colors"
            >
              Explore an example
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
