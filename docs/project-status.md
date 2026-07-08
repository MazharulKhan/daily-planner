# Daily Planner App — Current Status

## Current Phase

Phase 4E — YouTube Player and Resume Foundation is complete.
Phase 4F — Timestamped Notes is the next candidate.

## Next Exact Step

Wait for approval of a focused Phase 4F spec — Timestamped Notes.
`Convert to Task` for ideas stays deferred until a future phase provides
the appropriate conversion flow.

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

## Active Source-of-Truth Docs

| Doc | Purpose |
|-----|---------|
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
- `youtubeNotes` stays plain text. Timestamps, clickable notes, and rich-text are deferred.

### Data Shape

- Task fields: `id`, `title`, `description`, `taskType`, `youtubeUrl`, `youtubeNotes`,
  `lastWatchedSeconds`, `completed`, `completedAt`, `priority`, `category`, `time`, `dueDate`,
  `updatedAt`.
- LocalStorage key: `dp.tasks`, `dp.ideas`. Migrations are idempotent.
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
multi-select/bulk actions, custom category management, timestamp
insertion, clickable timestamp notes, rich-text notes, responsive/mobile
redesign, dark mode, Reading Tasks, notifications, recurring tasks, AI
features, cloud sync, authentication, backend APIs.

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