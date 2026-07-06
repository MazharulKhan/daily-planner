# Standard Task Detail Spec — Phase 4B

**Status: IMPLEMENTED — Phase 4B is complete.**

## Purpose

Add a dedicated Standard Task Detail workspace for viewing and editing a normal task comfortably.

The Dashboard remains the quick place to add, complete, edit, and scan tasks. The detail workspace adds a proper optional Description field and a fuller editing experience.

This phase prepares for a later Quick Idea conversion feature:

```text
Idea text  → Task title
Idea notes → Task description
```

Do not build idea conversion yet.

---

## Scope

### Build

- Add optional `description` to task data.
- Add an optional multi-line Description field inside Add Task → More options.
- Allow task titles in Today and Upcoming to open Standard Task Detail.
- Build a detail workspace for editing:
  - Title
  - Description
  - Priority
  - Category
  - Due date
  - Time
  - Completion checkbox state
- Add Save, Cancel/Back, and inline Delete confirmation.
- Safely migrate old saved tasks to `description: ''`.
- Preserve all existing dashboard behavior.

### Do not build

- Quick Idea conversion
- Learning or Reading task workflows
- Task-type picker or new `taskType` field
- Standard Tasks sidebar item
- Dedicated Today, Upcoming, or Completed pages
- React Router, routes, URLs, or deep links
- Search changes
- Dark mode or responsive redesign
- Firebase, backend, authentication, APIs, or packages
- Undo, trash, reminders, recurring tasks, or attachments

---

## Core Decisions

1. A Standard Task is the app’s existing default task. Do not create a new task type field.

2. There is no Standard Tasks sidebar item. Tasks are opened from Dashboard task lists.

3. Clicking a task **title** in Today or Upcoming opens its detail workspace.
   - Do not make the full row clickable.
   - Checkbox, Edit, Delete, and title controls remain separate.
   - While a row is in inline edit or delete-confirmation mode, its title must not open detail.

4. Add Task remains fast:
   - Title is required.
   - More options remains collapsed by default.
   - Description is optional inside More options.
   - Creating a task does not automatically open detail.

5. Dashboard inline editing stays compact and does not gain a Description field.
   - Detail workspace is the main place to read and edit descriptions.
   - Dashboard inline edits must preserve an existing description.

6. Use current React state view switching only.
   - No router.
   - Refresh returns to Dashboard.
   - Task data remains in `localStorage`.

---

## Add Task Changes

Add Description as the first field inside More options:

```text
Description
Priority
Category
Due date
Time
```

Rules:

- Use a multi-line textarea.
- Description is optional.
- Preserve meaningful line breaks.
- Trim outer whitespace on save.
- A blank or whitespace-only Description saves as `''`.
- A title-only task must still save normally.

Example fast capture:

```text
Title: Buy groceries
[Add Task]
```

Example planned task:

```text
Title: Research Firebase migration

[More options]

Description:
Compare Firestore, Authentication, and Storage.
Write a migration plan for the Daily Planner.

Priority: High
Category: Learning
Due date: July 10
Time: 2:00 PM
```

---

## Detail Workspace Behavior

### Navigation

- Detail workspace renders in the existing main content area.
- Sidebar stays visible.
- Dashboard remains visually active while task detail is open.
- Dashboard and Quick Ideas sidebar navigation remain available.
- Today, Upcoming, and Completed remain non-interactive placeholders.

### Unsaved changes

A form is dirty when its Title, Description, Priority, Category, Due date, Time, or completion checkbox state differs from the saved task.

When leaving a dirty detail workspace through Back, Dashboard, or Quick Ideas, show an inline confirmation:

```text
Discard unsaved changes?

[Discard Changes] [Keep Editing]
```

- Do not silently discard changes.
- Do not use a modal.
- Discard Changes abandons the draft and completes the requested navigation.
- Keep Editing closes the confirmation and leaves the form unchanged.
- Delete confirmation and discard confirmation cannot be active at the same time.

### Header

While task detail is open, hide the normal global Dashboard header, including:

- Dashboard title and greeting
- Search field
- Global `+ Add Task` button

The detail workspace provides its own header:

```text
← Back to Dashboard                  [Delete Task] [Save Changes]
```

---

## Visual Direction

Use the Standard Task Detail reference image as the visual target.

- Keep the fixed sidebar and existing light desktop design.
- Use a wide, clean content area with generous spacing.
- Put a Back link at the upper left.
- Put Delete Task and Save Changes at the upper right.
- Place a completion checkbox beside the editable task title.
- Show a small muted Created / Updated line below the title.
- Put a full-width Description textarea below a subtle divider.
- Use a two-column grid for metadata:
  - Priority / Due date
  - Category / Time
- The completion checkbox beside the title is the only editable completion control.
- An optional small read-only label may display `Completed` or `Incomplete` based on the checkbox state.
- Do not add an editable Status dropdown.
- Put a quiet informational “About this task” or last-updated area beneath metadata.
- Put Cancel and Save Changes in a footer action area.
- Reuse existing CSS variables, buttons, input styling, spacing, borders, and card language.
- Do not redesign Dashboard cards, task rows, category chips, or priority markers.

