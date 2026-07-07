# Phase 4D — YouTube Task Foundation
**Status: APPROVED — Phase 4D is active. Implementation may begin once this documentation checkpoint is committed.**

## 1. Purpose

Phase 4D adds the foundation for YouTube-specific task workflows without
building video playback features yet.

The goal is to let a task choose its workflow through a dedicated task type,
while preserving Category as a separate organizational label. YouTube Tasks get
their own detail workspace with a YouTube video URL field and plain-text notes.
Standard Tasks continue to use the existing Standard Task Detail workspace.

This phase must preserve all completed behavior from Phases 2, 3A, 3B, 4A,
4B, and 4C.

## 2. Product Model: Task Type vs Category

Task Type controls the detail workflow.

Allowed task types:

- `standard`
- `youtube`

Category remains independent organizational metadata.

Allowed categories:

- `Work`
- `Learning`
- `Personal`
- `Health`

Valid combinations include:

- `taskType: 'youtube'` with `category: 'Learning'`
- `taskType: 'youtube'` with `category: 'Personal'`
- `taskType: 'standard'` with `category: 'Learning'`

Category must never choose the detail workspace. A Learning-category task can
be a normal Standard Task.

## 3. Scope

Build:

- Add `taskType` to task data.
- Add `youtubeUrl` and `youtubeNotes` to task data.
- Safely migrate existing saved tasks.
- Add Task Type selection to Add Task -> More options.
- Add Task Type editing to Standard Task Detail.
- Add a dedicated YouTube Task Detail workspace.
- Let Standard Task Detail and YouTube Task Detail change task type through
  local draft state and Save.
- Select detail workspace by `taskType`, not by Category.
- Add YouTube video URL validation.
- Show an accessible external Open video link when a valid URL is saved.
- Preserve origin return, dirty-form protection, completion behavior, delete
  confirmation, and localStorage persistence.

Do not build features listed in the Explicitly Deferred section.

## 4. Explicitly Deferred

Do not build in Phase 4D:

- YouTube Player API.
- Embedded player or preview.
- Playback tracking.
- Resume behavior.
- Timestamp insertion.
- Clickable timestamps or seeking.
- Rich-text editor.
- Formatting toolbar.
- Reading Tasks.
- YouTube, Learning, or Categories sidebar destination.
- New packages.
- Backend APIs.
- Authentication.
- Cloud sync or cloud database.
- External APIs.
- API keys or secrets.

## 5. Existing Task Data and New Task Shape

Existing task fields must remain supported and preserved:

- `id`
- `title`
- `description`
- `completed`
- `completedAt`
- `priority`
- `category`
- `time`
- `dueDate`
- `updatedAt`

Phase 4D adds:

- `taskType`, with allowed values `standard` and `youtube`
- `youtubeUrl`, a string
- `youtubeNotes`, a string

Every task should have one consistent shape after migration or creation,
including Standard Tasks. Standard Tasks carry `youtubeUrl` and `youtubeNotes`
but do not show or use those fields in the Standard workflow.

## 6. Safe localStorage Migration

Continue storing tasks in the existing `dp.tasks` localStorage key.

On initial load, run the task migration and persist the full normalized task
array back to `dp.tasks` immediately after migration.

Migration rules:

- Existing saved tasks migrate to `taskType: 'standard'`.
- Existing tasks with `category: 'Learning'` also migrate to
  `taskType: 'standard'`.
- Do not infer YouTube Tasks from Category.
- Missing or invalid `taskType` becomes `standard`.
- Missing or non-string `youtubeUrl` becomes an empty string.
- Missing or non-string `youtubeNotes` becomes an empty string.
- Existing string values for `youtubeUrl` and `youtubeNotes` are preserved.
- Do not discard an existing saved `youtubeUrl` string during migration merely
  because it does not currently validate.
- Migration must be idempotent.
- Migration must preserve all existing task fields, including `completedAt`,
  `description`, `updatedAt`, `priority`, `category`, `dueDate`, and `time`.
