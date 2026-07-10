# Daily Planner App — Current Status

## Current Phase

Phase 5 is fully complete (5A–5H).

Phase 6 — Firebase Cloud Edition is the next planned phase. The approved
master specification is `docs/phase-6-firebase-cloud-edition-spec.md`.
Phase 6 will be implemented in four sub-phases: 6A (Foundation & Auth),
6B (Firestore Data Foundation), 6C (Task Cloud Sync), and 6D (Quick
Ideas, Reliability & Release). No implementation has started yet.

## Next Exact Step

1. Review and commit/push this documentation-only checkpoint to `main`.
2. Create `feature/phase-6-firebase` from the updated `main`.
3. Create and test `/phase-plan`, `/verify-phase`, and `firebase-safety`
   per the master spec Section 22.
4. Prepare the focused Phase 6A specification
   (`docs/phase-6a-firebase-foundation-auth-spec.md`).
5. Run a plan-only pass before any Firebase implementation.

No Firebase packages, config, or code changes until the Phase 6A focused
spec is approved and the Phase 6 branch exists.

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

## Active Source-of-Truth Docs

| Doc | Purpose |
|-----|---------|
| `docs/phase-6-firebase-cloud-edition-spec.md` | Phase 6 master spec — approved, not yet implemented |
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

**Known issues:** OpenChamber built-in browser preview is unreliable; visual
testing must use a normal browser.

**Intentionally deferred (not bugs):** global search, saved filters,
multi-select/bulk actions, custom category management, rich-text notes,
broader mobile-first redesign, Reading Tasks, notifications,
recurring tasks, AI features, authentication backend, backend APIs,
cloud sync beyond the Phase 6 Firebase scope.

## Current Constraints

- React + JavaScript + Vite + regular CSS only. No TypeScript.
- No Tailwind, styled-components, CSS modules, UI kits, or CSS frameworks.
- `localStorage` only. No backend, Firebase, auth, cloud sync, or external APIs.
  (Phase 6 will add Firebase; no Firebase packages or config have been added yet.)
- No React Router or routing libraries.
- No npm packages without explicit approval.
  (The `firebase`, `firebase-tools`, and `@firebase/rules-unit-testing`
  packages are pre-approved for Phase 6 per the master spec.)
- No API keys or secrets in project files.
- Read saved data on load; fall back to sample data only when nothing saved.
- Write `localStorage` after every user change.

## Historical Details

Full session history and implementation details for completed phases are in
`docs/history/phase-history.md`. That file is not required reading for coding
agents; it is an archive reference only.
