# Phase 5E — Responsive, Accessibility, and Visual Polish Pass

**Status: Draft — pending review. Not approved for implementation yet.**

This spec is the proposed source of truth for Phase 5E after review and approval.

---

## 1. Purpose

Phase 5E is a focused polish pass for the existing Daily Planner app. It improves the app's desktop/laptop layout, smaller-width responsiveness, visual consistency, and accessibility without changing the product model, data model, navigation architecture, or core behavior.

The goal is to make the app feel more polished and intentional as a portfolio-ready local MVP while preserving the completed functionality from Phases 2 through 5D.

Phase 5E should make the app feel:

- Cleaner and less overly spacious.
- Easier to scan on desktop and laptop widths.
- More consistent across Dashboard cards, task pages, Quick Ideas, the Add Task modal, and task detail workspaces.
- More keyboard- and screen-reader-friendly.
- More visually complete without becoming a redesign.

---

## 2. Current Context

Phase 5D is complete. The current app includes:

- Dashboard.
- Today page.
- Upcoming page.
- Completed page.
- Quick Ideas workspace.
- Global Add Task modal.
- Standard Task Detail.
- YouTube Task Detail with embedded player, resume, timestamp insertion, clickable timestamp preview, and plain-text notes.

The app remains:

- React + JavaScript.
- Vite.
- Regular CSS only.
- Frontend-only.
- `localStorage` only.
- No routing library.

Phase 5E starts from the current component and CSS structure. It should refine what exists, not rebuild it.

---

## 3. Scope Summary

### In Scope

Phase 5E includes:

- Dashboard layout alignment and density polish.
- App shell and main content spacing polish.
- Sidebar visual polish.
- Sidebar Add Task placement review and adjustment.
- Inline SVG icons for existing sidebar nav items only.
- Header greeting and date-area polish.
- Card spacing, borders, headers, badges, dividers, and empty-state consistency.
- Add Task modal visual and responsive polish.
- Smaller-width/laptop responsiveness for:
  - Dashboard
  - Today page
  - Upcoming page
  - Completed page
  - Quick Ideas workspace
  - Add Task modal
  - Standard Task Detail
  - YouTube Task Detail
- Accessibility polish:
  - visible focus states
  - keyboard reachability
  - no hover-only controls
  - obvious ARIA/focus fixes

### Out of Scope

Do not build in Phase 5E:

- Dark mode.
- Mobile-first redesign.
- Settings page or Settings sidebar item.
- New pages.
- New packages.
- Icon package.
- UI library.
- Tailwind, CSS modules, styled-components, or CSS framework.
- React Router or routing library.
- Firebase, backend, authentication, cloud sync, or external APIs.
- Task or idea data-shape changes.
- localStorage migrations.
- Data reset behavior.
- Bulk delete or multi-select.
- Delete without confirmation.
- Custom Ctrl+Z undo system for YouTube notes.
- Dashboard Quick Ideas edit/delete controls.
- Quick Idea to Task conversion.
- Rich-text editor or formatting toolbar.
- Calendar functionality beyond a visual-only date display.
- Global search behavior.
- Major component rewrites.
- Broad refactors unrelated to polish.

---

## 4. Product and Visual Direction

Preserve the current product direction:

- Clean, desktop-first productivity app.
- Light background.
- White or soft-gray surfaces.
- Blue primary accent.
- Rounded cards.
- Subtle borders.
- Compact task rows.
- Clear visual hierarchy through spacing and grouping.
- Persistent left navigation.

Phase 5E should not make the app visually loud or over-designed. Use the existing design tokens in `src/styles/variables.css` wherever possible.

---

## 5. Non-Functional Rules

### No Data Changes

Phase 5E must not change:

- Task shape.
- Idea shape.
- `dp.tasks`.
- `dp.ideas`.
- `dp.activeView`.
- Migrations.
- Sample data.
- YouTube playback tracking data.

No new localStorage keys are approved for Phase 5E.

### No Product Behavior Changes

Phase 5E must not change:

- Which tasks appear on Dashboard, Today, Upcoming, or Completed.
- Completion behavior.
- Edit/delete behavior.
- Add Task creation behavior.
- Quick Ideas create/edit/delete/notes behavior.
- Standard Task Detail dirty-form behavior.
- YouTube Task Detail dirty-form, player, resume, timestamp insertion, clickable preview, or save behavior.
- Current workspace persistence after refresh.
- `taskType` versus `category` behavior.

