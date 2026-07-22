# Phase 6B — Secure Firestore Data Foundation Specification

**Status:** Complete
**Parent specification:** `docs/phase-6-firebase-cloud-edition-spec.md`
**Branch:** `feature/phase-6-firebase`
**Baseline:** Latest committed and pushed Phase 6A state
**Implementation status:** Complete
**Hard constraint:** Firebase must remain on Spark with no billing account

## 1. Purpose

Phase 6B creates and proves the secure Firestore data foundation for the
Firebase edition of Daily Planner.

This sub-phase adds the user-scoped Firestore paths, data converters,
repositories, subscription primitives, Security Rules, index exemptions, and
focused emulator tests required by the future cloud cutovers.

Phase 6B does **not** move the production planner UI from `localStorage` to
Firestore. Tasks and Quick Ideas continue using the existing local hooks and
storage behavior throughout this sub-phase.

At the end of Phase 6B:

- The app has a tested Firestore data layer for tasks and Quick Ideas.
- Firestore document IDs map to domain-object `id` values without storing `id`
  inside documents.
- Firestore `Timestamp` values are converted to the ISO strings expected by the
  application.
- Owner-only, default-deny Security Rules protect every approved path.
- Core field, type, timestamp, completion, and playback invariants are enforced.
- Focused emulator tests prove authentication and cross-user isolation.
- Long text fields that are never queried are exempted from indexing.
- No task or Quick Idea production listener is attached to the React app.
- The visible planner remains localStorage-backed exactly as it was after
  Phase 6A.

This file is the exact Phase 6B contract. The parent Phase 6 specification
remains authoritative for the complete cloud architecture and later cutovers.

---

## 2. Current Repository Baseline

The focused implementation plan must account for the committed Phase 6A state:

- `src/firebase/firebase.js` initializes Firebase Authentication and Firestore.
- Firestore uses memory-only caching through `memoryLocalCache()`.
- Emulator mode connects Authentication to `127.0.0.1:9099` and Firestore to
  `127.0.0.1:8080`.
- Emulator mode is restricted to localhost and a `demo-` project ID.
- `getFirestoreInstance()` exposes the initialized Firestore client.
- `src/App.jsx` hides the planner until authentication resolves and renders the
  planner only for a signed-in user.
- `src/hooks/useAuth.js` owns authentication state. It contains a future
  pending-write seam, but Phase 6A performs no content writes.
- `src/components/Planner.jsx` still consumes `useTasks` and `useIdeas` from
  `src/hooks/useLocalStorage.js`.
- `dp.tasks` and `dp.ideas` remain the active content stores.
- `dp.theme` and `dp.activeView` remain device-local preferences.
- `firestore.rules` currently denies every read and write.
- `tests/firestore-rules.test.mjs` currently contains only deny-all smoke tests.
- `firestore.indexes.json` currently has no indexes or field overrides.
- `npm run test:rules` runs the Firestore emulator and Node's built-in test
  runner.
- The approved dependencies already exist:
  - `firebase`
  - `firebase-tools`
  - `@firebase/rules-unit-testing`
- No new package is required or approved for Phase 6B.

Phase 6B should add the smallest clear data-layer architecture that supports the
future Phase 6C and 6D cutovers without refactoring the existing planner UI.

---

## 3. Phase Boundary

### 3.1 Included in Phase 6B

Phase 6B includes:

- User-scoped task and Quick Idea Firestore paths.
- Central path construction owned by the data layer.
- Task and Quick Idea Firestore converters or equivalent dedicated mapping
  functions.
- Task and Quick Idea repository modules.
- Repository mutation functions with normalized no-op protection.
- Subscription primitives that return cleanup functions.
- Exact allowed Firestore document fields.
- Default-deny, authenticated, owner-only Firestore Security Rules.
- Essential type, enum, timestamp, completion, and playback validation.
- Focused Rules tests using the Firestore emulator.
- Focused pure tests for converter/normalization behavior where practical.
- Index exemptions for approved long text fields that are never queried.
- Documentation updates after implementation is complete.

### 3.2 Explicitly deferred to Phase 6C

Do **not** build in Phase 6B:

- Replacing task `localStorage` persistence with Firestore.
- Attaching the task subscription to `Planner`, `App`, task pages, cards, or
  task-detail workspaces.
- Changing Add Task, edit, complete, reopen, delete, or playback UI behavior.
- Task cloud loading, empty, offline, reconnecting, or mutation-error UI.
- Same-user task synchronization in the production planner.
- Remote deletion handling for an open task detail workspace.
- Pending-write sign-out behavior for real task writes.
- Thirty-second playback write throttling in the active YouTube player flow.

