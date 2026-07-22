# Daily Planner App — Current Status

## Current Phase

Phase 5 is fully complete (5A–5H).

Phase 6 — Firebase Cloud Edition is in progress on the
`feature/phase-6-firebase` branch. The approved master specification is
`docs/phase-6-firebase-cloud-edition-spec.md`. Phase 6 is implemented in
four sub-phases: 6A (Foundation & Auth), 6B (Firestore Data Foundation),
6C (Task Cloud Sync), and 6D (Quick Ideas, Reliability & Release).

**Phase 6A — Firebase Foundation and Google Authentication:** complete.
Delivered the modular Firebase SDK initialized from validated Vite
environment variables, Auth/Firestore emulator configuration on the
`demo-daily-planner` demo project, a deny-all `firestore.rules` fallback
with a passing Rules smoke test, Google popup sign-in, persistent auth
session, an auth-state loading gate, a professional responsive signed-out
screen, and a compact signed-in account area in the Sidebar footer. Tasks
and Quick Ideas remain localStorage-backed; no live Firestore content
document is created.

**Phase 6B — Secure Firestore Data Foundation:** complete.
Delivered the user-scoped Firestore data layer for tasks (`users/{uid}/tasks/{taskId}`)
and Quick Ideas (`users/{uid}/ideas/{ideaId}`), converters isolating Firestore
timestamps/types from UI domain objects, repositories with normalized no-op and subscription
primitives, default-deny owner-only Security Rules with `diff().affectedKeys()` update
classification, single-field index exemptions for unqueried long text fields, and comprehensive
emulator tests (Rules and converters). Production planner tasks and Quick Ideas remain
localStorage-backed; no production UI component imports or invokes the new repositories.

**Verification:** `npm run build`, `npm run lint`, `npm run test:rules`
(complete Rules and converter emulator test suite), and `git diff --check` all pass.

See `docs/phase-6b-secure-firestore-foundation-spec.md` for the Phase 6B
contract.

## Next Exact Step

Phase 6B is complete on `feature/phase-6-firebase`. Prepare the Phase 6C
focused specification (`docs/phase-6c-task-cloud-sync-spec.md`) for replacing
task localStorage persistence with Firestore task cloud sync.

## Completed Phase Checklist

| Phase | Description | Status |
|-------|-------------|--------|
| 1 | Documentation and Setup | Complete |
| 2 | Dashboard Foundation | Complete |
| 3A | Core Task Management Improvements | Complete |
| 3B | Task Organization | Complete |
| 4A | Quick Ideas Management | Complete |
| 4B | Standard Task Detail | Complete |
| 4C | Task List Pages and Navigation | Complete |
| 4D | YouTube Task Foundation | Complete |
| 4E | YouTube Player and Resume Foundation | Complete |
| 4F | Timestamped Notes | Complete |
| 4G | Clickable Timestamp Notes | Complete |
| 5A | Global Task Creation Flow | Complete |
| 5B | Current Workspace Persistence | Complete |
| 5C | Completed Task Display Refinement | Complete |
| 5D | Quick Idea Notes Capture Refinement | Complete |
| 5E | Responsive, Accessibility, and Visual Polish | Complete |
| 5F | Dark Mode Preference | Complete |
| 5G | Mobile Layout Polish | Complete |
| 5H | README, Screenshots, and Portfolio Handoff | Complete |
| 6A | Firebase Foundation and Google Authentication | Complete |
| 6B | Secure Firestore Data Foundation | Complete |

## Active Source-of-Truth Docs

| Doc | Purpose |
|-----|---------|
| `docs/phase-6-firebase-cloud-edition-spec.md` | Phase 6 master spec — approved, in progress |
| `docs/phase-6a-firebase-foundation-auth-spec.md` | Phase 6A completed spec (historical) |
| `docs/phase-5-ux-backlog.md` | Phase 5 UX backlog / planning notes |
| `docs/phase-5a-global-task-creation-spec.md` | Phase 5A completed spec (historical) |
| `docs/phase-5b-current-workspace-persistence-spec.md` | Phase 5B completed spec (historical) |
| `docs/phase-5c-completed-task-display-refinement-spec.md` | Phase 5C completed spec (historical) |
| `docs/phase-5d-quick-idea-notes-capture-refinement-spec.md` | Phase 5D completed spec (historical) |
| `docs/phase-5e-responsive-accessibility-visual-polish-spec.md` | Phase 5E completed spec (historical) |
| `docs/phase-5f-dark-mode-preference-spec.md` | Phase 5F completed spec (historical) |
| `docs/phase-5g-mobile-layout-polish-spec.md` | Phase 5G completed spec (historical) |
| `docs/phase-5h-readme-portfolio-handoff-spec.md` | Phase 5H completed spec (historical) |
| `docs/clickable-timestamp-notes-spec.md` | Phase 4G completed spec (historical) |
| `docs/timestamped-notes-spec.md` | Phase 4F completed spec (historical) |
| `docs/youtube-player-spec.md` | Phase 4E completed spec (historical) |
| `docs/youtube-task-foundation-spec.md` | Phase 4D completed spec (historical) |
| `docs/task-list-pages-spec.md` | Phase 4C completed spec (historical) |
| `docs/build-plan.md` | Phase roadmap and future candidates |

