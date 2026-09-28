# OJ-X | Elite Offline Coding Judge Platform

> A modern, zero-latency, 100% offline competitive programming judge platform built with React, Tailwind CSS, and Framer Motion.

---

## 🚀 What Has Been Built

### 1. Design System & Aesthetics
- **Modern Sleek Dark Mode**: Built upon an intentional layered palette consisting of deep slate-950 (`#090d16`), panels (`#0e1422`), surface cards (`#141c2e`), and crisp borders (`#23304c`).
- **Harmonious Accent Palette**:
  - Primary accents in Indigo-600 (`#6366f1`) with soft indigo glow shadows (`shadow-glow-indigo`).
  - Emerald-500 (`#10b981`) for Accepted verdicts, live status indicators, and success badges.
  - Amber-400 (`#f59e0b`) for Time Limit Exceeded (TLE) warnings, contest timers, and Blitz drills.
  - Rose-500 (`#ef4444`) for Wrong Answer / Runtime Errors.
- **Strict 8px Layout Grid**: Adheres strictly to an 8px spatial rhythm (`p-2`, `p-4`, `p-6`, `p-8`, `gap-4`, `gap-6`, `gap-8`) creating natural optical balance.
- **Modern Typography**: High-contrast layout using Google Fonts (**Inter** for clean UI hierarchy and **JetBrains Mono** for the code editor and technical telemetry).
- **Smooth Micro-Interactions**: Framer Motion page transitions, card hover transforms (`hover:-translate-y-1`), pulsing offline radar badges, and celebratory confetti upon Accepted submissions.

---

### 2. Global Shell & Navigation
- **Header Navigation Bar**:
  - Prominent **OJ-X** brand logo with an animated glowing hexagon icon on the top-left.
  - Horizontal desktop navigation links (**Home**, **Contest**, **Workout**, **Problems**) with active tab indicators and hover transitions.
  - **100% Offline Ready** radar status badge confirming local execution with zero internet required.
  - Dynamic **Problems Solved Counter** (persisted in offline storage).
- **System Footer**:
  - Displays sandbox security architecture, storage sync status, and engine telemetry.

---

### 3. Home Page (Central Hub)
- **Hero Dashboard**:
  - High-impact headline and subtext explaining the offline judge platform capabilities.
  - Live engine telemetry cards: `< 2ms` Judge Latency, Solved Problems Tracker, Active Contests, and 100% Local Sandbox status.
  - One-click launch buttons directly into Problems, Workout, or Contests.
- **Core Module Cards**:
  - Interactive feature cards for **Contest Arena**, **Workout Sprints**, and **Problem Archive** with Framer Motion hover lift.
- **Daily Featured Problem Spotlight**:
  - Highlights a featured daily algorithm with difficulty, tags, acceptance rate, and direct "Solve Now" or "Solve in Workout" launchers.
- **Local Sandbox Architecture Spec**:
  - Details on scoped function execution, 2000ms TLE timeout interception, and HTML5 storage persistence.
- **Recent Submissions Feed**:
  - Live table displaying recent offline submissions, verdicts, runtimes, memory usage, and timestamps.

---

### 4. Contest Page (Synchronized Offline Arena)
- **Join Contest via Code**:
  - Instant passcode verification input supporting pre-loaded codes (e.g., `OJX-7892`, `CAMPUS-2026`, `SPEED-ALGO-4`) or custom created codes.
- **Create Contest Modal**:
  - Configurable contest title, custom duration (30m, 60m, 90m, 120m), automatic unique room code generator (e.g., `LOCAL-7821`), and problem set selector.
- **Contest Directory & Status Tabs**:
  - Filter contests by **All**, **Live**, and **Upcoming**.
  - Contest cards showing status badges, one-click code copy, duration, problem count, and enrollment stats.
- **Live Contest Arena View**:
  - Sticky top header featuring real-time countdown clock and problem navigation tabs (Problem A, Problem B, Problem C...).
  - Embedded split-screen code editor & problem solver directly inside the contest arena.
  - **Live Standings / Leaderboard**: Simulated real-time competitors with ICPC penalty metrics (+/- attempts, solve timestamps, and total scores) updated dynamically whenever the user submits an Accepted solution.

---