### 3.3 Explicitly deferred to Phase 6D

Do **not** build in Phase 6B:

- Replacing Quick Idea `localStorage` persistence with Firestore.
- Attaching the Quick Idea subscription to the production planner.
- Same-user Quick Idea synchronization in the UI.
- Remote deletion handling for an expanded or edited Quick Idea.
- Global offline/reconnecting presentation.
- Final deployment, release, README, or v2 URL work.

### 3.4 Other exclusions

Do not add:

- A `users/{uid}` profile document.
- An `ownerId`, email, display name, or other duplicated ownership field in task
  or idea documents.
- Data migration from `dp.tasks` or `dp.ideas`.
- Cloud starter data or seed data.
- A fallback from Firestore to localStorage.
- Durable Firestore persistence or IndexedDB caching.
- Firebase Admin SDK, Functions, Storage, Hosting, Analytics, Extensions,
  App Check, or any additional Firebase product.
- New authentication providers.
- New npm packages.
- React Router, TypeScript, a state-management library, or unrelated refactors.
- Production Rules deployment, live content writes, or live data deletion.

---

## 4. Clean-Start and LocalStorage Contract

The Phase 6 clean-start rule remains binding:

- The cloud data layer must never read `dp.tasks` or `dp.ideas`.
- It must never upload, merge, copy, delete, overwrite, or inspect local v1 task
  or idea content for Firebase purposes.
- Firestore repositories must not import `src/data/storage.js`,
  `src/data/migrate.js`, or `src/hooks/useLocalStorage.js`.
- Repository and Rules tests must create test-only emulator documents directly.
- No normal Phase 6B browser run should create Firestore task or idea documents.
- Existing browser localStorage content must remain untouched.
- `dp.theme` and `dp.activeView` continue operating locally.
- New cloud accounts are intended to begin empty when the UI cutovers happen in
  Phase 6C and Phase 6D; Phase 6B does not yet expose that empty cloud workspace
  in the production UI.

---

## 5. Firestore Paths and Ownership

Use exactly these paths:

```text
users/{uid}/tasks/{taskId}
users/{uid}/ideas/{ideaId}
```

Rules:

- `uid` comes only from the authenticated Firebase user.
- Repository callers pass a UID; repositories construct all Firestore paths.
- React components must never construct collection or document paths.
- Task and idea document IDs use Firestore auto-generated IDs.
- A document's Firestore ID becomes the domain object's `id`.
- `id` is never stored as a document field.
- A physical `users/{uid}` document is not required and must not be created.
- Ownership is derived exclusively from the UID path.
- No collection-group query is required in Phase 6.
- No query crosses user paths.

The data layer must reject an empty or invalid UID before attempting a
Firestore operation.

---

## 6. Domain Objects and Firestore Documents

### 6.1 General conversion rule

UI-facing domain objects use normal JavaScript values:

- IDs are strings from Firestore document IDs.
- `createdAt`, `updatedAt`, and non-null `completedAt` are ISO strings.
- Nullable values remain `null`.
- React components never receive Firestore `Timestamp` instances,
  `DocumentSnapshot` instances, references, or server-timestamp sentinels.

Firestore documents use Firestore-native values:

- `createdAt`, `updatedAt`, and non-null `completedAt` are Firestore
  timestamps.
- Create and normal content-update timestamps are written with
  `serverTimestamp()`.
- Documents omit the `id` field.

Converters or dedicated mapper functions own every timestamp translation.
Repositories must not scatter timestamp conversion across mutation functions.

### 6.2 Pending server timestamps

Future Firestore listeners will receive latency-compensated local snapshots.
Required timestamp fields must therefore remain usable while server timestamps
are pending.

The conversion layer must:

- Request estimated values for pending server timestamps where the Firebase SDK
  supports snapshot timestamp estimates.
- Convert the estimated timestamp to an ISO string.
- Never replace required `createdAt` or `updatedAt` with arbitrary browser
  timestamps during a write.
- Treat a committed document with missing or invalid required timestamp fields
  as a conversion/data error rather than silently normalizing it.
- Preserve `completedAt: null` when a task is incomplete.

A conversion failure must be surfaced to the subscription error path. It must
not silently emit an empty list or a partially converted list.

---

## 7. Task Document Contract

### 7.1 Exact stored fields

