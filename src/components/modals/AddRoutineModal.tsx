'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import { X, Sparkles } from 'lucide-react';

const ROUTINE_ICONS = ['✨', '🌅', '🌙', '☕', '💧', '🧘', '🚶', '📚', '🧹', '🎧'];

export function AddRoutineModal() {
  const { addRoutine, closeModal } = useApp();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('✨');
  const [timeOfDay, setTimeOfDay] = useState<'morning' | 'afternoon' | 'evening' | 'anytime'>('anytime');

  const handleCreateRoutine = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addRoutine({
      title: title.trim(),
      description: description.trim() || 'Custom routine',
      icon,
      enabled: true,
      timeOfDay,
      steps: [
        {
          id: `step-${Date.now()}-1`,
          title: 'First gentle step',
          durationMinutes: 5,
          completed: false,
        },
      ],
    });

    closeModal();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center pb-[env(safe-area-inset-bottom,0px)] sm:items-center sm:p-4 bg-stone-900/40 dark:bg-black/60 backdrop-blur-[1px] animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-routine-modal-title"
      onClick={closeModal}
    >
      <div
        className="modal-sheet relative w-full sm:max-w-md bg-surface dark:bg-surface-dark border-t sm:border border-stone-200/90 dark:border-white/[0.08] sm:rounded-3xl rounded-t-3xl shadow-2xl p-5 sm:p-6 overflow-y-auto overscroll-contain animate-slide-up space-y-4"
        style={{ maxHeight: 'calc(100dvh - env(safe-area-inset-top, 0px) - env(safe-area-inset-bottom, 0px) - 0.5rem)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sm:hidden flex justify-center -mt-2 pb-1">
          <div className="w-10 h-1 rounded-full bg-stone-300 dark:bg-white/20" />
        </div>

        <div className="flex items-center justify-between pb-2 border-b border-stone-100 dark:border-white/[0.06]">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <h3 id="add-routine-modal-title" className="text-lg font-bold text-ink-primary dark:text-linen">
              New Routine
            </h3>
          </div>
          <button
            type="button"
            onClick={closeModal}
            aria-label="Close"
            className="p-2 rounded-xl text-ink-muted hover:text-ink-primary dark:hover:text-linen hover:bg-stone-100 dark:hover:bg-white/[0.04] transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleCreateRoutine} className="space-y-4">
          <div>
            <label htmlFor="routine-title-input" className="text-xs font-semibold text-ink-secondary dark:text-linen-subtle block mb-1">
              Routine Title
            </label>
            <input
              id="routine-title-input"
              type="text"
              required
              placeholder="e.g. Afternoon reset, Reading wind-down..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-3 text-base sm:text-sm rounded-xl border border-stone-200 dark:border-white/[0.12] bg-stone-50/50 dark:bg-white/[0.04] text-ink-primary dark:text-linen placeholder:text-ink-subtle focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div>
            <label htmlFor="routine-desc-input" className="text-xs font-semibold text-ink-secondary dark:text-linen-subtle block mb-1">
              Description
            </label>
            <textarea
              id="routine-desc-input"
              rows={2}
              placeholder="Short note on what this routine is for"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 text-base sm:text-sm rounded-xl border border-stone-200 dark:border-white/[0.12] bg-stone-50/50 dark:bg-white/[0.04] text-ink-primary dark:text-linen placeholder:text-ink-subtle focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
            />
          </div>

          <div>
            <span className="text-xs font-semibold text-ink-secondary dark:text-linen-subtle block mb-1.5">
              Icon
            </span>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-0.5 scrollbar-none">
              {ROUTINE_ICONS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setIcon(emoji)}
                  className={`w-10 h-10 rounded-xl text-lg flex items-center justify-center shrink-0 border transition-all ${
                    icon === emoji
                      ? 'border-amber-500 bg-amber-500/15 scale-105 shadow-sm'
                      : 'border-stone-200 dark:border-white/[0.08] hover:bg-stone-100 dark:hover:bg-white/[0.04]'
                  }`}
                  aria-label={`Select icon ${emoji}`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          <div>
            <span className="text-xs font-semibold text-ink-secondary dark:text-linen-subtle block mb-1.5">
              Time of Day
            </span>
            <div className="grid grid-cols-4 gap-1.5">
              {[
                { id: 'morning', label: 'Morning' },
                { id: 'afternoon', label: 'Midday' },
                { id: 'evening', label: 'Evening' },
                { id: 'anytime', label: 'Anytime' },
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTimeOfDay(t.id as any)}
                  className={`py-2 px-1.5 rounded-xl text-xs font-semibold border text-center transition-all min-h-[38px] ${
                    timeOfDay === t.id
                      ? 'bg-amber-500/20 border-amber-500/40 text-amber-800 dark:text-amber-300 font-bold'
                      : 'border-stone-200 dark:border-white/[0.08] text-ink-secondary dark:text-linen-subtle'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={!title.trim()}
              className="w-full py-3.5 px-5 rounded-2xl bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-semibold text-sm shadow-sm transition-all active:scale-[0.99] min-h-[44px]"
            >
              Create routine
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
