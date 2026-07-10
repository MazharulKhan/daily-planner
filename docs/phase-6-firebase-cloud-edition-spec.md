# Phase 6 — Firebase Cloud Edition Specification

**Status:** Approved for implementation 
**Baseline:** `main` and tag `v1.0-local-mvp` at commit `33ccca1`  
**Implementation status:** Not started  
**Target:** Separate authenticated cloud edition of Daily Planner  
**Hard constraint:** Firebase must remain incapable of producing charges

## 1. Purpose

Phase 6 converts the completed localStorage MVP into a separate Firebase edition
with Google authentication and private per-user cloud sync.

This master plan uses four focused implementation sub-phases. It keeps the
requirements that protect user data, prevent billing, preserve existing app
behavior, and avoid excessive Firestore usage. Advanced sync polish and
exhaustive hardening are deferred.

No implementation branch should be created until this specification is approved.

## 2. Baseline

The existing app uses React, JavaScript, Vite, regular CSS, and no routing
library. It currently stores:

- Tasks in `dp.tasks`.
- Quick Ideas in `dp.ideas`.
- Current workspace in `dp.activeView`.
- Theme in `dp.theme`.

Standard tasks, YouTube tasks, task-list pages, Quick Ideas, clickable timestamp
notes, dirty-state protection, and five-second local playback checkpoints are
already complete. The tag `v1.0-local-mvp` permanently preserves this edition.

## 3. Approved Scope Decisions

1. **Clean start:** no task or idea migration from localStorage.
2. **Google-only authentication:** no passwords, anonymous users, or guest mode.
3. **Private workspaces:** each user can access only their own Firestore data.
4. **Cloud sync:** tasks and Quick Ideas synchronize across browsers/devices.
5. **Memory-only offline behavior:** no durable Firestore cache after restart.
6. **Separate editions:** v1 localStorage and v2 Firebase remain available.
7. **Local preferences:** `dp.theme` and `dp.activeView` remain device-local.
8. **Vercel hosting:** Firebase Hosting is not used.
9. **Throttled playback writes:** five-second runtime checkpoints do not become
   five-second Firestore writes.
10. **Zero cost:** Firebase projects remain on Spark without billing accounts.
11. **Basic but safe:** core security tests and error states are required;
    advanced synchronization polish is deferred.

## 4. Goals

Phase 6 must deliver:

- Persistent Google sign-in and reliable sign-out.
- One private Firestore workspace per authenticated UID.
- Real-time task and Quick Idea synchronization.
- Default-deny, owner-only Firestore Security Rules.
- Focused emulator tests for authentication, ownership, and core invariants.
- Clear auth-loading, content-loading, empty, offline, and failure states.
- Safe listener cleanup and memory clearing on sign-out/account change.
- A separate cloud deployment without changing the preserved v1 deployment.
- A Firebase configuration that cannot generate charges.

## 5. Non-Goals and Deferred Work

Not included:

- localStorage content migration, deletion, or cloud fallback.
- Email/password, anonymous, phone, or guest authentication.
- Account deletion, linking, sharing, teams, roles, or collaboration.
- Firebase Storage, Functions, Hosting, Extensions, or custom backend code.
- Durable offline access after refresh or restart.
- Conflict history or custom conflict-resolution UI.
- Detailed per-document `Syncing`/`Synced` indicators.
- Advanced retry orchestration for every mutation.
- Exhaustive Rules tests for every length boundary and malformed date/time.
- App Check unless separately approved later.
- New routing, TypeScript, UI frameworks, or unrelated refactors.

## 6. Implementation Sub-Phases

The master specification fixes the overall product and architecture decisions.
Before implementation begins on each sub-phase, create a separate focused
sub-phase specification using the latest committed GitHub repository state.
That focused specification should settle the exact scope, expected behavior,
architectural boundaries, likely files, tests, exclusions, and definition of
done. OpenChamber should then determine the implementation mechanics through a
plan-only pass rather than making new product decisions.

