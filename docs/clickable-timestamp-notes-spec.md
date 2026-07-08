# Phase 4G — Clickable Timestamp Notes

**Status: Complete — implemented, build/lint passed, manually browser-verified.**

This spec is the Phase 4G source of truth and is now a historical
reference for the completed work.

## 1. Purpose

Phase 4G adds a **read-only rendered notes preview** below the existing
YouTube Notes textarea. The preview parses plain-text bracketed timestamp
tokens (inserted by the Phase 4F Insert Timestamp control, or typed
manually) and renders valid timestamps as **clickable controls** that seek
the embedded YouTube player to that timestamp and start playback.

Notes remain plain text. There is no rich-text editor, no formatting
toolbar, no in-textarea styling, and no structured timestamp data model.
The textarea stays the source of truth; the preview is a derived reading
view.

This phase must preserve all completed behavior from Phases 2, 3A, 3B,
4A, 4B, 4C, 4D, 4E, and 4F.

## 2. Explicit Scope

Phase 4G adds exactly:

- A **rendered notes preview** region rendered below the `youtubeNotes`
  textarea inside the YouTube Task Detail notes card.
- A **timestamp parser** that scans the plain-text notes string and
  identifies valid bracketed timestamp tokens (see §4).
- **Clickable timestamp controls** in the preview for each valid token.
  Clicking one seeks the embedded player to the parsed seconds and starts
  playback via the existing `seekAndPlay(seconds)` helper.
- Plain text between timestamps renders as readable text, preserving line
  breaks.
- The preview updates **live from the current local draft `youtubeNotes`
  state**, so newly inserted or typed timestamps are clickable before
  Save.
- A **collapsible preview toggle** in the preview heading that hides or
  shows the preview body without removing the heading. State is local
  only (not persisted), default is expanded.
- A **refined Insert Timestamp default position**: when the textarea has
  never been focused in the current detail session, Insert Timestamp
  appends at the end of existing notes (not position 0).

Phase 4G does not change the task data shape, does not add a new field,
and does not require a localStorage migration.

## 3. Explicitly Deferred

Do not build in Phase 4G:

- A rich-text editor or formatting toolbar.
- In-textarea timestamp highlighting, coloring, or clickable spans.
- Editing inside the preview; the preview is read-only.
- A tabs-only Write/Preview toggle that replaces the textarea.
- Seeking from notes inside the textarea itself.
- Timestamp validation warnings or linting of malformed tokens.
- A timestamp list / outline / chapter panel separate from inline notes.
- Bulk timestamp actions (jump to next, previous, etc.).
- Persistence of any parsed timestamp structure; `youtubeNotes` stays a
  plain string.
- New npm packages.
- Backend APIs, authentication, Firebase, or cloud sync.
- React Router or any routing library.
- A standalone YouTube or Learning sidebar destination.
- YouTube Data API or API keys.

All richer editing features belong to Phase 4H or later, each under its
own approved spec.

## 4. Timestamp Parsing Rules

The parser scans the plain-text `youtubeNotes` string and identifies
timestamp tokens matching the format produced by the existing
`formatSeconds` helper (see `src/utils/youtube.js`).

### Accepted token format

A valid token is:

- An opening bracket `[`
- A time body of either:
  - `M:SS` — one or more digit minutes, exactly two digit seconds
  - `H:MM:SS` — one or more digit hours, exactly two digit minutes,
    exactly two digit seconds
- A closing bracket `]`

### Non-normative reference pattern

```js
const TIMESTAMP_TOKEN_PATTERN = /\[\s*(\d+):([0-5]\d)(?::([0-5]\d))?\s*\]/g;
```

Interpretation of capture groups:

- Capture group 1 — minutes when group 3 is absent (`M:SS`), or hours
  when group 3 is present (`H:MM:SS`).
- Capture group 2 — seconds in the `M:SS` form, or minutes in the
  `H:MM:SS` form.
- Capture group 3 — seconds in the `H:MM:SS` form; **optional**.
  - If group 3 is **absent**, interpret as `M:SS`.
  - If group 3 is **present**, interpret as `H:MM:SS`.

Examples:

- `[12:45]` → 12 minutes, 45 seconds → `12 * 60 + 45 = 765` seconds.
- `[1:02:15]` → 1 hour, 2 minutes, 15 seconds →
  `1 * 3600 + 2 * 60 + 15 = 3735` seconds.

