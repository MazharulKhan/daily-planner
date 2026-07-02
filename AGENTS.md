# AGENTS.md

This file gives OpenCode the project rules for the Daily Planner app.
Follow these instructions for every change.

## Project Overview

Daily Planner is a desktop-first personal planner built with React, JavaScript,
Vite, and regular CSS. The first build phase is dashboard-only and frontend-only.

The main requirements source is the written Markdown specifications in `docs/`,
not UI screenshots alone. Screenshots are visual comparison material only.

## Required Technology

- React
- JavaScript (no TypeScript)
- Vite
- Regular CSS only (no Tailwind, styled-components, CSS modules frameworks, or UI kits)
- ESLint
- Browser `localStorage` for all saved data

## Hard Constraints

Do NOT use any of the following without explicit approval:

- Firebase
- Authentication
- Backend APIs
- Cloud database or sync
- External APIs
- Extra npm packages
- TypeScript
- Routing libraries (no react-router unless explicitly approved)
- API keys or secrets in project files

The app must stay frontend-only for now.

## Build Process

- Build one phase at a time.
- Current phase: Phase 3A — Core Task Management Improvements (see `docs/task-management-spec.md`).
- Phase 2 (Dashboard Foundation) is complete. Phase 3A extends the dashboard
  with task editing, deletion, optional metadata controls, completed-task
  grouping, and localStorage migration — all still inside the dashboard,
  with no routing or new pages.
- Plan first before making broad changes.
- List files before editing them.
- Follow `docs/build-plan.md` for implementation order.
- Do not skip ahead to deferred features listed in `docs/project-spec.md`.
- Do not treat a later phase as active unless the user explicitly approves it and `docs/project-status.md` is updated.

## Data Approach

- Use `localStorage` only.
- Read saved data on initial load.
- Fall back to starter sample data only when no saved data exists.
- Write back to `localStorage` after every user change.

## Phase 3A Rule

Phase 3A is dashboard-based task management only, as defined in
`docs/task-management-spec.md`:

- Edit an existing task's title, priority, category, time, and due date from
  the dashboard.
- Delete a task with inline confirmation.
- Add optional priority, category, due date, and time controls to the
  add-task and edit-task flows.
- Group completed tasks beneath a `Completed` divider in Today's Tasks and
  Upcoming Tasks.
- Migrate and persist all task data through `localStorage`.
- Improve related task empty states and accessibility behavior.

Do not build routing, full pages, search behavior, idea editing/deletion,
custom category management, learning workflows, or reading workflows in this
phase. Do not modify the Quick Ideas card beyond what Phase 2 already does.

## Requirements Source

Treat these files as the primary requirements:

- `docs/project-spec.md`
- `docs/dashboard-spec.md`
- `docs/task-management-spec.md` (Phase 3A active spec)
- `docs/build-plan.md`
- `docs/project-status.md`
- `docs/source/daily-planner-mvp-source.md`

UI reference images in `docs/ui-reference/` are visual comparison only.

## Verification

Before declaring a phase complete:

- Run `npm run build` and confirm it succeeds.
- Run `npm run lint` and address any issues.
- Manually test in a normal browser at the Vite localhost URL.
- Do not rely on OpenChamber's built-in preview; it is currently unreliable.

## Git

- Do not commit unless the user explicitly asks.
- Stage only intended files.
- Never commit secrets or API keys.
- Use descriptive commit messages matching existing repo style.
