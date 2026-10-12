/**
 * Local-calendar date utilities for Next.
 * All functions operate strictly on the user's local calendar day,
 * avoiding UTC shifts caused by `new Date().toISOString().split('T')[0]`.
 */

/**
 * Returns the local calendar date string formatted as YYYY-MM-DD.
 */
export function getLocalDateString(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Safely parses a YYYY-MM-DD string into a local Date object
 * at 00:00:00 local time, preventing UTC midnight offset shifts.
 */
export function parseLocalDateString(dateStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, (month || 1) - 1, day || 1, 0, 0, 0, 0);
}

const SHORT_DAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'] as const;

/**
 * Returns the 3-letter uppercase day of week in local time (e.g. 'MON', 'TUE').
 */
export function formatDayOfWeek(dateOrStr: Date | string): string {
  const d = typeof dateOrStr === 'string' 
    ? (dateOrStr.includes('T') ? new Date(dateOrStr) : parseLocalDateString(dateOrStr))
    : dateOrStr;
  return SHORT_DAYS[d.getDay()];
}

/**
 * Formats a date for human-readable display in the local calendar.
 */
export function formatDisplayDate(
  dateOrStr: Date | string,
  options: Intl.DateTimeFormatOptions = { weekday: 'short', month: 'short', day: 'numeric' }
): string {
  const d = typeof dateOrStr === 'string'
    ? (dateOrStr.includes('T') ? new Date(dateOrStr) : parseLocalDateString(dateOrStr))
    : dateOrStr;
  return d.toLocaleDateString(undefined, options);
}

/**
 * Adds an integer number of days to a date, returning a new Date.
 */
export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

/**
 * Extracts the YYYY-MM-DD part from an ISO string, Date, or date string.
 */
export function toCalendarDateString(val: Date | string | undefined | null): string | null {
  if (!val) return null;
  if (val instanceof Date) return getLocalDateString(val);
  if (val.includes('T')) {
    const d = new Date(val);
    return isNaN(d.getTime()) ? null : getLocalDateString(d);
  }
  // Assume already YYYY-MM-DD
  return val.slice(0, 10);
}

/**
 * Checks if two dates represent the exact same local calendar day.
 */
export function isSameDay(d1: Date | string | undefined | null, d2: Date | string | undefined | null): boolean {
  const s1 = toCalendarDateString(d1);
  const s2 = toCalendarDateString(d2);
  if (!s1 || !s2) return false;
  return s1 === s2;
}

/**
 * Checks if d1 is strictly before d2 on the local calendar.
 */
export function isBeforeDay(d1: Date | string | undefined | null, d2: Date | string | undefined | null): boolean {
  const s1 = toCalendarDateString(d1);
  const s2 = toCalendarDateString(d2);
  if (!s1 || !s2) return false;
  return s1 < s2;
}

/**
 * Checks if d1 is strictly after d2 on the local calendar.
 */
export function isAfterDay(d1: Date | string | undefined | null, d2: Date | string | undefined | null): boolean {
  const s1 = toCalendarDateString(d1);
  const s2 = toCalendarDateString(d2);
  if (!s1 || !s2) return false;
  return s1 > s2;
}

/**
 * Calculates the number of calendar days between two dates (d2 - d1).
 * Positive means d2 is after d1.
 */
export function getDaysDifference(d1: Date | string, d2: Date | string): number {
  const date1 = typeof d1 === 'string' ? parseLocalDateString(toCalendarDateString(d1) || d1) : d1;
  const date2 = typeof d2 === 'string' ? parseLocalDateString(toCalendarDateString(d2) || d2) : d2;
  
  const utc1 = Date.UTC(date1.getFullYear(), date1.getMonth(), date1.getDate());
  const utc2 = Date.UTC(date2.getFullYear(), date2.getMonth(), date2.getDate());
  
  return Math.round((utc2 - utc1) / (1000 * 60 * 60 * 24));
}

/**
 * Returns the array of 7 local calendar date strings (YYYY-MM-DD) for the current week,
 * starting on Monday (standard for rhythm planning) and ending on Sunday.
 */
export function getCurrentWeekDateStrings(referenceDate: Date = new Date()): string[] {
  const current = new Date(referenceDate);
  const day = current.getDay(); // 0 is Sunday, 1 is Monday...
  // Difference to Monday
  const diffToMonday = day === 0 ? -6 : 1 - day;
  const monday = addDays(current, diffToMonday);
  
  return Array.from({ length: 7 }, (_, i) => getLocalDateString(addDays(monday, i)));
}
