'use client';

import { SymbolIcon } from '@/components/ui/SymbolIcon';
import React, { useState } from 'react';
import { useApp } from '@/lib/store';

const ROUTINE_ICONS = ['✨', '🌅', '🌙', '☕', '💧', '🧘', '🚶', '📚'];

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
      className="fixed inset-0 z-50 flex items-end justify-center pb-[env(safe-area-inset-bottom,0px)] sm:items-center sm:p-4 bg-black/60 backdrop-blur-[2px] animate-fade-in"
      role="dialog"
      aria-modal="true"
      onClick={closeModal}
    >
      <section
        className="relative z-20 w-full max-w-lg bg-[#1b1c20] border-t sm:border border-white/10 rounded-t-[28px] sm:rounded-[28px] shadow-2xl px-5 pt-3 pb-8 flex flex-col animate-slide-up"
        onClick={(e) => e.stopPropagation()}
        data-purpose="new-routine-modal"
      >
        {/* Drawer Grab Handle */}
        <div className="w-full flex justify-center py-1">
          <div aria-hidden="true" className="w-10 h-1 rounded-full bg-zinc-600/70"></div>
        </div>

        {/* Modal Header */}
        <header className="flex justify-between items-center mt-3 mb-5">
          <div className="flex items-center space-x-2">
            <span className="text-[#ffb963] text-lg">✨</span>
            <h2 className="text-lg font-bold text-on-surface tracking-tight font-headline-sm">New Routine</h2>
          </div>
          <button
            type="button"
            aria-label="Close dialog"
            onClick={closeModal}
            className="w-8 h-8 flex items-center justify-center rounded-full text-on-surface-variant hover:text-white transition-colors"
          >
            <SymbolIcon name="close" className="text-[20px]" />
          </button>
        </header>

        {/* Routine Form Elements */}
        <form onSubmit={handleCreateRoutine} className="space-y-4">
          {/* SECTION 1: Routine Title */}
          <div className="space-y-1.5" data-purpose="routine-title-input">
            <label className="block text-xs font-semibold text-on-surface-variant font-label-md" htmlFor="routine-title">
              Routine Title
            </label>
            <input
              id="routine-title"
              type="text"
              required
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Afternoon reset, Reading wind-down..."
              className="w-full h-12 px-4 py-3 bg-[#24252a] text-sm text-on-surface placeholder:text-on-surface-variant rounded-xl border border-zinc-700/60 focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition duration-150 font-body-md"
            />
          </div>

          {/* SECTION 2: Description */}
          <div className="space-y-1.5" data-purpose="routine-description-input">
            <label className="block text-xs font-semibold text-on-surface-variant font-label-md" htmlFor="routine-description">
              Description
            </label>
            <textarea
              id="routine-description"
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Short note on what this routine is for"
              className="w-full px-4 py-3 bg-[#24252a] text-sm text-on-surface placeholder:text-on-surface-variant rounded-xl border border-zinc-700/60 resize-none focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition duration-150 font-body-md"
            />
          </div>

          {/* SECTION 3: Icon Picker */}
          <div className="space-y-1.5" data-purpose="routine-icon-selector">
            <label className="block text-xs font-semibold text-on-surface-variant font-label-md">
              Icon
            </label>
            <div className="flex items-center space-x-2.5 overflow-x-auto no-scrollbar py-1">
              {ROUTINE_ICONS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setIcon(emoji)}
                  className={`flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center text-lg transition-all ${
                    icon === emoji
                      ? 'bg-[#282725] border-2 border-primary-container text-primary-container shadow-sm scale-105'
                      : 'bg-[#24252a] border border-zinc-700/50 hover:border-zinc-500'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* SECTION 4: Time of Day Selector */}
          <div className="space-y-1.5 pt-1" data-purpose="time-of-day-selector">
            <label className="block text-xs font-semibold text-on-surface-variant font-label-md">
              Time of Day
            </label>
            <div className="grid grid-cols-4 gap-2">
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
                  className={`py-2.5 rounded-xl text-xs font-medium transition-all text-center ${
                    timeOfDay === t.id
                      ? 'bg-[#362b1e] border border-primary-container text-primary-container shadow-inner font-semibold'
                      : 'bg-[#24252a] border border-zinc-700/50 text-zinc-300 hover:border-zinc-500'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Primary Action CTA */}
          <div className="pt-3" data-purpose="create-routine-action">
            <button
              type="submit"
              disabled={!title.trim()}
              className="w-full py-3.5 px-4 bg-primary-container hover:bg-primary-fixed text-on-primary-fixed font-semibold text-sm rounded-xl transition duration-150 flex items-center justify-center shadow-md active:scale-[0.98] disabled:opacity-40"
            >
              Create routine
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
