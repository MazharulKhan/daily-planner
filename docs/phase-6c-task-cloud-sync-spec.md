# Phase 6C - Task Cloud Sync Specification

**Status:** Approved for implementation planning
**Approved:** July 21, 2026
**Parent specification:** docs/phase-6-firebase-cloud-edition-spec.md
**Previous phase:** Phase 6B - Secure Firestore Data Foundation, complete
**Branch:** feature/phase-6-firebase
**Baseline commit:** 8d7005ba1f4c78136e62106d038218f30c0a6137
**Implementation status:** Not started
**Hard constraint:** Firebase remains on Spark with no billing account

---

## 1. Document Status and Authoritative References

This draft is the focused, implementation-ready contract for Phase 6C. Once
approved, it defines behavior and boundaries; a later plan-only pass determines
exact implementation mechanics and files.

Read and apply these sources in priority order:

1. This Phase 6C specification once approved.
2. docs/project-status.md.
3. docs/build-plan.md.
4. docs/phase-6-firebase-cloud-edition-spec.md.
5. docs/phase-6b-secure-firestore-foundation-spec.md for the completed
   repository, converter, schema, index, and Security Rules contracts.
6. Completed task-workflow specifications for affected behavior.

AGENTS.md remains binding for repository-wide safety, scope, verification, and
approval gates. This specification does not authorize implementation,
deployment, commits, or pushes by itself.

---

## 2. Purpose

Phase 6C cuts the authenticated cloud edition's tasks over completely from
dp.tasks to Cloud Firestore. It connects the Phase 6B task repository and
subscription foundation to the existing React task interface.

The result is one private, real-time task workspace per Firebase UID while
preserving the completed Dashboard, task-list, detail, completion, deletion,
YouTube notes, timestamp-note, playback, filtering, sorting, responsive, and
accessibility behavior.

This is a task-only cutover. Quick Ideas remain browser-local until Phase 6D.

---

## 3. Repository Baseline

At the approved baseline:

- Firebase Authentication is active with Google as the only provider.
- The planner renders only after authentication resolves and only for a
  signed-in user.
- The signed-in Firebase user is available to the Planner tree.
- Firestore is configured with memory-only caching.
- Local emulator safeguards restrict Auth and Firestore emulator use to
  localhost and a demo project.
- Planner still obtains tasks and Quick Ideas from the local hooks.
- Tasks currently use dp.tasks; Quick Ideas currently use dp.ideas.
- dp.theme and dp.activeView are device-local preferences.
- Phase 6B provides and tests one task subscription primitive and dedicated
  repository operations for creation, content changes, completion/reopening,
  playback position, and deletion.
- Phase 6B converters expose domain tasks with Firestore document IDs and ISO
  timestamp strings.
- Phase 6B Security Rules enforce owner-only paths, exact fields, and
  operation-specific update classes.
- No production task component currently invokes the task repository.

Phase 6C must connect this foundation, not duplicate or redesign it without a
specific blocker identified during planning.

### Phase 6B contract retained

The authoritative Phase 6B document shape remains unchanged:

~~~text
title, description, taskType, youtubeUrl, youtubeNotes,
lastWatchedSeconds, completed, completedAt, priority, category,
time, dueDate, createdAt, updatedAt
~~~

The UI domain object additionally has id, derived from the Firestore document
ID; id is never stored in the document. Firestore timestamps remain inside the
converter/repository boundary.

Content, completion, playback, and deletion continue using their dedicated
repository operations. Playback-only updates do not modify updatedAt.
Security Rules remain default-deny, owner-only, exact-field, and
operation-classified. Phase 6C must not weaken these contracts.

---

## 4. Confirmed Product Decisions