Sub-phases are specified, planned, implemented, tested, and committed one at a
time. Findings from a completed sub-phase may inform the next focused
specification, but must not silently alter this approved master scope.

### Phase 6A — Firebase Foundation and Google Authentication

Set up Firebase and the authenticated app shell without changing task or idea
persistence.

Included:

- Development and production Firebase projects on Spark.
- Toronto Firestore region: `northamerica-northeast2`.
- One registered web app per Firebase project.
- Modular `firebase` runtime package.
- Local Firebase CLI and Rules test tooling.
- Auth and Firestore emulator configuration.
- Validated Vite environment variables and `.env.example`.
- Google popup sign-in, auth-state loading gate, and persistent session.
- Professional signed-out screen using existing Daily Planner design tokens.
- Compact signed-in user area in the Sidebar footer above the theme toggle.
- Pending-write protection before sign-out.
- Listener/content cleanup foundation for sign-out and account changes.

The auth screen has one primary **Continue with Google** action. On desktop it
uses a polished two-column layout: Daily Planner branding, a concise cloud-sync
value proposition, and small product-preview content on the left; a focused
Google sign-in card, brief privacy reassurance, theme control, and recoverable
error state on the right. On mobile it becomes a clear single-column layout.
It does not include email/password fields, separate sign-up, or guest access.
The focused Phase 6A specification must reference the approved login-screen
mockup or record its exact responsive presentation before implementation.

Done when:

- Emulator mode cannot contact live Firebase.
- Missing config causes a clear development error.
- Sign in, refresh-session persistence, popup failure, and sign out work.
- Private planner content stays hidden until authentication resolves.
- User-specific React state is cleared on sign-out.
- Signing out while writes are pending requires explicit confirmation.
- Tasks and ideas still use localStorage in this sub-phase.

### Phase 6B — Secure Firestore Data Foundation

Create the user-scoped data layer and prove isolation before content cutover.

Included:

- Paths: `users/{uid}/tasks/{taskId}` and `users/{uid}/ideas/{ideaId}`.
- Task and Quick Idea converters/repositories.
- Shared subscription ownership in hooks or data services.
- Default-deny, owner-only Firestore Rules.
- Essential field/type/invariant validation.
- Focused Rules tests using the Emulator Suite.
- Index exemptions for long text fields that are never queried.

Done when:

- Authenticated owners can perform valid operations in their own path.
- Unauthenticated and cross-user operations are denied.
- Unknown paths, unexpected fields, and invalid core shapes are denied.
- `createdAt` is immutable.
- All focused Rules tests pass.
- Production UI content still has not moved to Firestore.

### Phase 6C — Task Cloud Sync

Replace task localStorage persistence with per-user Firestore persistence.

Included:

- One shared task listener per signed-in app instance.
- Add, edit, complete, reopen, and delete writes.
- Standard and YouTube task-detail saves.
- Existing YouTube notes and timestamp behavior.
- YouTube URL-change playback reset.
- Throttled playback-position writes.
- Basic loading, empty, offline, listener-error, and write-error behavior.
- Regression testing across all task views and details.

Done when:

- Existing task behavior works against Firestore.
- Same-user changes appear in a second browser session.
- Cross-user task access is impossible.
- Each mutation affects only its intended document.
- New accounts contain no starter tasks.
- Cloud task code never reads or modifies `dp.tasks`.
- Failed writes are visibly reported, not presented as saved.

### Phase 6D — Quick Ideas, Reliability, and Release

Move Quick Ideas, complete basic reliability behavior, and release v2 separately.

Implementation uses three internal checkpoints without creating additional
official sub-phases:

1. Quick Ideas cloud cutover.
2. Reliability, security, and regression verification.
3. Deployment, documentation, and release approval.

Included:

- One shared Quick Idea listener per signed-in app instance.
- Create, title edit, notes save/discard, and delete writes.
- Removal of active localStorage content persistence from the cloud edition.
- Preservation of `dp.theme` and `dp.activeView`.
- Global offline/reconnecting message.
- Basic retry for initial listener failures.
- Current-tab offline write/reconnect testing.
- Final Rules, account-isolation, dependency, and committed-file review.
- Separate Vercel project and permanent cloud URL.
- Development Firebase values for Preview; production values for Production.
- README, project status, build plan, and final draft PR updates.

