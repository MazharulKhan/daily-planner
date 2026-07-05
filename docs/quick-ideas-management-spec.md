# Quick Ideas Management Spec — Phase 4A

**Status: APPROVED.**  
Phase 4A is active. Implementation may begin from this approved specification.

---

## 1. Purpose

Upgrade Quick Ideas from a dashboard-only capture-and-preview feature into a full management workspace where users can view all ideas, expand them to read and edit supporting notes, and delete ideas with confirmation.

The dashboard Quick Ideas card stays a compact quick-capture surface and recent-ideas preview, while the new dedicated workspace handles browsing, expansion, editing, and deletion.

---

## 2. Scope

In scope for Phase 4A:

- Switch between the Dashboard and a dedicated **Quick Ideas workspace** using React state (no routing library).
- Dashboard Quick Ideas card remains functional as a quick-capture preview.
- A dedicated Quick Ideas workspace with a create form, sort order (newest first), expand/collapse per idea, inline edit for main text and notes, and delete with confirmation.
- Idea data shape extended with `notes` and `updatedAt`.
- Safe `localStorage` migration for existing saved ideas.
- Keyboard focus management and accessibility labels.

Out of scope (see Explicitly Deferred):

- Routing, URLs, or page refreshes preserving workspace selection. After a browser refresh the app returns to Dashboard; the active workspace and expanded/selected idea are not persisted.
- External services, backend APIs, cloud sync, or extra npm packages.
- Task conversion from ideas.
- Dark mode, search, mobile redesign, undo/trash.

---

## 3. Explicitly Deferred

The following remain intentionally unbuilt in Phase 4A:

- **Convert to Task** — deferred until the Standard Task Detail workspace provides a description/detail field that can safely receive an idea’s notes.
- **React Router or URL routes** — workspace switching is app-level React state only.
- **Global search** inside the Quick Ideas workspace.
- **Categories, tags, or priority** on ideas.
- **Undo, trash, or soft delete** — deletion is permanent after confirmation.
- **Learning and Reading task types** — these are future task types, not sidebar destinations.
- **Dark mode, responsive/mobile redesign, animations** beyond simple expand/collapse height transitions if desired.

---

## Key Implementation Decisions

These product decisions are binding for Phase 4A implementation:

1. **Header behavior** — When the Quick Ideas workspace is active, hide the global Dashboard heading and greeting/subtitle area. Keep the existing search input and + Add Task button globally visible.
2. **Dashboard preview scope** — The Dashboard Quick Ideas card displays only the three newest ideas.
3. **Separate workspace capture form** — Keep `AddIdeaForm` compact for the Dashboard card. Build a larger, always-visible multi-line capture form directly inside `QuickIdeasWorkspace`.
4. **Sidebar interaction scope** — Only Dashboard and Quick Ideas are real, keyboard-accessible sidebar navigation controls. Today, Upcoming, and Completed remain visual, non-interactive placeholders until their pages are approved.
5. **Edit/delete protection** — Do not silently switch ideas or discard input during edit or delete confirmation. Disable or visually mute conflicting controls until the user explicitly saves, cancels, confirms deletion, or cancels the delete confirmation.

---

## 4. Navigation and View Behavior

- The app continues to use **React state** for top-level view switching. No router is added.
- The top-level app component uses simple React state to switch between the Dashboard and the Quick Ideas workspace. No router is added.
- The sidebar navigation list remains exactly the five items approved on 2026-07-04:
  1. Dashboard
  2. Today
  3. Upcoming
  4. Completed
  5. Quick Ideas
- Clicking **Quick Ideas** in the sidebar opens the workspace with no idea selected or expanded.
- Clicking **Dashboard** returns to the Dashboard view.
- The active sidebar item uses the existing `sidebar__nav-item--active` class styling.
- Today, Upcoming, and Completed sidebar items remain visual placeholders (no view change) unless the user explicitly approves a future phase.
- On a browser refresh, the app returns to the Dashboard view. The active workspace and any selected or expanded idea are not persisted.
- When the Quick Ideas workspace is active, the app header must not display a Dashboard page heading. The header should either show Quick Ideas context or remain neutral.

---

## 5. Dashboard Quick Ideas Card Behavior

The existing `QuickIdeasCard` is modified, not replaced:

- **Card header**: `"Quick Ideas"` title + count badge + plus action button to open the inline add form.
- **Inline add form**: keep the compact add flow. Change the input to a multi-line textarea to match the new create rule, but keep it compact within the card.
- **Idea list**: shows the three most recent ideas, newest first. Each idea row includes a dedicated control (for example, a button or clearly clickable header) to open the workspace with that idea expanded. This control is separate from any Edit or Delete actions.
  - Clicking that control opens the dedicated Quick Ideas workspace with **that idea expanded**.
  - If the selected idea no longer exists (for example, it was deleted in another session), open the workspace normally with all ideas collapsed.
  - Rows show the idea text and relative timestamp. Notes are not shown in the card.
