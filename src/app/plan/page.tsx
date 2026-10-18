'use client';

import { SymbolIcon } from '@/components/ui/SymbolIcon';
import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/lib/store';
import { Header } from '@/components/layout/Header';
import { Task } from '@/types';
import { getLocalDateString, isSameDay } from '@/lib/dateUtils';
import { sounds } from '@/lib/sounds';

const REST_PRESETS = [
  { id: 'rest-breathe', title: 'Sit quietly & breathe', duration: '~10 min', icon: 'air', color: 'text-primary-container' },
  { id: 'rest-walk', title: 'Slow walk outside', duration: '~12 min', icon: 'directions_walk', color: 'text-secondary' },
  { id: 'rest-tracks', title: 'Listen to calming tracks', duration: '~15 min', icon: 'headphones', color: 'text-tertiary' },
  { id: 'rest-nothing', title: 'Do nothing guilt-free', duration: '~15 min', icon: 'bedtime', color: 'text-primary-fixed-dim' },
];

const ALTERNATE_PROPOSALS = [
  'Do 2 minutes of effortless start',
  'Open notes and read the first paragraph',
  'Put your phone aside for just 60 seconds',
  'Clear your workspace surface and exhale',
  'Jot down two quick bullet points',
];

export default function PlanPage() {
  const router = useRouter();
  const { tasks, addTask, completeTask, uncompleteTask, openModal, deferTask, setCurrentTask } = useApp();

  const [filter, setFilter] = useState<'all' | 'must' | 'care' | 'rest'>('all');
  const [showCompleted, setShowCompleted] = useState<boolean>(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState<boolean>(false);
  const [proposalIndex, setProposalIndex] = useState<number>(0);

  const todayStr = useMemo(() => getLocalDateString(), []);
  const uncompletedTasks = tasks.filter((t) => !t.completed);
  const completedToday = tasks.filter(
    (t) => t.completed && t.completedAt && isSameDay(t.completedAt, todayStr)
  );

  const counts = useMemo(() => {
    return {
      all: uncompletedTasks.length,
      must: uncompletedTasks.filter((t) => t.priority === 'must').length,
      care: uncompletedTasks.filter((t) => t.category === 'wellness').length,
      rest: uncompletedTasks.filter((t) => t.category === 'rest').length,
    };
  }, [uncompletedTasks]);

  const filteredTasks = useMemo(() => {
    return uncompletedTasks.filter((t) => {
      if (filter === 'all') return true;
      if (filter === 'must') return t.priority === 'must';
      if (filter === 'care') return t.category === 'wellness';
      if (filter === 'rest') return t.category === 'rest';
      return true;
    });
  }, [uncompletedTasks, filter]);

  // Primary active task: strictly explicit 'now' task to maintain 100% consistency with Today page
  const activeTask = useMemo(() => {
    return filteredTasks.find((t) => t.timeCategory === 'now') || null;
  }, [filteredTasks]);

  const queuedTasks = useMemo(() => {
    return filteredTasks.filter((t) => t.id !== activeTask?.id);
  }, [filteredTasks, activeTask]);

  const handleToggleTask = (task: Task) => {
    sounds.playMinimumComplete();
    completeTask(task.id, 'minimum');
  };

  const handlePostponeActive = (task: Task) => {
    deferTask(task.id);
  };

  const handleAddRest = (item: (typeof REST_PRESETS)[0]) => {
    addTask({
      title: item.title,
      category: 'rest',
      icon: item.icon,
      timeCategory: 'today',
      durationMinutes: 10,
      priority: 'could',
      minimum: 'Sit quietly for 2 minutes',
      normal: `Enjoy ${item.title.toLowerCase()}`,
      steps: [
        { id: `rest-p-${Date.now()}`, title: 'Give yourself permission to pause', completed: false, isMinimum: true },
      ],
      companyPreference: 'no_preference',
    });
    sounds.playTap();
  };

  const currentProposal = ALTERNATE_PROPOSALS[proposalIndex % ALTERNATE_PROPOSALS.length];

  const handleNextProposal = () => {
    setProposalIndex((p) => p + 1);
  };

  const handleStartProposal = () => {
    setIsHelpModalOpen(false);
    router.push('/focus-session');
  };

  return (
    <div className="min-h-screen bg-background text-on-surface font-body-md text-body-md flex flex-col selection:bg-primary-container selection:text-on-primary-container">
      {/* Header */}
      <Header />

      <main className="flex flex-col relative w-full pt-[calc(4rem+var(--sat))] pb-36 px-gutter-mobile bg-background flex-1 max-w-xl mx-auto">
        <div className="flex flex-col w-full gap-space-lg select-none">
          {/* Header Context & Subtitle */}
          <div className="flex flex-col gap-space-xs pt-1">
            <div className="flex items-center justify-between">
              <p className="font-headline-md text-headline-md text-on-surface tracking-tight">Flexible Sequence</p>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                Zero guilt pace
              </div>
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Where am I in my day? Choose presence over pressure.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-space-xs overflow-x-auto pb-1 no-scrollbar">
            <button
              type="button"
              onClick={() => setFilter('all')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full font-label-md text-label-md font-semibold transition-all active:scale-95 shadow-sm ${
                filter === 'all'
                  ? 'bg-primary-container text-on-primary-container'
                  : 'bg-surface-container-low text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
              }`}
            >
              <span>All</span>
              <span
                className={`w-4 h-4 rounded-full text-[10px] flex items-center justify-center font-bold ${
                  filter === 'all' ? 'bg-on-primary-container/20' : 'bg-surface-container-highest'
                }`}
              >
                {counts.all}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setFilter('must')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full font-label-md text-label-md transition-all active:scale-95 ${
                filter === 'must'
                  ? 'bg-primary-container text-on-primary-container font-semibold'
                  : 'bg-surface-container-low text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
              }`}
            >
              <span>Must</span>
              <span
                className={`w-4 h-4 rounded-full text-[10px] flex items-center justify-center font-bold ${
                  filter === 'must' ? 'bg-on-primary-container/20' : 'bg-surface-container-highest'
                }`}
              >
                {counts.must}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setFilter('care')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full font-label-md text-label-md transition-all active:scale-95 ${
                filter === 'care'
                  ? 'bg-primary-container text-on-primary-container font-semibold'
                  : 'bg-surface-container-low text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
              }`}
            >
              <span>Care</span>
              <span
                className={`w-4 h-4 rounded-full text-[10px] flex items-center justify-center font-bold ${
                  filter === 'care' ? 'bg-on-primary-container/20' : 'bg-surface-container-highest'
                }`}
              >
                {counts.care}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setFilter('rest')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full font-label-md text-label-md transition-all active:scale-95 ${
                filter === 'rest'
                  ? 'bg-primary-container text-on-primary-container font-semibold'
                  : 'bg-surface-container-low text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
              }`}
            >
              <span>Rest</span>
              <span
                className={`w-4 h-4 rounded-full text-[10px] flex items-center justify-center font-bold ${
                  filter === 'rest' ? 'bg-on-primary-container/20' : 'bg-surface-container-highest'
                }`}
              >
                {counts.rest}
              </span>
            </button>
          </div>

          {/* SECTION 1: NOW (Primary Focus) */}
          <section className="flex flex-col gap-space-sm">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary-container animate-ping"></span>
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-primary-container font-bold">
                  Now
                </span>
              </div>
              <span className="font-label-sm text-label-sm text-on-surface-variant">Primary focus</span>
            </div>

            {activeTask ? (
              <div className="relative bg-surface-container-low rounded-2xl p-space-lg shadow-[0_12px_32px_-4px_rgba(0,0,0,0.5)] overflow-hidden border border-surface-container-high/40">
                {/* Ambient gentle tint glow */}
                <div className="absolute -top-12 -right-12 w-40 h-40 bg-primary-container/10 rounded-full blur-3xl pointer-events-none"></div>
                {/* Amber focus vertical bar */}
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-primary-container rounded-r"></div>

                <div className="flex flex-col gap-space-md pl-1">
                  <div className="flex items-start justify-between gap-space-sm">
                    <div className="flex items-start gap-space-sm min-w-0">
                      {/* Organic Checkbox */}
                      <button
                        type="button"
                        aria-label="Mark complete"
                        onClick={() => handleToggleTask(activeTask)}
                        className="-ml-2 w-11 h-11 rounded-full bg-surface-container-high hover:bg-secondary/30 flex items-center justify-center text-transparent hover:text-secondary transition-all flex-shrink-0"
                      >
                        <SymbolIcon name="check" className="text-[16px]" />
                      </button>

                      <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h2 className="font-headline-sm text-headline-sm text-on-surface tracking-tight font-semibold break-words">
                            {activeTask.title}
                          </h2>
                          <span className="px-2 py-0.5 rounded-full bg-primary-container/20 text-primary-container font-label-sm text-label-sm font-medium capitalize">
                            {activeTask.priority === 'must' ? 'Must' : activeTask.category || 'Care'}
                          </span>
                        </div>
                        <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                          {activeTask.minimum
                            ? `Take 1 small step towards: ${activeTask.minimum}`
                            : 'Take 1 small step towards: finish project scope draft'}
                        </p>
                      </div>
                    </div>

                    <span className="px-2.5 py-1 rounded-full bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm flex-shrink-0 flex items-center gap-1">
                      <SymbolIcon name="schedule" className="text-[13px]" />
                      {activeTask.durationMinutes ? `${activeTask.durationMinutes}m` : '15m'}
                    </span>
                  </div>

                  {/* Action Row */}
                  <div className="flex items-center gap-space-sm pt-1">
                    <button
                      type="button"
                      onClick={() => setIsHelpModalOpen(true)}
                      className="flex-1 h-11 px-4 rounded-full bg-primary-container hover:bg-primary-fixed-dim text-on-primary-fixed font-label-lg text-label-lg flex items-center justify-center gap-2 shadow-md transition-transform active:scale-[0.98] font-semibold"
                    >
                      <SymbolIcon name="play_arrow" className="text-[18px]" />
                      <span>2 min start</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handlePostponeActive(activeTask)}
                      className="h-11 px-4 rounded-full bg-surface-container-high hover:bg-surface-bright text-on-surface-variant hover:text-on-surface font-label-md text-label-md flex items-center justify-center gap-1.5 transition-colors active:scale-[0.98]"
                    >
                      <SymbolIcon name="schedule" className="text-[16px]" />
                      <span>Postpone gently</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-surface-container-low rounded-2xl p-space-lg text-center border border-surface-container-high/30">
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  No active task right now. Add one below to begin.
                </p>
              </div>
            )}
          </section>

          {/* SECTION 2: NEXT (Upcoming Tasks) */}
          <section className="flex flex-col gap-space-sm">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-on-surface-variant"></span>
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-semibold">
                  Next
                </span>
              </div>
              <span className="font-label-sm text-label-sm text-on-surface-variant">
                {queuedTasks.length} queued • flexible order
              </span>
            </div>

            <div className="flex flex-col gap-2.5">
              {queuedTasks.map((t) => (
                <div
                  key={t.id}
                  className="bg-surface-container-low rounded-2xl p-space-md flex items-center justify-between gap-space-sm transition-all hover:bg-surface-container border border-surface-container-high/30"
                >
                  <div className="flex items-center gap-space-sm min-w-0 flex-1">
                    <button
                      type="button"
                      aria-label="Mark complete"
                      onClick={() => handleToggleTask(t)}
                      className="-ml-2 w-11 h-11 rounded-full bg-surface-container-high hover:bg-secondary/30 flex items-center justify-center text-transparent hover:text-secondary transition-all flex-shrink-0"
                    >
                      <SymbolIcon name="check" className="text-[16px]" />
                    </button>
                    <div className="flex flex-col min-w-0">
                          <span className="font-headline-sm text-body-lg text-on-surface font-medium break-words">
                        {t.title}
                      </span>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="px-2 py-0.5 rounded-full bg-tertiary-container/15 text-tertiary font-label-sm text-label-sm capitalize">
                          {t.category || 'Care'}
                        </span>
                        <span className="text-on-surface-variant text-[11px]">•</span>
                        <span className="font-label-sm text-label-sm text-on-surface-variant">
                          {t.durationMinutes ? `${t.durationMinutes}m` : '15m'}
                        </span>
                        <span className="text-on-surface-variant text-[11px]">•</span>
                        <span className="font-label-sm text-label-sm text-primary-container">
                          {t.minimum ? 'Small step ready' : 'Choose a small step'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <button
                      type="button"
                      title="Focus on this task now"
                      aria-label="Focus on this task now"
                      onClick={() => setCurrentTask(t.id)}
                      className="px-2.5 py-1 rounded-full bg-surface-container-high hover:bg-primary-container hover:text-on-primary-container text-on-surface-variant font-label-sm text-label-sm flex items-center gap-1 transition-colors active:scale-95"
                    >
                      <SymbolIcon name="play_arrow" className="text-[14px]" />
                      <span>Focus</span>
                    </button>
                  </div>
                </div>
              ))}

              {/* Add Task to Schedule Button */}
              <button
                type="button"
                onClick={() => openModal('create_task')}
                className="w-full py-3 px-space-md rounded-2xl bg-surface-container-low text-on-surface-variant hover:text-primary hover:bg-surface-container font-label-md text-label-md flex items-center justify-center gap-2 transition-all shadow-sm border border-surface-container-high/40 active:scale-[0.99]"
              >
                <SymbolIcon name="add" className="text-[18px]" />
                <span>Add task to schedule</span>
              </button>
            </div>
          </section>

          {/* SECTION 3: REST SUGGESTIONS */}
          <section className="flex flex-col gap-space-sm">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <SymbolIcon name="coffee" className="text-primary-container text-[18px]" />
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-semibold">
                  Rest Suggestions
                </span>
              </div>
              <span className="font-label-sm text-label-sm text-on-surface-variant">Optional breaks</span>
            </div>

            <div className="grid grid-cols-2 gap-space-sm">
              {REST_PRESETS.map((item) => (
                <div
                  key={item.id}
                  className="bg-surface-container-low rounded-2xl p-space-md flex flex-col justify-between gap-space-md hover:bg-surface-container transition-colors shadow-sm border border-surface-container-high/30"
                >
                  <div className="flex flex-col gap-1.5">
                    <div className={`w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center ${item.color}`}>
                      <SymbolIcon name={item.icon} className="text-[18px]" />
                    </div>
                    <h5 className="font-label-lg text-label-lg text-on-surface leading-tight mt-1">
                      {item.title}
                    </h5>
                    <span className="font-label-sm text-label-sm text-on-surface-variant">{item.duration}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleAddRest(item)}
                    className="self-start px-3 py-1 rounded-full bg-surface-container-high text-on-surface-variant hover:text-primary font-label-sm text-label-sm flex items-center gap-1 transition-colors active:scale-95"
                  >
                    <SymbolIcon name="add" className="text-[14px]" />
                    <span>Add</span>
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* SECTION 4: Expandable Completed Today */}
          <section className="flex flex-col">
            <div className="bg-surface-container-low rounded-2xl overflow-hidden border border-surface-container-high/30">
              <button
                type="button"
                onClick={() => setShowCompleted((s) => !s)}
                className="w-full p-space-md flex items-center justify-between text-left hover:bg-surface-container/50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-secondary"></span>
                  <span className="font-label-md text-label-md text-on-surface font-semibold">
                    Completed Today ({completedToday.length})
                  </span>
                </div>
                <SymbolIcon name="keyboard_arrow_down" className={`text-on-surface-variant text-[20px] transition-transform duration-200 ${
                    showCompleted ? 'rotate-180' : ''
                  }`}
                 />
              </button>

              {showCompleted && (
                <div className="px-space-md pb-space-md pt-1 flex flex-col gap-2">
                  {completedToday.length === 0 ? (
                    <p className="font-body-sm text-body-sm text-on-surface-variant/80 py-2 text-center">
                      No tasks completed yet today.
                    </p>
                  ) : (
                    completedToday.map((t) => (
                      <div
                        key={t.id}
                        className="bg-surface-container rounded-xl p-3 flex items-center justify-between gap-space-sm"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <button
                            type="button"
                            onClick={() => uncompleteTask(t.id)}
                            className="w-5 h-5 rounded-full bg-secondary text-surface-container-lowest flex items-center justify-center flex-shrink-0"
                          >
                            <SymbolIcon name="check" className="text-[13px] font-bold" />
                          </button>
                          <div className="flex flex-col min-w-0">
                            <span className="font-body-md text-body-md text-on-surface line-through decoration-on-surface-variant/50 break-words">
                              {t.title}
                            </span>
                            <span className="font-label-sm text-label-sm text-on-surface-variant">
                              Done gently
                            </span>
                          </div>
                        </div>
                        <span className="px-2 py-0.5 rounded-full bg-secondary-container/20 text-secondary font-label-sm text-label-sm flex-shrink-0 capitalize">
                          {t.category || 'Rest'}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </section>
        </div>
      </main>

      {/* DELIGHT INTERACTION MODAL: "Help Me Start" (Untitled-1.html lines 422-474) */}
      <div
        className={`fixed inset-0 z-50 bg-background/80 backdrop-blur-md flex flex-col justify-end transition-opacity duration-300 p-gutter-mobile ${
          isHelpModalOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div
          className={`w-full max-w-xl mx-auto bg-surface-container-high rounded-3xl p-space-lg shadow-2xl flex flex-col gap-space-md transform transition-transform duration-300 border border-surface-container-highest ${
            isHelpModalOpen ? 'translate-y-0' : 'translate-y-8'
          }`}
        >
          {/* Top Handle and Close */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary-container"></span>
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-bold">
                Help Me Start
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsHelpModalOpen(false)}
              className="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center text-on-surface-variant hover:text-on-surface transition-colors"
            >
              <SymbolIcon name="close" className="text-[18px]" />
            </button>
          </div>

          {/* Core Questioning */}
          <div className="flex flex-col text-center py-2 gap-1">
            <h3 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface font-bold tracking-tight">
              Let&apos;s make this easier.
            </h3>
            <p className="font-body-md text-body-md text-on-surface-variant">
              No pressure for the full task. Just step zero.
            </p>
          </div>

          {/* Micro Action Selection */}
          <div className="bg-surface-container-lowest rounded-2xl p-4 flex flex-col gap-2 border border-surface-container-high/50">
            <span className="font-label-sm text-label-sm text-primary-container font-medium">
              First step proposal:
            </span>
            <div className="p-3.5 rounded-xl bg-surface-container-low text-on-surface font-headline-sm text-headline-sm font-semibold flex items-center gap-3">
              <SymbolIcon name="play_circle" className="text-primary-container text-[20px]" />
              <span>{currentProposal}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-2 pt-2">
            <button
              type="button"
              onClick={handleStartProposal}
              className="w-full h-12 rounded-full bg-primary-container hover:bg-primary-fixed-dim text-on-primary-fixed font-label-lg text-label-lg flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-md font-semibold"
            >
              <span>Start with this</span>
              <SymbolIcon name="arrow_forward" className="text-[18px]" />
            </button>
            <button
              type="button"
              onClick={handleNextProposal}
              className="w-full py-2.5 rounded-full text-on-surface-variant hover:text-on-surface font-label-md text-label-md transition-colors"
            >
              Not quite, suggest smaller
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