---

## Form Rules

Required controls:

- Completion checkbox or toggle
- Title input
- Description textarea
- Priority select: High, Medium, Low
- Category select: Work, Learning, Personal, Health
- Due date input
- Time input
- Save Changes
- Cancel / Back
- Delete Task

Completion uses the existing `completed` boolean only.

- Checked means `completed: true`.
- Unchecked means `completed: false`.
- Do not add a separate editable Status select or status field.

### Validation

- Title is required.
- Trim Title before saving.
- A blank title must not save.
- Show inline text: `Task title is required.`
- Description may be empty.

### Saving

On Save Changes:

1. Validate and normalize the form.
2. Update the task and set `updatedAt` to the current ISO timestamp.
3. Persist through the existing task update flow.
4. Return to Dashboard.
5. Existing Today/Upcoming placement, sorting, filters, overdue display, completed groups, and Daily Progress update through current logic.

Changing a task due date must retain current behavior:

- Future date → Upcoming
- Today, past, or no date → Today

Changing completion must retain current behavior:

- Today task → active or Completed Today group
- Future task → active or Completed Upcoming group
- Daily Progress counts Today tasks only

---

## Delete and Cancel

### Delete

Delete Task opens an inline confirmation:

```text
Delete this task permanently?

[Confirm Delete] [Cancel]
```

- Do not use a modal.
- Confirm permanently removes the task and returns to Dashboard.
- Cancel returns to the task detail form.
- No undo or trash.

### Cancel / Back

- A clean form returns to Dashboard immediately.
- A dirty form uses the discard confirmation.
- Cancel never saves draft changes.

---

## Data and Migration

Extend each task:

```js
{
  id,
  title,
  description, // NEW: string, defaults to ''
  completed,
  priority,
  category,
  time,
  dueDate,
  updatedAt,
}
```

Migration rules:

- Missing or non-string `description` becomes `''`.
- Valid existing descriptions are preserved.
- Keep all existing Phase 3A migration and validation rules unchanged.
- Continue using `dp.tasks`; do not add a storage key.
- Save the normalized task list after migration.
- Migration must be idempotent.
- Task updates must merge with the existing task so an inline dashboard edit never erases `description`.

Conceptually:

```js
{
  ...existingTask,
  ...allowedUpdates,
  updatedAt: new Date().toISOString(),
}
```

---

## Accessibility

- Task titles that open detail are real buttons or link-style buttons.
- Give them visible focus and an accessible name.
- Opening detail focuses the Title input.
- Use labels for all form fields.
- Opening Delete confirmation focuses Cancel.
- Opening discard confirmation focuses Keep Editing.
- Description textarea must allow Enter to create new lines without submitting the form.
- Existing keyboard behavior for dashboard inline Edit/Delete must remain unchanged.

---

## Acceptance Checklist

- [ ] Existing tasks migrate safely with `description: ''`.
- [ ] Add Task → More options includes optional multi-line Description.
- [ ] Title-only tasks still create quickly.
- [ ] Tasks can be created with a description and metadata.
- [ ] Clicking Today and Upcoming task titles opens the correct detail workspace.
- [ ] Checkbox, Edit, Delete, and title-opening controls do not conflict.
- [ ] Detail workspace edits all required task fields.
- [ ] Title validation prevents blank saves.
- [ ] Description persists after refresh.
- [ ] Dashboard inline edits preserve descriptions.
- [ ] Save updates `updatedAt` and existing Dashboard derivations.
- [ ] Dirty detail edits require confirmation before leaving.
- [ ] Delete requires confirmation and persists after refresh.
- [ ] Existing sorting, filters, priority markers, overdue display, completed grouping, and Daily Progress still work.
- [ ] No routes, packages, backend, Firebase, or task-type fields were added.
- [ ] `npm run build` passes.
- [ ] `npm run lint` passes.
- [ ] Browser testing is completed at the Vite localhost URL.

---

## Likely Files

### New

- `src/components/StandardTaskDetail.jsx`
- `src/styles/task-detail.css`

### Modified

- `src/App.jsx`
- `src/components/Header.jsx`
- `src/components/Sidebar.jsx`
- `src/components/Dashboard.jsx`
- `src/components/TodayTasksCard.jsx`
- `src/components/TaskRow.jsx`
- `src/components/UpcomingTasksCard.jsx`
- `src/components/AddTaskForm.jsx`
- `src/hooks/useLocalStorage.js`
- `src/data/migrate.js`
- `src/index.css`

`src/styles/task-row.css` may receive only small additive title-button styling if necessary. Do not redesign existing task rows.

---

## Before Implementation

After approving this spec:

1. Update `AGENTS.md` to mark Phase 4B active and add this spec to the requirements list.
2. Update `docs/project-status.md` to mark Phase 4B active and correct the Phase 4A commit status to `75b62b9`.
3. Ask OpenChamber for a plan only. It must inspect the relevant current source files before proposing implementation.
4. Review and approve its plan before any code changes.