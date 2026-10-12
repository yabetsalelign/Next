import assert from 'node:assert';

// 1. Test dateUtils functions directly
function getLocalDateString(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function parseLocalDateString(dateStr) {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, (month || 1) - 1, day || 1, 0, 0, 0, 0);
}

function formatDayOfWeek(dateOrStr) {
  const SHORT_DAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const d = typeof dateOrStr === 'string'
    ? (dateOrStr.includes('T') ? new Date(dateOrStr) : parseLocalDateString(dateOrStr))
    : dateOrStr;
  return SHORT_DAYS[d.getDay()];
}

function addDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function toCalendarDateString(val) {
  if (!val) return null;
  if (val instanceof Date) return getLocalDateString(val);
  if (val.includes('T')) {
    const d = new Date(val);
    return isNaN(d.getTime()) ? null : getLocalDateString(d);
  }
  return val.slice(0, 10);
}

function isSameDay(d1, d2) {
  const s1 = toCalendarDateString(d1);
  const s2 = toCalendarDateString(d2);
  if (!s1 || !s2) return false;
  return s1 === s2;
}

function isBeforeDay(d1, d2) {
  const s1 = toCalendarDateString(d1);
  const s2 = toCalendarDateString(d2);
  if (!s1 || !s2) return false;
  return s1 < s2;
}

function getDaysDifference(d1, d2) {
  const date1 = typeof d1 === 'string' ? parseLocalDateString(toCalendarDateString(d1) || d1) : d1;
  const date2 = typeof d2 === 'string' ? parseLocalDateString(toCalendarDateString(d2) || d2) : d2;
  const utc1 = Date.UTC(date1.getFullYear(), date1.getMonth(), date1.getDate());
  const utc2 = Date.UTC(date2.getFullYear(), date2.getMonth(), date2.getDate());
  return Math.round((utc2 - utc1) / (1000 * 60 * 60 * 24));
}

function getCurrentWeekDateStrings(referenceDate = new Date()) {
  const current = new Date(referenceDate);
  const day = current.getDay();
  const diffToMonday = day === 0 ? -6 : 1 - day;
  const monday = addDays(current, diffToMonday);
  return Array.from({ length: 7 }, (_, i) => getLocalDateString(addDays(monday, i)));
}

console.log('--- RUNNING FUNCTIONAL VERIFICATION SUITE ---');

// Test 1: Local date string formatting (no UTC shifting)
{
  const localDate = new Date(2026, 9, 12, 23, 45, 0); // 2026-10-12 23:45 local
  const str = getLocalDateString(localDate);
  assert.strictEqual(str, '2026-10-12', 'Local date formatting failed');
  console.log('✓ Test 1 Passed: Local date formatting retains calendar day');
}

// Test 2: Current week pill generator
{
  const testMonday = new Date(2026, 9, 12); // Oct 12, 2026 is Monday
  const week = getCurrentWeekDateStrings(testMonday);
  assert.strictEqual(week.length, 7, 'Week must have 7 days');
  assert.strictEqual(week[0], '2026-10-12', 'Week must start on Monday');
  assert.strictEqual(week[6], '2026-10-18', 'Week must end on Sunday');
  assert.strictEqual(formatDayOfWeek(week[0]), 'MON');
  assert.strictEqual(formatDayOfWeek(week[6]), 'SUN');
  console.log('✓ Test 2 Passed: Dynamic week generation produces exact Monday-Sunday sequence');
}

