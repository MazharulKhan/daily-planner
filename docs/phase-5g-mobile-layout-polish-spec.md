# Phase 5G - Mobile Layout Polish

**Status: Complete — implemented, build/lint passed, manually
browser-verified.**

This spec is the source of truth for the completed Phase 5G work. It is
now a historical reference.

---

## 1. Purpose

Phase 5G is a focused mobile usability polish pass for the existing Daily
Planner app.

The goal is to make the deployed app reasonably usable and presentable on
normal phone widths before Phase 5H README, screenshots, and portfolio
handoff work begins.

This is not a full redesign. Phase 5G should fix the mobile layout failure
while preserving the current desktop/laptop experience and all completed app
behavior from Phases 2 through 5F.

---

## 2. Current Problem

The real mobile screenshot from the deployed Vercel app shows the desktop
layout being used on a phone viewport.

Observed problems:

- The desktop sidebar remains large and left-positioned.
- The Dashboard content is squeezed into a narrow column on the right.
- The page has horizontal overflow.
- The Today's Tasks card is clipped and unreadable.
- Category filters and task rows are compressed into a tiny vertical strip.
- The app is not presentable on normal mobile browser width unless Chrome
  desktop view is enabled.

The core issue is the app shell: the fixed left desktop sidebar continues to
reserve a full desktop column on phone widths. Mobile layout must start by
changing the shell, not by only tightening card spacing.

---

## 3. Scope

Phase 5G includes mobile-width layout polish for:

- App shell.
- Sidebar / navigation area.
- Header.
- Dashboard cards.
- Task rows.
- Today page.
- Upcoming page.
- Completed page.
- Quick Ideas workspace.
- Add Task modal.
- Standard Task Detail.
- YouTube Task Detail.
- Dark mode compatibility for changed mobile layouts.
- Accessibility of changed mobile controls.

Primary target: common phone browser widths, including approximately
360px, 390px, 414px, and 430px.

Desktop and laptop layouts should be preserved as much as possible.

---

## 4. Explicitly Out of Scope

Do not build in Phase 5G:

- New packages.
- Icon package.
- UI library.
- Tailwind, CSS modules, styled-components, or CSS framework.
- React Router or routing library.
- Firebase, backend, authentication, cloud sync, or external APIs.
- Task or idea data-shape changes.
- Task or idea migrations.
- Data reset behavior.
- New localStorage keys.
- New sidebar destinations.
- New pages.
- Global search behavior.
- Settings page.
- Mobile app install/PWA behavior.
- Full mobile-first redesign.
- New product features.
- README, screenshots, or portfolio handoff content.
- Changes to YouTube player behavior beyond layout containment.

---

## 5. Mobile Layout Strategy

At mobile widths, the app must stop using the fixed left desktop sidebar
layout.

Requirements:

- Convert `.app-shell` from a two-column desktop grid to a single-column
  mobile layout.
- The former sidebar becomes a top mobile navigation area.
- `.app-main` and `.app-content` use the full viewport width.
- The page must not create horizontal document scrolling for normal app
  content.
- Mobile content padding should be reduced enough for phone widths while
  keeping touch targets comfortable.
- Use targeted responsive CSS and small markup/class adjustments only where
  needed.

Implementation may choose the exact breakpoint, but it must cover normal
phone widths. A breakpoint around 760px is likely appropriate because several
existing styles already use that range.

Desktop guardrail:

- Above the chosen mobile breakpoint, keep the current left sidebar and
  desktop/laptop layout as intact as practical.

---

## 6. Sidebar Behavior on Mobile

At mobile widths, the sidebar must become a top mobile navigation area, not a
left column.

Requirements:

- The sidebar must no longer be `height: 100vh`, sticky as a left rail, or a
  fixed-width desktop column at phone widths.
- Brand, Add Task, nav items, and the dark mode toggle must fit within phone
  width.
- The top area may use wrapping rows or an internal horizontal nav strip, but
  it must not cause whole-page horizontal overflow.
- Brand remains visible as `Daily Planner` with the existing brand mark unless
  the approved implementation plan identifies a safe compact variant.
- Add Task remains a global task creation trigger and stays disabled on task
  detail views.
- Nav destinations remain exactly:
  - Dashboard
  - Today
  - Upcoming
  - Completed
  - Quick Ideas
- Active nav state remains clear.
- Dark mode toggle remains available and keyboard operable.

Acceptable mobile patterns:

- Brand and Add Task in a top row, with nav items wrapping below.
- Brand on one row, Add Task and Dark mode on another, nav in a wrapping grid.
- Nav items in a horizontal scroll container only if the scroll is contained
  inside the nav area and does not create body-level horizontal overflow.

Do not:

- Add a hamburger menu unless separately approved.
- Hide required navigation entirely.
- Add a new mobile route system.
- Remove the dark mode toggle.

