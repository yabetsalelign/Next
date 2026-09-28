'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import { StuckReason } from '@/types';
import { 
  X, 
  ArrowLeft, 
  Sparkles, 
  Wind, 
  EyeOff, 
  VolumeX, 
  HelpCircle, 
  Coffee,
  CheckCircle2,
  Smile
} from 'lucide-react';

interface FrictionOption {
  key: StuckReason;
  icon: string;
  title: string;
  subtitle: string;
}

const FRICTIONS: FrictionOption[] = [
  { key: 'cant_start', icon: '🧱', title: 'Can’t start', subtitle: 'The barrier to begin feels too high' },
  { key: 'too_much', icon: '😵', title: 'Too much / Overwhelmed', subtitle: 'Too many thoughts or high pressure' },
  { key: 'body_feels_bad', icon: '🤢', title: 'Body feels bad or tense', subtitle: 'Fatigue, thirst, restlessness, or discomfort' },
  { key: 'watched', icon: '👀', title: 'Don’t want to be watched', subtitle: 'Perceived scrutiny or need for privacy' },
  { key: 'environment_too_much', icon: '🔊', title: 'Environment is too much', subtitle: 'Noise, clutter, bright glare, or commotion' },
  { key: 'dont_know_what_next', icon: '❓', title: 'Don’t know what to do next', subtitle: 'Unclear next step or missing information' },
];