When sources conflict, active approved feature specs take precedence (see
`AGENTS.md` for the full priority order).

## Key Product Decisions

### Task Type vs Category

- **`taskType`** controls the detail workspace. Values: `standard`, `youtube`.
- **`category`** is independent metadata. Values: `Work`, `Learning`, `Personal`, `Health`.
- Category must never choose which detail workspace opens.
- Changing only Category (e.g. Learning → Personal) never changes the workspace.
- Existing tasks migrate to `taskType: 'standard'`, including Learning-category tasks.

### YouTube Workflow

- YouTube IFrame Player API approved for embedding, current-time reads, and seeking.
- No API key, no YouTube Data API, no packages required.
- `lastWatchedSeconds` is background state only — does not bump `updatedAt` or trigger dirty-form.
- `youtubeNotes` stays plain text. Phase 4F adds an Insert Timestamp
  control that inserts a bracketed plain-text token (e.g. `[12:45] `)
  starting on its own line. Phase 4G adds a clickable rendered preview
  below the notes textarea: valid `[M:SS]` and `[H:MM:SS]` tokens render
  as blue pill chips that seek-and-play the embedded player, a
  collapsible preview with 240px max-height internal scroll, and
  Markdown-style bullet continuation (Enter on `- note` / `-note`
  continues the list; Enter on empty `-` ends it). Rich-text editing
  and a formatting toolbar remain deferred.

### Data Shape

- Task fields: `id`, `title`, `description`, `taskType`, `youtubeUrl`, `youtubeNotes`,
  `lastWatchedSeconds`, `completed`, `completedAt`, `priority`, `category`, `time`, `dueDate`,
  `updatedAt`.
- LocalStorage key: `dp.tasks`, `dp.ideas`, `dp.activeView`, `dp.theme`. Migrations are idempotent.
- Frontend-only. No backend, auth, Firebase, cloud sync, or routing library.

### Navigation

- Sidebar: Dashboard, Today, Upcoming, Completed, Quick Ideas.
- No Learning, Reading, Categories, or YouTube sidebar destinations.
- React state only; no React Router.

## Deployment

- Vercel project connected to `https://github.com/MazharulKhan/daily-planner.git`
- Live URL: https://daily-planner-olive-zeta.vercel.app
- Browser `localStorage` only; no shared backend or cloud sync.

## How to Run

```powershell
npm run dev
```

Open the Vite localhost URL in a normal browser (usually `http://localhost:5173/`).

## Known Issues / Deferred

**Intentionally deferred (not bugs):** global search, saved filters,
multi-select/bulk actions, custom category management, rich-text notes,
broader mobile-first redesign, Reading Tasks, notifications,
recurring tasks, AI features, backend APIs,
cloud sync beyond the Phase 6 Firebase scope.

**Known issues:**

- OpenChamber built-in browser preview is unreliable; visual testing must
  use a normal browser.
- The Phase 6 Firestore Rules smoke test (`npm run test:rules`) requires
  Java JDK 11+ (the Firestore emulator depends on Java). On machines
  without Java, install a JDK or run the smoke test in an environment
  that has one. Auth-only emulator use (`npm run emulators`) does not
  require Java.

## Current Constraints

- React + JavaScript + Vite + regular CSS only. No TypeScript.
- No Tailwind, styled-components, CSS modules, UI kits, or CSS frameworks.
- v1 tagged edition: `localStorage` only, no Firebase.
- `feature/phase-6-firebase` branch: Firebase Authentication (Google
  only) and Cloud Firestore (`northamerica-northeast2`) under approved
  Phase 6 specs. Both Firebase projects remain on Spark with no billing.
- No React Router or routing libraries.
- No npm packages without explicit approval. Approved Phase 6 packages:
  `firebase`, `firebase-tools`, `@firebase/rules-unit-testing`.
- No API keys or secrets in project files. `.env`/`.env.*` are ignored;
  only `.env.example` is tracked.
- Read saved data on load; fall back to sample data only when nothing saved.
- Write `localStorage` after every user change (content remains
  localStorage-backed through Phase 6A).

## Historical Details

Full session history and implementation details for completed phases are in
`docs/history/phase-history.md`. That file is not required reading for coding
agents; it is an archive reference only.
