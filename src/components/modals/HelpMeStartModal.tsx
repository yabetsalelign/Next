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
  ChevronRight, 
  ChevronLeft, 
  ArrowRight,
  Clock,
  Sparkles
} from 'lucide-react';

export function HelpMeStartModal() {
  const { activeTaskId, tasks, closeModal, completeTask } = useApp();

  const task = useMemo(() => {
    return tasks.find(t => t.id === activeTaskId) || null;
  }, [tasks, activeTaskId]);

  // Steps for initiation
  const [steps, setSteps] = useState<string[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  // Timer state
  const [timerSecondsLeft, setTimerSecondsLeft] = useState<number | null>(null);
  const [timerTotalSeconds, setTimerTotalSeconds] = useState<number>(120);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [minimumCompleted, setMinimumCompleted] = useState(false);

  useEffect(() => {
    if (task) {
      if (task.steps && task.steps.length > 0) {
        setSteps(task.steps.map(s => s.title));
      } else {
        const generated = generateBreakdown(task.title, 'simpler');
        setSteps(generated);
      }
      setCurrentStepIndex(0);
      setTimerSecondsLeft(null);
      setIsTimerRunning(false);
      setMinimumCompleted(false);
    }
  }, [task]);

  // Timer countdown loop
  useEffect(() => {
    if (!isTimerRunning || timerSecondsLeft === null) return;

    if (timerSecondsLeft <= 0) {
      setIsTimerRunning(false);
      sounds.playMinimumComplete();
      setMinimumCompleted(true);
      return;
    }

    const interval = setInterval(() => {
      setTimerSecondsLeft(prev => {
        if (prev === null || prev <= 1) {
          setIsTimerRunning(false);
          sounds.playMinimumComplete();
          setMinimumCompleted(true);
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
    sounds.playStart();
  };

  const handleImDone = () => {
    completeTask(task.id, 'minimum');
    closeModal();
  };

  const handleKeepGoing = () => {
    // Keep task active, close modal
    closeModal();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 dark:bg-slate-950/70 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="start-modal-title"
    >
      <div className="relative w-full max-w-lg bg-surface dark:bg-surface-dark border border-slate-200/90 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden animate-fade-in">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-500 animate-pulse" />
            <p className="text-xs font-bold uppercase tracking-wider text-ink-muted dark:text-slate-400">
              Activation • Help me start
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

        {/* Content Area */}
        <div className="p-6 sm:p-7">
          
          {/* STATE A: Finished the Minimum Celebration */}
          {minimumCompleted ? (
            <div className="text-center py-6 space-y-5 animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-gentle-greenBg text-gentle-green mx-auto flex items-center justify-center shadow-sm">
                <Check className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-ink-primary dark:text-slate-100">
                  You did the minimum. That counts.
                </h3>
                <p className="text-sm text-ink-muted dark:text-slate-400 mt-2 max-w-sm mx-auto leading-relaxed">
                  Starting is the hardest part. You overcame the inertia.
                  There is no pressure to do anything more right now.
                </p>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row items-center gap-3">
                <button
                  type="button"
                  onClick={handleImDone}
                  className="w-full py-3.5 px-5 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-medium text-sm sm:text-base shadow-sm transition-all"
                >
                  I&apos;m done for now
                </button>
                <button
                  type="button"
                  onClick={handleKeepGoing}
                  className="w-full py-3.5 px-5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-ink-primary dark:text-slate-200 font-medium text-sm sm:text-base transition-all"
                >
                  Keep going
                </button>
              </div>
            </div>
          ) : timerSecondsLeft !== null ? (
            /* STATE B: Active Mini-Timer Screen */
            <div className="text-center py-4 space-y-6 animate-fade-in">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-400">
                  Just this step
                </span>
                <h4 className="text-lg font-bold text-ink-primary dark:text-slate-100 mt-1">
                  {steps[currentStepIndex] || task.title}
                </h4>
              </div>

              {/* Soothing Breathing / Timer Display */}
              <div className="relative w-44 h-44 mx-auto rounded-full bg-slate-50 dark:bg-slate-900 border-4 border-brand-100 dark:border-brand-950 flex flex-col items-center justify-center shadow-inner">
                <span className="text-4xl font-mono font-bold tracking-tight text-brand-900 dark:text-brand-200">
                  {formatTime(timerSecondsLeft)}
                </span>
                <span className="text-[11px] text-ink-muted dark:text-slate-400 mt-1">
                  {isTimerRunning ? 'focus gently' : 'paused'}
                </span>
              </div>

              <p className="text-xs text-ink-muted dark:text-slate-400 italic">
                “You don&apos;t have to finish. Just stay with it for this moment.”
              </p>

              {/* Timer Controls */}
              <div className="flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsTimerRunning(!isTimerRunning)}
                  className="p-3.5 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white shadow-sm transition-all"
                >
                  {isTimerRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    sounds.playMinimumComplete();
                    setMinimumCompleted(true);
                  }}
                  className="py-3 px-4 rounded-2xl bg-gentle-greenBg text-gentle-green hover:bg-emerald-100 font-medium text-xs sm:text-sm transition-colors"
                >
                  I did the minimum
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsTimerRunning(false);
                    setTimerSecondsLeft(null);
                  }}
                  className="p-3 rounded-2xl text-ink-muted hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  title="Cancel timer"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            /* STATE C: Step breakdown & Initiation Selection */
            <div className="space-y-6">
              <div>
                <h3 id="start-modal-title" className="text-xl sm:text-2xl font-bold tracking-tight text-ink-primary dark:text-slate-100">
                  Let&apos;s make this smaller.
                </h3>
                <p className="text-xs sm:text-sm text-ink-muted dark:text-slate-400 mt-1">
                  Don&apos;t think about the whole task. Just look at step {currentStepIndex + 1}.
                </p>
              </div>

              {/* Focused Step Card */}
              <div className="rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 p-5">
                <div className="flex items-center justify-between text-xs text-ink-muted dark:text-slate-400 mb-2">
                  <span className="font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-400">
                    Step {currentStepIndex + 1} of {steps.length}
                  </span>
                  <span>One tiny thing</span>
                </div>

                <p className="text-lg sm:text-xl font-bold text-ink-primary dark:text-slate-100 leading-snug">
                  {steps[currentStepIndex] || task.title}
                </p>

                {/* Step navigation */}
                {steps.length > 1 && (
                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-800/80">
                    <button
                      type="button"
                      onClick={() => setCurrentStepIndex(prev => Math.max(0, prev - 1))}
                      disabled={currentStepIndex === 0}
                      className="flex items-center gap-1 text-xs font-medium text-ink-muted hover:text-ink-primary disabled:opacity-40 transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>Previous step</span>
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => setCurrentStepIndex(prev => Math.min(steps.length - 1, prev + 1))}
                      disabled={currentStepIndex === steps.length - 1}
                      className="flex items-center gap-1 text-xs font-medium text-brand-600 hover:text-brand-700 disabled:opacity-40 transition-colors"
                    >
                      <span>Next step</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Initiation Timer Options */}
              <div className="space-y-2.5">
                <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted dark:text-slate-400">
                  Pick a low-friction timer:
                </p>

                <div className="grid grid-cols-3 gap-2.5">
                  <button
                    type="button"
                    onClick={() => startTimer(2)}
                    className="py-3 px-3 rounded-2xl bg-brand-50 hover:bg-brand-100 dark:bg-brand-950/50 dark:hover:bg-brand-900/60 border border-brand-200/80 dark:border-brand-800 text-brand-800 dark:text-brand-200 font-semibold text-xs sm:text-sm transition-all active:scale-95 text-center"
                  >
                    Start 2 min
                  </button>

                  <button
                    type="button"
                    onClick={() => startTimer(5)}
                    className="py-3 px-3 rounded-2xl bg-brand-50 hover:bg-brand-100 dark:bg-brand-950/50 dark:hover:bg-brand-900/60 border border-brand-200/80 dark:border-brand-800 text-brand-800 dark:text-brand-200 font-semibold text-xs sm:text-sm transition-all active:scale-95 text-center"
                  >
                    Start 5 min
                  </button>

                  <button
                    type="button"
                    onClick={() => startTimer(10)}
                    className="py-3 px-3 rounded-2xl bg-brand-50 hover:bg-brand-100 dark:bg-brand-950/50 dark:hover:bg-brand-900/60 border border-brand-200/80 dark:border-brand-800 text-brand-800 dark:text-brand-200 font-semibold text-xs sm:text-sm transition-all active:scale-95 text-center"
                  >
                    Start 10 min
                  </button>
                </div>
              </div>

              {/* Just do step directly */}
              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={() => {
                    sounds.playMinimumComplete();
                    setMinimumCompleted(true);
                  }}
                  className="text-xs font-medium text-ink-muted hover:text-ink-primary dark:hover:text-slate-300 underline underline-offset-4"
                >
                  I already completed this step
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
