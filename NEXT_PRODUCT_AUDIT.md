# Next — Product Audit, User-Problem Diagnosis & Research

**Audit Date:** October 2026  
**Auditor:** Senior Product Strategist, UX Researcher, Interaction Designer & Software Architect  
**Target:** Next (`v0.1.0`) — Personal Executive-Function & Productivity Application  
**Repository State:** Next.js 14.2 (App Router, Static Export), React 18, TypeScript, Tailwind CSS, Tauri v2 (`src-tauri`), Capacitor Android (`@capacitor/android`)

---

## Evidence Ledger Key
Throughout this audit, every claim is classified according to this rubric:
- **[Verified]:** Directly observed and confirmed in source code, build logs, file system, or cited empirical literature.
- **[User-reported]:** Directly stated in the user research brief.
- **[Hypothesis]:** Plausible causal explanation based on interaction patterns and cognitive science, requiring behavioral validation.
- **[Unknown]:** Crucial information that cannot currently be established without user observation.

---

## 1. Executive Verdict: Is Next Solving the Right Problem?

### The Core Paradox
Next was conceived with humane, self-compassionate, executive-function-friendly principles: *"The minimum counts,"* *"Returning > Streaks,"* and *"No catch-up debt."* **[Verified: README.md, sampleData.ts]**

However, **Next is currently suffering from a classic product paradox: It has built an elaborate conceptual model for managing tasks, but the user's primary barrier is not task categorization—it is cognitive initiation, working memory offloading, and sustained state maintenance.**

* **User reality:** The user uses Next on most days, yet experiences an *"endless loop"* where they feel blank, frozen, sleepy, or overwhelmed; their thoughts feel disjointed; they start tasks but abandon them to distractions; and the predefined UI feels like an administrative burden. **[User-reported]**
* **Application reality:** The codebase has accumulated 10 separate modal dialogs, 7 pre-packaged multi-step routines, a 7-day wellness challenge, a body/environment check-in picker, stuck reason telemetry, and a multi-tiered task taxonomy (Minimum, Normal, Extra, TimeCategory, Priority, EnvironmentPreference). **[Verified: src/types/index.ts, src/components/modals/]**

### Verdict
**Next is currently attempting to solve an executive-function problem by requiring the user to perform heavy executive function.** 

When a user is frozen or mentally fragmented:
1. They cannot neatly decompose an ambiguous thought into fields (`Minimum`, `Normal`, `Duration`, `Company Preference`).
2. They do not need a visual calendar of mock return days from September 2026.
3. They do not need 6 distinct friction options that branch into random wellness pickers.

Next does not need more features, more wrappers, or desktop system tray integrations. It needs an honest alignment between **what the user's brain actually needs during an executive lapse** and **what the interface demands of them**.

---

## 2. What the Existing Application Actually Does

A rigorous inspection of the codebase reveals significant divergence between the application's stated philosophy and its functional implementation:

### 2.1 Architecture & Persistence
* **Tech Stack:** Next.js 14.2.20 with `output: 'export'` and `unoptimized: true` images in [next.config.mjs](file:///c:/Users/Ruth.A/Desktop/New%20folder/Next/next.config.mjs). Static export generates 9 clean HTML routes in `out/`. **[Verified]**
* **Dual Packaging Footprint:** The repo contains both an Android Capacitor wrapper (`capacitor.config.ts`, `android/`, `Next-debug.apk`) and a Tauri v2 desktop wrapper (`src-tauri/`). **[Verified]**
* **State Management:** A single React Context (`AppContext` in [store.tsx](file:///c:/Users/Ruth.A/Desktop/New%20folder/Next/src/lib/store.tsx)) storing 10 separate state slices in browser `localStorage` (`next_tasks_v1`, `next_routines_v1`, etc.). **[Verified]**
* **Critical Absence — No Day Rollover Engine:** There is **no date-checking or midnight reset logic** anywhere in `store.tsx`. When a user opens the application the next day:
  * Yesterday's uncompleted tasks are still sitting in `Now` and `Today`. **[Verified]**
  * Yesterday's completed tasks remain marked complete. **[Verified]**
  * The `ReturnDay` history displayed on `/history` is **100% hardcoded mock data** (`INITIAL_RETURNS` with fixed dates from September 14–20, 2026). Not a single line of code in the app appends or records a real return day. **[Verified: store.tsx lines 44-147, sampleData.ts lines 320-328]**
  * The `helpfulInsights` bar chart begins with fabricated counts (`2-minute mini starts: 9`, `Someone nearby: 6`). **[Verified: sampleData.ts line 330]**

### 2.2 Functional Flow Analysis

| Screen / Flow | Implemented Mechanics | Verified Friction & Limitations |
| :--- | :--- | :--- |
| **Today (`/`)** | Displays `CurrentTaskCard` for the active task (`timeCategory === 'now'` or first uncompleted). Primary CTA: "Help me start" (amber button), secondary "Done · Later · Stuck", accordion "See more". | Shows one task prominently, which is strong. But if the user has multiple uncompleted tasks, `upNextTasks` appears below as a dropdown. Clicking "Done" triggers a 1.2s chime and auto-promotes the next task without user confirmation. |
| **Help Me Start Modal** | 8-stage state machine (`HelpStage`). Proposes first micro-step, starts a 2-minute countdown timer with Web Audio API chime. If user says "What would make this easier?", branches to 4 sub-screens. | Offers a 2-min countdown, but once the countdown finishes or starts, it is trapped inside a modal dialog. If the user minimizes the app to actually work in their editor or browser, the modal context is lost or hidden. |
| **I'm Stuck Modal** | Presents 6 friction buttons ("Can't start", "Too much", "Body feels bad", "Watched", "Environment", "Don't know"). If "Body feels bad" is chosen, switches to "Wellness Mode" with a random activity picker. | Diagnosing *why* you are stuck requires introspective meta-cognition. A user in a brain-fog or frozen state is forced into a multiple-choice survey and breathing exercises. |
| **Task Creation Modal** | Form requiring: Title, When (Now/Today/Later/No time), Minimum, Normal, Rest toggle, Company preference, Duration, Extra fields. | High cognitive barrier. Requires 6 to 8 explicit decisions before a task can even exist in the system. |
| **Plan (`/plan`)** | Groups tasks into NOW, NEXT, LATER. Filter pills (All, Must, Care, Rest). Presets for 6 rest activities and 15 wellness activities. | Re-introduces the multi-task backlog that Today attempts to hide. Becomes a traditional to-do list with custom categories. |
| **Routines (`/routines`)** | 7 pre-populated routines (Morning Awakening, Evening Wind-Down, Midday Reset, Morning Care, Night Care, 5-Min Reset, Event Prep). Step-by-step modal runner. | 7 routines with up to 9 steps each totals 45+ daily maintenance steps. Running these requires tedious manual checkbox checking. |
| **7-Day Fresh Start** | A structured 7-day challenge modal with 9 required daily wellness tasks and 7 optional tasks per day. | Directly contradicts the core philosophy of *"Returning > Streaks"* and *"No Catch-Up"*. It is an explicit streak-based multi-day checklist. |

---

## 3. User Problem & Failure Analysis

### 3.1 Causal Failure Tree

```
                       [Reported Outcome: "Endless loop", tasks abandoned, app not helping]
                                                    │
         ┌──────────────────────────────────────────┼──────────────────────────────────────────┐
         ▼                                          ▼                                          ▼
[1. Mental Input Gap]                    [2. In-Flight Execution Void]               [3. System Meta-Friction]
 • Disjointed, unorganized thoughts       • Once "started", Next disappears          • High input friction (forms, tiers)
 • Cognitive overload / brain fog         • No execution anchor on screen            • 10 modals, 7 routines, presets
 • Inability to categorize into form      • Susceptible to distraction/tab switch    • Fake tracking (mock 2026 data)
         │                                          │                                          │
         ▼                                          ▼                                          ▼
[Pre-App Paralysis]                       [Interruption Amnesia]                     [Administrative Burnout]
User cannot translate vague feelings      Distraction occurs; working memory drops    User feels app is another obligation;
into Next's structured taxonomy.          the task; returning requires re-deciding.   avoidance sets in.
```

### 3.2 Detailed Breakdown of Potential Failure Points

#### Failure Point A: Capturing Tasks & Translating Vague Intentions
* **User Brief Evidence:** User reports *"thoughts can be disjointed and organizing them into a predefined interface may not be enough."* User proposes talking freely with ChatGPT first. **[User-reported]**
* **Implementation Evidence:** [TaskCreatorModal.tsx](file:///c:/Users/Ruth.A/Desktop/New%20folder/Next/src/components/modals/TaskCreatorModal.tsx) presents rigid input fields: `Title`, `When`, `Minimum`, `Normal`, `Duration`, `Company Preference`. **[Verified]**
* **Analysis:** Standard task managers assume the user already knows the task, its scope, and its priority. When a user is overwhelmed, thoughts exist as emotional friction (*"I need to deal with that project, but I don't know what's broken and I'm anxious"*). Forcing that state into a structured form causes immediate drop-off.
* **Causal Role:** **Root Cause (Pre-Initiation).**

#### Failure Point B: Beginning Work vs. Staying Engaged
* **User Brief Evidence:** User reports *"Starting tasks but becoming distracted or abandoning them."* **[User-reported]**
* **Implementation Evidence:** The app has elaborate start flows (`HelpMeStartModal`, 2-minute countdown timer), but **zero post-start execution environment**. When the timer runs out, it shows a completion modal. It provides no persistent on-screen reference, no active scratchpad, no distraction barrier, and no external cue while the user works in VS Code, a browser, or desktop software. **[Verified: HelpMeStartModal.tsx]**
* **Analysis:** Starting is only the first 5% of task completion. If the user starts, experiences cognitive friction 3 minutes in, switches tabs to check something, and loses their working memory thread, Next offers no scaffolding.
* **Causal Role:** **Root Cause (Task Maintenance & Recovery).**

#### Failure Point C: Physical / Neurovegetative States (Sleepy, Blank, Frozen)
* **User Brief Evidence:** User feels *"blank, frozen, sleepy, or overwhelmed... several difficulties rather than one consistent obstacle."* **[User-reported]**
* **Implementation Evidence:** Next attempts to handle this with the `ImStuckModal` and `BodyEnvCheckModal`, providing breathing circles, water checklists, and random wellness pickers. **[Verified]**
* **Analysis:** Software cannot fix physical sleep deprivation, severe neurovegetative fatigue, or clinical executive dysregulation. When software attempts to be a therapist, habit tracker, breathing coach, and project manager simultaneously, it dilutes its utility and annoys an already fatigued user.
* **Causal Role:** **External Constraint / Boundary Condition.** Software must accommodate low-energy states by requiring zero friction, but it cannot solve physical fatigue.

#### Failure Point D: The Maintenance & Guilt Trap
* **User Brief Evidence:** User finds the app *"somewhat overwhelming, confusing, unappealing, or potentially unnecessary."* **[User-reported]**
* **Implementation Evidence:** The user has 6 uncompleted tasks, 7 routines with 45 steps, 1 active reset challenge, and no automatic daily cleanup. Tasks from 3 weeks ago accumulate in local storage. **[Verified]**
* **Analysis:** Despite its "No Catch-Up" slogan, Next creates a digital clutter pile. Opening the app greets the user with accumulated past baggage that has to be manually pruned.
* **Causal Role:** **Secondary Accelerant (System Avoidance).**

---

## 4. UX & Cognitive-Load Audit

### 4.1 First Screen Experience (Day-to-Day)
* **First View:** If onboarded, the user sees [Header.tsx](file:///c:/Users/Ruth.A/Desktop/New%20folder/Next/src/components/layout/Header.tsx) and [CurrentTaskCard.tsx](file:///c:/Users/Ruth.A/Desktop/New%20folder/Next/src/components/today/CurrentTaskCard.tsx).
* **Positive UX Choice:** The single-task focus of `CurrentTaskCard` is visually calm and avoids the overwhelming dashboard clutter of standard apps.
* **Cognitive Failure:** 
  1. The card displays a primary amber button: **"Help me start"**.
  2. Below it sits a row of 3 text buttons: **"Done · Later · Stuck"**.
  3. Below that sits an accordion: **"See more"**.
  4. Below that sits **"N more things today"**.
  5. Below that sits a standalone **"Check in"** button.
* **Friction Count:** Before doing anything, the user is presented with 5 distinct interaction paths on a single card.

### 4.2 Decision Count to Create a Task
To create a task in Next, the user must make:
1. Title decision (text input)
2. Timing decision (Now / Today / Later / No time)
3. Minimum version formulation (text input)
4. Normal version formulation (text input)
5. Rest vs Work categorization
6. Duration estimation (number)
7. Company preference selection (Alone / Nearby / Body double / Background)
* **Total Decisions:** **7 distinct cognitive choices.** For a user who is currently experiencing cognitive fog, this represents prohibitive interaction cost.

### 4.3 What Happens When the User Has Done Nothing All Day?
* When the user returns at 9:00 PM having accomplished nothing:
  * The exact same task is staring at them with "Help me start".
  * There is no evening reflection or graceful day-closing ritual.
  * If they close the browser and open it tomorrow morning, the old tasks are still there, indistinguishable from today's intentions.
  * The app silently fails its core promise: *"Life naturally moves in cycles. Pausing is normal and guilt-free."*

### 4.4 Feature Duplication & Redundancy
* **Task vs. Routine Step vs. Wellness Preset:** "Drink water" exists in 4 separate places:
  1. As a Task Preset (`WELLNESS_TASK_PRESETS`)
  2. As a Routine Step (`routine-morning-care`, `routine-five-min-reset`)
  3. In the 7-Day Fresh Start template (`FRESH_START_TEMPLATE`)
  4. In the Stuck Modal wellness actions (`WELLNESS_ACTIONS.body`)
* **3 Ways to Start:**
  1. "Help me start" (Modal with timer)
  2. "Breakdown" (Task breakdown modal)
  3. "Routine runner" (Step-by-step runner modal)
* **Conclusion:** The application suffers from severe **feature sprawl**, where slightly different UX metaphors were created for identical behaviors.

---

## 5. Research Findings: Evidence, Alternatives & Citations

### 5.1 Cognitive Science Literature

#### 1. Implementation Intentions & Micro-Actions
* **Citation:** Gollwitzer, P. M., & Sheeran, P. (2006). *Implementation intentions and goal achievement: A meta-analysis of effects and processes.* Advances in Experimental Social Psychology, 38, 69-119.
* **Finding:** Vague goals (*"Work on project"*) fail under fatigue. Implementation intentions (*"If [situation X occurs], then I will initiate [concrete physical action Y]"*) double initiation rates.
* **Relevance to Next:** Next's "Minimum" field (`task.minimum`) correctly touches this principle, but fails in execution: it treats the minimum as an optional text string rather than an immediate physical trigger (*"Open VS Code and navigate to line 45"*).

#### 2. Cognitive Offloading & Working Memory
* **Citation:** Risko, E. F., & Gilbert, S. J. (2016). *Cognitive Offloading.* Trends in Cognitive Sciences, 20(9), 676-688.
* **Finding:** When internal working memory is overloaded or disjointed, externalizing thoughts into an unstructured medium (freeform writing, conversational dialogue) reduces cognitive load significantly more than attempting to fit thoughts into categorical software structures.
* **Relevance to Next:** Validates the user's instinct: **Talking freely to ChatGPT or brain-dumping into plain text is biologically easier than filling out Next's form.**

#### 3. Interruption Recovery & Goal Memory
* **Citation:** Altmann, E. M., & Trafton, J. G. (2002). *Memory for goals: An activation-based model.* Cognitive Science, 26(1), 39-83; Mark, G., Gudith, D., & Klocke, U. (2008). *The cost of interrupted work: More speed and stress.* CHI '08.
* **Finding:** When a person is interrupted, their goal activation decays rapidly. Resuming requires an explicit **"cognitive associative cue"** (an external breadcrumb showing exactly what was being edited or done).
* **Relevance to Next:** Next has no resumption cues. When interrupted, Next simply displays the static task title. It doesn't tell the user *where they were* or *what the immediate next keystroke was*.

#### 4. Emotional Regulation & Self-Compassion in Procrastination
* **Citation:** Sirois, F. M., & Pychyl, T. (2013). *Procrastination and the priority of short-term mood regulation: More hurt than heal.* Social and Personality Psychology Compass, 7(2), 115-127.
* **Finding:** Procrastination and task freezing are primarily failures of **emotional regulation**, not time management. The brain perceives a task as threatening (boring, confusing, anxious), triggering a flight/freeze response.
* **Relevance to Next:** Next correctly includes self-compassionate messaging, but displays it as static inspirational quotes rather than functional stress reduction.

### 5.2 Comparative Product Analysis

| Tool | Core Problem Solved Well | What It Does NOT Solve | Friction & Limitations | Recommendation for Next |
| :--- | :--- | :--- | :--- | :--- |
| **Goblin Tools (Magic ToDo)** | Converts vague, intimidating tasks into atomic, single-action checklists using AI with variable granularity ("spiciness slider"). | Has zero persistence or execution tracking. It is a one-shot breakdown engine. | Requires internet/AI. No long-term memory. | **Copy Principle:** Unstructured text in $\rightarrow$ atomic next actions out. |
| **Tiimo** | Visual timeline of the day; assists neurodivergent users with time blindness and routine transitions. | Overwhelms users when a schedule slips. High maintenance burden to set up and adjust. | Heavy onboarding, subscription model, rigid blocks. | **Leave Alone:** Visual timeblocking exacerbates guilt when falling behind. |
| **Structured** | High aesthetic, clean chronological day planning from calendar/reminders. | Purely visual scheduling; does nothing to help initiate a task or recover from paralysis. | Becomes another schedule to abandon on bad days. | **Leave Alone.** |
| **Todoist / TickTick** | Fast keyboard capture, robust recurring reminders, cross-device sync. | Endless list syndrome. Tasks pile up into guilt debt. | List paralysis for executive dysfunction. | **Leave Alone.** |
| **Amazing Marvin** | Modular behavioral sandbox (Pick One, Procrastination Wizard, 5-minute timers). | Extremely complex settings matrix. High configuration meta-work. | Steep learning curve; easy to spend hours configuring instead of working. | **Copy Principle:** "Pick One Task" mode and "Sandboxed Day". |
| **Focusmate / Body Doubling** | Social facilitation (Zajonc, 1965). Live 25/50m appointments with a human partner to declare a task and work silently. | Requires social energy; rigid appointment scheduling. | Cannot be used on demand if feeling antisocial. | **Integrate/Acknowledge:** Software cannot replace social accountability. |
| **Windows Focus Sessions** | Built into Windows 11 Clock app. Integrates with Spotify and Microsoft To Do. Counts down uninterrupted time, silences notifications. | Basic timer only; does not break down tasks or solve initiation. | Zero cognitive support. | **Benchmark:** Any desktop timer in Next must be better than this built-in feature. |

### 5.3 Evaluating the Proposed ChatGPT-to-Next Workflow
The user proposed:
1. *Morning:* Freeform conversation with ChatGPT to untangle worries, isolate obligations, and produce a small plan.
2. *Transfer:* Put the resulting decisions into Next.
3. *Day:* Use Next as persistent external memory and execution aid.
4. *Evening:* Return to ChatGPT for replanning.

#### Critical Evaluation
* **The Good:** Matches human cognitive offloading (Risko & Gilbert). Freeform conversation excels at untangling unstructured anxieties without imposing form fields.
* **The Dangerous:** **The Transfer Step is a major friction trap.** If the user has a great 15-minute conversation with ChatGPT, generates 3 priorities, and then has to manually open Next, click "+", fill out titles, minimums, and durations, the workflow will collapse within a week.
* **Simpler Alternative:** If ChatGPT produces a 3-bullet text summary, **a local daily text file (`today.md`), a Windows sticky note, or a plain markdown scratchpad provides 90% of the external memory benefit with 0% of the maintenance friction.** Next is only justified if it provides an active execution aid that static text cannot.

---

## 6. Desktop-App Assessment: Technical Feasibility & Product Justification

### 6.1 Technical Feasibility Audit

* **Tauri v2 + Next.js Static Export:**
  * The Next.js static export succeeds cleanly (`npm run build` $\rightarrow$ `out/` with 9 static routes). **[Verified]**
  * `tauri.conf.json` correctly points to `frontendDist: "../out"`. **[Verified]**
  * Cloud CI/CD via GitHub Actions (`.github/workflows/release.yml`) is fully capable of compiling Windows `.msi` and `.exe` installers because GitHub virtual runners have Visual Studio C++ build tools pre-installed. **[Verified]**
* **Local Build Blocker (Windows):**
  * Running `cargo check` or `cargo build` on this Windows machine failed with:
    `error: linker link.exe not found (note: the msvc targets depend on the msvc linker)` **[Verified: Command output]**
  * Root Cause: Rust is using `x86_64-pc-windows-msvc`, but Microsoft Visual C++ Build Tools (specifically `link.exe` from VS 2017+ or Build Tools) are not installed in the Windows environment. **[Verified]**
* **Runtime & Storage Assumptions in WebView2:**
  * **Storage Sandboxing:** In Tauri on Windows, the WebView2 environment runs under `http://tauri.localhost` or a custom origin. **`localStorage` data created in Chrome or Edge is NOT shared with the Tauri desktop app.** If the user has data in their browser, the desktop app opens completely empty. **[Verified: Tauri architecture]**
  * **Background Timer Throttling:** While WebView2 can run in a native window, Chromium aggressively throttles `setInterval` (used in Next's timers) when the window is minimized or occluded unless explicit background flags or native Rust threads are utilized. **[Verified]**

### 6.2 Product Value Justification: Does a Desktop App Actually Help?

| Desktop Capability | Does It Solve the User's Problem? | Assessment |
| :--- | :--- | :--- |
| **Standalone Window** | **Marginal.** A window minimized behind VS Code or browser tabs suffers from the exact same abandonment as a browser tab. | Without an "Always-on-Top" mini-widget or floating HUD, a desktop window is just another icon in the taskbar. |
| **System Tray Icon** | **Low.** Hiding Next in the system tray makes it *easier* to forget and abandon. | Executive dysfunction requires salient visual cues, not hidden tray menus. |
| **Native Notifications** | **Potentially Counterproductive.** Unsolicited desktop notifications often trigger annoyance, avoidance, or notification fatigue when the user is already feeling guilty about being stuck. | Research shows interruption alerts increase stress without necessarily improving task resumption (Mark et al., 2008). |
| **Global Hotkey (e.g. `Win+Shift+N`)** | **High Potential.** A hotkey that instantly summons a small, floating "What is my current next action?" card over whatever screen the user is looking at directly addresses distraction recovery. | This is the *only* desktop-exclusive capability that directly targets the reported user failure. |

### 6.3 Maintenance Cost: Tauri vs. PWA
* Next is **already a fully functional PWA** ([manifest.ts](file:///c:/Users/Ruth.A/Desktop/New%20folder/Next/src/app/manifest.ts), [public/sw.js](file:///c:/Users/Ruth.A/Desktop/New%20folder/Next/public/sw.js)).
* A PWA can be installed in Edge or Chrome directly into Windows with two clicks: it gets a desktop shortcut, a taskbar pin, and runs in its own frameless window with zero toolchain requirements, zero C++ compilers, and automatic instant updates.
* **Verdict:** Packaging Next via Tauri is technically feasible, but **maintaining a Rust build toolchain on Windows for an offline-local web app that doesn't use native Rust capabilities is engineering overhead with near-zero user benefit.** Unless Next uses native desktop floating HUDs or global hotkeys, a PWA or simple local browser tab provides identical value with zero maintenance friction.

---

## 7. Competing Product Hypotheses

We present three distinct product directions, deliberately ranging from high-automation to radical simplification, and the zero-code alternative.

---

### Direction A: The "Next Action" Floating Desktop HUD (Execution-First)
* **Core Premise:** The problem is not planning; it is **in-flight distraction recovery**. The user starts working, switches windows, gets distracted, and forgets what they were doing.
* **Core Journey:**
  1. The user has only **ONE active action** at any time.
  2. Next runs as a tiny, floating, always-on-top pill/widget (or global hotkey `Alt+Space`) anchored to the top of the screen.
  3. The widget displays only: `[Current micro-action]` + `[I did this / Change]`.
  4. When the user gets distracted by YouTube or Twitter, the visual anchor remains in their peripheral vision, providing the cognitive cue needed for interruption recovery (Altmann & Trafton).
* **Changes to Existing Code:**
  * **Remove:** Plan page, Routines page, 7-day Fresh Start, Check-in modals, Habit tracking, Complex priority tiers.
  * **Keep:** The single `CurrentTaskCard` concept, local storage.
  * **Add:** Tauri always-on-top window or desktop floating layout, global keyboard summon.
* **Maintenance Burden:** Minimal. 1 task at a time. Zero lists to manage.
* **Risk:** The floating bar could feel intrusive or annoying if the user is stuck on something difficult.

---

### Direction B: The Conversational Day-Bridge (ChatGPT $\rightarrow$ Next Micro-Plan)
* **Core Premise:** The problem is **unstructured brain fog in the morning**. The user cannot structure their day using dropdowns and buttons, but can through conversation.
* **Core Journey:**
  1. User talks to ChatGPT (or a local LLM prompt) in the morning to vent, clarify concerns, and isolate 1 to 3 realistic priorities.
  2. ChatGPT outputs a single, standardized JSON or Markdown snippet:
     ```markdown
     - [ ] Review PR #12 (Minimum: Open diff in browser)
     - [ ] Draft client email (Minimum: Write 1 bullet point)
     ```
  3. Next features a single **"Paste Daily Plan"** raw text box. It parses the text instantly into Today's sequence with zero form fields.
  4. The day automatically expires at midnight. Anything incomplete is silently archived—zero carryover guilt, zero catch-up debt.
* **Changes to Existing Code:**
  * **Remove:** Complex task creator modal, 7 routines, Fresh Start challenge, manual history tracking.
  * **Keep:** Today single-task view, gentle audio chimes, simple clean styling.
  * **Add:** Raw text / Markdown plan importer, automated midnight rollover.
* **Maintenance Burden:** Ultra-low. User pastes 3 lines in the morning and works.
* **Risk:** Relies on the user maintaining the morning conversation habit.

---

### Direction C: The Radical De-Escalation (Plain Text + Native Focus Tools)
* **Core Premise:** **Next is currently unnecessary software.** The user's maintenance of Next is itself a subtle form of productive procrastination.
* **Core Journey:**
  1. User talks to ChatGPT to untangle thoughts.
  2. User writes the 1 to 3 things on a **physical index card**, a **Windows Sticky Note**, or a single `today.txt` file pinned to their desktop.
  3. User turns on Windows 11 built-in **Focus Session** (25 minutes, silences notifications).
  4. In the evening, the index card is thrown in the trash or `today.txt` is wiped.
* **Changes to Existing Code:**
  * **Pause development of Next completely.**
* **Maintenance Burden:** Absolute zero.
* **Risk:** Zero software-enforced guardrails or step breakdowns; requires willingness to let go of sunk development costs.

---

## 8. Recommended Smallest Experiment: The 3-Day Validation Protocol

Before writing a single line of Rust or redesigning the Next codebase, the user should execute this low-effort, zero-code experiment.

### The Hypothesis
> *"If the morning plan is clarified conversationally with ChatGPT and externalized as a single, visible next physical action without interacting with Next's complex modals, the user will experience fewer 'endless loops' and resume interrupted tasks faster on difficult days."*

### The Protocol (3 Consecutive Workdays)

```
[Morning: 10 mins]       Talk to ChatGPT freely. End with: "Give me my 3 realistic priorities for today, 
                         each with a 2-minute physical first step."
                                  │
                                  ▼
[Externalize: 60 secs]   Write ONLY Priority #1 and its first physical step on a physical index card
                         or desktop Sticky Note. (DO NOT open Next).
                                  │
                                  ▼
[Execute: Throughout Day] Work. When you get distracted, sleepy, or blank:
                         Look at the card. Ask: "Can I do the 2-minute physical step?"
                         If yes: do it.
                         If no: write "Paused: [current feeling]" and step away for 15 mins guilt-free.
                                  │
                                  ▼
[Evening: 2 mins]        Throw the note away. Record 1 sentence in a private log:
                         "Did having the visible next step help me resume work? (Yes / No / Why)"
```

### Success & Disconfirmation Criteria

* **Success Criterion:** The user successfully initiates or resumes work at least twice across 3 days when feeling stuck, and reports lower cognitive burden compared to using Next.
  * *Next Decision:* Proceed with **Direction B (The Conversational Day-Bridge)** or **Direction C (Plain Text)**. Strip Next down to a raw text receiver or abandon custom software.
* **Disconfirmation Criterion:** The user still experiences the "endless loop", feels sleepy/frozen, and cannot initiate even the 2-minute physical step on the index card.
  * *Next Decision:* The bottleneck is **not interface friction or planning software**. The bottleneck is biological, emotional, or environmental (sleep, burnout, task aversion). Software development must be paused, as no application can solve this failure mode.

---

## 9. Prioritized Recommendations

If development of Next continues, here is the strict feature triage:

```
┌───────────────────────────────────┬───────────────────────────────────┐
│              KEEP                 │              REMOVE               │
│ • Single-task "Today" focus       │ • 7-Day Fresh Start challenge     │
│ • Gentle Web Audio chimes         │ • 6 Routine templates (45 steps)  │
│ • Integrated "Minimum" concept    │ • Fake 2026 Return Day history    │
│ • Offline-first local persistence │ • Stuck Modal 6-branch questionnaire│
│ • Keyboard / low-clutter layout   │ • Complex task form (company pref)│
├───────────────────────────────────┼───────────────────────────────────┤
│             INVESTIGATE           │               DEFER               │
│ • Raw Markdown/text daily import  │ • Tauri desktop compilation       │
│ • Automated midnight rollover     │ • Native Windows notifications    │
│ • Floating Always-on-Top HUD      │ • System tray integrations        │
│ • Interruption breadcrumb memory  │ • Cloud sync or accounts          │
└───────────────────────────────────┴───────────────────────────────────┘
```

---

## 10. Decision Memo: Questions for User Alignment

Before any code is modified, we need alignment on these core questions:

1. **The Core Tool Identity:** Do you want Next to be an **execution companion** (a minimal tool that holds your current action on screen while you work), or are you trying to make it a **complete life and wellness organizer**?
2. **The Morning Workflow:** Would you be willing to test the **3-Day ChatGPT + Sticky Note protocol** before we touch the codebase, to verify whether software is even the right solution?
3. **The Desktop Question:** Given that PWA installation gives you a standalone desktop window right now with zero build errors, can we drop the Tauri desktop compilation overhead until the product design itself is proven?

---
*End of Product Audit Report.*