Every task document contains exactly these fields:

```text
title
description
taskType
youtubeUrl
youtubeNotes
lastWatchedSeconds
completed
completedAt
priority
category
time
dueDate
createdAt
updatedAt
```

No other field is allowed.

The domain object additionally contains:

```text
id
```

The `id` is derived from the Firestore document ID and is not stored.

### 7.2 Task field validation

The repository validates inputs before writing, and Security Rules enforce the
essential persisted contract.

| Field | Required contract |
|---|---|
| `title` | String containing at least one non-whitespace character |
| `description` | String |
| `taskType` | Exactly `standard` or `youtube` |
| `youtubeUrl` | String; may be blank |
| `youtubeNotes` | String |
| `lastWatchedSeconds` | Integer, finite, and greater than or equal to `0` |
| `completed` | Boolean |
| `completedAt` | Firestore timestamp when completed; otherwise `null` |
| `priority` | Exactly `High`, `Medium`, or `Low` |
| `category` | Exactly `Work`, `Learning`, `Personal`, or `Health` |
| `time` | `null` or a valid 24-hour `HH:MM` string |
| `dueDate` | `null` or a `YYYY-MM-DD` string using a basic calendar-shape check |
| `createdAt` | Firestore timestamp; server-generated on create; immutable |
| `updatedAt` | Firestore timestamp; server-generated on create and normal content updates |

Notes:

- The existing client-side YouTube URL validator remains responsible for
  approved YouTube hosts and protocols. Security Rules enforce the field's
  type, not full URL parsing.
- Phase 6B does not introduce new user-visible character limits. Exhaustive
  field-length boundaries remain deferred unless the implementation plan
  identifies an existing matching UI constraint and the user approves it.
- The basic date rule does not need exhaustive leap-year or month-length
  validation.
- Standard tasks still store `youtubeUrl`, `youtubeNotes`, and
  `lastWatchedSeconds`.
- Changing `taskType` must never delete YouTube values.

### 7.3 Task creation

Task creation must:

- Use a Firestore auto-ID document reference.
- Ignore or reject any caller-provided `id`, `createdAt`, `updatedAt`, or
  `completedAt` field.
- Write the complete exact field set in one operation.
- Force `completed: false`.
- Force `completedAt: null`.
- Normalize `lastWatchedSeconds` to a non-negative integer.
- Set `createdAt` and `updatedAt` using `serverTimestamp()` in the same write.
- Return the generated document ID through the repository result.
- Never create a parent `users/{uid}` document.

Security Rules must require:

- `createdAt == request.time`.
- `updatedAt == request.time`.
- `completed == false`.
- `completedAt == null`.

New completed tasks are not created directly. Completion occurs through an
update.

### 7.4 Normal task content updates

A normal content update may change only approved task content fields plus the
required timestamp and invariant fields.

The content-update repository path may update:

```text
title
description
taskType
youtubeUrl
youtubeNotes
priority
category
time
dueDate
```

It must not accept direct caller changes to:

```text
createdAt
updatedAt
completed
completedAt
lastWatchedSeconds
```

Rules:

- `createdAt` remains unchanged.
- `updatedAt` is set with `serverTimestamp()` and must equal `request.time`.
- `completed` and `completedAt` remain unchanged.
- If `youtubeUrl` changes, `lastWatchedSeconds` resets to `0` in the same
  update.
- If `youtubeUrl` does not change, `lastWatchedSeconds` remains unchanged.
- Unchanged normalized data causes no Firestore write.
- Patch-style updates are preferred; do not rewrite unrelated documents or
  collections.

The repository may automatically add `lastWatchedSeconds: 0` when an approved
content patch changes `youtubeUrl`.

### 7.5 Completion and reopening

Completion changes use a dedicated repository operation rather than a generic
content patch.

Completing an incomplete task must write:

```text
completed: true
completedAt: serverTimestamp()
updatedAt: serverTimestamp()
```

Reopening a completed task must write:

```text
completed: false
completedAt: null
updatedAt: serverTimestamp()
```

Rules must enforce:

- Incomplete to complete: `completedAt == request.time`.
- Complete to incomplete: `completedAt == null`.
- If `completed` does not change, `completedAt` must remain unchanged.
- Completion updates may not alter unrelated task fields.
- Repeating the current completion state is a no-op and performs no write.

### 7.6 Playback-only updates

Playback position uses a dedicated repository operation.

The operation must:

- Normalize the incoming value with `Math.floor` after confirming it is finite
  and non-negative.
