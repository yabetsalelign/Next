'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '@/lib/store';
import { TaskTimeCategory, EnvironmentPreference, TaskCategory, TaskPriority } from '@/types';
import { X, Plus, ChevronDown, ChevronUp, Sparkles, Check } from 'lucide-react';

export function TaskCreatorModal() {
  const { closeModal, addTask, settings } = useApp();
  const paceLabel = settings.startingDifficulty === 'structured'
    ? 'Focused'
    : settings.startingDifficulty === 'balanced'
      ? 'Steady'
      : 'Gentle';

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
      className="fixed inset-0 z-50 flex items-end justify-center pb-[env(safe-area-inset-bottom,0px)] sm:items-center sm:p-4 bg-black/60 backdrop-blur-[2px] animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="creator-modal-title"
      onClick={closeModal}
    >
      <div
        className="modal-sheet relative w-full sm:max-w-[420px] bg-surface-container-low border-t sm:border border-outline-variant sm:rounded-[28px] rounded-t-[28px] shadow-2xl overflow-hidden animate-slide-up flex flex-col pt-3"
        style={{ maxHeight: 'calc(100dvh - env(safe-area-inset-top, 0px) - env(safe-area-inset-bottom, 0px) - 0.5rem)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Grab Handle */}
        <div className="w-10 h-1 bg-surface-container-highest rounded-full mx-auto mb-3" />

        {/* Drawer Subheader & Close */}
        <div className="flex items-center justify-between px-6 pb-3">
          <div className="flex items-center space-x-1.5 text-primary font-semibold text-[11px] tracking-wide uppercase">
            <span>+</span>
            <span>New Activity</span>
            <span className="text-on-surface-variant font-normal">•</span>
            <span className="text-primary">{paceLabel} pace</span>
          </div>
          <button
            type="button"
            onClick={closeModal}
            aria-label="Close sheet"
            className="text-on-surface-variant hover:text-on-surface transition-colors p-1 rounded-lg hover:bg-surface-container-high"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body Area */}
        <form onSubmit={handleSubmit} className="px-5 pb-5 overflow-y-auto space-y-3.5 flex-1 scrollbar-none">
          {/* Title & Input */}
          <div>
            <label 
              htmlFor="task-title-input" 
              className="block text-[11px] font-bold uppercase tracking-wider text-on-surface mb-2"
            >
              What do you want to do?
            </label>
            {/* Active input container with golden amber ring border */}
            <div className="relative flex items-center w-full bg-surface-container-lowest border-2 border-primary rounded-2xl px-4 py-3 shadow-inner focus-within:ring-2 focus-within:ring-primary/20">
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
                className="w-full bg-transparent border-0 p-0 text-sm text-on-surface placeholder:text-on-surface-variant focus:ring-0 focus:outline-none leading-none tracking-normal font-medium"
              />
            </div>
            {/* Encouraging Helper Copy */}
            <p className="text-[11px] text-on-surface-variant mt-2 px-1 leading-snug">
              Title is all that is required. Sensible defaults handle everything else.
            </p>
          </div>

          {/* Primary Action Button: Add Task */}
          <button
            type="submit"
            disabled={!title.trim()}
            className="w-full h-12 bg-primary hover:bg-primary-container disabled:opacity-40 active:scale-[0.99] transition text-on-primary font-bold text-sm rounded-2xl flex items-center justify-center space-x-2 shadow-md cursor-pointer"
          >
            <Check className="w-4 h-4 stroke-[2.6]" />
            <span>Add task</span>
          </button>

          {/* Expandable Options Trigger */}
          <button
            type="button"
            onClick={() => setShowExtraFields(!showExtraFields)}
            className="w-full pt-1 pb-1 flex items-center justify-center space-x-1.5 text-primary text-xs font-semibold hover:opacity-90 transition cursor-pointer"
          >
            <span>{showExtraFields ? 'Hide extra details' : 'More options (timing, minimum, priority...)'}</span>
            {showExtraFields ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {/* Expandable Advanced Options Section */}
          {showExtraFields && (
            <div className="space-y-4 pt-3 border-t border-outline-variant animate-fade-in text-left">
              {/* When Selector */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
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
                      className={`py-2 px-2.5 rounded-xl text-xs font-semibold border transition-all text-center min-h-[40px] cursor-pointer ${
                        when === item.id
                          ? 'bg-primary/20 border-primary text-primary font-bold shadow-sm'
                          : 'border-outline-variant bg-surface-container-lowest text-on-surface-variant hover:text-on-surface'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Priority Selector */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
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
                      className={`py-2 px-2 rounded-xl text-xs font-semibold border transition-all text-center min-h-[40px] cursor-pointer ${
                        priority === item.id
                          ? 'bg-primary/20 border-primary text-primary font-bold shadow-sm'
                          : 'border-outline-variant bg-surface-container-lowest text-on-surface-variant hover:text-on-surface'
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
                <span className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
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
                      className={`py-2 px-2.5 rounded-xl text-xs font-semibold border transition-all text-center min-h-[40px] cursor-pointer ${
                        category === item.id
                          ? 'bg-primary/20 border-primary text-primary font-bold shadow-sm'
                          : 'border-outline-variant bg-surface-container-lowest text-on-surface-variant hover:text-on-surface'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Icon Selector */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
                  Icon
                </span>
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-0.5 scrollbar-none">
                  {EMOJI_OPTIONS.map((e) => (
                    <button
                      key={e}
                      type="button"
                      onClick={() => setIcon(e)}
                      className={`w-9 h-9 rounded-xl text-base flex items-center justify-center shrink-0 border transition-all cursor-pointer ${
                        icon === e
                          ? 'border-primary bg-primary/20 scale-105 shadow-sm'
                          : 'border-outline-variant bg-surface-container-lowest hover:bg-surface-container-high'
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
                <label className="text-xs font-semibold text-on-surface">
                  The Minimum (smallest possible version):
                </label>
                <input
                  type="text"
                  placeholder="e.g. Open file and look at it for 2 minutes"
                  value={minimum}
                  onChange={(e) => setMinimum(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-outline-variant bg-surface-container-lowest text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <p className="text-[10px] text-primary/80 font-medium">
                  The minimum counts as complete. No guilt.
                </p>
              </div>

              {/* Normal & Extra inputs */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-on-surface">
                  Normal (intended version):
                </label>
                <input
                  type="text"
                  placeholder="e.g. Work for 20 minutes"
                  value={normal}
                  onChange={(e) => setNormal(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-outline-variant bg-surface-container-lowest text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-on-surface">
                  Extra (optional if surplus energy):
                </label>
                <input
                  type="text"
                  placeholder="e.g. Commit code and write summary"
                  value={extra}
                  onChange={(e) => setExtra(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-outline-variant bg-surface-container-lowest text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              {/* Duration slider */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold text-on-surface">
                  <span>Approximate time:</span>
                  <span className="text-primary font-bold">{durationMinutes} minutes</span>
                </div>
                <input
                  type="range"
                  min={2}
                  max={60}
                  step={1}
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(Number(e.target.value))}
                  className="w-full h-2 accent-primary bg-surface-container-high rounded-lg cursor-pointer"
                />
              </div>

              {/* Environment / Company preference */}
              <div className="space-y-1.5">
                <span className="text-xs font-semibold text-on-surface">
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
                      className={`p-2.5 rounded-xl text-xs font-medium border text-left min-h-[40px] transition-all cursor-pointer ${
                        company === item.id
                          ? 'bg-primary/15 border-primary text-primary font-semibold'
                          : 'border-outline-variant bg-surface-container-lowest text-on-surface-variant hover:text-on-surface'
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
