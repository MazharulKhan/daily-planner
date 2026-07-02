# Daily Planner Web Application
## UX/UI & Functional Specification

**Version:** 1.0

> **Implementation note:** This document preserves the broader product and UX source material. For the active implementation scope and order of work, follow `docs/project-spec.md`, `docs/dashboard-spec.md`, `docs/build-plan.md`, and `docs/project-status.md`. The current build phase is dashboard-first.

## Table of Contents

1. Product Vision & Research
2. UX/UI
3. Screen Specifications
4. Functional Specifications
5. MVP Scope & Future Versions

---

## 1. Product Vision & Research

### 1.1 Product Context

The Daily Planner is a desktop-first productivity and learning planner for managing daily tasks, quick ideas, and structured learning in one offline application.

Version 1 should focus on a simple daily workflow:

- Review today’s tasks.
- Add or update tasks quickly.
- Capture ideas without interrupting work.
- Resume learning tasks from the last saved point.
- Track reading progress and learning notes.

The product should feel familiar to users of modern task managers while adding a learning-focused workflow for YouTube videos, books, PDFs, and articles. The MVP should avoid advanced productivity features and prioritize a clean, fast, localStorage-based experience.

### 1.2 Competitive Analysis

#### Todoist

**Brief overview**

Todoist is a task management application focused on capturing, organizing, scheduling, and completing tasks across personal and work contexts.

**Major strengths**

- Fast task capture.
- Clean and low-clutter interface.
- Simple task organization through projects, labels, and priorities.
- Strong daily planning patterns through Today and Upcoming-style views.
- Easy scanning through compact task rows and clear completion states.

**UX/UI patterns worth adopting**

- A dashboard or Today view that makes current work immediately visible.
- Compact task rows with checkbox, title, priority, category, and due date.
- Quick add behavior for fast task entry.
- Subtle priority indicators instead of visually heavy status treatments.
- Persistent sidebar navigation for predictable access to key views.

**Weaknesses or gaps relevant to this project**

- Learning resources are not a primary workflow.
- Video notes, reading progress, and timestamped learning notes are not central concepts.
- Users may still need separate tools for YouTube learning, reading notes, and resource tracking.

#### TickTick

**Brief overview**

TickTick is an all-in-one productivity application that combines task management with planning tools such as calendar views, habits, and Pomodoro/focus features.

**Major strengths**

- Combines multiple productivity workflows in one application.
- Supports task lists, scheduling, habits, and focus sessions.
- Provides strong structure for users who want more than a basic task list.
- Makes progress and planning feel visible within the product experience.

**UX/UI patterns worth adopting**

- Modular dashboard areas for different productivity needs.
- Progress visibility through simple summary cards or indicators.
- Structured detail views for deeper task information.
- Quick capture for tasks and ideas.
- Lightweight grouping through categories or lists.

**Weaknesses or gaps relevant to this project**

- The broader feature set can feel heavier than needed for a 2–3 day MVP.
- Learning-specific workflows are not the central focus.
- Video timestamp notes and reading continuation are not treated as primary task types.
- The MVP should avoid becoming a large all-in-one productivity suite.

### 1.3 Key Design Decisions

The competitor research supports the following Version 1 decisions:

- Use a clean dashboard centered on Today’s Tasks, Upcoming Tasks, Quick Ideas, and progress.
- Keep task rows compact and easy to scan.
- Include quick task and idea capture to reduce friction.
- Use a persistent left sidebar for predictable desktop navigation.
- Keep organization lightweight through categories, priorities, due dates, and completion status.
- Make Learning Tasks and Reading Tasks dedicated workflows rather than generic task notes.
- Avoid advanced features such as calendar sync, recurring tasks, habits, notifications, collaboration, and cloud sync in Version 1.

### 1.4 Research Conclusion

Version 1 should combine the clarity of a simple task manager with a focused learning workflow. The application should not attempt to match the full feature depth of Todoist or TickTick. Instead, it should provide a smaller, purpose-built experience for users who want to manage daily work and continue structured learning in the same place.

The MVP should prioritize:

- A clean dashboard for daily planning.
- Fast task and idea capture.
- Lightweight organization through categories, priority, dates, and completion status.
- Learning task pages with embedded YouTube videos, timestamped notes, and resume behavior.
- Reading task pages with resource links, progress, notes, and key takeaways.
- Offline persistence through localStorage.

---

## 2. UX/UI

