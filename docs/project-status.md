# Daily Planner App - Current Status

## Current Phase

Phase 6 — Firebase Cloud Edition implementation, verification, and release are
complete. **Final Phase 6D release approval has been granted.** Both v1
localStorage and v2 Firebase Cloud editions are live and independently
preserved.

The accepted v2 release candidate is
`cc7222bf480b4be9703cd19bc9ce0d2c00cbb086` on `main`.

## Release Topology

| Edition | Permanent URL | Branch | Data behavior |
|---|---|---|---|
| v1 localStorage | https://daily-planner-olive-zeta.vercel.app | `release/v1-local` | Browser-local tasks and Quick Ideas; no account or Firebase. |
| v2 cloud | https://daily-planner-v2-seven.vercel.app | `main` | Google Authentication and owner-isolated Firestore tasks and Quick Ideas. |

The v1 URL and its existing browser-local data remain preserved. v2 is a
separate Vercel project and was freshly built from the accepted `main` SHA;
the Preview artifact was not promoted.

## Firebase and Deployment Evidence

- Preview maps only to Development Firebase project `daily-planner-mk-dev`.
- Production maps only to Production Firebase project `daily-planner-mk-prod`.
- Both projects use Google Authentication only, Firestore database `(default)`
  in `northamerica-northeast2`, and Spark/no billing.
- The reviewed Firestore Rules and indexes are deployed to both projects.
  Each deployment has zero composite indexes and four expected field
  overrides.
- The current corrective v2 Production deployment is Ready: dashboard
  reference `GHTLzwhjKJFBMVjYgG23QAiJKyUV`, immutable URL
  https://daily-planner-v2-fdp0rj46k-mazharul-projects.vercel.app.

## Verification Status

Preview against Development Firebase and Production against Production Firebase
passed focused acceptance, including Google sign-in, refresh persistence, new
empty accounts, task and Quick Idea CRUD, account isolation, sign-out cleanup,
responsive smoke checks, and test-record cleanup. Production acceptance also
reconfirmed that v1 stays the local-only edition and preserves existing
browser-local data.

The Production runtime opened the Production Firebase Google Auth flow with
emulator mode disabled. No API-key or unauthorized-domain error was observed.

## Known Limitations

- Firestore offline handling is memory-only; there is no custom persistent
  offline queue or long-duration reconnect guarantee.
- Preview responsive/offline coverage was focused smoke testing, not exhaustive
  cross-browser or real-network interruption testing.
- Two Vercel build-warning indicators were present for the corrective
  Production build, but their details were not visible in the dashboard/build
  log view. The deployment is Ready and no build or runtime failure was
  observed.

## Next Exact Step

Maintain live v1 localStorage and v2 Firebase Cloud editions. Any future work
requires new approved specifications.

## Completed Phase Checklist

| Phase | Description | Status |
|---|---|---|
| 1-5H | Local-first product foundation and polish | Complete |
| 6A | Firebase Foundation and Google Authentication | Complete |
| 6B | Secure Firestore Data Foundation | Complete |
| 6C | Task Cloud Sync | Complete |
| 6D | Quick Ideas, Reliability & Release | Complete |

## Current Constraints

- React + JavaScript + Vite + regular CSS only; no TypeScript, router, UI
  framework, or unapproved package.
- v1 remains localStorage-only and must not connect to Firebase.
- v2 uses Firebase Authentication (Google only) and Cloud Firestore only.
- There is no localStorage task/idea migration to v2. New cloud accounts start
  empty; `dp.theme` and `dp.activeView` stay device-local.
- No API keys or secrets are tracked. `.env` files remain ignored.
- Deferred: global search, recurring tasks, notifications, AI features,
  Reading Tasks, standalone Learning/Reading/Categories pages, and custom
  backend APIs.