- Skip the write when the normalized value equals the current normalized value.
- Change only `lastWatchedSeconds`.
- Not change `updatedAt`.
- Not change `createdAt`.
- Not change any task content, completion, date, or metadata field.

Security Rules must allow a playback-only update only when the document diff
changes exactly `lastWatchedSeconds` and the complete resulting task shape is
still valid.

A write that changes playback position together with any other field must fail,
except the required reset to `0` during a normal YouTube URL content update.

Thirty-second runtime throttling belongs to Phase 6C. Phase 6B provides only the
safe repository primitive and Rules contract.

### 7.7 Task deletion

Task deletion must:

- Use the authenticated user's task path.
- Delete only the addressed task document.
- Return a promise and propagate Firestore failures.
- Perform no localStorage operation.

Owner-only Rules apply. There is no soft delete, trash, archive, or batch delete.

---

## 8. Quick Idea Document Contract

### 8.1 Exact stored fields

Every Quick Idea document contains exactly:

```text
text
notes
createdAt
updatedAt
```

No other field is allowed.

The domain object additionally contains the Firestore-derived `id`.

### 8.2 Quick Idea field validation

| Field | Required contract |
|---|---|
| `text` | String containing at least one non-whitespace character |
| `notes` | String |
| `createdAt` | Firestore timestamp; server-generated on create; immutable |
| `updatedAt` | Firestore timestamp; server-generated on create and content updates |

### 8.3 Quick Idea creation

Creation must:

- Use a Firestore auto-ID document reference.
- Write the exact field set.
- Default missing notes to `''`.
- Set `createdAt` and `updatedAt` with `serverTimestamp()`.
- Ignore or reject caller-provided IDs and timestamps.
- Return the generated document ID.

Rules must require both timestamps to equal `request.time` on create.

### 8.4 Quick Idea updates

A Quick Idea content update may change:

```text
text
notes
```

Rules:

- `createdAt` remains unchanged.
- `updatedAt` equals `request.time` through `serverTimestamp()`.
- At least one of `text` or `notes` must actually change.
- Unchanged normalized data performs no write.
- Discarding an unsaved notes draft performs no repository call.
- No unrelated field may change.

### 8.5 Quick Idea deletion

Deletion removes only the addressed idea document under the authenticated UID.
There is no soft delete, trash, undo, or batch delete.

The production Quick Ideas UI continues using localStorage until Phase 6D.

---

## 9. Repository Architecture

### 9.1 Responsibilities

Repositories own:

- UID validation.
- Firestore path construction.
- Auto-ID creation.
- Input normalization and field allowlists.
- Server timestamp sentinels.
- Domain-to-Firestore mapping.
- Firestore-to-domain mapping.
- No-op detection when current domain data is supplied.
- Subscription creation and cleanup return values.
- Propagation of operation and listener errors.

Repositories do not own:

- React component state.
- View sorting or filtering.
- User-facing error copy.
- Modal or detail-workspace behavior.
- localStorage.
- Authentication observation.
- Global offline UI.

### 9.2 Required semantic API

Exact function names may vary if the OpenChamber plan provides a clear reason,
but the data layer must expose behavior equivalent to the following.

#### Tasks

```text
subscribeToTasks(uid, callbacks) -> unsubscribe
createTask(uid, taskInput) -> Promise<{ id }>
updateTaskContent(uid, taskId, currentTask, patch) -> Promise<write result>
setTaskCompletion(uid, taskId, currentTask, completed) -> Promise<write result>
updateTaskPlaybackPosition(uid, taskId, currentTask, seconds) -> Promise<write result>
deleteTask(uid, taskId) -> Promise<void>
```

#### Quick Ideas

```text
subscribeToIdeas(uid, callbacks) -> unsubscribe
createIdea(uid, ideaInput) -> Promise<{ id }>
updateIdeaContent(uid, ideaId, currentIdea, patch) -> Promise<write result>
deleteIdea(uid, ideaId) -> Promise<void>
```

Mutation results should make it possible for later UI code to distinguish an
actual write from an unchanged/no-op result without treating a no-op as an
error.

### 9.3 No read-before-write requirement

Repositories should use the current domain object already held by the future
shared listener for:

- No-op comparison.
- Completion transition decisions.
- YouTube URL-change reset behavior.
- Playback no-op comparison.

Do not add a Firestore read before every update solely to reconstruct current
state. Security Rules remain the final enforcement boundary if client state is
stale or malicious.

### 9.4 Errors

