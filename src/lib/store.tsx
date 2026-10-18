'use client';

import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import {
  Task,
  TaskTimeCategory,
  TaskPriority,
  Routine,
  ReturnDay,
  HelpfulInsight,
  UserSettings,
  StuckLog,
  TaskStep,
  StuckReason,
  Reset,
  ResetDay,
  ResetDayTask,
  WellnessJournalEntry,
  FocusSessionState,
} from '../types';
import { sounds } from './sounds';
import {
  INITIAL_TASKS,
  INITIAL_ROUTINES,
  INITIAL_RETURNS,
  INITIAL_HELPFUL_INSIGHTS,
  DEFAULT_SETTINGS,
  INITIAL_RESETS,
  INITIAL_JOURNAL_ENTRIES,
  FRESH_START_TEMPLATE,
} from './sampleData';
import {
  getLocalDateString,
  formatDayOfWeek,
  isSameDay,
  isBeforeDay,
  isAfterDay,
  getDaysDifference,
  addDays,
} from './dateUtils';

export type ModalType =
  | 'help_start' 
  | 'stuck' 
  | 'breakdown' 
  | 'create_task' 
  | 'routine_runner' 
  | 'body_check'
  | 'fresh_start'
  | 'journal'
  | 'check_in'
  | 'routine_library'
  | 'add_routine'
  | null;

interface AppContextType {
  tasks: Task[];
  routines: Routine[];
  returns: ReturnDay[];
  helpfulInsights: HelpfulInsight[];
  settings: UserSettings;
  stuckLogs: StuckLog[];
  resets: Reset[];
  journalEntries: WellnessJournalEntry[];
  hydrated: boolean;
  activeModal: ModalType;
  activeTaskId: string | null;
  activeRoutineId: string | null;
  notPlanningToday: boolean;
  currentTask: Task | null;
  todayTasks: Task[];
  laterTasks: Task[];
  unplannedTasks: Task[];
  upNextTasks: Task[];
  activeReset: Reset | null;
  focusSession: FocusSessionState;
  