---

## 7. Header Behavior on Mobile

The Header must stack cleanly under the mobile navigation area.

Requirements:

- Page title and subtitle must be readable at phone widths.
- Header actions must not squeeze the title into an unreadable column.
- The visual-only search should be hidden or simplified on mobile.
- Search remains non-functional if shown.
- The visual-only date chip may be simplified or hidden if needed for fit.
- Header Add Task may remain visible only if it fits cleanly without crowding;
  the Sidebar/mobile nav Add Task remains the primary mobile entry point.
- Header Add Task remains hidden on detail views.
- Quick Ideas and detail-view header behavior must not regress.

Do not implement global search or date/calendar behavior.

---

## 8. Dashboard and Card Behavior on Mobile

Dashboard content must use the full mobile viewport width.

Requirements:

- Dashboard cards stack in one column on phone widths.
- Cards must not be clipped by the sidebar or viewport edge.
- Card headers should wrap cleanly when needed.
- Counts, "View all", empty states, and Add Task triggers must remain usable.
- Card body padding should be comfortable but not wasteful.
- Daily Progress must remain readable and not overflow.
- Dashboard Today, Upcoming, Quick Ideas, and Daily Progress cards must all
  remain visible and usable in a normal vertical scroll.

The screenshot failure where Today's Tasks is squeezed into a narrow right
column must be fully resolved.

---

## 9. Task Row Behavior on Mobile

Task rows must not clip or require horizontal scrolling.

Requirements:

- Task title, checkbox, badges, due/time text, and edit/delete actions must
  reflow into readable mobile rows.
- Long task titles should wrap or truncate in a controlled way without
  hiding essential controls.
- Priority and category badges may wrap below the title.
- Overdue/date/time text must wrap or move to its own line instead of
  overflowing.
- Edit/delete actions must remain visible enough, touch-friendly, keyboard
  reachable, and not hover-only.
- Inline edit and delete confirmation states must fit phone widths.

Do not remove task actions or change task behavior.

---

## 10. Add Task Modal Behavior on Mobile

The Add Task modal must be usable on phone widths.

Requirements:

- Dialog width must fit within the viewport.
- Dialog may use a bottom-sheet style on phone widths, as long as it remains
  accessible and consistent with the current app.
- Form content must scroll internally if the viewport is short.
- Metadata fields should stack to one column on phone widths.
- Footer buttons must remain reachable and not overflow.
- The Defaults box remains near the bottom above the footer.
- Dirty discard confirmation remains usable.
- YouTube URL field and validation remain usable.
- Focus trap and Escape behavior remain intact.

Preserve Phase 5A Add Task behavior exactly.

---

## 11. Quick Ideas Mobile Behavior

Quick Ideas must be usable on phone widths.

Requirements:

- Workspace uses the full mobile content width.
- Capture textarea and Save button fit without overflow.
- Idea rows must wrap cleanly.
- Expanded notes editor must remain comfortable to type in.
- Save notes, Discard changes, title edit, delete, chevron, and dirty-note
  protection must remain usable.
- Timestamps or idea metadata may be hidden or moved if needed for mobile
  fit, as long as core behavior is preserved.

Do not add Dashboard Quick Ideas edit/delete controls.

---

## 12. Standard and YouTube Detail Mobile Behavior

### Standard Task Detail

Requirements:

- Detail view uses the full mobile content width.
- Header actions wrap cleanly.
- Title, completion checkbox, description, and metadata fields remain usable.
- Metadata grid stacks to one column.
- Save, Cancel, Back, Delete, dirty-form confirmation, and delete
  confirmation remain usable.

### YouTube Task Detail

Requirements:

- Detail view uses the full mobile content width.
- Player, metadata, and notes stack in one column.
- Video player remains 16:9 and contained within the viewport.
- YouTube URL field and validation fit cleanly.
- Notes textarea remains usable.
- Insert Timestamp and Clickable Preview controls fit cleanly.
- Clickable Preview body remains contained and scrolls internally when needed.
- Timestamp chips must not force horizontal page overflow.
- Save, Cancel, Back, Delete, dirty-form confirmation, delete confirmation,
  resume, open video link, timestamp insertion, timestamp seek-and-play, and
  bullet continuation must not regress.

---

## 13. Dark Mode Compatibility

Phase 5G must preserve Phase 5F dark mode behavior.

Requirements:

- Mobile top navigation, wrapped nav rows, simplified header, stacked cards,
  task rows, modal, Quick Ideas, and detail views must be readable in light
  and dark themes.
- Existing `dp.theme` behavior must remain unchanged.
- Do not add a new theme key or system-theme behavior.
- Do not remove or hide the dark mode toggle on mobile.
- Any new or adjusted mobile surfaces must use existing CSS variables.

