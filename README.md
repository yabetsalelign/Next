# Next

> A personal system for getting unstuck, starting small, and moving forward without turning productivity into another source of pressure.

**Next** is a personal productivity and self-management app built around one question:

> **When everything feels like too much, what is the next thing I can actually do?**

Next is not designed to maximize streaks, tasks, hours, or productivity statistics. It is designed to help people start, continue, rest, and return without guilt.

Its guiding principles are simple: **the minimum counts, returning matters more than streaks, and there is no catch-up debt.**

---

## Why Next Exists

Traditional productivity systems can become another thing to manage. Next is built around the problems that can get in the way of acting:

- Knowing what needs to be done but not knowing where to start.
- Feeling overwhelmed by a large task.
- Having low-energy days.
- Getting distracted or stuck.
- Losing momentum after falling behind.
- Treating missed days as failures.
- Over-planning instead of actually starting.
- Needing flexibility rather than rigid schedules.

The goal is not to make every day perfect. The goal is to make **the next step easier**.

---

## Core Philosophy

### Start Small

Large tasks become more approachable when reduced to a step that can actually be started.

### The Minimum Counts

A minimum version of an activity is still a meaningful version. Doing a little is better than doing nothing because the original plan was too demanding.

### No Catch-Up Debt

Missing something does not create a debt that must be repaid. Next emphasizes returning to the present instead of punishing the past.

### No Rigid Clocks

The system supports real life rather than forcing every activity into an ideal schedule. A focus timer is available when the user explicitly starts a session; it should not start on its own.

### True Rest

Rest is not failure. Taking a day off is a valid choice, not a broken streak.

### Progress Without Pressure

Next avoids turning personal progress into a competition against previous versions of yourself. History is intended to help users reflect, not judge themselves.

---

## The Experience

The app uses a mobile-first layout with seven main destinations. The core navigation and shared interface are designed to work on both mobile and desktop.

### Today

The main landing screen answers:

> **What is the next thing I can actually do?**

Today prioritizes the current task or a clear next action. It includes low-friction ways to add a task, ask for help getting started, respond to feeling stuck, and take the day off. Its layout adapts to states such as an open day, a return after an absence, a rest day, and completing the planned tasks.

Empty screens should remain useful without inventing sample tasks, routines, achievements, or activity counts.

### Plan

Plan provides a flexible view of tasks without turning planning into another job. It distinguishes the explicitly selected **Now** task from the **Next** queue and completed items. The queue is not intended to become a rigid schedule, and creating or viewing a task must not silently make it the active focus task.

Energy-related guidance can help suggest a manageable next step, while task placement remains under the user's control.

### Focus Session

Focus Session provides an optional, explicit focus timer. The session lifecycle distinguishes idle, running, paused, and finished/stopped states. The timer should begin only after the user chooses to start it, and its state is shared with the rest of the app.

Changing an idle duration should not start a session. Changing a duration during an active session should not unexpectedly restart it. Completing a session should not create duplicate completion records, and stopping a session should not be mistaken for success.

### Routines

Routines are flexible anchor flows that can provide structure when structure is useful. Users can create and complete their own routines at their own pace.

A new installation should not be populated with fabricated or supposedly AI-generated routines simply to fill the screen. When no routines exist, the app should show an intentional empty state and offer a clear way to create one. Existing user-created routines and their history must be preserved.

### Check-in

Check-in supports lightweight reflection and a record of current energy. The Energy choices are **Low**, **Steady**, and **High**. Energy can influence the scale of a suggested next step or an optional focus duration—for example, a shorter suggestion on a low-energy day—without silently scheduling tasks or starting a timer.

Pace describes the user's preferred approach to the day. Its guidance is intended to make Today feel more or less directive; it should not force the user into a workload or prevent them from choosing a different task.

### History

History presents saved activity and reflection rather than a productivity scoreboard. Counts and timelines should be based on real stored records, not fabricated numbers. Returning after a pause matters; missed days are not treated as failures.

### Settings

Settings contains the app's theme, accent, and other preferences. Controls should reflect real settings and persist appropriately. User preferences and saved data must not be cleared as a workaround for a bug.

---

## Getting Unstuck