  // Actions
  openModal: (modal: ModalType, taskId?: string, routineId?: string) => void;
  closeModal: () => void;
  setCurrentTask: (taskId: string) => void;
  clearCurrentTask: () => void;
  completeTask: (taskId: string, tier: 'minimum' | 'normal' | 'extra') => void;
  uncompleteTask: (taskId: string) => void;
  addTask: (task: Omit<Task, 'id' | 'orderIndex' | 'completed'>) => Task;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  deleteTask: (taskId: string) => void;
  toggleStep: (taskId: string, stepId: string) => void;
  setTaskSteps: (taskId: string, steps: TaskStep[]) => void;
  logStuckEvent: (reason: StuckReason, actionTaken: string, taskId?: string) => void;
  toggleRoutineStep: (routineId: string, stepId: string) => void;
  resetRoutineSteps: (routineId: string) => void;
  updateRoutine: (routineId: string, updates: Partial<Routine>) => void;
  addRoutine: (routine: Omit<Routine, 'id'>) => Routine;
  deleteRoutine: (routineId: string) => void;
  updateSettings: (updates: Partial<UserSettings>) => void;
  setNotPlanningToday: (val: boolean) => void;
  resetToDemoData: () => void;
  deferTask: (taskId: string) => void;
  completeOnboarding: (mode: 'empty' | 'example', goals?: string[], difficulty?: 'gentle' | 'balanced' | 'structured') => void;
  resetToEmptyDay: () => void;
  clearAllData: () => void;
  recordHelpfulFactor: (factorId: string) => void;
  pendingReturn: boolean;
  acknowledgeReturn: () => void;
  // Focus Session actions
  startFocusSession: (durationSeconds: number, task?: { id: string; title: string }) => void;
  pauseFocusSession: () => void;
  resumeFocusSession: () => void;
  stopFocusSession: () => void;
  completeFocusSession: () => void;
  resetFocusSession: () => void;
  // Reset actions
  activateFreshStart: () => Reset;
  archiveReset: (resetId: string) => void;
  completeResetDayTask: (resetId: string, dayIndex: number, taskId: string) => void;
  // Journal actions
  addJournalEntry: (entry: Omit<WellnessJournalEntry, 'id'>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  TASKS: 'next_tasks_v1',
  ROUTINES: 'next_routines_v1',
  RETURNS: 'next_returns_v1',
  INSIGHTS: 'next_insights_v1',
  SETTINGS: 'next_settings_v1',
  STUCK_LOGS: 'next_stuck_logs_v1',
  NOT_PLANNING: 'next_not_planning_v1',
  RESETS: 'next_resets_v1',
  JOURNAL: 'next_journal_v1',
  CHECKINS: 'next_checkins_v1',
  LAST_ACTIVE_DATE: 'next_last_active_date_v1',
  LAST_ACK_RETURN_DATE: 'next_last_ack_return_date_v1',
};

export function createTasksForResetDay(reset: Reset, dayIndex: number, dateStr: string): Task[] {
  const day = reset.days[dayIndex];
  if (!day) return [];

  const getTaskIcon = (title: string): string => {
    const lower = title.toLowerCase();
    if (lower.includes('water') || lower.includes('hydrate')) return '💧';
    if (lower.includes('eat') || lower.includes('meal')) return '🍳';
    if (lower.includes('teeth') || lower.includes('brush')) return '🪥';
    if (lower.includes('face') || lower.includes('wash') || lower.includes('shower')) return '🧼';
    if (lower.includes('moisturize') || lower.includes('skin') || lower.includes('lip')) return '🧴';
    if (lower.includes('move') || lower.includes('walk')) return '🚶';
    if (lower.includes('sleep') || lower.includes('bed')) return '🌙';
    if (lower.includes('journal')) return '📓';
    if (lower.includes('reset') || lower.includes('room')) return '🧹';
    return '✨';
  };

  return day.tasks.map((rt, idx) => ({
    id: `reset-task-${reset.id}-d${dayIndex}-${rt.id}`,
    title: rt.title,
    category: 'wellness' as const,
    icon: getTaskIcon(rt.title),
    timeCategory: (rt.isOptional ? 'later' : 'today') as TaskTimeCategory,
    durationMinutes: rt.isOptional ? 10 : 3,
    priority: (rt.isOptional ? 'could' : 'must') as TaskPriority,
    minimum: rt.title,
    normal: rt.title,
    steps: [
      { id: `${rt.id}-s1`, title: rt.title, completed: rt.completed, isMinimum: true },
    ],
    companyPreference: 'no_preference' as const,
    completed: rt.completed,
    orderIndex: 100 + idx,
    resetId: reset.id,
    resetTaskId: rt.id,
    resetDayIndex: dayIndex,
    isOptional: rt.isOptional,
    scheduledDate: dateStr,
  }));
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [routines, setRoutines] = useState<Routine[]>(INITIAL_ROUTINES);
  const [returns, setReturns] = useState<ReturnDay[]>(INITIAL_RETURNS);
  const [helpfulInsights, setHelpfulInsights] = useState<HelpfulInsight[]>(INITIAL_HELPFUL_INSIGHTS);
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
  const [stuckLogs, setStuckLogs] = useState<StuckLog[]>([]);
  const [notPlanningToday, setNotPlanningTodayState] = useState<boolean>(false);
  const [hydrated, setHydrated] = useState<boolean>(false);
  const [settingsHydrated, setSettingsHydrated] = useState<boolean>(false);
  const [resets, setResets] = useState<Reset[]>(INITIAL_RESETS);
  const [journalEntries, setJournalEntries] = useState<WellnessJournalEntry[]>(INITIAL_JOURNAL_ENTRIES);

  const [focusSession, setFocusSession] = useState<FocusSessionState>({
    status: 'idle',
    durationSeconds: 120,
    remainingSeconds: 120,
  });

  const [pendingReturn, setPendingReturn] = useState<boolean>(false);
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [activeRoutineId, setActiveRoutineId] = useState<string | null>(null);

  // Centralized Focus Session Timer Loop
  useEffect(() => {
    if (focusSession.status !== 'running') return;

    const interval = setInterval(() => {
      setFocusSession(prev => {
        if (prev.status !== 'running') return prev;
        if (prev.remainingSeconds <= 1) {
          // Complete session once, trigger sounds
          sounds.playMinimumComplete();
          if (prev.taskId) {
            completeTask(prev.taskId, 'minimum');
          }
          return {
            ...prev,
            status: 'completed',
            remainingSeconds: 0,
            lastTickTimestamp: Date.now(),
          };
        }
        return {
          ...prev,
          remainingSeconds: prev.remainingSeconds - 1,
          lastTickTimestamp: Date.now(),
        };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [focusSession.status]);

  // Safe localStorage hydration with local day rollover handling
  useEffect(() => {
    try {
      const todayStr = getLocalDateString();
      const storedLastDate = localStorage.getItem(STORAGE_KEYS.LAST_ACTIVE_DATE);
      const storedLastAck = localStorage.getItem(STORAGE_KEYS.LAST_ACK_RETURN_DATE);

      const storedTasks = localStorage.getItem(STORAGE_KEYS.TASKS);
      let parsedTasks: Task[] = storedTasks ? JSON.parse(storedTasks) : INITIAL_TASKS;

      const storedRoutines = localStorage.getItem(STORAGE_KEYS.ROUTINES);
      let parsedRoutines: Routine[] = storedRoutines ? JSON.parse(storedRoutines) : INITIAL_ROUTINES;

      const storedReturns = localStorage.getItem(STORAGE_KEYS.RETURNS);
      let parsedReturns: ReturnDay[] = storedReturns ? JSON.parse(storedReturns) : INITIAL_RETURNS;

      const storedInsights = localStorage.getItem(STORAGE_KEYS.INSIGHTS);
      if (storedInsights) setHelpfulInsights(JSON.parse(storedInsights));

      const storedSettings = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      // Always merge onto DEFAULT_SETTINGS so new fields are present for existing users
      let parsedSettings: UserSettings = { ...DEFAULT_SETTINGS };
      if (storedSettings) {
        try {
          const stored = JSON.parse(storedSettings);
          parsedSettings = { ...DEFAULT_SETTINGS, ...stored };
        } catch {
          // Corrupted storage — fall back to defaults
        }
        setSettings(parsedSettings);
      }
      setSettingsHydrated(true);

      const storedStuckLogs = localStorage.getItem(STORAGE_KEYS.STUCK_LOGS);
      if (storedStuckLogs) setStuckLogs(JSON.parse(storedStuckLogs));

      const storedNotPlanning = localStorage.getItem(STORAGE_KEYS.NOT_PLANNING);
      let parsedNotPlanning = storedNotPlanning ? JSON.parse(storedNotPlanning) : false;

      const storedResets = localStorage.getItem(STORAGE_KEYS.RESETS);
      let parsedResets: Reset[] = INITIAL_RESETS;
      if (storedResets) {
        parsedResets = JSON.parse(storedResets);
        setResets(parsedResets);
      }

      const storedJournal = localStorage.getItem(STORAGE_KEYS.JOURNAL);
      if (storedJournal) setJournalEntries(JSON.parse(storedJournal));

      // Sanitize legacy demo returns from September 2026 if present
      if (Array.isArray(parsedReturns)) {
        parsedReturns = parsedReturns.filter((r: ReturnDay) => !r.dateStr.startsWith('2026-09-'));
      }

      // Check for day rollover across midnight or on app launch
      if (storedLastDate && isBeforeDay(storedLastDate, todayStr)) {
        // 1. Move yesterday's incomplete active tasks to 'later' so they do not crowd today
        parsedTasks = parsedTasks.map((t: Task) => {
          if (!t.completed && (t.timeCategory === 'now' || t.timeCategory === 'today')) {
            // Keep tasks explicitly scheduled for today or a future date
            if (t.scheduledDate && isSameDay(t.scheduledDate, todayStr)) return t;
            if (t.scheduledDate && isAfterDay(t.scheduledDate, todayStr)) return t;
            return {
              ...t,
              timeCategory: 'later' as const,
              rolloverDate: todayStr,
            };
          }
          return t;
        });

        // 2. Reset yesterday's day off status for the fresh day
        parsedNotPlanning = false;

        // 3. Reset routine step checkmarks for the new day
        parsedRoutines = parsedRoutines.map((r: Routine) => ({
          ...r,
          steps: r.steps.map(s => ({ ...s, completed: false })),
        }));

        // 4. Return recording: if gap >= 2 days, mark today as a gentle return
        const daysGap = getDaysDifference(storedLastDate, todayStr);
        if (daysGap >= 2) {
          const hasTodayReturn = parsedReturns.some((r: ReturnDay) => r.dateStr === todayStr);
          if (!hasTodayReturn) {
            parsedReturns = [
              ...parsedReturns,
              {
                dayOfWeek: formatDayOfWeek(todayStr),
                dateStr: todayStr,
                status: 'returned' as const,
                note: 'Returned after a pause.',
              },
            ];
          }
          // Only prompt if not already acknowledged today
          if (storedLastAck !== todayStr) {
            setPendingReturn(true);
          }
        }
      }

      // 5. Synchronize active Fresh Start reset tasks for the current day into planner
      const activeResetId = parsedSettings?.activeResetId;
      if (activeResetId && Array.isArray(parsedResets)) {
        const currentReset = parsedResets.find((r: Reset) => r.id === activeResetId && !r.archived);
        if (currentReset) {
          const currentDayIdx = currentReset.days.findIndex((d: ResetDay) => d.date === todayStr);
          if (currentDayIdx >= 0) {
            const dayResetTasks = createTasksForResetDay(currentReset, currentDayIdx, todayStr);
            dayResetTasks.forEach(dTask => {
              const existingIdx = parsedTasks.findIndex(t => t.id === dTask.id);
              if (existingIdx === -1) {
                parsedTasks.push(dTask);
              } else {
                // Ensure synchronization of completion status
                const resetDayTask = currentReset.days[currentDayIdx].tasks.find(rt => rt.id === dTask.resetTaskId);
                if (resetDayTask && resetDayTask.completed !== parsedTasks[existingIdx].completed) {
                  parsedTasks[existingIdx] = {
                    ...parsedTasks[existingIdx],
                    completed: resetDayTask.completed,
                    completedAt: resetDayTask.completed ? (parsedTasks[existingIdx].completedAt || new Date().toISOString()) : undefined,
                  };
                }
              }
            });
          }
        }
      }

      // Ensure last active date is updated to current local calendar day
      localStorage.setItem(STORAGE_KEYS.LAST_ACTIVE_DATE, todayStr);

      setTasks(parsedTasks);
      setRoutines(parsedRoutines);
      setReturns(parsedReturns);
      setNotPlanningTodayState(parsedNotPlanning);
    } catch (e) {
      console.error('Failed to load data from localStorage:', e);
    } finally {
      setSettingsHydrated(true);
      setHydrated(true);
    }
  }, []);

  // Periodic & visibility-change day rollover check (e.g. across midnight or returning to foreground)
  useEffect(() => {
    if (!hydrated) return;

    const checkRollover = () => {
      const todayStr = getLocalDateString();
      const lastDate = localStorage.getItem(STORAGE_KEYS.LAST_ACTIVE_DATE);
      if (!lastDate || !isBeforeDay(lastDate, todayStr)) return;

      // Day changed while app was running or paused
      setTasks(prev =>
        prev.map(t => {
          if (!t.completed && (t.timeCategory === 'now' || t.timeCategory === 'today')) {
            if (t.scheduledDate && isSameDay(t.scheduledDate, todayStr)) return t;
            if (t.scheduledDate && isAfterDay(t.scheduledDate, todayStr)) return t;
            return { ...t, timeCategory: 'later', rolloverDate: todayStr };
          }
          return t;
        })
      );

      setNotPlanningTodayState(false);

      setRoutines(prev =>
        prev.map(r => ({
          ...r,
          steps: r.steps.map(s => ({ ...s, completed: false })),
        }))
      );

      const daysGap = getDaysDifference(lastDate, todayStr);
      if (daysGap >= 2) {
        setReturns(prev => {
          if (prev.some(r => r.dateStr === todayStr)) return prev;
          return [
            ...prev,
            {
              dayOfWeek: formatDayOfWeek(todayStr),
              dateStr: todayStr,
              status: 'returned',
              note: 'Returned after a pause.',
            },
          ];
        });
        const lastAck = localStorage.getItem(STORAGE_KEYS.LAST_ACK_RETURN_DATE);
        if (lastAck !== todayStr) {
          setPendingReturn(true);
        }
      }

      // Synchronize active reset tasks for the new day
      const currentActiveReset = resets.find(r => r.id === settings.activeResetId && !r.archived);
      if (currentActiveReset) {
        const newDayIdx = currentActiveReset.days.findIndex(d => d.date === todayStr);
        if (newDayIdx >= 0) {
          const dayResetTasks = createTasksForResetDay(currentActiveReset, newDayIdx, todayStr);
          setTasks(prev => {
            const existingIds = new Set(prev.map(t => t.id));
            const toAdd = dayResetTasks.filter(t => !existingIds.has(t.id));
            return toAdd.length > 0 ? [...prev, ...toAdd] : prev;
          });
        }
      }

      localStorage.setItem(STORAGE_KEYS.LAST_ACTIVE_DATE, todayStr);
    };

    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        checkRollover();
      }
    };

    window.addEventListener('focus', checkRollover);
    document.addEventListener('visibilitychange', handleVisibility);
    const interval = setInterval(checkRollover, 60000);

    return () => {
      window.removeEventListener('focus', checkRollover);
      document.removeEventListener('visibilitychange', handleVisibility);
      clearInterval(interval);
    };
  }, [hydrated]);

  // Sync to localStorage
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
      localStorage.setItem(STORAGE_KEYS.ROUTINES, JSON.stringify(routines));
      localStorage.setItem(STORAGE_KEYS.RETURNS, JSON.stringify(returns));
      localStorage.setItem(STORAGE_KEYS.INSIGHTS, JSON.stringify(helpfulInsights));
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
      localStorage.setItem(STORAGE_KEYS.STUCK_LOGS, JSON.stringify(stuckLogs));
      localStorage.setItem(STORAGE_KEYS.NOT_PLANNING, JSON.stringify(notPlanningToday));
      localStorage.setItem(STORAGE_KEYS.RESETS, JSON.stringify(resets));
      localStorage.setItem(STORAGE_KEYS.JOURNAL, JSON.stringify(journalEntries));
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
    }
  }, [tasks, routines, returns, helpfulInsights, settings, stuckLogs, notPlanningToday, hydrated, resets, journalEntries]);

  // Handle dark mode and accent on document (guarded by settingsHydrated to eliminate startup flicker)
  useEffect(() => {
    if (!settingsHydrated || typeof document === 'undefined') return;
    const root = document.documentElement;

    // Accent
    const accent = settings.accentPalette || 'amber';
    root.setAttribute('data-accent', accent);

    // Theme application
    const applyTheme = () => {
      if (settings.theme === 'dark') {
        root.classList.add('dark');
      } else if (settings.theme === 'light') {
        root.classList.remove('dark');
      } else {
        // System
        const darkPref = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (darkPref) root.classList.add('dark');
        else root.classList.remove('dark');
      }
    };

    applyTheme();

    if (settings.theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handler = () => applyTheme();
      mediaQuery.addEventListener('change', handler);
      return () => mediaQuery.removeEventListener('change', handler);
    }
  }, [settingsHydrated, settings.theme, settings.accentPalette]);

  // Derived: Current task (Now) strictly explicit, and segmented queues
  const { currentTask, todayTasks, laterTasks, unplannedTasks, upNextTasks } = useMemo(() => {
    const uncompleted = tasks.filter(t => !t.completed);

    // 1. Explicit 'now' task ONLY — never silently auto-promote
    const nowTask = uncompleted.find(t => t.timeCategory === 'now') || null;

    // 2. Scheduled for today (excluding now)
    const todayList = uncompleted.filter(t => t.timeCategory === 'today');

    // 3. Later tasks
    const laterList = uncompleted.filter(t => t.timeCategory === 'later');

    // 4. Unplanned / No time tasks
    const unplannedList = uncompleted.filter(
      t => t.timeCategory === 'notime'
    );

    // 5. Up next tasks are remaining today-eligible tasks
    const upNext = todayList.slice(0, 4);

    return {
      currentTask: nowTask,
      todayTasks: todayList,
      laterTasks: laterList,
      unplannedTasks: unplannedList,
      upNextTasks: upNext,
    };
  }, [tasks]);

  // Derived: Active reset (non-archived)
  const activeReset = useMemo(() => {
    if (!settings.activeResetId) return null;
    return resets.find(r => r.id === settings.activeResetId && !r.archived) || null;
  }, [resets, settings.activeResetId]);

  const clearCurrentTask = () => {
    setTasks(prev =>
      prev.map(t => (t.timeCategory === 'now' ? { ...t, timeCategory: 'today' as const } : t))
    );
  };

  const openModal = (modal: ModalType, taskId?: string, routineId?: string) => {
    setActiveModal(modal);
    if (taskId) setActiveTaskId(taskId);
    else if (!taskId && currentTask) setActiveTaskId(currentTask.id);
    if (routineId) setActiveRoutineId(routineId);
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  const setCurrentTask = (taskId: string) => {
    setTasks(prev =>
      prev.map(t => {
        if (t.id === taskId) {
          return { ...t, timeCategory: 'now' };
        }
        if (t.timeCategory === 'now') {
          return { ...t, timeCategory: 'today' };
        }
        return t;
      })
    );
  };

  const completeTask = (taskId: string, tier: 'minimum' | 'normal' | 'extra') => {
    const todayStr = getLocalDateString();
    let completedTask: Task | undefined;

    setTasks(prev =>
      prev.map(t => {
        if (t.id === taskId) {
          completedTask = {
            ...t,
            completed: true,
            completedAt: new Date().toISOString(),
            completedTier: tier,
          };
          return completedTask;
        }
        return t;
      })
    );

    // Record activity for today in returns
    setReturns(prev => {
      const idx = prev.findIndex(r => r.dateStr === todayStr);
      if (idx >= 0) {
        // If it's already marked as 'returned' or 'active', preserve status
        return prev;
      }
      return [
        ...prev,
        {
          dayOfWeek: formatDayOfWeek(todayStr),
          dateStr: todayStr,
          status: 'active',
          note: tier === 'minimum' ? 'Completed a minimum.' : 'Active today.',
        },
      ];
    });

    // Record helpful factor based on tier and context
    if (tier === 'minimum') {
      recordHelpfulFactor('h1');
    }
    const target = tasks.find(t => t.id === taskId) || completedTask;
    if (target?.companyPreference === 'someone_nearby' || target?.companyPreference === 'body_double') {
      recordHelpfulFactor('h2');
    }
    if (target?.companyPreference === 'background_company') {
      recordHelpfulFactor('h3');
    }
    if (target?.category === 'rest') {
      recordHelpfulFactor('h4');
    }

    // Synchronize completion with active reset if task is from a reset
    if (target?.resetId && target?.resetTaskId) {
      setResets(prev =>
        prev.map(r => {
          if (r.id !== target.resetId) return r;
          return {
            ...r,
            days: r.days.map((d, dIdx) => {
              if (target.resetDayIndex !== undefined && dIdx !== target.resetDayIndex) return d;
              return {
                ...d,
                tasks: d.tasks.map(rt => rt.id === target.resetTaskId ? { ...rt, completed: true } : rt),
              };
            }),
          };
        })
      );
    }
  };

  const uncompleteTask = (taskId: string) => {
    let uncompletedTask: Task | undefined;
    setTasks(prev =>
      prev.map(t => {
        if (t.id === taskId) {
          uncompletedTask = {
            ...t,
            completed: false,
            completedAt: undefined,
            completedTier: undefined,
          };
          return uncompletedTask;
        }
        return t;
      })
    );

    const target = tasks.find(t => t.id === taskId) || uncompletedTask;
    if (target?.resetId && target?.resetTaskId) {
      setResets(prev =>
        prev.map(r => {
          if (r.id !== target.resetId) return r;
          return {
            ...r,
            days: r.days.map((d, dIdx) => {
              if (target.resetDayIndex !== undefined && dIdx !== target.resetDayIndex) return d;
              return {
                ...d,
                tasks: d.tasks.map(rt => rt.id === target.resetTaskId ? { ...rt, completed: false } : rt),
              };
            }),
          };
        })
      );
    }
  };

  const addTask = (newTaskData: Omit<Task, 'id' | 'orderIndex' | 'completed'>): Task => {
    const id = `task-${Date.now()}`;
    const todayStr = getLocalDateString();
    const task: Task = {
      ...newTaskData,
      id,
      completed: false,
      orderIndex: tasks.length,
      createdAt: todayStr,
      scheduledDate: (newTaskData.timeCategory === 'now' || newTaskData.timeCategory === 'today')
        ? todayStr
        : newTaskData.scheduledDate,
    };

    setTasks(prev => {
      // If marked as now, demote existing now task
      if (task.timeCategory === 'now') {
        return [task, ...prev.map(t => t.timeCategory === 'now' ? { ...t, timeCategory: 'today' as const } : t)];
      }
      return [task, ...prev];
    });

    return task;
  };

  const updateTask = (taskId: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(t => (t.id === taskId ? { ...t, ...updates } : t)));
  };

  const deleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
    if (activeTaskId === taskId) setActiveTaskId(null);
  };

