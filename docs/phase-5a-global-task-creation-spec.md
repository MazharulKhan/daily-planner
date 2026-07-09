# Phase 5A — Global Task Creation Flow

**Status: Complete — implemented, build/lint passed, manually browser-verified,
committed and pushed (`164d83b`).**

This spec is now a historical reference for the completed Phase 5A work. It
describes the global Add Task modal that replaced the inline/shared Add Task
form. See `docs/project-status.md` for the current project state and
`docs/phase-5-ux-backlog.md` for remaining Phase 5 sub-phases.

---

## 1. Purpose

Fix the confusing global "+ Add Task" behavior. Today the sidebar and header
"+ Add Task" controls set a shared `taskAddOpen` flag that is only consumed by
the inline Add Task forms on Dashboard, Today, and Upcoming. On Completed and
Quick Ideas, clicking "+ Add Task" does nothing visible. On Dashboard/Today/
Upcoming, the user gets an in-page form instead of a consistent global
creation surface.

Phase 5A replaces this with a single reusable, centered Add Task modal that
opens over the current workspace from any normal view, keeps the user on the
current workspace after saving, and uses the same defaults everywhere.

---

## 2. Scope

### In Scope

- A new reusable, centered Add Task **modal** component.
- All "+ Add Task" entry points open the same modal:
  - Sidebar "+ Add Task" button
  - Header "+ Add Task" button
  - The inline "+ Add a task" trigger currently rendered by `AddTaskForm` on
    Dashboard, Today, and Upcoming
- Modal works from all five normal workspaces: Dashboard, Today, Upcoming,
  Completed, Quick Ideas.
- Saving a task from the modal closes the modal and keeps the user on the
  current workspace (no silent view change).
- Task creation defaults shown and applied:
  - Due date: **Today**
  - Time: **Any time** (`null`)
  - Priority: **Medium**
  - Category: **Work**
  - Description: empty
  - Task Type: **Standard**
  - YouTube fields stay blank by default
- Task Type selector: Standard Task / YouTube Task.
- When Task Type is YouTube Task, show a YouTube video URL field.
- Blank YouTube URL is allowed.
- Invalid YouTube URL blocks create with inline validation (reuse existing
  `validateYouTubeUrl`).
- Accessibility/focus behavior for the modal (focus trap, restore focus,
  Escape to close, overlay click to close when pristine).
- Polished, premium modal visual design (see Section 5.1).

### Out of Scope (see Section 3)

All deferred items below are explicitly out of scope for Phase 5A.

---

## 3. Explicitly Deferred

The following are **not** part of Phase 5A and must not be added:

- React Router or any routing library.
- Firebase, auth, backend, cloud sync, or any external API.
- Any new npm packages (no modal library, no portal/focus-trap package).
- YouTube IFrame Player API usage inside the modal (the modal only captures a
  URL string; it never embeds or loads the player).
- YouTube notes (`youtubeNotes`) field in the modal. YouTube tasks get an
  empty `youtubeNotes: ''` on creation, same as today.
- Editing existing tasks from the modal (modal is create-only).
- Quick Idea → Task conversion.
- Bulk create, templates, duplicate task, recurring tasks.
- Any task data-shape change or migration. The created task object must match
  the current shape exactly.
- Restoring the modal/open state after refresh (session-only open state).
- Persisting the current workspace after refresh (that is Phase 5B).
- Changing the inline edit/delete or task-detail behavior.
- Opening the modal from Standard Task Detail or YouTube Task Detail.

---

## 4. Modal Entry Points

The modal is opened by the global "+ Add Task" controls and by the inline
"+ Add a task" triggers. All entry points call the same open handler.

| Entry point | Current behavior | Phase 5A behavior |
|-------------|------------------|--------------------|
| Sidebar "+ Add Task" | Calls `requestAddTask`; no visible effect on Completed/Quick Ideas | Opens modal over current view |
| Header "+ Add Task" | Calls `requestAddTask`; hidden when a task detail is open | Opens modal over current view (still hidden when a task detail is open) |
| Dashboard inline "+ Add a task" | Toggles inline `AddTaskForm` | Opens modal |
| Today inline "+ Add a task" | Toggles inline `AddTaskForm` | Opens modal |
| Upcoming inline "+ Add a task" | Toggles inline `AddTaskForm` | Opens modal |