### 2.1 Design Philosophy

The application should feel like a lightweight daily command center for productivity and learning. The interface should prioritize clarity, speed, and low visual clutter over feature density.

The design should be:

- **Desktop-first**, using a persistent sidebar, wide content area, and spacious layouts.
- **Minimal**, avoiding dense menus, excessive icons, heavy borders, and unnecessary metadata.
- **Fast to understand**, with primary sections and actions immediately recognizable.
- **Familiar**, using common task management patterns such as task rows, checkboxes, badges, and due dates.
- **Learning-focused**, giving Learning and Reading Tasks enough visual importance to feel like core workflows.
- **Low friction**, keeping capture, navigation, and review actions simple and predictable.

The MVP should not feel like a complex project management system. It should feel focused, practical, and easy to use immediately.

### 2.2 Visual Style

The visual direction should follow the attached mockups: clean, modern, desktop-first, and card-based.

The interface should use a light theme with white and soft gray surfaces. Cards should have rounded corners, subtle borders, and light separation between content groups. Typography should use a clean sans-serif font with clear hierarchy between page titles, section headings, labels, and body text.

Blue should be used as the primary accent color for buttons, active states, links, and important actions. Priority, category, and status labels should use small, restrained badges rather than large visual treatments.

Primary buttons should be clear and easy to identify. Secondary actions should remain visually quieter. The UI should rely on spacing, hierarchy, and grouping rather than heavy decoration.

### 2.3 Navigation

The application should use a persistent left sidebar for primary navigation. This creates a predictable desktop experience and keeps the main sections accessible at all times.

Primary navigation should include:

- Dashboard
- Today
- Upcoming
- Completed
- Learning
- Ideas
- Categories

The active section should be clearly indicated through a subtle background highlight, accent color, or stronger text weight. The Dashboard should be the default landing screen.

Navigation should remain simple in Version 1. Nested navigation, complex menus, and advanced workspace structures are not needed.

### 2.4 Overall Layout Principles

The application should use a consistent desktop layout system across screens.

The main layout should include:

- A left sidebar for persistent navigation and app identity.
- A main content area for the current page.
- Optional supporting panels for secondary content such as progress, ideas, or summary cards.

The dashboard should use a balanced layout with main planning content in the central area and supporting cards on the right. Detail pages should provide more workspace while maintaining the same visual language.

Content should be grouped into clear cards or sections. Important information should be visible without overwhelming the user. Secondary information should be visually quieter.

### 2.5 Mockup Direction

The attached mockups establish the intended Version 1 design direction.

They show:

- A fixed left sidebar for predictable navigation.
- A clean dashboard with task lists, quick ideas, and progress cards.
- Soft card-based grouping with rounded corners and subtle borders.
- Blue accent color for primary actions and active interface elements.
- A learning-focused layout that gives notes and learning resources enough space.
- A reading-focused layout that organizes progress, notes, and takeaways clearly.

The final implementation should stay close to this visual direction. The attached mockups establish the primary light-theme design direction. Version 1 should support both Light and Dark mode while maintaining the same layout, spacing, and visual hierarchy.

### 2.6 High-Level Design Decisions

- Use a fixed sidebar to keep navigation stable and familiar for desktop users.
- Use cards to separate dashboard areas without adding visual clutter.
- Keep task lists compact so users can scan daily work quickly.
- Give Learning and Reading Tasks dedicated visual space to reinforce the product’s learning-focused differentiation.
- Use subtle color and small badges to communicate status, priority, and category without overwhelming the interface.
- Keep the UI light and minimal to support the 2–3 day MVP timeline and reduce implementation complexity.

---

## 3. Screen Specifications

> **Mockup note:** Related screenshot/mockup files are stored separately in `docs/ui-reference/`.

### 3.1 Dashboard

#### Purpose

The Dashboard is the main landing screen and daily command center. It helps users quickly review today’s work, check upcoming tasks, capture new tasks or ideas, and monitor daily progress without navigating through multiple screens.

#### Main Components

- Fixed left sidebar with primary navigation.
- Page title and current day/date context.
- Search input for finding tasks, ideas, and notes.
- Primary Add Task button.
- Today’s Tasks card with compact task rows.
- Upcoming Tasks card for future due items.
- Quick Ideas card for fast idea capture.
- Progress Overview card showing daily completion status.
- Category summary or category shortcuts.
- Empty states for sections with no available content.

#### User Interactions

