# Dashboard Specification

## Purpose

The Dashboard is the default landing screen and daily command center for the Daily Planner app.

It should let the user quickly:

- See today’s work
- Add a task
- Complete or reopen a task
- Capture a quick idea without leaving the page
- See a simple completion summary

The first implementation should be functional, visually close to the supplied dashboard reference, and intentionally limited to the dashboard phase.

## Layout

### Desktop Structure

- Use a fixed left sidebar.
- Use a wide main content area.
- Use a two-column dashboard card grid.
- Top row:
  - Today’s Tasks card on the left
  - Upcoming Tasks card on the right
- Bottom row:
  - Quick Ideas card on the left
  - Daily Progress card on the right
- Keep the layout spacious, clean, and easy to scan.

### Visual Direction

- Light background.
- White cards with subtle borders.
- Rounded card corners.
- Blue primary accent for active navigation, main actions, progress, and links.
- Compact task rows with restrained priority/category badges.
- Use spacing and grouping rather than dense menus or heavy visual decoration.
- Regular CSS only.

## Sidebar

### Brand

- Show a small app icon or simple visual mark.
- Display the app name: `Daily Planner`.

### Navigation Items

Display these navigation items in order:

1. Dashboard
2. Today
3. Upcoming
4. Completed
5. Learning
6. Reading
7. Ideas
8. Categories

### Active State

- Dashboard is active on this screen.
- Use a subtle blue-tinted background, blue accent, or stronger text weight.
- Navigation items may be visual placeholders only in this phase.
- Do not build destination pages or routing unless explicitly approved.

### Sidebar Action

- Place a prominent blue `+ Add Task` button near the bottom of the sidebar.
- It should open or focus the same first-phase task-add interaction used by the main dashboard controls.

## Header

- Main title: `Dashboard`
- Short greeting/subtitle beneath it, such as: `Good morning! Here's your overview for today.`
- Search field near the upper-right with placeholder text similar to:
  `Search tasks, ideas, categories...`
- Blue `+ Add Task` button beside the search field.

### Search Scope

- The search input may be visual-only in this first phase.
- Do not implement global search behavior unless it is extremely simple and does not increase scope.

## Today’s Tasks Card

### Header

- Heading: `Today’s Tasks`
- Small count badge beside the heading.
- `View all` text action on the right; it may be visual-only in this phase.

### Task Rows

Use compact rows separated by subtle dividers.

Each task row should display:

- Completion checkbox
- Task title
- Small priority badge
- Small category badge
- Time aligned toward the right

Suggested starter display values may include priorities such as `High`, `Medium`, and `Low`, and categories such as `Work`, `Learning`, `Personal`, or `Health`.

### Interactions

The first phase must support:

- Add task
- Complete task
- Uncomplete task
- Persist tasks after refresh through `localStorage`

### Add Task

- Include an inline `+ Add a task` action at the bottom of the card.
- The top-header and sidebar Add Task controls should use the same underlying flow.
- A simple inline form, compact modal, or controlled input panel is acceptable.
- Keep the first form simple. Required field: task title.
- Use sensible defaults for display metadata in Phase 1 rather than building full priority/category/time editors.

## Upcoming Tasks Card

### Header

- Heading: `Upcoming Tasks`
- Small count badge beside the heading.
- `View all` text action on the right; it may be visual-only in this phase.

### Rows

Each row should display:

- Task title
- Due date
- Small category badge

### First-Phase Behavior

- Show upcoming tasks derived from local task data when practical.
- Starter upcoming items are acceptable when there is no saved data.
- Do not build a standalone Upcoming page in this phase.

## Quick Ideas Card

### Header

- Heading: `Quick Ideas`
- Small plus action in the card header.

### Idea Rows

Display saved ideas as compact, lightly tinted/pastel rows.

Each row should include:

- Small idea or lightbulb-style visual indicator
- Idea text
- Timestamp or relative date aligned to the right

Include a `View all ideas` text action at the bottom. It may be visual-only in this phase.

### First-Phase Behavior

The first phase must support:

- Add a quick idea
- Display saved quick ideas
- Persist quick ideas after refresh through `localStorage`

Do not build:

- Editing
- Deletion
- Supporting notes
- Expandable cards
- Task conversion
- A standalone Ideas page

## Daily Progress Card

### Content

- Heading: `Daily Progress`
- Circular completion indicator
- Completion summary such as: `3 of 5 tasks completed today`
- Short encouraging message below the summary

### Behavior

- Progress must update automatically when a task is completed or uncompleted.
- Calculate progress from tasks shown as current/dashboard tasks.
- Handle the zero-task state gracefully, for example with `0 of 0 tasks completed`.

## Empty States

When there are no saved tasks or ideas:

- Show helpful empty-state messaging.
- Keep the cards visually balanced.
- Make the next action clear, such as `Add a task` or `Capture your first idea`.

Starter sample data may be added only when no saved local data exists.

## Local Storage Requirements

Persist at minimum:

- Task list
- Task completion state
- Display metadata required by task rows
- Quick Idea list

On initial load:

1. Read saved data from `localStorage`.
2. Use it if valid.
3. Otherwise create and display starter sample data.

After user changes:

- Update React state.
- Save the updated data back to `localStorage`.

## Phase 1 Acceptance Criteria

The dashboard phase is complete when:

- The app displays the fixed sidebar and dashboard header.
- The two-by-two dashboard card layout is visible.
- Today’s Tasks, Upcoming Tasks, Quick Ideas, and Daily Progress are visible.
- The user can add a task.
- The user can complete and reopen a task.
- The user can add a quick idea.
- Task and idea data remain after a browser refresh.
- Daily Progress updates from task completion.
- The app uses React, JavaScript, regular CSS, and localStorage only.
- `npm run build` succeeds.
- `npm run lint` succeeds or any lint issues are explicitly addressed.

## Do Not Build Yet

- Firebase
- Authentication
- Backend APIs
- Database
- Cloud sync
- Notifications
- Calendar sync
- Recurring tasks
- Full global search
- Full Today, Upcoming, Completed, Learning, Reading, Ideas, or Categories pages
- Task detail pages
- Task editing or deletion
- Full priority/category/date editing
- YouTube integration
- Reading progress
- Rich text editors
- Idea conversion into tasks
- Dark mode