  const toggleStep = (taskId: string, stepId: string) => {
    setTasks(prev =>
      prev.map(t => {
        if (t.id !== taskId) return t;
        const targetStep = t.steps.find(s => s.id === stepId);
        const willComplete = targetStep ? !targetStep.completed : false;
        if (willComplete) {
          recordHelpfulFactor('h5');
        }
        return {
          ...t,
          steps: t.steps.map(s => (s.id === stepId ? { ...s, completed: !s.completed } : s)),
        };
      })
    );
  };

  const setTaskSteps = (taskId: string, steps: TaskStep[]) => {
    setTasks(prev => prev.map(t => (t.id === taskId ? { ...t, steps } : t)));
  };

  const logStuckEvent = (reason: StuckReason, actionTaken: string, taskId?: string) => {
    const current = tasks.find(t => t.id === taskId) || currentTask;
    const newLog: StuckLog = {
      id: `stuck-${Date.now()}`,
      taskId: current?.id,
      taskTitle: current?.title,
      reason,
      actionTaken,
      timestamp: new Date().toISOString(),
    };
    setStuckLogs(prev => [newLog, ...prev]);

    // Record helpful intervention
    if (reason === 'watched') recordHelpfulFactor('h2');
    if (reason === 'environment_too_much') recordHelpfulFactor('h3');
    if (reason === 'too_much' || reason === 'dont_know_what_next') recordHelpfulFactor('h5');
  };