### No New Dependencies

Do not install packages. Inline SVGs are allowed. Icon packages are not allowed.

### Small Safe Edits

Prefer targeted CSS and small markup/class additions over component rewrites.

---

## 6. Dashboard Layout and Density

### Problem

The Dashboard currently uses a centered two-column grid with a max width. On wide screens, this can leave too much empty space between the sidebar and the main card grid.

### Requirements

- Pull the Dashboard content/card grid visually closer to the sidebar when the viewport is wide.
- Reduce overly spacious dashboard rhythm while keeping the layout readable.
- Preserve the two-column card grid on desktop.
- Preserve the one-column stack at smaller widths.
- Do not create a new dashboard structure.
- Do not change dashboard card behavior.

### Allowed Changes

Allowed changes include:

- Adjust `.app-content` horizontal padding.
- Adjust `.dashboard` max-width and margin behavior.
- Adjust `.dashboard` gap.
- Add a responsive breakpoint for laptop widths if needed.
- Tune card internal padding consistently.

### Acceptance Criteria

- Dashboard no longer feels awkwardly centered far away from the sidebar on common desktop/laptop widths.
- Cards remain readable and not cramped.
- Two-column desktop layout still works.
- One-column smaller-width layout still works.
- No dashboard functionality changes.

---

## 7. App Shell and Main Content Spacing

### Requirements

- Review `.app-shell`, `.app-main`, and `.app-content` spacing.
- Keep the fixed/sticky sidebar desktop model.
- Ensure the main content area has comfortable but not excessive padding.
- Ensure pages with narrower content, like Quick Ideas and Standard Task Detail, align intentionally rather than feeling randomly centered.
- Do not add routing or URL behavior.

### Responsive Guardrails

- At laptop widths, reduce excessive horizontal padding.
- At smaller widths, avoid horizontal overflow.
- Do not implement a mobile hamburger menu.
- Do not hide the sidebar or create mobile navigation.

---

## 8. Sidebar Visual Polish

### Requirements

The sidebar should feel more polished while preserving the same destinations:

1. Dashboard
2. Today
3. Upcoming
4. Completed
5. Quick Ideas

### Sidebar Icons

- Add subtle inline SVG icons for the five existing nav items only.
- Icons must be hardcoded inline SVG or local component functions.
- Do not add an icon package.
- Icons should be simple, consistent, and visually quiet.
- Icons must be decorative and `aria-hidden="true"` unless they convey information not already present in text.
- Each nav item still includes visible text.

Suggested icon concepts:

- Dashboard: grid/layout icon.
- Today: calendar/day icon.
- Upcoming: clock or calendar-forward icon.
- Completed: check-circle icon.
- Quick Ideas: lightbulb icon.

### Add Task Placement

- Move the Sidebar `Add Task` button from the bottom area to a more prominent position near the top, under the brand, unless implementation inspection shows this creates awkward spacing.
- The button remains the same global Add Task trigger.
- Preserve the disabled state when a task detail view is open.
- Do not add a second Sidebar Add Task button.
- Do not change Add Task behavior.

### Sidebar Layout

- Keep the brand at the top.
- Keep nav items in the same order.
- Keep active state clear.
- Keep focus state visible.
- Preserve keyboard navigation.

### Acceptance Criteria

- Sidebar nav icons are visually distinct but subtle.
- Sidebar still has exactly the same five destinations.
- Add Task is easier to find near the top.
- Sidebar disabled Add Task behavior still works on task detail pages.
- No new nav destinations are added.

---

## 9. Header Polish

### Requirements

- Make the Dashboard greeting more personal and polished.
- Add a visual-only date/calendar area on the right side of the header.
- Preserve existing page titles for Today, Upcoming, and Completed.
- Preserve hidden/neutral header behavior for Quick Ideas and detail views.
- Keep the Header Add Task button hidden while a task detail is open.
- Keep search visual-only; do not implement global search.

### Visual-Only Date Area

The date area may show:

- Current weekday.
- Current month/day.
- A small inline SVG calendar icon.

This is display-only.

Do not add:

- Click behavior.
- Date picker.
- Calendar integration.
- Filtering by date.
- New state.
- New localStorage key.

### Header Search

- Search remains visual-only.
- It may receive minor visual polish.
- Do not make it functional.
- Do not add search results, filtering, keyboard shortcuts, or global search state.

### Acceptance Criteria