- **Footer**: `"View all Quick Ideas"` text button. Clicking it opens the dedicated workspace with **no idea preselected** (all collapsed).
- Do **not** build a dashboard-only detail panel, duplicate editor, or popup overlay. The dashboard card is strictly a preview/capture surface that delegates management to the workspace.

---

## 6. Dedicated Quick Ideas Workspace Layout

The workspace occupies the same main content area that currently renders the Dashboard (inside `app-main` / `app-content`). It does not use routes or URLs.

### Header area
- Title: `"Quick Ideas"`
- Count badge showing total number of ideas
- A prominent multi-line textarea (always visible) for capturing new ideas, with a **Save** button.

### Idea list
- Vertical list of all ideas, sorted newest first (`createdAt` descending).
- Each item is a workspace idea item (represented by a dedicated component such as `WorkspaceIdeaItem`) that can be **collapsed** or **expanded**.

### Collapsed row
- Lightbulb icon
- Idea main text (single-line truncation with CSS `text-overflow: ellipsis`)
- Relative timestamp on the right
- A dedicated expand/collapse button or clickable header control toggles the row. It uses `aria-expanded` to communicate state.

### Expanded row
- Main idea text rendered as a read-only paragraph (when not in edit mode).
- Supporting notes area below the main text. If notes are empty, show a light placeholder such as `"No notes yet."`
- Action buttons:
  - **Edit** — enters edit mode
  - **Delete** — initiates delete confirmation
- A dedicated collapse control collapses the idea. Edit, Delete, Save, Cancel, and confirmation buttons are separate controls outside the expand/collapse control so they do not accidentally trigger collapse or expand behavior.

### Edit mode inside an expanded row
- Replace read-only text with a multi-line textarea for the main idea.
- Replace notes area with a multi-line textarea for notes.
- **Save** and **Cancel** buttons.
  - Save commits changes, updates `updatedAt`, and exits edit mode.
  - Cancel reverts the fields to their last saved values and exits edit mode.
- **Only one idea may be in edit mode at a time.** While an idea is being edited, another idea cannot enter edit mode or collapse the current edited idea. The user must explicitly Save or Cancel first. Unsaved edit values must never be discarded automatically.

### Delete confirmation
- When Delete is clicked, the row (or the action area) is replaced with a confirmation prompt:
  - Message: `"Delete this idea permanently?"`
  - **Confirm Delete** and **Cancel** buttons.
- If cancelled, return to the expanded (read-only) state.
- If confirmed, remove the idea immediately and save to `localStorage`.
- No undo and no trash.

---

## 7. Create, Expand/Collapse, Edit, and Delete Rules

### Create
- Capture uses a multi-line textarea.
- Submit via **Save** button only. (Do not submit on Enter; Enter inserts a newline.)
- Trim the main idea text. If empty after trimming, do not create the idea; keep focus in the textarea.
- New ideas are inserted at the top of the list.
- On create, set:
  - `createdAt: new Date().toISOString()`
  - `updatedAt: new Date().toISOString()`
  - `notes: ''`
- After successful save, clear the create textarea and keep focus in it so the user can add another idea easily.

### Expand / Collapse
- Activating the expand control on a collapsed row expands it.
- Activating the collapse control on an expanded row collapses it.
- If an idea was expanded because it was preselected from the dashboard, it should visibly scroll into view when the workspace mounts (optional but recommended).
- The workspace supports one expanded idea at a time. Opening another idea normally collapses the previously expanded idea, unless that idea is showing a delete confirmation. While an idea is being edited, another idea cannot enter edit mode or collapse the current edited idea. The user must explicitly Save or Cancel first. Unsaved edit values must never be discarded automatically.

### Edit
- Edit mode is entered only by clicking **Edit** inside an expanded row.
- Edit mode selects the entire row and replaces content with textareas.
- Trimming rule applies on save: if main idea text is empty after trim, reject the save and keep the textarea in edit mode.
- Notes are optional and may be empty.
- `updatedAt` is set to `new Date().toISOString()` on save.
- Exiting edit mode (save or cancel) returns the row to its expanded read-only state.

### Delete
- Delete is available only in the expanded read-only state.
- Confirmation is required before removal.
- After confirmed deletion, remove the idea from state and `localStorage`.
- If the deleted idea was the last one, show the empty state.

---

## 8. Idea Data Shape and localStorage Migration

### New data shape