  const toggleRoutineStep = (routineId: string, stepId: string) => {
    setRoutines(prev =>
      prev.map(r => {
        if (r.id !== routineId) return r;
        return {
          ...r,
          steps: r.steps.map(s => (s.id === stepId ? { ...s, completed: !s.completed } : s)),
        };
      })
    );
  };

  const resetRoutineSteps = (routineId: string) => {
    setRoutines(prev =>
      prev.map(r => {
        if (r.id !== routineId) return r;
        return {
          ...r,
          steps: r.steps.map(s => ({ ...s, completed: false })),
        };
      })
    );
  };

  const updateRoutine = (routineId: string, updates: Partial<Routine>) => {
    setRoutines(prev => prev.map(r => (r.id === routineId ? { ...r, ...updates } : r)));
  };

  const addRoutine = (newRoutine: Omit<Routine, 'id'>): Routine => {
    const id = `routine-${Date.now()}`;
    const routine: Routine = { ...newRoutine, id };
    setRoutines(prev => [...prev, routine]);
    return routine;
  };

  const deleteRoutine = (routineId: string) => {
    setRoutines(prev => prev.filter(r => r.id !== routineId));
  };

  const updateSettings = (updates: Partial<UserSettings>) => {
    setSettings(prev => {
      const next = { ...prev, ...updates };
      if (typeof document !== 'undefined') {
        const root = document.documentElement;
        if (updates.accentPalette) {
          root.setAttribute('data-accent', updates.accentPalette);
        }
        if (updates.theme) {
          if (updates.theme === 'dark') {
            root.classList.add('dark');
          } else if (updates.theme === 'light') {
            root.classList.remove('dark');
          } else {
            const darkPref = window.matchMedia('(prefers-color-scheme: dark)').matches;
            if (darkPref) root.classList.add('dark');
            else root.classList.remove('dark');
          }
        }
      }
      return next;
    });
  };