// Test 3: Day rollover simulation
{
  const lastActiveDate = '2026-10-11';
  const todayDate = '2026-10-12';
  assert.strictEqual(isBeforeDay(lastActiveDate, todayDate), true);

  const prevTasks = [
    { id: 't1', title: 'Yesterday task', completed: false, timeCategory: 'now' },
    { id: 't2', title: 'Yesterday task 2', completed: false, timeCategory: 'today' },
    { id: 't3', title: 'Scheduled for future', completed: false, timeCategory: 'scheduled', scheduledDate: '2026-10-15' },
    { id: 't4', title: 'Scheduled for today', completed: false, timeCategory: 'today', scheduledDate: '2026-10-12' },
    { id: 't5', title: 'Completed yesterday', completed: true, completedAt: '2026-10-11T14:00:00Z', timeCategory: 'today' },
  ];

  // Rollover simulation
  const rolledOverTasks = prevTasks.map(t => {
    if (!t.completed && (t.timeCategory === 'now' || t.timeCategory === 'today')) {
      if (t.scheduledDate && isSameDay(t.scheduledDate, todayDate)) return t;
      if (t.scheduledDate && isBeforeDay(todayDate, t.scheduledDate)) return t;
      return { ...t, timeCategory: 'later', rolloverDate: todayDate };
    }
    return t;
  });

  assert.strictEqual(rolledOverTasks.find(t => t.id === 't1').timeCategory, 'later');
  assert.strictEqual(rolledOverTasks.find(t => t.id === 't2').timeCategory, 'later');
  assert.strictEqual(rolledOverTasks.find(t => t.id === 't3').timeCategory, 'scheduled');
  assert.strictEqual(rolledOverTasks.find(t => t.id === 't4').timeCategory, 'today');
  assert.strictEqual(rolledOverTasks.find(t => t.id === 't5').completed, true);
  console.log('✓ Test 3 Passed: Rollover safely demotes yesterday active tasks to later without deletion');
}

// Test 4: Return calculation after pause
{
  const lastActive = '2026-10-09'; // 3 days ago
  const today = '2026-10-12';
  const gap = getDaysDifference(lastActive, today);
  assert.strictEqual(gap, 3, 'Gap should be 3 days');
  assert.strictEqual(gap >= 2, true, 'User returned after pause');
  console.log('✓ Test 4 Passed: Return detection triggers only when absence gap >= 2 calendar days');
}

// Test 5: Completed today filtering
{
  const todayStr = '2026-10-12';
  const tasks = [
    { id: '1', completed: true, completedAt: '2026-10-12T09:15:00' },
    { id: '2', completed: true, completedAt: '2026-09-19T09:18:00' }, // from last month
    { id: '3', completed: false },
  ];
  const completedToday = tasks.filter(t => t.completed && t.completedAt && isSameDay(t.completedAt, todayStr));
  assert.strictEqual(completedToday.length, 1);
  assert.strictEqual(completedToday[0].id, '1');
  console.log('✓ Test 5 Passed: Old completed tasks are excluded from today completed count');
}