- Header feels more polished and personal.
- Date area is clearly decorative/display-only.
- Search remains non-functional.
- Header behavior in Quick Ideas and task detail views does not regress.

---

## 10. Card Consistency

### Target Areas

Apply consistency across:

- Dashboard cards.
- Today page card.
- Upcoming page card.
- Completed page card.
- Daily Progress card.
- Quick Ideas card.
- Empty states.

### Requirements

- Standardize card header spacing.
- Standardize card body spacing.
- Keep count badges consistent.
- Keep dividers visually consistent.
- Keep empty-state icon, title, hint, and action spacing consistent.
- Keep task rows compact and readable.
- Avoid overly large empty-state padding on smaller card areas.
- Preserve all card behavior.

### Allowed Changes

- CSS adjustments in `cards.css`.
- CSS adjustments in `empty-state.css`.
- CSS adjustments in `task-row.css`.
- Small class additions only if needed.

### Acceptance Criteria

- Cards feel like they belong to one design system.
- Empty states do not feel oversized or cramped.
- Badges and dividers look consistent across Dashboard and task pages.
- Existing completed-task collapse controls still work.

---

## 11. Add Task Modal Visual and Responsive Polish

### Requirements

Preserve Phase 5A Add Task modal behavior exactly:

- Same entry points.
- Same fields.
- Same defaults.
- Same dirty-state discard confirmation.
- Same YouTube URL conditional field.
- Same validation.
- Same focus trap behavior.
- Same reset-on-close behavior.

### Visual Polish

- Keep the centered white card, dimmed background, soft shadow, rounded corners.
- Preserve the Defaults box near the bottom above the footer.
- Preserve the Defaults text:
  `Today + Any time + Medium + Work + Standard Task`
- Improve field spacing and label consistency if needed.
- Improve button alignment if needed.
- Make the modal feel polished, not like a raw browser/admin form.

### Optional Metadata Icons

- Small inline SVG icons may be added near metadata field labels or inside metadata rows.
- Icons are visual-only.
- Do not add an icon package.
- Do not make the modal feel crowded.

Suggested visual-only concepts:

- Task Type: simple list/card icon.
- Category: tag icon.
- Priority: flag icon.
- Due Date: calendar icon.
- Time: clock icon.

### Responsive Behavior

- On narrow widths, metadata grid may collapse to one column.
- Modal should avoid viewport overflow.
- Dialog should remain usable on shorter screens with internal scroll.
- Do not create a mobile-specific redesign.

### Acceptance Criteria

- Modal still behaves exactly as Phase 5A.
- Modal is more polished visually.
- Modal remains usable at smaller laptop/narrow viewport sizes.
- No task data behavior changes.

---

## 12. Task Pages Responsive and Visual Polish

### Target Pages

- Today page.
- Upcoming page.
- Completed page.

### Requirements

- Ensure task rows do not overflow horizontally.
- Ensure badges, dates, times, and actions wrap or compress gracefully.
- Keep edit/delete actions keyboard reachable.
- Avoid controls that are only visible/usable on hover.
- Preserve section headings and grouping.
- Preserve Today category filter behavior.
- Preserve Today completed-group expand/collapse behavior.
- Preserve Completed page full archive behavior.

### Inline Style Cleanup

Some group headings may currently use inline styles. Phase 5E may move repeated inline visual styles into CSS classes if this can be done safely and without behavior changes.

This is optional, not required.

### Acceptance Criteria

- Today, Upcoming, and Completed remain usable on smaller laptop widths.
- No horizontal scrolling for normal task content.
- Task rows remain readable.
- Existing task actions still work.

---

## 13. Quick Ideas Workspace Responsive and Visual Polish

### Requirements

- Keep Quick Ideas behavior from Phase 5D unchanged.
- Keep direct notes editing in expanded ideas.
- Keep Save notes and Discard changes behavior.
- Keep dirty-notes protection.
- Keep title edit and delete controls.
- Keep Dashboard Quick Ideas card behavior unchanged.
- Do not add Dashboard edit/delete controls.

### Visual and Responsive Polish

- Ensure the Quick Ideas workspace width and alignment feel intentional.
- Ensure the capture card, idea rows, expanded notes editor, and action buttons work at smaller widths.
- Ensure title edit, delete icon, timestamp, and chevron do not crowd each other.
- Ensure muted/disabled states remain obvious.
- Improve spacing and visual grouping if needed.

### Acceptance Criteria

