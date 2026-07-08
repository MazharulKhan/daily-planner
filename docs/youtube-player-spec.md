# Phase 4E — YouTube Player and Resume Foundation

**Status: Draft — pending approval. Not yet implemented.**

This spec is the Phase 4E source of truth. It must be approved before any
application code is changed.

## 1. Purpose

Phase 4E turns the existing Phase 4D external-link YouTube workflow into an
in-app video-learning workspace while keeping `youtubeNotes` as plain text.

The goal is to render a responsive embedded YouTube player inside YouTube Task
Detail, parse accepted saved YouTube URLs into a usable video ID without
rewriting the stored URL, track playback position as background state, and let
the user resume from a meaningful saved position.

This phase must preserve all completed behavior from Phases 2, 3A, 3B, 4A, 4B,
4C, and 4D.

## 2. Explicit Approvals

Phase 4E explicitly approves use of the YouTube IFrame Player API for
app-controlled playback events, current-time reads, and seeking. The IFrame
Player API is loaded from the public YouTube embed script. No API key, no
package, no npm dependency, no backend, no auth, and no cloud sync is required
or permitted for this workflow.

## 3. Explicitly Deferred

Do not build in Phase 4E:

- Timestamp insertion (Insert Timestamp control).
- Clickable timestamp notes or seeking from notes.
- Rich-text editor or formatting toolbar.
- Notes preview / rendered reading view.
- YouTube Data API.
- API keys or secrets.
- New npm packages.
- Backend APIs, authentication, Firebase, or cloud sync.
- React Router or any routing library.
- A standalone YouTube or Learning sidebar destination.
- Reading Tasks.
- Thumbnail grids, playlists, or channel browsing.

`youtubeNotes` must remain a plain textarea in this phase.

## 4. Existing Task Data and New Task Shape

Existing task fields remain supported and preserved:

- `id`, `title`, `description`, `taskType`, `youtubeUrl`, `youtubeNotes`,
  `completed`, `completedAt`, `priority`, `category`, `time`, `dueDate`,
  `updatedAt`.

Phase 4E adds one field to every task:

- `lastWatchedSeconds` — a non-negative finite number representing the last
  saved playback position, in seconds, for the task's saved `youtubeUrl`.
  Default `0`.

Every task should have one consistent shape after migration or creation,
including Standard Tasks. Standard Tasks carry `lastWatchedSeconds` but do not
show or use it in the Standard workflow.

## 5. Safe localStorage Migration

Continue storing tasks in the existing `dp.tasks` localStorage key.

On initial load, run the task migration and persist the full normalized task
array back to `dp.tasks` immediately after migration.

Migration rules for `lastWatchedSeconds`:

- If `task.lastWatchedSeconds` is a finite number and `>= 0`, preserve it.
- Otherwise set `lastWatchedSeconds` to `0`.
- Preserve all existing task fields, including `youtubeUrl`, `youtubeNotes`,
  `completedAt`, `description`, `updatedAt`, `priority`, `category`,
  `dueDate`, and `time`.
- Migration must be idempotent.
- Migration must preserve completed-phase migration behavior.

## 6. New Task Defaults

New tasks must immediately include:

- `lastWatchedSeconds: 0`

Do not rely only on a future browser-refresh migration to add this field.

`useLocalStorage.addTask` must include `lastWatchedSeconds: 0` in its default
spread. Starter sample tasks must include `lastWatchedSeconds: 0`.

## 7. Playback Position Is Background State

`lastWatchedSeconds` is automatic background tracking state, not a user edit.

Rules:

- Playback position saves must NOT change `updatedAt`.
- Playback position saves must NOT trigger dirty-form state.
- `lastWatchedSeconds` is excluded from the dirty-form comparison in
  YouTube Task Detail.
- The "Last updated" label and timestamp reflect real user edits only, never
  background position saves.
- Do not reuse the existing `editTask` setter for playback position, because
  `editTask` always bumps `updatedAt`.

Instead, add a dedicated setter:

- `editPlaybackPosition(id, seconds)` in `useLocalStorage.js`.

Behavior of `editPlaybackPosition`:

- Writes only `lastWatchedSeconds` on the matching task.
- Does NOT change `updatedAt`.
- Does NOT touch any other field.
- Must avoid unnecessary writes: do not persist when the saved rounded/floored
  position has not meaningfully changed compared to the already-saved value.
  Recommended approach: floor both the incoming seconds and the currently saved
  seconds to integers and skip the write when they are equal.

When the user edits `youtubeUrl` to a different video and Saves, the normal
Save `editTask` patch must include `lastWatchedSeconds: 0` so a stale position
is not applied to a different video. This IS a user edit and does update
`updatedAt` through the existing Save behavior.

## 8. Video ID Parsing

Add a `parseYouTubeVideoId(url)` helper (in `src/utils/youtube.js`).

Requirements:

- Parse from the saved, already-validated `task.youtubeUrl`. Do not parse from
  the live draft.
- Accept the URL formats already approved by Phase 4D validation:
  - `youtube.com/watch?v=ID`
  - `www.youtube.com/watch?v=ID`
  - `m.youtube.com/watch?v=ID`
  - `youtu.be/ID`
- Also accept these additional path forms when the hostname is an approved
  YouTube host:
  - `/embed/ID`
  - `/shorts/ID`
  - `/live/ID`
- Strip extra query parameters (for example `&list=`, `?t=`, `?si=`).
- Return `null` for unsupported, malformed, or empty input.
- Never rewrite the stored `youtubeUrl` string. The stored URL is the source of
  truth; the video ID is derived at render time.

Do not read or use the `?t=` / `?start=` query parameter to seed
`lastWatchedSeconds`. Resume is driven only by the saved `lastWatchedSeconds`.

Add a `formatSeconds(seconds)` helper that returns `MM:SS` for durations under
one hour and `H:MM:SS` (zero-padded minutes) for durations of one hour or more.
Return `0:00` for non-finite or negative input.

## 9. Embedded YouTube Player

Render a responsive 16:9 embedded YouTube player inside YouTube Task Detail when
the saved `task.youtubeUrl` is valid and `parseYouTubeVideoId` returns a
non-null ID.

Requirements:

- Use the YouTube IFrame Player API. A static `<iframe>` embed alone is not
  sufficient because Phase 4E needs app-controlled playback events,
  current-time reads, and seeking.
- Load the IFrame API idempotently from the public YouTube embed script. Use a
  window-level "loading / ready" guard so the script is injected at most once.
  Queue `new YT.Player(...)` calls until `window.YT` is available.
- Create the player on mount when a video ID exists; start at
  `task.lastWatchedSeconds` seconds.
- Destroy the player on unmount. Before destroy, persist the final known
  position from the latest current-time ref using `editPlaybackPosition`.
- Responsive sizing: use a 16:9 wrapper (padding-top hack or `aspect-ratio`).
  On desktop the player should be large enough to be usable, approximately
  480 x 270 minimum where the layout allows. On screens at or below 900px
  wide the two-column workspace stacks and the player stays 16:9.

Do not render a fake player placeholder, thumbnail, disabled Resume button, or
disabled timestamp control. If there is no valid video ID, do not render a
player area at all.

## 10. Playback Position Persistence Policy

Persist `lastWatchedSeconds` using `editPlaybackPosition` (no `updatedAt` bump)
at these moments:

- On pause (`onStateChange === YT.PlayerState.PAUSED`).
- On video end (`onStateChange === YT.PlayerState.ENDED`) — write `0`.
- On leaving the detail page (component cleanup, reading the latest
  current-time ref before destroying the player).
- Throttled periodic checkpoint every 5 seconds while playing.

When the video ends, write `0` so the next open starts from the beginning and
no useless Resume button appears.

When the video ends, set the latest playback-position ref to 0 before calling
`editPlaybackPosition(0)`, and ensure unmount cleanup does not overwrite the
ended-state reset with the video duration.

The periodic checkpoint must read the player's current time and call
`editPlaybackPosition`. It must clear its interval on unmount and when the
player is destroyed.

## 11. Resume from MM:SS

Show a Resume button only when there is a meaningful saved playback position:

- `lastWatchedSeconds >= 5`, AND
- if the video duration is known, `lastWatchedSeconds < duration - 3`.

Label the button using `formatSeconds(lastWatchedSeconds)`, for example:
"Resume from 12:45".

