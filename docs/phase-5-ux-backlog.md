# Phase 5 — UX Backlog / Planning Notes

**Status: Planning notes only — not an implementation spec.**

This document captures post-core UX ideas discovered through real use. Each
item should become its own focused spec before coding. Do not implement
anything directly from this document.

**Firebase / cloud sync is NOT part of Phase 5.** It is planned as a future
Phase 6 (see `docs/build-plan.md`). When it arrives, Firebase will start
fresh with a clean Firestore data model (Option A — no localStorage
migration required). No Firebase packages, auth, config, or setup should
be added now.

---

## A. Purpose

Phase 4A–4G delivered working task management, YouTube task workflows, and
clickable timestamp notes. This backlog captures the next layer of polish
and usability improvements that became apparent after using the app.

This is a planning/backlog document, not an approved implementation spec.
The workflow is:

Write focused spec → Review/approve → Coding agent plan-only → Review plan →
Implement → Browser test → `npm run build` → `npm run lint` → Commit.

---

## B. Recommended Phase 5 Priority Order

1. **Phase 5A** — Global Task Creation Flow ✓
2. **Phase 5B** — Persist Current Workspace After Refresh ✓
3. **Phase 5C** — Completed Task Display Refinement ✓
4. **Phase 5D** — Quick Idea Notes Capture Refinement ✓
5. **Phase 5E** — Responsive / Accessibility / Visual Polish ✓
6. **Phase 5F** — Dark Mode Preference ✓
7. **Phase 5G** — Mobile Layout Polish
8. **Phase 5H** — README / Screenshots / Portfolio Handoff

---

## C. Detailed Backlog Items

### 1. Global Task Creation Flow (Phase 5A)

**Status: Complete.** See `docs/phase-5a-global-task-creation-spec.md`.

**Problem (historical):**
The + Add Task button is visible globally in the sidebar, but task creation
is tied to Dashboard/Today in-page forms. This is confusing when the user is
on Upcoming, Completed, or Quick Ideas and clicks + Add Task.

**Proposed behavior:**
- A reusable add-task panel or modal opens over the current view.
- Saving the new task keeps the user on the current workspace.
- The panel includes the same compact fields as the current Add Task form.
- Task creation defaults:
  - Due date: Today
  - Time: Any time (not 09:00)
  - Priority: Medium
  - Category: Work
  - Description: empty
  - Task Type: Standard

**Priority:** High
**Complexity:** Medium
**Scope boundary:** No router, no package, no backend. Do not change the
existing Dashboard/Today inline Add Task forms unless the approved spec
says to.

**Phase 5A cleanup (complete):** Double-plus display on the inline
"+ Add a task" trigger was fixed. The Upcoming inline trigger was removed
(Upcoming relies on global Sidebar/Header Add Task because the modal
defaults to Today). Dashboard and Today inline triggers remain. The modal
Defaults info box was moved from mid-form to just above the footer for a
summary-before-saving feel.

---

### 2. Persist Current Workspace After Refresh (Phase 5B)

**Status: Complete.** See `docs/phase-5b-current-workspace-persistence-spec.md`.

**Problem (historical):**
Refreshing the browser always resets to the Dashboard, even if the user was
on Today, Upcoming, Completed, or Quick Ideas.

**Proposed behavior:**
- Save the last stable normal workspace to `localStorage` under a preference
  key such as `dp.activeView`.
- Restore only these workspaces after refresh:
  - Dashboard
  - Today
  - Upcoming
  - Completed
  - Quick Ideas
- Do **not** restore task detail pages (Standard Task Detail, YouTube Task
  Detail) after refresh. These always reset.

**Priority:** High
**Complexity:** Low
**Scope boundary:** No router, no package. No data-shape change.

---

### 3. Completed Task Display Refinement (Phase 5C)

**Status: Complete.** See `docs/phase-5c-completed-task-display-refinement-spec.md`.

**Problem (historical):**
As more tasks accumulate, completed tasks can dominate the Today and
Dashboard views, pushing active tasks down.

**Proposed behavior:**
- Show only the first 3 completed tasks by default.
- Provide a "Show X more" control to expand the list.
- Provide a "Hide" control to collapse back.
- The completed count remains visible at all times.
- Active tasks must never be hidden or collapsed.
- Completed tasks remain reopenable, editable, and deletable.
- Collapse state is session-only at first (not persisted to localStorage).

**Priority:** Medium
**Complexity:** Low
**Scope boundary:** Do not change task data, delete behavior, or sorting
rules.

---

### 4. Quick Idea Notes Capture Refinement (Phase 5D)

**Status: Complete.** See `docs/phase-5d-quick-idea-notes-capture-refinement-spec.md`
for the completed Phase 5D spec and Final UX Decisions.

---

### 5. Task Creation Defaults and Visibility (Phase 5A tie-in)

**Problem:**
The current default time (09:00) and date behavior can feel unclear or
misleading.

**Proposed behavior:**
- Default to Today + "Any time" (not 09:00).
- Show visible defaults in the compact Add Task form so the user knows what
  will be saved.
