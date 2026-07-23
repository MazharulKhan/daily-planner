# Phase 6D — Quick Ideas, Reliability, and Cloud Release Specification

**Status:** PHASE 6D COMPLETE — FIREBASE CLOUD EDITION RELEASED. Final release approval has been granted. v1 localStorage and v2 Firebase Cloud editions are both live and independently preserved.
**Parent specification:** `docs/phase-6-firebase-cloud-edition-spec.md`
**Previous phase:** Phase 6C — Task Cloud Sync, implemented and verified
**Implementation branch:** `feature/phase-6-firebase` (preserved)
**Accepted release branch and SHA:** `main` at `cc7222bf480b4be9703cd19bc9ce0d2c00cbb086`
**Release verification:** v1 remains localStorage-only on `release/v1-local` at https://daily-planner-olive-zeta.vercel.app; v2 Production is https://daily-planner-v2-seven.vercel.app and maps to `daily-planner-mk-prod`. Preview maps only to `daily-planner-mk-dev`. Focused Preview and Production acceptance passed; final release approval is granted.
**Recorded limitation:** two Vercel build-warning indicators for the corrective Production deployment had no visible details in the current dashboard/build-log view; the deployment is Ready and no build or runtime failure was observed.
**Hard constraint:** Firebase must remain on Spark with no billing account

---

## 1. Document Status and Authoritative References

This document is the focused Phase 6D contract for the Daily Planner Firebase
cloud edition.

Once reviewed and explicitly approved, it authorizes an implementation-planning
pass only. It does not by itself authorize application edits, dependency
changes, live Firebase traffic, Rules deployment, Vercel configuration,
production deployment, branch merging, commits, or pushes.

Apply sources in this order:

1. This Phase 6D specification once approved.
2. `docs/project-status.md`.
3. `docs/build-plan.md`.
4. `docs/phase-6-firebase-cloud-edition-spec.md`.
5. `docs/phase-6c-task-cloud-sync-spec.md` for the completed task-cloud
   lifecycle, loading, mutation, playback, sign-out, and error contracts.
6. `docs/phase-6b-secure-firestore-foundation-spec.md` for the approved
   Firestore idea converter, repository, document, index, and Security Rules
   contracts.
7. Completed Quick Ideas specifications, especially:
   - `docs/quick-ideas-management-spec.md`
   - `docs/phase-5d-quick-idea-notes-capture-refinement-spec.md`
8. Completed responsive, accessibility, theme, and mobile specifications for
   preserved presentation behavior.
9. `AGENTS.md` for permanent repository safety and workflow rules.

The signed-out screen redesign is a separate authentication-UI refinement. Its
approved specification and implementation must remain isolated from Phase 6D.
Phase 6D must preserve the completed redesign but must not expand, redesign, or
re-plan it.

---

## 2. Purpose

Phase 6D completes the authenticated Daily Planner cloud edition.

It has three outcomes:

1. Move Quick Ideas completely from browser `localStorage` to each signed-in
   user's private Firestore workspace.
2. complete app-wide cloud reliability, account cleanup, offline/reconnecting,
   retry, and pending-write behavior across both tasks and Quick Ideas;
3. prepare and release a separate v2 cloud deployment while preserving the
   existing v1 localStorage edition and URL.

At completion, tasks and Quick Ideas are private, real-time, per-account cloud
content. The only intentionally device-local planner preferences remain
`dp.theme` and `dp.activeView`.

---

## 3. Required Starting Baseline

Phase 6D planning and implementation must start only after:

- Phase 6C task cloud sync is implemented, verified, documented, committed,
  and pushed.
- The signed-out screen redesign is completed, manually verified, committed,
  and pushed as its own isolated change.
- The working tree is clean, except for explicitly identified local-only plan
  files that the implementation agent must not edit, stage, or delete.
- The exact branch, HEAD commit, commit subject, and working-tree status are
  recorded in the Phase 6D implementation plan.

Expected product baseline:

- Google is the only authentication provider.
- Auth state gates all private planner content.
- Tasks use one UID-scoped Firestore listener and no active `dp.tasks`
  persistence.
- Task create, edit, completion, reopening, deletion, details, YouTube notes,
  timestamp behavior, and playback persistence use the approved task
  repository operations.
- Task loading, listener failure, mutation failure, remote deletion,
  account-switch cleanup, playback throttling, and pending task-write sign-out
  behavior are already implemented by Phase 6C.
- Quick Ideas still use `dp.ideas` and display the temporary browser-storage
  disclosure.
- Phase 6B already provides the approved idea converter, idea repository,
  subscription primitive, Firestore path, Security Rules, and focused tests.
- Firestore uses memory-only caching.
- Emulator safeguards restrict emulator mode to localhost and a demo project.
- `dp.theme` and `dp.activeView` remain device-local preferences.
- Both Firebase projects remain on Spark with no billing account.

