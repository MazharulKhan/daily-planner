# Phase 5F — Dark Mode Preference

**Status: Approved for implementation.**

This spec is the proposed source of truth for Phase 5F. It must be reviewed
and approved before any application code is changed.

---

## 1. Purpose

Phase 5F adds a simple global **Dark Mode** preference to the Daily Planner app.

The app currently supports only the light theme. Dark mode will make the app
more comfortable to use in low-light environments and improve the portfolio
polish of the local MVP.

This phase is a focused theme-preference feature. It must preserve all completed
behavior from Phases 2 through 5E.

---

## 2. Current Context

The current app includes:

- Dashboard
- Today page
- Upcoming page
- Completed page
- Quick Ideas workspace
- Global Add Task modal
- Standard Task Detail
- YouTube Task Detail with embedded player, resume, timestamp insertion,
  clickable timestamp preview, and plain-text notes

The app remains:

- React + JavaScript
- Vite
- Regular CSS only
- Frontend-only
- `localStorage` only
- No routing library

Phase 5E is complete. Phase 5F should build on the existing CSS variable system
in `src/styles/variables.css`.

---

## 3. Scope Summary

### In Scope

Phase 5F includes:

- A global light/dark theme preference.
- A Dark Mode toggle in the left sidebar near the bottom.
- Persisting the selected theme in `localStorage`.
- Restoring the saved theme after refresh.
- Applying the theme globally across:
  - Dashboard
  - Today page
  - Upcoming page
  - Completed page
  - Quick Ideas workspace
  - Add Task modal
  - Standard Task Detail
  - YouTube Task Detail
- Dark-mode values for existing color tokens in `src/styles/variables.css`.
- Targeted CSS fixes for hardcoded light surfaces or unreadable text if needed.
- Accessibility for the theme toggle.
- Manual browser testing in both light and dark themes.

### Out of Scope

Do not build in Phase 5F:

- Settings page.
- New sidebar destination.
- Theme customization beyond Light/Dark.
- Accent color picker.
- System-theme auto detection.
- Theme scheduling.
- Mobile-first redesign.
- New packages.
- Icon package.
- UI library.
- Tailwind, CSS modules, styled-components, or CSS framework.
- React Router or routing library.
- Firebase, backend, authentication, cloud sync, or external APIs.
- Task or idea data-shape changes.
- Task/idea migrations.
- Data reset behavior.
- Changes to task filtering, sorting, completion, editing, deleting, or detail behavior.
- Changes to YouTube player, resume, timestamp, or notes behavior.
- Changes to Quick Ideas behavior.
- README / screenshots / portfolio handoff work.

---

## 4. Product Decision

Dark mode is an **app preference**, not a Dashboard feature.

The toggle belongs in the persistent left sidebar because:

- It is visible from every main workspace.
- It does not clutter Dashboard cards.
- It does not compete with the Header date, search, or Add Task controls.
- It feels like a global app setting.

---

## 5. Sidebar Placement and UX

### Placement

Place the Dark Mode toggle near the bottom of the left sidebar, below the main
navigation and after the flexible spacer.

Sidebar order should be:

1. Brand
2. Add Task
3. Navigation:
   - Dashboard
   - Today
   - Upcoming
   - Completed
   - Quick Ideas
4. Spacer
5. Dark Mode preference row

### Control layout

Use a compact sidebar row:

```text
[moon/sun icon] Dark mode        [switch]
```

Requirements:

- The icon may be an inline SVG.
- Do not install an icon package.
- The label is visible text: `Dark mode`.
- The switch clearly communicates on/off state.
- The control should feel consistent with the existing sidebar styling.
- The toggle must remain usable when the user is on normal workspaces and task
  detail pages.
- When the Add Task modal is open, the modal overlay continues to block
  interaction with the sidebar, including the theme toggle.

### Visual states

- In light theme, the row should look subtle and secondary.
- In dark theme, the row should remain readable and clearly interactive.
- Active/on state should be visually clear.
- Focus state must be visible.

---

## 6. Theme Behavior

### Supported values

