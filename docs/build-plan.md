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
6. Phase 4F — Timestamped Notes (complete)
7. Phase 4G — Clickable Timestamp Notes (complete)

### Phase 4D — YouTube Task Foundation

Phase 4D added the task-type foundation, a dedicated YouTube Task Detail
workspace, local YouTube URL and notes fields, safe localStorage migration,
and Standard/YouTube task-type transition behavior.

### Phase 4E — YouTube Player and Resume Foundation

Status: complete — implemented, build/lint passed, manually browser-verified.

The spec `docs/youtube-player-spec.md` is now a historical reference for the
completed Phase 4E work.

### Phase 4F — Timestamped Notes

Status: complete — implemented, build/lint passed, manually browser-verified.

The spec `docs/timestamped-notes-spec.md` is now a historical reference for
the completed Phase 4F work.

Phase 4F added an Insert Timestamp control to the YouTube Task Detail
notes card. It reads the current embedded player time and inserts a
bracketed plain-text token (e.g. `[12:45] `) starting on its own line,
with one trailing space, at the notes textarea cursor. `youtubeNotes`
remains plain text; no rich-text, clickable timestamps, notes preview,
parsing, or styling was added.

### Phase 4G — Clickable Timestamp Notes

Status: complete — implemented, build/lint passed, manually browser-verified.

The spec `docs/clickable-timestamp-notes-spec.md` is now a historical
reference for the completed Phase 4G work.

Phase 4G added a read-only rendered notes preview below the YouTube Notes
textarea. Valid bracketed timestamps (`[0:15]`, `[12:45]`, `[1:02:15]`)
render as clickable blue pill chips that seek-and-play the embedded player.
The preview is collapsible (local state, default expanded, 240px max-height
internal scroll). Additional polish includes Markdown-style bullet
continuation in the textarea and a refined Insert Timestamp default
position (end of notes when textarea is unfocused). Notes remain plain
text; no rich-text editor or formatting toolbar was added.

### Phase 4H — Rich Notes Editor / Formatting Toolbar Decision

Status: future improvement; no spec yet. Not scheduled. Not approved.

May evaluate Markdown-style formatting, a formatting toolbar, inline
timestamp controls, or a proper editor package. Do not hand-build a
fragile rich-text editor. Do not add an editor package without separate
explicit approval. Phase 4H is not an active candidate and has no spec.

### Caution

Do not attempt all sub-phases in a single build request. Each needs its own
focused spec and approval.

---

## Phase 5 — Polish, Accessibility, and GitHub Preparation

### Status

Phase 5A — Global Task Creation Flow, Phase 5B — Current Workspace
Persistance, Phase 5C — Completed Task Display Refinement, Phase 5D —
Quick Idea Notes Capture Refinement, and Phase 5E — Responsive,
Accessibility, and Visual Polish Pass are complete.
Phase 5F — Dark Mode Preference has a drafted spec
(`docs/phase-5f-dark-mode-preference-spec.md`) pending review and
approval. Phase 5G — README, Screenshots, and Portfolio Handoff is
a planning-only future sub-phase. See `docs/phase-5-ux-backlog.md` for
the full UX backlog and planning notes.

### Proposed Sub-Phases

Phase 5A, Phase 5B, Phase 5C, Phase 5D, and Phase 5E are complete. Phase 5F
has a drafted spec pending review. Phase 5G is planning only. Each requires
its own focused spec and approval before coding.

#### Phase 5A — Global Task Creation Flow

Status: complete — implemented, build/lint passed, manually browser-verified.

The spec `docs/phase-5a-global-task-creation-spec.md` is now a historical
reference for the completed Phase 5A work.

Phase 5A replaced the inline/shared Add Task form with a single centered
Add Task modal that opens from the Sidebar, Header, and inline "+ Add a
task" triggers (Dashboard/Today). One live create surface; the user stays
on the current workspace after saving. Task creation defaults: Today +
Any time + Medium + Work + Standard. The modal supports Standard and
YouTube task types, reuses the existing `validateYouTubeUrl` validation,
and includes a dirty-state discard confirmation. The Sidebar "+ Add
Task" button is visually disabled while a task detail is open.

#### Phase 5B — Persist Current Workspace After Refresh

Status: complete — implemented, build/lint passed, manually browser-verified.

The spec `docs/phase-5b-current-workspace-persistence-spec.md` is now a
historical reference for the completed Phase 5B work.

- Persist last stable normal workspace only: Dashboard, Today, Upcoming,
  Completed, Quick Ideas.
- Do not restore Standard Task Detail or YouTube Task Detail after
  refresh.
- Use a small preference key such as `dp.activeView`.
- No router.

#### Phase 5C — Completed Task Display Refinement

Status: complete — implemented, build/lint passed, manually browser-verified.

The spec `docs/phase-5c-completed-task-display-refinement-spec.md` is now a
historical reference for the completed Phase 5C work.

Phase 5C reduced completed-task clutter in the Dashboard Today's Tasks card
and Today page Completed Today group. Each affected completed group now shows
the first 3 completed tasks by default, keeps the full completed count visible,
and provides `Show X more` / `Show less` controls when there are more than 3
completed tasks. Active tasks are never hidden. The Completed page remains the
full, uncollapsed completion history.

#### Phase 5D — Quick Idea Notes Capture Refinement

Status: complete — implemented, build/lint passed, manually browser-verified.

The spec `docs/phase-5d-quick-idea-notes-capture-refinement-spec.md` is now a
historical reference for the completed Phase 5D work.