- This should be included in Phase 5A because it touches the same Add Task
  flow.

**Priority:** Medium (tied to Phase 5A)
**Complexity:** Low
**Scope boundary:** Do not add new metadata fields. Do not change data
shape.

---

### 6. Quick Ideas Dashboard Edit/Delete

**Status: Deferred — not approved for Phase 5E.**

**Problem:**
Dashboard "Recent Ideas" section allows expanding ideas but not editing or
deleting them directly from the dashboard.

**Proposed behavior:**
- Optional future dashboard controls for editing and deleting Quick Ideas.
- This is a convenience, not a replacement for the full Quick Ideas
  workspace.

**Priority:** Medium
**Complexity:** Low
**Scope boundary:** Do not let the dashboard replace the full Quick Ideas
workspace. Delete confirmation should be required (deletes are permanent).

---

### 7. Responsive, Accessibility, and Visual Polish (Phase 5E)

**Status: Complete.** See `docs/phase-5e-responsive-accessibility-visual-polish-spec.md`.

Phase 5E delivered a focused visual, responsive, and accessibility polish
pass across the app while preserving all Phase 2–5D functionality and
product invariants. Work included:

- Dashboard layout pulled closer to sidebar; reduced excessive spacing.
- Sidebar nav icons (inline SVG), Add Task moved near top under brand.
- Header personalized greeting with visual-only date chip.
- Card spacing, dividers, badges, and empty-state consistency.
- Add Task modal visual/responsive polish with metadata icons.
- Daily Progress green completed ring.
- Laptop-width responsiveness across Dashboard, task pages, Quick Ideas,
  Add Task modal, Standard Task Detail, and YouTube Task Detail.
- Accessibility polish: visible focus states, keyboard reachability,
  visible task row action discoverability (no hover-only), icon-only
  button labels, ARIA fixes.
- Completed page task row regression fixes.
- Build and lint passed; no new packages, no data-shape changes, no new
  localStorage keys.

#### Deferred / Not Phase 5E

The following are explicitly **not** approved for Phase 5E. They remain
deferred or out of scope unless a later spec approves them separately.

- Mobile-first redesign.
- Settings page / sidebar item.
- New pages.
- New packages, including icon packages.
- Router / routing library.
- Firebase, backend, auth, cloud sync.
- Task or idea data-shape changes.
- Bulk delete / multi-select.
- Delete without confirmation.
- Custom Ctrl+Z undo system for YouTube notes.
- Dashboard Quick Ideas edit/delete.
- Quick Idea → Task conversion.
- Rich-text editor / formatting toolbar.
- Calendar functionality beyond a visual-only date display.
- Global search.

#### Visual Polish Ideas From Phase 5A Modal Review (reference only)

These are visual polish ideas captured during Phase 5A review. They are
reference inputs for the Phase 5E spec draft, not approved implementation
requirements on their own. The Candidate Scope above governs what may be
drafted.

1. **Sidebar visual polish**

   - Consider adding simple icons beside each sidebar navigation item:
     Dashboard, Today, Upcoming, Completed, Quick Ideas.
   - Keep icons subtle and consistent with the app's blue/gray visual style.
   - Prefer simple inline SVGs; do not add an icon package unless separately
     approved.

2. **Sidebar Add Task placement**

   - Consider moving the primary "+ Add Task" button from the bottom of the
     sidebar to a more prominent position near the top, under the app
     logo/name.
   - Rationale: the reference UI makes task creation feel central and easier
     to access.
   - Evaluate carefully because the current bottom placement is already
     functional.

3. **Header date/calendar polish**

   - Consider adding a top-right date display with a small calendar icon:
     current date, weekday, and a compact calendar button/icon.
   - Visual-only unless a future spec approves calendar behavior.

4. **Add Task modal polish**

   - Consider adding small icons inside modal metadata fields: Task Type,
     Category, Priority, Due Date, and Time.
   - Priority could use a small flag-style icon; Due Date a calendar icon;
     Time a clock icon.
   - Keep as visual polish only; no new data behavior.

5. **Defaults box placement**

   - The modal's Defaults info box was moved near the bottom (above the
     footer) during Phase 5A cleanup. This position should be preserved in
     future visual passes — it reads as a final summary before saving.
   - The text remains: `Today + Any time + Medium + Work + Standard Task`.

6. **Modal visual target**

   - Keep the Add Task modal moving toward a polished productivity-app feel:
     centered white card, dimmed workspace behind it, soft shadow, rounded
     corners, clean two-column metadata grid, strong blue primary Add Task
     button, ghost/secondary Cancel button.
   - Avoid making it feel like a raw browser form, admin/debug form, or dense
     settings panel.

7. **Scope note**

   - These are future visual polish ideas, not part of current Phase 5A
     cleanup unless separately approved.
   - Do not combine them with bug fixes, Phase 5B refresh persistence, or
     other unrelated work.
   - No Tailwind, no UI library, no icon package, no router, no
     Firebase/backend.