The theme preference supports exactly two values:

- `light`
- `dark`

### Default behavior

- If there is no saved theme preference, default to `light`.
- If the saved value is invalid or unreadable, default to `light`.
- Do not use `prefers-color-scheme` in Phase 5F.
- Do not auto-switch based on system settings.

Rationale: a manual-only toggle is simpler, deterministic, and easier to test.
System-theme detection can be considered later as a separate refinement.

### Toggle behavior

- Toggling Dark Mode on changes theme from `light` to `dark`.
- Toggling Dark Mode off changes theme from `dark` to `light`.
- The change applies immediately without a page refresh.
- The selected theme persists after refresh.

### Theme application

Apply the theme globally using a root-level attribute or equivalent approach.

Preferred approach:

```html
<html data-theme="dark">
```

Then define CSS variable overrides in `src/styles/variables.css`:

```css
:root[data-theme='dark'] {
  /* dark theme token overrides */
}
```

An app-level wrapper attribute is acceptable only if it reliably themes the
body background, modal overlay/dialogs, and all app surfaces. A root-level
attribute is preferred because `body` already uses theme variables.

---

## 7. localStorage Rules

### New approved preference key

Phase 5F approves exactly one new `localStorage` key:

```text
dp.theme
```

Allowed stored values:

```text
light
dark
```

### Persistence rules

- Read `dp.theme` during app initialization.
- If the value is `light` or `dark`, use it.
- If the value is missing, invalid, corrupted, or `localStorage` throws,
  fall back to `light`.
- Write `dp.theme` whenever the user changes the theme.
- If writing fails, the app should keep working for the current session.
- Do not show a user-facing error for localStorage failures.

### Data boundary

Do not change:

- `dp.tasks`
- `dp.ideas`
- `dp.activeView`
- Task shape
- Idea shape
- Task migrations
- Idea migrations
- Sample data

`dp.theme` is an app preference only.

---

## 8. CSS / Theme Implementation Approach

### Existing tokens

Use the existing design-token approach in `src/styles/variables.css`.

The current light theme already defines tokens such as:

- `--color-bg`
- `--color-surface`
- `--color-surface-soft`
- `--color-border`
- `--color-border-soft`
- `--color-text`
- `--color-text-muted`
- `--color-text-faint`
- `--color-accent`
- `--color-accent-hover`
- `--color-accent-soft`
- `--color-accent-border`
- `--color-success`
- `--color-success-soft`
- `--color-warn`
- `--color-warn-soft`
- `--color-danger`
- `--color-danger-soft`
- `--color-idea-1`
- `--color-idea-2`
- `--color-idea-3`
- `--color-idea-4`
- shadows

Phase 5F should add dark-mode overrides for these existing tokens rather than
rewriting every component.

### Dark palette direction

Dark mode should feel calm and readable:

- Background: dark navy / slate
- Surfaces: slightly lighter slate
- Soft surfaces: another subtle slate layer
- Borders: low-contrast slate border
- Main text: near-white, not pure white if avoidable
- Muted text: readable gray
- Accent: blue remains the primary action color
- Success/warn/danger: adjusted if needed for contrast
- Idea tint colors: subdued dark tinted surfaces, not bright pastel blocks
- Shadows: reduced or adjusted for dark backgrounds

### Component-specific fixes

After adding dark tokens, inspect the app visually and apply targeted fixes
only where variables are not enough.

Likely areas to inspect:

- Sidebar
- Header
- Cards
- Task rows and badges
- Add Task modal
- Quick Ideas idea rows and notes editor
- Standard Task Detail
- YouTube Task Detail
- Clickable Preview
- Daily Progress ring
- Empty states
- Native inputs/selects/date/time controls

Hardcoded white text on blue/danger buttons is allowed when used as contrast
text for strong colored buttons.

Avoid broad rewrites. Prefer token updates and small CSS fixes.

### Native form controls

Inputs, textareas, selects, date inputs, and time inputs must remain readable in
both themes.

It is acceptable to set:

```css
color-scheme: light;
```

for light and:

```css
color-scheme: dark;
```