Phase 6D must connect and finish the existing architecture. It must not
duplicate the Phase 6B data layer or redesign the completed Phase 6C task
system without a specific proven blocker.

---

## 4. Confirmed Product Decisions

- Phase 6D remains one official sub-phase with three internal checkpoints:
  1. Quick Ideas cloud cutover.
  2. Reliability, security, and regression verification.
  3. Deployment, documentation, and release approval.
- These checkpoints are implementation sequencing, not new phases 6D1, 6D2,
  or 6D3.
- Firestore is the cloud edition's only active content source for both tasks
  and Quick Ideas.
- The cloud edition never reads, inspects, uploads, merges, migrates, deletes,
  overwrites, or falls back to `dp.tasks` or `dp.ideas`.
- Existing v1 browser content is left untouched on the user's device.
- A newly authenticated cloud account starts with no starter tasks and no
  starter Quick Ideas.
- One shared task listener and one shared Quick Idea listener exist per
  signed-in app instance.
- Dashboard and Quick Ideas workspace surfaces consume the same shared idea
  state.
- Firestore document IDs are domain IDs. An `id` field is not stored in idea
  documents.
- Firestore timestamps stay inside the converter/repository boundary. React
  receives ISO timestamp strings.
- Existing Quick Ideas create, expand, title-edit, notes-edit, explicit
  Save notes, Discard changes, delete-confirmation, sorting, focus, keyboard,
  responsive, light/dark, and accessibility behavior is preserved.
- Sorting remains client-side. Do not add a second listener or query for the
  Dashboard preview.
- Unsaved Quick Idea drafts are local UI state and are never overwritten by a
  remote snapshot.
- Same-field concurrent edits use last-write-wins. No conflict dialog,
  version history, or merge interface is added.
- Theme and current normal workspace remain local preferences:
  - `dp.theme`
  - `dp.activeView`
- Firestore remains memory-only. Do not enable IndexedDB persistence or add a
  custom offline queue.
- The signed-out screen redesign is preserved unchanged and remains outside
  Phase 6D scope.
- The v1 localStorage deployment and URL must remain available after the v2
  cloud release.
- All production Firebase, Vercel, Rules, index, domain, merge, promotion, and
  release actions require explicit approval at the relevant gate.
- If a required action demands billing, stop and report the blocker rather
  than enabling billing.

---

## 5. Phase 6D Scope and Internal Checkpoints

### Checkpoint 1 — Quick Ideas Cloud Cutover

Included:

- Replace active `dp.ideas` persistence with one UID-scoped Firestore idea
  listener.
- Use the completed Phase 6B idea converter and repository.
- Connect:
  - Dashboard Quick Idea capture.
  - Quick Ideas workspace capture.
  - title edit.
  - notes save.
  - notes discard as a local-only revert.
  - delete with confirmation.
- Add initial loading, confirmed empty, listener failure, retry, mutation
  pending, and mutation failure behavior for Quick Ideas.
- Protect unsaved title and notes drafts from remote snapshots.
- Handle remote idea deletion safely.
- Aggregate idea pending writes into the existing sign-out protection.
- Remove the temporary “stored on this browser” Quick Ideas disclosure after
  the cloud cutover is verified.
- Prove same-user synchronization and cross-user isolation.

### Checkpoint 2 — Reliability, Security, and Regression Verification

Included:

- Unify app-wide offline/reconnecting presentation for tasks and Quick Ideas.
- Preserve the more specific task behavior delivered in Phase 6C.
- Add or complete Quick Idea listener retry behavior.
- Verify current-tab offline writes and reconnect synchronization.
- Verify offline refresh shows cloud-unavailable states and never local/sample
  content.
- Verify listener cleanup and user-state clearing on sign-out and UID change.
- Verify pending task and idea writes use one accessible sign-out confirmation.
- Re-run and review Firestore Rules, converter, repository, isolation, and
  unknown-path coverage.
- Review dependencies, environment handling, committed files, ignored files,
  secrets, and billing status.
- Complete desktop, mobile, light, dark, keyboard, focus, and screen-reader
  regression checks.

### Checkpoint 3 — Deployment, Documentation, and Release Approval

Included:

- Prepare a separate Vercel project and permanent v2 cloud URL.
- Keep the existing v1 localStorage URL permanently available.
- Configure development Firebase values for Vercel Preview.
- Configure production Firebase values for Vercel Production.
- Add approved Vercel domains to the matching Firebase Authentication
  authorized-domain lists.
- Deploy the approved Firestore Rules and indexes to the correct development
  and production projects only after explicit approval.
- Verify real Google popup authentication outside the emulator.
- Verify production account isolation, task sync, idea sync, sign-out cleanup,
  offline/reconnect behavior, and responsive layouts.