Repositories and subscription primitives must:

- Never catch and silently ignore Firestore failures.
- Preserve Firebase error codes or the original error as a cause when wrapping.
- Identify the operation type sufficiently for later UI error mapping.
- Call the subscription error callback on listener or conversion failure.
- Never convert an error into `[]`.
- Never report a rejected write as saved.

Phase 6C and Phase 6D will convert these errors into user-facing presentation.

---

## 10. Subscription Foundation

Phase 6B builds reusable subscription primitives but does not attach them to the
production React tree.

Each subscription function must:

- Accept a non-empty authenticated UID.
- Subscribe only to that UID's collection.
- Return the Firestore unsubscribe function or a safe equivalent.
- Convert every snapshot document into a domain object.
- Include the Firestore document ID as `id`.
- Emit one complete domain array per successful snapshot.
- Perform no page-specific filtering or sorting.
- Avoid `orderBy` unless the focused implementation plan demonstrates a real
  need. Existing sorting remains client-side.
- Route listener failures to an explicit error callback.
- Route conversion failures to the same error path.
- Avoid emitting an empty array as a substitute for a failed snapshot.

Phase 6B must not:

- Attach duplicate listeners per page or component.
- Add a global React context solely for unused future listeners.
- Subscribe before a non-null authenticated user exists.
- Wire listener cleanup into sign-out yet.
- Modify `App.jsx`, `Planner.jsx`, or existing task/idea hooks to consume cloud
  snapshots.

The one-task-listener and one-idea-listener app ownership rules are enforced
when the subscriptions are connected during Phase 6C and Phase 6D.

---

## 11. Firestore Security Rules

### 11.1 General rules

Security Rules are the authorization boundary. Firebase web configuration and
API keys are not authorization controls.

Rules must:

- Use `rules_version = '2'`.
- Deny all access by default.
- Require `request.auth != null`.
- Require `request.auth.uid == uid` for every approved user path.
- Permit only the approved task and Quick Idea subcollections.
- Deny reads and writes to `users/{uid}` parent documents.
- Deny all unknown paths and unspecified nested subcollections.
- Reject missing fields.
- Reject unexpected fields.
- Validate the complete resulting document on create and update.
- Preserve `createdAt` on every update.
- Enforce server timestamps for create and normal content updates.
- Distinguish task content, completion, and playback-only updates.
- Use helper functions to keep validation understandable and auditable.

### 11.2 Approved access

For an authenticated owner at their own path:

- Valid task `get` and collection `list` operations succeed.
- Valid task create, allowed updates, and delete succeed.
- Valid idea `get` and collection `list` operations succeed.
- Valid idea create, allowed updates, and delete succeed.

For unauthenticated users and cross-user paths:

- `get`, `list`, `create`, `update`, and `delete` all fail.

### 11.3 Exact field sets

Rules must use exact key allowlists for the complete document shapes.

Task keys:

```text
title, description, taskType, youtubeUrl, youtubeNotes,
lastWatchedSeconds, completed, completedAt, priority, category,
time, dueDate, createdAt, updatedAt
```

Quick Idea keys:

```text
text, notes, createdAt, updatedAt
```

### 11.4 Update classification

Task update validation must distinguish:

1. **Normal content update**
   - `updatedAt == request.time`.
   - `createdAt` unchanged.
   - Completion fields unchanged.
   - Playback unchanged unless `youtubeUrl` changed and playback resets to `0`.

2. **Completion transition**
   - Only completion fields and `updatedAt` change.
   - Completing uses `completedAt == request.time`.
   - Reopening uses `completedAt == null`.

3. **Playback-only update**
   - The diff changes exactly `lastWatchedSeconds`.
   - `createdAt` and `updatedAt` remain unchanged.
   - No other field changes.

A request must satisfy one complete update class. Combining classes outside the
approved YouTube URL reset behavior must fail.

Idea updates must change at least one content field plus `updatedAt`, preserve
`createdAt`, and change no other field.

---

## 12. Index Configuration

No composite index is required in Phase 6B.

Add single-field index exemptions in `firestore.indexes.json` for long text
fields that are never queried or ordered:

- Task `description`.
- Task `youtubeNotes`.
- Quick Idea `text`.
- Quick Idea `notes`.

Use collection-group field overrides for the `tasks` and `ideas`
subcollections so the exemptions apply beneath every user path.

Do not exempt fields used for identity, ownership, timestamps, enums, dates, or
future client-side document interpretation unless separately approved.

