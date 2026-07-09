# Daily Planner App — Project Specification

## Project Goal

Build a clean, desktop-first personal planner that combines daily task
management, quick idea capture, and focused YouTube-learning workflows in one
local application.

The app should feel like a lightweight daily command center: easy to scan, fast to update, and intentionally less complex than a full project-management tool.

## Target User

The initial user is a single person planning daily work, personal tasks, and learning. The first version is local-only and does not need accounts, collaboration, or cloud sync.

## Current Build Scope

Phases 2 (Dashboard Foundation), 3A (Core Task Management Improvements),
3B (Task Organization), 4A (Quick Ideas Management), 4B (Standard Task
Detail), 4C (Task List Pages and Navigation), 4D (YouTube Task
Foundation), 4E (YouTube Player and Resume Foundation), 4F (Timestamped
Notes), and 4G (Clickable Timestamp Notes) are complete.

The app remains frontend-only, with all data stored in browser `localStorage`.

Phase 5 — Polish, Accessibility, and GitHub Preparation is the next
planned phase but has no active spec yet.

## Current Technology

- React
- JavaScript
- Vite
- Regular CSS
- ESLint
- Browser `localStorage`

## Product Direction

The broader product is a desktop-first productivity and learning planner with:

- Compact daily task management
- Today and Upcoming task views
- Quick Ideas kept separate from tasks
- Lightweight categories, priorities, dates, and completion status
- Standard Tasks and YouTube Tasks as task-type workflows
- Completed YouTube Task workflow with embedded player, playback position
  tracking, resume, timestamp insertion, clickable timestamp notes
  preview, and plain-text bullet-continuation notes

Task workflow is controlled by `taskType`:

- `standard`
- `youtube`

Categories remain independent organizational labels:

- `Work`
- `Learning`
- `Personal`
- `Health`

A Standard Task can use the Learning category. A YouTube Task can use the
Learning, Personal, Work, or Health category. Category must never choose the
detail workspace.

The completed YouTube workflow supports task type, YouTube URL storage,
embedded player with playback position tracking, resume behavior, Insert
Timestamp control, clickable timestamp notes preview with seek-and-play,
and plain-text notes with bullet continuation. There is no standalone
Learning, YouTube, Reading, or Categories sidebar destination in the active
roadmap.

The visual direction is clean and card-based:

- Light page background with white or soft-gray surfaces
- Blue primary accent for active states and main actions
- Rounded cards with subtle borders
- Compact task rows
- Clear hierarchy through spacing rather than heavy decoration
- Persistent left navigation for a predictable desktop experience

## Current Data Approach

Use `localStorage` only.

Store:

- Tasks
- Task completion state
- Task metadata needed for display, such as task type, priority, category,
  time, and due date
- Quick Ideas
- Any simple app state that must remain after refresh

Use starter sample data only when there is no saved local data yet.

## Current Build Constraints

- Use React, JavaScript, Vite, and regular CSS.
- Keep the app frontend-only.
- Build one phase at a time.
- Do not install packages unless there is a clear, explained, approved need.
- Use written Markdown specs as the main requirements source.
- Treat UI screenshots as visual comparison material, not the sole source of requirements.

## Deferred Features

The following are future planned work beyond the completed Phase 4 work.
See `docs/build-plan.md` for the detailed roadmap and
`docs/phase-5-ux-backlog.md` for the Phase 5 UX backlog / planning notes.

- Rich-text notes / formatting toolbar (future improvement; not approved;
  not scheduled. Do not hand-build a fragile rich-text editor and do not
  add an editor package without explicit approval.)
- Global search behavior
- Category management
- Quick Idea task conversion
- Reading Tasks and Reading workflows
- Dark mode
- Firebase (Phase 6 future planned phase; not scheduled. Will start fresh
  with a clean Firestore data model. No localStorage-to-Firestore
  migration required. Existing localStorage data remains as local MVP.
  No Firebase implementation, packages, auth, or config until an approved
  Phase 6 spec exists.)
- Authentication
- Backend APIs
- Cloud database or sync
- Calendar integration
- Notifications
- Recurring tasks
- External APIs
- Payments
- AI features in the user-facing app

## Source Material

- Broad product source: `docs/source/daily-planner-mvp-source.md`
- Original reference document: `docs/source/`
- UI screenshots: `docs/ui-reference/`
- Active dashboard requirements: `docs/dashboard-spec.md`
- Implementation order: `docs/build-plan.md`
- Current technical handoff: `docs/project-status.md`
