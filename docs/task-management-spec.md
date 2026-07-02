# Task Management Spec — Phase 3A

## Purpose

Phase 3A makes the dashboard's task list maintainable for real daily use.
It adds editing, deletion, and optional metadata controls to the existing
dashboard — all without routing, new pages, or any backend.

The phase stays entirely inside the Phase 2 dashboard shell. A user should be
able to keep an accurate, up-to-date task list across multiple days using only
the dashboard.

## Scope

### Included This Phase

- Edit an existing task's title, priority, category, time, and due date from
  the dashboard.
- Delete a task with a confirmation step.
- Add optional priority, category, due date, and time controls in both the
  add-task and edit-task flows.
- Persist every add, edit, and delete to `localStorage`.
- Improve completed-task display inside Today's Tasks and Upcoming Tasks.
- Improve the task empty states affected by these changes.

### Explicitly Deferred

- Task detail pages
- Standalone Today, Upcoming, Completed, Ideas, and Categories pages
- Routing
- Filtering or grouping controls
- Responsive or mobile redesign
- Idea editing, deletion, notes, or conversion to tasks
- Custom category creation or management
- Learning and Reading workflows
- Firebase, authentication, backend APIs, database, cloud sync, external
  APIs, TypeScript, and extra npm packages

## Layout and Interaction Rules

### General

- No routing. No new pages. All interactions happen inside the existing
  dashboard cards.
- No new npm packages. React, JavaScript, regular CSS, and `localStorage`
  only.
- Do not touch the Quick Ideas card beyond what Phase 2 already does.

### Allowed Metadata Values

- **Priority:** `High`, `Medium`, `Low`
- **Category:** `Work`, `Learning`, `Personal`, `Health`
  - Fixed option list. Custom category management is deferred.
- **Time:** `HH:MM` 24-hour string, optional, `null` allowed.
- **Due date:** `YYYY-MM-DD` ISO date string, optional, `null` allowed.

### Task Card Derivation Rules

Card membership is derived from each task's `dueDate` and `completed` state on
every render.

- **Today's Tasks:** tasks whose due date is today, in the past, or `null`
  (no due date).
- **Upcoming Tasks:** tasks whose due date is strictly after today — whether
  incomplete or completed. Completed future-dated tasks are **not** hidden.
- Inside Today's Tasks, incomplete (active) tasks appear before completed
  tasks.
- Inside Upcoming Tasks, incomplete future tasks appear first; completed
  future tasks appear beneath a subtle `Completed` divider with a count so
  they can be reopened, edited, or deleted.
- Completing a today task keeps it in Today's Tasks but moves it beneath the
  completed group; uncompleting moves it back to the active group.
- Completing a future-dated task keeps it in Upcoming Tasks but moves it
  beneath the Upcoming completed group; uncompleting moves it back to the
  incomplete group.
- Editing a task's due date to a future date moves it from Today's Tasks into
  Upcoming Tasks.
- Editing a task's due date to today, a past date, or `null` moves it into
  Today's Tasks.

### Task Ordering Rules

Task ordering is automatic display sorting only. There are no filter
controls, manual drag-and-drop ordering, or new localStorage fields for sort
order.

#### Today's Tasks

1. Active overdue tasks first, ordered by oldest due date first.
2. Active tasks due today next, ordered by time ascending.
3. Active tasks with `dueDate: null` last, after scheduled today tasks.
4. Within the same due-date group, timed tasks come before `time: null`
   tasks.
5. `time: null` / "Any time" tasks come after timed tasks.
6. Completed Today tasks remain beneath the existing Completed divider and
   use the same date/time ordering within that completed group.

#### Upcoming Tasks

1. Active future-dated tasks appear first, ordered by nearest due date first.
2. For tasks on the same future date, order by time ascending.
3. Tasks with `time: null` appear after timed tasks on that same date.
4. Completed future-dated tasks remain beneath the existing Completed divider
   and use the same date/time ordering within that completed group.

### Overdue Task Display