Do not deploy indexes or Rules to a live Firebase project during Phase 6B
without explicit user approval.

---

## 13. Automated Test Requirements

Use:

- Firebase Emulator Suite.
- `@firebase/rules-unit-testing`.
- Node's built-in test runner.
- The `demo-daily-planner` project ID or the committed demo project ID if it has
  been intentionally changed.

Do not add Jest, Vitest, the Admin SDK, or another test package.

### 13.1 Test isolation

The test harness must:

- Load the committed `firestore.rules` contents.
- Clear emulator Firestore data before each test or otherwise guarantee strict
  isolation.
- Use `withSecurityRulesDisabled` only to seed exact prerequisite documents.
- Clean up the Rules test environment after the suite.
- Never connect to development or production Firebase projects.

### 13.2 Minimum unauthenticated tests

Prove unauthenticated users cannot:

- Get a task.
- List tasks.
- Create a task.
- Update a task.
- Delete a task.
- Get an idea.
- List ideas.
- Create an idea.
- Update an idea.
- Delete an idea.

### 13.3 Minimum owner CRUD tests

For User A, prove valid operations succeed under User A's paths:

- Create, get, list, content-update, completion-update, playback-update, and
  delete a task.
- Create, get, list, content-update, and delete an idea.

### 13.4 Minimum cross-user tests

Using User A and User B, prove User A cannot:

- Get or list User B's tasks.
- Create, update, or delete a task under User B.
- Get or list User B's ideas.
- Create, update, or delete an idea under User B.

### 13.5 Unknown-path and field-shape tests

Prove the following fail:

- Reading or writing a `users/{uid}` parent document.
- Reading or writing an unspecified path or nested subcollection.
- Creating a task with a missing required field.
- Creating a task with an unexpected field.
- Updating a task to add an unexpected field.
- Creating an idea with a missing required field.
- Creating an idea with an unexpected field.

### 13.6 Task validation tests

At minimum, prove these fail:

- Empty or whitespace-only title.
- Invalid `taskType`.
- Invalid priority.
- Invalid category.
- Non-boolean `completed`.
- Non-null `completedAt` on new incomplete task.
- Completed task creation when creation is required to start incomplete.
- Negative playback position.
- Fractional playback position.
- Invalid `time` type or basic format.
- Invalid `dueDate` type or basic format.
- Client-provided literal create timestamps instead of server timestamps.
- Changing `createdAt`.
- Normal content update without a server-generated `updatedAt`.
- Completing without a server-generated `completedAt`.
- Reopening while leaving a timestamp in `completedAt`.
- Changing `completedAt` when completion state did not change.
- Changing playback position together with title, notes, metadata, completion,
  or `updatedAt`.
- Changing YouTube URL without resetting playback to `0`.
- Changing playback during a normal content update when YouTube URL did not
  change.

At minimum, prove these succeed:

- Valid task create using server timestamps.
- Valid normal content update.
- Valid YouTube URL update with playback reset to `0`.
- Valid completion transition.
- Valid reopening transition.
- Valid playback-only update that leaves `updatedAt` unchanged.

### 13.7 Quick Idea validation tests

At minimum, prove these fail:

- Empty or whitespace-only `text`.
- Invalid `notes` type.
- Client-provided literal create timestamps instead of server timestamps.
- Changing `createdAt`.
- Content update without server-generated `updatedAt`.
- Updating only `updatedAt` without changing `text` or `notes`.
- Adding an unexpected field.

At minimum, prove these succeed:

- Valid idea create using server timestamps.
- Valid title/text update.
- Valid notes update.
- Valid delete.

### 13.8 Converter and normalization tests

Add focused pure tests when the implementation exposes pure helpers without
requiring Vite or browser globals.

At minimum, cover:

- Firestore document ID becomes domain `id`.
- `id` is omitted from write data.
- Firestore timestamps become ISO strings.
- Nullable `completedAt` remains `null`.
- Invalid required snapshot timestamps cause a conversion error.
- Playback values are floored and unchanged values produce a no-op result.
- YouTube URL changes produce a playback reset in the write patch.
- Unknown caller patch fields are rejected.

If a repository smoke test can run cleanly against the existing emulator
without new dependencies or duplicate Firebase initialization, include it.
Full React listener integration testing remains Phase 6C/6D work.

### 13.9 Test command

Update `npm run test:rules` only as needed so it runs the complete Phase 6B
Firestore test set through `firebase emulators:exec`.

The command must remain emulator-only and use Node's built-in runner.