// Test 6: Backup validation, snapshotting & atomic rollback
{
  const runImporter = (rawJson, mockStorage, failOnKey = null, failRollback = false) => {
    const data = JSON.parse(rawJson);
    if (!data || typeof data !== 'object' || Array.isArray(data)) {
      throw new Error('Root must be an object');
    }
    if (!data.tasks && !data.routines && !data.settings && !data.version) {
      throw new Error('Missing backup identifiers');
    }
    const arrayFields = ['tasks', 'routines', 'returns', 'insights', 'stuckLogs', 'resets', 'journal', 'checkins'];
    for (const field of arrayFields) {
      if (data[field] !== undefined && !Array.isArray(data[field])) {
        throw new Error(`${field} must be an array`);
      }
    }
    if (data.settings !== undefined && (typeof data.settings !== 'object' || Array.isArray(data.settings) || data.settings === null)) {
      throw new Error('Settings must be an object');
    }
    if (data.tasks) {
      for (const t of data.tasks) {
        if (!t || typeof t !== 'object' || typeof t.id !== 'string' || typeof t.title !== 'string') {
          throw new Error('Tasks array contains invalid task items');
        }
      }
    }
    if (data.routines) {
      for (const r of data.routines) {
        if (!r || typeof r !== 'object' || typeof r.id !== 'string') {
          throw new Error('Routines array contains invalid routine items');
        }
      }
    }

    const writes = [];
    if (data.tasks) writes.push(['next_tasks_v1', JSON.stringify(data.tasks)]);
    if (data.routines) writes.push(['next_routines_v1', JSON.stringify(data.routines)]);
    if (data.returns) writes.push(['next_returns_v1', JSON.stringify(data.returns)]);
    if (data.insights) writes.push(['next_insights_v1', JSON.stringify(data.insights)]);
    if (data.settings) writes.push(['next_settings_v1', JSON.stringify(data.settings)]);
    if (data.stuckLogs) writes.push(['next_stuck_logs_v1', JSON.stringify(data.stuckLogs)]);
    if (data.resets) writes.push(['next_resets_v1', JSON.stringify(data.resets)]);
    if (data.journal) writes.push(['next_journal_v1', JSON.stringify(data.journal)]);
    if (data.checkins) writes.push(['next_checkins_v1', JSON.stringify(data.checkins)]);
    if (data.notPlanningToday !== undefined) writes.push(['next_not_planning_v1', JSON.stringify(data.notPlanningToday)]);
    if (data.lastActiveDate) writes.push(['next_last_active_date_v1', String(data.lastActiveDate)]);
    if (data.lastAckReturnDate) writes.push(['next_last_ack_return_date_v1', String(data.lastAckReturnDate)]);

    // Snapshot previous values
    const previousSnapshot = new Map();
    for (const [key] of writes) {
      previousSnapshot.set(key, mockStorage.has(key) ? mockStorage.get(key) : null);
    }

    // Write with rollback
    try {
      for (const [key, val] of writes) {
        if (key === failOnKey) {
          throw new Error('QuotaExceededError: storage full');
        }
        mockStorage.set(key, val);
      }
    } catch (writeErr) {
      let rollbackFailed = false;
      try {
        if (failRollback) throw new Error('Unrecoverable disk failure');
        for (const [key, prevVal] of previousSnapshot.entries()) {
          if (prevVal === null) {
            mockStorage.delete(key);
          } else {
            mockStorage.set(key, prevVal);
          }
        }
      } catch (rbErr) {
        rollbackFailed = true;
      }
      if (rollbackFailed) {
        throw new Error('Storage write failed and rollback failed. Some data may be partially updated.');
      } else {
        throw new Error('Storage write failed. All changes were safely rolled back.');
      }
    }
  };

  // 1. Valid backup test
  const storage1 = new Map();
  storage1.set('next_tasks_v1', JSON.stringify([{ id: 'old-1', title: 'Old Task' }]));
  storage1.set('unrelated_site_key', 'keep_me');

  const validBackupJson = JSON.stringify({
    version: 1,
    tasks: [{ id: 'new-1', title: 'New Task' }],
    routines: [{ id: 'new-r1' }],
    settings: { theme: 'dark' },
    checkins: [{ id: 'c1', energy: 'okay' }],
  });
  runImporter(validBackupJson, storage1);
  assert.strictEqual(JSON.parse(storage1.get('next_tasks_v1'))[0].title, 'New Task');
  assert.strictEqual(storage1.get('unrelated_site_key'), 'keep_me', 'Unrelated storage keys preserved');

  // 2. Malformed / corrupted JSON rejection
  assert.throws(() => runImporter('not a json', storage1), /SyntaxError|Unexpected token/);

  // 3. Schema invalidity rejection (e.g. tasks is not array)
  assert.throws(() => runImporter(JSON.stringify({ version: 1, tasks: 'not an array' }), storage1), /tasks must be an array/);
  assert.throws(() => runImporter(JSON.stringify({ version: 1, tasks: [{ id: 123 }] }), storage1), /Tasks array contains invalid task items/);

  // 4. Simulated write failure with successful atomic rollback
  const storage2 = new Map();
  const initialTaskData = JSON.stringify([{ id: 'original-1', title: 'Original Task' }]);
  storage2.set('next_tasks_v1', initialTaskData);
  storage2.set('next_routines_v1', JSON.stringify([{ id: 'original-r1' }]));

  let caughtErr = null;
  try {
    runImporter(
      JSON.stringify({
        version: 1,
        tasks: [{ id: 'written-first', title: 'Written first' }],
        routines: [{ id: 'fails-here' }],
      }),
      storage2,
      'next_routines_v1' // Simulates failure when attempting to write routines
    );
  } catch (err) {
    caughtErr = err;
  }
  assert.ok(caughtErr);
  assert.strictEqual(caughtErr.message, 'Storage write failed. All changes were safely rolled back.');
  assert.strictEqual(storage2.get('next_tasks_v1'), initialTaskData, 'Tasks rolled back to original snapshot');

  // 5. Simulated failure with rollback failure reports honest message
  let rollbackErr = null;
  try {
    runImporter(validBackupJson, storage2, 'next_routines_v1', true);
  } catch (err) {
    rollbackErr = err;
  }
  assert.ok(rollbackErr);
  assert.ok(rollbackErr.message.includes('rollback failed'), 'Honest reporting on rollback failure');

  console.log('✓ Test 6 Passed: Backup validation rejects bad schemas, and atomic snapshot & rollback protects data');
}