- User can add a new task from the Dashboard.
- User can search across stored tasks, ideas, learning notes, and reading notes.
- User can mark today’s tasks as complete.
- User can open a task detail screen by selecting a task row.
- User can capture a quick idea without leaving the Dashboard.
- User can convert a quick idea into a standard task.
- User can use the sidebar to navigate to Today, Upcoming, Learning, Ideas, or Categories.
- Progress indicators update automatically as tasks are completed.

### 3.2 Standard Task Detail

#### Purpose

The Standard Task Detail screen allows users to view, edit, complete, or delete a single task. It should provide enough detail for task management without becoming visually heavy. This screen is intended for normal tasks that do not require video learning, reading progress, or resource-specific note-taking.

#### Main Components

- Fixed left sidebar with primary navigation.
- Page header with task title or editable title field.
- Back link or breadcrumb to return to the previous list.
- Task description field.
- Priority selector.
- Due date selector.
- Category selector.
- Completion status checkbox or toggle.
- Save or update action.
- Delete task action.
- Created or updated timestamp, if useful.
- Empty or default field states for newly created tasks.

#### User Interactions

- User can update the task title, description, priority, due date, and category.
- User can mark the task as complete or incomplete.
- User can save changes and return to the previous screen.
- User can delete the task after confirmation.
- User can navigate back to the Dashboard, Today, Upcoming, or Categories using the sidebar.
- If the task is edited, changes should appear immediately anywhere the task is listed.
- If the task is completed, it should move out of active task views and appear in Completed.

### 3.3 Learning Task Detail

#### Purpose

The Learning Task Detail screen allows users to learn from a YouTube video while taking notes in the same workspace. It should support focused video learning, timestamped note-taking, and easy continuation from the last watched point without adding unnecessary complexity.

#### Main Components

- Fixed left sidebar with primary navigation.
- Page header with learning task title.
- Back link or breadcrumb to return to the previous view.
- Embedded YouTube video player.
- Video link field.
- Resume from last watched timestamp button.
- Insert current timestamp button.
- Scrollable rich-text notes editor with formatting toolbar.
- Clickable timestamped notes embedded directly within the editor.
- Scrollable notes area for long-form note-taking.
- Priority, due date, and category fields.
- Mark as completed action.
- Delete or edit task action.

#### User Interactions

- User can paste or edit a YouTube video link.
- User can play the embedded video from the task page.
- User can resume from the last saved video timestamp.
- User can write notes continuously while watching the video.
- Selecting Insert Timestamp automatically inserts the current playback time at the cursor position.
- Timestamped notes remain within a single scrollable document rather than separate note cards.
- Clicking any timestamp seeks the embedded YouTube player to that point in the video.
- User can update task details such as title, priority, due date, and category.
- User can mark the learning task as completed.

### 3.4 Reading Task Detail

#### Purpose

The Reading Task Detail screen helps users track learning from books, PDFs, and articles over multiple sessions. It should provide a focused workspace for storing the resource link, reading progress, notes, and key takeaways without becoming a full note-taking application.

#### Main Components

- Fixed left sidebar with primary navigation.
- Page header with reading task title.
- Back link or breadcrumb to return to the previous view.
- Resource information section: link, resource type, and format.
- Reading progress section with progress bar and current reading position.
- Scrollable rich-text notes editor.
- Key takeaways section.
- Optional highlights or tags area.
- Priority, due date, and category fields.
- Mark as completed action.
- Edit task action.
- Delete task action.

#### User Interactions

- User can add or edit the resource link.
- User can update reading progress after each session.
- User can write and edit reading notes.
- User can add key takeaways for later review.
- User can update the current reading position after each reading session.
- User can add optional highlights or tags.
- User can update task details such as title, priority, due date, and category.
- User can view reading progress through the progress indicator.
- User can mark the reading task as completed.
- User can delete the reading task after confirmation.

### 3.5 Quick Ideas

#### Purpose

The Quick Ideas screen provides a lightweight space for capturing thoughts, reminders, concepts, or future tasks without interrupting the user's current workflow. It is designed for rapid idea capture while allowing ideas to be expanded with additional details and later converted into Standard Tasks when they become actionable.

#### Main Components

- Fixed left sidebar with primary navigation.
- Page header with title and short description.
- Multi-line quick idea input area.
- Add Idea button.
- List of saved ideas displayed as expandable idea cards.
- Expanded idea view for adding additional notes or supporting details.
- Convert to Task action.
- Edit idea action.
- Delete idea action.
- Empty state when no ideas exist.
- Simple sorting by newest first.

