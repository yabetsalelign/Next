# Next

> A personal system for getting unstuck, starting small, and moving forward without turning productivity into another source of pressure.

**Next** is a personal productivity and self-management app built around a simple idea:

**When everything feels like too much, what is the next thing I can actually do?**

This isn't designed to maximize streaks, tasks, hours, or productivity statistics. It's designed to help me start, continue, rest, and return without guilt.

---

## Why Next Exists

Traditional productivity systems can become another thing to manage.

Next was built around the problems that actually get in the way:

- Knowing what needs to be done but not knowing where to start
- Feeling overwhelmed by a large task
- Having low-energy days
- Getting distracted or stuck
- Losing momentum after falling behind
- Treating missed days as failures
- Over-planning instead of actually starting
- Needing flexibility rather than rigid schedules

The goal is not to make every day perfect.

The goal is to make **the next step easier**.

---

## Core Philosophy

### Start Small

Large tasks can become manageable when reduced to something that can actually be started.

### Minimum Counts

A minimum version of something is still a successful version.

Doing less is better than doing nothing because the plan was too demanding.

### No Catch-Up

Missing something does not create a debt that has to be repaid.

Next is designed around returning to the present rather than punishing the past.

### No Rigid Clocks

The system should support real life rather than forcing everything into an ideal schedule.

### True Rest

Rest is not failure.

Stopping when necessary is part of the system.

### Progress Without Pressure

Next avoids turning personal progress into a competition against previous versions of yourself.

---

## The Experience

Next is organized around a few core areas:

### Home

The main command center.

Instead of asking:

> "How productive have I been?"

Home focuses on:

> **"What do I need to do right now?"**

The goal is to make starting obvious.

### Plan

A place to understand what is coming without turning planning into a second job.

### Routines

Flexible sequences that provide structure when structure is useful.

### History

A way to look back, understand what happened, and return—not a scoreboard.

### Settings

Personal preferences and configuration without unnecessary complexity.

---

## When I'm Stuck

One of the most important parts of Next is acknowledging that sometimes the problem isn't laziness.

Sometimes:

- There is too much to do.
- The first step isn't clear.
- Energy is low.
- Something is being avoided.
- Attention keeps drifting.
- Starting feels harder than the task itself.

Instead of simply showing another list of tasks, Next is intended to help identify **what kind of stuck** is happening and reduce the problem to something actionable.

---

## Minimum · Normal · Extra

Not every day has the same capacity.

Next uses flexible levels rather than assuming that every planned task must be completed at full intensity.

**Minimum**

> Do enough to keep moving.

**Normal**

> The intended version of the activity.

**Extra**

> More, if there is actually capacity for it.

This allows progress without requiring every day to be a high-performance day.

---

## The Start → Do → Done Rhythm

Next intentionally keeps the core interaction simple:

**Start → Do → Done**

The application should make the next action clear, reduce friction around beginning, and provide a satisfying stopping point.

"Done for now" is meaningful.

You don't always need to finish everything.

---

## Personal Reflection

Next also includes lightweight reflection around questions such as:

- What helped?
- What made starting easier?
- What got in the way?
- What patterns keep appearing?

The purpose is not to produce impressive productivity charts.

The purpose is to gradually learn **what actually works for me**.

---

## Technology

Next is currently built as a web application with a mobile-first experience.

### Stack

- **Next.js**
- **TypeScript**
- **React**
- **Tailwind CSS**
- **Capacitor** for the Android application
- **PWA** support
- **Local persistence** for personal app data

The project also contains the Android/Capacitor project used to package the application for Android.

---

## Project Structure

```text
Next/
├── android/                 # Capacitor Android project
├── public/                  # Icons, PWA assets and static files
├── src/                     # Application source
├── capacitor.config.ts      # Capacitor configuration
├── next.config.mjs          # Next.js configuration
├── package.json             # Dependencies and scripts
└── README.md                # Project documentation
```

Generated build output such as `.next/`, `out/`, and TypeScript build information is intentionally excluded from version control.

---

## Running Locally

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Then open the local development URL shown by Next.js.

For a production build:

```bash
npm run build
```

---

## Android

The project includes a Capacitor Android application.

The Android project lives inside:

```text
android/
```

The web application remains the primary source of the experience, while Capacitor provides the native Android wrapper.

---

## Project Status

Next is an evolving personal project.

The foundation and core experience are already built, and the project is being refined based on actual personal use rather than trying to predict every possible productivity use case.

The priority is:

**Useful > complicated**

**Personal > generic**

**Action > administration**

**Consistency > perfection**

---

## A Note About This Project

Next isn't intended to be another productivity app that tells me I failed because I didn't complete enough tasks.

It exists because sometimes the hardest part isn't knowing what to do.

It's **starting**.

And when starting feels impossible, the answer doesn't need to be:

> "Do everything."

Sometimes the answer is simply:

> **What's next?**