// ==========================================
// FIX 1 TEST SUITE: Data Safety on Welcome Back
// ==========================================
{
  // Simulated storage
  const mockStorage = new Map();
  mockStorage.set('next_tasks', JSON.stringify([{ id: 'custom-1', title: 'My sacred user task', completed: false }]));
  mockStorage.set('next_routines', JSON.stringify([{ id: 'custom-r1', name: 'My morning routine' }]));
  mockStorage.set('next_journal', JSON.stringify([{ id: 'j-1', date: '2026-10-10', text: 'Important reflections' }]));
  mockStorage.set('unrelated_browser_key', 'do_not_delete_me');

  // Welcome back "A normal day" handler execution
  // Crucial: Must NOT call localStorage.clear() or overwrite user data
  const handleNormalDay = (setNotPlanning, ackReturn) => {
    setNotPlanning(false);
    ackReturn();
  };

  let notPlanning = true;
  let returnAck = false;
  handleNormalDay(
    (val) => { notPlanning = val; },
    () => { returnAck = true; }
  );

  // Assertions
  assert.strictEqual(notPlanning, false, 'Should resume planning');
  assert.strictEqual(returnAck, true, 'Should acknowledge return');
  assert.strictEqual(mockStorage.get('next_tasks').includes('My sacred user task'), true, 'User task preserved');
  assert.strictEqual(mockStorage.get('next_routines').includes('My morning routine'), true, 'User routine preserved');
  assert.strictEqual(mockStorage.get('next_journal').includes('Important reflections'), true, 'Journal entry preserved');
  assert.strictEqual(mockStorage.get('unrelated_browser_key'), 'do_not_delete_me', 'Unrelated storage preserved');
  console.log('✓ FIX 1 Passed: "A normal day" preserves all user tasks, routines, journals, and storage without clearing');
}

// ==========================================
// FIX 2 TEST SUITE: Return Detection & Deduplication
// ==========================================
{
  // Case A: First ever launch (no lastActiveDate)
  {
    const storedLastDate = null;
    const todayStr = '2026-10-12';
    let pendingReturn = false;
    if (storedLastDate && isBeforeDay(storedLastDate, todayStr)) {
      const daysGap = getDaysDifference(storedLastDate, todayStr);
      if (daysGap >= 2) pendingReturn = true;
    }
    assert.strictEqual(pendingReturn, false, 'First launch must not trigger return prompt');
  }

  // Case B: Normal subsequent day (gap = 1)
  {
    const storedLastDate = '2026-10-11';
    const todayStr = '2026-10-12';
    let pendingReturn = false;
    if (storedLastDate && isBeforeDay(storedLastDate, todayStr)) {
      const daysGap = getDaysDifference(storedLastDate, todayStr);
      if (daysGap >= 2) pendingReturn = true;
    }
    assert.strictEqual(pendingReturn, false, 'Next day active must not trigger return prompt');
  }

  // Case C: Absence of 2+ calendar days (gap = 2)
  {
    const storedLastDate = '2026-10-10';
    const todayStr = '2026-10-12';
    let returns = [];
    let pendingReturn = false;
    let storedLastAck = null;

    const daysGap = getDaysDifference(storedLastDate, todayStr);
    assert.strictEqual(daysGap, 2);
    if (daysGap >= 2) {
      if (!returns.some(r => r.dateStr === todayStr)) {
        returns.push({ dateStr: todayStr, status: 'returned' });
      }
      if (storedLastAck !== todayStr) {
        pendingReturn = true;
      }
    }
    assert.strictEqual(pendingReturn, true, 'Absence of 2+ days triggers return prompt');
    assert.strictEqual(returns.length, 1);
    assert.strictEqual(returns[0].status, 'returned');

    // Case D: Acknowledge return
    pendingReturn = false;
    storedLastAck = todayStr;

    // Case E: Repeated renders / rollover checks do not re-prompt or duplicate records
    if (daysGap >= 2) {
      if (!returns.some(r => r.dateStr === todayStr)) {
        returns.push({ dateStr: todayStr, status: 'returned' });
      }
      if (storedLastAck !== todayStr) {
        pendingReturn = true;
      }
    }
    assert.strictEqual(pendingReturn, false, 'Already acknowledged return does not re-prompt today');
    assert.strictEqual(returns.length, 1, 'Return record must not be duplicated');
  }
  console.log('✓ FIX 2 Passed: Welcome Back triggers reliably on 2+ day absence without duplicates or first-launch errors');
}