  const startFocusSession = (durationSeconds: number, task?: { id: string; title: string }) => {
    sounds.playStart();
    setFocusSession({
      status: 'running',
      taskId: task?.id || currentTask?.id,
      taskTitle: task?.title || currentTask?.title,
      durationSeconds,
      remainingSeconds: durationSeconds,
      lastTickTimestamp: Date.now(),
    });
  };

  const pauseFocusSession = () => {
    setFocusSession(prev => {
      if (prev.status !== 'running') return prev;
      return { ...prev, status: 'paused' };
    });
  };

  const resumeFocusSession = () => {
    setFocusSession(prev => {
      if (prev.status !== 'paused') return prev;
      return { ...prev, status: 'running', lastTickTimestamp: Date.now() };
    });
  };

  const stopFocusSession = () => {
    setFocusSession({
      status: 'idle',
      durationSeconds: 120,
      remainingSeconds: 120,
    });
  };

  const completeFocusSession = () => {
    setFocusSession(prev => {
      if (prev.status === 'completed') return prev;
      if (prev.taskId) {
        completeTask(prev.taskId, 'minimum');
      }
      sounds.playMinimumComplete();
      return {
        ...prev,
        status: 'completed',
        remainingSeconds: 0,
      };
    });
  };

  const resetFocusSession = () => {
    setFocusSession({
      status: 'idle',
      durationSeconds: 120,
      remainingSeconds: 120,
    });
  };