- Firestore is the cloud edition's only task source. One listener per signed-in app instance supplies every task surface; filtering, sorting, grouping, and progress remain client-side.
- Firestore auto-IDs replace UI persistence IDs. Existing Standard/YouTube workflows remain functional, and every asynchronous mutation prevents duplicates and visibly reports failure.
- Initial loading differs from confirmed empty: keep the planner shell and local Quick Ideas visible, disable task mutations until the first snapshot, and retain known data after a later listener failure.
- Firestore stays memory-only with no task localStorage fallback. Unsaved detail drafts survive snapshots; saves patch only user-changed fields; same-field edits are last-write-wins without conflict UI.
- Completion and playback use dedicated operations. Remote deletion safely closes an open detail and informs the user.
- Five-second playback sampling stays local. Continued-playback writes occur at most every 30 seconds; pause, leave, end, and best-effort hidden/unload writes bypass that delay. Failures do not interrupt video or cause aggressive retry.
- Pending Firestore writes activate the approved sign-out confirmation. Sign-out/UID change clears listeners and all user-scoped task state before another user's loading state.
- Quick Ideas remain local, usable, and temporarily not isolated by UID until their Phase 6D cutover. dp.theme and dp.activeView remain local.
- Firebase stays emulator-first and on Spark without billing. No package, Firebase product, production deployment, production Rules deployment, or cloud release is added in Phase 6C.

---

## 5. Phase 6C Scope

### Included

- Replace production task localStorage access with one Firestore listener and shared task state for the current UID.
- Connect Add, inline edit, detail save, completion/reopening, deletion, and playback to the Phase 6B repository.
- Provide lifecycle/connectivity state, listener and mutation errors, retry, pending-write sign-out protection, dirty-draft protection, and remote-deletion handling.
- Verify same-user synchronization, cross-user/account-switch isolation, 30-second playback throttling, and immediate lifecycle writes.
- Keep Quick Ideas local with the approved disclosure; add focused helper tests where practical and update status docs only after implementation verification.

### Regression boundary

Do not regress Dashboard, Today, Upcoming, Completed, Standard Task Detail, YouTube Task Detail, timestamp-note, filtering, sorting, progress, completion, reopening, deletion, or Add Task behavior. Preserve dirty navigation, origin return, task-type transitions, YouTube player/Resume/link/notes/timestamps/bullet behavior, light/dark theme, responsive layout, focus/keyboard behavior, and ARIA semantics. taskType still selects the workspace; category remains metadata only.

---

## 6. Explicit Exclusions and Phase 6D Boundary

Phase 6C does not include:

- Any read, inspection, import, upload, merge, deletion, overwrite, or fallback involving dp.tasks; starter/sample/seeded cloud tasks.
- Moving Quick Ideas to Firestore, attaching an idea listener, cross-device idea sync, idea UID isolation, or remote idea-deletion handling.
- Changes to the approved task document shape or Phase 6B Rules classes.
- A parent users/{uid} document or duplicated ownerId/profile fields.
- Durable Firestore/IndexedDB persistence or a custom offline queue.
- Conflict history, versions, merge UI, or conflict dialogs.
- Per-task Syncing/Synced indicators or a force-sync action.
- Automatic retry orchestration or aggressive mutation retries.
- Soft delete, trash, undo, archives, batch deletion, or collection rewrites.
- Page-specific listeners, polling, collection-group queries, or read-before-every-write behavior.
- New routes/pages/auth providers/npm packages/state libraries, TypeScript, or unrelated refactors.
- Firebase Functions, Storage, Hosting, Extensions, Analytics, App Check, or any other Firebase/Google Cloud product.
- Final app-wide reliability polish, README release work, v2 Vercel configuration, production environment/Rules/index changes, deployment, release, merge, or URL promotion.

Phase 6D owns the Quick Ideas cutover, removal of the temporary shared-browser
idea limitation, final reliability review, documentation/release work, and
separately approved production actions.

---

## 7. Clean-Start and Local-Storage Contract

### Tasks

After cutover, Firestore is the only active task store. The cloud edition must
never:

- Read or inspect dp.tasks.
- Upload, copy, merge, migrate, delete, overwrite, or modify dp.tasks.
- Use local tasks to influence a Firestore workspace.
- Show local/sample tasks while Firestore loads or fails.
- Fall back to dp.tasks when Firestore is offline or unavailable.

Existing dp.tasks data may remain untouched in the browser for the preserved v1
edition. Code used by the cloud task layer must not import task storage,
migration, or starter-data paths.

### New accounts and confirmed empty state

A new authenticated UID has an empty Firestore task collection. No task
document is created automatically. Only a successful empty snapshot activates
normal task empty states and enables Add Task.

While that account has no cloud tasks, show the clean-start explanation in the
task-cloud status area. It may stop appearing after the first task is created,
must not offer import, and uses the copy in Section 16.

### Local keys retained

