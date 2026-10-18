'use client';

import { SymbolIcon } from '@/components/ui/SymbolIcon';
import React, { useState } from 'react';
import { useApp } from '@/lib/store';

export function OnboardingFlow() {
  const { completeOnboarding, addTask, updateSettings } = useApp();
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Step 2: Accent Theme
  const [accent, setAccent] = useState<'amber' | 'mint'>('amber');

  // Step 3: Starting Pace
  const [pace, setPace] = useState<'gentle' | 'balanced' | 'structured'>('gentle');

  // Step 4: First Step Choice
  const [firstStepChoice, setFirstStepChoice] = useState<'task' | 'empty'>('task');
  const [taskInput, setTaskInput] = useState('');

  const handleFinish = () => {
    // Persist accent + difficulty before completing
    updateSettings({ accentPalette: accent, startingDifficulty: pace });
    if (firstStepChoice === 'task' && taskInput.trim()) {
      // timeCategory 'today' — user must explicitly choose to start it
      addTask({
        title: taskInput.trim(),
        category: 'productive',
        icon: '🌱',
        timeCategory: 'today',
        durationMinutes: 15,
        priority: 'must',
        minimum: `Take 1 small step towards: ${taskInput.trim()}`,
        normal: taskInput.trim(),
        steps: [
          { id: `ob-step-${Date.now()}`, title: '2 minutes of effortless start', completed: false, isMinimum: true },
        ],
        companyPreference: 'no_preference',
      });
      completeOnboarding('empty', undefined, pace);
    } else {
      completeOnboarding('empty', undefined, pace);
    }
  };

  return (
    <div className="min-h-screen bg-background font-body-md text-body-md text-on-surface antialiased flex flex-col selection:bg-primary-container selection:text-on-primary-fixed select-none">
      <main className="flex-1 flex flex-col relative w-full bg-background">
        <div className="flex flex-col w-full px-gutter-mobile max-w-xl mx-auto pb-safe">
          {/* Top Brand Header & Progress */}
          <header className="w-full flex flex-col items-center pt-space-md pb-space-md">
            <div className="w-full flex items-center justify-between mb-3">
              <div className="flex items-center gap-space-xs">
                <span className="w-2.5 h-2.5 rounded-full bg-primary-container inline-block shadow-[0_0_8px_rgba(255,185,99,0.4)]"></span>
                <span className="font-headline-sm text-headline-sm text-on-surface tracking-tight font-bold">
                  Next
                </span>
              </div>
              {/* Skip always available — persists whatever the user selected so far */}
              <button
                type="button"
                onClick={() => {
                  updateSettings({ accentPalette: accent, startingDifficulty: pace });
                  completeOnboarding('empty', undefined, pace);
                }}
                className="font-label-md text-label-md text-on-surface-variant hover:text-on-surface transition-colors px-2 py-1 rounded-lg"
              >
                Skip
              </button>
            </div>

            {/* 4-step progress indicator */}
            <div className="flex items-center gap-2" role="progressbar" aria-valuenow={step} aria-valuemin={1} aria-valuemax={4}>
              <div
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  step === 1 ? 'w-7 bg-primary-container' : 'w-1.5 bg-surface-container-high'
                }`}
              ></div>
              <div
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  step === 2 ? 'w-7 bg-primary-container' : 'w-1.5 bg-surface-container-high'
                }`}
              ></div>
              <div
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  step === 3 ? 'w-7 bg-primary-container' : 'w-1.5 bg-surface-container-high'
                }`}
              ></div>
              <div
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  step === 4 ? 'w-7 bg-primary-container' : 'w-1.5 bg-surface-container-high'
                }`}
              ></div>
            </div>
          </header>

          {/* STEP 1: Philosophy & Welcome */}
          {step === 1 && (
            <div className="flex flex-col animate-fade-in">
              <div className="mb-5 flex items-center justify-between border-b border-outline-variant pb-3 text-sm">
                <span className="font-medium text-primary">Start gently</span>
                <span className="text-on-surface-variant">Step 1 of 4</span>
              </div>

              {/* Narrative */}
              <div className="flex flex-col text-left mb-space-md">
                <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface tracking-tight mb-2 font-bold">
                  You don&apos;t have to do everything today.
                </h1>
                <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                  Next is built to help you start small, manage your energy honestly, and return after interruptions without guilt.
                </p>
              </div>

              {/* The 2-Minute Minimum Feature Highlight */}
              <div className="w-full bg-surface-container-low border border-surface-container-high rounded-2xl p-space-md mb-space-lg shadow-sm">
                <div className="flex items-start gap-space-sm">
                  <div className="w-10 h-10 rounded-full bg-primary-container/15 border border-primary-container/30 flex items-center justify-center shrink-0 text-primary-container mt-0.5">
                    <SymbolIcon name="hourglass_bottom" className="text-[20px]" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h2 className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                        The 2-Minute Minimum
                      </h2>
                      <span className="bg-primary-container/20 border border-primary-container/30 text-primary-container font-label-sm text-label-sm px-2 py-0.5 rounded-full font-medium">
                        Gentle rule
                      </span>
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                      An effortless threshold to help you begin, not a new obligation. If you stop at two minutes, that counts as complete success.
                    </p>
                  </div>
                </div>
              </div>

              {/* Continue CTA */}
              <button
                type="button"
                onClick={() => setStep(2)}
                className="w-full py-4 rounded-full bg-primary-container text-on-primary-container font-label-lg text-label-lg font-semibold shadow-lg hover:bg-primary-fixed active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                <span>Continue</span>
                <SymbolIcon name="arrow_forward" className="text-[18px]" />
              </button>
            </div>
          )}

          {/* STEP 2: Accent Theme */}
          {step === 2 && (
            <div className="flex flex-col animate-fade-in">
              <div className="flex flex-col text-left mb-space-md pt-2">
                <span className="font-label-sm text-label-sm text-primary-container font-semibold uppercase tracking-wider mb-1">
                  Step 2 of 4 • Aesthetics
                </span>
                <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface tracking-tight mb-2 font-bold">
                  Choose your calm accent.
                </h1>
                <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                  A visual tone that greets you with gentle presence every time you open Next.
                </p>
              </div>

              <div className="flex flex-col gap-space-sm mb-space-lg">
                {/* Warm Amber */}
                <button
                  type="button"
                  onClick={() => setAccent('amber')}
                  className={`p-space-md rounded-2xl flex items-center justify-between text-left transition-all border ${
                    accent === 'amber'
                      ? 'bg-surface-container-high border-primary-container shadow-md'
                      : 'bg-surface-container-low border-surface-container-high'
                  }`}
                >
                  <div className="flex items-center gap-space-sm">
                    <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-on-primary-fixed shadow-sm">
                      <SymbolIcon name="wb_sunny" className="text-[20px]" />
                    </div>
                    <div>
                      <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                        Warm Amber
                      </h3>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">
                        Golden amber, grounded oat, calm clarity
                      </p>
                    </div>
                  </div>
                  <div className="w-6 h-6 rounded-full border border-primary-container flex items-center justify-center">
                    {accent === 'amber' && (
                      <span className="w-3.5 h-3.5 rounded-full bg-primary-container"></span>
                    )}
                  </div>
                </button>

                {/* Gentle Mint */}
                <button
                  type="button"
                  onClick={() => setAccent('mint')}
                  className={`p-space-md rounded-2xl flex items-center justify-between text-left transition-all border ${
                    accent === 'mint'
                      ? 'bg-surface-container-high border-secondary shadow-md'
                      : 'bg-surface-container-low border-surface-container-high'
                  }`}
                >
                  <div className="flex items-center gap-space-sm">
                    <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-on-secondary shadow-sm">
                      <SymbolIcon name="spa" className="text-[20px]" />
                    </div>
                    <div>
                      <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                        Gentle Mint
                      </h3>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">
                        Restorative sage, quiet forest, serene stillness
                      </p>
                    </div>
                  </div>
                  <div className="w-6 h-6 rounded-full border border-secondary flex items-center justify-center">
                    {accent === 'mint' && (
                      <span className="w-3.5 h-3.5 rounded-full bg-secondary"></span>
                    )}
                  </div>
                </button>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="py-4 px-6 rounded-full bg-surface-container-high text-on-surface font-label-lg text-label-lg font-semibold active:scale-[0.98] transition-all"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => {
                    // Apply accent live when moving to next step
                    updateSettings({ accentPalette: accent });
                    setStep(3);
                  }}
                  className="flex-1 py-4 rounded-full bg-primary-container text-on-primary-container font-label-lg text-label-lg font-semibold shadow-lg hover:bg-primary-fixed active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                  <span>Continue</span>
                  <SymbolIcon name="arrow_forward" className="text-[18px]" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Starting Pace & Duration */}
          {step === 3 && (
            <div className="flex flex-col animate-fade-in">
              <div className="flex flex-col text-left mb-space-md pt-2">
                <span className="font-label-sm text-label-sm text-primary-container font-semibold uppercase tracking-wider mb-1">
                  Step 3 of 4 • Rhythm
                </span>
                <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface tracking-tight mb-2 font-bold">
                  Find your starting pace.
                </h1>
                <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                  Executive function shifts with life. Choose the density that feels right right now.
                </p>
              </div>

              <div className="flex flex-col gap-space-sm mb-space-lg">
                {/* Gentle */}
                <button
                  type="button"
                  onClick={() => setPace('gentle')}
                  className={`p-space-md rounded-2xl flex items-center justify-between text-left transition-all border ${
                    pace === 'gentle'
                      ? 'bg-surface-container-high border-primary-container shadow-md'
                      : 'bg-surface-container-low border-surface-container-high'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold">Gentle</h3>
                      <span className="px-2 py-0.5 rounded-full bg-secondary-container/20 text-secondary font-label-sm text-label-sm">
                        Recommended
                      </span>
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                      Focus strictly on the next minimum. Zero pressure, low friction.
                    </p>
                  </div>
                  <div className="w-6 h-6 rounded-full border border-primary-container flex items-center justify-center shrink-0 ml-3">
                    {pace === 'gentle' && (
                      <span className="w-3.5 h-3.5 rounded-full bg-primary-container"></span>
                    )}
                  </div>
                </button>

                {/* Balanced */}
                <button
                  type="button"
                  onClick={() => setPace('balanced')}
                  className={`p-space-md rounded-2xl flex items-center justify-between text-left transition-all border ${
                    pace === 'balanced'
                      ? 'bg-surface-container-high border-primary-container shadow-md'
                      : 'bg-surface-container-low border-surface-container-high'
                  }`}
                >
                  <div>
                    <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold">Balanced</h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                      A comfortable sequence with flexible estimates and gentle pacing.
                    </p>
                  </div>
                  <div className="w-6 h-6 rounded-full border border-primary-container flex items-center justify-center shrink-0 ml-3">
                    {pace === 'balanced' && (
                      <span className="w-3.5 h-3.5 rounded-full bg-primary-container"></span>
                    )}
                  </div>
                </button>

                {/* Structured */}
                <button
                  type="button"
                  onClick={() => setPace('structured')}
                  className={`p-space-md rounded-2xl flex items-center justify-between text-left transition-all border ${
                    pace === 'structured'
                      ? 'bg-surface-container-high border-primary-container shadow-md'
                      : 'bg-surface-container-low border-surface-container-high'
                  }`}
                >
                  <div>
                    <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold">Structured</h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                      Detailed step breakdowns and explicit time horizons.
                    </p>
                  </div>
                  <div className="w-6 h-6 rounded-full border border-primary-container flex items-center justify-center shrink-0 ml-3">
                    {pace === 'structured' && (
                      <span className="w-3.5 h-3.5 rounded-full bg-primary-container"></span>
                    )}
                  </div>
                </button>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="py-4 px-6 rounded-full bg-surface-container-high text-on-surface font-label-lg text-label-lg font-semibold active:scale-[0.98] transition-all"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(4)}
                  className="flex-1 py-4 rounded-full bg-primary-container text-on-primary-container font-label-lg text-label-lg font-semibold shadow-lg hover:bg-primary-fixed active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                  <span>Continue</span>
                  <SymbolIcon name="arrow_forward" className="text-[18px]" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: First Step */}
          {step === 4 && (
            <div className="flex flex-col animate-fade-in">
              <div className="flex flex-col text-left mb-space-md pt-2">
                <span className="font-label-sm text-label-sm text-primary-container font-semibold uppercase tracking-wider mb-1">
                  Step 4 of 4 • Arrival
                </span>
                <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface tracking-tight mb-2 font-bold">
                  Let&apos;s start with today.
                </h1>
                <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                  You don&apos;t need a complete plan. One small thing is enough. An empty day is okay, too.
                </p>
              </div>

              <div className="flex flex-col gap-space-sm mb-space-lg">
                {/* Choice 1: Add one realistic thing */}
                <div
                  onClick={() => setFirstStepChoice('task')}
                  className={`p-space-md rounded-2xl cursor-pointer transition-all border ${
                    firstStepChoice === 'task'
                      ? 'bg-surface-container-high border-primary-container shadow-md'
                      : 'bg-surface-container-low border-surface-container-high'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-space-sm">
                      <div className="w-10 h-10 rounded-full bg-primary-container/20 border border-primary-container/40 flex items-center justify-center text-primary-container shrink-0">
                        <SymbolIcon name="edit_note" className="text-[20px]" />
                      </div>
                      <div>
                        <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                          Add one realistic thing
                        </h3>
                        <span className="font-label-sm text-label-sm text-primary-container font-semibold">
                          Gentle momentum • 2 min ease-in
                        </span>
                      </div>
                    </div>
                    <div className="w-6 h-6 rounded-full border border-primary-container flex items-center justify-center shrink-0">
                      {firstStepChoice === 'task' && (
                        <span className="w-3.5 h-3.5 rounded-full bg-primary-container"></span>
                      )}
                    </div>
                  </div>

                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-2 leading-relaxed">
                    Jot down the single micro-action or task you&apos;d like to ease into today. We&apos;ll give you a 2-minute starting threshold.
                  </p>

                  {/* Intention Input */}
                  <div className="mt-3 flex flex-col gap-1.5" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="text"
                      value={taskInput}
                      onChange={(e) => setTaskInput(e.target.value)}
                      placeholder="e.g., Water the kitchen fern, read 3 pages"
                      className="w-full h-12 px-4 rounded-full bg-surface-container-lowest border border-surface-container-high text-on-surface placeholder:text-on-surface-variant font-body-sm text-body-sm focus:outline-none focus:border-primary-container transition-all"
                    />
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      <span className="font-label-sm text-label-sm text-on-surface-variant mr-1">Tender sparks:</span>
                      <button
                        type="button"
                        onClick={() => setTaskInput('Stretch for 3 minutes')}
                        className="px-2.5 py-1 rounded-full bg-surface-container-high text-on-surface font-label-sm text-label-sm hover:text-primary-container transition-colors"
                      >
                        Stretch 3m
                      </button>
                      <button
                        type="button"
                        onClick={() => setTaskInput('Clear workspace desk')}
                        className="px-2.5 py-1 rounded-full bg-surface-container-high text-on-surface font-label-sm text-label-sm hover:text-primary-container transition-colors"
                      >
                        Clear desk
                      </button>
                      <button
                        type="button"
                        onClick={() => setTaskInput('Brew afternoon tea')}
                        className="px-2.5 py-1 rounded-full bg-surface-container-high text-on-surface font-label-sm text-label-sm hover:text-primary-container transition-colors"
                      >
                        Brew tea
                      </button>
                    </div>
                  </div>
                </div>

                {/* Choice 2: Start with an empty day */}
                <div
                  onClick={() => setFirstStepChoice('empty')}
                  className={`p-space-md rounded-2xl cursor-pointer transition-all border ${
                    firstStepChoice === 'empty'
                      ? 'bg-surface-container-high border-primary-container shadow-md'
                      : 'bg-surface-container-low border-surface-container-high'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-space-sm">
                      <div className="w-10 h-10 rounded-full bg-secondary-container/20 border border-secondary/40 flex items-center justify-center text-secondary shrink-0">
                        <SymbolIcon name="spa" className="text-[20px]" />
                      </div>
                      <div>
                        <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                          Start with an empty day
                        </h3>
                        <span className="font-label-sm text-label-sm text-secondary font-semibold">
                          Calm slate • Zero expectations
                        </span>
                      </div>
                    </div>
                    <div className="w-6 h-6 rounded-full border border-primary-container flex items-center justify-center shrink-0">
                      {firstStepChoice === 'empty' && (
                        <span className="w-3.5 h-3.5 rounded-full bg-primary-container"></span>
                      )}
                    </div>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-2 leading-relaxed">
                    Begin with a calm, uncluttered slate. You can add one thing whenever you feel ready.
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="py-4 px-6 rounded-full bg-surface-container-high text-on-surface font-label-lg text-label-lg font-semibold active:scale-[0.98] transition-all"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleFinish}
                  className="flex-1 py-4 rounded-full bg-primary-container text-on-primary-container font-label-lg text-label-lg font-semibold shadow-lg hover:bg-primary-fixed active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                  <span>Open Next</span>
                  <SymbolIcon name="check" className="text-[18px]" />
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