#### User Interactions

- User can quickly capture a new idea using the input area.
- User can review saved ideas in a simple list of expandable cards.
- User can expand or collapse an idea to view or edit additional details without leaving the page.
- User can add or edit supporting notes for an expanded idea.
- User can edit an existing idea.
- User can delete an idea.
- User can convert an idea into a Standard Task while preserving all idea content and notes.
- Ideas are automatically saved locally after creation or editing.
- User can navigate back to the Dashboard or any other primary section using the sidebar.

### 3.6 Task List View (Today / Upcoming)

#### Purpose

The Task List View allows users to focus on tasks within a specific time window. The Today view displays overdue tasks followed by tasks due today, while the Upcoming view displays tasks due tomorrow and beyond to support future planning. Both views share the same layout, with only the displayed tasks and date groupings changing.

#### Main Components

- Fixed left sidebar with primary navigation.
- Page header displaying either Today or Upcoming.
- Primary Add Task button.
- Link to the Completed Tasks view.
- Task list organized chronologically by due date and time.
- Overdue section displayed at the top of the Today view.
- Compact task rows with completion checkbox.
- Task title and optional short description.
- Category badge.
- Priority badge.
- Due date or due time.
- Completed Today section, for the Today view only, displaying tasks completed earlier in the day.
- Progress summary card showing completed tasks versus total tasks for the current view.
- Contextual status message displayed at the bottom of the page, such as remaining tasks or all tasks completed.
- Empty state when no tasks exist for the selected view.

#### User Interactions

- User can switch between Today and Upcoming using the sidebar.
- User can quickly scan tasks by due date and priority.
- User can mark tasks as complete directly from the list.
- Completed tasks immediately move to the Completed Today section.
- User can open a task by selecting its row.
- User can add a new task from the current view.
- Progress updates automatically as tasks are completed.
- The bottom status message updates dynamically based on the number of remaining tasks.
- User can navigate back to the Dashboard or any other primary section using the sidebar.

---

## 4. Functional Specifications

### 4.1 Task Management

The application supports three task types:

1. Standard Tasks
2. Learning Tasks
3. Reading Tasks

Users can create, edit, complete, and delete tasks. Each task includes a title, category, priority, due date, and completion status. Completed tasks are removed from active task views and stored in the Completed section.

### 4.2 Learning Workflow

Learning Tasks embed YouTube videos directly within the application using the YouTube Player API. Users can watch videos without leaving the planner while taking notes in a scrollable editor.

The application automatically saves the last watched video position, allowing users to resume learning from where they stopped. Users can insert the current playback timestamp into their notes with a single action, and clicking a timestamp seeks the video to the corresponding point.

### 4.3 Reading Workflow

Reading Tasks provide a dedicated workspace for books, PDFs, and articles. Users can store a resource link, update reading progress, write notes, and record key takeaways. Reading progress is preserved between sessions, allowing users to continue where they previously stopped.

### 4.4 Quick Ideas

Quick Ideas provide a lightweight capture system for thoughts, reminders, and future tasks. Ideas can be expanded with additional notes while remaining on the same page. When an idea becomes actionable, it can be converted into a Standard Task while preserving its content.

### 4.5 Data Storage

Version 1 stores all application data locally using localStorage, including:

- Tasks
- Notes
- Ideas
- Categories
- Reading progress
- Learning progress

No user accounts, cloud synchronization, or backend services are included in the MVP.

---

## 5. MVP Scope & Future Versions

### 5.1 Version 1 (MVP)

The MVP focuses on delivering a clean, desktop-first planner that combines daily task management with lightweight learning workflows while remaining simple to build and easy to use.

**Included features**

- Dashboard overview
- Standard Tasks
- Learning Tasks with embedded YouTube videos
- Timestamped learning notes
- Reading Tasks with progress tracking
- Quick Ideas with expandable notes and task conversion
- Today and Upcoming task views
- Categories
- Light and Dark mode
- Local data persistence using localStorage

### 5.2 Future Versions

Potential improvements for future releases include:

- User authentication and cloud synchronization
- Mobile-responsive interface
- Calendar integration
- Desktop notifications and reminders
- AI-assisted note summaries and learning insights
- Recurring tasks
- Rich text formatting
- File attachments
- Advanced search and filtering