for dark if it improves native input rendering.

---

## 9. Accessibility Requirements

### Toggle semantics

Use an accessible control for the theme toggle.

Acceptable implementation:

```jsx
<button
  type="button"
  role="switch"
  aria-checked={theme === 'dark'}
  aria-label="Toggle dark mode"
>
  ...
</button>
```

Requirements:

- Real keyboard-operable control.
- Reachable by Tab.
- Operable with Enter and Space.
- Visible focus state.
- Clear on/off visual state.
- Accessible name includes `Dark mode`.
- `aria-checked` reflects the current state if using `role="switch"`.

### Contrast

Dark mode must keep readable contrast for:

- Body text
- Muted text
- Buttons
- Badges
- Inputs
- Empty states
- Sidebar nav
- Header date chip and search
- Modal text and controls
- Task detail labels and helper/error text
- YouTube notes and clickable preview

### No hover-only behavior

The theme toggle must not rely on hover. Its state and focus must be visible
without hovering.

---

## 10. Likely Implementation Files

Likely files to inspect and change:

- `src/App.jsx`
- `src/components/Sidebar.jsx`
- `src/index.css`
- `src/styles/variables.css`
- `src/styles/sidebar.css`

Likely files to inspect and possibly adjust with targeted CSS fixes:

- `src/styles/layout.css`
- `src/styles/header.css`
- `src/styles/cards.css`
- `src/styles/task-row.css`
- `src/styles/add-task-modal.css`
- `src/styles/quick-ideas-workspace.css`
- `src/styles/ideas.css`
- `src/styles/task-detail.css`
- `src/styles/progress.css`
- `src/styles/empty-state.css`

Likely files to inspect but avoid changing unless needed:

- `src/components/Header.jsx`
- `src/components/AddTaskModal.jsx`
- `src/components/TaskRow.jsx`
- `src/components/QuickIdeasWorkspace.jsx`
- `src/components/WorkspaceIdeaItem.jsx`
- `src/components/StandardTaskDetail.jsx`
- `src/components/YouTubeTaskDetail.jsx`

Files that should not be changed for Phase 5F unless a regression requires it:

- `src/data/*`
- `src/hooks/*`
- `src/utils/*`
- package files
- Vite config
- ESLint config
- Firebase/backend/config files
- Completed historical specs

---

## 11. Regression Boundaries

Phase 5F must preserve:

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
- YouTube Task Detail player, resume, timestamp insertion, clickable preview,
  and notes behavior.
- Task row edit/delete/complete/open-detail behavior.
- Dirty-form navigation protections.
- Delete confirmations.
- localStorage persistence for tasks, ideas, and active view.
- `taskType` controls workflow.
- `category` remains metadata only.

Phase 5F must not change task/idea data or migrations.

---

## 12. Acceptance Criteria

Phase 5F is complete when all of the following are true:

1. A Dark Mode toggle appears near the bottom of the Sidebar.
2. The toggle uses visible text `Dark mode`.
3. The toggle has a clear on/off switch visual.
4. The toggle is keyboard reachable and operable.
5. The toggle has accessible switch semantics or equivalent accessible labeling.
6. Switching to dark mode applies immediately across the full app.
7. Switching back to light mode applies immediately across the full app.
8. The selected theme persists after browser refresh using `dp.theme`.
9. Missing `dp.theme` defaults to light mode.
10. Invalid `dp.theme` falls back safely to light mode.
11. Dark mode covers Dashboard, Today, Upcoming, Completed, Quick Ideas, Add
    Task modal, Standard Task Detail, and YouTube Task Detail.
12. Inputs, textareas, selects, date inputs, and time inputs are readable in
    both themes.
13. Task badges, idea rows, Daily Progress, empty states, and clickable
    timestamp preview are readable in both themes.
14. No task or idea data changes are made.
15. No task/idea migrations are added.
16. No packages are added.
17. No router, backend, Firebase, auth, or external API is added.
18. Existing app behavior is preserved.
19. `npm run build` passes.
20. `npm run lint` passes.
21. Manual browser testing is completed in a normal browser.

