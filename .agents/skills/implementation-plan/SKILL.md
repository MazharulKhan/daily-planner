---
name: implementation-plan
description: Create and save a repository-grounded, implementation-ready plan from an approved specification. Use when Codex must plan a feature, phase, assessment, migration, integration, or other approved body of work for a later fresh coding-agent session, without implementing in the current session.
---

# Implementation Plan

Create the actual implementation plan from an approved specification and the current repository. Save one self-contained plan for a fresh coding-agent session, then stop without implementing.

## Write Boundary

The only intended write is:

docs/plans/<target-slug>-implementation-plan.local.md

Create docs/plans/ when needed. Update an existing file at that exact path only under the replacement rules below.

Do not:

- modify application code, tests, configuration, the approved specification, or project documentation;
- create an intermediate planning assignment or transfer document;
- install packages or change dependency files;
- run deployment commands or create production resources;
- stage, commit, push, merge, rebase, switch branches, discard changes, or alter application data;
- run builds, tests, emulators, or other implementation verification.

Use read-only repository inspection and validation of the plan file only.

## Resolve the Target and Specification

1. Resolve the repository root and a lowercase filesystem-safe target slug using only letters, digits, and hyphens. Examples: phase-6c, opportunity-assessment, firebase-task-sync.
2. When the user supplies an exact specification path:
   - treat it as the authoritative first candidate;
   - resolve it relative to the repository unless it is absolute;
   - verify that exact file exists;
   - do not substitute a similarly named file;
   - stop with a clear error if it does not exist.
3. When no specification path is supplied, search targeted repository documentation using the target slug, project status, and build plan. If multiple plausible specifications remain, ask the user which one controls.
4. Follow the repository's documented source-of-truth priority. Report conflicts rather than silently choosing a lower-priority source.

## Verify Approval Before Planning

Accept approval established by any of:

- an explicit approved status in the specification;
- explicit user confirmation in the current session;
- another clear repository record that identifies the specification as approved.

User-confirmed approval remains valid when the file status has not yet been updated, unless repository evidence directly conflicts. Report any direct conflict.

If approval is unclear, stop and state the missing evidence. Do not create or update the final plan from an unapproved draft.

## Protect Existing Plans

Use exactly:

docs/plans/<target-slug>-implementation-plan.local.md

Preserve the .local.md suffix. Do not place a new plan elsewhere.

Before writing:

- Check whether the target path exists.
- If the user explicitly requested an update to that exact plan, read it and update it in place.
- Otherwise, read the existing plan, summarize the collision, and require explicit approval before replacing it.
- Never overwrite an existing plan silently.

## Inspect the Repository

Ground the plan in current evidence rather than paraphrasing the specification.

1. Read the root AGENTS.md and any nested instructions governing the specification, plan, or relevant source files.
2. Read the authoritative specification completely.
3. Read only directly relevant project-status, build-plan, architecture, decision, and previous-phase specifications. Follow their source priority.
4. Capture:
   - current branch;
   - full HEAD commit hash and subject;
   - whether the working tree is clean;
   - git status --short and a concise diff summary.
5. Inspect relevant tracked changes and untracked files. Treat existing work as user-owned; do not overwrite, discard, or resolve it.
6. Inspect the current implementation needed to plan accurately, including as applicable:
   - source components, hooks, services, and data flow;
   - existing repositories, converters, schemas, and public APIs;
   - package scripts, relevant dependency state, and configuration;
   - tests, fixtures, emulator setup, and verification commands;
   - recent or path-scoped Git history when it clarifies prerequisites.
7. Reconcile documentation with code. Record outdated assumptions, missing prerequisites, incompatible APIs, dirty-tree overlaps, and other material discrepancies.

Prefer rg, rg --files, git status, git diff --stat, focused diffs, and targeted reads. Avoid broad repository dumps and unrelated history.

## Handle Ambiguity

When an ambiguity materially affects architecture, product behavior, security, privacy, data, migration, or scope:

- do not decide silently;
- explain the alternatives and repository evidence;
- ask the user for a decision;
- do not finalize or save the implementation-ready plan until resolved.

For a minor ambiguity with a clear repository convention, choose the least scope-expanding option and record the assumption in the plan.

## Create the Plan

Derive implementation mechanics from both the approved requirements and verified repository architecture. The plan must be sufficient for a fresh coding-agent session with no access to this conversation.

Use these sections in this order; wording may vary only when equivalent:

1. Plan status
2. Authoritative specification and supporting references
3. Repository baseline
4. Objective
5. Scope and explicit exclusions
6. Current implementation findings
7. Proposed architecture and data flow
8. Ordered implementation stages
9. File-by-file change plan
10. State, error, loading, and edge-case behavior
11. Automated verification
12. Manual verification
13. Risks, assumptions, and unresolved issues
14. Completion criteria

### Required plan quality

- The generated plan must begin with a status of `Draft for review - not approved for implementation`. It becomes implementation-authoritative only after explicit user approval.
- Name the authoritative specification path and explain controlling references.
- Record branch, full baseline commit, commit subject, and clean/dirty working-tree state.
- Summarize relevant pre-existing changes without claiming they belong to the planned work.
- Preserve every binding constraint, approval gate, acceptance criterion, and explicit exclusion.
- Describe verified current architecture before proposing changes.
- Explain proposed data flow, ownership, integration points, sequencing, cleanup, and compatibility where relevant.
- Provide ordered, implementation-ready stages with prerequisites and dependencies.
- Identify exact files when inspection supports them.
- In the file plan, distinguish confirmed changes from likely/conditional changes and state why each file matters.
- Cover loading, pending, success, failure, retry, cleanup, concurrency, accessibility, responsive behavior, and data edge cases when applicable.
- List exact automated commands required by repository instructions or package scripts, but do not run them during planning.
- Separate manual checks from automated verification.
- Surface unresolved issues plainly; never hide them inside implementation steps.
- Avoid merely rewriting the specification or inventing unsupported architecture.

## Save and Validate

1. Write only docs/plans/<target-slug>-implementation-plan.local.md.
2. Read the saved plan completely from beginning to end.
3. Confirm all 14 required sections contain repository-specific content.
4. Confirm the plan records its specification, branch, commit, working-tree state, exact/conditional files, exclusions, verification, risks, and completion criteria.
5. Confirm a fresh agent can implement from the file without hidden conversational context.
6. Run an appropriate Markdown/diff whitespace check. If the plan is untracked, validate it directly because a normal tracked-file diff may omit it.
7. Compare final Git status with the initial status and confirm the plan file is the only intended write.
8. Stop. Do not implement, stage, commit, or push.

## Final Response

After saving the plan, report:

- authoritative specification path;
- saved implementation-plan path;
- branch and baseline commit;
- whether the working tree was clean before planning;
- major repository areas inspected;
- unresolved assumptions, conflicts, or warnings;
- confirmation that no implementation occurred;
- confirmation that nothing was committed or pushed;
- State explicitly that the saved plan still requires user review and approval before implementation.

Do not paste the complete plan unless the user asks.