- Update:
  - `README.md`
  - `docs/project-status.md`
  - `docs/build-plan.md`
  - the Phase 6D specification status after verification
  - the final draft pull request or release handoff
- Record exact v1 and v2 URLs.
- Record the final release commit and deployment environment mapping.

---

## 6. Explicit Exclusions

Phase 6D does not include:

- Any migration, import, upload, merge, or deletion of existing `dp.tasks` or
  `dp.ideas`.
- Deleting browser localStorage keys merely because the cloud edition no
  longer uses them.
- Starter/sample/seeded cloud tasks or Quick Ideas.
- A Firestore `users/{uid}` profile document.
- Duplicated `ownerId`, email, display name, or profile data in task or idea
  documents.
- Email/password authentication.
- Anonymous or guest authentication.
- Additional OAuth providers or Google scopes.
- Changes to Google popup behavior unless real-device verification proves a
  blocker and a separate decision approves a change.
- A profile page, account settings page, avatars, collaboration, sharing, or
  multi-user workspaces.
- Durable Firestore/IndexedDB persistence.
- A custom offline queue.
- Per-item “Syncing” or “Synced” badges.
- A manual force-sync button.
- Conflict history, version history, merge UI, or conflict dialogs.
- Automatic aggressive mutation retries.
- Background sync after the browser tab is closed.
- Push notifications, email notifications, recurring tasks, calendar sync,
  AI features, analytics, App Check, Cloud Functions, Storage, Hosting, or
  any new Firebase product.
- New npm packages unless a separately approved blocker proves one is
  necessary.
- Task or idea data-shape changes.
- New localStorage keys.
- React Router or URL routing.
- Redesigning signed-in planner screens.
- Further signed-out screen redesign work.
- Replacing the v1 deployment with v2 or allowing the v1 URL to silently
  become the cloud edition.
- Live deployment, project configuration, Rules deployment, branch merge,
  commit, or push without explicit approval.

---

## 7. Quick Idea Firestore Contract

Retain the approved Phase 6B idea document shape:

```text
text, notes, createdAt, updatedAt
```

Domain objects exposed to React contain:

```text
id, text, notes, createdAt, updatedAt
```

Rules:

- `id` comes from the Firestore document ID and is never stored in the
  document.
- `text` is a non-empty trimmed string.
- `notes` is a string and may be empty.
- `createdAt` is a required immutable server timestamp.
- `updatedAt` is a required server timestamp.
- Create uses server timestamps.
- A real text or notes change updates `updatedAt`.
- Normalized no-op writes are skipped.
- Updating only `updatedAt` is invalid.
- Unknown fields are rejected.
- Security Rules remain owner-only and default-deny.
- The path remains:

```text
users/{uid}/ideas/{ideaId}
```

Phase 6D must not broaden the allowed idea shape or weaken the completed Rules
contract.

---

## 8. Cloud Cutover and localStorage Boundary

After the Phase 6D cutover:

- Cloud Quick Idea code must not call local idea hooks or storage helpers.
- The active signed-in Planner import graph must not read `dp.ideas`.
- Cloud idea code must not inspect whether `dp.ideas` exists.
- Cloud idea code must not offer import, merge, or fallback behavior.
- Cloud idea code must not delete or rewrite `dp.ideas`.
- Existing local Quick Ideas remain available only through the preserved v1
  localStorage edition.
- A cloud account with no Firestore idea documents shows the normal confirmed
  empty state.
- A cloud-unavailable state must never reveal starter ideas or browser-local
  ideas.
- `dp.theme` and `dp.activeView` continue to be read and written normally.
- No new preference key is introduced.

The Phase 6D implementation may leave legacy localStorage modules in the
repository when they are still required by the preserved v1 code history or
tests. The active cloud-edition idea path must not import or execute them.

---

## 9. Listener Ownership and Shared State

- `Planner` or one focused Planner-level hook owns exactly one idea
  subscription for the current Firebase UID.
- The listener is attached only after authentication resolves to a non-null
  user.
- The same shared idea array supplies:
  - Dashboard Quick Ideas card.
  - Quick Ideas workspace.
  - idea counts.
  - newest-three Dashboard preview.
- Filtering and newest-first sorting remain client-side.
- No component creates its own Firestore listener.
- No listener is created per expanded idea.
- React development `StrictMode` setup/cleanup cycles must not leave duplicate
  active listeners.
- Listener cleanup runs before:
  - sign-out.
  - UID/account change.
  - Planner unmount.
  - listener retry/replacement.
- Previous-user idea data, drafts, pending state, errors, and selected/expanded
  idea state are cleared before the next user's content loading begins.
- Previous-user content must never flash for the next account.

---

## 10. Quick Ideas Loading, Empty, and Listener-Failure States