- Migration must preserve completed-phase migration behavior.

Persistence rules:

- Saving a task-type change, `youtubeUrl` change, or `youtubeNotes` change
  updates `updatedAt` using the existing task-edit timestamp behavior.
- Editing unrelated fields preserves a valid `completedAt`.
- `completedAt` changes only when completion state changes.

## 7. New Task Defaults

New tasks must immediately include:

- `taskType: 'standard'`
- `youtubeUrl: ''`
- `youtubeNotes: ''`

Do not rely only on a future browser-refresh migration to add these fields.

If the user selects YouTube Task in Add Task -> More options, the new task
should save with `taskType: 'youtube'` and the same default blank YouTube
fields unless the creation flow later explicitly adds YouTube-specific inputs.

Starter sample data:

- Update existing starter sample tasks so they contain `taskType`, `youtubeUrl`,
  and `youtubeNotes` defaults.
- Do not add, replace, or redesign starter sample tasks solely to demonstrate a
  YouTube Task.

## 8. Add Task Flow

Add Task remains fast and low-clutter.

Default behavior:

- The collapsed Add Task flow creates a Standard Task.
- Task Type defaults to Standard Task.
- Creating a title-only task remains quick.

Add a Task Type selector inside More options, after Description and before
Priority.

Use these UI labels:

- `Standard Task`
- `YouTube Task`

The selector saves:

- Standard Task -> `taskType: 'standard'`
- YouTube Task -> `taskType: 'youtube'`

Do not add a separate YouTube-task creation flow in this phase.

## 9. Inline Editing Boundaries

Do not add Task Type to:

- `TaskEditForm`
- Dashboard row editing
- Today page row editing
- Upcoming page row editing
- Completed page row editing

Existing inline editing must preserve `taskType`, `youtubeUrl`, and
`youtubeNotes` through the existing patch/merge save behavior.

Inline editing may continue to edit only the existing compact fields: title,
priority, category, time, and due date.

## 10. Standard Task Detail Behavior

Standard Task Detail is used when `taskType === 'standard'` or when a task has
no valid task type after migration/defaulting.

Standard Task Detail must continue to support:

- Title
- Description
- Task Type
- Priority
- Category
- Due date
- Time
- Completion
- Delete
- Save
- Back/Cancel
- Origin return
- Dirty-form protection

Task Type is editable in Standard Task Detail.

If the user changes Task Type from Standard Task to YouTube Task:

- Update only the local draft while editing.
- Do not switch the currently open workspace.
- Show this helper message:
  "Save changes to use the YouTube Task workspace."
- On Save, persist `taskType: 'youtube'`, return to the original view, and use
  YouTube Task Detail only the next time the task title is selected.

Standard Task Detail must preserve `youtubeUrl` and `youtubeNotes` when saving,
even though those fields are hidden there.

Dirty-state comparison in Standard Task Detail must include `taskType`.

## 11. YouTube Task Detail Behavior

YouTube Task Detail is used when `taskType === 'youtube'`.

YouTube Task Detail must use the existing task-detail shell and action pattern.

While YouTube Task Detail is open, the global Dashboard heading, greeting,
search field, and Add Task button remain hidden, matching Standard Task Detail.

Opening YouTube Task Detail focuses the Title input.

Title is required.

Save Changes remains clickable when Title is blank.

Attempting to save with a blank Title shows the existing inline validation:
"Task title is required."

A failed blank-title save focuses the Title input.

Use the existing Back, Delete, Save Changes, discard-confirmation, and
delete-confirmation behavior and focus rules wherever practical.

YouTube Task Detail must support shared task fields:

- Title
- Description
- Task Type
- Priority
- Category
- Due date
- Time
- Completion
- Delete
- Save
- Back/Cancel
- Origin return
- Dirty-form protection

YouTube Task Detail also adds:

- YouTube video URL
- Plain-text YouTube notes textarea
- Optional Open video link for a valid saved URL

Task Type is editable in YouTube Task Detail.

