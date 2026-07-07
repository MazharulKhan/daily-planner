# AGENTS.md

This file gives OpenCode the project rules for the Daily Planner app.
Follow these instructions for every change.

## Project Overview

Daily Planner is a desktop-first personal planner built with React, JavaScript,
Vite, and regular CSS. The current project remains local, frontend-only, and
stored in browser `localStorage`.

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
- Phase 2 (Dashboard Foundation), Phase 3A (Core Task Management
  Improvements), Phase 3B (Task Organization), Phase 4A (Quick Ideas
  Management), Phase 4B (Standard Task Detail), and Phase 4C (Task List
  Pages and Navigation) are all complete.
- Phase 4D — YouTube Task Foundation is approved and active.
- Plan first before making broad changes.
- List files before editing them.
- Follow `docs/build-plan.md` for implementation order.
- Do not skip ahead to deferred features listed in `docs/project-spec.md`.
- Implementation must follow `docs/youtube-task-foundation-spec.md`.
- Do not build deferred player/timestamp features during Phase 4D.

## Current Active Phase

Phase 4D — YouTube Task Foundation is approved and active.
Phase 4C — Task List Pages and Navigation is complete.

Phase 4D must be implemented from `docs/youtube-task-foundation-spec.md`.

## Phase 4D Product Model

- `taskType` controls workflow: `standard` or `youtube`.
- `category` remains independent organizational metadata: `Work`,
  `Learning`, `Personal`, or `Health`.
- Category must never choose the detail workspace.
- Existing saved tasks migrate to `taskType: 'standard'`, including tasks
  currently categorized as `Learning`.
- Phase 4D includes the YouTube URL and notes foundation only.
- Do not build embedded playback, YouTube Player API integration, playback
  position tracking, resume behavior, timestamp insertion, clickable
  timestamps/seeking, rich text, Reading Tasks, or YouTube/Learning sidebar
  destinations in this phase.

## Data Approach

- Use `localStorage` only.
- Read saved data on initial load.
- Fall back to starter sample data only when no saved data exists.
- Write back to `localStorage` after every user change.

## Token-Efficient Context Use

Use the smallest amount of repository context that still allows safe, correct work.

- Always read `AGENTS.md`, `docs/project-status.md`, and the active approved feature spec before planning or implementing a medium or large change.
- For a small, tightly scoped fix, read only the relevant component/style files plus any document directly governing that behavior.
- Do not reread files already reviewed in the current session unless they may have changed or exact wording is needed.
- Do not load unrelated historical specs, broad source documents, or UI references unless they are relevant to the current task.
- Use targeted search, file paths, and focused diffs before reading whole files or the full repository.
- Prefer `git status` and `git diff --stat` first. Inspect full diffs only for changed files relevant to the task.
- Keep plans and progress updates concise. Do not repeat large file contents in chat unless necessary.
- For a new feature, start with plan-only work. After approval, implement using the approved spec and only the files relevant to that feature.
- Do not reduce required verification: browser testing, `npm run build`, and `npm run lint` still apply before declaring a phase complete.

## Completed Phase Reference

Phases 2, 3A, 3B, 4A, 4B, and 4C are complete. Their specifications are historical references; completed behavior must not be accidentally broken by later changes.

When a current approved feature spec or `docs/project-status.md` decision conflicts with older broad source material (`docs/source/`) or UI reference images, the current approved spec and project status take precedence.

## Requirements Source

Treat these files as the primary requirements:

- `docs/project-spec.md`
- `docs/dashboard-spec.md`
- `docs/task-management-spec.md` (Phase 3A, complete)
- `docs/task-organization-spec.md` (Phase 3B, complete)
- `docs/quick-ideas-management-spec.md` (Phase 4A, complete)
- `docs/standard-task-detail-spec.md` (Phase 4B, complete)
- `docs/task-list-pages-spec.md` (Phase 4C, complete)
- `docs/youtube-task-foundation-spec.md` (Phase 4D, active)
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