Sometimes the problem is not laziness. There may be too much to do, the first step may be unclear, energy may be low, attention may keep drifting, or starting may feel harder than the task itself.

Next includes low-friction support such as **Help Me Start** and **I'm Stuck** flows. These should reduce the problem to something actionable, not add a long questionnaire or another set of administrative chores. The minimum version of a task is a valid place to begin.

The core rhythm is:

**Start → Do → Done**

“Done for now” is meaningful. The user does not always need to finish everything.

---

## Energy, Pace, and Flexible Effort

Not every day has the same capacity. Next distinguishes current **Energy** from preferred **Pace**:

- **Energy** is a snapshot of current capacity: Low, Steady, or High. It can inform a suggested step or a short optional focus duration.
- **Pace** describes the style of guidance the user prefers—for example, more gentle and minimal guidance or a more focused presentation of the current task.

These are suggestions, not rules. Changing them must not silently create tasks, change task status, reorder the plan, or start/restart a focus session.

The broader **Minimum · Normal · Extra** idea remains the product philosophy:

- **Minimum:** Do enough to keep moving.
- **Normal:** Do the intended version of the activity.
- **Extra:** Do more if there is genuine capacity.

Doing extra is optional, not a higher moral score.

---

## Reflection and Returning

Next supports lightweight reflection through prompts such as:

- What helped?
- What made starting easier?
- What got in the way?
- What patterns keep appearing?

Return detection can help the app respond after an absence without treating the gap as failure. “Welcome Back,” “A normal day,” and Fresh Start flows must preserve user tasks, routines, journals, settings, and history. They must not clear all local storage or duplicate tasks and return records.

Backups are validated before restoration, and data changes should be handled safely where the implementation supports rollback. The goal is to learn what works, not produce impressive charts.

---

## Visual Identity and Design System

Next uses a quiet, warm visual system intended to feel approachable and readable rather than clinical, gamified, or overly decorated.

### Themes

- **Quiet Focus (Dark):** charcoal/midnight surfaces, approximately `#121218` / `#181820`, with warm amber accents and readable off-white text.
- **Warm Oat (Light):** warm cream/oat surfaces, espresso text, and restrained amber highlights. The current shared light background direction is around `#F8F6F1`.
- **Accents:** Warm Amber (`#E08E45` in the established palette) and Gentle Mint.

Exact shades are defined by the shared design tokens and may evolve as accessibility and contrast are refined. Do not introduce scattered hardcoded colors when a shared semantic variable exists.

Theme modes are **System**, **Light**, and **Dark**. System is the intended default for a fresh installation or a genuinely missing legacy preference. In System mode, Next should follow the device's light/dark preference, including changes while the app is open. Explicit Light and Dark preferences should remain fixed when the device theme changes. The theme initializer is designed to apply the effective theme before the first screen is painted, including onboarding.

Accent selection must not inadvertently reset the theme. The app should remain readable across both themes and both accents.

### Typography

**Plus Jakarta Sans** is the chosen typeface for the Quiet Focus and Warm Oat design system. It is bundled locally as a variable WOFF2 font through `next/font/local`, with system fallbacks. The application should not need to download fonts from Google at runtime, which supports offline use and avoids relying on network availability for typography. The font's OFL license is included with the assets.

### Pip Branding

**Pip** is the app's mascot/brand mark. Its artwork is used across existing brand placements such as the app header, navigation/sidebar, onboarding, browser/PWA icons, Android launcher assets, and splash artwork. Keep the asset family consistent and ensure the icon remains recognizable at small sizes and within Android adaptive-icon safe zones.

The visual direction favors strong hierarchy, readable type, purposeful surfaces, and clear touch targets. Avoid excessive nested cards, unnecessary gradients, fake AI branding/content, punitive streaks, and decorative animations that distract from the next action.

---

## Technology

Next is a web application with a mobile-first experience, packaged for Android with Capacitor.

### Stack

- **Next.js 14.2.35** — App Router and static production export.
- **React** and **TypeScript**.
- **Tailwind CSS** and shared CSS design tokens.
- **Lucide** icons and reusable UI components.
- **Capacitor** — Android application wrapper and asset synchronization.
- **PWA** support — manifest and installable web assets.
- **Local persistence** — app state stored locally in the browser/WebView.
- **Plus Jakarta Sans** — bundled variable WOFF2 font.