- dp.theme and dp.activeView remain device-local and unchanged.
- dp.ideas remains local only for the Phase 6C transition described in
  Section 15.

---

## 8. Shared Task Listener and State Ownership

### Ownership

One focused hook or equivalent service, owned near the top of the signed-in
Planner tree, must:

- Accept the authenticated UID.
- Own task subscription setup, retry, and cleanup.
- Expose the shared committed task array.
- Expose initial-load, empty/ready, connectivity, and listener-error state.
- Expose the task mutation adapter and mutation errors.
- Expose pending task-write information to the auth/sign-out flow.
- Avoid local task storage and starter task imports.

Do not attach listeners from Dashboard, Today, Upcoming, Completed, Add Task,
detail components, rows, or individual players.

### Subscription lifecycle

Subscribe only for a non-empty authenticated UID.

On UID change:

1. Unsubscribe the previous listener.
2. Immediately clear old task data, selected-task/detail state, pending
   operation state, and task errors.
3. Enter initial loading without retaining previous-user placeholders.
4. Subscribe to the new UID.

On sign-out or unmount, unsubscribe and clear the same user-scoped task state.
The previous user's data must never flash for the next user.

Guard callbacks from stale listeners or operations so an old UID cannot
repopulate state after cleanup.

### Snapshot contract

Each successful snapshot:

- Converts all documents through the Phase 6B converter.
- Emits one complete shared domain-task array.
- Replaces committed task state without page-specific filtering or sorting.
- May reconcile Firestore latency-compensated local writes.
- Never exposes Firestore timestamps, snapshots, references, or sentinels to
  React.

Listener/conversion failure enters the error path; it never substitutes an
empty array. After at least one successful snapshot, retain the last successful
task list through a later listener failure.

### Restored navigation

dp.activeView continues restoring the last normal workspace. A restored task
page shows its loading state until the first snapshot and is not redirected
merely because tasks are unknown. Task details and Add Task remain unrestored
after refresh. If Quick Ideas is restored, it remains locally usable while the
single task listener initializes in the shared shell.

---

## 9. Task Loading, Connectivity, and Listener Errors

The shared layer must distinguish at least:

~~~text
initial-loading
ready (non-empty or confirmed-empty)
offline
reconnecting
listener-error
~~~

Mutation errors may coexist with ready/offline task data.

### Initial loading

Before the first successful snapshot:

- Keep Sidebar, Header, account controls, theme, navigation, planner shell, and
  Quick Ideas visible.
- Show loading placeholders/messages wherever task lists or progress would
  otherwise appear.
- Disable Add Task and task edit, complete, reopen, delete, and detail-save
  controls.
- Do not show sample/local tasks, normal task empty states, or misleading
  progress such as 0 of 0.

### Ready and confirmed empty

A successful non-empty snapshot renders tasks and enables controls. A successful
empty snapshot enables Add Task, renders existing empty states, and shows the
clean-start explanation. Loading and listener failure are never interpreted as
empty.

### Offline and reconnecting

When the current tab loses connectivity:

- Keep last-known task data visible.
- Allow Firestore latency-compensated writes where supported.
- Disclose that changes are pending synchronization; do not claim server
  confirmation.
- Never fall back to localStorage or erase committed tasks.

Because Firestore cache is memory-only, an offline refresh may have no task
data. Show cloud-unavailable/loading-error presentation, never local/sample
tasks or a confirmed empty account.

When connectivity returns and task synchronization is resuming, show the
non-blocking reconnecting message. Detailed app-wide reconnect polish remains
Phase 6D.

### Listener failures and retry

If the first listener fails:

- Keep the planner shell.
- Do not show empty/local/sample tasks.
- Show a persistent error with Retry and Sign out.

Retry clears the listener error, disposes any failed subscription, enters
initial loading, and starts one fresh subscription for the current UID.

If a listener fails after data loaded, keep the last successful task list and
show a persistent error with Retry. Do not replace tasks with an empty array.

---

## 10. Common Task Mutation Contract

All task mutations use the current UID and Phase 6B repository, affect only the
intended document, return an observable promise, preserve Firebase error
information, and never use localStorage or rewrite the collection.

### Shared asynchronous behavior

Unless an operation-specific rule below overrides it:

1. Validate client input and calculate the minimal normalized change.
2. Use the current listener-provided task for no-op/transition decisions; do
   not read Firestore before every write.