### Initial loading

Until the first trustworthy idea snapshot:

- Keep the signed-in Planner shell visible.
- Keep already-ready task surfaces usable.
- Quick Ideas card and workspace display a focused loading state.
- Quick Idea create, edit, notes-save, and delete controls are disabled.
- Do not show the normal empty state yet.
- Do not show starter or browser-local ideas.
- Restoring `quick-ideas` through `dp.activeView` keeps the user on that
  workspace and shows its loading state.

A cache-only empty snapshot is not enough to confirm a cloud account is empty
when the app cannot establish its expected server state.

### Confirmed empty

After a trustworthy empty snapshot:

- Show the existing Quick Ideas empty-state language and capture action.
- Do not create starter ideas.
- Dashboard count is `0`.
- Dashboard preview shows the normal empty presentation.

### Later listener failure

If ideas were previously loaded and the listener later fails:

- Retain the last known committed idea list.
- Show a visible degraded/reconnecting or listener-error message.
- Do not replace known ideas with an empty state.
- Offer Retry where a retry can reattach the listener safely.
- Do not aggressively loop retries.

### Initial listener failure

If no idea snapshot has loaded:

- Show a clear cloud-unavailable state in Quick Ideas surfaces.
- Provide Retry.
- Keep Sign out available.
- Keep unrelated loaded task content usable where safe.
- Never fall back to `dp.ideas` or sample data.

---

## 11. Quick Idea Create Behavior

Creation must preserve both existing entry points:

- Dashboard Quick Ideas capture.
- Quick Ideas workspace capture.

Rules:

- Trim the main idea text.
- Whitespace-only text does not create an idea.
- Enter/newline behavior remains as defined by the existing UI.
- Use the dedicated Phase 6B idea create repository operation.
- Firestore creates the document ID.
- Disable the submitting surface while its create attempt is pending.
- Prevent duplicate submission from repeated clicks or key activation.
- A successful local/remote snapshot places the idea in the shared newest-first
  list and clears the matching capture draft.
- A rejected create remains visibly failed and must not be presented as saved.
- Preserve the user's entered text after a failed create so it can be retried.
- Concurrent creation from another same-user session appears automatically.
- New accounts receive no starter idea.

---

## 12. Expanded Idea and Draft Protection

The existing expanded Quick Idea behavior remains:

- one expanded idea at a time;
- main text read-only by default;
- direct notes textarea;
- explicit Save notes;
- Discard changes;
- separate Edit idea action;
- delete confirmation;
- dirty-note protection against collapse, switching, edit, and delete.

Remote snapshots must not overwrite active local drafts.

### Notes draft

- Local notes draft initializes from the current committed idea.
- While dirty, remote snapshots may update shared committed state but must not
  replace the textarea draft.
- Save notes patches only `notes`.
- Discard changes restores the latest committed remote `notes` value available
  at discard time, not an obsolete value captured when the row first opened.
- A save with no normalized notes change performs no write.
- Successful save returns the draft to clean state.
- Failed save keeps the draft and shows a recoverable error.

### Title draft

- Edit idea mode patches only `text`.
- Empty trimmed text blocks save.
- Remote snapshots must not replace an active title draft.
- Cancelling restores the latest committed remote text.
- Failed save keeps the draft and shows a recoverable error.

### Concurrent edits

- Different-field updates should preserve one another because saves patch only
  the changed field.
- Same-field concurrent saves are last-write-wins.
- No conflict dialog or merge UI is added.

---

## 13. Quick Idea Delete and Remote Deletion

### Local delete

- Delete remains available through the existing confirmation flow.
- Disable duplicate confirmation while deletion is pending.
- Delete uses the dedicated idea repository operation.
- A rejected delete keeps the idea visible and reports failure.
- A successful delete removes the idea through shared listener state.
- Do not present false success before the operation has been accepted by the
  existing cloud-state contract.

### Remote deletion

If the currently expanded or edited idea is deleted in another same-user
session:

- Close the expanded/edit/delete state safely.
- Clear its local draft and selection state.
- Return focus to a stable Quick Ideas heading, list, or capture control.
- Announce a clear message such as:
  - `This Quick Idea was deleted in another session.`
- Do not crash.
- Do not recreate the deleted idea automatically.
- Do not preserve an orphan draft as a hidden write.

If a non-open idea is remotely deleted, remove it normally without an
additional blocking dialog.

---

## 14. Mutation Pending, Errors, and False-Success Prevention

Quick Idea mutations require operation-specific pending and failure behavior:

- create idea;
- save notes;
- save title;
- delete idea.

Rules:

- Each action prevents duplicate submissions.
- Pending UI remains accessible and does not rely on color alone.
- Buttons expose disabled/busy behavior where appropriate.
- Operation failures are visible near the affected surface and/or through the
  existing app-level cloud notice pattern.