---

### 8. Dark Mode Preference (Phase 5F)

**Status: Complete.** See `docs/phase-5f-dark-mode-preference-spec.md`
for the completed Phase 5F spec.

**Problem:**
The app is light-mode only, which is harsh in low-light environments and
limits accessibility.

**Delivered:**
- CSS custom property overrides for all color tokens (backgrounds, surfaces,
  text, accents, borders, shadows, idea colors, success/warn/danger soft
  colors, overlay tints) in `src/styles/variables.css`.
- Toggle control in the Sidebar footer (sun/moon icon).
- Global theme applied via `document.documentElement.dataset.theme` on the
  root `<html>` element.
- Preference persisted in `localStorage` under `dp.theme`.
- Targeted `html[data-theme='dark']` overrides across all 10 component
  stylesheets for cards, header, sidebar, task rows, modals, empty states,
  Quick Ideas, and task detail views.
- No new packages, no UI library, no CSS framework.
- All existing functionality and data preserved.
- No component or layout structure changes.

**Priority:** Medium
**Complexity:** Medium
**Scope boundary:** CSS + a preference toggle + localStorage key
(`dp.theme`) only. No redesign, no mobile-first, no router, no backend,
no Firebase.

---

### 9. Mobile Layout Polish (Phase 5G)

**Status:** Planning only — not implemented. Requires its own focused spec
and approval before coding.

**Problem:**
The deployed Vercel app needs focused mobile usability and layout polish
before portfolio screenshots and README handoff. Mobile viewing currently
does not present the app well unless Chrome desktop view is enabled.

**Proposed behavior:**
- Draft and approve a focused Phase 5G mobile layout polish spec before
  making code changes.
- Improve mobile usability and layout for the existing app without adding
  new product features.
- Preserve existing task, idea, YouTube, dark mode, and localStorage
  behavior unless the approved spec explicitly changes it.

**Priority:** High
**Complexity:** Medium
**Scope boundary:** No app code changes from this backlog note alone. No
new packages, no router, no backend/Firebase/auth, and no data-shape
changes without explicit approval.

---

### 10. README, Screenshots, and Portfolio Handoff (Phase 5H)

**Problem:**
The GitHub repo needs a professional README for portfolio presentation.

**Proposed behavior:**
- README with feature list, setup instructions, live Vercel link,
  technology stack, limitations, and future improvements.
- Screenshots of key views (Dashboard, Today, YouTube Task Detail with
  clickable preview, Quick Ideas).
- No app code changes required.

**Priority:** Medium
**Complexity:** Low
**Scope boundary:** Docs and images only. No app code changes.

---

## D. Outdated or Already-Covered Notes

- **Learning task workflow** is mostly covered by the current YouTube Task
  workflow (embedded player, resume, timestamp insertion, clickable
  timestamp preview, bullet-continuation notes).
- **Basic overdue labeling** already exists. A future improvement could make
  labels more descriptive, e.g. "Overdue by 2 days."
- **Ctrl+Z for YouTube notes** should remain deferred. Normal textarea undo
  already exists for typed text, and custom undo for programmatic
  timestamp/bullet insertion is extra complexity.
- **Deleting without confirmation** should not be implemented now. Deletes
  are permanent. Bulk delete / multi-select should be a separate future
  feature.
- **Rich-text notes editor / formatting toolbar** is a deferred future
  improvement. Do not hand-build a fragile rich-text editor. Do not add an
  editor package without separate explicit approval.

---

## E. Backlog / Later Ideas

These are not Phase 5 items. They are captured for future reference only.

- Main Focus task
- Time estimates / total planned time
- Time-of-day sections
- User-controlled sorting
- Duplicate task
- Task templates
- Keyboard shortcuts
- Daily reflection
- Mood/energy check-in
- Completion celebration
- Global search
- Convert Quick Idea to Task
- Recurring tasks
- Firebase / cloud sync (planned as Phase 6; start fresh with clean
  Firestore data model, no localStorage migration)
- Notifications
- Google Calendar integration
- AI task breakdown / AI planner / AI weekly review
- Weather, holidays, transit/travel estimates, local events
- Rich-text notes editor / formatting toolbar

---

## F. Future Implementation Rule

1. Write a focused spec for the specific sub-phase.
2. Review and approve the spec.
3. Coding agent creates a plan (no code yet).
4. Review the plan and approve.
5. Implement.
6. Manual browser test.
7. `npm run build` → must pass.
8. `npm run lint` → must pass.
9. Commit with a descriptive message.

**Hard constraints (unchanged from AGENTS.md):**
- React + JavaScript + Vite + regular CSS only.
- No TypeScript, Tailwind, CSS modules, UI kits, or CSS frameworks.
- `localStorage` only. No backend, Firebase, auth, cloud sync.
- No routing libraries such as React Router.
- No npm packages without explicit approval.
- No API keys or secrets in project files.
- Preserve existing saved data; never discard tasks/ideas because of a
  migration.
