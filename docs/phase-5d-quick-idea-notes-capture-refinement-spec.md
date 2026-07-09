# Phase 5D — Quick Idea Notes Capture Refinement

**Status: Complete — implemented, build/lint passed, manually browser-verified.**

This spec is the source of truth for the completed Phase 5D implementation.

---

## 1. Purpose

Phase 5D improves the Quick Ideas workspace so users can quickly jot or update notes on an expanded Quick Idea without entering full Edit mode.

Currently, adding notes requires clicking **Edit**, which exposes both the main idea text and notes at the same time. That makes simple note capture feel heavier than it should and increases the chance of accidentally editing the main idea text.

After Phase 5D:

* The expanded Quick Idea keeps the main idea text read-only by default.
* Notes are directly editable in the expanded idea view.
* Notes are saved with an explicit **Save notes** action.
* Main idea text editing is separated behind a dedicated **Edit idea** action.
* Notes are not auto-saved.

This phase is a focused usability refinement. It does not change the idea data shape, add new features, or redesign the Quick Ideas workspace.

---

## 2. Current Behavior

The current Quick Ideas workspace already supports:

* Creating Quick Ideas from a workspace-level capture textarea.
* Sorting ideas newest first.
* Expanding and collapsing one idea at a time.
* Showing the main idea text in expanded state.
* Showing notes in expanded state, or `"No notes yet."` when notes are empty.
* Entering Edit mode from an expanded idea.
* Editing both the main idea text and notes in the same edit form.
* Deleting an expanded idea with confirmation.
* Persisting idea changes through the existing `editIdea` path.

Phase 5D keeps the workspace structure and persistence model, but changes the expanded idea interaction so notes can be edited directly.

---

## 3. Scope

### In Scope

Phase 5D includes:

* Replace the expanded read-only notes display with an editable notes textarea.
* Add an explicit **Save notes** button for the notes textarea.
* Add a **Cancel notes** or equivalent revert action for unsaved note changes.
* Keep the main idea text read-only by default in expanded state.
* Rename or clarify the existing Edit action as **Edit idea**.
* Update Edit idea mode so it edits the main idea text only.
* Prevent unsaved note changes from being silently discarded.
* Preserve existing expand/collapse, create, delete, sorting, and persistence behavior.
* Preserve existing idea data shape:

  * `id`
  * `text`
  * `notes`
  * `createdAt`
  * `updatedAt`
* Use the existing `onEditIdea` / `editIdea` persistence path.
* Update Quick Ideas workspace styling only as needed for the new notes controls.

### Out of Scope

Do not build in Phase 5D:

* Quick Idea → Task conversion.
* Dashboard Quick Ideas edit/delete controls.
* Auto-save for notes.
* Autosave debounce logic.
* Rich-text editor.
* Formatting toolbar.
* Markdown preview.
* Tags, categories, priorities, or colors for ideas.
* Search or filtering.
* Undo/trash/soft delete.
* Routing or React Router.
* Firebase, backend, authentication, cloud sync, or external APIs.
* New npm packages.
* Any task-related behavior changes.
* Any YouTube task behavior changes.
* Responsive or visual polish pass beyond what is needed for this feature.

---

## 4. User Experience Goals

Phase 5D should make Quick Idea notes feel fast and safe:

* The user can expand an idea and immediately type notes.
* The main idea text is protected from accidental edits.
* The user clearly understands that notes are not saved until **Save notes** is clicked.
* Unsaved notes are not silently lost.
* Editing the main idea text is still possible, but intentionally separate.
* Delete confirmation remains explicit because deletes are permanent.

---

## 5. Expanded Idea Default State

When an idea is expanded and no edit/delete confirmation is active, render:

1. Main idea text as a read-only paragraph.
2. A notes editor section below it.
3. **Save notes** button.
4. **Cancel notes** or equivalent revert control when notes have unsaved changes.
5. Separate action buttons:

   * **Edit idea**
   * **Delete**

### Main Idea Text

* The main idea text is read-only by default.
* It should continue to use the existing expanded idea text styling where practical.
* It must not be editable until the user clicks **Edit idea**.

### Notes Editor

* Show a textarea directly below the main idea text.
* The textarea value initializes from `idea.notes` or `''`.
* Placeholder text when empty:

  * `Add notes...`
* The textarea preserves meaningful line breaks.
* The textarea is editable immediately after expansion.
* Notes are not saved automatically.

### Notes Actions

Render a clear **Save notes** button near the notes textarea.

Rules:

* **Save notes** is disabled when the notes draft matches the saved notes.
* **Save notes** becomes enabled after the user changes the notes textarea.
* Saving notes calls the existing idea edit path with a patch containing only `notes`.
* Saving notes updates `updatedAt` through the existing `editIdea` behavior.
* After a successful notes save, the notes draft becomes clean.
* Focus should remain in or return to the notes textarea after saving so the user can continue jotting notes.

Render **Cancel notes** when the notes draft is dirty, or keep it visible but disabled when clean.

Rules:

* Cancel notes reverts the textarea to the last saved `idea.notes`.
* Cancel notes does not persist anything.
* Cancel notes clears the dirty state.
* Focus should return to the notes textarea after cancelling.

---

## 6. Notes Saving Rules

### Explicit Save Only

Notes are saved only when the user clicks **Save notes**.

Do not save notes on:

* Every keystroke.
* Blur.
* Collapse.
* Expanding a different idea.
* Navigating away.
* Browser refresh.
* Starting Edit idea mode.
* Starting Delete confirmation.

### Saved Value

When saving notes:

* Preserve internal line breaks.
* Preserve meaningful user-entered note formatting.
* If the notes textarea is only whitespace, save it as an empty string `''`.
* Otherwise save the notes text as typed.

Recommended save normalization:

```js
const nextNotes = draftNotes.trim().length === 0 ? '' : draftNotes;
```

Do not trim normal non-empty notes in a way that removes meaningful line breaks or indentation.

### Persistence

Use the existing idea edit persistence path.

Expected patch:

```js
onEditIdea(idea.id, { notes: nextNotes });
```

Do not add a new localStorage key.
Do not change `dp.ideas`.
Do not add a migration.
Do not change the idea data shape.

---

## 7. Unsaved Notes Protection

Unsaved notes must never be silently discarded.

A note draft is dirty when the local textarea value differs from the saved `idea.notes` value.

While an expanded idea has dirty notes:

* Do not allow collapsing that idea without resolving the dirty note draft.
* Do not allow expanding a different idea if doing so would discard the dirty note draft.
* Do not allow starting **Edit idea** until the notes are saved or cancelled.
* Do not allow starting **Delete** until the notes are saved or cancelled.
* Visually disable or mute conflicting controls.
* Keep the dirty notes draft intact until the user explicitly clicks **Save notes** or **Cancel notes**.

A simple implementation is acceptable:

* Track which idea has dirty notes in `QuickIdeasWorkspace`.
* If a notes draft is dirty, block expand/collapse changes for other ideas.
* Pass a muted/disabled state to other `WorkspaceIdeaItem` rows, matching the existing edit/delete protection pattern.

Do not create a modal for this phase. Keep the protection inline and lightweight.

---

## 8. Edit Idea Mode

The existing full edit mode should become a focused **Edit idea** mode.

### Entry

* Triggered only by clicking **Edit idea** from an expanded idea.
* The action is disabled if the current idea has unsaved notes.
* Only one idea can be in Edit idea mode at a time, preserving existing behavior.

### Editable Fields

Edit idea mode edits only the main idea text.

It should not expose the notes textarea.

Rationale:

* Notes now have their own direct editing surface.
* Edit idea should mean “rename or rewrite the idea,” not “edit everything.”

### Layout

In Edit idea mode:

* Replace the read-only main idea text with a textarea for the main idea text.
* Show **Save idea** and **Cancel** buttons.
* Hide or disable the direct notes editor while editing the main idea.
* Do not show two competing notes editors at the same time.

### Save Idea

* Trim the main idea text before saving.
* Empty trimmed text blocks save and keeps focus in the idea text textarea.
* Saving calls the existing edit path with a patch containing only `text`.
* Saving updates `updatedAt` through the existing `editIdea` behavior.
* Saving exits Edit idea mode and returns to the expanded default state.

Expected patch:

```js
onEditIdea(idea.id, { text: trimmedText });
```

### Cancel Idea Edit

* Cancels only the main idea text edit.
* Does not change saved notes.
* Returns to the expanded default state.

---

## 9. Delete Behavior

Delete behavior remains mostly unchanged.

Rules:

* Delete is available only from the expanded default state.
* Delete remains separate from Edit idea and Save notes.
* Delete still requires inline confirmation.
* If notes are dirty, Delete is disabled or blocked until the user saves or cancels the notes draft.
* Confirming delete permanently removes the idea.
* Cancelling delete returns to the expanded default state.
* No undo, trash, or soft delete is added.

---

## 10. Create Behavior

Existing Quick Idea creation behavior is preserved.

Rules:

* The workspace capture textarea remains at the top of Quick Ideas.
* Creating a new idea still creates:

  * `text`
  * `notes: ''`
  * `createdAt`
  * `updatedAt`
* New ideas still appear newest first.
* Dashboard Quick Ideas capture remains compact and unchanged except for regression fixes if needed.

Do not combine Phase 5D with Dashboard Quick Ideas edit/delete controls.

---

## 11. Dashboard Quick Ideas Card

The Dashboard Quick Ideas card is not the target of Phase 5D.

Preserve existing behavior:

* Dashboard card can capture a quick idea.
* Dashboard card shows the newest ideas.
* Clicking an idea opens the Quick Ideas workspace with that idea expanded.
* `"View all Quick Ideas"` opens the workspace normally.
* Notes are not edited directly from the dashboard card.

Do not add dashboard edit/delete controls in Phase 5D.

---

## 12. Data and localStorage Rules

Phase 5D does not change the idea data model.

Current idea shape remains:

```js
{
  id: 'idea-abc123',
  text: 'Main idea text',
  notes: 'Optional notes',
  createdAt: '2026-07-09T10:00:00.000Z',
  updatedAt: '2026-07-09T10:00:00.000Z'
}
```

Rules:

* Continue using `dp.ideas`.
* Continue using existing `useIdeas` / `editIdea` behavior.
* No new localStorage keys.
* No migration.
* Existing saved ideas must remain intact.
* Existing `notes` values must be preserved.
* Saving notes updates only `notes` plus the existing automatic `updatedAt` update.
* Saving main idea text updates only `text` plus the existing automatic `updatedAt` update.
* Deleting an idea remains permanent.

---

## 13. Accessibility and Focus

Preserve existing Quick Ideas accessibility behavior.

Phase 5D additions:

### Notes Textarea

* The notes textarea must have a clear accessible label, such as `Notes for idea: {idea.text}`.
* The notes textarea must be reachable by keyboard.
* The notes textarea must preserve normal multiline typing behavior.
* Pressing Enter inside the notes textarea inserts a newline.
* Do not use Enter to submit notes.

### Save Notes

* **Save notes** is a real `<button>`.
* It is keyboard reachable.
* It has clear visible text.
* Disabled state is represented with the native `disabled` attribute when there are no changes.
* After saving, focus remains in or returns to the notes textarea.

### Cancel Notes

* **Cancel notes** is a real `<button>`.
* It is keyboard reachable when visible/enabled.
* It clearly communicates that it reverts unsaved note changes.

### Edit Idea

* Button text should be **Edit idea** rather than just **Edit**.
* It must have a clear accessible label.
* When Edit idea mode opens, focus moves to the main idea text textarea.
* Escape may continue to cancel Edit idea mode if already implemented.

### Dirty State

* If notes are dirty and other controls are disabled, disabled controls should be visually distinct.
* Do not rely on hover-only behavior.
* Do not trap focus.
* Preserve visible focus outlines.

---

## 14. Styling Requirements

Use existing Quick Ideas visual language.

Phase 5D should feel like a small refinement, not a redesign.

### Notes Editor Styling

* Use existing app design tokens.
* Use a light surface, subtle border, rounded corners, and comfortable padding.
* The notes textarea should visually belong inside the expanded idea body.
* Keep it compact but large enough for real notes.
* Recommended minimum rows: 4.
* The textarea should be resizable vertically if consistent with existing styles.

### Action Layout

* Place **Save notes** and **Cancel notes** close to the notes textarea.
* Keep **Edit idea** and **Delete** as separate row-level actions.
* Avoid crowding the expanded idea.
* Keep danger styling only for Delete.

### No Major Visual Polish

Do not redesign:

* Sidebar.
* Header.
* Dashboard.
* Task cards.
* Add Task modal.
* YouTube detail.
* Overall app spacing/layout.

---

## 15. Likely Implementation Files

Likely files to inspect and change:

* `src/components/QuickIdeasWorkspace.jsx`

  * Track notes dirty state if needed.
  * Prevent switching/collapsing while notes are dirty.
  * Pass note-save handlers and disabled/muted state into idea items.

* `src/components/WorkspaceIdeaItem.jsx`

  * Replace read-only notes block with editable notes textarea.
  * Add Save notes / Cancel notes controls.
  * Rename Edit to Edit idea.
  * Disable Edit idea/Delete/Collapse when notes are dirty.
  * Keep delete confirmation behavior.

* `src/components/IdeaEditForm.jsx`

  * Refocus this component around main idea text only.
  * Remove notes textarea from Edit idea mode.
  * Save only `{ text: trimmedText }`.