- A failed operation does not clear the user's draft.
- A late rejection is still reported.
- Do not show a success message for an operation that later rejects.
- Normalized no-op saves do not create pending state or Firestore writes.
- Do not add automatic aggressive retry loops.
- Retry remains user-driven for failed content operations.

---

## 15. Pending Writes and Sign-Out

Phase 6D extends the completed Phase 6C pending-write protection to cover both
tasks and Quick Ideas.

When either task or idea writes are pending, Sign out must show one accessible
confirmation:

```text
Changes are still syncing. Sign out anyway?
```

Actions:

- `Keep syncing`
- `Sign out anyway`

Rules:

- `Keep syncing` cancels sign-out and returns focus to Sign out or a stable
  account control.
- `Sign out anyway` proceeds only after explicit confirmation.
- Do not create separate task and idea sign-out dialogs.
- Pending-write state is aggregated for the current UID.
- New writes that start after the confirmation snapshot do not silently change
  the meaning of an already-confirmed action; implementation planning must use
  the safest existing auth/sign-out seam.
- Sign-out cleanup unsubscribes both listeners and clears all user-scoped
  content, pending, error, draft, selection, and retry state.
- User A content must never flash for User B.

---

## 16. App-Wide Offline and Reconnecting Behavior

Phase 6D adds one global, non-blocking cloud-status region for meaningful
connection degradation.

Approved states:

### Offline

Suggested message:

```text
You're offline. Changes made in this tab will sync when the connection returns.
```

### Reconnecting

Suggested message:

```text
Reconnecting to your cloud workspace…
```

### Cloud issue

Suggested message:

```text
Some cloud data is unavailable. Retry the affected section.
```

Rules:

- The global region is visible across normal signed-in workspaces.
- It must not cover primary controls or cause disruptive layout shifts.
- It must work in light/dark themes and desktop/mobile layouts.
- It uses appropriate live-region semantics without repeatedly announcing
  noisy snapshot metadata changes.
- It does not display a permanent “Synced” success banner.
- It does not replace focused task or idea mutation errors.
- It does not make every item show a sync badge.
- Browser connectivity alone is not treated as proof that both listeners are
  healthy; combine the existing task state and new idea state carefully.
- A failure in one content stream must not unnecessarily erase or block the
  other stream's known data.
- Retry reattaches only the affected failed listener unless a broader auth
  reset is genuinely required.
- Do not create uncontrolled retry loops.

---

## 17. Memory-Only Offline Contract

Firestore remains configured with memory-only caching.

### Current-tab offline after data has loaded

- Previously loaded task and idea content remains visible.
- Supported edits may appear through Firestore's current-tab local behavior
  and remain pending until reconnection.
- Pending operations must not be falsely reported as remotely committed.
- When connectivity returns, current-tab pending writes synchronize.
- Same-user second-session state updates after synchronization.
- Pending writes continue to participate in sign-out protection.

### Offline refresh or new offline tab

Because there is no durable local Firestore cache:

- The app cannot reconstruct private cloud content.
- Auth may restore, but task and idea surfaces show cloud-unavailable/loading
  failure states.
- The app must not show `dp.tasks`, `dp.ideas`, sample data, or stale content
  from a previous user.
- Retry becomes useful when connectivity returns.
- Theme and current normal workspace may still restore from their approved
  local preference keys.

### Explicit non-goals

- No service worker background queue.
- No IndexedDB persistence.
- No guaranteed sync after the tab is closed.
- No custom offline-first data model.
- No conflict resolution interface.

---

## 18. Security Rules and Data-Layer Preservation

Phase 6D must preserve the Phase 6B rules and repositories unless a focused
test proves a defect.

Required verification:

- Authenticated owner can validly:
  - create an idea;
  - list/read ideas;
  - update text;
  - update notes;
  - delete an idea.
- Unauthenticated access is denied.
- Cross-user get, list, create, update, and delete are denied.
- Unknown paths are denied.
- Unexpected fields are denied.
- Invalid core shapes are denied.
- `createdAt` cannot change.
- Content updates require a real content change and server `updatedAt`.
- Updating only `updatedAt` is denied.
- Firestore document IDs remain outside document data.
- Long unqueried text fields retain approved index exemptions.
- Task Rules and playback-only `updatedAt` behavior remain intact.

Do not weaken Rules to make a UI bug pass. Fix caller behavior instead unless
the approved contract itself is proven incorrect and separately reviewed.

---

## 19. Release Architecture and v1 Preservation

The release must produce two independently usable editions:

### v1 — LocalStorage edition

- Existing local planner behavior.
- Existing v1 permanent URL remains available.
- Existing browser-local tasks and ideas remain intact.
- No sign-in or Firebase content dependency is introduced into the preserved
  v1 deployment.