3. If nothing changed, perform no write and treat the action as a successful
   no-op.
4. While a write attempt is pending, expose a clear saving/deleting/adding
   state and disable duplicate submission.
5. Keep the relevant editor, modal, detail, or confirmation open until the
   required operation is accepted by Firestore's local client pipeline.
6. After local acceptance, the surface may close and must rely on the shared
   listener for canonical task reconciliation; do not permanently append,
   replace, or remove a second hand-built task copy.
7. On immediate rejection, keep the surface/action context and unsaved draft
   available, restore controls, show an inline operation-specific error, and
   do not announce success.
8. If a locally accepted offline write is rejected after its surface closed,
   show a persistent dismissible mutation banner identifying the operation.
9. Never present a rejected write as saved or server-confirmed.

The implementation plan must define the concrete signal used to distinguish
immediate client rejection, locally pending acceptance, and server
acknowledgement.

Inline errors are preferred while the originating surface exists. Persistent
banners cover failures outside an active surface, including completion,
playback, and late offline rejection.

At minimum, map permission-denied, unavailable/network,
resource-exhausted/quota, and unknown failures to beginner-friendly messages.
Do not expose stack traces or sensitive internals. Retain the original code or
cause for development diagnostics.

Advanced rollback, per-document pending UI, and automatic retry orchestration
remain deferred.

---

## 11. Create, Edit, Completion, and Deletion Rules

### Create

The Add Task modal submits approved creation content only:

~~~text
title, description, taskType, youtubeUrl, youtubeNotes,
lastWatchedSeconds, priority, category, time, dueDate
~~~

The UI does not generate/send a persistence ID or timestamps. The repository
creates the Firestore auto-ID and forces incomplete state, null completedAt,
and server-generated createdAt/updatedAt under the Phase 6B contract.

While adding, disable repeat submission and ambiguous closing paths and show an
Adding state. After local acceptance, close/reset the modal, restore focus using
existing behavior, and let the shared snapshot supply the task. On immediate
failure, retain every draft field and show the add error inline.

### Inline content edit

Inline edit continues to change only title, priority, category, time, and
dueDate. Save a patch containing only fields changed by the user. Preserve
description, taskType, YouTube values, playback, completion, and timestamps.
Untouched remote fields must not be overwritten.

Keep the inline editor open during the immediate attempt. A no-op closes it
without a Firestore write; immediate failure retains its draft and error.

### Completion and reopening

Every checkbox/control uses the dedicated completion repository operation, not
the content patch.

- Completing writes completed true, server-generated completedAt, and
  server-generated updatedAt.
- Reopening writes completed false, completedAt null, and server-generated
  updatedAt.
- Repeating the current state is a no-op.
- No unrelated field changes.
- Failure is visibly reported with no false success.

### Delete

Deletion uses the current UID path, deletes only the addressed document, and
retains the existing confirmation UI. There is no soft delete or undo.

Keep the confirmation/detail surface open and disable repeat deletion until
local acceptance. Then close it, return detail views to their origin, and let
the listener remove the task. Immediate failure keeps/restores the task and
confirmation context and shows the delete error.

### Remote deletion of an open task

If a successful snapshot no longer contains the selected open task:

- Close Standard or YouTube Task Detail.
- Clear the selected task ID.
- Return to its originating normal workspace.
- Discard the local draft because the underlying document no longer exists.
- Show the persistent, dismissible remote-deletion message.

This applies to clean and dirty drafts and must not crash or render a missing
task workspace.

---

## 12. Detail Workspaces and Concurrent Sessions

### Shared detail-save contract

Standard and YouTube Task Detail retain existing validation, dirty detection,
dirty navigation protection, completion control, task-type transition behavior,
origin return, Cancel, delete confirmation, responsive layout, and accessible
interaction.

For Save:

1. Validate the workspace-specific fields.
2. Track/calculate only content fields changed by the user.
3. Send those fields through the content-update operation.
4. If completion changed, invoke the dedicated completion operation.
5. Never send createdAt, updatedAt, or completedAt as content.
6. Never send lastWatchedSeconds as ordinary content.
7. Show one saving state and prevent duplicate Save.
8. Return to origin only after every required operation is accepted locally.
9. If an immediate required operation fails, remain in detail, preserve the
   draft for retry, show the inline save error, and do not announce success.