The app is designed to work locally without requiring an account or runtime font download. App data is stored on the user's device; keep that data safe during migrations, testing, and UI changes.

---

## Project Structure

```text
Next/
├── android/                         # Capacitor Android project
├── public/                          # Brand, PWA, font and static assets
│   ├── icon-light.svg
│   ├── icon-dark.svg
│   └── ...                          # PNG, maskable, Apple and splash assets
├── scripts/
│   ├── verify-fixes.mjs             # Functional/data-safety verification suite
│   ├── visual-inspect.mjs           # Local Chrome-based visual inspection
│   └── generate_icons.py            # Icon asset generation
├── src/
│   ├── app/
│   │   ├── page.tsx                 # Today
│   │   ├── plan/page.tsx            # Plan
│   │   ├── focus-session/page.tsx   # Focus Session
│   │   ├── routines/page.tsx        # Routines
│   │   ├── check-in/page.tsx        # Check-in and reflection
│   │   ├── history/page.tsx         # Saved activity and returns
│   │   ├── settings/page.tsx        # Preferences
│   │   ├── layout.tsx               # Root layout and pre-paint initialization
│   │   └── manifest.ts              # Web app manifest
│   ├── components/
│   │   ├── layout/                  # Shared header and navigation
│   │   ├── modals/                  # Task, routine, reflection and help flows
│   │   └── today/                   # Today-specific cards and onboarding
│   └── lib/
│       └── store.tsx                # App state, local persistence and session logic
├── capacitor.config.ts              # Capacitor configuration
├── next.config.mjs                  # Next.js configuration/static export
├── tailwind.config.ts               # Tailwind configuration
├── package.json                     # Dependencies and scripts
└── README.md
```

Generated output such as `.next/`, `out/`, `node_modules/`, and TypeScript build information should not be committed. Local visual inspection artifacts under `.visual-inspections/` are generated outputs rather than application source; review the repository's ignore rules before deciding whether to commit any screenshots.

---

## Running Locally

Use a recent Node.js LTS release compatible with the project's dependencies.

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open the local URL printed by Next.js, usually `http://localhost:3000`.

### Functional Verification

Run the existing regression and data-safety suite:

```bash
node scripts/verify-fixes.mjs
```

Check TypeScript:

```bash
npx tsc --noEmit
```

Check the current diff for whitespace errors:

```bash
git diff --check
```

Create the production build/static export:

```bash
npm run build
```

Run these checks after changes to state management, onboarding, task placement, focus sessions, local persistence, or shared UI behavior. A successful build proves compilation; it does not by itself prove every interaction works on a phone.

---

## Visual UI Inspection

The project includes `scripts/visual-inspect.mjs` and an `inspect` package script for local screenshot-based inspection when the installed Chrome and local debugging setup are available. This was added because the native Codex browser integration in VS Code was not available in the development environment.

With the development server running in one terminal, run the inspection script in a second terminal:

```bash
npm run inspect
```

The script uses the locally installed Chrome through the Chrome DevTools Protocol and an isolated temporary browser profile. Its intent is to avoid modifying the normal browser profile and its saved Next `localStorage` data. It can capture rendered screenshots, inspect headings and controls, navigate app routes, inspect console errors, and exercise a safe UI control.

Reported artifacts are saved under:

```text
.visual-inspections/
├── screenshots/
└── inspection-report.json
```

These files are generated when the script runs; their presence and results depend on the latest run. The inspection workflow has reported successful checks for the seven main routes, desktop and mobile-sized viewports, console errors, and a manual Dark-theme toggle. Onboarding's complete fresh-install flow and actual Android behavior still require separate verification.

**Security note:** Keep Chrome DevTools remote debugging local to the development machine. Do not expose a debugging port to the public internet or an untrusted network. Review generated screenshots and reports before sharing them, since screenshots can contain personal data.

---

## Android Build

The `android/` directory contains the Capacitor Android wrapper. The web app is the source of the UI; the production export must be synchronized into Android before packaging.

From the project root in PowerShell, build and sync the app:

```powershell
$ErrorActionPreference = "Stop"

npm run build
if ($LASTEXITCODE -ne 0) { throw "Production build failed. Stop here." }

npx cap sync android
if ($LASTEXITCODE -ne 0) { throw "Capacitor sync failed. Stop here." }
```

Then build the debug APK:

```powershell
Push-Location android
try {
    .\gradlew.bat --no-daemon clean assembleDebug
    if ($LASTEXITCODE -ne 0) { throw "Android APK build failed." }
}
finally {
    Pop-Location
}
```

The generated APK is normally located at:

```text
android/app/build/outputs/apk/debug/app-debug.apk
```

To copy it to the project root and Desktop:

```powershell
$apk = "android\app\build\outputs\apk\debug\app-debug.apk"
if (-not (Test-Path $apk)) { throw "APK was not generated." }

Copy-Item $apk "Next-debug.apk" -Force
Copy-Item $apk "C:\Users\Ruth.A\Desktop\Next-debug.apk" -Force

Get-Item $apk, "Next-debug.apk", "C:\Users\Ruth.A\Desktop\Next-debug.apk" |
    Select-Object FullName, Length, LastWriteTime

Get-FileHash $apk, "Next-debug.apk", "C:\Users\Ruth.A\Desktop\Next-debug.apk" -Algorithm SHA256
```

Matching SHA-256 hashes indicate that the copies are byte-for-byte identical. The root and Desktop copies are generated artifacts; build a fresh APK after the latest source changes rather than assuming a previously copied APK includes them.

Gradle may print deprecation or `flatDir` warnings even when a build succeeds. Check the final exit code and `BUILD SUCCESSFUL` result. If `npm run build` or `npx cap sync android` fails, stop rather than proceeding with potentially stale web assets.

### On-device checks

After installing a new APK, test at least:

1. First launch in both device Light and Dark modes, including onboarding.
2. System theme changes while System is selected, and explicit Light/Dark preferences.
3. Plus Jakarta Sans and Pip branding on the actual device.
4. Task creation and agreement between Today and Plan.
5. Focus Session start, pause, resume, close, and completion behavior.
6. Routines, day-off behavior, empty states, and data preservation.

Use Android's normal app-update flow when possible. Do not uninstall or clear app data just to force onboarding to reappear when the user's saved data matters. Use an isolated test setup for fresh-install testing.

---

## Verification Status and Known Limits

The latest reported automated checks passed:

- `node scripts/verify-fixes.mjs`
- `npx tsc --noEmit`
- `npm run build`
- Theme-initialization smoke checks for System Light/Dark, explicit Light/Dark, Mint accent, and malformed saved settings.
- Local Chrome-based inspection of the seven main routes, mobile and desktop viewports, a manual Dark-theme toggle, and reported zero console errors during that run.
- A production APK build and Capacitor asset synchronization have also succeeded in recent runs.

These checks are snapshots of specific runs, not a guarantee that every future revision is free of regressions. The following should still be verified against the exact APK being used:

- The entire first-launch onboarding journey in a genuinely clean test profile, including Skip and completion.
- Automatic device theme selection from the very first Android screen, plus live system theme changes in the Capacitor WebView.
- Typography, icon masks, splash screen, touch targets, and visual behavior on a physical Android device.
- Any interaction not explicitly covered by the functional suite or visual-inspection script.

Some development environments may not have ADB hardware access or an available browser-control integration. Report those limitations rather than treating code inspection or HTTP 200 responses as proof of visual or device-level correctness.

---

## Project Status

Next is an evolving personal project. Its core experience, themes, typography, Pip branding, local persistence, Android packaging workflow, functional regression suite, and local visual-inspection tooling are in place. The focus now is on validating the real experience and fixing specific problems found during use—not adding complexity for its own sake.

The priorities remain:

**Useful > complicated**  
**Personal > generic**  
**Action > administration**  
**Consistency > perfection**  
**Returning > streaks**

---

## A Note About This Project

Next isn't intended to be another productivity app that says someone failed because they did not complete enough tasks.

It exists because sometimes the hardest part isn't knowing what to do. It's **starting**.

And when starting feels impossible, the answer doesn't have to be “Do everything.”

Sometimes the answer is simply:

> **What's next?**
