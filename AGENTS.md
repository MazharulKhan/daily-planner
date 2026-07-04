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
- Current phase: No active implementation phase. Phase 3B — Task Organization
  is complete (see `docs/task-organization-spec.md`).
- Phase 2 (Dashboard Foundation), Phase 3A (Core Task Management Improvements),
  and Phase 3B (Task Organization) are all complete.
- The next candidate is Phase 4A — Quick Ideas Management, pending a focused
  spec and explicit approval. Do not begin Phase 4A implementation without a
  new approved spec and plan.
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

## Phase 3B Rule

Phase 3B is complete. It was a small dashboard task-organization refinement
only, as defined in `docs/task-organization-spec.md`:

- Add category filter chips (`All`, `Work`, `Learning`, `Personal`, `Health`)
  to the Today's Tasks card header. The filter is session-only React state,
  never saved to localStorage.
- Add a priority-colored 3px left border to task rows in Today's Tasks and
  Upcoming Tasks.

Do not build routing, full pages, search behavior, saved/persistent filters,
multi-select, bulk actions, drag-and-drop, sort controls, category
management, idea editing/deletion, learning workflows, or reading workflows
in this phase. Do not modify the Quick Ideas card beyond what Phase 2
already does. Do not weaken or redesign any Phase 3A behavior.

## Requirements Source

Treat these files as the primary requirements:

- `docs/project-spec.md`
- `docs/dashboard-spec.md`
- `docs/task-management-spec.md` (Phase 3A, complete)
- `docs/task-organization-spec.md` (Phase 3B, complete)
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
