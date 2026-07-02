# Daily Planner App — Current Status

## Current Phase

Documentation and dashboard planning.

## Confirmed Completed

- React + Vite project scaffold created.
- JavaScript React template selected.
- ESLint selected.
- `npm install` completed successfully.
- `npm run dev` works.
- The starter app opens in a normal browser through the Vite localhost URL.
- OpenCode is installed.
- OpenChamber is installed.
- OpenRouter is connected.
- Current coding model is GLM 5.2.
- Current reasoning setting is High.
- `docs/` structure has been created.
- Original source document and UI reference images have been added to the project.
- Broad MVP source material is available in `docs/source/daily-planner-mvp-source.md`.

## How to Run the App

Open a terminal inside the project root and run:

```powershell
npm run dev
```

Open the localhost URL shown by Vite in a normal browser. It is usually:

```text
http://localhost:5173/
```

Keep the terminal running while testing. Stop it later with `Ctrl + C`.

## Current Documentation Structure

```text
docs/
├── source/
├── ui-reference/
├── project-spec.md
├── dashboard-spec.md
├── build-plan.md
└── project-status.md
```

## Current Constraints

- Use React, JavaScript, Vite, and regular CSS.
- Use `localStorage` for saved app data.
- Keep the app frontend-only.
- Build one phase at a time.
- Start with the dashboard only.
- Use written Markdown specifications as the main requirements for GLM 5.2.
- Do not put API keys or secrets in project files.
- Do not add Firebase, authentication, backend APIs, a database, external APIs, or extra packages without explicit approval.

## Known Issues

- OpenChamber’s built-in browser preview does not currently work correctly.
- The app works normally in a regular browser using the Vite localhost URL.
- Use OpenChamber for the coding chat, terminal, Git, and file review; use a normal browser for visual testing.

## Next Exact Step

1. Review the completed documentation:
   - `docs/project-spec.md`
   - `docs/dashboard-spec.md`
   - `docs/build-plan.md`
   - `docs/project-status.md`
2. Create and review `AGENTS.md`.
3. Commit the documentation and `AGENTS.md`.
4. Ask OpenCode for a dashboard-only implementation plan.
5. Review the plan before allowing code changes.

## Next Prompt

After reviewing the documentation, ask OpenCode:

```text
Read these files before making any changes:

- docs/project-spec.md
- docs/dashboard-spec.md
- docs/build-plan.md
- docs/project-status.md
- docs/source/daily-planner-mvp-source.md

Do not edit app code or install packages.

First propose the complete contents of an AGENTS.md file for this project.

It must require:
- React, JavaScript, Vite, and regular CSS
- frontend-only development for now
- localStorage for saved data
- no Firebase, authentication, backend, database, external APIs, or extra packages without approval
- plan first before broad changes
- list files before editing
- dashboard-first implementation
- written Markdown specifications as the primary requirements source
- no API keys or secrets in project files

Show me the proposed AGENTS.md only. Wait for my approval before creating it.
```

## Last Session

### Completed

- Created the React/Vite starter project.
- Confirmed `npm install` and `npm run dev` work.
- Created the `docs` structure.
- Added source material and UI references.
- Prepared the project specification, dashboard specification, build plan, and project status documentation.

### Current State

- No Daily Planner app features have been built yet.
- The starter Vite screen still exists.
- The project is ready for `AGENTS.md` creation and a dashboard-only implementation plan.

### Next Exact Step

Review the dashboard specification against the dashboard reference image. Then create `AGENTS.md` and ask OpenCode for a plan only.

### Known Issues

- OpenChamber preview does not work; normal browser testing works.
