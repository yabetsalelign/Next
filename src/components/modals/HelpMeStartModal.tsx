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
      className="fixed inset-0 z-50 flex items-end justify-center pb-[env(safe-area-inset-bottom,0px)] sm:items-center sm:p-4 bg-black/60 backdrop-blur-[2px] animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="start-modal-title"
      onClick={closeModal}
    >
      <div
        className="modal-sheet relative w-full sm:max-w-md bg-[#18191E] border-t sm:border border-[#2A2C34] sm:rounded-[28px] rounded-t-[28px] shadow-2xl p-6 sm:p-7 overflow-y-auto animate-slide-up flex flex-col space-y-5"
        style={{ maxHeight: 'calc(100dvh - env(safe-area-inset-top, 0px) - env(safe-area-inset-bottom, 0px) - 1rem)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag handle */}
        <div className="w-10 h-1 bg-[#2A2C34] rounded-full mx-auto -mt-2 pb-0 cursor-grab" />

        {/* Header bar */}
        <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
          <div className="flex items-center gap-2">
            {stage !== 'initial' && stage !== 'completed' && (
              <button
                type="button"
                onClick={() => {
                  if (stage === 'timer') setStage('initial');
                  else if (stage === 'easier_choices') setStage('initial');
                  else setStage('easier_choices');
                }}
                className="p-1 rounded-lg text-stone-400 hover:text-white hover:bg-white/[0.05] transition-colors mr-1 cursor-pointer"
                aria-label="Back"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <p className="text-[11px] font-bold tracking-widest uppercase text-stone-400">
              HELP ME START
            </p>
          </div>
          <button
            onClick={closeModal}
            aria-label="Close"
            className="w-7 h-7 rounded-full bg-[#202228] hover:bg-[#2F323B] text-stone-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 1. DEFAULT LEVEL: Direct and frictionless */}
        {stage === 'initial' && (
          <div className="space-y-5 animate-fade-in text-center">
            <div className="space-y-1">
              <h2 id="start-modal-title" className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                Let&apos;s make this easier.
              </h2>
              <p className="text-xs text-stone-400 font-medium">
                First step:
              </p>
            </div>

            {/* Micro-Step Recommendation Card with glowing aura */}
            <div className="w-full bg-[#1A1D24] border border-[#2B3242] shadow-[0_0_0_1px_rgba(96,165,250,0.15),0_8px_24px_-4px_rgba(15,23,42,0.65)] rounded-2xl py-4 px-4 text-center relative group transition-all duration-200">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/10 to-primary/15 rounded-2xl blur-sm opacity-50 pointer-events-none" />
              <div className="relative z-10 flex items-center justify-center space-x-2">
                <span className="text-sm font-semibold text-gray-100 tracking-wide">
                  {firstStepText}
                </span>
              </div>
            </div>

            {/* Primary & Secondary actions */}
            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={handleStartWithFirstStep}
                className="w-full bg-primary hover:bg-primary-container text-on-primary font-bold text-sm py-3.5 px-6 rounded-full shadow-[0_4px_20px_-2px_rgba(245,158,11,0.25)] flex items-center justify-center space-x-2 transition-all active:scale-[0.98] cursor-pointer"
              >
                <span>Start with this</span>
              </button>

              <button
                type="button"
                onClick={() => setStage('easier_choices')}
                className="w-full py-2 text-center text-xs font-medium text-stone-400 hover:text-stone-200 transition-colors cursor-pointer"
              >
                Not quite
              </button>
            </div>
          </div>
        )}

        {/* 2. PROGRESSIVE DISCLOSURE: What would make this easier? */}
        {stage === 'easier_choices' && (
          <div className="space-y-4 animate-fade-in text-left">
            <div>
              <h3 className="text-xl font-bold tracking-tight text-white">
                What would make this easier?
              </h3>
              <p className="text-xs text-stone-400 mt-1">
                Notice the friction. We&apos;ll adapt to it.
              </p>
            </div>

            <div className="space-y-2.5">
              <button
                type="button"
                onClick={() => setStage('too_big')}
                className="w-full p-4 rounded-2xl border border-[#2B3242] bg-[#1A1D24] hover:bg-[#22252e] text-left transition-all active:scale-[0.99] cursor-pointer"
              >
                <h4 className="text-sm font-semibold text-white">
                  Too big
                </h4>
                <p className="text-xs text-stone-400 mt-0.5">
                  Break it into smaller, manageable chunks.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setStage('dont_know')}
                className="w-full p-4 rounded-2xl border border-[#2B3242] bg-[#1A1D24] hover:bg-[#22252e] text-left transition-all active:scale-[0.99] cursor-pointer"
              >
                <h4 className="text-sm font-semibold text-white">
                  Don&apos;t know where to begin
                </h4>
                <p className="text-xs text-stone-400 mt-0.5">
                  Find the single physical motion needed to open this.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setStage('low_energy')}
                className="w-full p-4 rounded-2xl border border-[#2B3242] bg-[#1A1D24] hover:bg-[#22252e] text-left transition-all active:scale-[0.99] cursor-pointer"
              >
                <h4 className="text-sm font-semibold text-white">
                  Low energy
                </h4>
                <p className="text-xs text-stone-400 mt-0.5">
                  Do the absolute minimum or switch to gentle rest.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setStage('dont_want_to')}
                className="w-full p-4 rounded-2xl border border-[#2B3242] bg-[#1A1D24] hover:bg-[#22252e] text-left transition-all active:scale-[0.99] cursor-pointer"
              >
                <h4 className="text-sm font-semibold text-white">
                  I don&apos;t want to
                </h4>
                <p className="text-xs text-stone-400 mt-0.5">
                  2 minutes of low expectations, then permission to stop.
                </p>
              </button>
            </div>
          </div>
        )}

        {/* 2A. SUB-VIEW: Too Big */}
        {stage === 'too_big' && (
          <div className="space-y-4 animate-fade-in text-left">
            <div>
              <h3 className="text-xl font-bold tracking-tight text-white">
                Smaller steps.
              </h3>
              <p className="text-xs text-stone-400 mt-1">
                Just look at step {currentStepIndex + 1} of {steps.length}.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#1A1D24] border border-[#2B3242] space-y-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
                Step {currentStepIndex + 1}
              </span>
              <p className="text-base font-semibold text-white leading-snug">
                {steps[currentStepIndex] || firstStepText}
              </p>

              {steps.length > 1 && (
                <div className="flex items-center justify-between pt-2 border-t border-white/[0.08]">
                  <button
                    type="button"
                    onClick={() => setCurrentStepIndex(prev => Math.max(0, prev - 1))}
                    disabled={currentStepIndex === 0}
                    className="flex items-center gap-1 text-xs font-medium text-stone-400 hover:text-white disabled:opacity-40 cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Previous</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentStepIndex(prev => Math.min(steps.length - 1, prev + 1))}
                    disabled={currentStepIndex === steps.length - 1}
                    className="flex items-center gap-1 text-xs font-medium text-primary hover:text-primary-container disabled:opacity-40 cursor-pointer"
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
              className="w-full py-3.5 px-4 rounded-full bg-primary hover:bg-primary-container text-on-primary font-bold text-sm shadow-[0_4px_20px_-2px_rgba(245,158,11,0.25)] transition-all cursor-pointer"
            >
              Start 2-minute timer for this step
            </button>
          </div>
        )}

        {/* 2B. SUB-VIEW: Don't know where to begin */}
        {stage === 'dont_know' && (
          <div className="space-y-4 animate-fade-in text-left">
            <div>
              <h3 className="text-xl font-bold tracking-tight text-white">
                Find the physical starting motion.
              </h3>
              <p className="text-xs text-stone-400 mt-1">
                Forget the task content. What is the single physical action?
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#1A1D24] border border-[#2B3242] text-sm text-stone-300 space-y-1.5">
              <p className="font-semibold text-white text-xs uppercase tracking-wider">Example physical beginnings:</p>
              <ul className="list-disc list-inside space-y-1 text-xs text-stone-400">
                <li>Sit in your chair and adjust the screen</li>
                <li>Open the specific app or document and look at it</li>
                <li>Put hands on keyboard and type one letter or word</li>
              </ul>
            </div>

            <button
              type="button"
              onClick={() => startTimer(2)}
              className="w-full py-3.5 px-4 rounded-full bg-primary hover:bg-primary-container text-on-primary font-bold text-sm shadow-[0_4px_20px_-2px_rgba(245,158,11,0.25)] transition-all cursor-pointer"
            >
              Try 2 minutes of just opening it
            </button>
          </div>
        )}

        {/* 2C. SUB-VIEW: Low energy */}
        {stage === 'low_energy' && (
          <div className="space-y-4 animate-fade-in text-left">
            <div>
              <h3 className="text-xl font-bold tracking-tight text-white">
                Absolute minimum mode.
              </h3>
              <p className="text-xs text-stone-400 mt-1">
                When energy is low, doing the absolute minimum counts completely.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-primary/10 border border-primary/30">
              <p className="text-[11px] font-bold uppercase tracking-wider text-primary mb-1">
                The minimum:
              </p>
              <p className="text-base font-semibold text-white">
                {task.minimum || 'Spend 1 minute with this activity.'}
              </p>
            </div>

            <div className="space-y-2.5">
              <button
                type="button"
                onClick={() => startTimer(1)}
                className="w-full py-3.5 px-4 rounded-full bg-primary hover:bg-primary-container text-on-primary font-bold text-sm shadow-[0_4px_20px_-2px_rgba(245,158,11,0.25)] transition-all cursor-pointer"
              >
                1 minute only
              </button>
              <button
                type="button"
                onClick={() => {
                  closeModal();
                  openModal('check_in');
                }}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-medium text-stone-400 hover:text-stone-200 transition-colors text-center cursor-pointer"
              >
                Or check in and take care of your body first
              </button>
            </div>
          </div>
        )}

        {/* 2D. SUB-VIEW: I don't want to */}
        {stage === 'dont_want_to' && (
          <div className="space-y-4 animate-fade-in text-left">
            <div>
              <h3 className="text-xl font-bold tracking-tight text-white">
                You don&apos;t have to want to.
              </h3>
              <p className="text-xs text-stone-400 mt-1">
                Motivation follows action, not the other way around.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#1A1D24] border border-[#2B3242] text-xs text-stone-300">
              <p className="leading-relaxed">
                Stay with it for 2 minutes without expecting yourself to enjoy it or finish it. When the 2 minutes are up, you have full permission to stop.
              </p>
            </div>

            <button
              type="button"
              onClick={() => startTimer(2)}
              className="w-full py-3.5 px-4 rounded-full bg-primary hover:bg-primary-container text-on-primary font-bold text-sm shadow-[0_4px_20px_-2px_rgba(245,158,11,0.25)] transition-all cursor-pointer"
            >
              Start 2-minute timer with permission to stop
            </button>
          </div>
        )}

        {/* 3. TIMER ACTIVE SCREEN */}
        {stage === 'timer' && (
          <div className="text-center py-2 space-y-5 animate-fade-in">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
                Focus gently
              </span>
              <h4 className="text-base font-bold text-white mt-1 break-words">
                {firstStepText}
              </h4>
            </div>

            {/* Circular display */}
            <div className="relative w-36 h-36 mx-auto rounded-full bg-[#121317] border-2 border-primary/40 flex flex-col items-center justify-center shadow-inner">
              <span className="text-3xl font-mono font-bold tracking-tight text-primary">
                {formatTime(timerSecondsLeft)}
              </span>
              <span className="text-[10px] text-stone-400 mt-1 uppercase tracking-wider">
                {isTimerRunning ? 'in progress' : 'paused'}
              </span>
            </div>

            <p className="text-xs text-stone-400 italic">
              &ldquo;You don&apos;t have to finish. Just stay with it for this moment.&rdquo;
            </p>

            {/* Timer controls */}
            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                className="p-3.5 rounded-2xl bg-primary hover:bg-primary-container text-on-primary shadow-sm transition-all cursor-pointer"
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
                className="py-3 px-4 rounded-2xl bg-secondary-container/80 text-on-secondary-container hover:bg-secondary-container font-medium text-xs transition-colors cursor-pointer"
              >
                I did the minimum
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsTimerRunning(false);
                  setStage('initial');
                }}
                className="p-3 rounded-2xl text-stone-400 hover:bg-white/[0.06] transition-colors cursor-pointer"
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
          <div className="text-center py-4 space-y-4 animate-fade-in">
            <div className="w-14 h-14 rounded-full bg-secondary-container text-on-secondary-container mx-auto flex items-center justify-center shadow-sm">
              <Check className="w-7 h-7 stroke-[2.5]" />
            </div>

            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-white">
                You did the minimum.
              </h3>
              <p className="text-sm text-stone-400 mt-1">
                That counts. You overcame the inertia.
              </p>
            </div>

            <div className="pt-2 flex flex-col gap-2.5">
              <button
                type="button"
                onClick={handleImDone}
                className="w-full py-3.5 px-5 rounded-full bg-primary hover:bg-primary-container text-on-primary font-bold text-sm shadow-[0_4px_20px_-2px_rgba(245,158,11,0.25)] transition-all cursor-pointer"
              >
                I&apos;m done for now
              </button>
              <button
                type="button"
                onClick={closeModal}
                className="w-full py-3 px-5 rounded-full border border-white/10 hover:bg-white/[0.05] text-stone-300 font-medium text-sm transition-all cursor-pointer"
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
