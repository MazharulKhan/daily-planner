# Daily Planner App — Project Specification

## Project Goal

Build a clean, desktop-first personal planner that combines daily task management, quick idea capture, and future learning-focused workflows in one local application.

The app should feel like a lightweight daily command center: easy to scan, fast to update, and intentionally less complex than a full project-management tool.

## Target User

The initial user is a single person planning daily work, personal tasks, and learning. The first version is local-only and does not need accounts, collaboration, or cloud sync.

## Current Build Scope

The active implementation scope is **Dashboard First**.

The first coding phase must include only:

- A desktop-first dashboard shell
- Persistent left sidebar navigation as visual placeholders
- Today’s task list
- Add-task interaction
- Complete and uncomplete task interaction
- Quick Idea capture
- Daily progress based on completed tasks
- Browser `localStorage` persistence for tasks and ideas
- Regular CSS styling based on the written dashboard specification

## Current Technology

- React
- JavaScript
- Vite
- Regular CSS
- ESLint
- Browser `localStorage`

## Product Direction

The broader product is a desktop-first productivity and learning planner with:

- Compact daily task management
- Today and Upcoming task views
- Quick Ideas kept separate from tasks
- Lightweight categories, priorities, dates, and completion status
- Future Learning Tasks for video-based learning and notes
- Future Reading Tasks for resource links, progress, notes, and takeaways

The visual direction is clean and card-based:

- Light page background with white or soft-gray surfaces
- Blue primary accent for active states and main actions
- Rounded cards with subtle borders
- Compact task rows
- Clear hierarchy through spacing rather than heavy decoration
- Persistent left navigation for a predictable desktop experience

## Current Data Approach

Use `localStorage` only.

For the first dashboard phase, store:

- Tasks
- Task completion state
- Task metadata needed for display, such as priority, category, time, and due date
- Quick Ideas
- Any simple dashboard state that must remain after refresh

Use starter sample data only when there is no saved local data yet.

## Current Dashboard Build Constraints

- Use React, JavaScript, Vite, and regular CSS.
- Keep the app frontend-only.
- Build one phase at a time.
- Do not install packages unless there is a clear, explained, approved need.
- Use written Markdown specs as the main requirements source.
- Treat UI screenshots as visual comparison material, not the sole source of requirements.

## Deferred Features

The following are part of the broader product direction but are not part of the first dashboard build:

- Full Today, Upcoming, Completed, Learning, Reading, Ideas, and Categories pages
- Global search behavior
- Task detail pages
- Full task editing and deletion
- Category management
- Quick Idea editing, deletion, notes, and task conversion
- YouTube embedding, timestamped notes, and resume playback
- Reading progress, resource tracking, and takeaways
- Dark mode
- Firebase
- Authentication
- Backend APIs
- Cloud database or sync
- Calendar integration
- Notifications
- Recurring tasks
- External APIs
- Payments
- AI features in the user-facing app

## Source Material

- Broad product source: `docs/source/daily-planner-mvp-source.md`
- Original reference document: `docs/source/`
- UI screenshots: `docs/ui-reference/`
- Active dashboard requirements: `docs/dashboard-spec.md`
- Implementation order: `docs/build-plan.md`
- Current technical handoff: `docs/project-status.md`
