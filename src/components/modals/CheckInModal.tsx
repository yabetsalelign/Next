'use client';

import React from 'react';
import { useApp } from '@/lib/store';
import { X, HeartHandshake, BookOpen, Sparkles, Coffee } from 'lucide-react';

export function CheckInModal() {
  const { closeModal, openModal, setNotPlanningToday, activeReset } = useApp();

  return (
    <div 
      className="fixed inset-0 z-50 flex items-end justify-center pb-[env(safe-area-inset-bottom,0px)] sm:items-center sm:p-4 bg-slate-900/40 dark:bg-slate-950/70 animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="checkin-title"
      onClick={closeModal}
    >
      <div
        className="modal-sheet relative w-full sm:max-w-md bg-surface dark:bg-surface-dark border-t sm:border border-slate-200/90 dark:border-slate-800 sm:rounded-3xl rounded-t-3xl shadow-2xl p-6 overflow-y-auto animate-slide-up space-y-5"
        style={{ maxHeight: 'calc(100dvh - env(safe-area-inset-top, 0px) - env(safe-area-inset-bottom, 0px) - 1rem)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag handle (mobile) */}
        <div className="sm:hidden flex justify-center -mt-2 pb-2">
          <div className="w-10 h-1 rounded-full bg-slate-300 dark:bg-slate-600" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 id="checkin-title" className="text-xl font-bold tracking-tight text-ink-primary dark:text-slate-100">
              Check in
            </h3>
            <p className="text-xs text-ink-muted dark:text-slate-400 mt-0.5">
              Notice how you feel. No pressure, no score.
            </p>
          </div>
          <button
            type="button"
            onClick={closeModal}
            className="p-1.5 rounded-xl text-ink-muted hover:text-ink-primary hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Options */}
        <div className="space-y-2.5">
          {/* Body & Energy Check */}
          <button
            type="button"
            onClick={() => {
              closeModal();
              openModal('body_check');
            }}
            className="w-full flex items-center gap-3.5 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-surface dark:bg-surface-dark hover:bg-slate-50 dark:hover:bg-slate-800/60 text-left transition-all active:scale-[0.99]"
          >
            <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 flex items-center justify-center shrink-0">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-ink-primary dark:text-slate-100">
                Body & energy check
              </h4>
              <p className="text-xs text-ink-muted dark:text-slate-400 mt-0.5">
                Notice physical fatigue, tension, and hydration.
              </p>
            </div>
          </button>

          {/* Quick Journal */}
          <button
            type="button"
            onClick={() => {
              closeModal();
              openModal('journal');
            }}
            className="w-full flex items-center gap-3.5 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-surface dark:bg-surface-dark hover:bg-slate-50 dark:hover:bg-slate-800/60 text-left transition-all active:scale-[0.99]"
          >
            <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-ink-secondary dark:text-slate-300 flex items-center justify-center shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-ink-primary dark:text-slate-100">
                Quick reflection
              </h4>
              <p className="text-xs text-ink-muted dark:text-slate-400 mt-0.5">
                Answer one calm question to clear your head.
              </p>
            </div>
          </button>

          {/* Fresh Start / Reset */}
          <button
            type="button"
            onClick={() => {
              closeModal();
              openModal('fresh_start');
            }}
            className="w-full flex items-center gap-3.5 p-4 rounded-2xl border border-brand-100 dark:border-brand-900/50 bg-brand-50/50 dark:bg-brand-950/25 hover:bg-brand-50 dark:hover:bg-brand-950/40 text-left transition-all active:scale-[0.99]"
          >
            <div className="w-10 h-10 rounded-xl bg-brand-600 text-white flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-semibold text-brand-900 dark:text-brand-200">
                  {activeReset ? activeReset.name : '7-Day Fresh Start'}
                </h4>
                {activeReset && (
                  <span className="text-[10px] font-semibold text-brand-600 bg-brand-100 px-1.5 py-0.5 rounded-full dark:bg-brand-900 dark:text-brand-300">
                    Active
                  </span>
                )}
              </div>
              <p className="text-xs text-brand-700/80 dark:text-brand-300/80 mt-0.5">
                {activeReset ? 'View your daily progress and reset checklist' : 'A gentle week of basic self-care'}
              </p>
            </div>
          </button>

          {/* Take today off */}
          <button
            type="button"
            onClick={() => {
              setNotPlanningToday(true);
              closeModal();
            }}
            className="w-full flex items-center gap-3.5 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-surface dark:bg-surface-dark hover:bg-slate-50 dark:hover:bg-slate-800/60 text-left transition-all active:scale-[0.99]"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <Coffee className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-ink-primary dark:text-slate-100">
                I&apos;m taking today off
              </h4>
              <p className="text-xs text-ink-muted dark:text-slate-400 mt-0.5">
                No obligations, no overdue markers, pure rest.
              </p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