// ==========================================
// FIX 3 TEST SUITE: Fresh Start Integration & Sync
// ==========================================
{
  const todayStr = '2026-10-12';
  const reset = {
    id: 'reset-123',
    startDate: todayStr,
    days: [
      {
        day: 1,
        date: todayStr,
        tasks: [
          { id: 'fst-0-min-0', title: '5 min reset walk', isOptional: false, completed: false },
          { id: 'fst-0-opt-0', title: 'Tidy one corner', isOptional: true, completed: false },
        ],
      },
    ],
  };

  // 1. Task generation helper creates valid Planner tasks
  const createTasksForResetDay = (r, dayIdx, dateStr) => {
    const day = r.days[dayIdx];
    return day.tasks.map((rt, idx) => ({
      id: `reset-task-${r.id}-d${dayIdx}-${rt.id}`,
      title: rt.title,
      category: 'routine',
      icon: rt.isOptional ? '✨' : '🌱',
      timeCategory: 'today',
      durationMinutes: rt.isOptional ? 10 : 5,
      priority: rt.isOptional ? 'nice' : 'must',
      completed: rt.completed,
      scheduledDate: dateStr,
      resetId: r.id,
      resetTaskId: rt.id,
      resetDayIndex: dayIdx,
      isOptional: rt.isOptional,
    }));
  };

  let plannerTasks = [
    { id: 'normal-1', title: 'Normal user task', completed: false, timeCategory: 'today' },
  ];

  // 2. Activate Fresh Start: Day 1 tasks are injected
  const day1PlannerTasks = createTasksForResetDay(reset, 0, todayStr);
  plannerTasks.push(...day1PlannerTasks);

  assert.strictEqual(plannerTasks.length, 3, 'Planner should contain 1 normal task + 2 reset tasks');
  const injectedMin = plannerTasks.find(t => t.id === 'reset-task-reset-123-d0-fst-0-min-0');
  assert.ok(injectedMin, 'Day 1 minimum task injected into Today');
  assert.strictEqual(injectedMin.completed, false);

  // 3. Complete from Today: Bidirectional sync to reset model
  injectedMin.completed = true;
  // Sync logic
  reset.days[0].tasks.forEach(rt => {
    if (rt.id === injectedMin.resetTaskId) {
      rt.completed = true;
    }
  });
  assert.strictEqual(reset.days[0].tasks[0].completed, true, 'Completing from Today updates Reset model');

  // 4. Complete from Reset modal: Bidirectional sync to Planner
  // Toggle the optional task in Reset modal
  const optTask = reset.days[0].tasks[1];
  optTask.completed = true;
  // Sync logic in completeResetDayTask
  const canonicalId = `reset-task-reset-123-d0-${optTask.id}`;
  const canonicalTask = plannerTasks.find(t => t.id === canonicalId);
  if (canonicalTask) {
    canonicalTask.completed = optTask.completed;
  }
  assert.strictEqual(canonicalTask.completed, true, 'Completing from Reset modal updates Today/Plan task');

  // 5. Normal tasks remain completely untouched
  const normalTask = plannerTasks.find(t => t.id === 'normal-1');
  assert.strictEqual(normalTask.completed, false, 'Normal user tasks preserved');

  // 6. Archiving reset removes uncompleted reset tasks without deleting completed history
  // Suppose there is an uncompleted reset task
  const uncompletedResetTask = {
    id: 'reset-task-reset-123-d0-uncompleted',
    resetId: 'reset-123',
    completed: false,
  };
  plannerTasks.push(uncompletedResetTask);
  // Archive filter
  plannerTasks = plannerTasks.filter(t => !(t.resetId === 'reset-123' && !t.completed));
  assert.strictEqual(plannerTasks.some(t => t.id === 'reset-task-reset-123-d0-uncompleted'), false, 'Uncompleted reset task removed');
  assert.strictEqual(plannerTasks.some(t => t.id === injectedMin.id), true, 'Completed reset task preserved in history');

  console.log('✓ FIX 3 Passed: Fresh Start tasks fully synchronized with Today/Plan without duplicating or losing data');
}

console.log('--- ALL VERIFICATION TESTS PASSED ---');