Clicking Resume:

- `player.seekTo(seconds, true)` then `player.playVideo()` (seek and auto-play).

If the live `youtubeUrl` draft differs from the saved `youtubeUrl`, hide the
Resume button because the saved position would be stale until Save. After Save
resets `lastWatchedSeconds` to `0` for a changed URL, Resume will not appear
until the user plays the new video and a checkpoint is saved.

## 12. Error / Unavailable Video Fallback

Handle invalid, private, removed, or embedding-disabled videos with a clear,
non-breaking fallback state.

Requirements:

- Listen to the IFrame player `onError` callback.
- On error codes 100 (video not found / private), 101, or 150 (embedding not
  allowed), show a non-breaking fallback card such as:
  "This video can't be played here."
- The fallback card must keep the existing Open video external link so the user
  can still open the video on youtube.com.
- The YouTube Task Detail workspace must remain fully usable after a player
  error: Title, Description, Task Type, Priority, Category, Due Date, Time,
  Completion, Delete, Save, Back, notes textarea, dirty-form protection, and
  origin return must all continue to work.
- A player error must never crash the detail workspace.

## 13. YouTube Notes

`youtubeNotes` stays a separate plain-text field from `description`.

Use a normal textarea. Preserve meaningful line breaks.

Do not add:

- Rich-text editor.
- Formatting toolbar.
- Timestamp insertion.
- Clickable timestamps.
- Seeking from notes.
- A notes preview / reading view.

## 14. Add Task Optional YouTube URL

Add Task remains fast and low-clutter.

When `taskType === 'youtube'` is selected in Add Task -> More options, reveal an
optional "YouTube video URL" field directly below Task Type.

Requirements:

- The field is optional. A YouTube Task can be created with a blank URL.
- Validation must mirror YouTube Task Detail validation: trim surrounding
  whitespace, allow `http:` / `https:` only, allow only the approved YouTube
  hostnames, reject lookalikes such as `youtube.com.example.com`.
- An invalid nonblank URL blocks Add Task with inline validation, matching the
  existing Add Task validation pattern.
- Do not add a YouTube Notes field to Add Task. Notes are only editable in
  YouTube Task Detail.
- When `taskType` is changed back to Standard Task, the YouTube URL field is
  hidden again. Any value typed into it is discarded unless the task is created
  as a YouTube Task with a valid URL.

A YouTube Task created with a valid URL should open YouTube Task Detail with
the embedded player ready on the next title selection.

## 15. YouTube Task Detail Layout

Reuse the existing task-detail shell, design tokens, spacing, and visual
language, moving closer to the `docs/ui-reference/03-learning-task-detail.png`
mockup as visual direction only. The mockup does not add a Learning sidebar
destination; active specs override old mockup content.

On desktop, use a two-column workspace below the detail header.

Left column, inside a white video card:

- YouTube video URL input
- Responsive 16:9 embedded YouTube player (when a valid saved URL yields a
  video ID)
- Resume from MM:SS button (when meaningful)
- Open video external fallback link (when a valid URL is saved)
- Task Type, Priority, Category, Due Date, Time, Completion metadata fields
  below the video card

Right column, inside a white notes card:

- YouTube Notes plain textarea with enough vertical space for meaningful notes

Use clean white cards, subtle borders, rounded corners, blue primary
buttons/links, compact labels, and the existing Daily Planner styling. The
player should be responsive and large enough to be usable on desktop.

Do not render fake player placeholders, thumbnails, disabled Resume buttons,
or disabled timestamp controls.

## 16. Task-Type Transition Rules

Task-type transition rules are unchanged from Phase 4D:

- Changing Task Type updates only local draft state until Save.
- The currently open detail workspace does not switch during editing.
- After Save, the task returns to its origin view and opens in its new
  workspace only on the next title selection.
- Standard -> YouTube preserves existing/default `youtubeUrl`, `youtubeNotes`,
  and `lastWatchedSeconds`.
- YouTube -> Standard preserves `youtubeUrl`, `youtubeNotes`, and
  `lastWatchedSeconds` even though those fields are hidden in the Standard
  workflow.
- Never silently delete `youtubeUrl`, `youtubeNotes`, or `lastWatchedSeconds`.
- Changing only Category, including Learning <-> Personal, must never change
  the selected detail workspace.

