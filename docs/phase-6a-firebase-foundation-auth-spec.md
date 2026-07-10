# Phase 6A — Firebase Foundation and Google Authentication Specification

**Status:** Approved for implementation
**Parent specification:** `docs/phase-6-firebase-cloud-edition-spec.md`  
**Branch:** `feature/phase-6-firebase`  
**Baseline commit:** `9fddeb3`  
**Implementation status:** Not started  
**Hard constraint:** Firebase must remain on Spark with no billing account

## 1. Purpose

Phase 6A establishes the Firebase development foundation and adds the
authenticated application shell. It does not move tasks or Quick Ideas to
Firestore.

At the end of this sub-phase:

- Firebase is initialized through validated Vite environment variables.
- Local development uses only the Firebase Auth and Firestore emulators.
- Development and production Firebase projects exist on Spark without billing.
- Google is the only enabled authentication provider.
- Signed-out users see a professional Daily Planner welcome/sign-in screen.
- Signed-in users see the existing planner and a compact account area.
- Authentication persists across refreshes and cleans up safely on sign-out.
- Existing task and idea behavior still uses localStorage unchanged.

This file is the exact Phase 6A product and implementation contract. The parent
specification remains authoritative for the complete Phase 6 architecture.

## 2. Current Repository Facts

The focused plan must account for the following current architecture:

- `src/App.jsx` owns the planner view state, theme state, localStorage task and
  idea hooks, detail workspaces, and modal state.
- `src/components/Sidebar.jsx` owns navigation, Add Task, and the theme control.
- The Sidebar already has a desktop footer and a responsive mobile layout.
- `src/hooks/useLocalStorage.js` currently owns all task and idea mutations.
- `src/data/storage.js` owns `dp.tasks`, `dp.ideas`, and `dp.activeView`.
- `dp.theme` is managed in `src/App.jsx`.
- No Firebase dependency or configuration currently exists.
- Existing package scripts are `dev`, `build`, `lint`, and `preview`.
- The approved `/phase-plan`, `/verify-phase`, and `firebase-safety` workflow
  files are committed on the Phase 6 branch.

Phase 6A should use the smallest architecture change that creates a clean auth
boundary without refactoring working planner components.

## 3. Included Scope

### 3.1 Firebase project preparation

- Create one development Firebase project and one production Firebase project.
- Keep both projects on the Spark plan with no billing account.
- Disable Google Analytics during project creation.
- Do not enable Gemini in Firebase or any optional service.
- Create one Firestore default database in each project.
- Select `northamerica-northeast2` for both databases.
- Register one web app in each project.
- Enable Firebase Authentication with the Google provider only.
- Select the user's own account as the required project support email.
- Confirm `localhost` remains authorized for Authentication where Firebase
  provides it by default.

The project display names and globally unique Firebase project IDs are chosen
manually in the Firebase Console. Real project IDs and configuration values do
not belong in this specification.

### 3.2 Approved packages

Install only:

- Runtime: `firebase`
- Development: `firebase-tools`
- Development: `@firebase/rules-unit-testing`

Use the modular Firebase JavaScript SDK. Do not add FirebaseUI, React Firebase
Hooks, the Admin SDK, a test framework, an auth library, or any unrelated
package.

The package lock must be updated through npm rather than edited manually.

### 3.3 Local emulator foundation

- Configure the Authentication emulator on `127.0.0.1:9099`.
- Configure the Firestore emulator on `127.0.0.1:8080`.
- Configure the Emulator Suite UI on `127.0.0.1:4000`.
- Use one non-production demo project ID with a `demo-` prefix for all local
  emulator commands and client configuration.
- Keep the CLI's default local project pointed at that demo project, not at the
  development or production Firebase project.
- Add repeatable npm scripts for starting the emulators and executing the
  initial Rules test harness.
- Require Node.js compatible with the existing Vite project and Java JDK 11 or
  newer before starting the Firestore emulator.

Local emulator mode must fail safely if a non-demo project ID is supplied. If
emulator mode is enabled, the client must connect both Auth and Firestore to
their local emulators immediately after initialization.

### 3.4 Initial Firestore safety files

Phase 6B owns the application data contract and complete Security Rules.
Phase 6A nevertheless establishes a safe emulator baseline:

- Add `firebase.json` with only Auth, Firestore, and Emulator Suite UI
  configuration.
- Add `.firebaserc` with only the local demo project mapping.
- Add `firestore.rules` with a deny-all fallback. Do not use temporary public or
  test-mode rules.
- Add an empty `firestore.indexes.json` structure for later Phase 6B index
  exemptions.
- Add one focused Rules smoke test proving that the harness runs and an
  unauthenticated Firestore operation is denied.
- Run that smoke test with `firebase emulators:exec` and Node's built-in test
  runner.

No live Firestore document may be created in Phase 6A.

### 3.5 Firebase client initialization

Create a small Firebase boundary under a clearly named `src/firebase/` or
equivalent folder. The plan-only pass determines the exact filenames, but the
boundary must:

- Validate every required environment variable before initializing Firebase.
- Initialize exactly one Firebase App instance.
- Export or provide one Auth instance and one Firestore instance.
- Use the modular imports from `firebase/app`, `firebase/auth`, and
  `firebase/firestore` only.
- Connect to the emulators at most once per page load.
- Keep Firestore on its default memory-only cache.
- Never enable IndexedDB or persistent Firestore caching.
- Contain no task or Quick Idea collection paths, repositories, listeners, or
  writes in Phase 6A.

The implementation must not import Firebase directly throughout UI components.
Authentication operations belong behind the Firebase/auth boundary.

### 3.6 Authentication state and operations

Implement:

- A single `GoogleAuthProvider` without additional OAuth scopes.
- Persistent browser authentication using Firebase's local persistence.
- `signInWithPopup` as the initial Google sign-in method.
- One auth-state observer as the source of truth for the current user.
- Auth initialization/loading state.
- Sign-in pending state.
- Sign-in error state with retry.
- Sign-out pending state.
- Sign-out error feedback.
- Observer cleanup on unmount.

Redirect authentication is not included. If later Preview/mobile testing proves
popup-only authentication unreliable, redirect behavior requires a separate
approved adjustment.

### 3.7 Authenticated application boundary

The planner must have three top-level render states:

1. **Auth initializing:** show a branded full-page loading state; do not render
   planner content.
2. **Signed out:** show the Google-only welcome/sign-in screen.
3. **Signed in:** mount and render the existing planner shell.

The existing planner state should live inside the signed-in boundary so signing
out unmounts task, idea, detail, modal, and workspace state from React memory.
Unmounting must not delete or overwrite `dp.tasks` or `dp.ideas`.

When the user signs back in during Phase 6A, the existing localStorage planner
content may load again. This temporary behavior is intentional until tasks and
ideas are cut over in Phases 6C and 6D. Nothing is uploaded to Firestore.

## 4. Explicit Non-Goals

Phase 6A does not include:

- Task or Quick Idea Firestore repositories.
- Task or Quick Idea Firestore listeners.
- Any Firestore content write from the application.
- Reading, uploading, merging, deleting, or overwriting `dp.tasks` or
  `dp.ideas` for Firebase purposes.
- Firestore converters or the final document contract.
- Owner CRUD Security Rules; those belong to Phase 6B.
- Task cloud sync or cross-device task testing.
- Quick Idea cloud sync.
- Detailed syncing/server-confirmed indicators.
- Durable Firestore offline persistence.
- Email/password, anonymous, phone, guest, or additional OAuth providers.
- Account creation UI separate from Google sign-in.
- Account deletion or profile management.
- Firebase Hosting, Storage, Functions, Extensions, Analytics, App Check, or
  BigQuery.
- Vercel Preview or Production environment configuration.
- Real-provider mobile testing before a safe Preview environment exists.
- React Router, TypeScript, UI frameworks, or unrelated refactors.
- Production Rules deployment, production promotion, merge, or URL changes.

## 5. Environment Configuration Contract

Use only these client-visible variables:

```text
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_APP_ID
VITE_USE_FIREBASE_EMULATORS
```

Requirements:

- Commit `.env.example` with placeholders and brief setup comments only.
- Keep `.env`, `.env.*`, and all real local environment files ignored while
  allowing `.env.example` to remain tracked.
- Never commit real Firebase configuration values merely to share them.
- Treat `VITE_USE_FIREBASE_EMULATORS` as a strict boolean string; reject
  unexpected values.
