# Phase 4C — Task List Pages and Navigation

**Status:** Complete — implemented, build/lint passed, and manually browser-verified.  
This spec is a historical reference for the completed Phase 4C work.

## Purpose

Turn the existing Today, Upcoming, and Completed sidebar placeholders into real task-list pages.

The Dashboard remains a compact overview. These pages are focused expanded views for daily work, future planning, and completion history.

Use one shared task-list page/workspace approach where practical. Do not build three unrelated task systems.

---

## Scope

Included:

- Real React-state navigation for **Today**, **Upcoming**, and **Completed**.
- Dedicated full-page task-list views for those three destinations.
- Dashboard `View all` actions open the matching Today or Upcoming page.
- Existing task title controls open the Standard Task Detail workspace.
- Add `completedAt` to task data, with safe localStorage migration.
- Update the Upcoming dashboard card and Upcoming page so they show only incomplete future tasks.
- Preserve existing task completion, edit, delete, sorting, category filtering, priority markers, and Standard Task Detail behavior unless this spec explicitly changes it.

Not included:

- React Router, URLs, deep links, or page-refresh persistence of the active view.
- Global search behavior.
- New filters beyond the existing Today category chips.
- Bulk actions, sorting controls, drag-and-drop, task archives, undo/trash, recurring tasks, notifications, dark mode, responsive redesign, Learning Tasks, or new npm packages.

---

## Navigation Rules

- Sidebar items **Dashboard**, **Today**, **Upcoming**, **Completed**, and **Quick Ideas** are real keyboard-accessible navigation controls.
- Continue using app-level React state only. Do not add a routing library.
- Dashboard `View all` for Today opens Today.
- Dashboard `View all` for Upcoming opens Upcoming.
- Today page includes a visible `View Completed` action that opens Completed.
- A task title opens Standard Task Detail.
- Closing or going Back from Standard Task Detail returns to the view where the task was opened: Dashboard, Today, Upcoming, or Completed.
- Existing unsaved-change protection in Standard Task Detail must also guard navigation to Today, Upcoming, and Completed. Do not silently discard dirty edits.

### Standard Task Detail Origin Tracking

`App.jsx` must track the view that opened Standard Task Detail:

- `dashboard`
- `today`
- `upcoming`
- `completed`

Pass that origin into Standard Task Detail.

Its Back action, successful Save action, discard-confirmation navigation, and fallback navigation must return to the originating view rather than using a hardcoded Dashboard destination.

Existing dirty-form protection must remain active for navigation away from Standard Task Detail, including navigation to Dashboard, Today, Upcoming, Completed, and Quick Ideas.

---

## Shared Task Interaction Rules

Across all task-list pages:

- Keep existing task-row visual language, priority markers, badges, checkbox behavior, Edit/Delete actions, keyboard access, and focus behavior.
- Task title is a separate control from checkbox, Edit, and Delete.
- Checking an incomplete task completes it and sets `completedAt`.
- Unchecking a completed task reopens it and clears `completedAt`.
- Completing or reopening a task updates state and localStorage immediately.
- Reuse the existing Add Task logic and form. Do not create separate task-creation systems for each page.
- The existing global/header Add Task control remains available; page-level placement may reuse the same shared form behavior.

---

## Today Page

Purpose: answer **“What should I work on now?”**

Display sections in this order:

1. **Overdue**
   - Incomplete tasks with a due date before today.
   - Keep existing overdue styling and ordering.

2. **Today**
   - Incomplete tasks due today.
   - Incomplete tasks with no due date.
   - Preserve current local-date comparison and time ordering rules.

3. **Completed Today**
   - Tasks with `completedAt` on the current local calendar date.
   - This may include a task that was originally due in the future but completed early.
   - These rows remain visibly completed and can be reopened, edited, deleted, or opened in task detail.

Additional rules:

- Keep the existing category filter chips on Today only: All, Work, Learning, Personal, Health.
- The chips filter visible Today-page sections and counts, but do not affect Daily Progress.
- Show the existing daily progress summary based only on current daily work: overdue, due-today, and no-date tasks. Do not let early-completed future tasks inflate Daily Progress.
- Show a contextual status message, such as remaining active tasks or all tasks completed.