### Detail-view exclusion

The modal must **not** open from Standard Task Detail or YouTube Task Detail.

- The Header "+ Add Task" button is already hidden when a task detail is open;
  keep that behavior.
- The Sidebar "+ Add Task" button currently always opens. Phase 5A must
  **visually disable** it when a task detail is open (see Section 15.2) so the
  user can see the action is unavailable. Keep the App-level `detailOpen` guard
  as a backup so the modal can never open from a detail view even if the
  disabled state is bypassed.
- No keyboard shortcut is required to open the modal, so no detail-view
  shortcut conflict exists.

---

## 5. Modal Layout

The modal is a single, centered, overlay-style dialog rendered above the
current workspace. It is a React component (e.g. `AddTaskModal`) with a
matching regular CSS file. No portal library is required; render at the top
level of `App` so it overlays everything via CSS positioning and z-index.

### Structure

```
[Overlay]  (fixed, full-screen, dimmed, click closes when pristine)
  [Dialog]  (centered, white card, rounded, bordered, soft shadow)
    [Header row]
      Title: "Add Task" (left)
      Close (X) button (right)
    [Form]
      Task Title input (single line, required) — full width
      Description textarea — full width
      [Defaults info box — full width, blue-tinted]
      [Metadata grid — two columns on desktop]
        Task Type | Category
        Priority  | Due Date
        Time      | (Any time control lives with Time)
      [Conditional: YouTube video URL field — only when Task Type = YouTube Task]
        Full width, below Task Type or below the metadata grid
    [Footer row]
      Cancel button (left, secondary/ghost)
      Add Task button (right, strong blue primary)
```

### Layout rules

- Title input is the first field and receives focus on open.
- All fields are always visible; there is **no** "More options" toggle in the
  modal.
- The YouTube URL field appears only when Task Type = YouTube Task; it is
  absent (not just disabled) for Standard Task.
- The form shows visible defaults (Today date, Any time, Medium, Work,
  Standard) via the Defaults info box and the field values themselves.
- The dialog should be compact and scroll only if the viewport is short.
- No responsive/mobile redesign; desktop-first is fine. (Phase 5E handles
  responsive polish.) The two-column metadata grid may collapse to one column
  on narrow widths only if needed to avoid breaking layout — no mobile redesign.

---

## 5.1. Modal Visual Design

The modal should feel like a polished, modern productivity app: spacious,
calm, and premium — not like a basic browser form or debug/admin UI. The
written spec below is authoritative; do not rely on screenshots.

### Overlay

- Full-screen, fixed overlay that **dims** the underlying workspace.
- The underlying workspace remains **visible** (dimmed, not hidden) but
  **inactive** — no clicks, scroll, or focus reach it while the modal is open.
- Overlay is a neutral dark translucent layer (e.g. dark with low opacity), not
  a solid color block.

### Dialog

- **Centered** both horizontally and vertically in the viewport.
- Desktop width: **~520–600px** (pick one value and keep it consistent; 560px
  is a good default).