* `src/styles/quick-ideas-workspace.css`

  * Add styles for the notes editor section and notes action row.
  * Add disabled/dirty visual states if needed.

Likely files to inspect but avoid changing unless needed:

* `src/hooks/useLocalStorage.js`

  * Existing `editIdea` should already support notes patches and `updatedAt`.
  * Do not change unless the current behavior cannot support the spec.

* `src/components/QuickIdeasCard.jsx`

  * Should remain unchanged unless a regression is discovered.

Files that should not be changed for Phase 5D:

* Task components.
* YouTube task components.
* Add Task modal.
* Task data migration.
* Sample task data.
* Routing/navigation architecture.
* Firebase/backend/auth/config files.

---

## 16. Regression Boundaries

Phase 5D must preserve:

* Dashboard behavior.
* Dashboard Quick Ideas capture and preview behavior.
* Opening a dashboard idea into the Quick Ideas workspace.
* Quick Ideas workspace create behavior.
* Quick Ideas expand/collapse behavior, except where blocked to protect unsaved notes.
* Quick Ideas delete confirmation behavior.
* Quick Ideas sorting newest first.
* Current workspace persistence from Phase 5B.
* Global Add Task modal behavior from Phase 5A.
* Completed-task collapse behavior from Phase 5C.
* All task behavior.
* Standard Task Detail behavior.
* YouTube Task Detail behavior.
* YouTube player, resume, timestamp insertion, and clickable timestamp preview.
* Existing `dp.tasks` and `dp.ideas` data.

Phase 5D must not introduce:

* Category-based idea behavior.
* Task conversion.
* New packages.
* Router.
* Firebase/backend/auth/cloud sync.
* New localStorage keys.
* Data resets.
* Broad refactors.

---

## 17. Acceptance Criteria

Phase 5D is complete when:

1. Expanding a Quick Idea shows the main idea text as read-only by default.
2. Expanded Quick Idea shows an editable notes textarea below the main idea text.
3. Empty notes show the notes textarea with placeholder text such as `Add notes...`.
4. Existing saved notes appear in the textarea when the idea is expanded.
5. Editing notes does not immediately persist changes.
6. **Save notes** persists notes through the existing idea edit path.
7. Saving notes updates `updatedAt` through existing `editIdea` behavior.
8. **Save notes** is disabled when notes are unchanged.
9. **Cancel notes** reverts unsaved note edits to the last saved notes.
10. Unsaved notes are not lost silently when trying to collapse the idea, expand another idea, edit the main idea, or delete the idea.
11. The main idea text cannot be edited from the default expanded state.
12. **Edit idea** opens a separate main-text edit mode.
13. Edit idea mode edits only the main idea text, not notes.
14. Saving Edit idea mode persists only the main idea text.
15. Empty main idea text is rejected and focus stays in the idea text textarea.
16. Delete remains available from the expanded default state when notes are clean.
17. Delete remains confirmation-based and permanent.
18. Dashboard Quick Ideas card behavior is unchanged.
19. Quick Ideas create behavior is unchanged.
20. Quick Ideas sorting newest first is unchanged.
21. No idea data-shape change was introduced.
22. No localStorage migration was added.
23. No new localStorage key was added.
24. No task behavior changed.
25. No package, router, Firebase, backend, auth, or cloud sync was added.
26. `npm run build` passes.
27. `npm run lint` passes.
28. Manual browser testing passes in a normal browser.

---

## 18. Manual Browser Test Checklist

Test in a normal browser at the Vite localhost URL. Do not rely on OpenChamber’s built-in preview.

### Existing Behavior Regression

* [ ] Open Quick Ideas from the sidebar.
* [ ] Create a new Quick Idea from the workspace capture textarea.
* [ ] Confirm the new idea appears at the top of the list.
* [ ] Refresh on Quick Ideas and confirm Phase 5B still restores Quick Ideas.
* [ ] Dashboard Quick Ideas card still captures a quick idea.
* [ ] Dashboard Quick Ideas card still opens a clicked idea in the workspace.
* [ ] `"View all Quick Ideas"` still opens the workspace normally.

### Direct Notes Editing

* [ ] Expand an idea with no notes.
* [ ] Confirm the main idea text is read-only.
* [ ] Confirm the notes textarea appears with `Add notes...` placeholder.
* [ ] Type notes with multiple lines.
* [ ] Confirm **Save notes** becomes enabled.
* [ ] Click **Save notes**.
* [ ] Collapse and re-expand the idea; notes remain.
* [ ] Refresh the browser; notes remain.

### Cancel Notes

