# Phase 5H — README, Screenshots, and Portfolio Handoff

**Status:** Complete. README replaced with a portfolio README, four
approved screenshots stored under `docs/screenshots/`, and roadmap docs
updated. No app code changes.

## 1. Goal

Complete the Daily Planner local-first MVP with a professional, accurate
GitHub README and four screenshots that demonstrate the primary workflows.

Phase 5H is documentation and portfolio packaging only. It must not change
application behavior or files under `src/`.

## 2. Product Positioning

The README should present Daily Planner as:

> A responsive, local-first productivity application for organizing tasks,
> capturing ideas, and taking timestamped notes while watching YouTube videos.

This is the completed v1 localStorage MVP.

- Author: Mazharul Khan
- Live app: https://daily-planner-olive-zeta.vercel.app
- Data is stored in browser localStorage.
- No account, authentication, backend, or cloud sync is currently required.
- Firebase/cloud sync is planned as a separate Phase 6.
- Do not describe planned Firebase functionality as currently available.

## 3. Approved Screenshots

Store screenshots in `docs/screenshots/`.

1. `dashboard-light.png`
   - Light-mode Dashboard overview
   - Primary README hero image

2. `today-dark.png`
   - Dark-mode Today workspace
   - Demonstrates filtering, task metadata, overdue tasks, and completed tasks

3. `youtube-task-detail-dark.png`
   - Dark-mode YouTube Task Detail workspace
   - Demonstrates embedded playback, resume position, timestamped notes,
     and clickable preview

4. `quick-ideas-dark.png`
   - Dark-mode Quick Ideas workspace
   - Demonstrates idea capture and idea management

The screenshots are approved as supplied. Phase 5H does not require additional
editing, replacement screenshots, or a mobile screenshot.

## 4. README Requirements

Replace the outdated README with a concise portfolio README containing:

1. Project title
2. Short product description
3. Prominent live-demo link
4. Dashboard hero screenshot
5. Key features
6. Additional screenshots
7. Technology stack
8. Local setup instructions
9. Available npm commands
10. Data storage and current limitations
11. Project status and future roadmap
12. Author
13. License, if the existing repository license supports it

## 5. Feature Claims

The README may describe these completed features:

- Dashboard with today, upcoming, Quick Ideas, and daily progress
- Dedicated Today, Upcoming, and Completed workspaces
- Global Add Task modal
- Task editing, completion, deletion, metadata, sorting, and overdue states
- Standard and YouTube task types
- Embedded YouTube playback
- Saved playback position and resume
- Timestamp insertion into plain-text notes
- Clickable timestamp preview with seek-and-play
- Quick Idea capture, title editing, notes, and deletion
- Current workspace persistence after refresh
- Collapsed completed-task groups
- Responsive desktop and mobile layouts
- Persistent light/dark theme preference
- Keyboard and visible-focus accessibility
- Browser localStorage persistence

The README must not claim:

- The visual search field is functional
- Firebase or cloud sync is implemented
- Authentication or user accounts exist
- Data synchronizes between browsers or devices
- Notifications, recurring tasks, AI features, or calendar integration exist
- Rich-text notes are supported

## 6. Expected Files

Create:

- `docs/phase-5h-readme-portfolio-handoff-spec.md`
- `docs/screenshots/dashboard-light.png`
- `docs/screenshots/today-dark.png`
- `docs/screenshots/youtube-task-detail-dark.png`
- `docs/screenshots/quick-ideas-dark.png`

Modify:

- `README.md`
- `docs/project-status.md`
- `docs/build-plan.md`
- `docs/phase-5-ux-backlog.md`
- `docs/history/phase-history.md` only if a concise Phase 5H completion
  entry is appropriate

Do not modify:

- Files under `src/`
- `package.json` or dependencies
- Application configuration
- Vercel configuration
- AGENTS.md

## 7. Documentation Updates

After README completion:

- Mark Phase 5H complete in `docs/project-status.md`.
- Add Phase 5H to the completed-phase checklist.
- Update the next exact step to Phase 6 Firebase planning.
- Mark Phase 5H complete in `docs/build-plan.md`.
- Mark Phase 5H complete in `docs/phase-5-ux-backlog.md`.
- Continue describing Phase 6 as unimplemented and requiring its own
  approved spec.

## 8. Verification

Before declaring Phase 5H complete:

- Confirm all four screenshot paths render on GitHub.
- Confirm the live Vercel link opens successfully.
- Confirm all feature claims match the current application.
- Confirm installation and npm commands match `package.json`.
- Confirm no source files or dependencies changed.
- Run `npm run build`.
- Run `npm run lint`.
- Review `git diff --stat` and the final changed-file list.
- Do not commit or push until explicitly approved.

## 9. Completion Criteria

Phase 5H is complete when:

- The README accurately presents the local-first v1 application.
- The live demo is prominent and functional.
- All four approved screenshots render correctly.
- Setup instructions work.
- Current limitations and Firebase plans are described honestly.
- Project roadmap documents mark Phase 5H complete.
- Build and lint pass.
- Only approved documentation and screenshot files changed.

## 10. Out of Scope

- Application code changes
- UI fixes or redesign
- New screenshots beyond the approved four
- New packages
- Firebase, Firestore, or authentication
- localStorage migration
- Creating a Firebase branch
- Creating a Git tag or GitHub release

The `v1.0-local-mvp` tag and the Phase 6 Firebase feature branch should be
handled separately after Phase 5H is completed and committed.