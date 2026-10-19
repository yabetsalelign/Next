'use client';

import { SymbolIcon } from '@/components/ui/SymbolIcon';
import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import { Header } from '@/components/layout/Header';
import { Routine } from '@/types';
import { sounds } from '@/lib/sounds';

export default function RoutinesPage() {
  const { routines, openModal, toggleRoutineStep } = useApp();
  const [expandedRoutineId, setExpandedRoutineId] = useState<string | null>(null);

  const activeRoutines = routines.filter((r) => r.enabled !== false);

  const totalStepsCompleted = routines.reduce(
    (acc, r) => acc + r.steps.filter((s) => s.completed).length,
    0
  );

  const handleStepToggle = (routineId: string, stepId: string) => {
    sounds.playMinimumComplete();
    toggleRoutineStep(routineId, stepId);
  };

  return (
    <div className="min-h-screen bg-background text-on-surface font-body-md text-body-md flex flex-col selection:bg-primary-container selection:text-on-primary-container">
      {/* Header */}
      <Header />

      <main className="flex flex-col relative w-full pt-[calc(4rem+var(--sat))] pb-36 px-gutter-mobile bg-background flex-1 max-w-xl mx-auto">
        <div className="flex flex-col w-full gap-space-lg select-none">
          {/* Sub-header & Action */}
          <div className="flex items-center justify-between gap-space-sm pt-space-xs">
            <div className="flex flex-col min-w-0">
              <span className="font-label-sm text-label-sm text-on-surface-variant tracking-wider uppercase">
                Anchors &amp; Rhythms
              </span>
              <p className="font-body-sm text-body-sm text-on-surface-variant break-words">
                Self-paced anchor flows. No alarms, no streaks, no guilt.
              </p>
            </div>
            <button
              type="button"
              onClick={() => openModal('add_routine')}
              className="min-h-11 flex-shrink-0 inline-flex items-center gap-1.5 px-space-md py-2 rounded-full bg-surface-container-high text-primary hover:bg-surface-container-highest active:scale-95 transition-all shadow-sm font-semibold"
              id="open-create-modal"
            >
              <SymbolIcon name="add" className="text-[18px]" />
              <span className="font-label-md text-label-md">New routine</span>
            </button>
          </div>

          {activeRoutines.length > 0 && <>
          {/* Helpful context for routines the user has chosen to create */}
          <div className="flex items-center justify-between px-space-md py-space-sm rounded-xl bg-surface-container-low shadow-sm border border-surface-container-high/40">
            <div className="flex items-center gap-space-sm min-w-0">
              <div className="w-8 h-8 rounded-full bg-primary-container/15 flex items-center justify-center flex-shrink-0 text-primary-container">
                <SymbolIcon name="spa" className="text-[18px]" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-label-md text-label-md text-on-surface font-medium">
                  You are right on time
                </span>
                <span className="font-label-sm text-label-sm text-on-surface-variant break-words">
                  Anchor whenever you feel ready today
                </span>
              </div>
            </div>
            <span className="font-label-sm text-label-sm text-secondary bg-secondary-container/20 px-2.5 py-0.5 rounded-full flex-shrink-0 font-medium">
              {totalStepsCompleted} steps anchored
            </span>
          </div>

          </>}

          {activeRoutines.length === 0 ? (
            <section className="rounded-3xl border border-outline-variant bg-surface-container-low p-6 sm:p-8">
              <p className="text-sm font-semibold text-primary mb-2">A little structure, when it helps</p>
              <h2 className="text-2xl font-semibold tracking-tight">No routines yet.</h2>
              <p className="mt-2 text-base leading-relaxed text-on-surface-variant">Make a short sequence for something you do often. You can take the steps in your own time.</p>
              <button type="button" onClick={() => openModal('add_routine')} className="mt-5 min-h-12 px-4 rounded-xl bg-primary text-on-primary font-semibold inline-flex items-center gap-2 hover:opacity-90"><SymbolIcon name="add" className="text-[18px]" />Create a routine</button>
            </section>
          ) : (
          /* Routines List */
          <div className="flex flex-col gap-space-md">
            {activeRoutines.map((routine) => {
              const totalMins = routine.steps.reduce(
                (sum, s) => sum + (s.durationMinutes || 5),
                0
              );
              const isExpanded = expandedRoutineId === routine.id;

              return (
                <div
                  key={routine.id}
                  className="bg-surface-container-low rounded-[22px] p-space-md shadow-md flex flex-col gap-space-md transition-all border border-surface-container-high/40"
                >
                  {/* Card Top: Icon + Title + Meta */}
                  <div className="flex items-start justify-between gap-space-sm">
                    <div className="flex items-center gap-space-md min-w-0">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-600 via-primary-container to-amber-200 flex items-center justify-center shadow-[0_4px_16px_rgba(255,185,99,0.25)] flex-shrink-0 text-on-primary-fixed">
                        <span className="text-[22px]">{routine.icon || '🌅'}</span>
                      </div>
                      <div className="flex flex-col min-w-0">
                        <h2 className="font-headline-sm text-headline-sm text-on-surface font-semibold break-words">
                          {routine.title}
                        </h2>
                        <p className="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-1.5 flex-wrap">
                          <span>{routine.steps.length} steps</span>
                          <span className="w-1 h-1 rounded-full bg-outline-variant"></span>
                          <span>~{totalMins} min</span>
                          <span className="w-1 h-1 rounded-full bg-outline-variant"></span>
                          <span className="text-secondary font-medium">Flexible order</span>
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      aria-label="Routine options"
                      onClick={() => openModal('routine_runner', undefined, routine.id)}
                      className="w-11 h-11 rounded-xl flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors"
                    >
                      <SymbolIcon name="play_arrow" className="text-[20px]" />
                    </button>
                  </div>

                  {/* Flow Mode Badge */}
                  <div className="flex items-center justify-between text-label-sm font-label-sm px-1 text-on-surface-variant">
                    <span className="flex items-center gap-1.5 text-on-surface-variant">
                      <SymbolIcon name="reorder" className="text-[15px]" />
                      Intended gentle sequence
                    </span>
                    <button
                      type="button"
                      onClick={() => setExpandedRoutineId(isExpanded ? null : routine.id)}
                      className="min-h-11 px-3 rounded-full bg-surface-container-high text-on-surface-variant hover:text-on-surface transition-colors"
                    >
                      {isExpanded ? 'Hide steps' : 'View steps'}
                    </button>
                  </div>

                  {/* Flow preview steps */}
                  <div className="flex flex-col gap-1.5 transition-all duration-300">
                    {routine.steps.slice(0, isExpanded ? routine.steps.length : 3).map((step, idx) => (
                      <div
                        key={step.id}
                        className="bg-surface-container/70 rounded-xl p-3 flex items-center justify-between gap-space-sm border border-outline-variant"
                      >
                        <div className="flex items-center gap-space-sm min-w-0">
                          <button
                            type="button"
                            aria-label={`Toggle ${step.title}`}
                            onClick={() => handleStepToggle(routine.id, step.id)}
                            className={`w-11 h-11 rounded-full flex items-center justify-center transition-all flex-shrink-0 border ${
                              step.completed
                                ? 'bg-secondary text-surface-container-lowest border-secondary'
                                : 'bg-surface-container-highest text-transparent hover:text-secondary border-outline'
                            }`}
                          >
                            <SymbolIcon name="check" className="text-[13px] font-bold" />
                          </button>
                          <span
                            className={`font-body-md text-body-md break-words ${
                              step.completed ? 'line-through text-on-surface-variant' : 'text-on-surface font-medium'
                            }`}
                          >
                            {step.title}
                          </span>
                        </div>
                        <span className="font-label-sm text-label-sm text-on-surface-variant flex-shrink-0">
                          ~{step.durationMinutes || 5}m
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Start Flow Button */}
                  <button
                    type="button"
                    onClick={() => openModal('routine_runner', undefined, routine.id)}
                    className="w-full py-2.5 rounded-full bg-surface-container-high hover:bg-surface-container-highest text-primary font-label-md text-label-md flex items-center justify-center gap-2 transition-all active:scale-[0.99] font-medium"
                  >
                    <SymbolIcon name="play_circle" className="text-[18px]" />
                    <span>Start flow</span>
                  </button>
                </div>
              );
            })}
          </div>
          )}
        </div>
      </main>
    </div>
  );
}