---

## Upcoming Page

Purpose: answer **“What unfinished work is coming up?”**

- Show only **incomplete tasks with a future due date**.
- Do not show overdue tasks.
- Do not show completed tasks.
- Group tasks by exact local due date.
  - Use `Tomorrow` when applicable.
  - Otherwise use a readable date heading, such as `Friday, July 10`.
- Preserve existing future date/time sorting: nearest date first, timed tasks before `Any time` on the same date.
- Do not add Daily Progress or category chips to this page.
- Provide a clear empty state when there are no incomplete future tasks.

### Intentional Change to Existing Behavior

This Phase 4C rule overrides the older Phase 3A behavior that kept completed future-dated tasks in Upcoming.

After Phase 4C:

- The **Upcoming dashboard card** shows incomplete future tasks only.
- The **Upcoming page** shows incomplete future tasks only.
- All completed tasks are available from the Completed page.

---

## Completed Page

Purpose: answer **“What have I finished?”**

- Show all completed tasks, regardless of their due date.
- Sort newest completion first using `completedAt`.
- Group by local completion date:
  - `Completed Today`
  - `Yesterday`
  - Older readable date headings as needed.
- Each row shows completion state and useful completion context, such as completed time or date.
- A checked checkbox reopens the task. The task then immediately leaves Completed and appears in its appropriate active view.
- Keep title, Edit, Delete, and task-detail access available.
- Provide a clear empty state when no completed tasks exist.

---

## Task Data and localStorage

Extend each task with:

```js
{
  completedAt: null // ISO timestamp when completed; null when incomplete
}



Rules:

- Creating a task: `completedAt: null`.
- Completing a task: set `completedAt` to the current ISO timestamp.
- Reopening a task: set `completedAt` to `null`.
- Editing unrelated task fields must preserve an existing valid `completedAt`.
- Safe migration on load:
  - Existing incomplete tasks receive `completedAt: null`.
  - Existing completed tasks with no valid `completedAt` receive their valid `updatedAt` value when available; otherwise use one shared migration timestamp.
  - Never discard existing tasks because of this migration.
- Continue using `dp.tasks`; do not add a new localStorage key.

### Required Persistence Touchpoints

The implementation must update all existing task persistence paths so `completedAt` cannot be lost or become stale:

- Task migration and normalization must add and validate `completedAt`.
- Creating a task must set `completedAt: null`.
- Completing a task through any existing checkbox or completion action must set `completedAt` to the current ISO timestamp.
- Reopening a task through any existing checkbox or completion action must clear `completedAt` to `null`.
- Standard Task Detail Save: if its completion checkbox changes a task from incomplete to complete, include `completedAt` with the current ISO timestamp in the saved patch. If it changes a task from complete to incomplete, include `completedAt: null` in the saved patch.
- Editing unrelated task fields must preserve a valid existing `completedAt`.
- Starter sample tasks must include `completedAt`, using `null` for incomplete sample tasks.

Do not add a new localStorage key. Continue storing tasks in `dp.tasks`.

---

## Acceptance Criteria

Phase 4C is complete when:

- Today, Upcoming, and Completed sidebar items open real dedicated views.
- Dashboard Today and Upcoming `View all` actions open the correct views.
- Today shows Overdue, Today, and Completed Today sections using the rules above.
- Upcoming shows only incomplete future-dated tasks, grouped by date.
- The Upcoming dashboard card also hides completed future tasks.
- Completed shows every completed task grouped and ordered by `completedAt`.
- Completing, reopening, editing, deleting, and opening task detail work from all three pages.
- Standard Task Detail returns to the correct originating view and retains unsaved-change protection.
- Existing task-management, Quick Ideas, and Standard Task Detail behavior is not regressed.
- Existing saved tasks migrate safely with `completedAt`.
- `npm run build` and `npm run lint` pass.
- The feature is manually tested in a normal browser.

---

## Next Step

Create an implementation plan only. Do not edit application code until the plan is reviewed and approved.