- In Today's Tasks, when one or more active tasks have `dueDate` before
  today, show a subtle `Overdue · {count}` divider above the overdue task
  group.
- Overdue tasks remain at the top of the active group, ordered by oldest due
  date first.
- For each overdue row, the reserved right-side metadata area shows:
  - `Overdue · MMM D` when the task has no time.
  - `Overdue · MMM D · HH:MM` when the task has a time.
- Overdue metadata uses a clear but restrained danger-colored treatment that
  matches the existing design.
- Normal Today tasks (due today or `null`) do not show their full date —
  only overdue rows show the date.
- Completed overdue tasks move beneath the Completed divider like any other
  completed Today task and do not show the overdue label.

### Date Comparison

- Compare `dueDate` values as local calendar dates in `YYYY-MM-DD` form.
- Do not convert a stored due date through UTC in a way that could shift a
  task into the previous or next day. Compute "today" from local year, month,
  and day components and compare it as a string against the stored
  `YYYY-MM-DD` value.
- Only convert a stored due date to a `Date` object for display formatting,
  and even then construct it from the local `YYYY-MM-DD` components
  (for example, `new Date(year, monthIndex, day)`), not from a UTC-prefixed
  ISO string.

### Task Row Affordances

Each task row in Today's Tasks and Upcoming Tasks gains two action controls:

- **Edit** — opens the inline edit panel for that row.
- **Delete** — opens the inline delete-confirm state for that row.

- When a task has `time: null`, keep the reserved time column and display a
  subtle muted `Any time` label instead of leaving it blank.

Controls are keyboard reachable, have a visible focus state, and carry
accessible labels for icon-only buttons. They must not be revealed by hover
alone — hover may enhance visibility, but the controls must be operable
without hovering (always rendered in the accessibility tree and focusable,
with opacity increased on hover/focus).

Controls must not shift row layout when revealed; use opacity/visibility
transitions within a reserved space or an icon-only button area.

### Add Task Flow (Updated)

- The existing add-task entry points stay: sidebar `+ Add Task`, header
  `+ Add Task`, and the card's inline `+ Add a task`.
- Title remains required and is the only field that blocks submission.
- The add form gains optional controls:
  - Priority select (default `Medium`)
  - Category select (default `Work`)
  - Time input (default `09:00`, may be cleared to `null`)
  - Due date input (default `null`, may be set)
- Keep the form compact. Optional controls may start collapsed behind a
  `More options` toggle, with title + Add button always visible.
- Submitting creates the task, sets `updatedAt`, persists it, and re-derives
  Today, Upcoming, and Daily Progress.

### Edit Task Flow

- Triggered by the row Edit affordance.
- The row swaps in place to an inline edit panel (no modal, no new page).
- Editable fields: title, priority, category, time, due date — same fields
  and controls as the add form.
- Title is required; an empty title disables Save and shows inline
  validation.
- Save updates the task, sets `updatedAt`, writes to `localStorage`, and
  re-derives Today, Upcoming, and Daily Progress.
- Cancel discards changes and closes the panel.
- Keyboard: `Enter` saves, `Esc` cancels.
- Only one row may be in edit mode at a time; opening edit on a second row
  cancels the first without saving.
- Edit/Delete controls are keyboard reachable with visible focus and
  accessible labels; do not rely on hover alone.

### Delete Task Flow

- Triggered by the row Delete affordance.
- The row swaps in place to an inline confirm state:
  `Delete this task?  Delete / Cancel`.
- Inline confirmation is preferred; do not build a modal system.
- Delete is final. No undo, no soft-delete, no trash in Phase 3A.
- Confirming removes the task from state, writes to `localStorage`, and
  re-derives Today, Upcoming, and Daily Progress.
- Cancel returns the row to its normal state.
- Delete controls are keyboard reachable with visible focus and accessible
  labels; do not rely on hover alone.

### Improved Completed-Task Display

#### Today's Tasks

