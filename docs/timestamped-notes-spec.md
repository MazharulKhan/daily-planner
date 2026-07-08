# Phase 4F — Timestamped Notes

**Status: Complete — implemented, build/lint passed, manually browser-verified.**

This spec is the Phase 4F source of truth. Phase 4F is complete; this
document is now a historical reference for the completed work.

## 1. Purpose

Phase 4F adds a single, focused capability to the YouTube Task Detail
workspace: an **Insert Timestamp** control that reads the current embedded
player time and inserts a bracketed plain-text timestamp such as `[12:45]`
into the YouTube Notes textarea at the cursor position.

Notes remain plain text. There is no rich-text editor, no clickable
timestamp, no notes preview, and no seeking from notes. This phase only
makes it faster to mark where a note belongs in the video timeline.

This phase must preserve all completed behavior from Phases 2, 3A, 3B, 4A,
4B, 4C, 4D, and 4E.

## 2. Explicit Scope

Phase 4F adds exactly:

- An **Insert Timestamp** button in the YouTube Task Detail notes card.
- Reading the **current embedded player time** via the existing player
  handle (see `src/hooks/useYouTubePlayer.js`).
- Inserting a bracketed plain-text timestamp token, e.g. `[12:45]` or
  `[1:02:15]`, into the `youtubeNotes` textarea at the current cursor
  position.
- Preserving `youtubeNotes` as plain text. No markup, no parsed model, no
  structured timestamp objects.
- Saving notes through the **existing Save Changes** flow — no new save
  path, no auto-save.

Phase 4F does not change the task data shape, does not add a new field,
and does not require a localStorage migration.

## 3. Explicitly Deferred

Do not build in Phase 4F:

- Clickable timestamp notes or seeking from notes.
- A rendered notes preview / reading view.
- A rich-text editor or formatting toolbar.
- Parsing or validation of timestamp tokens inside `youtubeNotes`.
- Highlighting or styling of timestamp tokens inside the textarea.
- Auto-inserting timestamps on player events (pause, chapter marks, etc.).
- A timestamp list / outline view.
- New npm packages.
- Backend APIs, authentication, Firebase, or cloud sync.
- React Router or any routing library.
- A standalone YouTube or Learning sidebar destination.
- YouTube Data API or API keys.

All timestamp-interaction features belong to Phase 4G or later, each under
its own approved spec.

## 4. Button Behavior

The **Insert Timestamp** button lives in the YouTube Task Detail notes card
only. It is not added to Standard Task Detail, Add Task, or anywhere else.

Rules:

- The button is rendered only inside the YouTube Task Detail notes card.
- The button is **enabled** whenever a playable embedded player exists,
  even if the current time is `0` (inserting `[0:00]` is valid for intro
  notes).
- The button is **disabled** only when one of these hard, render-time
  conditions is true:
  - There is no valid saved `youtubeUrl` / `parseYouTubeVideoId` returns
    `null`, OR
  - The player is in the error fallback state (`playerError === true`).
- When disabled, the button must be visibly disabled and non-interactive;
  it must not insert anything and must not throw.
- The button must not require a saved note first. It works on an empty
  textarea.
- The button must not require the notes textarea to be focused at the
  moment of click. The click handler reads the last known textarea
  selection/cursor (see §5).

These are the only disable conditions. Do not add polling or extra React
state just to determine whether the button should be disabled. If a
valid player should exist but `playerRef.current` is unavailable at
click time, the click handler should do nothing, leave the notes draft
unchanged, and avoid throwing.

When the player exists but is at `0:00` (before pressing play, or just
loaded), the button stays enabled and inserts `[0:00]` when clicked.

## 5. Cursor Behavior

Insertion target:

- Insert at the **current textarea cursor position**.
- If a range of text is selected in the textarea, **replace the selection**
  with the formatted insertion (see Spacing below), using the selection
  start position to decide whether a newline prefix is needed.
- If the textarea has never been focused this session, insert at position
  `0` (the beginning).

After insertion:

- Restore focus to the `youtubeNotes` textarea.
- Place the caret immediately **after the trailing space** of the inserted
  token (after the space that follows the closing `]`).
- Do not select the inserted token.

Spacing:

- Each inserted timestamp is the bracketed token followed by **one
  trailing space**, e.g. `[12:45] `, so the user can immediately type a
  note after it.
