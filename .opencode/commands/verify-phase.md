---
description: Verify an implemented phase without committing or deploying
agent: build
---

# /verify-phase

Verify a completed sub-phase implementation. **Do not modify files, fix failures automatically, install packages, commit, push, deploy, or change environment configuration.**

## Prerequisites

- `$1` must be a non-empty path to the focused specification for the sub-phase being verified.
- If `$1` is missing or empty, stop and ask for the specification path.

## Required Reading

Read these files:

1. `AGENTS.md`
2. `$1` — the focused sub-phase specification
3. Inspect the current `git diff` to understand what changed

## Verification Steps

Run these commands in order and capture all output:

### 1. Build

```
npm run build
```

### 2. Lint

```
npm run lint
```

### 3. Diff Format Check

```
git diff --check
```

### 4. Emulator / Security Rules Tests (conditional)

Only run when the supplied specification explicitly requires it and the relevant npm script or `firebase emulators:exec` command already exists. **Never invent a missing npm script.** If the spec requires Rules tests but the command is not yet wired, report it as a required manual step.

## Report

After running all applicable commands, produce a verification report:

1. **Every command run** — the exact command and its exit status.
2. **Pass/fail status** — one line per command: `PASS` or `FAIL`.
3. **Concise failure details** — the first relevant error line(s) for each failure; do not dump full output unless the user asks.
4. **Whether each failure appears related to the current changes** — distinguish pre-existing failures from new failures introduced by the current diff.
5. **The smallest recommended correction** — one targeted suggestion per failure, without implementing it.
6. **Remaining manual browser checks** — every interaction from the specification that must be manually verified in a normal browser.

## Constraints

- Do **not** modify files or automatically fix failures.
- Do **not** install packages.
- Do **not** commit, push, deploy, merge, or change environment configuration.
- Do **not** broaden scope beyond the supplied specification.