If the user changes Task Type from YouTube Task to Standard Task:

- Update only the local draft while editing.
- Do not switch the currently open workspace.
- Show this helper message:
  "Save changes to use the Standard Task workspace."
- On Save, persist `taskType: 'standard'`, return to the original view, and use
  Standard Task Detail only the next time the task title is selected.

Dirty-state comparison in YouTube Task Detail must include:

- Shared editable task fields
- `taskType`
- `youtubeUrl`
- `youtubeNotes`

## 12. YouTube Task Detail Layout

Reuse the existing task-detail shell, design tokens, spacing, and visual
language.

On desktop, use a two-column workspace below the detail header.

Left column:

- YouTube video URL input
- Open video link when valid and saved
- Task Type
- Priority
- Category
- Due Date
- Time
- Completion controls

Right column:

- YouTube Notes textarea with enough vertical space for meaningful notes

Do not render in this phase:

- Video player area
- Fake player placeholder
- Video thumbnail
- Disabled Resume button
- Disabled timestamp control
- Other player-related interface

The Learning/YouTube mockup may guide visual hierarchy only. Player behavior
remains deferred.

## 13. Task-Type Transition Rules

Changing Task Type updates only local draft state until Save.

Do not switch the currently open detail workspace during editing.

After Save:

- Return to the task's original view normally.
- The task opens in its appropriate new workspace only the next time its title
  is selected.

Standard -> YouTube:

- Save shared fields and `taskType: 'youtube'`.
- Preserve existing/default `youtubeUrl` and `youtubeNotes`.
- Return to origin.
- Next title selection opens YouTube Task Detail.

YouTube -> Standard:

- Save shared fields and `taskType: 'standard'`.
- Preserve `youtubeUrl` and `youtubeNotes`.
- Return to origin.
- Next title selection opens Standard Task Detail.

Never silently delete `youtubeUrl` or `youtubeNotes`.

Changing only Category, including Learning <-> Personal, must never change the
selected detail workspace.

## 14. YouTube Video URL Rules

The field label is:

- `YouTube video URL`

The field may be blank.

A YouTube Task may be created, saved, and completed with a blank YouTube video
URL. The URL can be added later.

Before saving, trim surrounding whitespace only.

For nonblank values, use the browser URL parser for validation.

Allowed protocols:

- `http:`
- `https:`

Allowed hostnames, matched case-insensitively and exactly:

- `youtube.com`
- `www.youtube.com`
- `m.youtube.com`
- `youtu.be`

Reject lookalikes such as:

- `youtube.com.example.com`

Invalid nonblank input blocks Save and shows inline validation.

A migrated or otherwise persisted invalid `youtubeUrl` remains visible as
stored and does not show an Open video link.

In YouTube Task Detail, a persisted invalid `youtubeUrl` must be corrected or
cleared before a Save that validates the visible URL can succeed.

Migration must never erase a persisted invalid `youtubeUrl` solely because it
is invalid.

Do not:

- Rewrite URLs.
- Normalize URLs beyond trimming surrounding whitespace.
- Parse video IDs.
- Create an embed.
- Use the YouTube Player API.
- Save playback position.
- Add resume functionality.
- Discard an existing saved string during migration merely because it does not
  currently validate.

When a valid URL has been saved, show an accessible Open video link that opens
the URL in a new browser tab with safe external-link attributes.

## 15. YouTube Notes Rules

`youtubeNotes` is a separate plain-text field from `description`.

`description` remains general shared task metadata.

`youtubeNotes` is the dedicated future-safe field for YouTube-learning notes
and can later evolve into timestamped or rich notes.

Use a normal textarea.

Preserve meaningful line breaks.

Do not add:

- Rich-text editor.
- Formatting toolbar.
- Timestamp insertion.
- Clickable timestamps.
- Seeking behavior.

## 16. Navigation, Origin Return, Dirty Form, Delete, and Completion Rules

Task titles may open detail from:

- Dashboard
- Today
- Upcoming
- Completed