- The insertion must start on its own line so repeated timestamps stay
  readable:
  - If `youtubeNotes` is empty, insert `[12:45] ` at the start (no newline
    prefix).
  - If the cursor is already at the start of a new line (position `0` or
    the character before the cursor is `\n`), insert `[12:45] ` with no
    newline prefix.
  - If the cursor is not at the start of a new line, insert `\n[12:45] `
    so the timestamp starts on a fresh line.
- Do not add extra blank lines beyond the single newline prefix described
  above.
- Do not add a trailing newline.
- Do not auto-style, color, or parse timestamp tokens. Blue / clickable
  timestamps are explicitly a Phase 4G feature and remain deferred.

Example desired notes output:

```
[0:15] Intro starts here
[2:45] Important explanation
[12:30] Review this later
```

Implementation note (non-normative): a ref to the textarea element is
needed to read `selectionStart` / `selectionEnd` and to restore focus and
caret. The existing component does not currently keep a ref on the notes
textarea; one will be added.

## 6. Time Formatting

Reuse the existing `formatSeconds(seconds)` helper in
`src/utils/youtube.js` unchanged.

- Sub-hour durations render as `M:SS` (minutes **not** zero-padded), e.g.
  `5:30`, `12:45`.
- Durations of one hour or more render as `H:MM:SS` (zero-padded minutes),
  e.g. `1:02:15`.
- Non-finite or negative input returns `0:00`.

The inserted token is the bracketed result:

`[${formatSeconds(currentSeconds)}]`

Examples: `[5:30]`, `[12:45]`, `[1:02:15]`, `[0:00]`.

Do not add separate zero-padding logic just for timestamp notes. Do not
modify `formatSeconds`. Do not create a parallel formatter.

## 7. Reading Current Player Time

Read the live current time from the existing player handle returned by
`useYouTubePlayer`:

- Prefer `playerRef.current.getCurrentTime()` at click time for the most
  accurate value.
- Fall back to `positionRef.current` (the last tracked position) only if
  the direct read throws or returns a non-finite value.
- If neither yields a finite number at click time, the handler should do
  nothing, leave the notes draft unchanged, and avoid throwing. The button
  may still appear enabled in this rare case; it simply no-ops safely.

Do not add a new polling interval to keep a React state value in sync with
the player just for the button. Reading on click is sufficient for Phase
4F. Do not add extra React state or polling just to determine whether the
button should be disabled — the render-time disable conditions in §4 are
the only ones.

`positionRef` updates only every 5 seconds and on pause (see
`src/hooks/useYouTubePlayer.js`), so it must not be the primary source
for the timestamp. The click handler should call `getCurrentTime()`
directly.

## 8. Persistence

Persistence behavior is unchanged from Phase 4E:

- Inserting a timestamp updates only the **local draft** `youtubeNotes`
  state in the component.
- Because `youtubeNotes` is already part of the dirty-form comparison
  (see `YouTubeTaskDetail.jsx:49`) and the Save patch (`:94`), an insert
  immediately makes the form dirty and is persisted only when the user
  clicks **Save Changes**.
- Inserting a timestamp must **not** call `onEditTask`, must **not** bump
  `updatedAt`, and must **not** write to `localStorage` directly.
- Inserting a timestamp must **not** call `editPlaybackPosition` or
  otherwise change `lastWatchedSeconds`.
- No data-shape change. No migration. No new task field. No change to
  sample data.

The dirty-form confirmation, discard, and origin-return behavior from
Phases 4B–4E continues to apply unchanged.

## 9. YouTube Task Detail Layout and UI Preservation

Phase 4F must not redesign the YouTube Task Detail page. Treat this
written spec as the UI source; do not inspect or rely on UI screenshots.

Preserve the existing Phase 4E layout exactly:

- Persistent left sidebar unchanged (Dashboard, Today, Upcoming,
  Completed, Quick Ideas).
- Detail header unchanged: Back, Delete Task, Save Changes.
- Completion controls, description, and all metadata fields (Task Type,
  Priority, Category, Due Date, Time) unchanged.
- Two-column YouTube workspace unchanged:
  - **Left column**: YouTube URL input, 16:9 embedded player (or error
    fallback), Resume button when meaningful, Open video link, metadata
    grid below.
  - **Right column**: white notes card containing the YouTube Notes
    label and the `youtubeNotes` textarea.