* [ ] Edit existing notes.
* [ ] Click **Cancel notes**.
* [ ] Confirm the notes revert to the last saved value.
* [ ] Confirm no persistence occurs after cancel.

### Unsaved Notes Protection

* [ ] Type notes but do not save.
* [ ] Try to collapse the current idea.
* [ ] Confirm the draft is not silently lost.
* [ ] Try to expand another idea.
* [ ] Confirm the draft is not silently lost.
* [ ] Try to click **Edit idea**.
* [ ] Confirm the user must save or cancel notes first.
* [ ] Try to click **Delete**.
* [ ] Confirm the user must save or cancel notes first.

### Edit Idea

* [ ] Expand an idea.
* [ ] Click **Edit idea**.
* [ ] Confirm only the main idea text is editable.
* [ ] Confirm notes are not shown as a second editable field in Edit idea mode.
* [ ] Change the idea text and save.
* [ ] Confirm the updated idea text appears.
* [ ] Refresh the browser; updated idea text remains.
* [ ] Try saving empty idea text.
* [ ] Confirm save is blocked and focus stays in the text field.
* [ ] Cancel Edit idea mode and confirm original text remains.

### Delete

* [ ] Expand an idea with clean notes.
* [ ] Click **Delete**.
* [ ] Confirm delete confirmation appears.
* [ ] Cancel delete and confirm the idea remains.
* [ ] Delete again and confirm deletion.
* [ ] Refresh; deleted idea stays deleted.

### Accessibility

* [ ] Tab reaches the notes textarea.
* [ ] Tab reaches **Save notes** and **Cancel notes**.
* [ ] Tab reaches **Edit idea** and **Delete** when notes are clean.
* [ ] Enter in the notes textarea inserts a newline, not save.
* [ ] Focus states are visible.
* [ ] Disabled controls are visibly disabled when notes are dirty.
* [ ] Screen-reader labels are clear enough for notes, Save notes, Cancel notes, Edit idea, and Delete.

### Verification

* [ ] Run `npm run build` and confirm it passes.
* [ ] Run `npm run lint` and confirm it passes.
* [ ] Confirm no unrelated files were changed.
* [ ] Confirm no commit or push happened unless explicitly requested.

---

## 19. Final UX Decisions

Phase 5D delivered these UX behaviors:

* **Direct notes editing** — Expanding a Quick Idea shows an editable notes
  textarea below the read-only idea title. No need to enter a separate edit
  mode just to jot notes.
* **Explicit Save notes** — Notes are saved only when the user clicks
  **Save notes**. No auto-save on keystroke, blur, collapse, or navigation.
* **Notes saved confirmation** — A transient "Notes saved at [time]" message
  appears after saving. It is UI-only state (not persisted). Editing notes
  again clears the message.
* **Discard changes** — The "Discard changes" button reverts unsaved note
  edits to the last saved notes. It does not collapse the idea.
* **Pencil icon edits the title** — A small pencil icon beside each idea
  title opens inline title edit mode. Edit mode replaces the title text with
  a textarea + Save title / Cancel. Notes are hidden during title editing.
* **Title edit separate from notes** — Title editing and notes editing are
  independent. Title edit mode edits only the main idea text, not notes.
* **Trash icon deletes from any state** — A small trash icon is visible on
  every Quick Idea row (collapsed or expanded). It opens a confirmation
  dialog; deletion is never instant. A bottom Delete button is also present
  on expanded cards.
* **Cursor at end on reopen** — Re-expanding an idea with existing notes
  places the cursor at the end of the text. No newline is inserted. Notes are
  not marked dirty just because the idea was opened.
* **Dirty-notes protection** — Unsaved notes block collapse, expanding
  another idea, title editing, and deletion until notes are saved or
  discarded.

## 20. Suggested Coding Agent Plan Prompt (archive)

Use this after saving this spec as:

`docs/phase-5d-quick-idea-notes-capture-refinement-spec.md`

```text
Read AGENTS.md, docs/project-status.md, docs/build-plan.md, and docs/phase-5d-quick-idea-notes-capture-refinement-spec.md.

Do not edit files yet.
Do not implement code.
Do not create or modify docs.
Do not commit or push.

Create an implementation plan only:

- current behavior you found
- exact files likely to change
- proposed changes by file
- edge cases and risks
- manual browser test checklist
- build/lint commands to run

Follow AGENTS.md.
Preserve completed-phase behavior.
Do not add packages.
Do not add Firebase/backend/auth/cloud sync/routing.
Do not change task or idea data shape unless the Phase 5D spec explicitly requires it.

Do not implement until I approve the plan.
```