### v2 — Firebase cloud edition

- Separate Vercel project.
- Separate permanent cloud URL.
- Google sign-in.
- Per-account Firestore tasks and Quick Ideas.
- Development Firebase for Preview deployments.
- Production Firebase for Production deployments.

Hard release rule:

- The existing v1 Vercel project must not silently redeploy cloud-edition code.
- The implementation/release plan must inspect the current Git/Vercel branch
  wiring and choose a safe permanent strategy before any merge or production
  promotion.
- The exact branch arrangement is a release-plan decision, but it must leave
  both URLs stable and independently deployable.
- Any branch creation, production-branch change, project reassignment, merge,
  or URL promotion requires explicit approval.

---

## 20. Environment Mapping

Use two Firebase projects:

### Local development

- Auth emulator.
- Firestore emulator.
- Approved demo project ID.
- Must not contact live Firebase while emulator mode is enabled.

### Vercel Preview

- Development Firebase project.
- Development Firebase web app values.
- Real Google authentication.
- Development Firestore data only.
- Preview domains added to the development project's authorized domains.

### Vercel Production

- Production Firebase project.
- Production Firebase web app values.
- Real Google authentication.
- Production Firestore data only.
- Production domain added to the production project's authorized domains.

Rules:

- Environment values are configured through approved local/Vercel environment
  mechanisms.
- Real `.env.local` values and credentials are never committed.
- `.env.example` contains names/placeholders only.
- Preview must never use the production Firebase project.
- Production must never use emulator values or the development Firebase
  project.
- Before release, verify project IDs visibly in the app/runtime diagnostics or
  approved deployment inspection without exposing secrets to end users.
- Both Firebase projects remain Spark/no billing.

---

## 21. Production Rules and Index Deployment Gates

Local emulator verification comes first.

Required order:

1. Run complete emulator tests.
2. Review `firestore.rules` and `firestore.indexes.json`.
3. Confirm Firebase CLI target/project mapping.
4. Confirm both Firebase projects are Spark and have no billing account.
5. Request explicit approval for development Rules/index deployment.
6. Deploy to development only.
7. Verify Preview against development Firebase.
8. Request explicit approval for production Rules/index deployment.
9. Deploy to production only.
10. Verify production before announcing release.

Do not:

- deploy to both projects in one ambiguous command;
- rely on the currently selected Firebase CLI project without checking it;
- weaken Rules for convenience;
- enable billing;
- enable additional Firebase products;
- deploy production configuration during the implementation coding pass.

---

## 22. README and Documentation Requirements

Update `README.md` only after implementation and release verification.

README must explain:

- What Daily Planner is.
- v1 localStorage edition and URL.
- v2 Firebase cloud edition and URL.
- Main features:
  - Dashboard.
  - Today, Upcoming, Completed.
  - Quick Ideas.
  - Standard and YouTube tasks.
  - YouTube player, resume, timestamp insertion, clickable notes.
  - dark mode and responsive/mobile behavior.
  - Google authentication and per-account cloud sync in v2.
- v1 versus v2 data behavior.
- Local development setup.
- Required environment variable names without real values.
- Emulator commands.
- Why local emulator accounts can be fake.
- Real deployment uses real Google accounts.
- Firebase project/environment mapping.
- Firestore paths at a high level.
- Security and owner-isolation approach.
- Memory-only offline limitation.
- Spark/no-billing architecture.
- Deferred features and known limitations.
- Build, lint, and Rules test commands.

Also update after verification:

- `docs/project-status.md`
- `docs/build-plan.md`
- this Phase 6D spec status
- final draft PR/release handoff

Do not duplicate a long phase history into `AGENTS.md`.

---

## 23. Automated Verification

At minimum run:

```powershell
npm run build
npm run lint
npm run test:rules
git diff --check
```

Required automated coverage includes:

- Existing Phase 6B Rules and converter tests.
- Existing Phase 6C task-cloud tests.
- Quick Idea converter and normalization tests.
- Idea owner/cross-user Rules tests.
- Focused idea cloud helper/repository tests where practical with existing
  tools.
- Listener cleanup and state-reducer/helper tests where they can be tested
  without adding a frontend framework.
- No new test dependency unless separately approved.

Review:

```powershell
git status --short --untracked-files=all
git diff --stat
git diff
git diff --cached
```

Confirm:

- no secret or real environment file is tracked;
- no unexpected binary or generated file is committed;
- dependency changes are absent unless explicitly approved;
- active cloud code does not import task or idea localStorage persistence;
- signed-out redesign files are not unintentionally changed;
- v1 preservation/release files match the approved release plan.

---

## 24. Manual Emulator and Browser Verification

Use a normal browser. Do not rely on an embedded coding-agent preview.

### Quick Ideas core behavior

