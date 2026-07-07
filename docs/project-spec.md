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
Detail), and 4C (Task List Pages and Navigation) are complete.

The app remains frontend-only, with all data stored in browser `localStorage`.

Phase 4D — YouTube Task Foundation is complete.

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
- Completed local YouTube URL and plain-text notes support for YouTube Tasks

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
plain-text notes, and an external Open video link. There is no standalone
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

The following are future planned work beyond the completed Phase 4D scope.
See `docs/build-plan.md` for the detailed Phase 4E/4F/4G roadmap.

- Global search behavior
- Category management
- Quick Idea task conversion
- YouTube embedding, Player API integration, playback position tracking,
  resume behavior, timestamp insertion, clickable timestamps, and rich notes
- Reading Tasks and Reading workflows
- Dark mode
- Firebase
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