Rejected as plain text:

- Bare `12:45` without brackets is **not** parsed.
- `[12:4]` (one-digit second) is plain text.
- `[1:2:3]` (one-digit minute/second in `H:MM:SS`) is plain text.
- `[note]` is plain text.
- `[12:45 note]` (extra characters inside) is plain text.

### Lenient tolerance

To support manually typed timestamps, the parser additionally tolerates:

- Leading/trailing whitespace inside the brackets, e.g. `[ 12:45 ]`.

The parser does **not** accept:

- Parenthesized or angle-bracket timestamps, e.g. `(12:45)`, `<12:45>`.
- Tokens with extra characters inside, e.g. `[12:45 note]`.

### Conversion to seconds

- `M:SS` → `M * 60 + SS`.
- `H:MM:SS` → `H * 3600 + MM * 60 + SS`.
- Clamp the resulting seconds to a non-negative finite number. If the
  parsed value is not finite, the token renders as plain text (not
  clickable).
- The parser does not clamp against video duration; a timestamp beyond
  the video end is still clickable and the player handles the seek.

### Unknown / malformed tokens

Any bracketed text that does not match the accepted format renders as
plain text in the preview, unchanged. No warning, no error state.

## 5. Preview Rendering Rules

The preview is a **read-only rendered view** of the current local draft
`youtubeNotes` string.

- The preview is rendered below the textarea, inside the same notes card.
- The preview is derived purely from `youtubeNotes` (local draft state).
  It is not derived from `task.youtubeNotes` (saved state) except that
  local draft initializes from saved state on open — this is already the
  existing behavior.
- The preview updates on every `youtubeNotes` change, including typing
  and Insert Timestamp clicks, **before** Save.
- The preview splits the notes string into an ordered list of segments:
  - **Text segments** — plain text between/around timestamps, rendered
    with preserved line breaks (whitespace and newlines honored).
  - **Timestamp segments** — valid tokens rendered as clickable buttons.
- Empty notes render an empty preview state (see §7).
- The preview must not mutate `youtubeNotes`. It is read-only.
- The preview must not call `onEditTask`, must not bump `updatedAt`, and
  must not write to `localStorage`.
- Clicking a timestamp in the preview must not move focus away from the
  textarea in a way that loses the user's cursor position
  (non-normative: the click handler can call `seekAndPlay` without
  refocusing the textarea; focus naturally goes to the clicked button,
  which is acceptable).

### Rendering approach (non-normative)

A small helper, e.g. `parseTimestampNotes(text)`, returns an array of
segments: `{ type: 'text', value }` and
`{ type: 'timestamp', token, seconds }`. The component maps this to text
nodes and buttons. No new package. No `dangerouslySetInnerHTML`.

## 6. Click-to-Seek Behavior

Clicking an **enabled** timestamp button in the preview:

- Calls the existing `seekAndPlay(seconds)` helper returned by
  `useYouTubePlayer` (see `src/hooks/useYouTubePlayer.js`).
- `seekAndPlay` performs `player.seekTo(seconds, true)` followed by
  `player.playVideo()`, matching the Phase 4E Resume button behavior.
- This means clicking a timestamp starts playback from that moment even
  if the video was paused.

### Decision: seek + play

This spec explicitly approves **seek + play** (not seek-only). Rationale:
clicking a timestamp in a learning-notes preview is an act of reviewing
that video moment, not just repositioning the playhead. This matches the
Resume button contract and reuses the existing helper, so no new player
state or separate playback system is introduced.

### Disabled timestamp buttons

Valid timestamp tokens **always render** as timestamp pills/buttons in
the preview, preserving the note structure. However, the buttons are
**disabled** (non-interactive, visually greyed) when either render-time
condition is true:

- There is no valid saved `youtubeUrl` / `parseYouTubeVideoId` returns
  `null`, OR
- The player is in the error fallback state (`playerError === true`).

These are the same render-time conditions already used by the Phase 4F
Insert Timestamp button (see `docs/timestamped-notes-spec.md` §4). Do not
add new polling, extra React state, or per-button player-state tracking.
Re-use the existing `insertTimestampEnabled`-style computation already
available in `YouTubeTaskDetail`.