- Quick Ideas workspace looks polished and readable.
- Expanded idea notes editor remains easy to use.
- Dirty-note protections still work.
- No idea data behavior changes.

---

## 14. Standard Task Detail Responsive and Visual Polish

### Requirements

Preserve all Standard Task Detail behavior:

- Title editing.
- Description.
- Task Type transition helper.
- Priority/category/due date/time.
- Completion.
- Delete confirmation.
- Dirty-form discard confirmation.
- Origin return behavior.
- Save behavior.

### Visual and Responsive Polish

- Ensure form width and alignment feel intentional.
- Ensure header actions wrap gracefully if needed.
- Ensure metadata grid collapses or adapts at narrower widths.
- Ensure footer buttons remain usable.
- Preserve focus behavior.

### Acceptance Criteria

- Standard Task Detail is usable on smaller laptop widths.
- No detail behavior changes.
- Dirty-form and delete confirmations still work.

---

## 15. YouTube Task Detail Responsive and Visual Polish

### Requirements

Preserve all YouTube Task Detail behavior:

- YouTube URL input and validation.
- Embedded player.
- Resume button.
- Open video link.
- Metadata fields.
- YouTube Notes textarea.
- Insert Timestamp.
- Clickable Preview.
- Timestamp seek-and-play.
- Bullet continuation.
- Dirty-form behavior.
- Delete confirmation.
- Origin return.
- Playback position background persistence.

### Visual and Responsive Polish

- Preserve the two-column desktop layout where there is enough width.
- Stack the player/metadata and notes columns at narrower widths.
- Ensure the video player remains 16:9.
- Ensure notes textarea remains usable.
- Ensure clickable preview does not dominate or overflow.
- Ensure metadata grid wraps cleanly.
- Ensure header buttons remain usable on narrower screens.

### Acceptance Criteria

- YouTube Task Detail remains fully usable at smaller laptop widths.
- Player, notes, and preview do not overflow.
- Timestamp preview and Insert Timestamp behavior do not regress.
- No YouTube data, player, or notes behavior changes.

---

## 16. Accessibility Polish

### General Requirements

Audit and improve obvious accessibility issues across touched components.

Focus on practical fixes:

- Visible `:focus-visible` states.
- Keyboard reachability.
- Real `<button>` elements for actions.
- No hover-only controls.
- Clear disabled states.
- Clear accessible labels for icon-only buttons.
- Reasonable `aria-current`, `aria-expanded`, `aria-label`, and `aria-describedby` where already relevant.

### Hover-Only Controls

Task row actions currently become visible on hover/focus. Phase 5E may improve this so actions are easier to discover while preserving compactness.

Acceptable options:

- Keep actions visually subtle but visible enough without hover.
- Use opacity that increases on hover/focus but does not make controls impossible to discover.
- Ensure controls are keyboard reachable and visible on focus.

Do not remove task row actions.

### Focus States

- Do not remove the global `:focus-visible` rule.
- Add component-specific focus states only where needed.
- Ensure custom icon buttons have visible focus.

### ARIA

- Sidebar active nav should keep `aria-current="page"`.
- Expand/collapse buttons should keep appropriate `aria-expanded`.
- Modal dialog should preserve `role="dialog"` and `aria-modal="true"`.
- Search remains visual-only but should have an accessible label.
- Decorative icons should use `aria-hidden="true"`.

### Acceptance Criteria

- Keyboard users can reach and identify all major controls.
- Focus is visible on Sidebar, Header, card actions, task row actions, Quick Ideas controls, modal controls, detail controls, and timestamp controls.
- Icon-only buttons have accessible labels.
- No control required for the main workflows depends on hover alone.

---

## 17. Likely Implementation Files

Likely files to inspect and change:

- `src/App.jsx`
- `src/components/Sidebar.jsx`
- `src/components/Header.jsx`
- `src/components/Dashboard.jsx`
- `src/components/AddTaskModal.jsx`
- `src/components/EmptyState.jsx`
- `src/components/TodayPage.jsx`
- `src/components/UpcomingPage.jsx`
- `src/components/CompletedPage.jsx`
- `src/components/QuickIdeasWorkspace.jsx`
- `src/components/WorkspaceIdeaItem.jsx`
- `src/components/StandardTaskDetail.jsx`
- `src/components/YouTubeTaskDetail.jsx`
- `src/components/TaskRow.jsx`
- `src/components/TodayTasksCard.jsx`
- `src/components/UpcomingTasksCard.jsx`
- `src/components/DailyProgressCard.jsx`
- `src/components/QuickIdeasCard.jsx`
- `src/index.css`
- `src/styles/variables.css`
- `src/styles/layout.css`
- `src/styles/sidebar.css`
- `src/styles/header.css`
- `src/styles/dashboard.css`
- `src/styles/cards.css`
- `src/styles/empty-state.css`
- `src/styles/task-row.css`
- `src/styles/task-detail.css`
- `src/styles/ideas.css`
- `src/styles/quick-ideas-workspace.css`
- `src/styles/add-task-modal.css`
- `src/styles/progress.css`