10. A content no-op with no completion change succeeds without a write.

A save can require one content update and one completion update against the
same document. The implementation plan must define their clear sequence and
partial-failure handling without merging repository operation classes or
claiming full success when either required operation failed.

### Draft protection and concurrent sessions

Committed task state continues updating from the listener, but a listener
snapshot must not replace the visible unsaved detail draft, including its
completion draft. Keep the latest remote task internally as the repository/save
baseline.

On save:

- Write only fields the user changed.
- Preserve unrelated remote fields.
- Use last-write-wins when both sessions changed the same field.
- Add no conflict dialog, merge history, or version UI.

Remote snapshots update task lists and clean/non-dirty surfaces normally.
Playback snapshots may update committed state without dirtying or overwriting a
content/notes draft.

### Standard Task Detail differences

Standard detail content fields are:

~~~text
title, description, taskType, priority, category, dueDate, time
~~~

Preserve title validation and the existing task-type transition helper. A
category change alone never changes the detail workspace.

### YouTube Task Detail differences

YouTube detail content fields are:

~~~text
title, description, taskType, youtubeUrl, youtubeNotes,
priority, category, dueDate, time
~~~

Preserve YouTube URL validation, plain-text notes, Insert Timestamp, clickable
timestamp preview, bullet continuation, embedded player, Resume, external
video link, and existing transition behavior.

When youtubeUrl changes, including changing to a valid blank value, the content
repository resets playback to 0 in the same write. The component does not add a
generic playback patch. An unchanged URL preserves playback. YouTube notes and
content drafts remain protected from remote snapshots.

---

## 13. YouTube Playback Persistence

### Sampling and write schedule

The player may continue sampling current time locally every five seconds for
runtime behavior. Those callbacks do not each write to Firestore.

Persist lastWatchedSeconds:

- At most once every 30 seconds during uninterrupted continued playback.
- Immediately on pause.
- Immediately when leaving YouTube Task Detail.
- As 0 immediately when the video ends.
- Best effort when the page becomes hidden.
- Best effort when the page begins unloading.

Pause, leave, and end bypass the normal 30-second delay. Losing approximately
30 seconds after a crash/forced close is acceptable.

### Write contract

Every playback attempt:

- Floors a finite non-negative value to an integer.
- Skips an unchanged normalized value.
- Uses the dedicated playback repository operation.
- Changes only lastWatchedSeconds.
- Preserves createdAt and updatedAt.
- Does not change task content, notes, completion, or metadata.
- Does not mark the task detail form dirty.

At video end, update the latest in-memory position reference to 0 so later
cleanup cannot overwrite 0 with the duration.

### Throttle and failure ownership

Own the throttle in a focused playback persistence adapter/hook rather than
rendering code. Avoid one timer per listed task, global polling, inactive-task
writes, and overlapping duplicate writes.

Playback failure:

- Does not interrupt playback, close detail, dirty the form, or overwrite
  content.
- Shows the restrained dismissible playback error.
- Does not trigger an aggressive retry loop.
- May be retried only by the next normal checkpoint, pause, leave, end, or
  lifecycle opportunity.

Hidden/unload persistence is explicitly best effort; it must not add a new
backend, synchronous network workaround, localStorage queue, or package.

---

## 14. Pending Writes, Sign-Out, and Account Isolation

### Pending-write tracking

Replace the unused Phase 6A seam with real task pending-write awareness.
Pending means a task write accepted into Firestore's client pipeline but not
yet acknowledged. Unsaved form drafts are not pending Firestore writes and
remain governed by existing dirty-form protection.

Communicate pending task-write state to the auth/sign-out flow without adding
per-task syncing UI.

### Sign-out

With no pending task writes:

1. Disable repeated Sign out.
2. Coordinate listener cleanup and clear task/selection/error state.
3. Sign out through Firebase Auth.
4. Show the signed-out screen.

If Auth sign-out fails, show the existing sign-out error and keep the signed-in
session usable.

With pending task writes, show the in-app confirmation in Section 16:

- **Keep syncing:** close confirmation, remain signed in, and preserve the
  listener/task state.
- **Sign out anyway:** stop the listener, clear user task state, abandon the
  current session's opportunity to finish those pending writes, then sign out.

Do not use window.confirm. Reuse the app's confirmation visual language.

### Isolation