### Safety

- If `seekAndPlay` is unavailable or `playerRef.current` is null at click
  time (e.g. an unexpected race), the click must do nothing and must not
  throw. Enabled buttons may still render; the click no-ops safely.
- Clicking a timestamp must not change `lastWatchedSeconds` directly. The
  existing background position persistence (pause / end / leave / 5s
  checkpoint) continues to handle `lastWatchedSeconds` normally.
- Clicking a timestamp must not trigger the dirty-form state; the preview
  is read-only and seeks are background playback actions, like Resume.

## 7. Layout / UI Rules

Phase 4G must not redesign the YouTube Task Detail page. Preserve the
Phase 4E/4F two-column layout exactly.

> **Visual reference note:** A concept mockup may exist at
> `docs/ui-reference/phase-4g-clickable-preview-concept.png`. It is
> visual reference only and is **not** authoritative. AI agents must not
> depend on interpreting that image. The written spec in this section is
> the sole source of truth for the preview UI. If the image and this
> written spec disagree, this written spec wins.

### Watch-and-write workflow (explicit)

- Keep the existing two-column layout.
- Left column remains video/player and metadata.
- Right column remains notes.
- The textarea stays visible above the preview.
- The preview lives below the textarea in the same notes card.
- Do **not** use a tabs-only Write/Preview design that replaces the
  textarea. A tabs-only design would force the user to switch modes to
  click a timestamp, breaking the watch-and-write flow. The user must be
  able to watch the video, write notes in the textarea, and click
  timestamps in the preview **at the same time**, without a mode switch.
- Textarea-above + compact-preview-below keeps both visible
  simultaneously.

### Left column (unchanged)

YouTube URL input, embedded player, Resume button, Open video link,
metadata grid — unchanged.

### Right notes card (unchanged except preview addition)

Notes card header row (YouTube Notes label + Insert Timestamp button) and
textarea — unchanged. The only UI addition is a preview region inside the
notes card, below the textarea.

### Insert Timestamp default position (Phase 4G refinement)

Phase 4G refines the default insertion position from Phase 4F §5. In
Phase 4F, if the textarea was never focused, the token was inserted at
position 0. Phase 4G changes this to a more useful default:

- If the YouTube Notes textarea has a **known cursor or selection**
  (the user has focused it this session), insert at that cursor/selection
  as before. Existing Phase 4F selection-replacement and spacing rules
  apply unchanged.
- If the textarea has **never been focused** in the current detail
  session, insert at the **end** of the current `youtubeNotes` draft,
  not the beginning.
- If existing notes are non-empty and do not already end with a newline,
  prefix the inserted timestamp with one newline so it starts on its own
  line (the same newline-prefix rule from Phase 4F §5, applied at the
  end position).
- Preserve the Phase 4F spacing rule: timestamp token + one trailing
  space, no extra blank lines, no trailing newline.
- After insertion, focus the textarea and place the caret after the
  trailing space (same as Phase 4F).

This intentionally improves the Phase 4F default. When reopening a task
with saved notes, the user likely wants the new timestamp appended at the
bottom, not inserted at the top.

### Preview region rules

- Render directly below the textarea, inside the same notes card, with a
  clear visual separator (a subtle top border or spacing).
- Label the region with a small, muted heading, e.g. "Preview" or
  "Clickable Preview".
- Compact vertical rhythm; the preview must not dominate the notes card.
- Use a **max-height of about 240px–260px** with internal vertical
  scrolling when notes are long, so the textarea keeps usable space.
- The textarea must remain the primary editor and must not be crowded by
  the preview.
- Timestamp buttons use existing compact button styling tokens from
  `src/styles/task-detail.css` (reuse the visual family of
  `youtube-detail__insert-timestamp` / `youtube-detail__resume` — small,
  rounded, blue-accent).
- Text segments render in the app's default text color; timestamps render
  as clearly identifiable buttons with consistent spacing.
- Preserve line breaks in text segments.
- Empty notes preview state: a muted placeholder, e.g.
  "Timestamped notes will appear here." Do not render an empty list or a
  hidden preview region; the region stays visible so the feature is
  discoverable.