- **White surface**.
- **Subtle border** (light gray, 1px).
- **Rounded corners** (match the app's existing card radius).
- **Soft shadow** to lift the dialog above the overlay; avoid hard edges.
- Comfortable internal padding; avoid cramped, dense controls.

### Header row

- Title **"Add Task"** on the left, using the app's heading typography.
- **X close button** on the right, clearly visible, accessible, with
  `aria-label="Close"`.
- A subtle divider between header and form body is acceptable.

### Form body

- **Task Title** input is **full width**.
- **Description** textarea is **full width**, sits below the title, and is
  compact (3 rows is fine).
- **Defaults info box**: a small, **blue-tinted** info box (full width) showing
  the text `"Today + Any time + Medium + Work + Standard Task"`. This makes
  the defaults unmistakable and reinforces what will be saved without forcing
  the user to scan every field. Tint should be subtle and consistent with the
  blue accent; not loud.

### Metadata grid

- Use a **clean two-column grid** on desktop for the metadata fields:
  - Task Type
  - Category
  - Priority
  - Due Date
  - Time
- Pairings are flexible; keep them visually balanced. Task Type and Category
  on row 1 is a sensible default.
- Inputs use the app's standard control styling; consistent heights, labels,
  and spacing across both columns.

### YouTube URL field (conditional)

- When Task Type = YouTube Task, show the **YouTube video URL** field
  **full width**, either directly below the Task Type control or directly
  below the metadata grid. Full width keeps long URLs readable.

### Footer row

- **Cancel** on the left (or right-left grouping that visually separates it
  from the primary action): a **secondary/ghost** button (no strong fill).
- **Add Task** on the right: a **strong blue primary** button using the app's
  blue accent; the primary visual anchor of the footer.
- Disabled Add Task state (empty title) should look visibly disabled but not
  jarring.

### Design tokens

- Reuse existing app design tokens where possible:
  - **Blue accent** for primary actions, active states, and the Defaults
    info-box tint.
  - **White cards** for the dialog surface.
  - **Subtle borders** and **rounded corners** consistent with existing cards.
  - **Compact but comfortable spacing** — match existing card paddings; do
    not introduce a new spacing system.
- No new CSS framework or design system. Regular CSS in
  `src/styles/add-task-modal.css`.
- Do not rely on screenshots; the written spec above is authoritative.

---

## 6. Field Rules

### Title

- Required. Trimmed before use.
- Empty trimmed title blocks create. The Add Task button is disabled when the
  title is empty (recommended) or shows inline validation on submit.
- Max length: keep current behavior (no new constraint introduced).

### Task Type

- Selector with two options: `Standard Task` (`standard`) and
  `YouTube Task` (`youtube`).
- Default: `Standard Task`.
- Switching from YouTube → Standard hides the URL field and clears any URL
  validation error.
- Switching from Standard → YouTube shows the URL field (empty by default).

### YouTube video URL (only when Task Type = YouTube Task)

- Optional: a blank URL is allowed and saved as `youtubeUrl: ''`.
- A non-empty URL must pass `validateYouTubeUrl` (reuse existing util).
- On invalid URL, block create and show the existing inline validation
  message ("Enter a valid YouTube URL or leave this blank.").
- On create, store the normalized URL returned by `validateYouTubeUrl(...).url`
  for a non-empty URL, or `''` for a blank URL — exactly as the current
  `AddTaskForm` does.

### Description

- Optional, default empty. Trimmed before save.

### Priority

- Select: High / Medium / Low. Default: **Medium**.

### Category

- Select: Work / Learning / Personal / Health. Default: **Work**.
- Category is metadata only and must never affect which detail workspace opens
  (enforces the existing product invariant).

### Time

- Time input plus an **explicit, visible "Any time" clear/default control**
  (see Section 15.5) so the default is unmistakable and easy to restore after
  the user picks a time.
- Default: **Any time** (stored as `time: null`).
- Must not default to `09:00` (current misleading default is removed for the
  modal). The default is `null`/empty.

### Due date

- Date input. Default: **Today** (today's ISO date `YYYY-MM-DD`).
- The user may clear it (stored as `dueDate: null`) — keep current behavior.

### YouTube notes

- Not present in the modal. Created YouTube tasks get `youtubeNotes: ''`.

---

## 7. Save / Cancel / Close Behavior

### Pristine vs. dirty modal

The modal tracks whether the user has entered or changed any field from the
defaults. This "dirty" flag drives close behavior:

- **Pristine**: no user input — the form is exactly at defaults (empty title,
  default task type, empty description, defaults for priority/category/time/
  due date, and — if YouTube — empty URL).
- **Dirty**: the user typed or selected anything beyond the defaults,
  including typing and then clearing a field.

### Save (Add Task)

- Validates: non-empty trimmed title; if Task Type = YouTube and URL is
  non-empty, it must be valid.
- On success, calls the existing `addTask` with a new task object matching the
  current shape exactly:
  - `id: makeId('task')`
  - `title`, `description` (trimmed)
  - `taskType`
  - `youtubeUrl` (`''` for standard, normalized URL or `''` for youtube)
  - `youtubeNotes: ''`
  - `completed: false`
  - `priority`, `category`
  - `time` (`null` if Any time)
  - `dueDate` (today's ISO date by default, or `null` if cleared)
- Note: `completedAt` and `updatedAt` are not set by the creation call; the
  existing `addTask`/storage layer is responsible for timestamps as today.
  Do not change that layer.
- After save: reset modal fields, close the modal, and **keep the user on the
  current workspace**. No silent navigation.
- Saving always closes the modal, regardless of dirty state — it is the
  explicit confirm action.

### Cancel / X / overlay click / Escape

The approved close behavior is explicit (no implementation-plan choice):

- **If the modal is pristine**: Cancel, X, overlay click, and Escape close
  immediately and discard input (there is nothing to lose).
- **If the modal is dirty (unsaved user input)**:
  - **Overlay click does not close** the modal. The user cannot lose input by
    an accidental click on the dimmed overlay.
  - **Cancel, X, and Escape show a small in-modal discard confirmation**
    (e.g. "Discard changes?" with **Keep editing** and **Discard** actions).
  - **"Keep editing"** keeps the modal open and **preserves all fields**
    exactly as the user left them — no reset.
  - **"Discard"** closes the modal and **resets all fields to defaults**.
- **Saving bypasses the discard confirmation** and closes the modal
  normally (it is the explicit confirm action).

### Discard confirmation UI rules

- The discard confirmation is a **small, in-modal** panel — it must not create
  a second stacked modal over the first.
- It must not steal focus outside the dialog's focus trap.
- It applies only to the dirty state; in the pristine state there is no
  confirmation (immediate close).

### Field reset on close

- Whenever the modal actually closes (save, pristine close, or confirmed dirty
  close), all fields reset to the defaults in Section 6 so reopening shows a
  fresh form.
- If the user chooses "Keep editing" in the discard confirmation, the modal
  stays open and fields are **not** reset.

---

## 8. Accessibility / Focus Behavior

- The dialog uses `role="dialog"` and `aria-modal="true"`, with
  `aria-labelledby` pointing to the "Add Task" title.
- On open, focus moves to the Title input.
- Focus is constrained to the dialog while open (focus trap). A lightweight
  hand-built trap is acceptable (no package). If focus leaves, return it to
  the dialog on Tab/Shift+Tab at the boundaries.
- The first focusable element is the Title input; the last is the Add Task
  button (or Cancel, depending on order). Tab wraps inside the dialog.
- Escape closes the modal (Section 7).
- On close, focus returns to the element that opened the modal (the triggering
  button) when possible.
- The overlay must prevent interaction with the workspace behind it
  (pointer-events on overlay, not on the workspace). Overlay-click close is
  disabled when the modal is dirty (see Section 7) so the user can't lose input
  by an accidental click.
- The X (close) button has an `aria-label` of "Close".
- Validation messages use `aria-live` or are associated with the URL field via
  `aria-describedby` so screen readers announce them.
- Visible focus outlines must be preserved (do not remove default focus rings).

---

## 9. Data / Persistence Rules

- No data-shape change. The created task object must match the existing
  fields exactly.
- No localStorage migration. No new keys. No `dp.activeView` (that is 5B).
- The modal open state is React state only (session-only), not persisted.
- `addTask` from `useLocalStorage`/`useTasks` is the single write path. The
  modal calls it; the storage layer writes `dp.tasks` after every change.
- Existing saved data must be preserved; this phase only adds a new creation
  surface and does not touch existing tasks.
- Sample data behavior is unchanged (sample data only loads when nothing is
  saved).

---

## 10. Regression Boundaries

Phase 5A must not regress completed-phase behavior:

- **Dashboard**: existing Today's Tasks, Upcoming Tasks, Quick Ideas, and
  Daily Progress cards must keep working. The inline "+ Add a task" trigger on
  Dashboard now opens the modal instead of the inline form; the rest of the
  Dashboard is unchanged.
- **Today / Upcoming**: inline "+ Add a task" now opens the modal. Existing
  sorting, overdue labels, category filter chips (Today), priority markers,
  complete/uncomplete, edit, and delete must keep working.
- **Completed**: previously had no add-task UI; the modal now opens here from
  the global controls. Existing completed grouping/dividers, reopen, edit, and
  delete must keep working. The modal creates tasks as `completed: false`;
  newly created tasks will not appear on Completed (expected).
- **Quick Ideas**: previously had no add-task UI; the modal now opens here.
  Existing idea add/edit/delete/expand must keep working. The modal creates
  tasks, not ideas — the Quick Idea add form is untouched.
- **Standard Task Detail / YouTube Task Detail**: the modal must not open
  from these views. Existing detail editing, dirty-form navigation prompts,
  YouTube player, resume, timestamp insertion, and clickable timestamp notes
  preview must keep working.
- **Sidebar navigation**: unchanged. Active-view styling unchanged.
- **Header**: the "+ Add Task" button stays hidden when a task detail is open;
  otherwise it opens the modal. Search input remains non-functional
  (unchanged; global search is deferred).
- **Category vs Task Type invariant**: unchanged. Category never selects the
  workspace.
- **Timestamps**: `updatedAt`/`completedAt` behavior unchanged; creation
  continues to rely on the existing storage layer.

---

## 11. Acceptance Criteria

1. Clicking Sidebar "+ Add Task" opens the centered modal from Dashboard,
   Today, Upcoming, Completed, and Quick Ideas.
2. Clicking Header "+ Add Task" opens the same modal from the same five views.
3. Clicking the inline "+ Add a task" trigger on Dashboard, Today, and
   Upcoming opens the same modal (no inline form toggle remains for task
   creation).
4. The modal does not open from Standard Task Detail or YouTube Task Detail.
5. Modal shows defaults: Due date = Today, Time = Any time, Priority = Medium,
   Category = Work, Task Type = Standard, Description empty.
6. Task Type selector switches between Standard Task and YouTube Task.
7. YouTube URL field appears only when Task Type = YouTube Task.
8. A blank YouTube URL can be saved (creates a YouTube task with
   `youtubeUrl: ''`).
9. An invalid non-empty YouTube URL blocks create and shows the inline
   validation message.
10. A valid YouTube URL is saved normalized; a valid YouTube task is created.
11. Saving a Standard Task creates a task with `taskType: 'standard'`,
    `youtubeUrl: ''`, `youtubeNotes: ''`, `time: null`, `dueDate` = today.
12. After saving, the modal closes and the user remains on the current
    workspace (no view change).
13. When pristine, Cancel, X, overlay click, and Escape close the modal
    immediately and discard input without creating a task.
14. When dirty (unsaved user input), Cancel, X, and Escape show a small
    discard confirmation, and overlay click does not close the modal. Saving
    still closes the modal.
15. Reopening the modal always shows fresh defaults.
16. Focus moves to the Title input on open, is trapped inside the dialog, and
    returns to the triggering button on close.
17. The created task object matches the current data shape exactly; no
    migration runs; existing `dp.tasks` data is untouched.
18. The Sidebar "+ Add Task" button is visually disabled while a Standard or
    YouTube Task Detail is open.
19. The modal visual design matches Section 5.1 (dimmed overlay, centered
    white dialog ~520–600px, two-column metadata grid, blue-tinted Defaults
    info box, ghost Cancel + strong blue primary Add Task).
20. `npm run build` passes.
21. `npm run lint` passes.

---

## 12. Manual Browser Test Checklist

Test in a normal browser at the Vite localhost URL (OpenChamber preview is
unreliable). For each of the five workspaces (Dashboard, Today, Upcoming,
Completed, Quick Ideas):

- [ ] Sidebar "+ Add Task" opens the centered modal.
- [ ] Header "+ Add Task" opens the same modal (where the header button is
      visible — it is hidden on Quick Ideas title block and on task details).
- [ ] Modal shows the required defaults (Today, Any time, Medium, Work,
      Standard, empty description).
- [ ] Inline "+ Add a task" (Dashboard/Today/Upcoming) opens the same modal.
- [ ] Title is required; Add Task is blocked/disabled when empty.
- [ ] Create a Standard Task → modal closes, user stays on current workspace,
      task appears on Today (due Today) or Upcoming as appropriate.
- [ ] Switch Task Type to YouTube Task → URL field appears.
- [ ] Leave URL blank → save succeeds → YouTube task created with empty URL.
- [ ] Enter an invalid URL → inline validation shows → save blocked.
- [ ] Enter a valid YouTube URL → save succeeds → task created with
      normalized URL.
- [ ] Cancel / X / overlay click / Escape close the modal with no task
      created **when the form is pristine** (no user input).
- [ ] Type into a field (dirty) → overlay click does not close; Cancel / X /
      Escape show a small discard confirmation; "Keep editing" leaves fields
      intact; "Discard" closes and resets.
- [ ] Save while dirty → modal closes, fields reset, task created.
- [ ] Reopen modal → fields reset to defaults.
- [ ] Tab/Shift+Tab stays inside the dialog; focus starts on Title; focus
      returns to the triggering button after close.
- [ ] Overlay blocks clicks to the workspace behind it.
- [ ] Modal visual design: dimmed overlay, centered white dialog
      ~520–600px, two-column metadata grid, blue-tinted Defaults info box,
      ghost Cancel + strong blue primary Add Task — feels premium, not like a
      basic form.

Cross-view regression:

- [ ] Open a Standard Task Detail → Sidebar "+ Add Task" is visually disabled
      and does not open the modal.
- [ ] Open a YouTube Task Detail → Sidebar "+ Add Task" is visually disabled
      and does not open the modal.
- [ ] Existing edit/delete/complete/reopen on Today, Upcoming, Completed
      still work.
- [ ] Quick Idea add/edit/delete/expand still work and are unaffected.
- [ ] Refresh the browser → modal is closed (session-only); existing tasks and
      ideas persist.
- [ ] Run `npm run build` → passes.
- [ ] Run `npm run lint` → passes.

---

## 13. Likely Implementation Files

These are likely files; the implementation plan (separate step) will confirm
the exact list. No code is changed by this spec.

### New

- `src/components/AddTaskModal.jsx` — the new centered modal component
  (create-only). Reuses the validation/util logic from the current
  `AddTaskForm`.
- `src/styles/add-task-modal.css` — regular CSS for overlay, dialog, form
  layout, focus states, and responsive guard for short viewports.

### Modified

- `src/App.jsx` — own the modal open state and render `<AddTaskModal>` at the
  top level so it overlays all workspaces. Wire Sidebar/Header/inline
  triggers to a single open handler. Guard the open handler so it is a no-op
  when a task detail is open (`detailOpen`). Remove the per-view inline
  `AddTaskForm` wiring that relied on the shared `taskAddOpen` flag, or repoint
  the inline triggers to open the modal.
- `src/components/Sidebar.jsx` — keep "+ Add Task" button; **visually disable**
  it when a task detail is open (see Section 15.2). The handler already calls
  `onAddTask`; the App-level `detailOpen` guard remains as backup.
- `src/components/Header.jsx` — keep "+ Add Task" button; no structural change
  expected (already hidden when a detail is open).
- `src/components/Dashboard.jsx` — repoint the inline "+ Add a task" trigger to
  open the global modal instead of toggling an inline form. Pass-through
  props for `taskAddOpen`/`closeAddTask`/`requestAddTask` may be simplified.
- `src/components/TodayPage.jsx` — same as Dashboard: repoint the inline
  trigger to the global modal.
- `src/components/UpcomingPage.jsx` — same.
- `src/components/AddTaskForm.jsx` — **fold its field/validation logic into
  `AddTaskModal` and remove `AddTaskForm` after all references are repointed**
  (see Section 15.1). Do **not** keep two live create surfaces.

### Unchanged (regression-protected)

- `src/components/CompletedPage.jsx`, `src/components/QuickIdeasWorkspace.jsx`
  (they simply gain modal access via App; no inline form added).
- `src/components/StandardTaskDetail.jsx`,
  `src/components/YouTubeTaskDetail.jsx` — must not open the modal.
- `src/data/storage.js`, `src/data/migrate.js`, `src/data/sampleData.js`,
  `src/hooks/useLocalStorage.js` — no data-shape or migration changes.

---

## 14. Next-Step Boundary

This spec is **draft only**. After review/approval, the next steps are:

1. User approves this spec (with any edits).
2. Coding agent produces an implementation plan (no code yet), confirming:
   - exact file list,
   - how `AddTaskForm` is folded into `AddTaskModal` and removed after
     references are repointed,
   - how the inline Dashboard/Today/Upcoming triggers are repointed,
   - how the Sidebar "+ Add Task" disabled state is driven by `detailOpen`,
   - the focus-trap approach without a package,
   - the dirty-close behavior per Section 7 (overlay click disabled when
     dirty; Cancel/X/Escape show the small in-modal discard confirmation;
     "Keep editing" preserves fields; "Discard" resets and closes; saving
     bypasses confirmation),
   - CSS/z-index strategy for overlaying all workspaces,
   - the visual-design token usage (blue accent, white surface, rounded
     corners, soft shadow, two-column metadata grid, Defaults info box).
3. User reviews and approves the plan.
4. Implement.
5. Manual browser test using Section 12.
6. `npm run build` and `npm run lint` must pass.
7. Commit only when the user explicitly asks.

Phase 5B (Persist Current Workspace After Refresh) and later Phase 5 sub-phases
are separate specs and are not started by this spec.

---

## 15. Resolved Decisions

These decisions are **approved** for Phase 5A and must be followed by the
implementation plan:

1. **`AddTaskForm` disposition.** Fold its logic into `AddTaskModal` (or remove
   `AddTaskForm` after all references are repointed). Do **not** keep two live
   create surfaces. Only one task-creation surface ships in Phase 5A: the
   modal.
2. **Sidebar "+ Add Task" while a task detail is open.** **Visually disable**
   the Sidebar "+ Add Task" button when Standard Task Detail or YouTube Task
   Detail is open. Keep the App-level `detailOpen` guard as a backup so the
   modal can never open from a detail view even if the disabled state is
   bypassed.
3. **"More options" toggle.** **None.** Always show all modal fields. Task
   Type is always visible (it controls the conditional YouTube URL field).
4. **Inline trigger wording.** Keep the existing **"+ Add a task"** wording on
   Dashboard/Today/Upcoming inline triggers; only their behavior changes
   (they now open the modal).
5. **Time "Any time" UI.** Use an **explicit, visible "Any time"** clear/
   default control next to the Time input so the default is unmistakable and
   easy to restore after the user picks a time.

---

## 16. Risky Areas for Implementation

- **Overlay/z-index across all workspaces.** The modal must overlay Sidebar,
  Header, and all five workspaces consistently. Rendering at the top of `App`
  with a fixed overlay is the safe approach; per-workspace rendering risks
  clipping and stacking-context issues.
- **Focus trap without a package.** A hand-built trap must correctly handle
  Tab/Shift+Tab at boundaries and restore focus on close. Edge cases:
  dynamically-shown URL field changes the tab order; invalid-URL error text
  must not steal focus.
- **Repointing inline triggers without regressing Dashboard/Today/Upcoming
  layout.** Removing the inline `AddTaskForm` toggle changes the top of those
  lists; empty states and spacing must remain correct.
- **Shared `taskAddOpen` flag removal.** `App.jsx` currently passes
  `taskAddOpen`/`closeAddTask`/`requestAddTask` into Dashboard/Today/Upcoming.
  Repointing must not leave dangling props or half-wired inline forms that
  silently break on Completed/Quick Ideas.
- **Detail-view guard.** The Sidebar button currently always opens. Phase 5A
  visually disables it while a detail is open **and** keeps the App-level
  `detailOpen` guard as backup. Both layers must be implemented; forgetting
  either could let the modal open over a task detail, violating Section 4 and
  risking interaction with the YouTube player/dirty-form prompt.
- **Dirty-close logic.** The pristine/dirty distinction must be computed
  accurately (including typing-then-clearing a field, switching Task Type
  back to Standard, and clearing the URL). The small discard confirmation
  must not create a second stacked modal, and must not steal focus from the
  dialog's focus trap.
- **Premium visual design without a design system.** The modal must look
  polished (dimmed overlay, centered ~560px dialog, soft shadow, two-column
  metadata grid, blue-tinted Defaults info box, ghost Cancel + strong blue
  primary). Without new tokens, the implementation must reuse existing app
  design tokens consistently. Risk: uneven spacing or a "basic form" look.
- **Default time change.** The current `AddTaskForm` defaults time to empty
  (`''` → `null`) already, but the spec removes any `09:00` default elsewhere.
  Verify no other code path injects `09:00`.
- **YouTube URL normalization.** Must reuse `validateYouTubeUrl` exactly so
  created YouTube tasks behave identically to those created via the old form
  (so Phase 4D–4G detail behaviors still work).
- **No data-shape drift.** The created object must not include new fields or
  omit existing fields; otherwise Phase 4D–4G detail rendering could break.
