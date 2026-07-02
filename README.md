# Daily Planner

A clean, desktop-first personal planner that lives in your browser. Add tasks, track progress, and capture ideas — all on one screen, with nothing to install and no account required.

Built with React and Vite. Data stays in your browser via `localStorage`.

## Features

- **Today's Tasks** — Your day at a glance. Add, complete, uncomplete, edit, or delete tasks inline. Overdue tasks rise to the top with a clear warning. Completed tasks group under a divider so you can see what you've accomplished.
- **Upcoming Tasks** — Future-dated tasks sorted by nearest due date. Completed items stay visible and reopenable, grouped under their own divider.
- **Quick Ideas** — Capture random thoughts instantly without leaving the dashboard. No metadata, no fuss.
- **Daily Progress** — A circular progress ring that shows how many of today's tasks are done and updates live as you work.
- **Inline Editing** — Click Edit on any task to change its title, priority, category, time, or due date. Focus moves right to the title input. Save or cancel with a single click.
- **Delete with Confirmation** — Remove a task after a confirmation prompt. Focus moves to Cancel for safety.
- **Optional Metadata** — Priority (None, Low, Medium, High), category, time, and due date controls fold behind a "More options" toggle in the add-task form.
- **Automatic Sorting** — Tasks sort by overdue (oldest first), then today (by time), then undated. Upcoming tasks sort by nearest due date, then time.
- **Persistent Storage** — Everything saves to `localStorage` automatically. Refresh or close the tab — your data comes back.
- **Keyboard Accessible** — All task actions are reachable and operable by keyboard with visible focus indicators.

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | React |
| Build tool | Vite |
| Language | JavaScript |
| Styling | Regular CSS (no Tailwind, no CSS modules) |
| Data | Browser `localStorage` |
| Linting | ESLint |

No backend, no database, no authentication, no external APIs.

## Getting Started

```bash
# install dependencies
npm install

# start the dev server
npm run dev
```

Open the URL shown in your terminal (usually `http://localhost:5173`).

```bash
# create a production build
npm run build

# preview the production build
npm run preview

# run the linter
npm run lint
```

## Project Structure

```
src/
├── components/      # React components (Dashboard, TaskRow, Sidebar, etc.)
├── data/            # localStorage helpers and sample data
├── hooks/           # useTasks, useIdeas — state + persistence
├── styles/          # CSS files (variables, layout, cards, task-row, etc.)
├── utils/           # Date/time helpers, ID generation
├── App.jsx          # Root component
├── index.css        # Global resets and theme tokens
└── main.jsx         # Entry point
```

## Project Status

Active development — desktop dashboard and core task management are complete. Future phases may include learning and reading workflows, additional pages, and polish.

## License

[MIT](LICENSE)