- Require all four Firebase configuration values in both emulator and live
  configuration modes.
- When emulator mode is `true`, require:
  - Vite development mode;
  - a local browser hostname such as `localhost` or `127.0.0.1`;
  - a `demo-` Firebase project ID.
- When emulator mode is `false`, never connect to emulator ports.
- Missing or invalid configuration must produce a clear development error that
  names the missing/invalid variable without printing sensitive local values.

Recommended local emulator values may be documented as demo placeholders, but
development and production project values remain outside committed files.

## 6. Authentication UI Contract

### 6.1 Signed-out desktop screen

Use a polished two-column layout that matches the existing blue, white, soft
gray, rounded-card, and subtle-shadow visual language.

The top-level signed-out page contains:

- Daily Planner brand mark and name.
- A theme control using the existing `dp.theme` preference.
- A centered content container with balanced whitespace.

The left/value panel contains:

- A short eyebrow such as **PLAN WITH CLARITY**.
- Heading: **Your day, organized everywhere.**
- Supporting text explaining private cross-device task and idea sync.
- Three concise benefits:
  - Private workspace for each Google account.
  - Tasks and ideas available across devices.
  - Existing local planner data remains untouched.
- A decorative, static product preview built with app-style cards. It may show
  a few non-interactive task rows, a Quick Idea card, and a YouTube progress
  item. It must not read real localStorage or Firestore data.

The right/sign-in card contains:

- Heading: **Welcome to Daily Planner**.
- Supporting text: **Sign in to continue to your private workspace.**
- One prominent **Continue with Google** button.
- A brief privacy reassurance explaining that planner data is private to the
  signed-in account.
- Inline, recoverable error feedback and a clear retry action.

Do not add an email input, password input, divider for other providers,
separate sign-up link, guest button, marketing carousel, or illustration
package.

### 6.2 Responsive behavior

- At narrower desktop/tablet widths, reduce the preview density before reducing
  readability.
- At the existing mobile breakpoint, switch to one column.
- On mobile, place the brand/theme row first, the sign-in card next, and the
  shortened value proposition afterward or omit the decorative preview if space
  is constrained.
- The Google button remains full-width and at least 44 pixels high.
- No horizontal scrolling is allowed at 320 pixels wide.
- Both light and dark themes must remain readable.

### 6.3 Auth loading state

- Use the Daily Planner brand and a restrained loading indicator.
- Include accessible status text such as **Loading your planner…**.
- Do not flash the signed-out screen or existing planner while auth state is
  unresolved.
- Avoid an elaborate skeleton system.

### 6.4 Error behavior

Map common failures to actionable user-facing language:

- Popup blocked: ask the user to allow the sign-in popup and retry.
- Popup closed/cancelled: explain that sign-in was cancelled and allow retry.
- Network failure: explain that the service could not be reached and allow
  retry.
- Unauthorized domain or invalid configuration: show a clear setup error during
  development without exposing configuration values.
- Unknown failure: show a concise generic message and retry action.

Errors must use an `aria-live` region. Do not render raw Firebase error objects,
stack traces, provider tokens, or internal configuration.

## 7. Signed-In Account and Sign-Out Contract

### 7.1 Desktop account area

Add a compact account area in the Sidebar footer directly above the existing
theme toggle.

It contains:

- The user's display name, falling back to email.
- The email as secondary text when a distinct display name exists.
- An accessible **Sign out** button.
- No profile image or avatar.

Long names and emails must truncate safely without breaking the Sidebar width.

### 7.2 Mobile account area

- Preserve the existing mobile navigation and Add Task layout.
- Present a compact account row in the mobile Sidebar/header region without
  making navigation overflow.
- The account row and theme control may share the final responsive row.
- Sign out remains keyboard/touch accessible and at least 44 pixels high where
  practical.

### 7.3 Sign-out lifecycle

Normal sign-out behavior:

1. Disable repeated sign-out actions.
2. Run the centralized before-sign-out guard.
3. Call Firebase sign-out.
4. Let the auth-state observer transition the app to signed out.
5. Unmount and clear signed-in React state.
6. Show the signed-out screen.

The before-sign-out guard must support a future `hasPendingWrites` boolean. If
it is `true`, present:

> Changes are still syncing. Sign out anyway?

The actual Firestore listener metadata source is added during content cutover;
Phase 6A uses `false` because the app performs no Firestore content writes. Do
not add fake Firestore writes or temporary UI solely to simulate this state.

If Firebase sign-out fails, keep the authenticated planner mounted and show a
recoverable account-area error. Never clear the screen while Firebase still
reports the user as authenticated.

## 8. localStorage Preservation Contract

Phase 6A must preserve the current content implementation:

- Do not modify the behavior of `useTasks` or `useIdeas`.
- Do not change task or Quick Idea data shapes.
- Do not modify migrations or sample data.
- Do not read local content for the signed-out product preview.
- Do not delete `dp.tasks` or `dp.ideas` on sign-in, account change, or sign-out.
- Continue using `dp.theme` on both authenticated and signed-out screens.
- Continue using `dp.activeView` only inside the signed-in planner.
- No local content is uploaded, merged, or associated with a Firebase UID.

## 9. AGENTS.md Transition

Update `AGENTS.md` narrowly during Phase 6A so it no longer contradicts the
approved Firebase edition.

The revised rules must communicate:

- The tagged/deployed v1 edition remains localStorage-only.
- The Phase 6 branch may use Firebase Authentication and Cloud Firestore only
  under approved Phase 6 specifications.
- Tasks and ideas remain localStorage-backed through Phase 6A.
- No additional backend, Firebase product, auth provider, or npm package is
  approved.
- Existing approval gates for secrets, broad refactors, commits, pushes,
  production actions, and data deletion remain.
- The clean-start/no-migration rule is permanent for Phase 6.

Keep `AGENTS.md` concise. Do not copy the master or focused specification into
it.

## 10. Expected File Boundaries

The `/phase-plan` pass must determine the exact list before implementation.
Expected changes are limited to files in these categories:

### Project and Firebase configuration

- `package.json`
- `package-lock.json`
- `.gitignore`
- `.env.example`
- `firebase.json`
- `.firebaserc`
- `firestore.rules`
- `firestore.indexes.json`
- One initial Rules smoke-test file

### Firebase/auth application boundary

- A Firebase initialization module
- A small auth operations/service module if separate
- One auth-state hook

### UI integration

- `src/App.jsx`
- `src/components/Sidebar.jsx`
- A signed-out/auth screen component
- Auth-specific CSS
- `src/styles/sidebar.css`
- Existing variables/layout styles only if required by the approved design

### Documentation

- `AGENTS.md`
- `docs/project-status.md`
- `docs/build-plan.md`

Do not modify task cards, task pages, Quick Idea components, detail workspaces,
storage/migration files, README, Vercel files, or unrelated CSS unless the
plan-only pass identifies a direct Phase 6A requirement and receives approval.

## 11. Automated Verification

Required commands after implementation:

```text
npm run build
npm run lint
git diff --check
```

Also run the Phase 6A Rules/emulator smoke-test script created in this phase.
It must use `firebase emulators:exec`, the demo project ID, and Node's built-in
test runner.

The smoke test must prove:

- The Firestore emulator starts with the committed deny-all rules.
- The test environment connects to the demo project.
- An unauthenticated read or write is rejected.
- The test process cleans up its Rules test environment.

Do not require live development or production Firebase traffic for automated
verification.

## 12. Manual Console Checklist

For both development and production Firebase projects:

- Project is on Spark.
- No billing account is attached.
- No Google Cloud free trial is activated.
- Google Analytics is disabled.
- Only one web app is registered.
- Only Google Authentication is enabled.
- Firestore default database exists in `northamerica-northeast2`.
- No Functions, Storage, Hosting, Extensions, Analytics, App Check, or other
  products are enabled for Phase 6.
- Configuration values are copied only to the appropriate uncommitted local
  environment or later Vercel environment, never into source files.

Stop immediately if any required setup flow demands Blaze or billing.

## 13. Manual Browser Checklist

### Emulator safety

- Start the Auth and Firestore emulators using the committed npm script.
- Confirm the Emulator Suite UI shows the `demo-` project ID.
- Confirm the browser connects to `127.0.0.1:9099` and `127.0.0.1:8080`.
- Confirm emulator mode does not contact live Firestore or live Firebase Auth
  resources.