When saving a YouTube -> YouTube edit where `youtubeUrl` changed to a different
video, the Save patch must include `lastWatchedSeconds: 0` so the stale
position is not applied to the new video.

## 17. Navigation, Origin Return, Dirty Form, Delete, and Completion

Origin return, dirty-form, delete, and completion behavior are unchanged from
Phase 4D. Specifically:

- Opening from Dashboard, Today, Upcoming, or Completed returns to that view.
- Back, Save, Delete, and confirmed discard return to the originating view.
- Dirty-form behavior matches Phase 4B and 4C: no silent discard, inline
  discard confirmation, Keep Editing / Discard Changes actions, mutually
  exclusive delete and discard confirmations.
- `lastWatchedSeconds` is excluded from the dirty-form comparison.
- Background playback position saves never trigger the dirty-form confirmation.
- Completion sets/clears `completedAt` only on completion state change.
- Delete requires inline confirmation and permanently removes the task.

## 18. Accessibility and Focus

Preserve existing accessibility and focus behavior from completed phases.

Additional Phase 4E requirements:

- The Resume button has a clear accessible label including the timestamp.
- The player wrapper is keyboard-non-blocking; the underlying YouTube player
  iframe retains its own keyboard controls.
- The error fallback card is announced clearly and keeps the Open video link
  keyboard-accessible.
- The optional Add Task YouTube URL field has a label and inline validation
  association matching the existing Add Task pattern.

## 19. Regression Boundaries

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
- YouTube Task Detail Phase 4D behavior except where this spec explicitly
  changes it.
- Quick Ideas workspace behavior.
- localStorage persistence and migration.

Do not introduce:

- Category-based detail selection.
- Learning, Reading, or YouTube sidebar destination.
- React Router or any routing library.
- New npm packages.
- Backend / API / cloud / auth functionality.
- YouTube Data API or API keys.

## 20. Acceptance Criteria

Phase 4E is acceptable when:

- The YouTube IFrame Player API is approved and used for embedded playback,
  current-time reads, and seeking. No API key, package, backend, YouTube Data
  API, auth, or cloud sync was added.
- `lastWatchedSeconds` is added to every task with safe migration and default
  `0`.
- Existing saved tasks migrate with `lastWatchedSeconds` preserved when finite
  and `>= 0`, otherwise `0`.
- New tasks and starter sample tasks include `lastWatchedSeconds: 0`.
- A dedicated `editPlaybackPosition(id, seconds)` setter exists and writes only
  `lastWatchedSeconds` without changing `updatedAt`.
- `editPlaybackPosition` avoids unnecessary writes when the saved
  rounded/floored position has not meaningfully changed.
- Playback position saves do not change `updatedAt` and do not trigger
  dirty-form state.
- `lastWatchedSeconds` is excluded from the YouTube Task Detail dirty
  comparison.
- Accepted saved YouTube URLs are parsed into a usable video ID without
  rewriting the stored URL.
- YouTube Task Detail renders a responsive 16:9 embedded player when a valid
  saved URL yields a video ID.
- The Open video external link remains as a secondary fallback.
- Playback position is persisted on pause, on video end (writing `0`), on
  leaving the detail page, and via a 5-second throttled periodic checkpoint.
- On video end, `lastWatchedSeconds` is set to `0`.
- Resume from MM:SS appears only when meaningful and seeks plus auto-plays.
- Invalid, private, removed, or embed-disabled videos show a non-breaking
  fallback card with the Open video link still available.
- `youtubeNotes` remains a plain textarea with no rich-text, timestamp
  insertion, clickable timestamps, or preview.
- Add Task -> More options reveals an optional YouTube video URL field only
  when Task Type is YouTube Task. The field is optional and validates the same
  way as YouTube Task Detail. No YouTube notes field was added to Add Task.
- Changing `youtubeUrl` to a different video and Saving resets
  `lastWatchedSeconds` to `0`.
- Standard <-> YouTube task-type transitions preserve `youtubeUrl`,
  `youtubeNotes`, and `lastWatchedSeconds`.
- Origin return, dirty-form, delete, and completion behavior remain consistent
  with Phase 4D.