Each idea is stored as:

```js
{
  id: 'idea-abc123',          // string, required
  text: 'Main idea text',      // string, non-empty trimmed
  notes: 'Optional notes',     // string, may be empty
  createdAt: '2026-07-05T10:00:00.000Z', // ISO string
  updatedAt: '2026-07-05T10:00:00.000Z', // ISO string
}
```

### Migration rule

- On load, run `migrateIdeas(savedIdeas)` before returning state.
- For each existing idea:
  - If `notes` is missing or not a string, set it to `''`.
  - If `createdAt` is missing or invalid, preserve the idea and replace `createdAt` with the single migration timestamp.
  - If `updatedAt` is missing or invalid, set it to the valid `createdAt` value; otherwise use that same migration timestamp.
  - Preserve every existing idea rather than discarding it.
  - Preserve `id` and `text`.
- After migration, save the migrated array back to `localStorage` immediately.
- The migration must be idempotent: re-running it on already-migrated data produces the same result.

### localStorage key

Continue using `dp.ideas` via `storage.js`. No new keys.

---

## 9. Accessibility and Keyboard/Focus Rules

- **Create textarea**: When the Quick Ideas workspace mounts, move focus to the create textarea if no idea is preselected; otherwise move focus to the preselected expanded idea region.
- **Edit textarea**: When entering edit mode, focus the main idea textarea.
- **Keyboard shortcuts (recommended)**:
  - `Escape` while in edit mode cancels edit and returns focus to the Edit button.
  - `Escape` while an idea is expanded collapses it and returns focus to the collapsed row.
- **ARIA**:
  - Use `aria-expanded="true/false"` on each idea row control.
  - Use `aria-label` on Edit, Delete, Save, Cancel, and Confirm Delete buttons.
  - Use `role="region"` and `aria-labelledby` for the workspace title if helpful for screen-reader navigation.
- **Focus containment**: It is acceptable to rely on natural tab order inside the expanded edit form; do not trap focus in a modal because this is not a modal.

---

## 10. Empty States and Edge Cases

- **No ideas in workspace**: Show the existing `EmptyState` component or a consistent workspace-level empty message with the text `"No ideas yet"` and a hint `"Capture your first idea above."`.
- **No ideas in dashboard card**: Keep the existing card empty state (`"No ideas captured yet"`).
- **Delete the last idea**: Workspace transitions to its empty state immediately.
- **Save with only whitespace**: Reject and keep the textarea in edit mode; do not clear the field.
- **Rapidly click two different Edit buttons**: The second edit attempt must be blocked until the first idea is explicitly Saved or Cancelled. The UI should not render two edit forms and must not discard unsaved values.
- **LocalStorage unavailable**: Fail silently and keep in-memory state (existing behavior).

---

## 11. Acceptance Criteria

Phase 4A is complete when all of the following are true:

- [ ] `npm run build` succeeds with no errors.
- [ ] `npm run lint` passes with no new errors or warnings.
- [ ] The Dashboard Quick Ideas card still allows adding ideas and lists the three most recent ones.
- [ ] Clicking `"View all Quick Ideas"` on the dashboard opens the dedicated workspace with no idea expanded.
- [ ] Clicking an individual idea on the dashboard opens the workspace with that idea expanded.
- [ ] The Quick Ideas workspace displays all ideas, newest first.
- [ ] Users can add an idea via the workspace’s multi-line textarea.
- [ ] Users can expand and collapse any idea.
- [ ] In expanded state, optional notes are visible (or a placeholder if empty).
- [ ] Edit mode updates both main idea text and notes; Save commits; Cancel reverts.
- [ ] Only one idea is in edit mode at any time.
- [ ] Deleting an idea requires a confirmation step; confirming removes it permanently.
- [ ] Existing saved ideas load correctly after migration (`notes` added, `updatedAt` added).
- [ ] All changes persist to `localStorage` and survive a browser refresh.
- [ ] Sidebar navigation shows Quick Ideas as active when the workspace is open.

---

## 12. Manual Browser Test Checklist

Test in a normal browser at the Vite localhost URL.