### 5. Workout Page (Timed Sprint Drills)
- **Workout Configuration**:
  - **Duration Presets**:
    - ⚡ **5 Mins (Blitz)**: Ultra-fast sprint for quick syntax and basic reflexes.
    - 🚀 **15 Mins (Rapid)**: Standard technical phone screen simulation.
    - 🎯 **30 Mins (Standard)**: Medium/Hard algorithmic optimization drills.
    - 🛡️ **45 Mins (Endurance)**: Full-scale on-site mock interview simulation.
  - **Target Difficulty**: Filter drills by *All*, *Easy*, *Medium*, or *Hard*.
  - **Topic Category**: Focus on *Arrays & Hashing*, *Dynamic Programming*, *Stack*, *Sliding Window*, or *Two Pointers*.
- **Active Workout Arena**:
  - Sticky top HUD featuring a high-contrast digital countdown clock (`MM:SS`) with circular progress bar.
  - Color-shifting warning pulses (amber when under 3 minutes, flashing rose when under 60 seconds).
  - Ability to pause/resume or forfeit the workout.
  - Integrated split-screen code editor and automated test case runner.
- **Workout Verdict Modals**:
  - **Victory Modal**: Triggered on Accepted solution with celebratory confetti, time elapsed, and efficiency stats.
  - **Time Expired Modal**: Displays helpful encouragement and options to retry or review the problem in untimed mode.

---

### 6. Problems Page (Untimed Practice Archive)
- **Problem Filtering & Search**:
  - Search bar matching problem title, slug, or keywords.
  - Difficulty filter dropdown: *All*, *Easy*, *Medium*, *Hard*.
  - Status filter dropdown: *All*, *Solved*, *Todo*.
  - Interactive topic tag chips (*Array*, *Hash Table*, *Stack*, *Dynamic Programming*, *Sliding Window*, *Two Pointers*).
- **Problems Archive Table**:
  - Displays solved status icon, problem title, difficulty pill, category, topic tags, acceptance percentage, and quick "Solve" button.
- **Split-Screen Problem Solver**:
  - **Left Panel**:
    - **Description Tab**: Rich markdown problem statements, formatted examples with copyable inputs/outputs, and detailed constraints.
    - **History Tab**: Problem-specific submission history showing previous verdicts and runtimes.
  - **Right Panel (Interactive Code Editor)**:
    - Multi-language dropdown (**JavaScript**, **Python 3**, **C++ 20**).
    - Monospaced code editor with line numbers and `Tab` indentation handling.
    - Reset starter template and Copy code buttons.
    - Sample test case tabs (Case 1, Case 2, Case 3) showing inputs and expected outputs.
    - **Custom Test Input Tab** for ad-hoc parameter testing.
    - Detailed Verdict card showing Expected vs Actual diffs, runtime in milliseconds, memory consumption in MB, and console log outputs.
    - Fullscreen celebration confetti upon solving.

---

### 7. Client-Side Offline Judge Engine
- **Sandboxed Execution**: Pure client-side JavaScript execution using scoped runners with isolated contexts and wrapped `console.log` interception.
- **Infinite Loop / TLE Protection**: Race-conditioned timeout threshold (`2000ms`) to detect and report Time Limit Exceeded errors without freezing the UI thread.
- **Deep Output Equality**: Recursive comparison supporting nested arrays, primitive values, and unordered associative mappings.
- **Realistic Python / C++ Simulation**: Syntactic structure validation and heuristic test case runner for multi-language flexibility offline.
- **HTML5 LocalStorage Persistence**: Solved status, past submissions, and custom contests persist across browser reloads without external databases.

---

## 🛠️ Technology Stack

| Technology | Purpose |
| :--- | :--- |
| **React 18/19** | Component architecture and state management |
| **TypeScript** | Type-safe models, interfaces, and problem definitions |
| **Tailwind CSS v3** | Strict 8px utility design system with custom dark theme tokens |
| **Framer Motion** | Smooth layout animations and page transitions |
| **Lucide React** | Consistent, modern developer iconography |
| **Canvas Confetti** | Dynamic celebratory particle effects for Accepted verdicts |
| **Vite** | Sub-second HMR development server and optimized production bundler |

---

## 💻 Getting Started Locally

```bash
# 1. Install dependencies
npm install

# 2. Run the Vite development server
npm run dev

# 3. Open in your browser
http://localhost:5173
```