Detail workspace selection is based only on saved `taskType`.

Origin return rules:

- Opening from Dashboard returns to Dashboard.
- Opening from Today returns to Today.
- Opening from Upcoming returns to Upcoming.
- Opening from Completed returns to Completed.

Back, Save, Delete, and confirmed discard must return to the originating view.

Dirty-form behavior must remain consistent with Phase 4B and Phase 4C:

- Do not silently discard unsaved changes.
- Show the existing inline discard confirmation pattern.
- Keep Editing leaves the draft intact.
- Discard Changes abandons the draft and completes the requested navigation.
- Delete confirmation and discard confirmation must not conflict.

Completion behavior must remain consistent with current behavior:

- Completing a task sets `completed: true`.
- Completing from detail sets `completedAt` when moving from incomplete to
  complete.
- Reopening a task clears `completedAt` when moving from complete to incomplete.
- Editing unrelated fields preserves valid `completedAt`.

Delete behavior must remain consistent with Standard Task Detail:

- Delete requires inline confirmation.
- Confirm permanently removes the task.
- Cancel returns to the detail form.

## 17. Accessibility and Focus Requirements

Preserve existing accessibility and focus behavior from completed phases.

Requirements:

- Task titles that open detail remain real buttons or equivalent accessible
  controls.
- Opening a detail workspace focuses the Title input.
- All controls have labels.
- Inline validation messages are visible and associated with the failed action.
- Opening delete confirmation focuses Cancel.
- Opening discard confirmation focuses Keep Editing.
- The Open video link has clear accessible text and opens in a new tab.
- External-link attributes must be safe for a new tab.
- Textareas allow Enter to create line breaks.
- Keyboard behavior for existing row edit/delete controls remains unchanged.

## 18. Regression Boundaries

Do not regress:

- Dashboard task and idea cards.
- Add Task fast capture.
- Inline task edit/delete.
- Today category filters.
- Today overdue, today, and completed-today sections.
- Upcoming incomplete-future-only behavior.
- Completed grouping and sorting by `completedAt`.
- Task row checkbox, title, edit, and delete separation.
- Standard Task Detail origin tracking and dirty navigation protection.
- Quick Ideas workspace behavior.
- localStorage persistence and migration.

Do not introduce:

- Category-based detail selection.
- Learning sidebar destination.
- YouTube sidebar destination.
- React Router.
- New packages.
- Backend/API/cloud/auth functionality.

## 19. Acceptance Criteria

Phase 4D is acceptable when:

- `taskType` supports `standard` and `youtube`.
- Existing saved tasks migrate safely to `taskType: 'standard'`.
- Normalized tasks are written back to `dp.tasks` immediately after migration
  on initial load.
- Existing `category: 'Learning'` tasks migrate to `taskType: 'standard'`.
- Category remains independent and never controls detail workspace selection.
- New tasks immediately include `taskType: 'standard'`, `youtubeUrl: ''`, and
  `youtubeNotes: ''`.
- Existing starter sample tasks retain their original purpose while receiving
  `taskType`, `youtubeUrl`, and `youtubeNotes` defaults.
- Add Task -> More options includes Task Type with labels Standard Task and
  YouTube Task.
- Inline editing does not expose Task Type and preserves YouTube fields.
- Standard Task Detail includes Task Type and handles Standard -> YouTube
  transition messaging.
- YouTube Task Detail includes shared fields, YouTube video URL, YouTube notes,
  Task Type, Save, Delete, Back, completion, dirty protection, and origin
  return.
- YouTube Task Detail uses a desktop two-column layout with no fake player,
  thumbnail, disabled Resume, or timestamp controls.
- YouTube Task Detail blank-title validation matches Standard Task Detail:
  Save Changes remains clickable, shows "Task title is required.", and focuses
  the Title input.
- YouTube Task Detail handles YouTube -> Standard transition messaging.
- YouTube URL validation follows the approved protocol and hostname rules.
- Blank YouTube URLs can be saved.
- Valid saved YouTube URLs show an accessible Open video external link.
- Persisted invalid YouTube URLs remain visible, show no Open video link, and
  can be corrected or cleared.
