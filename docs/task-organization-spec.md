# Task Organization Spec — Phase 3B

## Purpose

Phase 3B is a small, optional refinement that improves task scanning on the
existing dashboard. It adds two lightweight visual aids: category filter chips
in the Today's Tasks card header and a priority-colored left border on task
rows.

Phase 3A behavior is established and must not be redesigned or weakened.
This phase changes only display and a session-only filter — no task data,
localStorage, migration, sorting, or derivation rules change.

## Scope

### Included This Phase

- Category filter chips in the Today's Tasks card header.
- Priority-colored left border on task rows in Today's Tasks and Upcoming
  Tasks.

### Explicitly Deferred

- Standalone Today, Upcoming, Completed, Ideas, or Categories pages
- Routing, React Router, URLs, or navigation destinations
- Task detail pages
- Advanced or global search
- Saved or persistent filters
- Multi-select, bulk actions, drag-and-drop, manual sorting, or sort controls
- Category management or custom category creation
- Grouping tasks into separate category sections
- Any Quick Ideas changes
- Learning and Reading workflows
- Responsive or mobile redesign or dark mode
- New packages, Firebase, auth, backend, cloud sync, APIs, TypeScript

## Interaction and Display Rules

### Feature 1: Category Filter Chips (Today's Tasks only)

#### Chip Options

A compact row of clickable chips appears in the Today's Tasks card header,
below the card title row and above the task list:

- `All` · `Work` · `Learning` · `Personal` · `Health`

#### Default State

- `All` is selected on initial render and after a full page refresh.
- Selection is session-only React state inside `TodayTasksCard`. It must
  **not** be saved to `localStorage` and must reset to `All` on reload.

#### Behavior

- Selecting a chip filters the visible Today's Tasks rows to that category.
- Selecting `All` shows every task regardless of category.
- The active chip has a visually distinct selected state (filled background
  using `--color-accent-soft` and accent-colored text).
- Selecting the already-active chip is a no-op.
- Only one chip may be active at a time.

#### Card Count Badge

- The count badge in the card header reflects the **filtered** count, not the
  total Today's Tasks count, so the number matches what the user sees.
  - Example: if 8 tasks are due today but only 3 are `Work`, selecting `Work`
    shows `3` in the count badge.
  - When `All` is selected, the badge shows the total.

#### Dashboard Scope Boundary

- The category filter affects only the visible rows, count badge, overdue divider,
  completed divider, and filtered-empty message inside Today's Tasks.
- Daily Progress remains calculated from all Today's Tasks, not the filtered
  category view.
- Upcoming Tasks, Quick Ideas, and all other dashboard areas remain unaffected
  by the selected category filter.

#### Overdue Divider

- The `Overdue · N` divider and count reflect only the **filtered** overdue
  tasks. If the active filter has no overdue tasks, the overdue divider does
  not appear even if overdue tasks exist in other categories.

#### Completed Divider

- The `Completed · N` divider and count reflect only the **filtered** completed
  tasks. If the active filter has no completed tasks, the divider does not
  appear.

#### Empty States

- If the Today's Tasks card has zero tasks total, show the existing Phase 3A
  no-tasks empty state regardless of the selected chip.
- If tasks exist but the selected category has zero matching tasks, show a
  compact inline message: `No {Category} tasks for today` (for example,
  `No Health tasks for today`). Do not show the large empty-state block with
  the `+ Add a task` action in this case — the user just needs to pick a
  different chip.

#### Interactions Preserved

- Adding, editing, completing, uncompleting, and deleting tasks all work
  exactly as in Phase 3A. The filter is applied to the current task list
  after every state change.
- Editing a task's category to a value excluded by the active filter
  immediately removes it from the visible list.
- The inline edit and delete-confirmation states are unaffected by the
  filter — the row in edit/confirm mode stays visible even if its category
  no longer matches the filter, until the action completes.
- The `+ Add a task` form and the `All done for today` message are unaffected
  by the filter and remain in their existing positions.

#### Sorting

- Phase 3A sorting rules are preserved exactly. The filter is applied
  **before** sorting — filter the task list to the selected category, then
  sort the filtered list using the existing `sortTodayTasks` comparator.

#### Layout

- The chip row sits between the card header (title + count + View all) and
  the task list body.
- Chips are small, pill-shaped, and use the existing spacing tokens.
- The row must not make the card header feel crowded — keep it to a single
  line with `flex-wrap: wrap` as a safety net.

### Feature 2: Priority-Colored Left Border

#### Display

- Each task row gets a subtle 3px left border colored by the task's priority:
  - `High` → `--color-danger` (red, matching the existing High badge)
  - `Medium` → `--color-warn` (amber, matching the existing Medium badge)
  - `Low` → `--color-success` (green, matching the existing Low badge)
- The border is applied via a CSS class on the `.task-row` element based on
  the task's priority.

#### Consistency

- Applied to the reusable `TaskRow` component so it appears in both Today's
  Tasks and Upcoming Tasks rows automatically.
- Also applied to the `UpcomingTaskRow` in `UpcomingTasksCard` (which does
  not use the shared `TaskRow` component) for visual consistency.

#### Constraints

- Do not change task-row layout, spacing, padding, actions, sorting, or the
  existing priority badges.
- The border must not shift row content or change row height. Use
  `border-left` with `box-sizing: border-box` (already set globally) so the
  3px border is absorbed into the existing row width.