  const setNotPlanningToday = (val: boolean) => {
    setNotPlanningTodayState(val);
    if (val) {
      // Taking a day off stops any active focus session cleanly
      stopFocusSession();
    }
  };

  const recordHelpfulFactor = (factorId: string) => {
    setHelpfulInsights(prev =>
      prev.map(f => (f.id === factorId ? { ...f, count: f.count + 1 } : f))
    );
  };

  const deferTask = (taskId: string) => {
    setTasks(prev => {
      const targetIndex = prev.findIndex(t => t.id === taskId);
      if (targetIndex === -1) return prev;
      const target = prev[targetIndex];
      const others = prev.filter(t => t.id !== taskId);
      // Change timeCategory to later and move to back of queue
      return [...others, { ...target, timeCategory: 'later' as const }];
    });
  };

  const completeOnboarding = (
    mode: 'empty' | 'example',
    goals?: string[],
    difficulty?: 'gentle' | 'balanced' | 'structured'
  ) => {
    // CRITICAL DATA SAFETY: NEVER overwrite or wipe real user tasks if already present!
    setTasks(prev => {
      if (prev.length > 0) return prev; // keep existing tasks intact
      if (mode === 'example') return INITIAL_TASKS;
      return [];
    });
    setSettings(prev => ({
      ...prev,
      hasCompletedOnboarding: true,
      startingDifficulty: difficulty || prev.startingDifficulty || 'gentle',
      onboardingGoals: goals || prev.onboardingGoals || [],
    }));
  };

