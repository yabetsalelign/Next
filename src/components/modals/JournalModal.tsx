'use client';

import React, { useState, useMemo } from 'react';
import { useApp } from '@/lib/store';
import { JOURNAL_PROMPTS_DAILY, JOURNAL_PROMPTS_RESET } from '@/lib/sampleData';
import { X, BookOpen, Check, ChevronLeft, ChevronRight } from 'lucide-react';

export function JournalModal() {
  const { closeModal, addJournalEntry, activeReset, journalEntries } = useApp();
  const [response, setResponse] = useState('');
  const [promptIndex, setPromptIndex] = useState(0);
  const [saved, setSaved] = useState(false);

  const today = new Date().toISOString().split('T')[0];

  const prompts = activeReset ? JOURNAL_PROMPTS_RESET : JOURNAL_PROMPTS_DAILY;
  const currentPrompt = prompts[promptIndex];

  // Today's existing entries
  const todayEntries = journalEntries.filter(e => e.date === today);

  const handleSave = () => {
    if (!response.trim()) return;
    addJournalEntry({
      date: today,
      prompt: currentPrompt,
      response: response.trim(),
      resetId: activeReset?.id,
    });
    setSaved(true);
    setTimeout(() => {
      closeModal();
    }, 700);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-end justify-center pb-[env(safe-area-inset-bottom,0px)] sm:items-center sm:p-4 bg-slate-900/40 dark:bg-slate-950/70"
      role="dialog"
      aria-modal="true"
      aria-labelledby="journal-modal-title"
      onClick={closeModal}
    >
      <div
        className="modal-sheet relative w-full sm:max-w-md bg-surface dark:bg-surface-dark border-t sm:border border-slate-200/90 dark:border-slate-800 sm:rounded-3xl rounded-t-3xl shadow-2xl overflow-y-auto animate-slide-up flex flex-col"
        style={{ maxHeight: 'calc(100dvh - env(safe-area-inset-top, 0px) - env(safe-area-inset-bottom, 0px) - 0.5rem)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag handle (mobile) */}
        <div className="sm:hidden flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-slate-300 dark:bg-slate-600" />
        </div>
        
        <div className="flex items-center justify-between px-6 pt-5 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-brand-600 dark:text-brand-400" />
            <p className="text-xs font-bold uppercase tracking-wider text-ink-muted dark:text-slate-400">
              Journal • Optional
            </p>
          </div>
          <button onClick={closeModal} aria-label="Close" className="p-1.5 rounded-xl text-ink-muted hover:text-ink-primary dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 sm:p-7 space-y-5">
          {saved ? (
            <div className="text-center py-8 space-y-3 animate-fade-in">
              <div className="w-14 h-14 rounded-full bg-gentle-greenBg text-gentle-green mx-auto flex items-center justify-center">
                <Check className="w-7 h-7" />
              </div>
              <p className="text-base font-semibold text-ink-primary dark:text-slate-100">Recorded.</p>
              <p className="text-xs text-ink-muted">Stored only on your device.</p>
            </div>
          ) : (
            <>
              {/* Prompt selector */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 id="journal-modal-title" className="text-xs font-bold uppercase tracking-wider text-ink-muted dark:text-slate-400">
                    {activeReset ? 'Reset Reflection' : 'Daily Check-In'}
                  </h3>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => { setPromptIndex(Math.max(0, promptIndex - 1)); setResponse(''); }}
                      disabled={promptIndex === 0}
                      className="p-1 rounded-lg text-ink-muted hover:text-ink-primary disabled:opacity-30 transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="text-[11px] text-ink-subtle">{promptIndex + 1} / {prompts.length}</span>
                    <button
                      type="button"
                      onClick={() => { setPromptIndex(Math.min(prompts.length - 1, promptIndex + 1)); setResponse(''); }}
                      disabled={promptIndex === prompts.length - 1}
                      className="p-1 rounded-lg text-ink-muted hover:text-ink-primary disabled:opacity-30 transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-brand-50/60 dark:bg-brand-950/30 border border-brand-200/60 dark:border-brand-900/40">
                  <p className="text-sm font-semibold text-brand-900 dark:text-brand-200 leading-relaxed">
                    {currentPrompt}
                  </p>
                </div>
              </div>

              {/* Text area */}
              <textarea
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                placeholder="Whatever comes to mind. No structure required."
                rows={4}
                className="w-full px-4 py-3 text-sm rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 text-ink-primary dark:text-slate-100 placeholder:text-ink-subtle focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none transition-all"
                autoFocus
              />

              <p className="text-[11px] text-ink-subtle">
                Stored locally only. Never shared. Never judged.
              </p>

              {/* Previous entries today */}
              {todayEntries.length > 0 && (
                <div className="space-y-2">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-subtle">Earlier today</p>
                  {todayEntries.slice(0, 2).map(entry => (
                    <div key={entry.id} className="p-3 rounded-xl bg-slate-50/80 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800">
                      <p className="text-[11px] text-ink-muted mb-1 italic">{entry.prompt}</p>
                      <p className="text-xs text-ink-secondary dark:text-slate-300 line-clamp-2">{entry.response}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 py-3 px-4 rounded-2xl border border-slate-200 dark:border-slate-700 text-ink-muted hover:text-ink-primary font-medium text-xs sm:text-sm transition-colors text-center"
                >
                  SKIP
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={!response.trim()}
                  className="flex-1 py-3 px-4 rounded-2xl bg-brand-600 hover:bg-brand-700 disabled:opacity-40 text-white font-medium text-xs sm:text-sm shadow-sm transition-all"
                >
                  SAVE
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