---

## 14. User-Facing and Browser Behavior

Phase 6B intentionally adds no new user-facing cloud behavior.

After implementation:

- Sign-in and sign-out still work exactly as in Phase 6A.
- Signed-in users still see their existing localStorage planner content.
- Tasks and ideas still persist locally after refresh.
- The browser app must not subscribe to task or idea Firestore collections.
- The browser app must not create Firestore task or idea documents.
- No cloud loading, syncing, offline, or write-error indicator appears yet.
- Light/dark theme and responsive behavior remain unchanged.

Manual browser verification is therefore a focused regression check rather than
cloud-sync acceptance testing.

---

## 15. Error and Cleanup Boundaries

Phase 6B must establish clean service behavior without prematurely wiring the
full UI lifecycle.

Required:

- Every mutation returns a promise.
- Every subscription returns cleanup.
- Mutation failures reject rather than being swallowed.
- Listener and conversion failures use an explicit error callback.
- Tests clean up emulator clients and data.
- No repository retains user data globally after its subscription is cleaned
  up.

Deferred:

- Calling subscription cleanup on auth transitions in the production app.
- Clearing visible cloud content on sign-out.
- Pending-write confirmation before sign-out.
- Global offline/reconnect state.
- Operation-specific user-facing error messages.

Those behaviors become active when repositories are connected in Phase 6C and
Phase 6D.

---

## 16. Likely Implementation Files

The exact module organization is determined by the approved OpenChamber plan,
but likely files include:

### New files

```text
src/firebase/firestore/taskConverter.js
src/firebase/firestore/taskRepository.js
src/firebase/firestore/ideaConverter.js
src/firebase/firestore/ideaRepository.js
```

A small shared validation/path/timestamp helper may be added only when it avoids
clear duplication without becoming a broad abstraction.

### Modified files

```text
firestore.rules
firestore.indexes.json
tests/firestore-rules.test.mjs
package.json                         # only if the existing test command must expand
docs/project-status.md               # after implementation
docs/build-plan.md                   # after implementation
```

Additional focused test files are allowed, for example:

```text
tests/firestore-converters.test.mjs
```

### Files not expected to change

Phase 6B should not need production behavior changes in:

```text
src/App.jsx
src/components/Planner.jsx
src/hooks/useAuth.js
src/hooks/useLocalStorage.js
src/data/storage.js
src/data/migrate.js
src/data/sampleData.js
UI components or CSS files
```

If the plan proposes changing these files, it must explain why the change is
necessary without performing a Phase 6C or 6D cutover.

---

## 17. Implementation Constraints

- Use the modular Firebase JavaScript SDK.
- Use regular JavaScript; no TypeScript.
- Use existing dependencies only.
- Keep Firestore memory-only caching unchanged.
- Keep all local emulator safeguards from Phase 6A unchanged.
- Do not weaken the deny-by-default fallback.
- Prefer small auditable Rules helper functions over duplicated conditions.
- Prefer repository functions over raw Firestore calls in components.
- Prefer patch-style writes over full-document rewrites for updates.
- Do not introduce transaction or batch complexity unless required for an
  approved invariant.
- Do not perform a read before every write.
- Do not add ordering queries solely for display; sorting remains client-side.
- Do not commit real Firebase environment values or credentials.
- Do not deploy Rules, indexes, or data to development or production.
- Do not commit or push unless explicitly requested.

---

## 18. Verification Requirements

Before Phase 6B can be called complete, run:

```text
npm run build
npm run lint
npm run test:rules
git diff --check
```

Also verify:

- No new npm package was added.
- No real `.env` file, service account, private key, token, or secret is staged.
- `firestore.rules` remains default-deny outside the exact approved paths.
- Rules tests use only the demo emulator project.
- Index configuration contains only the approved field exemptions.
- No production component imports or invokes the new repositories.
- `dp.tasks` and `dp.ideas` code paths remain unchanged.
- No live Firestore deployment occurred.

### Focused browser regression checks

In a normal browser using the emulators:

- Sign in with the Auth emulator.
- Confirm the existing local planner appears.
- Confirm existing `dp.tasks` and `dp.ideas` content remains present.
- Add/edit/complete/delete one local task and confirm existing behavior still
  works.
- Add/edit/delete one local Quick Idea and confirm existing behavior still
  works.
- Refresh and confirm local content remains.
- Sign out and sign in again.
- Confirm the Firestore Emulator UI contains no task or idea documents created
  by normal planner usage.