Done when:

- Quick Ideas synchronize across two same-user sessions.
- New accounts contain no starter ideas.
- Cloud idea code never reads or modifies `dp.ideas`.
- Listeners clean up on sign-out/account change.
- Current-tab offline writes synchronize after reconnecting.
- Offline refresh shows cloud-unavailable rather than sample/local content.
- v1 and v2 URLs both remain available.
- Build, lint, Rules tests, and manual acceptance tests pass.
- Both Firebase projects remain on Spark without billing accounts.

## 7. Client Architecture

```text
React UI
  -> Firebase Authentication
  -> Firestore repositories/hooks
  -> Cloud Firestore client
  -> Firestore Security Rules
```

Requirements:

- UI components consume app-friendly task and idea objects.
- Firestore snapshots/timestamps stay inside converters and data services.
- All views share one task listener and one idea listener.
- Listeners unsubscribe before sign-out, UID change, or unmount.
- Mutations write only the affected document.
- Existing sorting and filtering remain client-side.

## 8. Authentication Contract

- Google is the only provider.
- Any authenticated Google account receives a private workspace.
- No separate Firestore user-profile document is required.
- Use Firebase's persistent browser auth session.
- Resolve auth with an auth-state observer.
- Do not subscribe to Firestore until a non-null user exists.
- On sign-out, unsubscribe and clear user content before showing auth UI.
- If Firestore reports pending writes, show: **Changes are still syncing. Sign
  out anyway?** Continue only after explicit confirmation.
- Use popup sign-in initially.
- Blocked, cancelled, and failed popups show a recoverable error.
- Redirect auth is deferred unless device testing proves popup-only unreliable.

Signed-in account UI appears in the Sidebar footer above the theme toggle. It
shows display name with email as fallback and an accessible Sign out action that
works on desktop and mobile. Do not add a profile image or avatar in Phase 6.

## 9. Firestore Paths and IDs

```text
users/{uid}/tasks/{taskId}
users/{uid}/ideas/{ideaId}
```

- A physical `users/{uid}` parent document is not required.
- Ownership comes from the UID path; do not duplicate `ownerId` in documents.
- Firestore document IDs become the domain object's `id` but are not stored as a
  document field.
- Repository functions create Firestore auto-ID document references before
  `setDoc` when the caller needs the ID immediately.
- React components do not generate persistence IDs or construct Firestore paths.

## 10. Core Data Contract

Firestore converters own all timestamp translation. React domain objects expose
timestamps as ISO strings or `null`; UI components never receive Firestore
`Timestamp` values.

### Tasks

Keep the complete existing shared task shape:

`title`, `description`, `taskType`, `youtubeUrl`, `youtubeNotes`,
`lastWatchedSeconds`, `completed`, `completedAt`, `priority`, `category`, `time`,
`dueDate`, `createdAt`, and `updatedAt`.

Required invariants:

- `taskType` is `standard` or `youtube`.
- Priority/category use existing approved values.
- Standard tasks retain the YouTube fields.
- Task-type changes never silently delete YouTube values.
- YouTube URL changes reset playback to `0` in the same write.
- Completing sets `completedAt` to a server timestamp.
- Reopening sets `completedAt` to `null`.
- Normal content changes refresh `updatedAt`.
- Playback-only writes change only `lastWatchedSeconds`.
- Playback-only writes do not change `updatedAt`.
- `createdAt` is immutable.
- Task creation sets `createdAt` and `updatedAt` with server timestamps.
- Normal content writes set `updatedAt` to the current server timestamp.

### Quick Ideas

Keep `text`, `notes`, `createdAt`, and `updatedAt`.

- Creation sets both timestamps.
- Title or notes edits refresh `updatedAt`.
- Discarding draft notes performs no write.
- `createdAt` is immutable.

### Validation Scope