- A **collapsible preview toggle** lives in the preview heading row. It
  is a small button labeled "Hide" when expanded, "Show" when collapsed,
  with `aria-label` and `aria-expanded` attributes. Default state is
  expanded. The state is local component state only and is not persisted
  in localStorage or task data. When collapsed, the preview body (empty
  placeholder or parsed segments) is hidden but the heading and toggle
  button remain visible so the user can re-expand at any time. When
  expanded, the 240px max-height internal scroll behavior applies.

### Responsive

The existing responsive stacking (≤900px) continues to apply. The preview
stacks below the textarea within the notes card. No new breakpoints.

### Polished Preview UI

The clickable notes preview must look polished and intentional, not like
raw parsed text or debug output. It should feel like a lightweight
study-notes reader. This subsection is the authoritative written
description of the intended preview design.

#### Layout placement

- Keep the existing two-column YouTube Task Detail layout.
- The left column remains the video/player and task metadata.
- The right column remains the YouTube Notes card.
- Keep the textarea visible as the primary editor.
- Add a "Clickable Preview" section below the textarea, inside the same
  notes card.
- The preview must not replace or hide the textarea.

#### Surface and container

- Use a soft white or very light blue/gray surface for the preview body
  (e.g. a near-white card surface with a faint cool tint).
- Use a subtle border, rounded corners, and comfortable internal spacing.
- Add a small, muted heading such as "Clickable Preview" or "Preview" at
  the top of the region.
- A subtle top separator between the textarea and the preview is
  acceptable (thin border or spacing) so the two are visually distinct.

#### Timestamp chips

- Timestamp controls should look like compact blue pill buttons or inline
  accent chips, not default browser buttons.
- Chips reuse the app's existing blue accent style and compact button
  visual tokens from `src/styles/task-detail.css` (the visual family of
  `youtube-detail__insert-timestamp` / `youtube-detail__resume`).
- Chips should be compact, readable, and keyboard-focusable.
- Notes text should align cleanly beside the timestamp chips so each
  timestamped line reads naturally as "chip + note text".
- Preserve line breaks in notes text so each timestamped line stays on
  its own row.

#### Disabled chips

- Disabled timestamp chips should visibly look disabled (reduced opacity
  / greyed) but **still render** and preserve the note structure.
- A disabled chip must not be clickable or focusable.

#### Scrolling and sizing

- Long preview content should scroll internally with a max-height of
  about 240px–260px.
- The textarea must remain the primary editor and must not be crowded or
  shrunk by the preview.
- The preview must not dominate the notes card.

#### Empty state

- Empty preview should show a polished placeholder, for example:
  "Timestamped notes will appear here."
- The preview region stays visible when empty so the feature is
  discoverable. Do not hide the region or render an empty list.

#### Out of scope

- Do not redesign the full detail page. Only improve the notes preview
  area.
- Do not add packages, icons, animations, rich text, or a formatting
  toolbar.

## 8. Accessibility

Preserve existing accessibility behavior from completed phases.

Phase 4G additions:

- Each timestamp button has a clear accessible label including the
  timestamp and intent, e.g.
  `aria-label="Seek video to 12:45 and play"`.
- Timestamp buttons are keyboard-focusable and operable via Enter / Space.
  Disabled buttons are not focusable (standard `disabled` behavior).
- The preview region has an accessible label/heading so screen readers
  announce it as a distinct region.
- The preview is read-only; it must not be announced as editable.
- Focus management: activating a timestamp button may leave focus on the
  button (consistent with a normal button activation). Do not trap focus
  or jump to the page header. Do not forcibly return focus to the
  textarea on click.

## 9. Regression Boundaries

Do not regress:

- Dashboard task and idea cards.
- Add Task fast capture, including the optional YouTube URL field.
- Inline task edit/delete.
- Today category filters, overdue/today/completed-today sections.
- Upcoming incomplete-future-only behavior.
- Completed grouping and sorting by `completedAt`.
- Standard Task Detail origin tracking and dirty navigation protection.
- YouTube Task Detail Phase 4D, 4E, and 4F behavior except where this
  spec explicitly changes it (adding the preview region inside the notes
  card).
- Phase 4F Insert Timestamp button, cursor behavior, and token format.
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
- Rich-text editor, formatting toolbar, in-textarea clickable timestamps,
  or notes editing inside the preview.

