---
description: Create a scoped implementation plan from an approved phase specification
agent: plan
---

# /phase-plan

Create an implementation plan from an approved focused phase specification. **Do not implement, edit files, install packages, deploy, commit, or push.**

## Prerequisites

- `$1` must be a non-empty path to an approved focused specification (e.g. `docs/phase-6a-firebase-foundation-auth-spec.md`).
- If `$1` is missing or empty, stop and ask for the specification path.

## Required Reading

Read these files in order:

1. `AGENTS.md`
2. `docs/project-status.md`
3. `docs/phase-6-firebase-cloud-edition-spec.md` — the approved Phase 6 master specification
4. `$1` — the focused sub-phase specification supplied by the user

If the specification involves Firebase, also load the `firebase-safety` skill before proceeding.

## File Inspection

Inspect **only** the source files relevant to the requested sub-phase. Do not read unrelated components, styles, or docs. Prefer targeted reads and searches over full-directory scans.

## Plan Report

Produce a concise plan report covering:

1. **Scope summary** — what the sub-phase delivers and what it explicitly excludes.
2. **Exact files expected to change** — every file to create, modify, rename, or delete.
3. **Purpose of every file change** — one sentence per file explaining why it changes.
4. **Implementation order** — numbered steps in dependency order.
5. **State and data lifecycle** — how data flows through auth, load, sync, error, and cleanup states.
6. **Packages or configuration involved** — any npm installs, `.env` additions, Vite config changes, or Firebase CLI setup.
7. **Automated tests** — emulator tests, Rules tests, unit tests, or assertions required.
8. **Manual browser checks** — specific interactions to verify in a normal browser.
9. **Risks and ambiguities** — unclear requirements, edge cases, or potential conflicts with the master spec or existing behavior.
10. **Explicit exclusions** — what the plan deliberately leaves for a later sub-phase or future work.

## Constraints

- Make **no edits** to any file.
- Install **nothing** (no packages, no Firebase CLI tools, no dependencies).
- Configure or deploy **nothing** (no Firebase projects, no Vercel, no env changes).
- Commit or push **nothing**.
- Do not proceed to implementation until the plan is reviewed and approved.