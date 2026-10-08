'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '@/lib/store';
import { generateBreakdown } from '@/lib/breakdownEngine';
import { sounds } from '@/lib/sounds';
import { 
  X, 
  Play, 
  Pause, 
  RotateCcw, 
  Check, 
  ArrowLeft,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';

type HelpStage = 
  | 'initial'         // "Let's make this easier. First step: ... [Start with this] [Not quite]"
  | 'easier_choices'  // "What would make this easier? Too big / Don't know where to begin / Low energy / I don't want to"
  | 'too_big'         // Atomic breakdown / step navigator
  | 'dont_know'       // Physical first motion
  | 'low_energy'      // Absolute minimum callout
  | 'dont_want_to'    // 2-minute permission
  | 'timer'           // Active countdown timer
  | 'completed';      // Celebration screen

export function HelpMeStartModal() {
  const { activeTaskId, tasks, closeModal, completeTask, settings, openModal } = useApp();

  const task = useMemo(() => {
    return tasks.find(t => t.id === activeTaskId) || null;
  }, [tasks, activeTaskId]);

  const [stage, setStage] = useState<HelpStage>('initial');

  // Steps for breakdown
  const [steps, setSteps] = useState<string[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  // Timer state
  const defaultMinutes = settings.defaultTimerMinutes || 2;
  const [timerSecondsLeft, setTimerSecondsLeft] = useState<number>(defaultMinutes * 60);
  const [timerTotalSeconds, setTimerTotalSeconds] = useState<number>(defaultMinutes * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Active step text
  const firstStepText = useMemo(() => {
    if (!task) return '';
    const minStep = task.steps?.find(s => s.isMinimum);
    if (minStep) return minStep.title;
    if (task.steps && task.steps.length > 0) return task.steps[0].title;
    if (task.minimum) return task.minimum;
    return `Open what you need for "${task.title}".`;
  }, [task]);

  useEffect(() => {
    if (task) {
      if (task.steps && task.steps.length > 0) {
        setSteps(task.steps.map(s => s.title));
      } else {
        const generated = generateBreakdown(task.title, 'simpler');
        setSteps(generated);
      }
      setCurrentStepIndex(0);
      setStage('initial');
      setIsTimerRunning(false);
      const totalSec = (settings.defaultTimerMinutes || 2) * 60;
      setTimerSecondsLeft(totalSec);
      setTimerTotalSeconds(totalSec);
    }
  }, [task, settings.defaultTimerMinutes]);

  // Timer countdown loop
  useEffect(() => {
    if (!isTimerRunning) return;

    if (timerSecondsLeft <= 0) {
      setIsTimerRunning(false);
      sounds.playMinimumComplete();
      setStage('completed');
      return;
    }

    const interval = setInterval(() => {
      setTimerSecondsLeft(prev => {
        if (prev <= 1) {
          setIsTimerRunning(false);
          sounds.playMinimumComplete();
          setStage('completed');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isTimerRunning, timerSecondsLeft]);

  if (!task) return null;

  const startTimer = (minutes: number) => {
    const totalSec = minutes * 60;
    setTimerTotalSeconds(totalSec);
    setTimerSecondsLeft(totalSec);
    setIsTimerRunning(true);
    setStage('timer');
    sounds.playStart();
  };

  const handleStartWithFirstStep = () => {
    startTimer(defaultMinutes);
  };

  const handleImDone = () => {
    completeTask(task.id, 'minimum');
    closeModal();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-end justify-center pb-[env(safe-area-inset-bottom,0px)] sm:items-center sm:p-4 bg-slate-900/40 dark:bg-slate-950/70"
      role="dialog"
      aria-modal="true"
      aria-labelledby="start-modal-title"
      onClick={closeModal}
    >
      <div
        className="modal-sheet relative w-full sm:max-w-md bg-surface dark:bg-surface-dark border-t sm:border border-slate-200/90 dark:border-slate-800 sm:rounded-3xl rounded-t-3xl shadow-2xl p-6 sm:p-7 overflow-y-auto animate-slide-up flex flex-col space-y-6"
        style={{ maxHeight: 'calc(100dvh - env(safe-area-inset-top, 0px) - env(safe-area-inset-bottom, 0px) - 1rem)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag handle (mobile) */}
        <div className="sm:hidden flex justify-center -mt-2 pb-1">
          <div className="w-10 h-1 rounded-full bg-slate-300 dark:bg-slate-600" />
        </div>

        {/* Header bar */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            {stage !== 'initial' && stage !== 'completed' && (
              <button
                type="button"
                onClick={() => {
                  if (stage === 'timer') setStage('initial');
                  else if (stage === 'easier_choices') setStage('initial');
                  else setStage('easier_choices');
                }}
                className="p-1 rounded-lg text-ink-muted hover:text-ink-primary hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors mr-1"
                aria-label="Back"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <p className="text-xs font-bold uppercase tracking-wider text-ink-muted dark:text-slate-400">
              Help me start
            </p>
          </div>
          <button
            onClick={closeModal}
            aria-label="Close"
            className="p-1.5 rounded-xl text-ink-muted hover:text-ink-primary dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1. DEFAULT LEVEL: Direct and frictionless */}
        {stage === 'initial' && (
          <div className="space-y-6 animate-fade-in text-center">
            <div className="space-y-1.5">
              <h3 id="start-modal-title" className="text-xl sm:text-2xl font-bold tracking-tight text-ink-primary dark:text-slate-100">
                Let&apos;s make this easier.
              </h3>
              <p className="text-sm text-ink-muted dark:text-slate-400">
                First step:
              </p>
            </div>

            {/* First step highlight */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800">
              <p className="text-base sm:text-lg font-semibold text-ink-primary dark:text-slate-100 leading-snug">
                {firstStepText}
              </p>
            </div>

            {/* Primary & Secondary actions */}
            <div className="space-y-2.5 pt-1">
              <button
                type="button"
                onClick={handleStartWithFirstStep}
                className="w-full py-3.5 px-5 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-base shadow-sm transition-all active:scale-[0.99]"
              >
                Start with this
              </button>

              <button
                type="button"
                onClick={() => setStage('easier_choices')}
                className="w-full py-2.5 px-4 text-xs font-medium text-ink-muted hover:text-ink-primary dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
              >
                Not quite
              </button>
            </div>
          </div>
        )}

        {/* 2. PROGRESSIVE DISCLOSURE: What would make this easier? */}
        {stage === 'easier_choices' && (
          <div className="space-y-5 animate-fade-in text-left">
            <div>
              <h3 className="text-xl font-bold tracking-tight text-ink-primary dark:text-slate-100">
                What would make this easier?
              </h3>
              <p className="text-xs text-ink-muted dark:text-slate-400 mt-1">
                Notice the friction. We&apos;ll adapt to it.
              </p>
            </div>

            <div className="space-y-2.5">
              <button
                type="button"
                onClick={() => setStage('too_big')}
                className="w-full p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-surface dark:bg-surface-dark hover:bg-slate-50 dark:hover:bg-slate-800/60 text-left transition-all active:scale-[0.99]"
              >
                <h4 className="text-sm font-semibold text-ink-primary dark:text-slate-100">
                  Too big
                </h4>
                <p className="text-xs text-ink-muted dark:text-slate-400 mt-0.5">
                  Break it into smaller, manageable chunks.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setStage('dont_know')}
                className="w-full p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-surface dark:bg-surface-dark hover:bg-slate-50 dark:hover:bg-slate-800/60 text-left transition-all active:scale-[0.99]"
              >
                <h4 className="text-sm font-semibold text-ink-primary dark:text-slate-100">
                  Don&apos;t know where to begin
                </h4>
                <p className="text-xs text-ink-muted dark:text-slate-400 mt-0.5">
                  Find the single physical motion needed to open this.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setStage('low_energy')}
                className="w-full p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-surface dark:bg-surface-dark hover:bg-slate-50 dark:hover:bg-slate-800/60 text-left transition-all active:scale-[0.99]"
              >
                <h4 className="text-sm font-semibold text-ink-primary dark:text-slate-100">
                  Low energy
                </h4>
                <p className="text-xs text-ink-muted dark:text-slate-400 mt-0.5">
                  Do the absolute minimum or switch to gentle rest.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setStage('dont_want_to')}
                className="w-full p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-surface dark:bg-surface-dark hover:bg-slate-50 dark:hover:bg-slate-800/60 text-left transition-all active:scale-[0.99]"
              >
                <h4 className="text-sm font-semibold text-ink-primary dark:text-slate-100">
                  I don&apos;t want to
                </h4>
                <p className="text-xs text-ink-muted dark:text-slate-400 mt-0.5">
                  2 minutes of low expectations, then permission to stop.
                </p>
              </button>
            </div>
          </div>
        )}

        {/* 2A. SUB-VIEW: Too Big */}
        {stage === 'too_big' && (
          <div className="space-y-5 animate-fade-in text-left">
            <div>
              <h3 className="text-xl font-bold tracking-tight text-ink-primary dark:text-slate-100">
                Smaller steps.
              </h3>
              <p className="text-xs text-ink-muted dark:text-slate-400 mt-1">
                Just look at step {currentStepIndex + 1} of {steps.length}.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 space-y-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-400">
                Step {currentStepIndex + 1}
              </span>
              <p className="text-base font-semibold text-ink-primary dark:text-slate-100 leading-snug">
                {steps[currentStepIndex] || firstStepText}
              </p>

              {steps.length > 1 && (
                <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setCurrentStepIndex(prev => Math.max(0, prev - 1))}
                    disabled={currentStepIndex === 0}
                    className="flex items-center gap-1 text-xs font-medium text-ink-muted hover:text-ink-primary disabled:opacity-40"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Previous</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentStepIndex(prev => Math.min(steps.length - 1, prev + 1))}
                    disabled={currentStepIndex === steps.length - 1}
                    className="flex items-center gap-1 text-xs font-medium text-brand-600 hover:text-brand-700 disabled:opacity-40"
                  >
                    <span>Next</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => startTimer(2)}
              className="w-full py-3.5 px-4 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm shadow-sm transition-all"
            >
              Start 2-minute timer for this step
            </button>
          </div>
        )}

        {/* 2B. SUB-VIEW: Don't know where to begin */}
        {stage === 'dont_know' && (
          <div className="space-y-5 animate-fade-in text-left">
            <div>
              <h3 className="text-xl font-bold tracking-tight text-ink-primary dark:text-slate-100">
                Find the physical starting motion.
              </h3>
              <p className="text-xs text-ink-muted dark:text-slate-400 mt-1">
                Forget the task content. What is the single physical action?
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 text-sm text-ink-secondary dark:text-slate-300 space-y-1.5">
              <p className="font-semibold text-ink-primary dark:text-slate-100">Example physical beginnings:</p>
              <ul className="list-disc list-inside space-y-1 text-xs text-ink-muted dark:text-slate-400">
                <li>Sit in your chair and adjust the screen</li>
                <li>Open the specific app or document and look at it</li>
                <li>Put hands on keyboard and type one letter or word</li>
              </ul>
            </div>

            <button
              type="button"
              onClick={() => startTimer(2)}
              className="w-full py-3.5 px-4 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm shadow-sm transition-all"
            >
              Try 2 minutes of just opening it
            </button>
          </div>
        )}

        {/* 2C. SUB-VIEW: Low energy */}
        {stage === 'low_energy' && (
          <div className="space-y-5 animate-fade-in text-left">
            <div>
              <h3 className="text-xl font-bold tracking-tight text-ink-primary dark:text-slate-100">
                Absolute minimum mode.
              </h3>
              <p className="text-xs text-ink-muted dark:text-slate-400 mt-1">
                When energy is low, doing the absolute minimum counts completely.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-brand-50/70 dark:bg-brand-950/40 border border-brand-200/70 dark:border-brand-800/60">
              <p className="text-xs font-bold uppercase tracking-wider text-brand-700 dark:text-brand-300 mb-1">
                The minimum:
              </p>
              <p className="text-base font-semibold text-brand-950 dark:text-brand-100">
                {task.minimum || 'Spend 1 minute with this activity.'}
              </p>
            </div>

            <div className="space-y-2.5">
              <button
                type="button"
                onClick={() => startTimer(1)}
                className="w-full py-3.5 px-4 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm shadow-sm transition-all"
              >
                1 minute only
              </button>
              <button
                type="button"
                onClick={() => {
                  closeModal();
                  openModal('check_in');
                }}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-medium text-ink-secondary hover:text-ink-primary transition-colors text-center"
              >
                Or check in and take care of your body first
              </button>
            </div>
          </div>
        )}

        {/* 2D. SUB-VIEW: I don't want to */}
        {stage === 'dont_want_to' && (
          <div className="space-y-5 animate-fade-in text-left">
            <div>
              <h3 className="text-xl font-bold tracking-tight text-ink-primary dark:text-slate-100">
                You don&apos;t have to want to.
              </h3>
              <p className="text-xs text-ink-muted dark:text-slate-400 mt-1">
                Motivation follows action, not the other way around.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 text-sm text-ink-secondary dark:text-slate-300">
              <p className="leading-relaxed">
                Stay with it for 2 minutes without expecting yourself to enjoy it or finish it. When the 2 minutes are up, you have full permission to stop.
              </p>
            </div>

            <button
              type="button"
              onClick={() => startTimer(2)}
              className="w-full py-3.5 px-4 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm shadow-sm transition-all"
            >
              Start 2-minute timer with permission to stop
            </button>
          </div>
        )}

        {/* 3. TIMER ACTIVE SCREEN */}
        {stage === 'timer' && (
          <div className="text-center py-2 space-y-6 animate-fade-in">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-400">
                Focus gently
              </span>
              <h4 className="text-base font-bold text-ink-primary dark:text-slate-100 mt-1 truncate">
                {firstStepText}
              </h4>
            </div>

            {/* Circular display */}
            <div className="relative w-40 h-40 mx-auto rounded-full bg-slate-50 dark:bg-slate-900 border-4 border-brand-100 dark:border-brand-950 flex flex-col items-center justify-center shadow-inner">
              <span className="text-4xl font-mono font-bold tracking-tight text-brand-900 dark:text-brand-200">
                {formatTime(timerSecondsLeft)}
              </span>
              <span className="text-[11px] text-ink-muted dark:text-slate-400 mt-1">
                {isTimerRunning ? 'in progress' : 'paused'}
              </span>
            </div>

            <p className="text-xs text-ink-muted dark:text-slate-400 italic">
              &ldquo;You don&apos;t have to finish. Just stay with it for this moment.&rdquo;
            </p>

            {/* Timer controls */}
            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                className="p-3.5 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white shadow-sm transition-all"
                aria-label={isTimerRunning ? 'Pause' : 'Play'}
              >
                {isTimerRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
              </button>

              <button
                type="button"
                onClick={() => {
                  sounds.playMinimumComplete();
                  setStage('completed');
                }}
                className="py-3 px-4 rounded-2xl bg-gentle-greenBg text-gentle-green hover:bg-emerald-100 font-medium text-xs sm:text-sm transition-colors"
              >
                I did the minimum
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsTimerRunning(false);
                  setStage('initial');
                }}
                className="p-3 rounded-2xl text-ink-muted hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Reset"
                aria-label="Reset timer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* 4. COMPLETED SCREEN */}
        {stage === 'completed' && (
          <div className="text-center py-4 space-y-5 animate-fade-in">
            <div className="w-14 h-14 rounded-full bg-gentle-greenBg text-gentle-green mx-auto flex items-center justify-center shadow-sm">
              <Check className="w-7 h-7" />
            </div>

            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-ink-primary dark:text-slate-100">
                You did the minimum.
              </h3>
              <p className="text-sm text-ink-muted dark:text-slate-400 mt-1">
                That counts. You overcame the inertia.
              </p>
            </div>

            <div className="pt-3 flex flex-col gap-2.5">
              <button
                type="button"
                onClick={handleImDone}
                className="w-full py-3.5 px-5 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm shadow-sm transition-all"
              >
                I&apos;m done for now
              </button>
              <button
                type="button"
                onClick={closeModal}
                className="w-full py-3 px-5 rounded-2xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-ink-secondary dark:text-slate-200 font-medium text-sm transition-all"
              >
                Keep going
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