---

## 14. Accessibility Requirements

Mobile layout changes must preserve or improve accessibility.

Requirements:

- All controls remain keyboard reachable.
- Focus states remain visible.
- Touch targets should be comfortable on phone widths.
- Sidebar/mobile nav keeps `aria-current="page"` on the active destination.
- Dark mode toggle keeps accessible switch semantics.
- Add Task modal keeps `role="dialog"` and `aria-modal="true"`.
- Expand/collapse controls keep appropriate `aria-expanded`.
- Icon-only buttons keep accessible labels.
- Visual-only search remains clearly labeled if present.
- No core workflow may depend on hover.

Do not trade accessibility for compactness.

---

## 15. Files Likely Involved

Likely files to inspect and possibly change during implementation:

- `src/App.jsx`
- `src/components/Sidebar.jsx`
- `src/components/Header.jsx`
- `src/components/Dashboard.jsx`
- `src/components/AddTaskModal.jsx`
- `src/components/TaskRow.jsx`
- `src/components/TodayPage.jsx`
- `src/components/UpcomingPage.jsx`
- `src/components/CompletedPage.jsx`
- `src/components/QuickIdeasWorkspace.jsx`
- `src/components/StandardTaskDetail.jsx`
- `src/components/YouTubeTaskDetail.jsx`
- `src/styles/layout.css`
- `src/styles/sidebar.css`
- `src/styles/header.css`
- `src/styles/dashboard.css`
- `src/styles/cards.css`
- `src/styles/task-row.css`
- `src/styles/add-task-modal.css`
- `src/styles/quick-ideas-workspace.css`
- `src/styles/task-detail.css`
- `src/styles/variables.css`

Likely inspect-only unless needed for a regression:

- `src/components/WorkspaceIdeaItem.jsx`
- `src/styles/ideas.css`
- `src/styles/empty-state.css`
- `src/styles/progress.css`
- `src/index.css`

Files that should not be changed for Phase 5G unless a regression requires
it:

- `src/data/*`
- `src/hooks/*`
- `src/utils/*`
- package files
- Vite config
- ESLint config
- Firebase/backend/config files

---

## 16. Regression Boundaries

Phase 5G must preserve:

- Desktop left-sidebar layout above the mobile breakpoint as much as
  practical.
- Dashboard task, idea, and progress behavior.
- Today category filter behavior.
- Today completed-task collapse behavior.
- Upcoming incomplete-future-only behavior.
- Completed full archive behavior.
- Global Add Task modal behavior.
- Current workspace persistence after refresh.
- Quick Ideas notes editing and dirty-note protection.
- Dashboard Quick Ideas capture and preview behavior.
- Standard Task Detail behavior.
- YouTube Task Detail player, resume, timestamp insertion, clickable preview,
  and notes behavior.
- Task row edit/delete/complete/open-detail behavior.
- Dirty-form navigation protections.
- Delete confirmations.
- `dp.tasks`, `dp.ideas`, `dp.activeView`, and `dp.theme` behavior.
- `taskType` controls workflow.
- `category` remains metadata only.

Phase 5G must not add packages, router, backend, Firebase, auth, cloud sync,
data-shape changes, migrations, or new localStorage keys.

---

## 17. Acceptance Criteria

Phase 5G is complete when all of the following are true:

1. At phone widths, the app no longer uses the fixed left desktop sidebar
   layout.
2. At phone widths, `.app-shell` is a single-column layout.
3. Sidebar content becomes a top mobile navigation area.
4. Brand, Add Task, nav items, and dark mode toggle fit within phone width.
5. Main content uses the full mobile viewport width.
6. There is no body-level horizontal overflow for normal app content.
7. Dashboard cards stack in one column and are not clipped.
8. Header stacks cleanly, and visual-only search is hidden or simplified on
   mobile.
9. Task rows do not clip and do not require horizontal page scrolling.
10. Today category chips wrap or scroll cleanly within their own area.
11. Add Task modal is usable on phone widths.
12. Today page is usable on phone widths.
13. Upcoming page is usable on phone widths.
14. Completed page is usable on phone widths.
15. Quick Ideas workspace is usable on phone widths.
16. Standard Task Detail is usable on phone widths.
17. YouTube Task Detail is usable on phone widths.
18. Dark mode remains readable and functional on mobile.
19. Existing desktop layout is preserved as much as practical.
20. No new packages are added.
21. No router is added.
22. No Firebase, backend, auth, cloud sync, or external API is added.
23. No task or idea data-shape changes are made.
24. No new localStorage keys are added.
25. `npm run build` passes.
26. `npm run lint` passes.
27. Manual mobile browser testing is completed in a normal browser.

---

## 18. Manual Mobile Browser Test Checklist

Test in a normal browser at the Vite localhost URL. Do not rely only on an
agent preview.

