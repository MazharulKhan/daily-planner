# AGENTS.md

Permanent repo rules for coding agents working on the Daily Planner app.

Phase status and roadmap live in `docs/project-status.md` and `docs/build-plan.md`; do not duplicate them here.

## Stack & Product Invariants

- React + JavaScript (no TypeScript) + Vite + regular CSS only.
- No Tailwind, styled-components, CSS modules, UI kits, or CSS frameworks.
- ESLint. Browser `localStorage` only. Frontend-only.
- Sidebar destinations: Dashboard, Today, Upcoming, Completed, Quick Ideas.
- `taskType` controls workflow: `standard` or `youtube`.
- `category` is metadata only: Work, Learning, Personal, Health. Category must never decide which detail workspace opens.
- Deferred unless an approved spec says otherwise: Reading Tasks, standalone Learning/Reading/Categories pages, global search, dark mode, recurring tasks, notifications, Firebase, backend, auth, cloud sync, AI features.

## Hard Constraints & Approval Gates

Do NOT add without explicit user approval:

- Packages / npm dependencies
- External APIs
  - Phase 4E may approve the YouTube IFrame Player API only.
  - That approval does not approve packages, API keys, backend services, or the YouTube Data API.
- Routing libraries such as React Router
- Firebase, authentication, backend APIs, cloud database/sync
- API keys or secrets in project files
- Data-shape changes, migrations, or data reset decisions
- Broad refactors or rewrites of working components
- Commits or pushes

Until an approved Firebase/backend spec changes this, the app must stay frontend-only and localStorage-only.

## Source-of-Truth Priority

When sources conflict, higher wins:

1. Active approved feature spec for the current phase
2. `docs/project-status.md`
3. `docs/build-plan.md`
4. `docs/project-spec.md`
5. Completed phase specs for affected behavior only
6. `docs/source/` and `docs/ui-reference/` as historical or visual reference only

## Task-Size Reading Rules

- **Small fix:** read `AGENTS.md`, relevant component/style files, and the one spec section governing that behavior. Do not load unrelated docs.
- **Medium/large change:** read `AGENTS.md`, `docs/project-status.md`, `docs/build-plan.md`, the active approved spec, and relevant source files.
- Do not reread files already reviewed this session unless they changed or exact wording is needed.

## Edit Discipline

- Make the smallest safe change that satisfies the approved spec.
- No unrelated refactors. No rewriting working components to "clean them up."
- Preserve completed-phase behavior unless an approved spec explicitly changes it.
- List files before editing.
- Prefer targeted edits over full rewrites.
- Do not skip ahead to deferred features.

## localStorage Migration Safety

- Migrations must be idempotent.
- Preserve existing saved data; never discard tasks/ideas because of a migration.
- Preserve unknown fields unless explicitly approved to remove them.
- Update sample data when the data shape changes.
- Do not rely on a browser refresh to normalize newly created data; normalize on creation.
- For an approved Firebase reset build, preserving existing browser localStorage data is not required if the active Firebase spec explicitly says to start fresh.
- Do not delete or overwrite cloud/Firebase data unless explicitly approved.

## Data Approach

- Use `localStorage` only.
- Read saved data on initial load.
- Fall back to starter sample data only when no saved data exists.
- Write back to `localStorage` after every user change.

## Token-Efficient Context Use

- Prefer `git status` and `git diff --stat` first; inspect full diffs only for changed files.
- Use targeted search and focused reads before opening whole files or the full repo.
- Keep plans and progress updates concise.
- Do not paste large file contents in chat unless necessary.

## Verification

Before declaring a phase complete:

- Run `npm run build` and confirm it succeeds.
- Run `npm run lint` and address any issues.
- Manually test in a normal browser at the Vite localhost URL.
- Do not rely on OpenChamber's built-in preview; it is currently unreliable.
- State plainly when browser testing was not performed.

## Git

- Do not commit or push unless the user explicitly asks.
- Stage only intended files.
- Never commit secrets or API keys.
- Use descriptive commit messages matching existing repo style.

## Response Format

After completing a task, report:

- Summary of what was done
- Files changed, created, or modified
- Verification run and results
- Browser testing status
- Docs updated, if any
- Known issues or follow-ups
- Commit status only if the user requested a commit