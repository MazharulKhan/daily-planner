---
name: firebase-safety
description: Enforce the Daily Planner Phase 6 Firebase security, zero-cost, environment, migration, and production-approval guardrails.
compatibility: opencode
---

# Firebase Safety Skill

This skill enforces the security, billing, migration, environment, and production-approval constraints in the Daily Planner Phase 6 master specification (`docs/phase-6-firebase-cloud-edition-spec.md`). Load this skill during any Phase 6 planning, implementation, or verification task that involves Firebase.

## Billing Protection

- **Spark plan only.** Never attach a billing account or activate a Google Cloud free trial.
- **Never upgrade to Blaze.** Do not navigate to or accept the Blaze upgrade flow in the Firebase Console, CLI, or documentation.
- **Stop immediately** if any required operation, console flow, or CLI command demands billing. Report the blocker to the user and do not work around it by upgrading.
- **Accept quota interruption** rather than enable billing. The free Spark quotas are sufficient for Phase 6 scope.
- Do not enable Firebase Hosting, Storage, Functions, phone auth, Extensions, Analytics, BigQuery export, paid backups, or paid Google Cloud products.

## Allowed Firebase Products

Only these Firebase services are approved for Phase 6:

- **Authentication** — Google provider only. No email/password, anonymous, phone, GitHub, Microsoft, or other identity providers.
- **Cloud Firestore** — `northamerica-northeast2` region. Only paths under `users/{uid}/tasks/` and `users/{uid}/ideas/`.

Everything else is forbidden: no Functions, no Storage, no Hosting, no Extensions, no Analytics, no BigQuery, no paid backups, no paid Google Cloud products.

## Environment and Secret Protection

- **Never commit** real environment values (`.env`, `.env.local`, `.env.production`), service-account files, OAuth secrets, private keys, CLI tokens, or refresh tokens.
- Firebase client `VITE_*` configuration values are **public configuration**, not secrets — but real `.env` files must remain uncommitted.
- Only `.env.example` with placeholders may be committed.
- The `VITE_USE_FIREBASE_EMULATORS` flag controls emulator mode; local development must not contact live Firebase when this flag is set.

## Emulator-First Local Development

- All local Firebase work must use the Auth and Firestore emulators.
- The emulator mode must not contact live Firebase projects.
- Validate emulator connectivity before writing or testing Rules-dependent code.

## Clean Start and Migration Prohibition

The Phase 6 cloud edition is a clean start:

- **Never read, upload, merge, delete, or overwrite** `dp.tasks` or `dp.ideas` from localStorage.
- Existing v1 localStorage data is the local MVP and must remain untouched.
- New cloud accounts start empty — no sample data, no migration, no import.
- The cloud edition may continue using `dp.theme` and `dp.activeView` for device-local preferences only.

## Security Rules

- **Default-deny, owner-only** Security Rules are required before any content cutover to Firestore.
- Rules must require authentication, verify `request.auth.uid == uid`, deny unknown paths, and reject unexpected fields.
- Only user-scoped paths are allowed: `users/{uid}/tasks/{taskId}` and `users/{uid}/ideas/{ideaId}`.
- Rules must enforce immutable `createdAt`, server-timestamp requirements, completion consistency, and playback-only update restrictions.
- Rules tests must pass before any Firestore content persistence goes to production.

## Production Approval Gates

These actions require **explicit user approval** and must not proceed without it:

- Deploying production Security Rules
- Changing production environment values
- Merging the Phase 6 branch to `main`
- Promoting to the production URL
- Replacing or redirecting either the v1 localStorage URL or the v2 cloud URL
- Any billing-related change

## Scope Discipline

- Make the smallest scoped change that satisfies the approved specification.
- Preserve completed v1 localStorage behavior unless the active spec explicitly changes it.
- Do not add unapproved Firebase products, auth providers, or cloud services.
- Do not refactor unrelated code.