## 10. Acceptance Criteria

Phase 4G is acceptable when:

- A rendered notes preview region appears below the `youtubeNotes`
  textarea inside the YouTube Task Detail notes card.
- The preview is rendered only in YouTube Task Detail, not in Standard
  Task Detail, Add Task, or any other view.
- The preview updates live from the current local draft `youtubeNotes`,
  including before Save, so a freshly inserted or typed timestamp is
  clickable immediately.
- Valid tokens `[M:SS]` and `[H:MM:SS]` render as clickable buttons.
- Malformed or non-timestamp bracketed text renders as plain text with no
  error state.
- Clicking an enabled timestamp calls the existing `seekAndPlay(seconds)`
  helper, which seeks the embedded player to that time and starts
  playback.
- Valid timestamp buttons are **disabled** (and non-interactive) only
  under the existing render-time conditions: no valid saved video /
  parsed video ID, or player error fallback.
- Disabled timestamp buttons still render as pills and preserve the note
  structure; they are visibly greyed and not clickable.
- Clicking a timestamp does not throw when the player ref is unexpectedly
  unavailable at click time; the click no-ops.
- Clicking a timestamp does not change `lastWatchedSeconds` directly,
  does not bump `updatedAt`, does not trigger dirty-form, and does not
  write to `localStorage`.
- The preview is read-only; it never mutates `youtubeNotes`.
- The existing textarea editor and Save Changes flow are preserved.
- The Phase 4F Insert Timestamp button, cursor behavior, and token format
  remain unchanged.
- The Phase 4E layout is preserved: sidebar, header, left video/metadata
  column, and notes card placement are unchanged except for the added
  preview region below the textarea.
- The preview looks polished and visually integrated, not like raw parsed
  text or debug output; it feels like a lightweight study-notes reader.
- Timestamp buttons look like app-native blue pill buttons / inline
  accent chips, not default browser buttons.
- The preview uses a max-height around 240px–260px and scrolls internally
  when notes are long, so the textarea stays usable and is not crowded.
- Empty notes show a polished, discoverable placeholder (e.g.
  "Timestamped notes will appear here."), not a hidden region.
- The preview has a local-only collapse/expand toggle in the heading row,
  defaulting to expanded. When collapsed, the body hides but the heading
  and toggle remain visible. The toggle is keyboard-accessible (clear
  `aria-label` and `aria-expanded`). The collapse state is not persisted.
- Insert Timestamp default position is the end of existing notes when the
  textarea has never been focused in the current session (not position 0).
- Standard Task Detail is unchanged.
- Origin return, dirty-form, delete, and completion behavior remain
  consistent with Phase 4F.
- No data-shape change, no migration, no sample-data change, and no new
  task field was added.
- No new npm packages were added.
- `npm run build` passes before declaring implementation complete.
- `npm run lint` passes before declaring implementation complete.
- Manual browser testing is completed in a normal browser before
  declaring implementation complete.

## 11. Manual Browser Test Checklist

- Open a YouTube Task with a valid saved URL and existing timestamped
  notes: the preview renders below the textarea with clickable
  timestamps.
- Click Insert Timestamp before typing any note: `[0:00] ` appears in the
  textarea and a clickable `[0:00]` button appears in the preview
  immediately, before Save.
- Type a timestamp manually, e.g. `[12:45]`, into the textarea: the
  preview shows a clickable button as soon as the token is complete.
- Type a malformed token, e.g. `[12:4]`, `[1:2:3]`, `[note]`, or
  `[12:45 note]`: it renders as plain text in the preview, no error.
- Type a bare `12:45` without brackets: it renders as plain text.
- Play the video, then click a `[12:45]` button in the preview: the
  player seeks to 12:45 and starts playing.
- Click a timestamp while the video is paused: the player seeks and
  starts playing (seek + play).
- Click a timestamp with an invalid / embed-disabled video fallback
  showing: the timestamp button is **disabled** (greyed, non-interactive)
  and clicking does nothing and does not throw.
- Open a YouTube Task with a blank/invalid URL: no player renders and all
  timestamp buttons in the preview are disabled but still render,
  preserving the note structure.
- Trigger a player error (private/removed/embed-disabled video): the
  error fallback card shows and timestamp buttons in the preview become
  disabled but remain visible.