- Confirm invalid or non-demo emulator configuration fails clearly.

### Authentication

- App initially shows the branded auth-loading state without planner content.
- Signed-out screen appears after auth resolves with no user.
- Continue with Google opens the Auth emulator's Google provider flow.
- Successful emulator sign-in opens the planner.
- Refresh preserves the emulator auth session.
- Popup cancellation/closure produces recoverable feedback.
- A second sign-in attempt succeeds after an error.
- Sign-out disables repeated clicks and returns to the signed-out screen.
- A sign-out failure leaves the authenticated planner visible.

### Data preservation

- Record existing `dp.tasks` and `dp.ideas` before testing.
- Signed-out screen does not display that local content.
- Signing in mounts the unchanged local planner content during Phase 6A.
- Signing out does not delete or overwrite local tasks or ideas.
- No Firestore task or idea document is created.

### Account UI and responsive design

- Sidebar account area shows display name/email and no avatar.
- Account area appears above the theme toggle on desktop.
- Long account text truncates without widening the Sidebar.
- Signed-out screen works in light and dark themes.
- Signed-out screen is visually correct at desktop, tablet, 760px, 380px, and
  320px widths.
- Mobile layout has no horizontal scrolling or inaccessible controls.
- Keyboard navigation, visible focus, error announcement, and loading status are
  usable.

Real Google-provider testing on physical mobile devices is deferred until a
safe Vercel Preview uses the development Firebase project. The responsive UI is
still tested in Phase 6A.

## 14. Definition of Done

Phase 6A is complete only when:

- The development and production Firebase projects pass the console checklist.
- Both projects remain Spark with no billing account.
- Approved packages are installed and locked; no others were added.
- Demo-project Auth and Firestore emulators start through repeatable scripts.
- Emulator mode is guarded against live project use.
- Deny-all Firestore rules and the initial smoke test pass.
- Firebase configuration validation is clear and does not expose values.
- Google emulator sign-in, auth persistence, retry, and sign-out work.
- Planner content never renders before authentication resolves.
- Signing out unmounts signed-in React state without deleting localStorage data.
- The professional signed-out screen and account area satisfy the responsive
  and accessibility contract.
- Tasks and Quick Ideas still use the existing localStorage hooks unchanged.
- No live Firestore content document was created.
- `AGENTS.md` accurately distinguishes v1 localStorage from approved v2
  Firebase work.
- Build, lint, `git diff --check`, the emulator smoke test, and the manual
  checklist pass.
- Only approved Phase 6A files are changed.
- No production deployment, production Rules deployment, merge, or URL change
  occurred.

## 15. Implementation Workflow

1. Review and approve this focused specification.
2. Add it to the Phase 6 feature branch as:
   `docs/phase-6a-firebase-foundation-auth-spec.md`.
3. Commit and push the specification checkpoint.
4. Run:

   ```text
   /phase-plan docs/phase-6a-firebase-foundation-auth-spec.md
   ```

5. Review the plan against this file, the master specification, and current
   GitHub code.
6. Approve one consolidated plan before any package installation, Firebase
   Console setup, or implementation.
7. Implement Phase 6A in the same OpenChamber session as the approved plan.
8. Run:

   ```text
   /verify-phase docs/phase-6a-firebase-foundation-auth-spec.md
   ```

9. Complete the normal-browser and Console checklists.
10. Inspect the diff and commit one scoped Phase 6A checkpoint only after user
    approval.

## 16. Official References

- [Add Firebase to a JavaScript project](https://firebase.google.com/docs/web/setup)
- [Authenticate with Google on the web](https://firebase.google.com/docs/auth/web/google-signin)
- [Authentication state persistence](https://firebase.google.com/docs/auth/web/auth-state-persistence)
- [Connect to the Authentication emulator](https://firebase.google.com/docs/emulator-suite/connect_auth)
- [Connect to the Firestore emulator](https://firebase.google.com/docs/emulator-suite/connect_firestore)
- [Install and configure the Local Emulator Suite](https://firebase.google.com/docs/emulator-suite/install_and_configure)
- [Firebase pricing plans](https://firebase.google.com/docs/projects/billing/firebase-pricing-plans)
- [Vite environment variables](https://vite.dev/guide/env-and-mode)