- Create from Dashboard.
- Create from Quick Ideas workspace.
- Confirm newest-first ordering and Dashboard newest-three preview.
- Expand/collapse.
- Edit title and cancel.
- Save notes.
- Discard notes.
- Delete and cancel delete.
- Confirm focus and keyboard behavior.
- Confirm responsive and dark/light presentation.

### Same-user synchronization

Use two browser sessions signed into the same emulator identity:

- create in session A and see it in B;
- edit title in A and see it in B;
- save notes in B and see it in A;
- delete in A and see it disappear in B;
- keep an unsaved notes draft open while a remote different-field update
  arrives;
- verify the draft is not overwritten;
- verify same-field last-write-wins behavior without a conflict dialog.

### Remote deletion

- Open an idea in A.
- Delete it in B.
- Confirm A closes the row safely and announces the remote deletion.
- Repeat while A has a dirty notes or title draft.
- Confirm no crash or automatic recreation.

### Account isolation and cleanup

- Create distinct tasks and ideas as User A.
- Sign out and sign in as User B.
- Confirm no User A content flashes.
- Confirm User B starts empty when appropriate.
- Attempt cross-user operations through Rules tests.
- Switch back to User A and confirm their cloud content returns.

### Offline and reconnect

After initial data loads:

- disconnect network/emulators;
- create or edit task and idea content;
- confirm pending/offline presentation;
- reconnect;
- confirm current-tab writes synchronize;
- confirm another same-user session receives updates;
- verify pending-write sign-out confirmation.

Offline refresh:

- refresh while offline;
- confirm task and idea cloud-unavailable states;
- confirm no sample, `dp.tasks`, or `dp.ideas` content appears;
- restore connection and use Retry.

### Regression

Verify:

- Dashboard.
- Today.
- Upcoming.
- Completed.
- Quick Ideas.
- global Add Task.
- Standard Task Detail.
- YouTube Task Detail.
- embedded playback.
- resume.
- timestamp insertion.
- clickable timestamp preview.
- completion/reopening.
- task and idea deletion.
- current-workspace persistence.
- light/dark theme.
- desktop, laptop, tablet, and mobile layouts.
- signed-out redesign.
- Google emulator sign-in/sign-out.

---

## 25. Preview and Production Acceptance Verification

### Preview against development Firebase

- Real Google account sign-in works.
- Refresh preserves session.
- Task and idea sync works across two sessions.
- Two Google accounts are isolated.
- Sign-out cleanup works.
- Preview uses the development Firebase project.
- Production data is untouched.
- Authorized domain setup is correct.
- Rules deny cross-user access.
- Offline/reconnect behavior matches the approved limitations.
- Mobile popup sign-in is tested on at least one real mobile browser where
  practical.

### Production against production Firebase

After separate approval:

- Production uses the production Firebase project.
- Real Google sign-in works.
- New account starts empty.
- Task and idea create/edit/delete/sync works.
- Account isolation works.
- Sign-out and account switching clear state.
- Rules and indexes are deployed to the intended project.
- No development/emulator project ID is present.
- Both Firebase projects remain Spark/no billing.
- v1 URL still serves the localStorage edition.
- v2 URL serves the cloud edition.
- README links are correct.

---

## 26. Acceptance Criteria

Phase 6D is complete only when:

1. Quick Ideas use Firestore as their only active cloud-edition content
   source.
2. Cloud idea code never reads, inspects, migrates, uploads, merges, deletes,
   or falls back to `dp.ideas`.
3. Existing browser `dp.ideas` data remains untouched.
4. New cloud accounts receive no starter ideas.
5. Exactly one shared idea listener exists per signed-in app instance.
6. Dashboard and Quick Ideas workspace use the same shared idea state.
7. Firestore document IDs are domain IDs and are not stored as fields.
8. Firestore timestamps remain inside converter/repository boundaries.
9. Dashboard and workspace idea creation work without duplicate submissions.
10. Title edit patches only text.
11. Notes save patches only notes.
12. Notes discard performs no write and restores the latest committed value.
13. Delete uses confirmation and reports rejection without false success.
14. Remote snapshots do not overwrite dirty title or notes drafts.
15. Same-field concurrent edits use last-write-wins with no conflict UI.
16. Remote deletion closes affected UI safely and announces the deletion.
17. Initial idea loading differs from confirmed empty.
18. Initial idea failure provides Retry and Sign out without local/sample
    fallback.
19. Later listener failure retains known idea data.
20. Quick Idea mutation failures remain visible and preserve drafts.
21. Pending idea writes participate in the existing sign-out confirmation.
22. Task and idea listeners clean up on sign-out, UID change, retry, and
    unmount.
23. Previous-user tasks and ideas never flash for the next account.
24. One app-wide offline/reconnecting region works across normal workspaces.
25. A failure in one content stream does not erase the other stream's known
    data.