- Confirm responsive account and theme behavior did not regress.

Do not treat repository unit tests as proof of production UI cloud sync. Cloud
sync is not part of Phase 6B.

---

## 19. Acceptance Criteria

Phase 6B is complete only when all of the following are true:

1. Task paths use `users/{uid}/tasks/{taskId}`.
2. Quick Idea paths use `users/{uid}/ideas/{ideaId}`.
3. No parent user document or duplicated ownership field is created.
4. Firestore document IDs become domain IDs and are not stored in documents.
5. Task and idea converters isolate Firestore timestamp types from the UI.
6. Required timestamps become ISO strings, including estimated pending server
   timestamps.
7. Task and idea repository primitives exist for future cutovers.
8. Subscription primitives return cleanup and surface errors.
9. Mutation primitives return promises and skip normalized no-op writes.
10. Task creation uses server timestamps and starts incomplete.
11. Quick Idea creation uses server timestamps.
12. `createdAt` is immutable for tasks and ideas.
13. Normal content updates use a server-generated `updatedAt`.
14. Completion and reopening enforce correct `completedAt` behavior.
15. Playback-only updates change only `lastWatchedSeconds` and preserve
    `updatedAt`.
16. YouTube URL changes reset playback to `0` in the same content update.
17. Security Rules require authentication and matching path ownership.
18. Unauthenticated access is denied.
19. Cross-user get, list, create, update, and delete operations are denied.
20. Unknown paths, missing fields, and unexpected fields are denied.
21. Invalid core task and idea shapes are denied.
22. Long unqueried text fields have the approved index exemptions.
23. All focused emulator tests pass.
24. Build, lint, and `git diff --check` pass.
25. No new dependency, secret, billing feature, or live deployment is added.
26. The production planner still uses localStorage for tasks and Quick Ideas.
27. Normal browser use creates no task or idea Firestore documents.
28. Existing Phase 6A authentication and local planner behavior do not regress.
29. Documentation records Phase 6B completion and identifies Phase 6C as the
    next focused sub-phase.

---

## 20. Documentation Updates After Implementation

After implementation and verification succeed:

- Change this specification's status to complete and record verification.
- Update `docs/project-status.md`:
  - Mark Phase 6B complete.
  - State that the secure Firestore foundation and Rules tests are complete.
  - State clearly that production tasks and ideas are still localStorage-backed.
  - Set the next exact step to the focused Phase 6C Task Cloud Sync spec.
- Update `docs/build-plan.md` with a concise Phase 6B completion summary.
- Do not update the README for the unreleased cloud edition; README release
  work belongs to Phase 6D.
- Do not change `AGENTS.md` unless implementation reveals a genuinely missing
  permanent Firebase rule. Avoid duplicating phase status there.

---

## 21. Next-Step Workflow

After this specification is reviewed and approved:

1. Add the approved file to:

   ```text
   docs/phase-6b-secure-firestore-foundation-spec.md
   ```

2. Commit the approved documentation checkpoint separately from implementation.
3. Start a fresh OpenChamber session on `feature/phase-6-firebase`.
4. Run:

   ```text
   /phase-plan docs/phase-6b-secure-firestore-foundation-spec.md
   ```

5. Require a plan-only response with no edits, installs, deployment, commit, or
   push.
6. Review the plan against this specification and the latest GitHub branch.
7. Send one consolidated correction prompt only for real omissions, unsafe
   Rules, unnecessary refactors, or Phase 6C/6D scope leakage.
8. Approve the plan.
9. Implement in the same OpenChamber session so its repository context is
   reused.
10. Run:

    ```text
    /verify-phase docs/phase-6b-secure-firestore-foundation-spec.md
    ```

11. Complete the focused normal-browser regression checks.
12. Review the complete diff and test output.
13. Commit and push only after explicit approval.

---

## 22. Do Not Build Yet

Do not build any Phase 6C or 6D feature while implementing this specification.
In particular, do not:

- Replace `useTasks` or `useIdeas`.
- Read Firestore content inside `Planner`.
- Display cloud tasks or Quick Ideas.
- Upload local tasks or ideas.
- Add starter cloud documents.
- Add task or idea cloud loading states.
- Add offline or reconnecting banners.
- Add pending-write sign-out confirmation for active content writes.
- Add remote deletion UI.
- Change playback checkpoint timing in the active player.
- Deploy Firestore Rules or indexes.
- Create the Phase 6 v2 Vercel project.
- Merge the Firebase branch into `main`.