  const resetToEmptyDay = () => {
    setTasks([]);
    setNotPlanningTodayState(false);
  };

  const clearAllData = () => {
    setTasks([]);
    setRoutines([]);
    setReturns([]);
    setHelpfulInsights(INITIAL_HELPFUL_INSIGHTS);
    setSettings({ ...DEFAULT_SETTINGS, hasCompletedOnboarding: true });
    setStuckLogs([]);
    setNotPlanningTodayState(false);
    setResets([]);
    setJournalEntries([]);
    setPendingReturn(false);
    try {
      Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
      localStorage.setItem(STORAGE_KEYS.LAST_ACTIVE_DATE, getLocalDateString());
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify({ ...DEFAULT_SETTINGS, hasCompletedOnboarding: true }));
    } catch {}
  };

  const resetToDemoData = () => {
    setTasks(INITIAL_TASKS);
    setRoutines(INITIAL_ROUTINES);
    setReturns(INITIAL_RETURNS);
    setHelpfulInsights(INITIAL_HELPFUL_INSIGHTS);
    setSettings({ ...DEFAULT_SETTINGS, hasCompletedOnboarding: true });
    setStuckLogs([]);
    setNotPlanningTodayState(false);
    setResets(INITIAL_RESETS);
    setJournalEntries(INITIAL_JOURNAL_ENTRIES);
    setPendingReturn(false);
    try {
      // Selectively remove only app-owned keys instead of clearing entire localStorage
      Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
      localStorage.setItem(STORAGE_KEYS.LAST_ACTIVE_DATE, getLocalDateString());
    } catch {}
  };

  const acknowledgeReturn = () => {
    setPendingReturn(false);
    try {
      localStorage.setItem(STORAGE_KEYS.LAST_ACK_RETURN_DATE, getLocalDateString());
    } catch {}
  };

  // --- Reset actions ---
  const activateFreshStart = (): Reset => {
    const today = new Date();
    const startDate = getLocalDateString(today);
    const endDate = getLocalDateString(addDays(today, 6));

    const days: ResetDay[] = Array.from({ length: 7 }, (_, i) => {
      const d = addDays(today, i);
      const dateStr = getLocalDateString(d);
      const tasks: ResetDayTask[] = [
        ...FRESH_START_TEMPLATE.dailyMinimumTasks.map((t, j) => ({
          id: `fst-${i}-min-${j}`,
          title: t.title,
          isOptional: false,
          completed: false,
        })),
        ...FRESH_START_TEMPLATE.dailyOptionalTasks.map((t, j) => ({
          id: `fst-${i}-opt-${j}`,
          title: t.title,
          isOptional: true,
          completed: false,
        })),
      ];
      return { day: i + 1, date: dateStr, tasks };
    });

    const reset: Reset = {
      id: `reset-${Date.now()}`,
      name: FRESH_START_TEMPLATE.name,
      goal: FRESH_START_TEMPLATE.goal,
      startDate,
      endDate,
      totalDays: 7,
      days,
      archived: false,
      templateId: FRESH_START_TEMPLATE.id,
    };

    setResets(prev => [reset, ...prev]);
    setSettings(prev => ({ ...prev, activeResetId: reset.id }));

    // Inject day 1 tasks into planner (Today)
    const day1Tasks = createTasksForResetDay(reset, 0, startDate);
    setTasks(prev => {
      const existingIds = new Set(prev.map(t => t.id));
      const toAdd = day1Tasks.filter(t => !existingIds.has(t.id));
      return toAdd.length > 0 ? [...prev, ...toAdd] : prev;
    });

    return reset;
  };

  const archiveReset = (resetId: string) => {
    setResets(prev => prev.map(r => r.id === resetId ? { ...r, archived: true } : r));
    if (settings.activeResetId === resetId) {
      setSettings(prev => ({ ...prev, activeResetId: undefined }));
    }
    // Remove incomplete reset tasks from active planner so they don't linger, preserving completed history
    setTasks(prev => prev.filter(t => !(t.resetId === resetId && !t.completed)));
  };

  const completeResetDayTask = (resetId: string, dayIndex: number, taskId: string) => {
    let newCompletedState: boolean | undefined;
    setResets(prev =>
      prev.map(r => {
        if (r.id !== resetId) return r;
        return {
          ...r,
          days: r.days.map((day, idx) => {
            if (idx !== dayIndex) return day;
            return {
              ...day,
              tasks: day.tasks.map(t => {
                if (t.id === taskId) {
                  newCompletedState = !t.completed;
                  return { ...t, completed: !t.completed };
                }
                return t;
              }),
            };
          }),
        };
      })
    );

    // Sync state to canonical tasks in planner
    const canonicalTaskId = `reset-task-${resetId}-d${dayIndex}-${taskId}`;
    setTasks(prev =>
      prev.map(t => {
        if (t.id === canonicalTaskId) {
          const completed = newCompletedState !== undefined ? newCompletedState : !t.completed;
          return {
            ...t,
            completed,
            completedAt: completed ? (t.completedAt || new Date().toISOString()) : undefined,
            completedTier: completed ? (t.completedTier || 'normal') : undefined,
          };
        }
        return t;
      })
    );
  };

  // --- Journal actions ---
  const addJournalEntry = (entry: Omit<WellnessJournalEntry, 'id'>) => {
    const newEntry: WellnessJournalEntry = {
      ...entry,
      id: `journal-${Date.now()}`,
    };
    setJournalEntries(prev => [newEntry, ...prev]);
  };

  return (
    <AppContext.Provider
      value={{
        tasks,
        routines,
        returns,
        helpfulInsights,
        settings,
        stuckLogs,
        resets,
        journalEntries,
        hydrated,
        activeModal,
        activeTaskId,
        activeRoutineId,
        notPlanningToday,
        pendingReturn,
        acknowledgeReturn,
        currentTask,
        todayTasks,
        laterTasks,
        unplannedTasks,
        upNextTasks,
        activeReset,
        focusSession,
        openModal,
        closeModal,
        setCurrentTask,
        clearCurrentTask,
        completeTask,
        uncompleteTask,
        addTask,
        updateTask,
        deleteTask,
        toggleStep,
        setTaskSteps,
        logStuckEvent,
        toggleRoutineStep,
        resetRoutineSteps,
        updateRoutine,
        addRoutine,
        deleteRoutine,
        updateSettings,
        setNotPlanningToday,
        deferTask,
        completeOnboarding,
        resetToEmptyDay,
        clearAllData,
        resetToDemoData,
        recordHelpfulFactor,
        startFocusSession,
        pauseFocusSession,
        resumeFocusSession,
        stopFocusSession,
        completeFocusSession,
        resetFocusSession,
        activateFreshStart,
        archiveReset,
        completeResetDayTask,
        addJournalEntry,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
