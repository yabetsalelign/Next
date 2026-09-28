'use client';

import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import {
  Task,
  Routine,
  ReturnDay,
  HelpfulInsight,
  UserSettings,
  StuckLog,
  TaskStep,
  StuckReason
} from '../types';
import {
  INITIAL_TASKS,
  INITIAL_ROUTINES,
  INITIAL_RETURNS,
  INITIAL_HELPFUL_INSIGHTS,
  DEFAULT_SETTINGS
} from './sampleData';

type ModalType = 
  | 'help_start' 
  | 'stuck' 
  | 'breakdown' 
  | 'create_task' 
  | 'routine_runner' 
  | 'body_check' 
  | null;

interface AppContextType {
  tasks: Task[];
  routines: Routine[];
  returns: ReturnDay[];
  helpfulInsights: HelpfulInsight[];
  settings: UserSettings;
  stuckLogs: StuckLog[];
  hydrated: boolean;
  activeModal: ModalType;
  activeTaskId: string | null;
  activeRoutineId: string | null;
  notPlanningToday: boolean;
  currentTask: Task | null;
  upNextTasks: Task[];
  
  // Actions
  openModal: (modal: ModalType, taskId?: string, routineId?: string) => void;
  closeModal: () => void;
  setCurrentTask: (taskId: string) => void;
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
  updateSettings: (updates: Partial<UserSettings>) => void;
  setNotPlanningToday: (val: boolean) => void;
  resetToDemoData: () => void;
  recordHelpfulFactor: (factorId: string) => void;
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
};

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [routines, setRoutines] = useState<Routine[]>(INITIAL_ROUTINES);
  const [returns, setReturns] = useState<ReturnDay[]>(INITIAL_RETURNS);
  const [helpfulInsights, setHelpfulInsights] = useState<HelpfulInsight[]>(INITIAL_HELPFUL_INSIGHTS);
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
  const [stuckLogs, setStuckLogs] = useState<StuckLog[]>([]);
  const [notPlanningToday, setNotPlanningTodayState] = useState<boolean>(false);
  const [hydrated, setHydrated] = useState<boolean>(false);

  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [activeRoutineId, setActiveRoutineId] = useState<string | null>(null);

  // Safe localStorage hydration
  useEffect(() => {
    try {
      const storedTasks = localStorage.getItem(STORAGE_KEYS.TASKS);
      if (storedTasks) setTasks(JSON.parse(storedTasks));

      const storedRoutines = localStorage.getItem(STORAGE_KEYS.ROUTINES);
      if (storedRoutines) setRoutines(JSON.parse(storedRoutines));

      const storedReturns = localStorage.getItem(STORAGE_KEYS.RETURNS);
      if (storedReturns) setReturns(JSON.parse(storedReturns));

      const storedInsights = localStorage.getItem(STORAGE_KEYS.INSIGHTS);
      if (storedInsights) setHelpfulInsights(JSON.parse(storedInsights));

      const storedSettings = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (storedSettings) setSettings(JSON.parse(storedSettings));

      const storedStuckLogs = localStorage.getItem(STORAGE_KEYS.STUCK_LOGS);
      if (storedStuckLogs) setStuckLogs(JSON.parse(storedStuckLogs));

      const storedNotPlanning = localStorage.getItem(STORAGE_KEYS.NOT_PLANNING);
      if (storedNotPlanning) setNotPlanningTodayState(JSON.parse(storedNotPlanning));
    } catch (e) {
      console.error('Failed to load data from localStorage:', e);
    } finally {
      setHydrated(true);
    }
  }, []);

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
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
    }
  }, [tasks, routines, returns, helpfulInsights, settings, stuckLogs, notPlanningToday, hydrated]);

  // Handle dark mode class on document
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
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
  }, [settings.theme]);

  // Derived: Current task (Now) and Up Next
  const { currentTask, upNextTasks } = useMemo(() => {
    const uncompleted = tasks.filter(t => !t.completed);
    const nowTask = uncompleted.find(t => t.timeCategory === 'now') || uncompleted[0] || null;
    const upNext = uncompleted.filter(t => t.id !== nowTask?.id).slice(0, 4);
    return { currentTask: nowTask, upNextTasks: upNext };
  }, [tasks]);

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
    setTasks(prev =>
      prev.map(t => {
        if (t.id === taskId) {
          return {
            ...t,
            completed: true,
            completedAt: new Date().toISOString(),
            completedTier: tier,
          };
        }
        return t;
      })
    );

    // If tier is minimum, increment helpful insight for mini starts
    if (tier === 'minimum') {
      recordHelpfulFactor('h1');
    }
  };

  const uncompleteTask = (taskId: string) => {
    setTasks(prev =>
      prev.map(t => {
        if (t.id === taskId) {
          return {
            ...t,
            completed: false,
            completedAt: undefined,
            completedTier: undefined,
          };
        }
        return t;
      })
    );
  };

  const addTask = (newTaskData: Omit<Task, 'id' | 'orderIndex' | 'completed'>): Task => {
    const id = `task-${Date.now()}`;
    const task: Task = {
      ...newTaskData,
      id,
      completed: false,
      orderIndex: tasks.length,
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

  const updateSettings = (updates: Partial<UserSettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  };

  const setNotPlanningToday = (val: boolean) => {
    setNotPlanningTodayState(val);
  };

  const recordHelpfulFactor = (factorId: string) => {
    setHelpfulInsights(prev =>
      prev.map(f => (f.id === factorId ? { ...f, count: f.count + 1 } : f))
    );
  };

  const resetToDemoData = () => {
    setTasks(INITIAL_TASKS);
    setRoutines(INITIAL_ROUTINES);
    setReturns(INITIAL_RETURNS);
    setHelpfulInsights(INITIAL_HELPFUL_INSIGHTS);
    setSettings(DEFAULT_SETTINGS);
    setStuckLogs([]);
    setNotPlanningTodayState(false);
    try {
      localStorage.clear();
    } catch {}
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
        hydrated,
        activeModal,
        activeTaskId,
        activeRoutineId,
        notPlanningToday,
        currentTask,
        upNextTasks,
        openModal,
        closeModal,
        setCurrentTask,
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
        updateSettings,
        setNotPlanningToday,
        resetToDemoData,
        recordHelpfulFactor,
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
