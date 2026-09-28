'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import { TaskTimeCategory, EnvironmentPreference, TaskCategory } from '@/types';
import { X, Plus, Sparkles, Coffee } from 'lucide-react';

export function TaskCreatorModal() {
  const { closeModal, addTask } = useApp();

  const [title, setTitle] = useState('');
  const [when, setWhen] = useState<TaskTimeCategory>('now');
  const [minimum, setMinimum] = useState('');
  const [normal, setNormal] = useState('');
  const [isRest, setIsRest] = useState(false);
  const [company, setCompany] = useState<EnvironmentPreference>('no_preference');
  const [durationMinutes, setDurationMinutes] = useState(15);
  const [showExtraFields, setShowExtraFields] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const cat: TaskCategory = isRest ? 'rest' : 'productive';
    const icon = isRest ? '☕' : '📌';

    addTask({
      title: title.trim(),
      category: cat,
      icon,
      timeCategory: when,
      durationMinutes,
      priority: isRest ? 'should' : 'must',
      minimum: minimum.trim() || 'Start for 2 minutes and make 1 small action',
      normal: normal.trim() || `${durationMinutes} minutes`,
      steps: [
        { id: `s-${Date.now()}-1`, title: 'Prepare workspace', completed: false },
        { id: `s-${Date.now()}-2`, title: 'Do 2 minutes of effortless start', completed: false, isMinimum: true },
      ],
      companyPreference: company,
    });

    closeModal();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 dark:bg-slate-950/70 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="creator-modal-title"
    >
      <div className="relative w-full max-w-lg bg-surface dark:bg-surface-dark border border-slate-200/90 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden animate-fade-in flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Plus className="w-4 h-4 text-brand-600 dark:text-brand-400" />
            <p className="text-xs font-bold uppercase tracking-wider text-ink-muted dark:text-slate-400">
              New Activity • Low Friction
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-7 overflow-y-auto space-y-5 flex-1">
          {/* Main Title Input */}
          <div className="space-y-1.5">
            <label 
              htmlFor="task-title-input" 
              className="text-xs font-bold uppercase tracking-wider text-ink-primary dark:text-slate-200"
            >
              What do you want to do?
            </label>
            <input
              id="task-title-input"
              type="text"
              required
              autoFocus
              placeholder="e.g. Work on project, Listen to music, Tidy desk..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 text-base text-ink-primary dark:text-slate-100 placeholder:text-ink-subtle focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all font-medium"
            />
          </div>

          {/* Quick When Selector */}
          <div className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted dark:text-slate-400">
              When?
            </span>
            <div className="grid grid-cols-4 gap-2">
              {[
                { id: 'now', label: 'Now' },
                { id: 'today', label: 'Today' },
                { id: 'later', label: 'Later' },
                { id: 'notime', label: 'No time' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setWhen(item.id as TaskTimeCategory)}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all text-center ${
                    when === item.id
                      ? 'bg-brand-600 text-white border-brand-600 shadow-sm'
                      : 'border-slate-200 dark:border-slate-800 text-ink-secondary dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Is this Rest? */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-900/40">
            <div className="flex items-center gap-2.5">
              <Coffee className="w-4 h-4 text-amber-700 dark:text-amber-400" />
              <div>
                <p className="text-xs font-semibold text-amber-900 dark:text-amber-200">
                  This is a rest activity
                </p>
                <p className="text-[11px] text-amber-800/80 dark:text-amber-300/80">
                  Rest is a legitimate activity, not earned guilt.
                </p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={isRest}
              onChange={(e) => setIsRest(e.target.checked)}
              className="w-5 h-5 rounded text-amber-600 focus:ring-amber-500 cursor-pointer"
            />
          </div>

          {/* Expandable MNE & Company preferences */}
          <div className="space-y-3 pt-1">
            <button
              type="button"
              onClick={() => setShowExtraFields(!showExtraFields)}
              className="text-xs font-medium text-brand-600 dark:text-brand-400 hover:underline"
            >
              {showExtraFields ? '− Hide optional details' : '+ Add minimum, duration, or company preference (optional)'}
            </button>

            {showExtraFields && (
              <div className="space-y-4 pt-2 border-t border-slate-100 dark:border-slate-800 animate-fade-in">
                {/* Minimum */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-ink-secondary dark:text-slate-300">
                    Minimum (the smallest possible version):
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Open file and look at it for 2 minutes"
                    value={minimum}
                    onChange={(e) => setMinimum(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-surface dark:bg-surface-dark text-ink-primary dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                  <p className="text-[10px] text-ink-subtle dark:text-slate-500">The minimum counts as complete.</p>
                </div>

                {/* Normal */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-ink-secondary dark:text-slate-300">
                    Normal (intended version):
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Work for 20 minutes"
                    value={normal}
                    onChange={(e) => setNormal(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-surface dark:bg-surface-dark text-ink-primary dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                {/* Duration */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-ink-secondary dark:text-slate-300">
                    Approximate time: {durationMinutes} minutes
                  </label>
                  <input
                    type="range"
                    min={2}
                    max={60}
                    step={1}
                    value={durationMinutes}
                    onChange={(e) => setDurationMinutes(Number(e.target.value))}
                    className="w-full accent-brand-600"
                  />
                </div>

                {/* Company preference */}
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-ink-secondary dark:text-slate-300">
                    How do you want to do it?
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {[
                      { id: 'alone', label: '👤 Alone' },
                      { id: 'someone_nearby', label: '👥 Someone nearby' },
                      { id: 'body_double', label: '📞 Body double' },
                      { id: 'background_company', label: '🎧 Background noise' },
                      { id: 'no_preference', label: 'No preference' },
                    ].map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setCompany(item.id as EnvironmentPreference)}
                        className={`p-2 rounded-xl text-xs font-medium border text-left transition-all ${
                          company === item.id
                            ? 'bg-brand-50 dark:bg-brand-950/40 border-brand-300 dark:border-brand-700 text-brand-900 dark:text-brand-200'
                            : 'border-slate-200 dark:border-slate-800 text-ink-secondary dark:text-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={!title.trim()}
              className="w-full py-4 px-6 rounded-2xl bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-semibold text-base shadow-md transition-all active:scale-[0.99]"
            >
              CREATE TASK
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