Rules enforce exact allowed fields, ownership, essential types/enums,
non-negative integer playback position, completion consistency, immutable
`createdAt`, server-timestamp requirements for creation/content updates, and
playback-only update restrictions. A playback-only update must keep both
`createdAt` and `updatedAt` unchanged.

The UI retains reasonable length and format validation. Exhaustive Rules tests
for every exact boundary and malformed date/time value are deferred unless they
are inexpensive during implementation.

## 11. Clean-Start and localStorage Contract

The cloud edition must never read, upload, merge, delete, or overwrite
`dp.tasks` or `dp.ideas`. A newly authenticated account starts empty and never
receives sample content.

The existing browser may continue holding those keys for the preserved v1 app.
The cloud edition continues using only `dp.theme` and `dp.activeView` locally.

## 12. Subscription and Mutation Rules

Subscription timing follows the staged cutover:

1. Phase 6A attaches no Firestore content listeners.
2. Phase 6B builds and tests repositories/subscription helpers without moving
   production UI content.
3. Phase 6C attaches one shared task listener after task cutover.
4. Phase 6D attaches one shared idea listener after Quick Idea cutover.
5. Each listener converts snapshots to domain objects and updates shared React
   state; existing views continue filtering/sorting that shared state.

Do not poll or attach page-specific duplicate listeners. Listener failures must
not silently replace data with an empty array.

Remote snapshots must not overwrite an unsaved local task or Quick Idea draft.
Use patch-style updates where appropriate so unrelated remote fields remain
intact. If an item open in a detail workspace is deleted by another session,
close that workspace safely and show **This item was deleted on another
device.**

Every mutation:

- Uses the authenticated UID path.
- Returns a promise observable by the UI.
- Skips unchanged normalized data.
- Surfaces permission, unavailable, quota, and unknown failures clearly.

Firestore latency-compensated snapshots provide optimistic local updates. After
client validation, a save may close its editor without waiting indefinitely for
server acknowledgement while offline. The global offline state communicates
that confirmation is pending. A rejected write must show an operation-specific
error and must never be announced as saved. Advanced per-document pending
indicators and automatic conflict-recovery UI remain deferred.

## 13. YouTube Playback Persistence

Five-second playback checkpoints remain runtime memory updates.

Write `lastWatchedSeconds` to Firestore:

- At most once every 30 seconds during continued playback.
- On pause.
- When leaving YouTube task detail.
- Best effort when the page becomes hidden or begins unloading.
- As `0` when playback ends.

Skip unchanged seconds. Do not update `updatedAt`. Losing roughly 30 seconds
after a crash or forced close is acceptable.

## 14. Required User-Facing States

| State | Presentation |
|---|---|
| Auth initializing | Full loading state; private content hidden |
| Signed out | Google-only sign-in screen |
| Sign-in failure | Error plus retry |
| Initial cloud load | Planner shell with loading state |
| Empty account | Existing meaningful empty states |
| Connection lost | Non-blocking offline message |
| Reconnecting | Non-blocking reconnecting message |
| Initial listener failure | Persistent error with Retry and Sign out |
| Mutation failure | Visible operation-specific error |
| Pending writes during sign-out | Confirmation before discarding the session |
| Remote deletion of open item | Close detail safely and explain that another device deleted it |
| Signing out | Disable repeats, clean up, then show auth screen |

A detailed global sync-status system and per-document pending indicators are
deferred. A failed mutation must never be reported as successfully saved.

## 15. Security Rules and Focused Tests

Rules are the authorization boundary. Firebase client config and API keys are
not authorization controls.

Rules must deny by default, require authentication, require
`request.auth.uid == uid`, deny unknown paths, reject unexpected fields, enforce
core types/invariants, require server timestamps for creation and normal content
updates, preserve `createdAt`, and correctly distinguish normal content updates
from playback-only updates.

Minimum emulator test matrix:

- Unauthenticated task and idea reads/writes fail.
- User A can perform valid CRUD under User A.
- User A cannot read, list, create, update, or delete under User B.
- Unknown fields and unspecified paths fail.
- Invalid core enum/type values fail.
- Changing `createdAt` fails.
- Create/update operations with invalid timestamp behavior fail.
- Invalid completion state fails.
- Negative/non-integer playback position fails.
- Valid playback-only update succeeds without changing `updatedAt`.
- Playback update combined with another field change fails.

## 16. Packages and Commands

Approved runtime package:

- `firebase`

Approved development packages:

- `firebase-tools`
- `@firebase/rules-unit-testing`

Use Node's built-in test runner unless a concrete blocker is found. Do not add
FirebaseUI, React Firebase Hooks, Admin SDK, Vitest, Jest, another auth library,
or unrelated packages without approval.

Commands must cover build, lint, Auth/Firestore emulators, and Rules tests using
`firebase emulators:exec`.

## 17. Environments and Zero-Cost Enforcement

Environments:

1. **Local:** emulator-only demo project; no live traffic.
2. **Development:** Spark project for Preview/testing.
3. **Production:** separate Spark project for the permanent cloud URL.

Required safeguards:

- Never attach billing or activate a Google Cloud free trial.
- Never upgrade to Blaze.
- Stop setup if any required console flow demands billing.
- Do not enable Firebase Hosting, Storage, Functions, phone auth, Extensions,
  Analytics, BigQuery export, paid backups, or paid Google Cloud products.
- Use only one task and one idea listener per app instance.
- Keep playback writes throttled.
- Review Firebase usage before release.
- Accept quota interruption rather than enable billing.

## 18. Environment Variables

```text
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_APP_ID
VITE_USE_FIREBASE_EMULATORS
```

- Commit `.env.example` with placeholders.
- Ignore real local environment files.
- Validate required values before initialization.
- Connect to emulators only through the explicit local flag.
- Preview uses development values; Production uses production values.
- Never commit service accounts, private keys, OAuth secrets, CLI tokens, or
  refresh tokens.
- Client-visible `VITE_*` Firebase values are configuration, not secrets.

## 19. Deployment Contract

### v1

Preserve `v1.0-local-mvp` and a stable localStorage deployment. Do not connect
its URL to Firebase.

### v2

Use a second Vercel project and permanent URL. Preview uses development Firebase;
Production uses production Firebase. Add all required Vercel domains to Firebase
Authentication's authorized domains.

Production Rules deployment, environment changes, merging, and URL promotion
require explicit approval.

## 20. Manual Acceptance Checklist

### Authentication and isolation

- Desktop/mobile Google sign-in works.
- Refresh preserves the session.
- Popup cancellation/blocking is recoverable.
- Sign-out clears content immediately.
- Pending writes trigger the approved confirmation before sign-out.
- User A and User B remain isolated.

### Tasks

- Create/edit/complete/reopen/delete Standard and YouTube tasks.
- Preserve dirty-state protection, YouTube notes, and clickable timestamps.
- Changing YouTube URL resets playback.
- Playback does not write every five seconds.
- Same-user second session receives updates.
- Remote snapshots do not overwrite an unsaved local draft.
- Remote deletion of the open task closes its detail workspace safely.

### Quick Ideas

- Create, edit title, save/discard notes, and delete.
- Same-user second session receives updates.
- Remote snapshots do not overwrite unsaved notes.
- Remote deletion of the open idea closes its detail workspace safely.

### Clean start and reliability

- Existing v1 local data is neither uploaded nor deleted.
- New cloud account starts empty.
- Loading, empty, offline, and write-failure states behave correctly.
- Current-tab offline write syncs after reconnection.
- Offline refresh shows cloud-unavailable state.

### Regression and release

- Dashboard, Today, Upcoming, Completed, Quick Ideas, task details, Add Task,
  desktop/mobile layouts, and light/dark themes still work.
- Build, lint, and focused Rules tests pass.
- No secrets or unexpected files are committed.
- Development and production projects remain on Spark without billing.

## 21. Documentation

