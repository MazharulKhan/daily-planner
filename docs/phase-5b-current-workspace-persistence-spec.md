# Phase 5B - Current Workspace Persistence

**Status: Complete — implemented, build/lint passed, manually browser-verified.**

## 1. Purpose

Phase 5B persists the last stable normal workspace after browser refresh, so
refreshing no longer always resets the app to Dashboard.

This is a small local preference feature. It does not change task or idea
data, does not introduce routing, and does not persist transient UI state.

---

## 2. Scope

### In Scope

- Persist only the last stable normal workspace.
- Supported restorable workspaces:
  - Dashboard
  - Today
  - Upcoming
  - Completed
  - Quick Ideas
- Use `localStorage` key: `dp.activeView`.
- Restore a supported workspace on app load.
- Fall back safely to Dashboard for missing, invalid, corrupted, unsupported,
  or unavailable storage.

### Out of Scope

- No React Router.
- No URL routing.
- No backend, Firebase, auth, or cloud sync.
- No packages.
- No task or idea data-shape changes.
- No migration of tasks or ideas.
- No persistence of task detail pages.
- No persistence of Add Task modal state.
- No persistence of selected task detail state.
- No persistence of expanded Quick Idea state.
- No Phase 5C completed-task display work.
- No responsive, accessibility, or visual polish pass.

---

## 3. Restore Behavior

On app load:

1. Read `dp.activeView` from `localStorage`.
2. If the value is one of the allowed normal workspaces, start the app on
   that workspace.
3. If the value is missing, invalid, corrupted, unsupported, or cannot be read,
   start on Dashboard.
4. Do not crash if `localStorage` is unavailable, throws, or returns malformed
   data.

Allowed stored values should map only to the five normal workspaces:

- Dashboard
- Today
- Upcoming
- Completed
- Quick Ideas

Task detail views are never restorable app-start destinations.

---

## 4. Stored View Values

The implementation must reuse the app's existing internal active-view
identifiers rather than inventing new display-label strings.

Allowed persisted values must match the current app's normal workspace IDs in
`src/App.jsx`:

- `dashboard`
- `today`
- `upcoming`
- `completed`
- `quick-ideas`

Before implementation, inspect `src/App.jsx` and use the exact existing
active-view values if they have changed. Do not store display labels such as
`Dashboard` or `Quick Ideas` unless those are already the actual internal
values.

The labels shown to users remain unchanged.

---

## 5. Save Behavior

Save `dp.activeView` whenever the user navigates to a normal workspace:

- Dashboard
- Today
- Upcoming
- Completed
- Quick Ideas

Do not save:

- Standard Task Detail
- YouTube Task Detail
- Add Task modal open/closed state
- Add Task modal draft fields
- Selected task detail state
- Expanded Quick Idea state
- Quick Idea edit/delete-confirm state

Saving the active view must be best-effort. If writing to `localStorage` fails,
the app should continue working without a user-facing crash.

---

## 6. Detail Page Behavior

Opening a Standard Task Detail or YouTube Task Detail must keep the last normal
workspace as the saved `dp.activeView` value.

If the browser refreshes while the user is on a task detail page, the app
restores to the last saved normal workspace, not the detail page.

Example:

1. User is on Today.
2. User opens a task detail.
3. User refreshes the browser.
4. App restores to Today.

Unsaved detail draft changes are not preserved across browser refresh.

Existing Standard Task Detail and YouTube Task Detail origin-return behavior
must be preserved during normal in-app navigation.

---

## 7. Quick Ideas Behavior

If the user refreshes while on Quick Ideas, the app restores to Quick Ideas.

Do not restore:

- Expanded idea
- Selected idea
- Edit mode
- Delete-confirm state

Quick Ideas should load in its normal default workspace state after refresh.

---

## 8. Add Task Modal Behavior

If the Add Task modal is open and the user refreshes, the app restores the
underlying normal workspace.

The modal must not reopen after refresh.

Modal draft fields must not persist.

Phase 5A global Add Task modal behavior must otherwise remain unchanged.

---

## 9. Regression Boundaries

Phase 5B must preserve:

- Phase 5A global Add Task modal behavior.
- Dashboard, Today, Upcoming, Completed, and Quick Ideas behavior.
- Standard Task Detail and YouTube Task Detail origin-return behavior.
- Dirty-form navigation prompts during normal in-app navigation.
- YouTube player, resume, timestamp insertion, and clickable-preview behavior.
- All task and idea `localStorage` data.
- The `taskType` vs. `category` invariant:
  - `taskType` controls the detail workspace.
  - `category` is metadata only.

Phase 5B must not add, remove, reset, migrate, or reshape tasks or ideas.

---

## 10. Acceptance Criteria

1. Refresh on Dashboard restores Dashboard.
2. Refresh on Today restores Today.
3. Refresh on Upcoming restores Upcoming.
4. Refresh on Completed restores Completed.
5. Refresh on Quick Ideas restores Quick Ideas.
6. Refresh on Standard Task Detail restores the last normal workspace.
7. Refresh on YouTube Task Detail restores the last normal workspace.
8. Refresh with Add Task modal open restores the underlying workspace with the
   modal closed.
9. Invalid `dp.activeView` falls back to Dashboard.
10. Missing `dp.activeView` falls back to Dashboard.
11. Unavailable or throwing `localStorage` does not crash the app.
12. No task or idea data is changed.
13. `npm run build` passes.
14. `npm run lint` passes.

---

## 11. Manual Browser Test Checklist

Test in a normal browser at the Vite localhost URL. Do not rely on
OpenChamber's built-in preview.

- [ ] Navigate to Dashboard, refresh, and confirm Dashboard is shown.
- [ ] Navigate to Today, refresh, and confirm Today is shown.
- [ ] Navigate to Upcoming, refresh, and confirm Upcoming is shown.
- [ ] Navigate to Completed, refresh, and confirm Completed is shown.
- [ ] Navigate to Quick Ideas, refresh, and confirm Quick Ideas is shown.
- [ ] Navigate to Today, open a Standard Task Detail, refresh, and confirm
      Today is shown.
- [ ] Navigate to Upcoming, open a Standard Task Detail, refresh, and confirm
      Upcoming is shown.
- [ ] Navigate to Today or Upcoming, open a YouTube Task Detail, refresh, and
      confirm the last normal workspace is shown.
- [ ] Navigate to Quick Ideas, expand an idea, refresh, and confirm Quick Ideas
      opens in its normal default workspace state.
- [ ] Navigate to any normal workspace, open the Add Task modal, refresh, and
      confirm the same workspace is shown with the modal closed.
- [ ] Enter draft values in the Add Task modal, refresh, reopen the modal, and
      confirm draft values were not preserved.
- [ ] Manually set `dp.activeView` to an invalid value in browser devtools,
      refresh, and confirm Dashboard is shown.
- [ ] Confirm existing tasks and ideas remain unchanged after all refresh
      tests.
- [ ] Confirm normal in-app task detail origin-return behavior still works.
- [ ] Confirm normal dirty-form navigation prompts still appear during in-app
      navigation away from dirty detail forms.
- [ ] Confirm YouTube player, resume, timestamp insertion, and clickable
      timestamp preview still work.
- [ ] Run `npm run build` and confirm it passes.
- [ ] Run `npm run lint` and confirm it passes.

---

## 12. Likely Implementation Files

These files are likely implementation touchpoints. Do not change them as part
of this documentation-only spec.

- `src/App.jsx` - likely owns active view initialization, normal workspace
  navigation, and detail-view transitions.
- A small helper utility for active view persistence, only if useful - for
  example, to centralize allowed view values and safe `localStorage` reads and
  writes.
- `docs/project-status.md` - update after Phase 5B implementation is complete.
- `docs/build-plan.md` - update after Phase 5B implementation is complete.

The implementation should keep the change small and should not introduce a
new abstraction unless it reduces risk or keeps `App.jsx` clearer.

---

## 13. Next-Step Boundary

- User reviews and approves spec.
- Coding agent produces implementation plan only.
- User reviews plan.
- Implement after approval.
- Browser test.
- npm run build.
- npm run lint.
- Commit only when user explicitly asks.
