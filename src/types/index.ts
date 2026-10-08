export type TaskTimeCategory = 'now' | 'today' | 'later' | 'scheduled' | 'notime';

export type TaskPriority = 'must' | 'should' | 'could';

export type EnvironmentPreference = 
  | 'alone' 
  | 'someone_nearby' 
  | 'body_double' 
  | 'background_company' 
  | 'no_preference';

export type TaskCategory = 'productive' | 'rest' | 'routine' | 'wellness';

export type BodyState = 'tired' | 'stressed' | 'dehydrated' | 'heavy' | 'comfortable' | 'energized';
export type HydrationLevel = 'low' | 'okay' | 'good';
export type EnergyLevel = 'almost_none' | 'a_little' | 'okay' | 'plenty';

export interface TaskStep {
  id: string;
  title: string;
  completed: boolean;
  isMinimum?: boolean;
}

export interface Task {
  id: string;
  title: string;
  category: TaskCategory;
  icon?: string;
  timeCategory: TaskTimeCategory;
  scheduledTime?: string; // Optional time, e.g. "10:30"
  durationMinutes: number;
  priority: TaskPriority;
  minimum: string; // The smallest possible version ("The minimum counts")
  normal: string;  // The intended version
  extra?: string;  // Optional extra effort
  steps: TaskStep[];
  companyPreference: EnvironmentPreference;
  completed: boolean;
  completedAt?: string;
  completedTier?: 'minimum' | 'normal' | 'extra';
  startedAt?: string;
  notes?: string;
  orderIndex: number;
  resetId?: string; // If this task belongs to an active Reset
}

export interface RoutineStep {
  id: string;
  title: string;
  durationMinutes: number;
  completed?: boolean;
}

export interface Routine {
  id: string;
  title: string;
  icon: string;
  description: string;
  enabled: boolean;
  timeOfDay?: 'morning' | 'afternoon' | 'evening' | 'anytime';
  steps: RoutineStep[];
  category?: 'wellness' | 'general'; // Optional category for filtering
}

export type StuckReason = 
  | 'cant_start'
  | 'too_much'
  | 'body_feels_bad'
  | 'watched'
  | 'environment_too_much'
  | 'dont_know_what_next';

export interface StuckLog {
  id: string;
  taskId?: string;
  taskTitle?: string;
  reason: StuckReason;
  actionTaken: string;
  timestamp: string;
}

export interface DailyCheckIn {
  date: string;
  energy: number; // 1 to 5
  bodyState: BodyState;
  hydration?: HydrationLevel;
  environment: 'alone' | 'someone_nearby' | 'observed' | 'noisy';
  completedAt: string;
}

export interface ReturnDay {
  dayOfWeek: string; // "MON", "TUE", etc.
  dateStr: string;   // YYYY-MM-DD
  status: 'active' | 'paused' | 'returned';
  note?: string;
}

export interface HelpfulInsight {
  id: string;
  label: string;
  icon: string;
  count: number;
}

// --- Reset types ---
export interface ResetDayTask {
  id: string;
  title: string;
  isOptional: boolean;
  completed: boolean;
}

export interface ResetDay {
  day: number;       // 1-indexed
  date: string;      // YYYY-MM-DD
  tasks: ResetDayTask[];
  completedAt?: string;
}

export interface Reset {
  id: string;
  name: string;
  goal: string;
  startDate: string;  // YYYY-MM-DD
  endDate: string;    // YYYY-MM-DD
  totalDays: number;
  days: ResetDay[];
  archived: boolean;
  templateId?: string;
}

// --- Wellness journal ---
export interface WellnessJournalEntry {
  id: string;
  date: string;       // YYYY-MM-DD
  prompt: string;
  response: string;
  resetId?: string;
}

export interface UserSettings {
  theme: 'light' | 'dark' | 'system';
  defaultTimerMinutes: 2 | 5 | 10;
  soundEnabled: boolean;
  reducedMotion: boolean;
  hapticFeedback: boolean;
  wellnessEnabled: boolean;    // Show wellness features
  activeResetId?: string;      // Currently active reset
  hasCompletedOnboarding?: boolean;
  startingDifficulty?: 'gentle' | 'balanced' | 'structured';
  showExtras?: boolean;
  onboardingGoals?: string[];
}