- Completed rows keep the border but it may be dimmed (lower opacity) to
  match the muted completed-row treatment.

## Accessibility Requirements

### Filter Chips

- Each chip is a real `<button>` element in the tab order.
- Chips use `role="group"` on the container with an `aria-label` such as
  `Filter tasks by category`.
- The active chip uses `aria-pressed="true"`; inactive chips use
  `aria-pressed="false"`.
- Each chip has a visible `:focus-visible` outline using `--color-accent`.
- Chips are operable by keyboard: `Tab` to move between chips, `Enter` or
  `Space` to select.

### Priority Border

- The priority border is purely decorative. It must not be focusable and
  carries no `aria` attributes. The existing priority badge text already
  conveys the priority to assistive technology.

## Data and localStorage Rules

- No changes to the task shape, idea shape, localStorage keys, migration
  logic, or persistence behavior.
- The category filter is session-only React state and is never written to
  `localStorage`.
- No new fields, no new keys, no migration changes.
- Phase 3A migration and validation rules remain exactly as written in
  `docs/task-management-spec.md`.

## Acceptance Criteria

Phase 3B is complete when:

- Today's Tasks shows a row of category filter chips: `All`, `Work`,
  `Learning`, `Personal`, `Health`.
- `All` is selected by default and shows all Today's Tasks.
- Selecting a category chip filters the visible rows to that category.
- The card count badge reflects the filtered count.
- The overdue and completed dividers reflect only filtered tasks.
- A filtered-empty state shows `No {Category} tasks for today` when the
  category has no matching tasks but tasks exist overall.
- The filter resets to `All` on page refresh (not persisted).
- Adding, editing, completing, uncompleting, and deleting tasks work
  correctly under any active filter.
- Editing a task's category to a non-matching value removes it from the
  filtered view immediately.
- The inline edit/delete state remains visible even if the task's category
  no longer matches the filter.
- Each task row shows a 3px left border colored by priority in both Today's
  Tasks and Upcoming Tasks.
- The border does not shift row content or change row height.
- Completed rows show a dimmed priority border.
- Filter chips are keyboard reachable with visible focus and
  `aria-pressed` semantics.
- Phase 3A sorting, overdue display, `Any time` label, completed grouping,
  accessibility, and localStorage migration all work unchanged.
- The app still uses React, JavaScript, regular CSS, and `localStorage` only.
- `npm run build` succeeds.
- `npm run lint` succeeds or any lint issues are explicitly addressed.
- Manually tested in a normal browser at the Vite localhost URL.

## Manual Test Checklist

- Confirm the chip row appears in Today's Tasks with `All`, `Work`,
  `Learning`, `Personal`, `Health`.
- Confirm `All` is selected by default.
- Click each category chip and confirm only matching tasks are shown.
- Confirm the count badge updates to the filtered count.
- Confirm overdue and completed dividers reflect only filtered tasks.
- Select a category with no tasks and confirm `No {Category} tasks for today`
  appears.
- Add a task in the active category and confirm it appears immediately.
- Add a task in a different category and confirm it does not appear under the
  active filter.
- Edit a visible task's category to a non-matching value and confirm it
  disappears from the filtered view.
- Complete a task under an active filter and confirm it moves beneath the
  Completed divider correctly.
- Delete a task under an active filter and confirm it is removed.
- Refresh the page and confirm the filter resets to `All`.
- Confirm the chip row is not crowded and the card header remains clean.
- Tab through the chips and confirm visible focus and `aria-pressed` state.
- Confirm each task row has a 3px left border matching its priority color.
- Confirm the border appears on rows in both Today's Tasks and Upcoming Tasks.
- Confirm the border does not shift row content or change row height.
- Complete a task and confirm the border dims.
- Confirm Phase 3A sorting and overdue display are unchanged.
- Run `npm run build`.
- Run `npm run lint`.

## Likely Implementation Files

These files would change during implementation. They are **not** modified by
this spec.

| File | Change |
|---|---|
| `src/components/TodayTasksCard.jsx` | Add category filter state, chip row, apply filter before sort/render, update count badge and empty states |
| `src/components/TaskRow.jsx` | Add priority-based left-border class to the row element |
| `src/components/UpcomingTasksCard.jsx` | Add the same priority-based left-border class to `UpcomingTaskRow` |
| `src/styles/task-row.css` | Add filter chip styles, priority border classes, dimmed border for completed rows |

No changes to: `Dashboard.jsx`, `App.jsx`, `useLocalStorage.js`, `storage.js`,
`migrate.js`, `sampleData.js`, `dateTime.js`, `AddTaskForm.jsx`,
`TaskEditForm.jsx`, `TaskDeleteConfirm.jsx`, `QuickIdeasCard.jsx`, or any
Phase 3A CSS beyond `task-row.css`.

## Do Not Build Yet

- Standalone Today, Upcoming, Completed, Ideas, or Categories pages
- Routing, React Router, URLs, or navigation destinations
- Task detail pages
- Advanced or global search
- Saved or persistent filters
- Multi-select, bulk actions, drag-and-drop, manual sorting, or sort controls
- Category management or custom category creation
- Grouping tasks into separate category sections
- Any Quick Ideas changes
- Learning and Reading workflows
- Responsive or mobile redesign or dark mode
- New packages, Firebase, auth, backend, cloud sync, APIs, TypeScript