- Completed tasks remain visible but are grouped beneath a subtle
  `Completed` divider label.
- A small count appears beside the divider label
  (for example, `Completed · 2`).
- Completed rows keep their Phase 2 strikethrough and muted styling.
- Incomplete Today tasks appear before completed Today tasks.
- Completing a task moves it beneath the divider; uncompleting moves it back
  into the active group. No manual reordering.
- This is display grouping only — not a filter control.

#### Upcoming Tasks

- Completed future-dated tasks remain visible beneath a subtle
  `Completed` divider with a count, so they can be reopened, edited, or
  deleted.
- Incomplete future tasks appear first; completed future tasks appear beneath
  the divider.
- Completed future rows keep their strikethrough and muted styling.

## Daily Progress Rules

- Daily Progress is calculated only from the tasks shown in Today's Tasks.
- It includes both active and completed Today tasks in the total.
- It excludes Upcoming tasks entirely — including completed future-dated
  tasks. Completed future tasks must not affect Daily Progress.
- The completed count and total update immediately after edits, completion
  changes, and deletion — no manual refresh.
- The zero-task state is handled gracefully (for example,
  `0 of 0 tasks completed`).

## Task Data and localStorage Requirements

### Task Shape

```js
{
  id,          // unchanged string
  title,       // editable string
  completed,   // unchanged boolean
  priority,    // editable: "High" | "Medium" | "Low"
  category,    // editable: "Work" | "Learning" | "Personal" | "Health"
  time,        // editable: "HH:MM" or null
  dueDate,     // editable: "YYYY-MM-DD" or null
  updatedAt    // NEW: ISO timestamp, set on create, edit, complete, and uncomplete
}
```

### Ideas

- Ideas are not modified in Phase 3A. Their shape and behavior are unchanged.

### localStorage Keys

- `dp.tasks` — task list (existing key, extended shape).
- `dp.ideas` — idea list (unchanged).

### Persistence Rules

- Read on initial load; use saved data when valid.
- After every add, edit, delete, complete, and uncomplete: update React
  state and write the full task list back to `dp.tasks`.
- Set `updatedAt` on create, edit, complete, and uncomplete actions.

### Migration of Existing Saved Data

On load, normalize each task with these defaults and validations, then
persist the normalized list. Preserve all existing tasks; leave ideas
completely unchanged.

- Missing `updatedAt` → current ISO timestamp.
- Missing `priority` → `Medium`. If present but not one of
  `High` / `Medium` / `Low`, reset to `Medium`.
- Missing `category` → `Work`. If present but not one of
  `Work` / `Learning` / `Personal` / `Health`, reset to `Work`.
- Missing `time` → `null`. If present but not a valid `HH:MM` 24-hour
  string, reset to `null`.
- Missing `dueDate` → `null` (not today). If present but not a valid
  `YYYY-MM-DD` date string, reset to `null`.
- Missing `completed` → `false`. If present but not a boolean, reset to
  `false`.
- Missing or invalid `id` → generate a new unique id.
- Missing `title` → set to `Untitled` (never discard a task for missing
  title).
- Do not discard or reset existing tasks beyond the normalization above.
- Ideas must remain untouched by migration.

## Accessibility Rules

### Edit and Delete Controls

- Edit and Delete controls are keyboard reachable (part of the tab order).
- They show a visible focus state.
- Icon-only controls carry accessible labels
  (for example, `aria-label="Edit task"` / `aria-label="Delete task"`).
- Do not rely on hover alone to reveal or operate the controls; hover may
  enhance visual prominence, but the controls must be operable without
  hovering.

### Focus Behavior

- Edit opens with focus on the title input.
- Delete confirmation opens with focus on Cancel.
- After save, cancel, delete confirmation, or delete cancellation, restore
  focus to the original triggering control when possible.
- Inline edit and confirm states remain fully operable by keyboard.
- `Enter` saves an edit, `Esc` cancels.
- Focus is managed when a row swaps to edit or confirm state and when it
  returns to normal.