---

## 13. Manual Browser Test Checklist

Test in a normal browser at the Vite localhost URL. Do not rely only on an
agent preview.

### Global theme behavior

- [ ] With no saved `dp.theme`, app starts in light mode.
- [ ] Toggle Dark Mode on and confirm app changes to dark mode immediately.
- [ ] Toggle Dark Mode off and confirm app changes to light mode immediately.
- [ ] Refresh in dark mode and confirm dark mode persists.
- [ ] Refresh in light mode and confirm light mode persists.
- [ ] Manually set `localStorage.setItem('dp.theme', 'bad-value')`, refresh,
      and confirm app falls back safely to light mode.
- [ ] Confirm `dp.tasks`, `dp.ideas`, and `dp.activeView` are not changed by
      toggling theme.

### Sidebar

- [ ] Dark Mode toggle appears near the bottom of the sidebar.
- [ ] Toggle row is readable in both light and dark themes.
- [ ] Toggle has visible focus state.
- [ ] Toggle can be operated with keyboard.
- [ ] Sidebar nav still works in both themes.
- [ ] Sidebar Add Task still opens the modal from normal workspaces.
- [ ] Sidebar Add Task remains disabled on task detail pages.

### Header

- [ ] Header text is readable in both themes.
- [ ] Date chip is readable in both themes.
- [ ] Search input is readable in both themes.
- [ ] Header Add Task still works.

### Dashboard

- [ ] Today card is readable in both themes.
- [ ] Upcoming card is readable in both themes.
- [ ] Quick Ideas card is readable in both themes.
- [ ] Daily Progress card and ring are readable in both themes.
- [ ] Task badges and action icons are readable in both themes.

### Task pages

- [ ] Today page category chips are readable and active state is clear.
- [ ] Today task rows, dividers, and completed toggle are readable.
- [ ] Upcoming page date groups and task rows are readable.
- [ ] Completed page grouped archive rows are readable.
- [ ] Edit/delete/detail/complete actions still work.

### Add Task modal

- [ ] Modal overlay and dialog look correct in dark mode.
- [ ] Inputs, textareas, selects, date input, and time input are readable.
- [ ] Defaults box is readable.
- [ ] Dirty discard confirmation is readable.
- [ ] YouTube URL validation error is readable.
- [ ] Focus trap still works.
- [ ] Escape behavior still works.

### Quick Ideas

- [ ] Dashboard Quick Ideas capture still works.
- [ ] Quick Ideas workspace capture card is readable.
- [ ] Idea rows are readable.
- [ ] Expanded notes textarea is readable.
- [ ] Save notes and Discard changes still work.
- [ ] Dirty-note protection still works.
- [ ] Edit title and Delete still work.

### Standard Task Detail

- [ ] Title, description, metadata fields, helper text, and footer buttons are
      readable in dark mode.
- [ ] Dirty-form warning still works.
- [ ] Delete confirmation still works.
- [ ] Save and Back still work.

### YouTube Task Detail

- [ ] YouTube URL field and metadata fields are readable.
- [ ] Embedded player area does not visually break.
- [ ] Resume button remains readable.
- [ ] Open video link remains readable.
- [ ] Notes textarea is readable.
- [ ] Insert Timestamp button is readable.
- [ ] Clickable Preview is readable.
- [ ] Timestamp chips are readable and still seek/play.
- [ ] Dirty-form warning still works.

### Verification

- [ ] `npm run build` passes.
- [ ] `npm run lint` passes.
- [ ] Final report states browser testing status clearly.

---

## 14. Implementation Report Requirements

When implementation is done, the coding agent must report:

- Summary of changes.
- Files changed.
- Verification results:
  - `npm run build`
  - `npm run lint`
- Manual browser testing status.
- Confirmation that no packages, router, Firebase/backend/auth, task/idea data
  changes, migrations, or external APIs were added.
- Confirmation that the only new localStorage key is `dp.theme`.
- Known issues or follow-ups.
- Commit status.

Do not commit or push unless explicitly asked.