- [ ] Dashboard: add an idea; it appears at the top of the card preview.
- [ ] Dashboard: click `"View all Quick Ideas"`; workspace opens; no idea is expanded.
- [ ] Dashboard: click a specific idea row; workspace opens; that idea is expanded.
- [ ] Sidebar: click Quick Ideas; workspace opens; no idea preselected.
- [ ] Sidebar: click Dashboard; returns to dashboard.
- [ ] Workspace: add a multi-line idea with newlines; newlines are preserved on display.
- [ ] Workspace: expand the newest idea (if not already); notes area shows placeholder when empty.
- [ ] Workspace: edit the idea, change text and notes, save; changes persist after refresh.
- [ ] Workspace: edit an idea, press Cancel; original values remain.
- [ ] Workspace: open edit on idea A, then click Edit on idea B; editing idea B is blocked or ignored until idea A is Saved or Cancelled, and idea A’s unsaved values remain intact.
- [ ] Workspace: delete an idea, cancel the confirmation; idea remains.
- [ ] Workspace: delete an idea, confirm; idea is removed and stays removed after refresh.
- [ ] Workspace: delete the last idea; empty state appears.
- [ ] Refresh the browser while on the Quick Ideas workspace; the app returns to the Dashboard. The ideas data is intact after migration because it is read from localStorage.
- [ ] Keyboard: Tab reaches Edit/Delete buttons; Enter activates; Escape cancels edit.

---

## 13. Likely Implementation Files

New files (to be created during implementation):

- `src/components/QuickIdeasWorkspace.jsx` — main workspace view
- `src/components/IdeaEditForm.jsx` — expanded edit form for an idea
- `src/components/IdeaDeleteConfirm.jsx` — inline delete confirmation UI
- `src/styles/quick-ideas-workspace.css` — workspace-specific layout and row expansion styles

Files expected to be modified:

- `src/App.jsx` — add view state and render the workspace conditionally; add `editIdea`/`deleteIdea` from hook
- `src/components/Sidebar.jsx` — wire nav item clicks to switch between Dashboard and Quick Ideas
- `src/components/QuickIdeasCard.jsx` — wire `"View all Quick Ideas"` and row controls to open the workspace with optional idea selection
- `src/components/Header.jsx` — if it currently displays a Dashboard-specific page heading, update it so the Quick Ideas workspace does not show a Dashboard heading
- `src/components/IdeaRow.jsx` — dashboard preview row (kept simple; may remain a display-only component)
- `src/components/WorkspaceIdeaItem.jsx` (or equivalent) — dedicated workspace idea item with expand/collapse, edit, and delete (may be a separate component to keep the dashboard preview simple)
- `src/components/AddIdeaForm.jsx` — change to multi-line textarea and adjust placeholder/submit behavior
- `src/hooks/useLocalStorage.js` — add `editIdea` and `deleteIdea` to `useIdeas`; call `migrateIdeas` on load
- `src/data/migrate.js` — add `migrateIdeas` function

---

## 14. Files That Must Remain Untouched

To avoid regressing completed phases (2, 3A, 3B), do **not** modify:

- `src/components/TodayTasksCard.jsx`
- `src/components/UpcomingTasksCard.jsx`
- `src/components/TaskRow.jsx`
- `src/components/TaskEditForm.jsx`
- `src/components/TaskDeleteConfirm.jsx`
- `src/components/AddTaskForm.jsx`
- `src/components/DailyProgressCard.jsx`
- `src/data/sampleData.js` (starter shape migration handles legacy data; do not change sample seeding unless required)
- `src/utils/dateTime.js`
- `src/styles/task-row.css`
- `src/styles/progress.css`
- `src/styles/cards.css` (safe to append new selectors if strictly additive, but avoid changing existing task-card rules)
- `docs/task-management-spec.md`
- `docs/task-organization-spec.md`
- `docs/build-plan.md`
- `docs/project-status.md`
- `docs/quick-ideas-management-spec.md` (Phase 4A, active)
- `docs/source/daily-planner-mvp-source.md`

## Approved Implementation Decisions

Implement Phase 4A according to the approved spec with these exact decisions:

1. **Header behavior (minimal option)** — When the Quick Ideas workspace is active, hide the global Dashboard heading and greeting/subtitle area. Keep the existing search input and + Add Task button. Let `QuickIdeasWorkspace` render its own "Quick Ideas" title and subtitle.
2. **Separate workspace capture form** — Keep `AddIdeaForm` compact for the Dashboard card. Build a larger, always-visible multi-line capture form directly inside `QuickIdeasWorkspace`.
3. **Sidebar keyboard accessibility** — Only Dashboard and Quick Ideas are real, keyboard-accessible navigation controls. Today, Upcoming, and Completed remain visual, non-interactive placeholders until their pages are approved.
4. **Non-mutating sort-and-slice** — Derive the newest-first idea list using `createdAt` without mutating state. The Dashboard preview shows the first three of that sorted list; the workspace shows all of it.
5. **Edit/delete protection** — While an idea is being edited or has an active delete confirmation, do not discard unsaved values or allow switching to another idea. Disable or visually mute other expand/edit controls until the user explicitly saves, cancels, confirms deletion, or cancels the delete confirmation.

---

*End of approved specification.*