Phase 5D made notes directly editable in the expanded Quick Idea view, added
explicit Save notes (not auto-save), a transient "Notes saved at [time]"
confirmation, Discard changes that reverts without collapsing, a pencil icon
for inline title editing separate from notes, a trash icon for deleting from
any row state with confirmation, cursor-at-end on notes reopen, and
dirty-notes protection across all destructive actions.

#### Phase 5E — Responsive, Accessibility, and Visual Polish Pass

Status: complete — implemented, build/lint passed, manually browser-verified.

The spec `docs/phase-5e-responsive-accessibility-visual-polish-spec.md` is
now a historical reference for the completed Phase 5E work.

Phase 5E delivered:

- **Responsive/layout polish:** Dashboard content pulled closer to sidebar;
  reduced excessive spacing across app shell, main content, card grid, and
  page layouts. Two-column desktop layout preserved; stacks cleanly at
  laptop/narrow widths without horizontal overflow.
- **Sidebar polish:** Inline SVG nav icons for Dashboard, Today, Upcoming,
  Completed, and Quick Ideas. Add Task button moved near the top under the
  brand. Disabled state preserved on task detail views.
- **Header polish:** Personalized Dashboard greeting with a visual-only
  date chip (weekday + month/day + calendar icon). Header search remains
  visual-only. Header Add Task hidden on detail views.
- **Dashboard/card density polish:** Standardized card headers, counts,
  dividers, badges, empty states, and spacing across Dashboard, task
  pages, and Quick Ideas. Task rows remain compact and readable.
- **Add Task modal visual polish:** Metadata field icons, improved spacing
  and alignment. Defaults box preserved near the bottom above the footer.
  Modal scrolls internally on short viewports; metadata stacks to one
  column at narrow widths. Dirty-state discard confirmation preserved.
- **Daily Progress green completed ring:** Completed ring is green when at
  least one task is done; empty ring remains neutral.
- **Task pages responsive polish:** Today, Upcoming, and Completed pages
  work on laptop widths without horizontal overflow. Category filters,
  completed-group expand/collapse, and full Completed archive preserved.
- **Quick Ideas responsive polish:** Workspace, capture card, expanded
  notes editor, and actions work at narrower widths. Dirty-note
  protection, title edit, and delete preserved.
- **Standard Task Detail responsive polish:** Metadata grid collapses at
  narrow widths. Footer buttons remain usable. Dirty-form and delete
  confirmations preserved.
- **YouTube Task Detail responsive polish:** Two-column layout stacks
  player/metadata above notes at narrow widths. Video stays 16:9. Notes
  textarea, clickable timestamp preview, Insert Timestamp, and bullet
  continuation preserved.
- **Accessibility/discoverability polish:** Visible focus states on
  Sidebar, Header, card actions, task rows, Quick Ideas controls, modal,
  detail controls, and timestamp controls. Task row actions are visible
  by default (subtle opacity) and intensify on row hover/focus; no
  hover-only controls. Icon-only buttons have accessible labels. Sidebar
  nav keeps `aria-current="page"`. Expand/collapse buttons keep
  `aria-expanded`. Modal preserves `role="dialog"` and
  `aria-modal="true"`.
- **Completed page cleanup:** Task row regression fixes on the Completed
  page.
- No new packages, no data-shape changes, no new localStorage keys, no
  router, no backend/Firebase/auth changes.

#### Phase 5F — Dark Mode Preference

Status: spec drafted — pending review and approval. Not yet implemented.

The spec `docs/phase-5f-dark-mode-preference-spec.md` is the proposed
source of truth for this phase. It must be reviewed and approved before
any application code is changed.

- CSS custom properties approach using existing `src/styles/variables.css`.
- Toggleable via a user preference control (likely Header or Sidebar).
- System `prefers-color-scheme` detection for default.
- Persist preference in `localStorage` under a key such as `dp.theme`.
- Light background, dark surface, and adjusted text/accent colors.
- No new packages, no UI library, no CSS framework.
- Preserve all existing functionality and data.
- No mobile-first redesign, no router, no backend, no Firebase.

#### Phase 5G — README, Screenshots, and Portfolio Handoff

- README, screenshots, live Vercel link, feature list, setup
  instructions, limitations, future improvements.

### Deferred Beyond Phase 5

- Mobile-first redesign
- Calendar integration
- Reminders and notifications
- AI note summaries
- Recurring tasks
- File attachments
- Advanced filtering/search
- Rich-text notes editor / formatting toolbar (deferred future
  improvement; do not hand-build a fragile editor; no editor package
  without explicit approval)

---

## Phase 6 — Firebase / Cloud Sync Planning and Implementation

### Status

Future planned phase (post-Phase-5). Not scheduled. No spec yet. No
Firebase setup, packages, auth, or config should be added now.

### Clean-Start Decision

Use Option A — start fresh with Firebase:

- Firebase version starts fresh with a clean Firestore data model.
- No localStorage-to-Firestore migration is required for the first
  Firebase implementation.
- Existing browser localStorage data does not need to be preserved or
  imported into Firebase.
- The completed localStorage version remains the local MVP.
- No one-time import tool, migration UI, or automatic upload from
  `dp.tasks` / `dp.ideas` is needed.

### Likely Planning Topics

Any Firebase implementation requires a focused, approved Firebase spec
before code changes. Likely planning topics include:

- Firestore data model for tasks and ideas
- Whether auth is needed immediately or deferred to a later Firebase
  sub-phase
- Loading, saving, and error states
- Offline/local fallback decisions
- Environment/config setup
- Security rules
- Deployment considerations

### Out of Scope (Now and During Phase 5)

- No Firebase implementation now
- No packages now
- No auth now
- No Firestore setup now
- No migration/import from localStorage now
- No backend/cloud sync changes now

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
