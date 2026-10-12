'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '@/lib/store';
import { TaskTimeCategory, EnvironmentPreference, TaskCategory, TaskPriority } from '@/types';
import { X, Plus, ChevronDown, ChevronUp, Sparkles, Check } from 'lucide-react';

export function TaskCreatorModal() {
  const { closeModal, addTask } = useApp();

  const [title, setTitle] = useState('');
  const [when, setWhen] = useState<TaskTimeCategory>('today');
  const [priority, setPriority] = useState<TaskPriority>('must');
  const [category, setCategory] = useState<TaskCategory>('productive');
  const [icon, setIcon] = useState('📌');
  const [minimum, setMinimum] = useState('');
  const [normal, setNormal] = useState('');
  const [extra, setExtra] = useState('');
  const [company, setCompany] = useState<EnvironmentPreference>('no_preference');
  const [durationMinutes, setDurationMinutes] = useState(15);
  const [showExtraFields, setShowExtraFields] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const EMOJI_OPTIONS = ['📌', '💻', '💧', '🪥', '🍳', '☕', '🧹', '🚶', '✨', '📖'];

  // Auto focus input on mount & keyboard escape listener
  useEffect(() => {
    inputRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [closeModal]);

  // Intelligent icon suggestion based on title keywords if user hasn't explicitly chosen
  const detectIcon = (text: string, currentCategory: TaskCategory): string => {
    const lower = text.toLowerCase();
    if (lower.includes('water') || lower.includes('drink') || lower.includes('hydrate')) return '💧';
    if (lower.includes('teeth') || lower.includes('brush')) return '🪥';
    if (lower.includes('coffee') || lower.includes('tea') || lower.includes('rest') || lower.includes('break')) return '☕';
    if (lower.includes('cook') || lower.includes('food') || lower.includes('eat') || lower.includes('lunch') || lower.includes('dinner')) return '🍳';
    if (lower.includes('clean') || lower.includes('tidy') || lower.includes('wash') || lower.includes('desk')) return '🧹';
    if (lower.includes('walk') || lower.includes('move') || lower.includes('stretch')) return '🚶';
    if (lower.includes('read') || lower.includes('book') || lower.includes('journal')) return '📖';
    if (lower.includes('code') || lower.includes('project') || lower.includes('laptop') || lower.includes('work')) return '💻';
    if (currentCategory === 'rest') return '☕';
    if (currentCategory === 'wellness') return '💧';
    return icon || '📌';
  };

  const handleCategoryChange = (newCat: TaskCategory) => {
    setCategory(newCat);
    if (newCat === 'rest') {
      setIcon('☕');
      setPriority('should');
    } else if (newCat === 'wellness') {
      setIcon('💧');
      setPriority('must');
    } else {
      setIcon('📌');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanTitle = title.trim();
    if (!cleanTitle) return;

    const chosenIcon = icon === '📌' ? detectIcon(cleanTitle, category) : icon;
    const defaultMin = cleanTitle.length > 20 
      ? 'Start for 2 minutes and make 1 small edit or step' 
      : `Take 1 small step towards: ${cleanTitle}`;

    addTask({
      title: cleanTitle,
      category,
      icon: chosenIcon,
      timeCategory: when,
      durationMinutes,
      priority,
      minimum: minimum.trim() || defaultMin,
      normal: normal.trim() || cleanTitle,
      extra: extra.trim() || undefined,
      steps: [
        { id: `s-${Date.now()}-1`, title: 'Settle in workspace', completed: false },
        { id: `s-${Date.now()}-2`, title: minimum.trim() || 'Do 2 minutes of effortless start', completed: false, isMinimum: true },
      ],
      companyPreference: company,
    });

    closeModal();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-end justify-center pb-[env(safe-area-inset-bottom,0px)] sm:items-center sm:p-4 bg-stone-900/40 dark:bg-black/60 backdrop-blur-[1px] animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="creator-modal-title"
      onClick={closeModal}
    >
      <div
        className="modal-sheet relative w-full sm:max-w-lg bg-surface dark:bg-surface-dark border-t sm:border border-stone-200/90 dark:border-white/[0.08] sm:rounded-3xl rounded-t-3xl shadow-2xl overflow-y-auto animate-slide-up flex flex-col"
        style={{ maxHeight: 'calc(100dvh - env(safe-area-inset-top, 0px) - env(safe-area-inset-bottom, 0px) - 0.5rem)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag handle (mobile) */}
        <div className="sm:hidden flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-stone-300 dark:bg-white/20" />
        </div>

        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 pt-3 sm:pt-5 pb-3 border-b border-stone-100 dark:border-white/[0.06]">
          <div className="flex items-center gap-2">
            <Plus className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <h2 id="creator-modal-title" className="text-xs font-bold uppercase tracking-wider text-ink-muted dark:text-linen-subtle">
              New Activity • Low Friction
            </h2>
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="px-5 sm:px-7 py-5 overflow-y-auto space-y-4 flex-1">
          {/* Main Title Input — The single mandatory requirement */}
          <div className="space-y-1.5">
            <label 
              htmlFor="task-title-input" 
              className="text-xs font-bold uppercase tracking-wider text-ink-primary dark:text-linen"
            >
              What do you want to do?
            </label>
            <input
              ref={inputRef}
              id="task-title-input"
              type="text"
              required
              inputMode="text"
              enterKeyHint="done"
              placeholder="e.g. Work on project, tidy desk..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3.5 rounded-2xl border border-stone-200 dark:border-white/[0.12] bg-stone-50/60 dark:bg-white/[0.04] text-base text-ink-primary dark:text-linen placeholder:text-ink-subtle dark:placeholder:text-linen-faint focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all font-medium"
            />
            <p className="text-[11px] text-ink-subtle dark:text-linen-faint">
              Title is all that is required. Sensible defaults handle everything else.
            </p>
          </div>

          {/* Quick Submit & Progressive Disclosure Toggle */}
          <div className="pt-1 space-y-3">
            <button
              type="submit"
              disabled={!title.trim()}
              className="w-full py-3.5 px-6 rounded-2xl bg-amber-500 hover:bg-amber-400 active:bg-amber-600 disabled:opacity-40 text-stone-950 font-bold text-sm sm:text-base shadow-[0_2px_14px_rgba(224,142,69,0.28)] transition-all active:scale-[0.99] flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4 stroke-[2.5]" />
              <span>Add task</span>
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setShowExtraFields(!showExtraFields)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-300 transition-colors py-2 px-3 rounded-xl hover:bg-amber-500/10 min-h-[44px]"
              >
                <span>{showExtraFields ? 'Hide details' : 'More options (timing, minimum, priority...)'}</span>
                {showExtraFields ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Expandable Advanced Options Section */}
          {showExtraFields && (
            <div className="space-y-4 pt-3 border-t border-stone-100 dark:border-white/[0.06] animate-fade-in">
              {/* When Selector */}
              <div className="space-y-1.5">
                <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted dark:text-linen-subtle">
                  When?
                </span>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: 'today', label: 'Today' },
                    { id: 'now', label: 'Now' },
                    { id: 'later', label: 'Later' },
                    { id: 'notime', label: 'No time' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setWhen(item.id as TaskTimeCategory)}
                      className={`py-2 px-2.5 rounded-xl text-xs font-semibold border transition-all text-center min-h-[44px] ${
                        when === item.id
                          ? 'bg-amber-500/20 border-amber-500/40 text-amber-800 dark:text-amber-300 font-bold shadow-sm'
                          : 'border-stone-200 dark:border-white/[0.08] text-ink-secondary dark:text-linen-subtle active:bg-stone-100 dark:active:bg-white/[0.04]'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Priority Selector */}
              <div className="space-y-1.5">
                <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted dark:text-linen-subtle">
                  Priority
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'must', label: 'Must', desc: 'Essential today' },
                    { id: 'should', label: 'Should', desc: 'Meaningful' },
                    { id: 'could', label: 'Could', desc: 'If energy permits' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setPriority(item.id as TaskPriority)}
                      className={`py-2 px-2.5 rounded-xl text-xs font-semibold border transition-all text-center min-h-[44px] ${
                        priority === item.id
                          ? 'bg-amber-500/20 border-amber-500/40 text-amber-800 dark:text-amber-300 font-bold shadow-sm'
                          : 'border-stone-200 dark:border-white/[0.08] text-ink-secondary dark:text-linen-subtle active:bg-stone-100'
                      }`}
                    >
                      <div>{item.label}</div>
                      <div className="text-[10px] opacity-75 font-normal">{item.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Activity Type Selector */}
              <div className="space-y-1.5">
                <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted dark:text-linen-subtle">
                  Activity Type
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'productive', label: '📋 Task' },
                    { id: 'wellness', label: '💧 Care' },
                    { id: 'rest', label: '☕ Rest' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleCategoryChange(item.id as TaskCategory)}
                      className={`py-2 px-2.5 rounded-xl text-xs font-semibold border transition-all text-center min-h-[44px] ${
                        category === item.id
                          ? 'bg-amber-500/20 border-amber-500/40 text-amber-800 dark:text-amber-300 font-bold shadow-sm'
                          : 'border-stone-200 dark:border-white/[0.08] text-ink-secondary dark:text-linen-subtle'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Icon Selector */}
              <div className="space-y-1.5">
                <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted dark:text-linen-subtle">
                  Icon
                </span>
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-0.5 scrollbar-none">
                  {EMOJI_OPTIONS.map((e) => (
                    <button
                      key={e}
                      type="button"
                      onClick={() => setIcon(e)}
                      className={`w-10 h-10 rounded-xl text-lg flex items-center justify-center shrink-0 border transition-all ${
                        icon === e
                          ? 'border-amber-500 bg-amber-500/15 scale-105 shadow-sm'
                          : 'border-stone-200 dark:border-white/[0.08] hover:bg-stone-100 dark:hover:bg-white/[0.04]'
                      }`}
                      aria-label={`Select icon ${e}`}
                    >
                      {e}
                    </button>
                  ))}
                </div>
              </div>

              {/* Minimum input */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-ink-secondary dark:text-linen-subtle">
                  The Minimum (smallest possible version):
                </label>
                <input
                  type="text"
                  placeholder="e.g. Open file and look at it for 2 minutes"
                  value={minimum}
                  onChange={(e) => setMinimum(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-stone-200 dark:border-white/[0.12] bg-surface dark:bg-surface-dark text-ink-primary dark:text-linen focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <p className="text-[10px] text-amber-700 dark:text-amber-400 font-medium">
                  The minimum counts as complete. No guilt.
                </p>
              </div>

              {/* Normal & Extra inputs */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-ink-secondary dark:text-linen-subtle">
                  Normal (intended version):
                </label>
                <input
                  type="text"
                  placeholder="e.g. Work for 20 minutes"
                  value={normal}
                  onChange={(e) => setNormal(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-stone-200 dark:border-white/[0.12] bg-surface dark:bg-surface-dark text-ink-primary dark:text-linen focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-ink-secondary dark:text-linen-subtle">
                  Extra (optional if surplus energy):
                </label>
                <input
                  type="text"
                  placeholder="e.g. Commit code and write summary"
                  value={extra}
                  onChange={(e) => setExtra(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-stone-200 dark:border-white/[0.12] bg-surface dark:bg-surface-dark text-ink-primary dark:text-linen focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {/* Duration slider */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold text-ink-secondary dark:text-linen-subtle">
                  <span>Approximate time:</span>
                  <span className="text-amber-700 dark:text-amber-400 font-bold">{durationMinutes} minutes</span>
                </div>
                <input
                  type="range"
                  min={2}
                  max={60}
                  step={1}
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(Number(e.target.value))}
                  className="w-full h-2 accent-amber-500 bg-stone-200 dark:bg-white/[0.12] rounded-lg cursor-pointer"
                />
              </div>

              {/* Environment / Company preference */}
              <div className="space-y-1.5">
                <span className="text-xs font-semibold text-ink-secondary dark:text-linen-subtle">
                  Environment preference:
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'alone', label: '👤 Alone' },
                    { id: 'someone_nearby', label: '👥 Someone nearby' },
                    { id: 'body_double', label: '📞 Body double' },
                    { id: 'background_company', label: '🎧 Background audio' },
                    { id: 'no_preference', label: 'No preference' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setCompany(item.id as EnvironmentPreference)}
                      className={`p-2.5 rounded-xl text-xs font-medium border text-left min-h-[44px] transition-all ${
                        company === item.id
                          ? 'bg-amber-500/15 border-amber-500/35 text-amber-900 dark:text-amber-200 font-semibold'
                          : 'border-stone-200 dark:border-white/[0.08] text-ink-secondary dark:text-linen-subtle active:bg-stone-50'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
