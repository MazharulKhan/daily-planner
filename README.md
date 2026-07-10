# Daily Planner

A responsive, local-first productivity application for organizing tasks,
capturing ideas, and taking timestamped notes while watching YouTube videos.

This is the completed **v1 localStorage MVP**. Data lives in your browser
via `localStorage` — no account, authentication, backend, or cloud sync is
required. Firebase / cloud sync is planned as a separate Phase 6.

**Live demo:** https://daily-planner-olive-zeta.vercel.app

![Dashboard in light mode](docs/screenshots/dashboard-light.png)

---

## Key Features

- **Dashboard** — Today's tasks, upcoming tasks, Quick Ideas, and a live
  daily progress ring on one screen.
- **Dedicated workspaces** — Today, Upcoming, Completed, and Quick Ideas
  reachable from the sidebar.
- **Global Add Task modal** — Create a task from any normal workspace with optional
  priority, category, time, and due date.
- **Task management** — Edit, complete, uncomplete, and delete tasks with
  confirmation; automatic sorting by overdue, time, and due date.
- **Overdue and completed states** — Overdue tasks rise to the top with a
  warning; completed groups can be expanded or collapsed where applicable.
- **Standard and YouTube task types** — Standard tasks for general work,
  YouTube tasks for learning from video content.
- **Embedded YouTube playback** — Watch videos inside the app without
  navigating away.
- **Saved playback position and resume** — Continue from where you left
  off after a refresh.
- **Timestamped notes** — Insert plain-text `[M:SS]` tokens into notes
  while watching.
- **Clickable timestamp preview** — Rendered preview chips seek and play
  the embedded player at the marked time.
- **Quick Ideas** — Capture ideas instantly with title editing, notes,
  and deletion.
- **Workspace persistence** — Your last normal workspace is restored
  after refresh.
- **Responsive layout** — Works on desktop and mobile widths.
- **Light and dark theme** — Persistent theme preference.
- **Keyboard accessibility** — Keyboard-accessible controls with visible
  focus indicators.
- **localStorage persistence** — Every change is saved automatically to
  the browser.

### Screenshots

**Today (dark mode)** — Filtering, task metadata, overdue tasks, and
completed task groups.

![Today in dark mode](docs/screenshots/today-dark.png)

**YouTube Task Detail (dark mode)** — Embedded playback, resume position,
timestamped notes, and clickable preview.

![YouTube task detail in dark mode](docs/screenshots/youtube-task-detail-dark.png)

**Quick Ideas (dark mode)** — Idea capture and idea management.

![Quick Ideas in dark mode](docs/screenshots/quick-ideas-dark.png)

---

## Technology Stack

| Layer | Choice |
|---|---|
| Framework | React |
| Build tool | Vite |
| Language | JavaScript |
| Styling | Regular CSS (no Tailwind, no CSS modules) |
| Data | Browser `localStorage` |
| Linting | ESLint |

No backend, database, authentication, routing library, or external data
API. The YouTube IFrame Player API is loaded by the browser for in-app
video embedding and playback controls.

---

## Local Setup

```bash
# clone the repository
git clone https://github.com/MazharulKhan/daily-planner.git
cd daily-planner

# install dependencies
npm install

# start the dev server
npm run dev
```

Open the URL shown in your terminal (usually `http://localhost:5173`).

---

## Available npm Commands

| Command | Description |
|---|---|
| `npm run dev` | Start the Vite development server |
| `npm run build` | Create a production build |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |

---

## Data Storage and Current Limitations

- All data is stored in the browser's `localStorage` only.
- Tasks live under the `dp.tasks` key; ideas under `dp.ideas`; active
  workspace under `dp.activeView`; theme under `dp.theme`.
- **No cross-device or cross-browser sync** — data does not leave the
  browser.
- No accounts or authentication.
- No notifications, recurring tasks, calendar integration, or AI
  features.
- Notes are plain text only; rich-text editing is not supported.
- A visible search field exists in the UI but is not functional.

---

## Project Status and Future Roadmap

**Status:** v1 localStorage MVP complete.

Completed phases include dashboard foundation, task management and
organization, Quick Ideas, standard and YouTube task detail workspaces,
timestamped notes with clickable seek-and-play, global task creation,
workspace persistence, completed-task display refinement, Quick Idea
notes refinement, responsive/accessibility/visual polish, dark mode
preference, and mobile layout polish.

**Planned next:** Phase 6 — Firebase / Cloud Sync. This is a future
phase, not yet implemented, and will start fresh with a clean Firestore
data model. It will require its own approved spec before any setup,
packages, auth, or config are added.

Deferred future improvements include rich-text notes, global search,
recurring tasks, notifications, and AI features.

---

## Author

Mazharul Khan