Likely files to inspect but avoid changing unless needed:

- `index.html`

Files that should not be changed for Phase 5E unless a regression requires it:

- `src/data/*`
- `src/hooks/*`
- `src/utils/*`
- package files
- Vite config
- ESLint config
- Firebase/backend/config files
- Historical completed specs

---

## 18. Implementation Boundaries

Phase 5E is allowed to touch many UI/CSS files, but the work must remain a polish pass.

Do not:

- Rewrite components just to clean them up.
- Rename core state variables.
- Change task derivation/filtering logic.
- Change creation/edit/delete handlers.
- Change YouTube player hook behavior.
- Change localStorage hooks or migrations.
- Change routing/navigation architecture.
- Add new app sections.
- Add hidden unfinished UI for future features.

Prefer:

- CSS changes.
- Small className additions.
- Small inline SVG helper components.
- Small markup adjustments for layout/accessibility.
- Reusing existing design tokens.

---

## 19. Regression Boundaries

Phase 5E must preserve:

- Dashboard task/idea/progress behavior.
- Today category filter behavior.
- Today completed-task collapse behavior.
- Upcoming incomplete-future-only behavior.
- Completed full archive behavior.
- Global Add Task modal behavior.
- Current workspace persistence after refresh.
- Quick Ideas notes editing and dirty-note protection.
- Dashboard Quick Ideas capture and preview behavior.
- Standard Task Detail behavior.
- YouTube Task Detail player, resume, timestamp insertion, clickable preview, and notes behavior.
- Task row edit/delete/complete/open-detail behavior.
- Dirty-form navigation protections.
- Delete confirmations.
- localStorage persistence.
- `taskType` controls workflow.
- `category` remains metadata only.

---

## 20. Acceptance Criteria

Phase 5E is complete when all of the following are true:

1. Dashboard content is better aligned with the sidebar and no longer feels excessively far from it on common desktop/laptop widths.
2. Dashboard card spacing feels tighter and more consistent while remaining readable.
3. Sidebar nav has subtle inline SVG icons for Dashboard, Today, Upcoming, Completed, and Quick Ideas.
4. Sidebar `Add Task` is placed near the top under the brand, or the implementation report clearly explains why it was intentionally left in place.
5. Header Dashboard greeting is more personal/polished.
6. Header includes a visual-only date/calendar display.
7. Header search remains non-functional.
8. Card headers, counts, dividers, badges, empty states, and action spacing are more consistent across views.
9. Add Task modal remains functionally identical but is visually/responsively polished.
10. Today, Upcoming, and Completed pages are usable on smaller laptop/narrow widths without horizontal overflow.
11. Quick Ideas workspace is usable on smaller laptop/narrow widths without crowded controls or horizontal overflow.
12. Standard Task Detail is usable on smaller laptop/narrow widths.
13. YouTube Task Detail is usable on smaller laptop/narrow widths; player, notes, and clickable preview remain usable.
14. All major controls are keyboard reachable.
15. Visible focus states exist for Sidebar, Header, card actions, task row actions, Quick Ideas controls, modal controls, detail controls, and timestamp controls.
16. Icon-only buttons have accessible labels.
17. No workflow depends on hover alone.
18. No new packages are added.
19. No data shape, migration, localStorage key, backend, auth, Firebase, router, or external API changes are made.
20. `npm run build` passes.
21. `npm run lint` passes.
22. Manual browser testing is completed in a normal browser, not only OpenChamber preview.

---

## 21. Manual Browser Test Checklist

Test in a normal browser at the Vite localhost URL.

### Global