- Do not move the video player, notes card, metadata fields, or page
  actions.

The only intended UI addition is a compact **Insert Timestamp** button
inside the notes card, placed in the `YouTube Notes` label row (next to
the label), on the trailing/right side of that row.

Styling requirements for the button:

- Use existing button styling tokens from `src/styles/task-detail.css`
  (e.g. reuse a class in the family of `youtube-detail__resume` /
  `task-detail__save` visual weight for a small secondary action — match
  the established compact, rounded, blue-accent style).
- Compact sizing; must not crowd the notes card or reduce the textarea's
  usable space.
- Disabled state must be visually distinct (reduced opacity / greyed) and
  match how other disabled controls would look in this app.
- Must look native to the current app styling.

Add a new notes-card header row structure so the label and button share
one row without altering the textarea below it. Do not add a separate
toolbar row and do not place the button under the textarea.

## 10. Accessibility and Focus

Preserve existing accessibility behavior from completed phases.

Phase 4F additions:

- The Insert Timestamp button has a clear accessible label, e.g.
  `aria-label="Insert current video timestamp into notes"`.
- The button is keyboard-focusable and operable via Enter / Space.
- After insertion, focus returns to the notes textarea and the caret is
  placed after the inserted token (see §5). This must not trap focus or
  jump to the page header.
- The disabled state is exposed accessibly (`disabled` attribute is
  sufficient; no ARIA workaround needed).

## 11. Regression Boundaries

Do not regress:

- Dashboard task and idea cards.
- Add Task fast capture, including the optional YouTube URL field from
  Phase 4E.
- Inline task edit/delete.
- Today category filters, overdue/today/completed-today sections.
- Upcoming incomplete-future-only behavior.
- Completed grouping and sorting by `completedAt`.
- Standard Task Detail origin tracking and dirty navigation protection.
- YouTube Task Detail Phase 4D and 4E behavior except where this spec
  explicitly changes it (the notes card label row).
- Phase 4E embedded player, Resume, Open video link, error fallback,
  `lastWatchedSeconds` background persistence, and 5-second checkpoint.
- Quick Ideas workspace behavior.
- localStorage persistence and migration.

Do not introduce:

- Category-based detail selection.
- Learning, Reading, or YouTube sidebar destination.
- React Router or any routing library.
- New npm packages.
- Backend / API / cloud / auth functionality.
- YouTube Data API or API keys.
- Rich-text editor, formatting toolbar, clickable timestamps, or notes
  preview.

## 12. Acceptance Criteria

Phase 4F is acceptable when:

- An **Insert Timestamp** button is rendered in the YouTube Task Detail
  notes card, in the `YouTube Notes` label row, using existing compact
  button styling.
- The button is rendered only in YouTube Task Detail, not in Standard
  Task Detail, Add Task, or any other view.
- The button is enabled when a playable embedded player exists, even at
  current time `0` (clicking inserts `[0:00]`).
- The button is disabled (and inserts nothing) only under the hard
  render-time conditions in §4: no valid saved video / no parsed video ID,
  or player error fallback.
- Clicking the button reads the live player time via
  `playerRef.current.getCurrentTime()`, falling back to `positionRef`
  only if the direct read fails.
- If neither read yields a finite number at click time, the handler does
  nothing, leaves the notes draft unchanged, and does not throw.
- Clicking inserts `[M:SS]` or `[H:MM:SS]` using the existing
  `formatSeconds`, bracketed, e.g. `[5:30]`, `[12:45]`, `[1:02:15]`.
- Insertion happens at the textarea cursor; a selected range is replaced.
- After insertion, focus returns to the textarea and the caret sits
  immediately after the trailing space following the closing `]`.
- Only the timestamp token plus its one trailing space (and a newline
  prefix when needed) is inserted — no extra blank lines, no trailing
  newline, and no auto-styling/parsing of timestamps.
- Inserting updates only local draft `youtubeNotes`; it does not call
  `onEditTask`, does not bump `updatedAt`, does not write to
  `localStorage`, and does not touch `lastWatchedSeconds`.
- Inserting makes the form dirty (existing dirty comparison already
  covers `youtubeNotes`), and the timestamp is persisted only through the
  existing Save Changes flow.
