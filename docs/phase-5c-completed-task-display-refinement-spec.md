# Phase 5C - Completed Task Display Refinement

**Status: Complete — implemented, build/lint passed, manually browser-verified.**

## 1. Purpose

Phase 5C reduces clutter from completed tasks in the Dashboard and Today
views while keeping completed tasks accessible, counted, reopenable, editable,
deletable, and available from the Completed page.

This phase is a small display refinement. It does not change task data,
sorting rules, storage keys, or navigation behavior.

---

## 2. Scope

### In Scope

- Refine completed-task display only.
- Target views:
  - Dashboard Today's Tasks card completed group.
  - Today page Completed Today group.
- Show fewer completed tasks by default when a completed group has more than
  3 tasks.
- Keep completed counts visible and accurate.
- Keep visible completed tasks fully interactive.

### Out of Scope

- No collapse behavior on the Completed page.
- No task or idea data-shape changes.
- No localStorage migration.
- No new localStorage key.
- No router or URL routing.
- No packages.
- No Firebase, backend, auth, or cloud sync.
- No Phase 5D Quick Idea notes work.
- No Phase 5E responsive/accessibility/visual polish pass.
- No visual redesign or unrelated cleanup.

---

## 3. Target Views

Phase 5C affects only these completed groups:

- Dashboard Today's Tasks card completed group, currently rendered by
  `src/components/TodayTasksCard.jsx`.
- Today page Completed Today group, currently rendered by
  `src/components/TodayPage.jsx`.

The Completed page remains the full archive/history of completed tasks and is
not collapsed by Phase 5C.

Active/incomplete tasks must never be hidden or collapsed.

---

## 4. Default Completed Display

Each affected completed group uses the same default display rule:

- Show only the first 3 completed tasks by default.
- If there are 3 or fewer completed tasks, show all completed tasks and do not
  show expand/collapse controls.
- If there are more than 3 completed tasks, show the first 3 completed tasks
  plus a `Show X more` control.
- `Show X more` expands that completed group and reveals all completed tasks
  in the group.
- Expanded state shows a `Hide` or `Show less` control that collapses the
  group back to the first 3 completed tasks.
- If the completed count drops to 3 or fewer, expand/collapse controls should
  disappear.

The completed count shown in the divider remains the full completed count for
that group, not just the visible count.

---

## 5. Ordering

Preserve existing completed-task ordering exactly.

The implementation should:

1. Build the completed list using the existing filtering and sorting logic.
2. Slice the already-sorted list to the first 3 when the group is collapsed.
3. Render the full already-sorted list when the group is expanded.

Do not add:

- Manual sorting.
- Drag/drop.
- New sort fields.
- User-controlled sort settings.
- Any task data changes to support ordering.

---

## 6. State Behavior

Collapse/expand state is session-only React state.

- Do not persist collapse state to localStorage.
- Do not add a new localStorage key.
- Browser refresh resets completed groups to collapsed/default state.
- Dashboard and Today page expand/collapse state may be independent.
- If a task is reopened, edited, deleted, or completed while the group is
  expanded or collapsed, the visible list and completed count should update
  correctly.
- If the completed count drops to 3 or fewer, controls should disappear.

---

## 7. Today Category Filter Behavior

On the Today page, collapse applies to the currently visible/filtered
Completed Today list.

- The completed count should reflect the full completed count for the current
  category filter, not just the visible 3.
- `Show X more` should count hidden completed tasks for the current filter.
- When the Today category filter changes, reset the Completed Today group back
  to collapsed/default state.
- Do not add category chips anywhere new.
- Do not change existing category filter values or filtering behavior.

---

## 8. Interaction Preservation

Completed tasks that are visible remain:

- Reopenable.
- Editable.
- Deletable.
- Openable in Standard or YouTube detail via task title.

Hidden completed tasks are not deleted, changed, filtered out of data, or
otherwise modified. They are only visually hidden until the user expands the
completed group.

Existing delete confirmations remain unchanged.
Existing task detail origin-return behavior remains unchanged.
Existing dirty-form navigation prompts remain unchanged.

---

## 9. Dashboard Behavior

The Dashboard Today's Tasks card keeps existing behavior for:

- Active tasks.
- Overdue tasks.
- Due-today tasks.
- No-date tasks.
- Daily Progress calculation.
- Category chips.
- Add Task modal trigger.
- Empty states.
- Edit/delete/reopen/detail interactions.

Only the completed group display is affected.

Daily Progress calculation must not change.

---

## 10. Today Page Behavior

The Today page keeps existing behavior for:

- Overdue tasks.
- Today/no-date active tasks.
- Completed Today membership.
- Category filter chips.
- Progress summary and encouragement text.
- Add Task modal trigger.
- Empty states.
- Edit/delete/reopen/detail interactions.

Only the Completed Today display is collapsed when needed.

Completed count should reflect the full filtered Completed Today count when a
category filter is active.

---

## 11. Completed Page Behavior

The Completed page is not collapsed by Phase 5C.

It remains the full archive/history of completed tasks, including all existing
grouping, sorting, reopen, edit, delete, and detail behavior.

---

## 12. Accessibility

Expand/collapse controls must be accessible:

- Use real `<button>` elements.
- Buttons must be keyboard reachable.
- Buttons must have clear visible and accessible text, such as `Show 4 more`
  and `Hide completed` or `Show less`.
- Use `aria-expanded` where appropriate.
- Do not rely on hover-only controls.
- Preserve visible focus states.

---

## 13. Regression Boundaries

Phase 5C must preserve:

- Phase 5A global Add Task modal behavior.
- Phase 5B current workspace persistence.
- Dashboard, Today, Upcoming, Completed, and Quick Ideas behavior outside the
  explicitly targeted completed groups.
- Standard Task Detail and YouTube Task Detail behavior.
- Detail origin-return behavior.
- Dirty-form navigation prompts during normal in-app navigation.
- YouTube player, resume, timestamp insertion, and clickable-preview behavior.
- All task and idea localStorage data.
- The `taskType` vs. `category` invariant:
  - `taskType` controls the detail workspace.
  - `category` is metadata only.

Phase 5C must not add, remove, reset, migrate, or reshape tasks or ideas.

---

## 14. Acceptance Criteria

1. Dashboard completed group shows only first 3 completed tasks by default
   when count is greater than 3.
2. Dashboard `Show X more` expands the completed group.
3. Dashboard `Hide` or `Show less` collapses the completed group.
4. Today page Completed Today group shows only first 3 completed tasks by
   default when count is greater than 3.
5. Today page `Show X more` expands the Completed Today group.
6. Today page `Hide` or `Show less` collapses the Completed Today group.
7. 3 or fewer completed tasks show no expand/collapse controls.
8. Today category filter count reflects the full filtered completed count,
   not just the visible 3.
9. Today category filter changes reset the Completed Today group to
   collapsed/default state.
10. Active tasks are never hidden or collapsed.
11. Completed count remains visible and accurate.
12. Reopen, edit, delete, and task-detail open still work for visible
    completed tasks.
13. Completed page remains full and uncollapsed.
14. Browser refresh resets expand/collapse state.
15. No task or idea data is changed.
16. `npm run build` passes.
17. `npm run lint` passes.

---

## 15. Manual Browser Test Checklist

Test in a normal browser at the Vite localhost URL. Do not rely on
OpenChamber's built-in preview.

Dashboard Today's Tasks card:

- [ ] With 0 completed tasks, no completed group or expand/collapse control is
      shown.
- [ ] With 1-3 completed tasks, all completed tasks are shown and no
      expand/collapse control is shown.
- [ ] With more than 3 completed tasks, only the first 3 are shown by default.
- [ ] `Show X more` expands the completed group.
- [ ] `Hide` or `Show less` collapses the completed group.
- [ ] The completed count remains visible and accurate.
- [ ] Active tasks remain visible and are never collapsed.

Today page:

- [ ] With 0 Completed Today tasks, no Completed Today group or expand/collapse
      control is shown.
- [ ] With 1-3 Completed Today tasks, all completed tasks are shown and no
      expand/collapse control is shown.
- [ ] With more than 3 Completed Today tasks, only the first 3 are shown by
      default.
- [ ] `Show X more` expands the Completed Today group.
- [ ] `Hide` or `Show less` collapses the Completed Today group.
- [ ] The Completed Today count reflects the full count for the current
      category filter.
- [ ] Changing the Today category filter resets the Completed Today group to
      collapsed/default state.
- [ ] Active tasks remain visible and are never collapsed.

Interaction and regression:

- [ ] Reopening a visible completed task works while the group is collapsed.
- [ ] Reopening a visible completed task works while the group is expanded.
- [ ] Editing a visible completed task still works.
- [ ] Deleting a visible completed task still uses the existing delete
      confirmation and updates the count/list.
- [ ] Opening visible completed tasks in Standard or YouTube detail still
      works.
- [ ] Completed page remains full and uncollapsed.
- [ ] Browser refresh resets expand/collapse state to collapsed/default.
- [ ] Add Task modal still opens, closes, saves, and preserves Phase 5A
      behavior.
- [ ] Phase 5B refresh workspace persistence still works for Dashboard, Today,
      Upcoming, Completed, and Quick Ideas.
- [ ] Existing tasks and ideas remain unchanged.
- [ ] Run `npm run build` and confirm it passes.
- [ ] Run `npm run lint` and confirm it passes.

---

## 16. Likely Implementation Files

These files are likely implementation touchpoints. Do not change them as part
of this documentation-only spec.

- `src/components/TodayTasksCard.jsx` - Dashboard Today's Tasks completed
  group display.
- `src/components/TodayPage.jsx` - Today page Completed Today group display
  and category-filter reset behavior.
- `src/components/TaskRow.jsx` - only if needed; no change expected for the
  core collapse behavior.
- `src/styles/task-row.css` or another existing relevant CSS file - only if
  needed for small expand/collapse control styling.
- `docs/project-status.md` - update after Phase 5C implementation is complete.
- `docs/build-plan.md` - update after Phase 5C implementation is complete.

The implementation should keep the change small and should not introduce a
new abstraction unless it prevents duplication without broad refactoring.

---

## 17. Next-Step Boundary

- User reviews and approves spec.
- Coding agent produces implementation plan only.
- User reviews plan.
- Implement after approval.
- Browser test.
- npm run build.
- npm run lint.
- Commit only when user explicitly asks.
