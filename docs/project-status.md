# Daily Planner App — Current Status

## Current Phase

Phase 3A — Core Task Management Improvements, complete.

## Current State

Phase 2 (Dashboard Foundation) is complete and committed (`ba662c0`).
Phase 3A is now complete and implements everything in
`docs/task-management-spec.md`:

- Inline editing of a task's title, priority, category, time, and due date
  from the dashboard (no modal, no new page).
- Inline delete with confirmation; delete is final (no undo in this phase).
- Optional priority, category, time, and due date controls in the add-task
  flow, collapsed behind a "More options" toggle.
- `updatedAt` set on create, edit, complete, and uncomplete.
- Completed-task grouping beneath a `Completed · N` divider in both Today's
  Tasks and Upcoming Tasks; completed future-dated tasks stay visible and
  reopenable in Upcoming.
- `Any time` label in the reserved time column for tasks with `time: null`.
- Automatic display sorting: overdue (oldest first) → today (time ascending)
  → null due date, with `time: null` after timed tasks within each group.
  Upcoming sorted by nearest due date then time ascending.
- Overdue task display: `Overdue · N` divider above the overdue group; each
  overdue row shows `Overdue · MMM D` or `Overdue · MMM D · HH:MM` in the
  right-side metadata area with a restrained danger color.
- Daily Progress calculated only from Today's Tasks (active + completed),
  excludes Upcoming entirely, updates immediately after every change.
- localStorage migration on load: normalizes/validates priority, category,
  time, dueDate, completed, id, title, and updatedAt; leaves ideas untouched.
- Accessibility: keyboard-reachable Edit/Delete with visible focus and
  accessible labels; Edit focuses the title input; Delete confirmation
  focuses Cancel; focus restored to the triggering control after save/cancel.
- React, JavaScript, regular CSS, and localStorage only. No new packages,
  no routing, no new pages, no backend, no Quick Ideas changes.

## Next Exact Step

Connect the local repository to GitHub
(`https://github.com/MazharulKhan/daily-planner.git`) and push. Then begin
Phase 3B or Phase 4 planning per `docs/build-plan.md` — propose a plan only,
no code changes, until approved.

## Known Issues

- OpenChamber's built-in browser preview is still unreliable; visual testing
  must be done in a normal browser at the Vite localhost URL.
- No other known functional issues remain. The following are intentional
  scope limits, not bugs: routing, full pages, global search, filtering/
  grouping controls, idea edit/delete/conversion, custom category management,
  learning/reading workflows, responsive/mobile redesign, and dark mode.

## How to Run the App

Open a terminal inside the project root and run:

```powershell
npm run dev
```

Open the localhost URL shown by Vite in a normal browser. It is usually:

```text
http://localhost:5173/
```

Keep the terminal running while testing. Stop it later with `Ctrl + C`.

## Current Documentation Structure

```text
docs/
├── source/
├── ui-reference/
├── project-spec.md
├── dashboard-spec.md
├── task-management-spec.md
├── build-plan.md
└── project-status.md
```

## Current Constraints

- Use React, JavaScript, Vite, and regular CSS.
- Use `localStorage` for saved app data.
- Keep the app frontend-only.
- Build one phase at a time.
- Start with the dashboard only.
- Use written Markdown specifications as the main requirements for GLM 5.2.
- Do not put API keys or secrets in project files.
- Do not add Firebase, authentication, backend APIs, a database, external
  APIs, or extra packages without explicit approval.

## Session History

### 2026-07-02 — Phase 3A Implementation Complete

- Implemented all approved Phase 3A work from `docs/task-management-spec.md`.
- Files changed (new): `src/data/migrate.js`, `src/components/TaskEditForm.jsx`,
  `src/components/TaskDeleteConfirm.jsx`, `docs/task-management-spec.md`.
- Files changed (modified): `src/utils/dateTime.js` (local-date `todayISO`,
  `isTodayOrPast`, `isOverdue`, `formatShortDate`, `sortTodayTasks`,
  `sortUpcomingTasks`), `src/data/sampleData.js` (sample-1 `dueDate`→`null`,
  `updatedAt` on all samples), `src/hooks/useLocalStorage.js` (migrate on load,
  `editTask`, `deleteTask`, `updatedAt` on add/toggle), `src/components/TaskRow.jsx`
  (Edit/Delete affordances, `Any time` label, overdue metadata), `src/components/AddTaskForm.jsx`
  (More options + metadata controls), `src/components/Dashboard.jsx` (lifted
  `activeTaskAction`, `isTodayOrPast` derivation), `src/components/TodayTasksCard.jsx`
  (completed grouping, overdue divider, inline edit/delete), `src/components/UpcomingTasksCard.jsx`
  (completed grouping, inline edit/delete, sort), `src/App.jsx` (wired
  `editTask`/`deleteTask`), `src/styles/task-row.css` (actions, dividers, overdue,
  edit/delete styles), `AGENTS.md` (Phase 3A active), `docs/project-status.md`.
- Features delivered: inline edit (title/priority/category/time/due date),
  inline delete with confirmation, optional metadata controls in add flow,
  completed-task grouping in Today and Upcoming, `Any time` label for null-time
  tasks, automatic date/time sorting, overdue task display with divider and
  per-row overdue label, Daily Progress from Today's Tasks only, localStorage
  migration with validation, full keyboard/focus accessibility.
- User-confirmed normal browser testing: the user manually tested the app in a
  normal browser at the Vite localhost URL and confirmed Phase 3A functionality
  including the `Any time` alignment fix, task ordering fix, and overdue display.
  (OpenCode did not perform browser testing.)