- Completed Phase 2, 3A, 3B, 4A, 4B, 4C, and 4D behavior remains intact.
- `npm run build` passes before declaring implementation complete.
- `npm run lint` passes before declaring implementation complete.
- Manual browser testing is completed in a normal browser before declaring
  implementation complete.

## 21. Manual Browser Test Checklist

- Existing saved tasks migrate with `lastWatchedSeconds` preserved when finite
  and `>= 0`, otherwise `0`; all other fields preserved; refresh keeps data.
- New collapsed Add Task creates a Standard Task with `lastWatchedSeconds: 0`.
- Add Task -> More options with Task Type = YouTube reveals an optional
  YouTube URL field; switching back to Standard hides it.
- A YouTube Task created with a valid URL opens YouTube Task Detail with the
  embedded player ready on the next title selection.
- A YouTube Task created with a blank URL opens YouTube Task Detail with no
  player area and no Resume button; URL can be added later.
- Valid `watch?v=`, `youtu.be`, `/embed/`, `/shorts/`, and `/live/` URLs render
  the embedded 16:9 player after Save.
- Invalid or lookalike URLs block Save with inline validation.
- A persisted invalid URL shows no player and no Open link; it can be
  corrected or cleared before Save.
- Playing, pausing, then leaving the detail page persists position; reopening
  shows Resume from MM:SS.
- Resume button appears only when meaningful (>= ~5s and, if duration known,
  < duration - 3); clicking it seeks and auto-plays.
- Video ending resets `lastWatchedSeconds` to `0`; reopening does not show a
  useless Resume button.
- Private, removed, or embed-disabled videos show a non-breaking fallback card
  and keep the Open video link; the detail workspace remains usable.
- Periodic 5-second checkpoint persists position while playing without
  spamming the "Last updated" timestamp; `updatedAt` is unchanged by
  background position saves.
- Dirty-form protection triggers only for user edits (URL, title, notes,
  metadata, type), never for background position saves.
- Changing `youtubeUrl` to a different video hides stale Resume; Save resets
  `lastWatchedSeconds` to `0`.
- Standard <-> YouTube task-type transitions preserve `youtubeUrl`,
  `youtubeNotes`, and `lastWatchedSeconds`.
- Open video link opens in a new tab with safe rel attributes.
- YouTube notes preserve line breaks and persist after refresh.
- Completion, delete, origin-return, discard confirmation, and focus rules
  remain unchanged.
- Today filters, Upcoming, Completed, Dashboard, Quick Ideas, inline edit
  /delete, and localStorage behavior remain intact.
- Responsive: desktop two-column with a usable player (~480x270+); mobile
  stacks, player stays 16:9.
- `npm run build` passes.
- `npm run lint` passes.

## 22. Likely Implementation Files

Likely new files:

- `src/utils/youtube.js` — `parseYouTubeVideoId`, `formatSeconds`.
- `src/hooks/useYouTubePlayer.js` — IFrame API script load, player
  create/destroy, event subscription, throttled checkpoint, current-time ref.
- `docs/youtube-player-spec.md` — this spec.

Likely modified files:

- `src/components/YouTubeTaskDetail.jsx` — embedded player, Resume button,
  error fallback, persistence wiring.
- `src/components/AddTaskForm.jsx` — optional YouTube URL field gated on
  Task Type = YouTube.
- `src/data/migrate.js` — `lastWatchedSeconds` normalization.
- `src/hooks/useLocalStorage.js` — `lastWatchedSeconds` default and
  `editPlaybackPosition` setter.
- `src/data/sampleData.js` — `lastWatchedSeconds: 0` on sample tasks.
- `src/styles/task-detail.css` — video card, 16:9 responsive iframe wrapper,
  Resume button, error fallback styles.

Likely unchanged:

- `src/App.jsx` (detail selection is already type-driven).
- `src/components/StandardTaskDetail.jsx`.
- Row inline-edit components and page components.

Do not modify row inline-edit components to expose `lastWatchedSeconds`.

## 23. Next-Step Boundary

Do not add timestamp insertion, clickable timestamp notes, rich-text editor,
notes preview, YouTube Data API, API keys, packages, backend, Firebase, or
routing as a patch to Phase 4E. Those require separate future specs.