- Every repository path uses the authenticated UID.
- No listener starts without a valid UID.
- UID cleanup follows Section 8 before new-user loading.
- No UID-independent cloud task state is persisted locally.
- Old task data, detail selection, task errors, and stale callbacks cannot
  cross into a new account session.
- Firestore Security Rules remain the final authorization boundary.

---

## 15. Quick Ideas Transitional Behavior

Throughout Phase 6C:

- Dashboard Quick Ideas and the Quick Ideas workspace remain functional through
  the existing local idea hook and dp.ideas.
- No production Quick Idea repository/listener is attached.
- Task cutover does not read, migrate, upload, modify, or delete dp.ideas.
- Quick Ideas do not synchronize across devices.
- Quick Ideas are temporarily not isolated by Firebase UID within one browser
  profile; changing Firebase accounts may reveal the same local ideas.
- The Quick Ideas workspace displays the informational, non-blocking copy in
  Section 16.
- Quick Ideas are neither hidden nor disabled during task loading.

This same-browser, cross-account visibility is an approved temporary limitation,
must remain documented, and ends only with the Phase 6D Firestore cutover.

---

## 16. Accessibility and Approved UI Copy

### Accessibility

Preserve all completed accessibility behavior. New cloud UI must also:

- Use a suitable live region for task loading without repetitive
  announcements.
- Present persistent listener/mutation failures with role alert or an
  equivalent accessible pattern.
- Keep offline/reconnecting notices non-disruptive to screen readers.
- Use native disabled semantics during initial load and pending submissions.
- Give async buttons meaningful visible text or accessible names.
- Make Retry and dismiss controls real keyboard-accessible buttons.
- Give dismissible banners an accessible dismissal label.
- Announce remote deletion accessibly.
- Never communicate status by color alone.
- Make the pending-write confirmation keyboard accessible, focus it on open,
  restore focus on cancel, and prevent duplicate sign-out.

### Central copy

Minor grammatical changes are allowed only when meaning is unchanged.

| State | Approved default copy |
|---|---|
| Initial task loading | Loading your cloud tasks... |
| Confirmed clean-start empty account | Your cloud task list starts empty. Tasks from the local edition were not imported. |
| Offline | You're offline. Task changes will sync when the connection returns. |
| Reconnecting | Reconnecting to task cloud sync... |
| Initial/later listener failure | Cloud tasks could not be loaded. |
| General detail save failure | This task could not be saved. Your changes are still here. |
| Add failure | This task could not be added. Check your connection and try again. |
| General content mutation failure | Task changes could not be saved. |
| Completion failure | Completion status could not be updated. |
| Delete failure | This task could not be deleted. |
| Playback failure | Video progress could not be synced. |
| Remote deletion | This task was deleted on another device. |
| Pending-write sign-out | Changes are still syncing. Sign out anyway? |
| Quick Ideas disclosure | Stored on this browser until Quick Ideas cloud sync is added. |

Permission errors explain access denial and may offer Sign out. Unavailable
errors explain that cloud service could not be reached. Quota errors say cloud
sync is temporarily unavailable. Unknown errors provide a general retry
message. Initial listener failure always includes Retry and Sign out.

---

## 17. Verification Requirements

Phase 6C implementation must be developed and tested against Auth and Firestore
emulators. Local verification must not contact live Firebase.

### Automated checks

Run:

~~~text
npm run build
npm run lint
npm run test:rules
git diff --check
~~~

All must pass. Phase 6B Rules/converter coverage must remain passing and its
contracts unchanged unless a separately approved correction is required.
Continue using Node's built-in test runner; add no test framework.

Where practical, add focused tests for:

- Error mapping and minimal changed-field patches.
- Detail save decomposition into content/completion operations.
- Creation without a UI-generated ID.
- Playback 30-second throttling, lifecycle bypass, end reset, no-op behavior,
  and failure restraint.
- Pending-write tracking and initial-listener retry.
- UID cleanup/stale-callback protection when isolatable.

### Emulator and normal-browser scenarios

Test grouped behavior rather than repeating every operation on every page.

#### Clean start and task identity

- Seed dp.tasks locally, sign in as a new emulator user, and prove no local task
  is shown, inspected, uploaded, changed, or used as fallback.
- Confirm no starter cloud tasks, a true empty first snapshot, the clean-start
  explanation, and enabled Add Task only after that snapshot.