- `npm run build` result: succeeded — `vite v8.1.2`, 44 modules transformed,
  `dist/index.html` 0.46 kB, `dist/assets/index-*.css` ~19.15 kB,
  `dist/assets/index-*.js` ~216.93 kB, built in ~226ms.
- `npm run lint` result: passed clean — `eslint .` with no errors or warnings.
- Real limitations still remaining: OpenChamber preview unreliable; deferred
  items unbuilt by design (routing, full pages, search, filtering, idea edits,
  custom categories, learning/reading, dark mode).
- Next best step: connect to GitHub and push, then begin Phase 3B/4 planning.

### 2026-07-02 — Phase 3A Spec and Phase Activation

- Created `docs/task-management-spec.md` (Phase 3A — Core Task Management
  Improvements) covering: edit task, delete with inline confirmation,
  optional metadata controls, completed-task grouping in Today and Upcoming,
  localStorage migration and persistence, Daily Progress rules, focus
  behavior, accessibility rules, empty states, acceptance criteria, and a
  manual test checklist.
- Added a date-comparison rule to the spec: compare `dueDate` as local
  calendar `YYYY-MM-DD` strings; never convert through UTC in a way that
  shifts a task into the previous or next day.
- Updated `AGENTS.md`: set the active phase to Phase 3A, added
  `task-management-spec.md` to the requirements source, replaced the
  Dashboard-First Rule with a Phase 3A Rule, and noted Phase 2 is complete.
- Updated this file: Current Phase → Phase 3A, summarized the Phase 3A
  scope, reset the Next Exact Step to propose a plan only, refreshed Known
  Issues, and added `task-management-spec.md` to the docs structure.
- No application code, dependencies, Git history, or other documentation
  files were changed.
- Next best step: propose a Phase 3A implementation plan only (no code)
  based on `docs/task-management-spec.md` and wait for user approval.

### 2026-07-02 — Phase 2 Dashboard Implementation

- `AGENTS.md` was created in the previous session and was used as the project
  rule set for this phase.
- Dashboard implementation was completed, replacing the Vite starter screen.
- Files changed in the dashboard commit (`ba662c0`, `feat: build daily planner
  dashboard`), 29 files / +1802 / -203:
  - `index.html` — page title set to `Daily Planner`.
  - `src/App.jsx` — rewritten to compose the sidebar + header + dashboard
    shell and wire the task/idea add flows.
  - `src/index.css` — rewritten as global resets importing the theme tokens.
  - `src/styles/` — added `variables.css`, `layout.css`, `sidebar.css`,
    `header.css`, `dashboard.css`, `cards.css`, `task-row.css`, `ideas.css`,
    `progress.css`, `empty-state.css`.
  - `src/components/` — added `Sidebar.jsx`, `Header.jsx`, `Dashboard.jsx`,
    `TodayTasksCard.jsx`, `UpcomingTasksCard.jsx`, `QuickIdeasCard.jsx`,
    `DailyProgressCard.jsx`, `TaskRow.jsx`, `IdeaRow.jsx`, `AddTaskForm.jsx`,
    `AddIdeaForm.jsx`, `EmptyState.jsx`.
  - `src/data/` — added `storage.js` (localStorage read/write helpers) and
    `sampleData.js` (starter tasks and ideas, seeded only when no saved
    data exists).
  - `src/hooks/useLocalStorage.js` — added `useTasks` and `useIdeas` hooks
    for state + persistence.
  - `src/utils/dateTime.js` — added date/time helpers (today check, upcoming
    check, due-date and relative-time formatting, greeting, id generator).
- Features delivered: fixed sidebar with placeholders + active Dashboard;
  dashboard header with greeting and visual search; 2x2 card grid; add task
  (shared flow from sidebar/header/card); complete/uncomplete task; add quick
  idea; circular Daily Progress that auto-updates; empty states; localStorage
  persistence on load and after every change.
- User-confirmed normal browser testing: the user manually tested the app in a
  normal browser at the Vite localhost URL and confirmed the dashboard looks
  exactly as intended. (OpenCode did not perform browser testing.)
- `npm run build` result: succeeded — `vite v8.1.2`, 41 modules transformed,
  output `dist/index.html` 0.46 kB, `dist/assets/index-Cu7j4XKX.css` 13.86 kB
  (gzip 2.88 kB), `dist/assets/index-CWZYJX-2.js` 206.34 kB (gzip 64.04 kB),
  built in 217ms.
- `npm run lint` result: passed clean — `eslint .` completed with no errors
  or warnings.
- Real limitations still remaining:
  - OpenChamber's built-in preview remains unreliable; testing must use a
    normal browser.
  - Deferred Phase 1 items are still unbuilt by design: routing, full pages,
    global search, task edit/delete, idea edit/delete/conversion, full
    metadata editing, learning/reading workflows, dark mode.
- Next best step: commit this `docs/project-status.md` update, then request a
  Phase 3 (Task Management Improvements) plan from OpenCode — plan only, no
  code changes until the plan is approved.

### 2026-07-02 — Documentation and AGENTS.md

- React + Vite project scaffold is working.
- `npm install` completed successfully.
- `npm run dev` works in a normal browser.
- OpenCode, OpenRouter, and OpenChamber are connected.
- Created the `docs` folder structure.
- Added the original Daily Planner source document and UI reference images.
- Created the project planning files:
  - `project-spec.md`
  - `dashboard-spec.md`
  - `build-plan.md`
  - `project-status.md`
- `AGENTS.md` was proposed, reviewed, and created at the project root.
- Documentation and `AGENTS.md` were committed (`f694a76`,
  `docs: define daily planner scope and build plan`).

### Known Issues (carried forward)

- Use the normal browser for testing at the localhost URL shown by
  `npm run dev`.
- Do not rely on OpenChamber's built-in preview for now.