Recommended viewport/device checks:

- [ ] 360px wide phone viewport.
- [ ] 390px wide phone viewport.
- [ ] 414px or 430px wide phone viewport.
- [ ] Light theme.
- [ ] Dark theme.
- [ ] At least one desktop/laptop width to confirm desktop layout did not
      materially regress.

### Global Shell

- [ ] Mobile no longer shows a large fixed left sidebar.
- [ ] Sidebar/mobile navigation appears above the main content.
- [ ] Brand, Add Task, nav items, and dark mode toggle fit within phone width.
- [ ] Main content uses full width below the mobile navigation.
- [ ] No body-level horizontal scrolling appears.
- [ ] Sidebar destinations still navigate: Dashboard, Today, Upcoming,
      Completed, Quick Ideas.
- [ ] Browser refresh still restores the last normal workspace.
- [ ] Dark mode toggle works and persists.

### Header

- [ ] Dashboard title/subtitle are readable.
- [ ] Today, Upcoming, and Completed titles/subtitles are readable.
- [ ] Header actions do not crowd the title.
- [ ] Visual-only search is hidden or simplified on mobile.
- [ ] Header Add Task, if visible, fits cleanly.
- [ ] Header Add Task remains hidden on detail views.

### Dashboard

- [ ] Dashboard cards stack one column.
- [ ] Today's Tasks card is fully readable and not clipped.
- [ ] Today filters fit by wrapping or contained scrolling.
- [ ] Task rows fit without horizontal page scrolling.
- [ ] Upcoming card is readable.
- [ ] Quick Ideas card is readable.
- [ ] Daily Progress card is readable.
- [ ] Dashboard Add Task and Quick Idea capture still work.

### Today Page

- [ ] Category filter chips wrap or scroll cleanly.
- [ ] Overdue, active, and Completed Today sections render correctly.
- [ ] Completed Today `Show X more` / `Show less` still works.
- [ ] Task rows fit and actions remain usable.
- [ ] Add Task trigger opens the modal.

### Upcoming Page

- [ ] Date groups fit within the viewport.
- [ ] Task rows fit and actions remain usable.
- [ ] Empty state still works.

### Completed Page

- [ ] Completed groups fit within the viewport.
- [ ] Completed row context does not overflow.
- [ ] Reopen/edit/delete/detail actions still work.
- [ ] Empty state still works.

### Quick Ideas

- [ ] Workspace capture textarea and Save button fit.
- [ ] Idea rows fit without clipping.
- [ ] Expanded notes editor is comfortable to use.
- [ ] Save notes and Discard changes still work.
- [ ] Dirty-note protection still blocks unsafe actions.
- [ ] Edit title and Delete still work.

### Add Task Modal

- [ ] Modal opens from mobile navigation Add Task.
- [ ] Modal opens from any remaining inline Add Task triggers.
- [ ] Modal fits within phone width.
- [ ] Modal content is scrollable on short screens.
- [ ] Metadata fields stack cleanly.
- [ ] Defaults box remains near the bottom above the footer.
- [ ] Dirty discard confirmation still works.
- [ ] YouTube URL validation still works.
- [ ] Focus trap and Escape behavior still work.

### Standard Task Detail

- [ ] Back, Save, Cancel, and Delete fit and work.
- [ ] Dirty-form warning still works.
- [ ] Delete confirmation still works.
- [ ] Title, description, and metadata fields fit.
- [ ] Metadata fields stack cleanly.

### YouTube Task Detail

- [ ] YouTube URL field fits.
- [ ] Embedded player stays 16:9 and contained.
- [ ] Resume button and Open video link fit.
- [ ] Metadata fields stack cleanly.
- [ ] Notes textarea is usable.
- [ ] Insert Timestamp fits and works.
- [ ] Clickable Preview fits and remains internally contained.
- [ ] Timestamp chips still seek and play.
- [ ] Bullet continuation still works.
- [ ] Save/Cancel/Back/Delete and dirty-form warning still work.

### Verification

- [ ] `npm run build` passes.
- [ ] `npm run lint` passes.
- [ ] Final implementation report states mobile browser testing status
      clearly.
- [ ] Final implementation report confirms no packages, router,
      Firebase/backend/auth/cloud, data-shape changes, or new localStorage
      keys were added.

---

## 19. Implementation Report Requirements

When implementation is done, the coding agent must report:

- Summary of changes.
- Files changed.
- Verification results:
  - `npm run build`
  - `npm run lint`
- Manual mobile browser testing status.
- Desktop regression testing status.
- Confirmation that no packages, router, Firebase/backend/auth/cloud,
  task/idea data-shape changes, migrations, or new localStorage keys were
  added.
- Known issues or follow-ups.
- Commit status.

Do not commit or push unless explicitly asked.
