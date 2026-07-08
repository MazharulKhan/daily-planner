# Daily Planner App — Build Plan

## Build Principles

- Build one small, testable phase at a time.
- Do not add backend, cloud, or authentication features during the local MVP.
- Review a plan before broad code changes.
- Test in the normal browser because the OpenChamber preview is currently unreliable.
- Run `npm run build` before committing a completed feature phase.
- Prefer regular CSS and existing React/Vite tooling over new packages.

---

## Phase 1 — Documentation and Setup

### Goal

Create a clear source of truth before app code is changed.

### Tasks

- Confirm the React/Vite scaffold works.
- Confirm `npm install` and `npm run dev` work.
- Keep source document and UI reference images in `docs/`.
- Complete:
  - `docs/project-spec.md`
  - `docs/dashboard-spec.md`
  - `docs/build-plan.md`
  - `docs/project-status.md`
- Create and review `AGENTS.md`.
- Make a Git checkpoint for project documentation.

### Done When

- Project requirements are written clearly.
- Dashboard-first scope is clear.
- Deferred features are explicitly listed.
- OpenCode has safe project instructions.
- The docs are committed.

---

## Phase 2 — Dashboard Foundation

### Goal

Replace the Vite starter screen with a working Daily Planner dashboard.

### Included

- Fixed sidebar shell with visual navigation placeholders
- Dashboard header
- Today’s Tasks card
- Upcoming Tasks card
- Quick Ideas card
- Daily Progress card
- Add task flow
- Complete/uncomplete task flow
- Add Quick Idea flow
- `localStorage` persistence
- Empty states
- Regular CSS styling close to the written dashboard specification

### Excluded

- Routing
- Full search
- Task detail pages
- Edit/delete task
- Full task metadata controls
- Idea editing/deletion/conversion
- Any backend or cloud feature

### Test Checklist

- Add a task.
- Complete a task.
- Reopen a completed task.
- Add a Quick Idea.
- Refresh the browser.
- Confirm tasks and ideas remain.
- Confirm Daily Progress changes correctly.
- Run `npm run build`.
- Run `npm run lint`.

### Done When

- Dashboard acceptance criteria in `docs/dashboard-spec.md` are met.
- The dashboard is manually tested in a normal browser.
- Build and lint checks are reviewed.
- Changes are committed.

---

## Phase 3 — Task Management Improvements

### Goal

Make task management more practical without expanding into learning/reading workflows yet.

### Status

Phase 3 is complete. It was delivered in two sub-phases:

- **Phase 3A — Core Task Management Improvements** (complete): inline task editing and deletion, optional priority/category/time/due-date controls, completed-task grouping with dividers, automatic sorting, overdue display, `updatedAt` timestamps, localStorage migration, and keyboard/focus accessibility.
- **Phase 3B — Task Organization** (complete): category filter chips in Today’s Tasks (session-only, never persisted), filtered counts/dividers/empty states, and priority-colored left markers on task rows in both Today and Upcoming.
- **Phase 3C** was considered as an optional dashboard-polish checkpoint and is not needed; Phase 3 is complete.

---

## Phase 4 — Task Detail Workflows and Task List Pages

### Goal

Add focused task workflows one at a time: quick idea capture, standard task
detail, dedicated list pages for Today, Upcoming, and Completed, then the
YouTube task foundation.

### Chosen Order

1. Phase 4A — Quick Ideas Management (complete)
2. Phase 4B — Standard Task Detail (complete)
3. Phase 4C — Task List Pages and Navigation (complete)
4. Phase 4D — YouTube Task Foundation (complete)
5. Phase 4E — YouTube Player and Resume Foundation (complete)
6. Phase 4F — Timestamped Notes (next candidate)
7. Phase 4G — Clickable Timestamp Notes / Rich Notes Decision (later candidate)

### Phase 4D — YouTube Task Foundation

Phase 4D added the task-type foundation, a dedicated YouTube Task Detail
workspace, local YouTube URL and notes fields, safe localStorage migration,
and Standard/YouTube task-type transition behavior.

Phase 4D did not add an embedded player or playback controls.

### Phase 4E — YouTube Player and Resume Foundation

Status: complete — implemented, build/lint passed, manually browser-verified.

The spec `docs/youtube-player-spec.md` is now a historical reference for the
completed Phase 4E work.

### Phase 4F — Timestamped Notes

Status: next candidate after Phase 4E; requires a focused spec and approval.

Candidate scope:

- Add Insert Timestamp.
- Read the current embedded player time.
- Insert a plain-text timestamp such as `[12:45]` at the current notes cursor
  position.
- Preserve timestamps inside `youtubeNotes`.
- Keep notes as plain text; do not add a rich-text editor yet.

### Phase 4G — Clickable Timestamp Notes / Rich Notes Decision

Status: later candidate after Phase 4F; requires a focused spec and approval.

Preferred first option:

- Keep the plain-text textarea editor.
- Add a separate rendered notes preview/reading view.
- Recognize valid timestamps in the preview and render them as clickable
  controls that seek the player.
- Prefer this no-package option first.

Alternative, only if later justified:

- Evaluate a richer editable notes editor with formatting toolbar, inline
  timestamp controls, and cursor-aware inserts.
- Do not hand-build a fragile rich-text editor.
- Do not add an editor package without separate explicit approval.
### Caution

Do not attempt all sub-phases in a single build request. Each needs its own
focused spec and approval.

---

## Phase 5 — Polish, Accessibility, and GitHub Preparation

### Goal

Improve quality and prepare a professional project handoff.

### Candidate Work

- Responsive improvements
- Accessibility review and fixes
- Better empty states and feedback messages
- Light/dark mode, only after core workflow is stable
- README update
- Screenshots for GitHub
- Final bug fixes
- GitHub push and deployment planning

### Deferred Beyond MVP

- User accounts
- Cloud synchronization
- Mobile-first redesign
- Calendar integration
- Reminders and notifications
- AI note summaries
- Recurring tasks
- File attachments
- Advanced filtering/search

---

## Recommended Git Checkpoints

```powershell
git add docs
git commit -m "docs: define daily planner scope and build plan"
```

```powershell
git add .
git commit -m "feat: build daily planner dashboard"
```

```powershell
git add .
git commit -m "feat: improve task management"
```

Use a separate, descriptive commit after each completed and tested phase.