- [ ] Run app and confirm no console-breaking errors.
- [ ] Confirm Sidebar destinations still navigate: Dashboard, Today, Upcoming, Completed, Quick Ideas.
- [ ] Confirm browser refresh restores last normal workspace from Phase 5B.
- [ ] Confirm no horizontal page overflow at desktop and smaller laptop widths.
- [ ] Tab through the main controls and confirm focus is visible.

### Dashboard

- [ ] Dashboard grid appears closer to the sidebar and not awkwardly centered too far away.
- [ ] Dashboard remains two columns on desktop.
- [ ] Dashboard stacks cleanly at smaller widths.
- [ ] Today, Upcoming, Quick Ideas, and Daily Progress cards still work.
- [ ] Dashboard card empty states look consistent.

### Sidebar

- [ ] Sidebar nav icons appear for the five existing destinations.
- [ ] Active nav state remains clear.
- [ ] Add Task opens the Add Task modal from normal workspaces.
- [ ] Add Task is disabled on Standard Task Detail and YouTube Task Detail.
- [ ] Keyboard focus is visible on nav items and Add Task.

### Header

- [ ] Dashboard greeting appears correctly.
- [ ] Date/calendar display appears and is visual-only.
- [ ] Search input remains visual-only and does not filter anything.
- [ ] Header Add Task opens the modal from normal views.
- [ ] Header Add Task remains hidden on detail views.
- [ ] Header behavior is acceptable on Quick Ideas and detail views.

### Add Task Modal

- [ ] Modal opens from Sidebar and Header.
- [ ] Modal opens from Dashboard/Today inline Add Task trigger.
- [ ] Modal defaults are unchanged: Today + Any time + Medium + Work + Standard Task.
- [ ] Defaults box remains near the bottom above the footer.
- [ ] Dirty discard confirmation still works.
- [ ] Escape behavior still works.
- [ ] Focus trap still works.
- [ ] YouTube Task URL field still appears only for YouTube Task.
- [ ] Invalid YouTube URL still blocks create.
- [ ] Modal remains usable on smaller widths.

### Today Page

- [ ] Category filter chips still work.
- [ ] Overdue, active, and Completed Today sections still render correctly.
- [ ] Completed Today `Show X more` / `Show less` still works.
- [ ] Add Task trigger still opens modal.
- [ ] Task rows do not overflow.
- [ ] Edit/delete/detail/complete actions still work.

### Upcoming Page

- [ ] Only incomplete future tasks appear.
- [ ] Date grouping still works.
- [ ] Empty state still works.
- [ ] Task rows do not overflow.
- [ ] Edit/delete/detail actions still work.

### Completed Page

- [ ] All completed tasks appear grouped by completion date.
- [ ] Reopen/edit/delete/detail actions still work.
- [ ] Completed row context still displays.
- [ ] Empty state still works.
- [ ] Rows do not overflow.

### Quick Ideas

- [ ] Dashboard Quick Ideas capture still works.
- [ ] Dashboard Quick Ideas opens workspace with selected idea expanded.
- [ ] Workspace capture still works.
- [ ] Expanded idea notes textarea still works.
- [ ] Save notes and Discard changes still work.
- [ ] Dirty-note protection still blocks unsafe actions.
- [ ] Edit title and Delete still work.
- [ ] Workspace layout is usable on smaller widths.

### Standard Task Detail

- [ ] Back, Save, Cancel, Delete still work.
- [ ] Dirty-form warning still works.
- [ ] Task Type transition helper still works.
- [ ] Metadata fields remain usable.
- [ ] Layout is usable on smaller widths.

### YouTube Task Detail

- [ ] Embedded player still loads for valid saved URL.
- [ ] Resume button still works when meaningful.
- [ ] Open video link still works.
- [ ] Insert Timestamp still inserts into notes.
- [ ] Clickable Preview still seeks and plays.
- [ ] Bullet continuation still works.
- [ ] Save/Cancel/Back/Delete still work.
- [ ] Dirty-form warning still works.
- [ ] Layout is usable on smaller widths.

### Verification

- [ ] `npm run build` passes.
- [ ] `npm run lint` passes.
- [ ] Final report states browser testing status clearly.

---

## 22. Completion Report Requirements

When implementation is done, the coding agent must report:

- Summary of changes.
- Files changed.
- Verification results:
  - `npm run build`
  - `npm run lint`
- Manual browser testing status.
- Any known issues or follow-ups.
- Confirmation that no packages, router, Firebase/backend/auth, data-shape changes, or new localStorage keys were added.
- Commit status.

Do not commit or push unless explicitly asked.