- This file is the Phase 6 source of truth.
- `docs/project-status.md` tracks active sub-phase and next exact step.
- `docs/build-plan.md` records concise sub-phase progress.
- During Phase 6A, update `AGENTS.md` only where permanent Firebase rules
  replace old localStorage-only constraints. It must distinguish the preserved
  v1 localStorage edition from the approved v2 Firebase edition and must keep
  all unrelated stack, package, secret, scope, verification, and Git rules.
- `README.md` is updated in Phase 6D with v1/v2 URLs, setup, authentication,
  limitations, and zero-cost architecture.

## 22. GitHub-Connected, Token-Efficient Implementation Workflow

GitHub is the default planning context for Phase 6. ChatGPT may inspect the
latest committed and pushed repository state directly when preparing focused
sub-phase specifications and reviewing OpenChamber plans. A Repomix bundle is
not required for every sub-phase.

### Project-Local Commands and Safety Skill

Before Phase 6A implementation, create and test:

```text
.opencode/commands/phase-plan.md
.opencode/commands/verify-phase.md
.opencode/skills/firebase-safety/SKILL.md
```

`/phase-plan <focused-spec-path>` uses a plan-only agent. It reads `AGENTS.md`,
`docs/project-status.md`, this master specification, and the supplied focused
specification. It loads `firebase-safety` for Firebase work and reports exact
files, implementation order, data flow, packages/configuration, tests, risks,
manual checks, and exclusions. It must not edit files, install packages,
deploy, commit, or push.

`/verify-phase <focused-spec-path>` runs or coordinates the approved validation
for the implemented sub-phase. At minimum this includes `npm run build`,
`npm run lint`, `git diff --check`, and the relevant emulator/Rules test command
after Phase 6A creates it. It reports pass/fail results and remaining manual
checks. It does not commit, push, deploy, or broaden scope.

`firebase-safety` is the reusable Phase 6 guardrail. It enforces Spark/no
billing, emulator-first local development, the clean-start/no-migration rule,
secret protection, default-deny Rules, allowed Firebase products, and explicit
approval gates for production Rules, production environment changes, merge,
promotion, or URL replacement.

The older `phase-completion`/`phase-complete` idea is not part of the Phase 6
workflow; `/verify-phase` is the completion-verification command.

### Per-Sub-Phase Workflow

1. Confirm the working tree is clean or clearly identify any local-only changes.
2. Create a detailed focused sub-phase specification with ChatGPT using this
   master spec and the latest committed GitHub code. Recommended filenames are:
   `docs/phase-6a-firebase-foundation-auth-spec.md`,
   `docs/phase-6b-secure-firestore-foundation-spec.md`,
   `docs/phase-6c-task-cloud-sync-spec.md`, and
   `docs/phase-6d-ideas-reliability-release-spec.md`.
3. Give that focused specification to OpenChamber and run `/phase-plan` with its
   path. OpenChamber may inspect the repository files needed for the sub-phase,
   but must not implement during this pass.
4. Bring the OpenChamber plan back to ChatGPT for review against the focused
   specification and current GitHub architecture.
5. Send OpenChamber one consolidated correction prompt only when the plan has a
   real omission, unsafe decision, unnecessary refactor, or scope violation.
6. Approve the plan, then implement in the same OpenChamber session so its file
   reads and planning context are reused.
7. Run `/verify-phase` with the focused-spec path, then complete the focused
   manual browser checks in a normal browser.
8. Fix only confirmed failures; do not broaden scope or perform unrelated
   refactors.
9. Inspect the diff and commit one descriptive, scoped checkpoint.
10. Push the branch or provide the exact diff/test output before requesting a
    post-implementation ChatGPT review.
11. Begin a fresh OpenChamber session and create a new focused specification for
    the next sub-phase.

### Focused Sub-Phase Specification Requirements

Each focused specification should be detailed enough that OpenChamber decides
**how** to implement rather than **what** the feature should do. It should define:

- approved behavior and explicit non-goals;
- Firebase paths, data contracts, and lifecycle requirements involved;
- required loading, error, offline, and cleanup behavior for that sub-phase;
- architectural boundaries and likely files or modules;
- Security Rules and automated/manual test expectations;
- commands to run and the exact definition of done.