export function ImStuckModal() {
  const { activeTaskId, tasks, closeModal, logStuckEvent, openModal } = useApp();
  const [selectedReason, setSelectedReason] = useState<StuckReason | null>(null);
  const [breathCount, setBreathCount] = useState(0);

  const task = tasks.find(t => t.id === activeTaskId) || null;
  const taskTitle = task?.title || 'this task';

  const handleSelectReason = (reason: StuckReason) => {
    setSelectedReason(reason);
  };

  const handleLogAndExit = (actionLabel: string, returnToTask = true) => {
    if (selectedReason) {
      logStuckEvent(selectedReason, actionLabel, task?.id);
    }
    closeModal();
    if (returnToTask && selectedReason === 'cant_start') {
      openModal('help_start', task?.id);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 dark:bg-slate-950/70 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="stuck-modal-title"
    >
      <div className="relative w-full max-w-lg bg-surface dark:bg-surface-dark border border-slate-200/90 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden animate-fade-in">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            {selectedReason && (
              <button
                type="button"
                onClick={() => setSelectedReason(null)}
                className="mr-1 p-1 rounded-lg text-ink-muted hover:text-ink-primary hover:bg-slate-100 dark:hover:bg-slate-800"
                aria-label="Back to options"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <span className="w-2.5 h-2.5 rounded-full bg-gentle-coral" />
            <p className="text-xs font-bold uppercase tracking-wider text-ink-muted dark:text-slate-400">
              Safe Space • I&apos;m Stuck
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

        {/* Modal Body */}
        <div className="p-6 sm:p-7">
          
          {/* SCREEN 1: Choose Friction Category */}
          {!selectedReason ? (
            <div className="space-y-4">
              <div>
                <h3 id="stuck-modal-title" className="text-xl sm:text-2xl font-bold tracking-tight text-ink-primary dark:text-slate-100">
                  What&apos;s getting in the way?
                </h3>
                <p className="text-xs sm:text-sm text-ink-muted dark:text-slate-400 mt-1">
                  These are gentle observations, not flaws. Take a second to notice.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-2.5 pt-2">
                {FRICTIONS.map((f) => (
                  <button
                    key={f.key}
                    type="button"
                    onClick={() => handleSelectReason(f.key)}
                    className="flex items-center gap-3.5 p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-surface dark:bg-surface-dark hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:border-slate-300 dark:hover:border-slate-700 text-left transition-all active:scale-[0.99]"
                  >
                    <span className="text-2xl select-none" role="img" aria-hidden="true">
                      {f.icon}
                    </span>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-ink-primary dark:text-slate-100">
                        {f.title}
                      </h4>
                      <p className="text-xs text-ink-muted dark:text-slate-400 truncate">
                        {f.subtitle}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* SCREEN 2: Specific compassionate intervention */
            <div className="space-y-5 animate-fade-in">
              
              {/* CASE 1: Can't start */}
              {selectedReason === 'cant_start' && (
                <>
                  <div className="space-y-2">
                    <span className="text-2xl">🧱</span>
                    <h3 className="text-xl font-bold text-ink-primary dark:text-slate-100">
                      Okay. Let&apos;s make it smaller.
                    </h3>
                    <p className="text-sm text-ink-muted dark:text-slate-400">
                      Instead of trying to do &ldquo;{taskTitle}&rdquo;, try only:
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-brand-50/70 dark:bg-brand-950/40 border border-brand-200/70 dark:border-brand-800/60">
                    <p className="text-base font-semibold text-brand-900 dark:text-brand-200">
                      {task?.minimum || `Open the tools for ${taskTitle} and touch nothing else.`}
                    </p>
                  </div>

                  <div className="space-y-2.5 pt-2">
                    <button
                      type="button"
                      onClick={() => handleLogAndExit('Accepted micro-minimum', true)}
                      className="w-full py-3.5 px-4 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-medium text-sm transition-all"
                    >
                      DO THAT (2 MIN)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        handleLogAndExit('Made it even smaller', false);
                        openModal('breakdown', task?.id);
                      }}
                      className="w-full py-3 px-4 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-ink-secondary dark:text-slate-200 font-medium text-sm transition-all"
                    >
                      MAKE IT EVEN SMALLER
                    </button>
                  </div>
                </>
              )}

              {/* CASE 2: Overwhelmed */}
              {selectedReason === 'too_much' && (
                <>
                  <div className="space-y-2">
                    <span className="text-2xl">😵</span>
                    <h3 className="text-xl font-bold text-ink-primary dark:text-slate-100">
                      Pause. You don&apos;t need to finish this right now.
                    </h3>
                    <p className="text-sm text-ink-muted dark:text-slate-400">
                      When cognitive overload hits, pushing harder rarely works.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 space-y-2 text-sm text-ink-secondary dark:text-slate-300">
                    <p className="font-medium text-ink-primary dark:text-slate-100">Try one of these first:</p>
                    <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm text-ink-muted dark:text-slate-400">
                      <li>Sit back from the screen or desk</li>
                      <li>Drink a small glass of cool water</li>
                      <li>Take 5 slow breaths (exhale longer than inhale)</li>
                    </ul>
                  </div>

                  {/* Gentle interactive breath button */}
                  <div className="p-3.5 rounded-2xl bg-brand-50/50 dark:bg-brand-950/20 border border-brand-100 dark:border-brand-900/40 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-brand-700 dark:text-brand-300">
                      <Wind className="w-4 h-4" />
                      <span>Breaths taken: {breathCount} / 5</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setBreathCount(prev => Math.min(5, prev + 1))}
                      className="text-xs font-semibold py-1.5 px-3 rounded-xl bg-brand-600 text-white hover:bg-brand-700"
                    >
                      {breathCount < 5 ? 'Exhale +1' : 'Complete ✨'}
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleLogAndExit('Took a breathing pause', false)}
                    className="w-full py-3.5 px-4 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-medium text-sm transition-all"
                  >
                    RETURN WHEN READY
                  </button>
                </>
              )}

              {/* CASE 3: Body feels bad */}
              {selectedReason === 'body_feels_bad' && (
                <>
                  <div className="space-y-2">
                    <span className="text-2xl">🤢</span>
                    <h3 className="text-xl font-bold text-ink-primary dark:text-slate-100">
                      Listen to your physical body.
                    </h3>
                    <p className="text-sm text-ink-muted dark:text-slate-400">
                      Executive function requires physical energy. If your body is depleted, forcing effort is grueling.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-gentle-amberBg/40 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/40 space-y-2 text-xs sm:text-sm text-ink-secondary dark:text-slate-300">
                    <p className="font-semibold text-amber-900 dark:text-amber-200">Bodily reset:</p>
                    <ul className="list-disc list-inside space-y-1 text-ink-muted dark:text-slate-400">
                      <li>Drink water or a warm soothing beverage</li>
                      <li>Have a quick bite to eat (protein or toast)</li>
                      <li>Stretch neck and drop shoulders away from ears</li>
                      <li>Lie flat or rest eyes for 5 minutes</li>
                    </ul>
                  </div>

                  <div className="space-y-2 pt-1">
                    <button
                      type="button"
                      onClick={() => handleLogAndExit('Chose rest for body comfort', false)}
                      className="w-full py-3.5 px-4 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-medium text-sm transition-all"
                    >
                      TAKE A 10-MINUTE REST
                    </button>
                    <button
                      type="button"
                      onClick={() => handleLogAndExit('Returned to task after stretch', true)}
                      className="w-full py-3 px-4 rounded-2xl bg-slate-100 dark:bg-slate-800 text-ink-secondary dark:text-slate-200 font-medium text-sm transition-all"
                    >
                      TRY AGAIN GENTLY
                    </button>
                  </div>
                </>
              )}

              {/* CASE 4: Watched */}
              {selectedReason === 'watched' && (
                <>
                  <div className="space-y-2">
                    <span className="text-2xl">👀</span>
                    <h3 className="text-xl font-bold text-ink-primary dark:text-slate-100">
                      Change the environment.
                    </h3>
                    <p className="text-sm text-ink-muted dark:text-slate-400">
                      Feeling observed creates unconscious tension. You have permission to create privacy.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 space-y-2 text-xs sm:text-sm text-ink-secondary dark:text-slate-300">
                    <p className="font-semibold text-ink-primary dark:text-slate-100">Ideas for privacy:</p>
                    <ul className="list-disc list-inside space-y-1 text-ink-muted dark:text-slate-400">
                      <li>Turn your screen or chair facing away from the room</li>
                      <li>Put on over-ear headphones (even without music)</li>
                      <li>Move to a quieter corner or another room</li>
                      <li>Wait until you have more space to yourself</li>
                    </ul>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleLogAndExit('Moved to private space', true)}
                    className="w-full py-3.5 px-4 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-medium text-sm transition-all"
                  >
                    RETURN TO TASK WITH PRIVACY
                  </button>
                </>
              )}

              {/* CASE 5: Environment too much */}
              {selectedReason === 'environment_too_much' && (
                <>
                  <div className="space-y-2">
                    <span className="text-2xl">🔊</span>
                    <h3 className="text-xl font-bold text-ink-primary dark:text-slate-100">
                      Dial down sensory input.
                    </h3>
                    <p className="text-sm text-ink-muted dark:text-slate-400">
                      Sensory friction drains focus silently.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 space-y-2 text-xs sm:text-sm text-ink-secondary dark:text-slate-300">
                    <ul className="list-disc list-inside space-y-1 text-ink-muted dark:text-slate-400">
                      <li>Put on earplugs or noise-cancelling headphones</li>
                      <li>Dim bright overhead lamps or reduce screen brightness</li>
                      <li>Move clutter out of your immediate field of vision</li>
                    </ul>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleLogAndExit('Adjusted sensory environment', true)}
                    className="w-full py-3.5 px-4 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-medium text-sm transition-all"
                  >
                    READY TO TRY WITH LESS NOISE
                  </button>
                </>
              )}

              {/* CASE 6: Don't know what next */}
              {selectedReason === 'dont_know_what_next' && (
                <>
                  <div className="space-y-2">
                    <span className="text-2xl">❓</span>
                    <h3 className="text-xl font-bold text-ink-primary dark:text-slate-100">
                      Find the single first action.
                    </h3>
                    <p className="text-sm text-ink-muted dark:text-slate-400">
                      Vagueness creates paralysis. Let&apos;s dissolve the ambiguity.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 space-y-2 text-xs sm:text-sm text-ink-secondary dark:text-slate-300">
                    <p className="font-semibold text-ink-primary dark:text-slate-100">Answer just one question:</p>
                    <p className="text-xs text-ink-muted dark:text-slate-400 italic">
                      “What physical tool or website must be open to do this?”
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      handleLogAndExit('Requested atomic breakdown', false);
                      openModal('breakdown', task?.id);
                    }}
                    className="w-full py-3.5 px-4 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-medium text-sm transition-all"
                  >
                    BREAK IT DOWN AUTOMATICALLY
                  </button>
                </>
              )}

            </div>
          )}

        </div>
      </div>
    </div>
  );
}