- Create Standard and YouTube tasks, including blank/valid YouTube URLs.
- Confirm Firestore document IDs are domain IDs and no id field is stored.

#### CRUD, task pages, and detail saves

- Exercise create, inline edit, completion/reopening, deletion, and Standard/
  YouTube detail saves across representative existing surfaces.
- Verify changed-field patches, content-plus-completion saves, no-op writes,
  timestamps, URL playback reset, and preservation of unrelated fields.
- Force immediate and late failures; verify drafts/context, disabled duplicate
  submission, inline/banner errors, and no false success.
- Confirm all Dashboard, Today, Upcoming, Completed, detail, timestamp-note,
  filtering, sorting, progress, completion, deletion, responsive, theme, and
  accessibility regressions remain covered.

#### Same-user synchronization and remote drafts

- Use two active sessions for one UID and verify create, edit, complete, reopen,
  and delete synchronize both directions without duplicate documents/listeners.
- Keep an unsaved detail draft in one session while the other edits the same
  task; verify the draft remains, untouched remote fields survive save, and
  same-field edits use last-write-wins.
- Delete the open task remotely and verify safe close, origin return, cleared
  selection/draft, and the approved message.

#### Cross-user isolation and account switching

- Prove User A owns only User A paths and Rules deny User A get/list/create/
  update/delete access under User B.
- Switch A to B and back; verify cleanup, loading, correct restored data, and
  no previous-user flash or stale-callback repopulation.

#### Loading, listener failures, and navigation

- Delay the first snapshot; verify the shell/Quick Ideas stay usable, task
  content is loading rather than empty, progress is not misleading, and all
  task mutation controls are disabled.
- Force initial listener failure; verify persistent error, Retry, Sign out, and
  successful one-listener recovery.
- Force a later failure; verify last-known task data remains visible.
- Verify dp.activeView restores normal workspaces without restoring detail/
  modal state or duplicating listeners.

#### Offline and pending writes

- Load online, disconnect, and verify last-known tasks, offline copy, current-
  tab latency-compensated behavior, and no server-confirmed claim.
- Reconnect and verify pending synchronization and reconnecting presentation.
- Refresh offline and verify cloud-unavailable presentation with no local,
  sample, or false-empty tasks.
- Create a pending task write, invoke Sign out, and verify Keep syncing and
  Sign out anyway, cleanup, duplicate prevention, and Auth sign-out failure
  recovery.

#### Playback persistence

- Prove five-second sampling does not cause five-second writes and continued
  playback writes at most once per 30 seconds.
- Verify immediate pause/leave, end-to-0, and best-effort hidden/unload writes.
- Verify unchanged seconds no-op, playback-only writes preserve updatedAt, end
  cleanup cannot overwrite 0, and a failed write does not interrupt video or
  trigger aggressive retry.

#### Quick Ideas, responsive, and accessibility

- Verify Dashboard/workspace ideas remain local and usable, show the approved
  disclosure, create no Firestore documents, and leave dp.ideas unchanged.
- Verify desktop/mobile loading, error, offline, confirmation, and banner UI in
  a normal browser at the Vite localhost URL; do not rely on the built-in
  preview.
- Verify keyboard/focus/live-region/alert behavior and no color-only status.

### Security, performance, and cost audit

Confirm:

- Phase 6B owner-only exact-field Rules and all update classes remain enforced.
- One task listener exists per signed-in app instance; there is no page-specific
  listener, task polling, collection-group query, full collection rewrite, or
  read before every update.
- Mutations affect only intended documents and normalized no-ops do not write.
- Playback continued-write rate is at most one per 30 seconds.
- Firestore cache remains memory-only.
- Only approved Firebase products/dependencies exist.
- Development and production Firebase projects remain Spark with no billing
  account or paid trial.
- No live Rules/index deployment, production configuration, or release action
  occurred.

Accept quota interruption rather than enabling billing. Stop if any required
setup action demands billing.

---

## 18. Acceptance Criteria

Phase 6C is complete only when:

1. Tasks have moved completely from dp.tasks to Firestore in the cloud edition.
2. Cloud task code never reads, inspects, migrates, uploads, merges, changes, deletes, or falls back to dp.tasks.
3. New cloud accounts start empty and receive no starter tasks.
4. Exactly one shared task listener exists per signed-in app instance.
5. All task pages, cards, calculations, and detail workspaces use that shared task state.
6. Firestore document IDs are domain IDs and UI-generated IDs are removed.
7. Existing Standard/YouTube task workflows and task-page behavior pass regression testing.
8. Every task mutation visibly reports failure and never reports false success.
9. Initial loading is distinct from confirmed empty.
10. The planner shell remains visible during initial task loading.
11. Task creation and mutation controls are disabled through the first successful snapshot.
12. A later listener failure preserves previously loaded task data.
13. Initial listener failure provides Retry and Sign out.
14. Offline behavior remains Firestore memory-only with no task localStorage fallback.
15. Remote snapshots do not overwrite unsaved detail drafts.
16. Detail and inline saves update only fields changed by the user.
17. Completion/reopening always uses the dedicated repository operation.
18. Same-field concurrent edits use last-write-wins with no conflict dialog.
19. Remote deletion closes an open detail safely and shows the approved message.
20. Playback remains locally sampled and continued-playback writes occur at most once every 30 seconds.
21. Pause, leave, and end write immediately; hidden/unload writes are best effort.
22. Playback-only writes preserve updatedAt.
23. Playback failures do not interrupt video or cause aggressive retry.
24. Pending task writes trigger the approved sign-out confirmation.
25. Sign-out/UID change safely clears listeners and user-scoped task state.
26. Previous-user task data never flashes for the next user.
27. Quick Ideas remain local and usable.
28. Quick Ideas show: Stored on this browser until Quick Ideas cloud sync is added.
29. The temporary lack of Firebase UID isolation for local Quick Ideas remains documented and verified.
30. Quick Ideas remain deferred to Phase 6D.
31. dp.theme and dp.activeView remain local and unchanged.
32. Firebase remains on Spark without billing.
33. No new Firebase product or npm package is introduced.
34. Development and verification are emulator-first.
35. Production deployment, production Rules deployment, final cloud release, merge, and URL promotion remain outside Phase 6C.
36. Phase 6B document, converter, repository, and Rules contracts remain intact, including playback-only updatedAt behavior.
37. Same-user synchronization and cross-user isolation pass manual/emulator verification.
38. Build, lint, Rules/converter tests, and git diff --check pass.
39. Required desktop/mobile normal-browser testing passes.
40. Documentation is updated only after implementation verification, and no commit or push occurs without explicit approval.

---

## 19. Implementation Workflow and Definition of Done

### Planning and likely architectural touchpoints

After this specification is explicitly approved, a coding agent must:

1. Read AGENTS.md, project status, build plan, the Phase 6 master spec, Phase 6B spec, and this document.
2. Confirm branch, baseline, and working-tree state.
3. Inspect current task ownership, auth/sign-out seam, Phase 6B repository/converter, mutation/detail surfaces, player lifecycle, styles, and tests.
4. Produce an implementation plan only, including exact files, data flow, operation sequencing, tests, risks, and exclusions.
5. Wait for explicit plan approval before editing.

Likely areas are shared task-cloud state, Planner/auth integration, existing mutation/detail surfaces, playback persistence, Quick Ideas disclosure, status/error styles, and focused tests. This is not a prescribed file list; planning determines the smallest safe set from current code.

### Implementation discipline

- Make the smallest safe task cutover and preserve completed behavior.
- Do not combine Phase 6C and Phase 6D.
- Use regular JavaScript, React, Vite, regular CSS, and existing packages.
- Do not change the Phase 6B schema/Rules contract without separate approval.
- Do not touch dp.tasks or deploy live Firebase resources.
- Do not commit or push unless explicitly requested.

### Definition of done

Phase 6C is done only after:

- This specification and a plan-only implementation plan are separately reviewed and approved.
- Implementation stays within this scope.
- All automated checks and grouped emulator/manual scenarios in Section 17 pass.
- Same-user sync, isolation/account switching, offline/failure behavior, playback throttling, remote draft/deletion handling, pending-write sign-out, Quick Ideas regression, responsive layout, and accessibility are verified.
- The user reviews the implementation result.
- Project status and build plan record Phase 6C completion and Phase 6D next; README release work remains deferred.
- Any commit or push receives separate explicit approval.

Phase 6D begins only after Phase 6C is implemented, verified, documented, and separately approved to proceed.
