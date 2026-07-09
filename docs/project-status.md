# Daily Planner App — Current Status

## Current Phase

Phase 5E — Responsive, Accessibility, and Visual Polish Pass is complete.
Phase 5F — Dark Mode Preference is complete.
Phase 5G — Mobile Layout Polish is complete.
Phase 5H — README, Screenshots, and Portfolio Handoff is the next
planning-only sub-phase.
See `docs/phase-5-ux-backlog.md` for the UX backlog / planning notes, and
`docs/phase-5a-global-task-creation-spec.md`,
`docs/phase-5b-current-workspace-persistence-spec.md`,
`docs/phase-5c-completed-task-display-refinement-spec.md`,
`docs/phase-5d-quick-idea-notes-capture-refinement-spec.md`,
`docs/phase-5e-responsive-accessibility-visual-polish-spec.md`, and
`docs/phase-5f-dark-mode-preference-spec.md` for completed Phase 5 specs.

Phase 6 — Firebase / Cloud Sync is a future post-Phase-5 planned phase.
It will start fresh with a clean Firestore data model (Option A).
No localStorage-to-Firestore migration is required. No Firebase setup,
packages, auth, or config should be added now.

## Next Exact Step

No active implementation phase. Phase 5F — Dark Mode Preference and
Phase 5G — Mobile Layout Polish are complete. The next candidate is
Phase 5H — README / Screenshots / Portfolio Handoff. It is not
implemented yet and needs its own focused spec and approval before coding.
Rich-text notes / formatting toolbar are deferred future improvements
with no spec or approval. `Convert to Task` for ideas stays deferred
until a future phase provides the appropriate conversion flow.

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

## Active Source-of-Truth Docs

| Doc | Purpose |
|-----|---------|
| `docs/phase-5g-mobile-layout-polish-spec.md` | Phase 5G completed spec (historical) |
| `docs/phase-5f-dark-mode-preference-spec.md` | Phase 5F completed spec (historical) |
| `docs/phase-5e-responsive-accessibility-visual-polish-spec.md` | Phase 5E completed spec (historical) |
| `docs/phase-5d-quick-idea-notes-capture-refinement-spec.md` | Phase 5D completed spec (historical) |
| `docs/phase-5c-completed-task-display-refinement-spec.md` | Phase 5C completed spec (historical) |
| `docs/phase-5b-current-workspace-persistence-spec.md` | Phase 5B completed spec (historical) |
| `docs/phase-5a-global-task-creation-spec.md` | Phase 5A completed spec (historical) |
| `docs/phase-5-ux-backlog.md` | Phase 5 UX backlog / planning notes |
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
recurring tasks, AI features, cloud sync, authentication, backend APIs,
Firebase / cloud sync.

## Current Constraints

- React + JavaScript + Vite + regular CSS only. No TypeScript.
- No Tailwind, styled-components, CSS modules, UI kits, or CSS frameworks.
- `localStorage` only. No backend, Firebase, auth, cloud sync, or external APIs.
- No React Router or routing libraries.
- No npm packages without explicit approval.
- No API keys or secrets in project files.
- Read saved data on load; fall back to sample data only when nothing saved.
- Write `localStorage` after every user change.

## Historical Details

Full session history and implementation details for completed phases are in
`docs/history/phase-history.md`. That file is not required reading for coding
agents; it is an archive reference only.
