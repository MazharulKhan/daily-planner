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
- Current phase: Dashboard only (see `docs/dashboard-spec.md`).
- Plan first before making broad changes.
- List files before editing them.
- Follow `docs/build-plan.md` for implementation order.
- Do not skip ahead to deferred features listed in `docs/project-spec.md`.

## Data Approach

- Use `localStorage` only.
- Read saved data on initial load.
- Fall back to starter sample data only when no saved data exists.
- Write back to `localStorage` after every user change.

## Dashboard-First Rule

The first implementation phase covers only the dashboard described in
`docs/dashboard-spec.md`:

- Fixed sidebar shell with visual navigation placeholders
- Dashboard header
- Today's Tasks card
- Upcoming Tasks card
- Quick Ideas card
- Daily Progress card
- Add task, complete/uncomplete task
- Add Quick Idea
- localStorage persistence
- Empty states

Do not build routing, full pages, search behavior, task editing/deletion,
idea editing/deletion, learning workflows, or reading workflows in this phase.

## Requirements Source

Treat these files as the primary requirements:

- `docs/project-spec.md`
- `docs/dashboard-spec.md`
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