- No data-shape change, no migration, no sample-data change, and no new
  task field was added.
- The Phase 4E layout is preserved: sidebar, header, left video/metadata
  column, and notes card placement are unchanged except for the added
  button in the notes label row.
- Standard Task Detail is unchanged.
- Origin return, dirty-form, delete, and completion behavior remain
  consistent with Phase 4E.
- `npm run build` passes before declaring implementation complete.
- `npm run lint` passes before declaring implementation complete.
- Manual browser testing is completed in a normal browser before
  declaring implementation complete.

## 13. Manual Browser Test Checklist

- Open a YouTube Task with a valid saved URL: the embedded player renders
  and the Insert Timestamp button is enabled in the notes label row.
- Click Insert Timestamp before pressing play: `[0:00] ` is inserted at the
  textarea start; focus returns to the textarea; caret is after the
  trailing space.
- Play the video to ~12:45, click Insert Timestamp: `[12:45] ` is inserted
  at the cursor.
- Insert a timestamp when the cursor is mid-line: a newline is prepended
  so the timestamp starts on its own line; caret is after the trailing
  space.
- Insert several timestamps in a row: each appears on its own line with
  one trailing space; notes stay readable (e.g.
  `[0:15] Intro` / `[2:45] Note` on separate lines); no extra blank lines.
- Select a range of existing notes text, click Insert Timestamp: the
  selection is replaced by the newline-prefixed `[12:45] ` insertion
  using the selection start to decide the newline prefix.
- Click Insert Timestamp with the textarea never focused this session:
  token inserts at position 0 with no newline prefix.
- Refresh after Save: timestamps persist as plain text inside
  `youtubeNotes`; no parsing or styling is applied.
- Open a YouTube Task with a blank/invalid URL: no player renders and the
  Insert Timestamp button is disabled and non-interactive.
- Trigger a player error (private/removed/embed-disabled video): the
  error fallback card shows and the Insert Timestamp button is disabled.
- Inserting a timestamp makes Back / navigate-away show the dirty
  Discard / Keep Editing confirmation; confirming Discard loses the
  unsaved timestamp.
- Inserting a timestamp does not change the "Last updated" label or
  `updatedAt`; only Save Changes does.
- Standard Task Detail opens without any Insert Timestamp button.
- Phase 4E layout preserved: compare the YouTube Task Detail page
  before/after — sidebar, header, Back/Delete/Save, video card, Resume
  button, Open video link, metadata grid, and notes card placement are
  unchanged except the new compact button in the notes label row.
- Add Task (including the optional YouTube URL field), Today filters,
  Upcoming, Completed, Dashboard, Quick Ideas, inline edit/delete, and
  localStorage persistence remain intact.
- `npm run build` passes.
- `npm run lint` passes.

## 14. Likely Implementation Files

Likely modified files:

- `src/components/YouTubeTaskDetail.jsx` — add a ref to the notes
  textarea, add the Insert Timestamp button in the notes label row, add
  the click handler that reads `playerRef.current.getCurrentTime()`,
  formats via `formatSeconds`, and inserts the bracketed token at the
  textarea selection.
- `src/styles/task-detail.css` — a small, compact button style for the
  Insert Timestamp control (reusing existing visual tokens), plus a
  notes-label row layout so the label and button share one row without
  reducing the textarea's height.

Likely unchanged:

- `src/hooks/useYouTubePlayer.js` — already returns `playerRef` and
  `positionRef`; no change needed.
- `src/utils/youtube.js` — `formatSeconds` is reused as-is.
- `src/hooks/useLocalStorage.js` — no new setter, no default change.
- `src/data/migrate.js` — no migration.
- `src/data/sampleData.js` — no sample-data change.
- `src/components/StandardTaskDetail.jsx` — unchanged.
- `src/components/AddTaskForm.jsx` — unchanged.
- Row inline-edit components and page components — unchanged.

No new files are required for Phase 4F.

## 15. Next-Step Boundary

Do not add clickable timestamps, seeking from notes, a notes preview /
reading view, a rich-text editor, a formatting toolbar, timestamp parsing,
timestamp highlighting, YouTube Data API, API keys, new packages, backend,
Firebase, or routing as a patch to Phase 4F. Those require separate
future specs (Phase 4G or later).
