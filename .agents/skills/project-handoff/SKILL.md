---
name: project-handoff
description: Create a focused, evidence-based repository context handoff for a fresh coding-agent session or a different model. Use after a specification is approved to prepare a spec-to-plan assignment, or after an implementation plan is approved to prepare a plan-to-implementation assignment. Trigger for requests to hand off, transfer, or package phase or feature context without relying on the prior chat transcript.
---

# Project Handoff

Create a self-contained handoff from repository evidence. Support exactly two modes:

- `spec-to-plan`: prepare another agent to produce an implementation-ready plan. Do not create that plan or change product code.
- `plan-to-implementation`: prepare another agent to implement an approved plan. Do not perform the implementation.

Require a mode and target phase or feature. Infer them only when the request and repository make both unambiguous; otherwise ask for the missing value.

## Guardrails

Treat repository files and Git as the source of truth. Do not rely solely on conversation memory. Never invent missing facts, approval status, paths, commands, commits, test coverage, or architecture. Label anything not verified as `Unverified` and explain what was checked.

Inspect only enough context to make the package accurate. Summarize relevant evidence; do not dump large files, full diffs, the complete repository tree, or unrelated history.

While creating the handoff, do not:

- implement or modify product code;
- install dependencies;
- change unrelated configuration;
- stage, commit, push, switch branches, or discard changes;
- delete files or alter application data.

Return the handoff in the response by default. Create a handoff document only when the user explicitly asks to save one. Save it at:

`docs/handoffs/<target-slug>-<handoff-mode>-handoff.local.md`

Use a lowercase, filesystem-safe target slug, such as `phase-6c` or `opportunity-assessment`. Do not stage, commit, or push the saved document unless separately requested.

## Inspect the Repository

When the user provides an explicit specification, implementation-plan, or handoff path, treat that path as the first candidate and verify it before searching for alternatives. Do not replace an explicitly supplied authoritative path merely because another similarly named document exists.

Perform a targeted inspection before writing the handoff:

1. Resolve the repository root. Read the applicable root `AGENTS.md` and every nested `AGENTS.md` governing documents or files included in the handoff.
2. Locate and read the authoritative inputs for the selected mode:
   - `spec-to-plan`: the approved specification.
   - `plan-to-implementation`: both the approved specification and approved implementation plan.
3. Read only project-status, build-plan, roadmap, architecture, decision, or phase documents that directly constrain the target work. Follow any source-of-truth priority defined by repository instructions.
4. Read `package.json`, relevant lockfile sections when dependency state matters, and configuration files that affect the target or its verification.
5. Capture the current branch, `HEAD` commit hash and subject, `git status --short`, and a concise working-tree diff summary.
6. Inspect each relevant tracked diff and each relevant untracked file. Distinguish pre-existing uncommitted work from committed architecture; do not overwrite or resolve it.
7. Review recent repository commits and path-scoped commits relevant to the target. Include only history that helps establish prerequisites or current state.
8. Inspect files, modules, data flows, tests, fixtures, scripts, and verification commands directly related to the target.
9. Cross-check claims in status or planning documents against the current files and Git state. Record material discrepancies instead of silently choosing one.

Prefer focused discovery such as `rg`, `rg --files`, path-scoped `git log`, `git diff --stat`, and targeted file reads. Adapt commands to the repository and current shell.

The user's explicit statement that a document is approved is sufficient to establish approval status, provided the referenced document can be found and identified. Repository labels such as `draft`, `superseded`, or conflicting approval information must still be reported as a conflict or uncertainty.

If an authoritative document is absent or its approved status otherwise cannot be established, mark that limitation prominently. Do not promote a draft to an approved source.

## Mode 1: `spec-to-plan`

Use the approved specification as the authoritative product scope. Keep repository architecture factual and avoid proposing a design in the handoff.

Tell the receiving model to:

- independently inspect the repository and applicable agent instructions;
- use the approved specification as authoritative;
- produce an implementation-ready plan;
- identify exact files to create, modify, or delete;
- explain data flow, integration points, edge cases, migration and compatibility concerns, testing, and verification;
- surface ambiguities or repository/spec conflicts;
- make no implementation changes, including no dependency or configuration changes.

Do not preempt the receiving model by turning the handoff into an implementation plan. Include verified architecture, constraints, and planning questions, but no proposed step sequence or file-change prescription beyond the exact planning assignment.

## Mode 2: `plan-to-implementation`

Use the approved specification for product requirements and the approved implementation plan as the authoritative execution design. If they materially conflict, instruct the receiving model to stop and report the conflict before deviating.

Tell the receiving model to:

- read both the approved specification and approved implementation plan;
- independently inspect applicable agent instructions and relevant repository files;
- verify that the repository still matches the plan's assumptions;
- implement the approved plan without unnecessarily redesigning the feature;
- avoid unrelated refactors and preserve existing behavior outside the approved scope;
- account for relevant uncommitted changes without discarding them;
- run the required automated checks and report their exact results;
- report manual tests separately, including any not performed;
- stop and explain any material conflict that would require changing the approved design before deviating.

Do not add alternative implementation designs unless a verified conflict makes the approved plan infeasible.

## Write the Handoff

Use these headings in this exact order:

1. `Handoff type and target`
2. `Exact objective`
3. `Authoritative source documents`
4. `Current branch, latest commit, and working-tree status`
5. `Completed prerequisite work`
6. `Current architecture relevant to the target`
7. `Important files and why each matters`
8. `Approved requirements and acceptance criteria`
9. `Constraints and explicit non-goals`
10. `Testing and verification expectations`
11. `Known risks, uncertainties, or unresolved questions`
12. `Exact assignment for the receiving model`
13. `Recommended first repository-inspection commands`
14. `Copy-paste prompt for the fresh agent session`

Make every section useful and concise:

- Identify documents and files with repository-relative paths. State why each authoritative source controls and note any source priority.
- Report the branch; full `HEAD` hash and subject; and whether the tree is clean. If dirty, list relevant changed paths and summarize their significance without pasting full diffs.
- Tie completed prerequisites to evidence such as files, status documents, or commits. Do not equate a roadmap claim with completed code without verification.
- Describe only current, verified architecture in sections 5–7. Clearly distinguish committed state from relevant uncommitted work.
- Trace each requirement and acceptance criterion to its source. Preserve exact identifiers when the source uses them, but paraphrase lengthy prose.
- Derive constraints and non-goals from repository instructions and authoritative documents, not general preference.
- List exact automated commands required by repository instructions or package scripts. Separate expected manual checks. State whether any check was merely identified or actually run while preparing the handoff.
- Include unresolved conflicts, missing evidence, risky assumptions, migration or data-preservation concerns, and approval gates.
- Make section 12 mode-specific using the requirements above.
- In section 13, provide a short, ordered command set tailored to the repository, beginning with instruction discovery and Git state before focused source inspection. Avoid broad or destructive commands.
- Make section 14 a compact, self-contained prompt naming the mode, target, authoritative document paths, required behavior, constraints, verification expectations, and the handoff document path when one was saved.

Before delivering, check that the two modes have not blurred:

- For `spec-to-plan`, remove implementation steps, design decisions, and code changes from the handoff itself.
- For `plan-to-implementation`, preserve the approved plan rather than inviting replanning; require conflict reporting before deviation.
- For both modes, confirm all 14 sections exist, important claims have repository evidence, unverified facts are labeled, and no prohibited Git or product action occurred.