The resulting OpenChamber plan should name the exact files to create or modify,
implementation order, functions/hooks/services affected, package or config
changes, test cases, risks, and verification commands.

### When Repomix Is Optional but Useful

Use Repomix only when it materially reduces context cost or resolves a visibility
problem, including when:

- important work exists only as uncommitted local changes that GitHub cannot see;
- OpenChamber repeatedly reads too many unrelated files;
- a sub-phase touches many tightly connected files and a fixed context snapshot
  is cheaper than repeated repository exploration;
- another model needs a portable, frozen repository snapshot; or
- a large local implementation diff needs review before it is pushed.

Phase 6C may benefit from a focused Repomix bundle because task persistence
touches shared state, task views, detail workspaces, and YouTube playback. Try an
exact file list and focused specification first; generate Repomix only if that
proves inefficient. Phases 6A, 6B, and most of 6D should not require it.

### GitHub Visibility Limitation

ChatGPT can inspect committed and pushed repository content. It cannot
automatically see uncommitted edits, local environment files, emulator output,
runtime console errors, or files OpenChamber has created but not pushed. Supply
the relevant diff/output or push the working branch before asking for a review
that depends on those changes. Never commit real `.env` values or secrets merely
to make them visible.

Use cheaper models for routine implementation and documentation. Reserve a
stronger model for Security Rules, the task persistence cutover, and difficult
listener or offline bugs.

The coding agent must not independently link billing, upgrade to Blaze, create
paid resources, deploy production Rules, change production environment values,
merge the PR, or replace either production URL.

## 23. Definition of Done

Phase 6 is complete when:

- Google auth works on required desktop/mobile browsers.
- Users have isolated Firestore workspaces.
- Tasks and Quick Ideas synchronize across devices.
- Existing localStorage content is neither migrated nor deleted.
- Core loading, offline, and failure behavior works.
- Unsaved drafts survive unrelated remote snapshots, and remote deletion of an
  open item is handled safely.
- Pending writes are protected before sign-out.
- Default-deny owner Rules and focused tests pass.
- Playback writes are throttled.
- Build, lint, Rules tests, and manual acceptance tests pass.
- Development and production Firebase projects remain Spark/no-billing.
- v1 and v2 deployments both remain available.
- Documentation is current.
- Final merge and release receive explicit approval.

## 24. Deferred Follow-Ups

- Exhaustive validation-boundary Rules tests.
- Detailed syncing/server-confirmed indicators.
- Advanced per-operation recovery flows.
- Trusted-device persistent offline storage.
- App Check evaluation.
- Email/password authentication.
- Account deletion and recursive cleanup.
- Sharing, collaboration, history, search, recurring tasks, notifications,
  calendar integration, and AI features.

## 25. Official References

Use current official documentation during implementation planning:

- [Firebase web setup](https://firebase.google.com/docs/web/setup)
- [Google authentication](https://firebase.google.com/docs/auth/web/google-signin)
- [Firestore locations](https://firebase.google.com/docs/firestore/locations)
- [Firestore offline behavior](https://firebase.google.com/docs/firestore/manage-data/enable-offline)
- [Real-time listeners](https://firebase.google.com/docs/firestore/query-data/listen)
- [Security Rules conditions](https://firebase.google.com/docs/firestore/security/rules-conditions)
- [Security Rules field validation](https://firebase.google.com/docs/firestore/security/rules-fields)
- [Rules unit testing](https://firebase.google.com/docs/rules/unit-tests)
- [Firebase API-key guidance](https://firebase.google.com/docs/projects/api-keys)
- [Firebase pricing plans](https://firebase.google.com/docs/projects/billing/firebase-pricing-plans)
- [Firestore free quotas](https://firebase.google.com/docs/firestore/quotas)
- [Vite environment variables](https://vite.dev/guide/env-and-mode)
- [Vercel environment variables](https://vercel.com/docs/environment-variables)