- `youtubeUrl` and `youtubeNotes` survive Standard <-> YouTube task type
  changes.
- `updatedAt` changes after task-type, YouTube URL, and YouTube Notes saves.
- Editing unrelated fields preserves valid `completedAt`.
- Completed Phase 2, 3A, 3B, 4A, 4B, and 4C behavior remains intact.
- `npm run build` passes before declaring implementation complete.
- `npm run lint` passes before declaring implementation complete.
- Manual browser testing is completed in a normal browser before declaring
  implementation complete.

## 20. Manual Browser Test Checklist

- Existing saved tasks migrate to Standard Task, including existing
  Learning-category tasks.
- Normalized tasks are written back to `dp.tasks` after migration on initial
  load.
- Existing sample tasks keep their original titles/purpose and receive
  `taskType`, `youtubeUrl`, and `youtubeNotes` defaults.
- New collapsed Add Task creates a Standard Task with default YouTube fields.
- Add Task -> More options can create a YouTube Task.
- Standard Tasks open Standard Task Detail from Dashboard, Today, Upcoming, and
  Completed.
- YouTube Tasks open YouTube Task Detail from Dashboard, Today, Upcoming, and
  Completed.
- Changing Category alone never changes the detail workspace.
- Standard Task Detail changing Task Type to YouTube Task shows:
  "Save changes to use the YouTube Task workspace."
- Saving Standard -> YouTube returns to origin and opens YouTube Task Detail on
  the next title selection.
- YouTube Task Detail changing Task Type to Standard Task shows:
  "Save changes to use the Standard Task workspace."
- Saving YouTube -> Standard returns to origin and opens Standard Task Detail on
  the next title selection.
- Existing `youtubeUrl` and `youtubeNotes` survive both type transitions.
- Blank YouTube video URL saves successfully.
- Invalid nonblank YouTube video URL blocks Save with inline validation.
- Approved YouTube hostnames save successfully, including mixed-case hostnames.
- Lookalike hostnames such as `youtube.com.example.com` are rejected.
- A persisted invalid YouTube URL remains visible, shows no Open video link,
  and can be corrected or cleared before Save.
- A valid saved URL displays an Open video link with safe new-tab behavior.
- YouTube notes preserve line breaks and persist after refresh.
- Saving a task-type change updates `updatedAt`.
- Saving a YouTube URL change updates `updatedAt`.
- Saving a YouTube Notes change updates `updatedAt`.
- YouTube Task Detail blank-title Save shows "Task title is required." and
  focuses the Title input.
- On desktop, YouTube Task Detail uses a two-column workspace and shows no fake
  player, thumbnail, disabled Resume, or timestamp controls.
- Dirty navigation protection works in both detail workspaces.
- Delete confirmation works in both detail workspaces.
- Completion and reopening update `completedAt` correctly.
- Today filters, Upcoming, Completed, Dashboard, Quick Ideas, inline edit/delete,
  and localStorage behavior remain intact.

## 21. Likely Implementation Files

Likely new file:

- `src/components/YouTubeTaskDetail.jsx`

Likely modified files:

- `src/App.jsx`
- `src/components/AddTaskForm.jsx`
- `src/components/StandardTaskDetail.jsx`
- `src/data/migrate.js`
- `src/hooks/useLocalStorage.js`
- `src/data/sampleData.js`
- `src/styles/task-detail.css` or a focused YouTube detail stylesheet

Possible helper extraction, only if it reduces real duplication without a broad
refactor:

- Shared detail form utilities for dirty checks, task-type labels, URL
  validation, or confirmation behavior.

Do not modify row inline-edit components to expose Task Type.

## 22. Do Not Build Yet

This specification is approved as the source of truth for Phase 4D.

Do not implement Phase 4D until this documentation checkpoint is committed and
the user explicitly requests implementation.