- Click a timestamp whose value exceeds the video duration: the player
  seeks (clamped by YouTube); no crash.
- Edit notes in the textarea after clicking a timestamp: the textarea is
  still editable; preview updates.
- Long notes: the preview scrolls internally (max-height 240px)
  without pushing the textarea off-screen.
- Collapse the preview with "Hide" button: body hides, heading and
  toggle remain. "Show" button re-expands it. Toggle is keyboard-
  focusable with clear aria-label and aria-expanded. Collapse state
  resets on reopen (not persisted).
- Empty notes: the preview shows the polished placeholder
  ("Timestamped notes will appear here."); the region stays visible.
- The placeholder hides when preview is collapsed, and shows again on
  expand.
- Open a YouTube Task with saved notes (e.g. `[0:15] Intro\n[2:45] Main
  idea`). Do not click the textarea. Click Insert Timestamp: the new
  timestamp appends at the end on its own line (e.g.
  `[0:15] Intro\n[2:45] Main idea\n[12:30] `). Focus goes to textarea,
  caret is after the trailing space.
- Open a YouTube Task with empty notes. Do not click the textarea. Click
  Insert Timestamp: `[0:00] ` inserts at position 0 (end === 0, at start
  of line, no newline prefix). Focus goes to textarea.
- The preview looks polished and visually integrated — white/soft-gray
  surface, subtle border, rounded corners, comfortable spacing.
- Timestamp buttons look like app-native blue pills / accent chips, not
  default browser buttons.
- Disabled timestamp pills visibly look disabled but preserve the note
  structure.
- Clicking a timestamp does not change the "Last updated" label, does
  not trigger dirty-form, and does not persist anything immediately.
- Save Changes persists notes as plain text (with bracket tokens);
  reopening shows the same notes and the same clickable preview.
- Dirty-form protection still triggers for textarea edits; confirming
  Discard loses unsaved notes and the preview reverts to saved state.
- Standard Task Detail opens without any preview region.
- Phase 4E/4F layout preserved: compare the YouTube Task Detail page
  before/after — sidebar, header, Back/Delete/Save, video card, Resume
  button, Open video link, metadata grid, notes label row, Insert
  Timestamp button, and textarea are unchanged except the added preview
  region below the textarea.
- Add Task, Today filters, Upcoming, Completed, Dashboard, Quick Ideas,
  inline edit/delete, and localStorage persistence remain intact.
- `npm run build` passes.
- `npm run lint` passes.

## 12. Likely Implementation Files

Likely new files:

- `docs/clickable-timestamp-notes-spec.md` — this spec.

Likely modified files:

- `src/components/YouTubeTaskDetail.jsx` — render a preview region below
  the textarea; map parsed segments to text nodes and timestamp buttons;
  wire button clicks to `seekAndPlay`; disable buttons under the existing
  render-time no-video / player-error conditions.
- `src/utils/youtube.js` — add a `parseTimestampNotes(text)` helper
  returning an ordered segment array. `formatSeconds` and
  `parseYouTubeVideoId` are reused as-is.
- `src/styles/task-detail.css` — compact, polished preview region styles:
  white/soft-gray surface, subtle border, rounded corners, "Preview"
  heading, max-height ~240px–260px with scroll, timestamp pill button
  style reusing existing blue-accent tokens, and a disabled pill state.

Likely unchanged:

- `src/hooks/useYouTubePlayer.js` — already returns `seekAndPlay`; no
  change needed.
- `src/hooks/useLocalStorage.js` — no new setter, no default change.
- `src/data/migrate.js` — no migration.
- `src/data/sampleData.js` — no sample-data change.
- `src/components/StandardTaskDetail.jsx` — unchanged.
- `src/components/AddTaskForm.jsx` — unchanged.
- Row inline-edit components and page components — unchanged.

No new application files are required beyond the spec itself; the parser
helper goes into the existing `src/utils/youtube.js`.

## 13. Next-Step Boundary

Do not add a rich-text editor, formatting toolbar, in-textarea clickable
timestamps, notes editing inside the preview, a timestamp outline panel,
YouTube Data API, API keys, new packages, backend, Firebase, or routing
as a patch to Phase 4G. Those require separate future specs (Phase 4H or
later).