## Empty States

### No Tasks At All

- Keep the Phase 2 empty state with the `+ Add a task` action.

### All Completed (Today's Tasks)

- When every Today task is completed, show a positive message above the
  completed group (for example, `All done for today`).
- The completed group and its count remain visible beneath.

### After Deleting the Last Task

- If the last task is deleted, show the no-tasks empty state with the
  `+ Add a task` action.

### Empty During Edit

- The edit panel's title field may not be empty on save; show inline
  validation rather than a large empty state.

## Acceptance Criteria

Phase 3A is complete when:

- The user can edit a task's title, priority, category, time, and due date
  from the dashboard.
- The user can delete a task with an inline confirmation step.
- The add-task flow accepts optional priority, category, time, and due date.
- Deleted tasks disappear and the change persists after refresh.
- Edited tasks persist after refresh.
- Today's Tasks shows tasks due today, in the past, or with no due date;
  incomplete tasks appear before completed tasks beneath a `Completed`
  divider with a count.
- Upcoming Tasks shows all future-dated tasks — incomplete first, then
  completed beneath a `Completed` divider with a count. Completed future
  tasks are not hidden and can be reopened, edited, or deleted.
- Editing a due date correctly re-derives Today's Tasks vs. Upcoming Tasks.
- Daily Progress is calculated only from Today's Tasks (active + completed),
  excludes Upcoming (including completed future tasks), and updates
  immediately after edits, completion changes, and deletion.
- Existing saved tasks migrate without data loss; ideas are unchanged.
- `updatedAt` is set on create, edit, complete, and uncomplete.
- Edit and Delete controls are keyboard reachable, have visible focus,
  accessible labels, and do not rely on hover alone.
- Edit opens focused on the title input; delete confirmation opens focused
  on Cancel; focus returns to the triggering control after save, cancel, or
  delete.
- The app still uses React, JavaScript, regular CSS, and `localStorage`
  only.
- `npm run build` succeeds.
- `npm run lint` succeeds or any lint issues are explicitly addressed.
- Manually tested in a normal browser at the Vite localhost URL.

## Manual Test Checklist

- Add a task using only a title (defaults applied).
- Add a task setting priority, category, time, and due date.
- Edit each field of an existing task and save.
- Cancel an edit and confirm changes are discarded.
- Delete a task, cancel the confirmation, and confirm it remains.
- Delete a task, confirm, and confirm it is removed.
- Complete a task and confirm it moves beneath the Completed divider in
  Today's Tasks.
- Uncomplete a task and confirm it moves back to active.
- Confirm incomplete Today tasks appear before completed Today tasks.
- Complete a future-dated task and confirm it stays in Upcoming beneath the
  Completed divider, not hidden, and reopenable.
- Edit a Today task's due date to a future date and confirm it moves to
  Upcoming.
- Edit an Upcoming task's due date to today, a past date, or `null` and
  confirm it moves to Today.
- Refresh the browser and confirm all edits and deletes persisted.
- Confirm Daily Progress updates after each change and excludes Upcoming
  (including completed future tasks).
- Delete the last task and confirm the empty state appears.
- Tab to Edit and Delete controls and operate them by keyboard; confirm
  visible focus and labels.
- Confirm Edit opens focused on the title input.
- Confirm Delete confirmation opens focused on Cancel.
- Confirm focus returns to the triggering control after save, cancel, and
  delete.
- Run `npm run build`.
- Run `npm run lint`.

## Do Not Build Yet

- Task detail pages
- Standalone Today, Upcoming, Completed, Ideas, or Categories pages
- Routing
- Filtering or grouping controls
- Responsive or mobile redesign
- Idea editing, deletion, notes, or conversion to tasks
- Custom category creation or management
- Learning and Reading workflows
- Firebase, authentication, backend APIs, database, cloud sync, external
  APIs, TypeScript, and extra npm packages
- Recurring tasks, reminders, and notifications
- Calendar sync
- Dark mode
- Undo for deletes