26. Current-tab offline writes synchronize after reconnection.
27. Offline refresh shows cloud-unavailable states and never local/sample
    content.
28. Firestore remains memory-only with no custom offline queue.
29. `dp.theme` and `dp.activeView` remain local and unchanged.
30. The temporary browser-only Quick Ideas disclosure is removed after cutover.
31. Phase 6B task/idea schema, converter, repository, Rules, and index contracts
    remain intact.
32. Unauthenticated and cross-user task/idea operations are denied.
33. No new package, Firebase product, secret, billing account, or unapproved
    data field is added.
34. The signed-out screen redesign and all signed-in workflows pass regression
    testing.
35. Vercel Preview uses development Firebase.
36. Vercel Production uses production Firebase.
37. Authorized domains are configured on the matching Firebase projects.
38. Production Rules/indexes are deployed only after explicit approval.
39. v1 and v2 permanent URLs both remain available and serve the correct
    editions.
40. README documents both editions, setup, auth, emulators, architecture,
    security, offline limitations, and commands.
41. `npm run build` passes.
42. `npm run lint` passes.
43. `npm run test:rules` passes.
44. `git diff --check` passes.
45. Required emulator, desktop/mobile, Preview, and Production verification
    passes and is recorded.
46. Both Firebase projects remain Spark with no billing accounts.
47. The user reviews the final diff and release result.
48. No commit, push, merge, deployment, Rules change, or URL promotion occurs
    without its explicit approval gate.

---

## 27. Likely Implementation Touchpoints

The exact file list is determined by the approved plan-only pass.

Likely production areas:

```text
src/components/Planner.jsx
src/components/QuickIdeasCard.jsx
src/components/QuickIdeasWorkspace.jsx
src/components/WorkspaceIdeaItem.jsx
src/hooks/ or src/firebase/ cloud state integration
src/firebase/firestore/ideaRepository.js
src/firebase/firestore/ideaConverter.js
src/styles/quick-ideas-workspace.css
src/styles/cards.css
src/styles/sidebar.css
shared cloud-status styles/component
package.json                         # only if existing test command must include new tests
```

Likely focused tests:

```text
tests/idea-cloud-sync.test.mjs
tests/firestore-rules.test.mjs
tests/firestore-converters.test.mjs
```

Likely post-verification documentation/release files:

```text
README.md
docs/phase-6d-quick-ideas-reliability-release-spec.md
docs/project-status.md
docs/build-plan.md
Vercel/Firebase configuration handled through approved external settings
```

Files expected to remain unchanged unless a focused test proves a defect:

```text
src/firebase/firebase.js
src/firebase/auth.js
src/hooks/useAuth.js
src/firebase/firestore/taskRepository.js
src/firebase/firestore/taskConverter.js
firestore.rules
firestore.indexes.json
signed-out redesign components/styles/assets
task UI components not needed for app-wide status integration
```

Any proposal to change these files must explain why and must not broaden scope.

---

## 28. Implementation Workflow

After this specification is reviewed and approved:

1. Finish, verify, commit, and push the signed-out screen redesign separately.
2. Confirm the Phase 6 branch is clean.
3. Save the approved specification at:

```text
docs/phase-6d-quick-ideas-reliability-release-spec.md
```

4. Commit and push the approved documentation checkpoint separately.
5. Start a fresh coding-agent session.
6. Run the project-local planning command against this specification.
7. Require a plan-only response:
   - no edits;
   - no package installation;
   - no live Firebase access;
   - no Rules deployment;
   - no Vercel changes;
   - no commit or push.
8. Review exact files, shared state ownership, mutation behavior, listener
   cleanup, combined pending-write behavior, tests, release gates, and v1
   preservation.
9. Approve the plan.
10. Implement Checkpoint 1 and Checkpoint 2 before any live release action.
11. Run emulator and browser verification.
12. Review the complete application diff.
13. Update code/status documentation only after implementation verification.
14. Create a separate release checklist for Checkpoint 3.
15. Perform each development/production Firebase or Vercel action only after
    its explicit approval.
16. Record actual URLs, project mapping, tests, and release result.
17. Commit/push/merge only after separate explicit approval.

---

## 29. Definition of Done

Phase 6D is done only after:

- the focused specification is approved;
- its plan-only implementation plan is approved;
- Quick Ideas are fully cut over to Firestore;
- app-wide reliability behavior is completed;
- all automated and emulator/manual verification passes;
- security, environment, dependency, secret, and billing reviews pass;
- the v1 localStorage edition remains available;
- the v2 cloud edition is deployed separately and verified;
- documentation and draft PR/release handoff are complete;
- the user explicitly approves the final commit, push, merge, and release
  actions.

Phase 6D is complete and the Firebase Cloud Edition is released.
