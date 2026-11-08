# Debugging LingoLive with ECC

This update used the verification-loop guidance from
[affaan-m/ECC](https://github.com/affaan-m/ECC), reviewed at commit
`d2ef2680594f9a17526a6e1a2e18b3d242c5d17b`.
ECC was used as reference material; its installers, hooks, and global configuration
were not installed or executed.

Relevant reference:
[Verification Loop](https://github.com/affaan-m/ECC/blob/d2ef2680594f9a17526a6e1a2e18b3d242c5d17b/skills/verification-loop/SKILL.md).

## Repeatable checks

```bash
npm ci
npm run build
npm run typecheck
npm run lint
npm test
git diff --check
```

Use `npm run test:postgres` when working on database or payment behavior.
These tests run the actual PostgreSQL SQL and the Drizzle migration runner in
PGlite. The application database boundary is redirected to that isolated database;
Supabase Auth and external payment/translation providers are not contacted.
The older SQLite tests remain useful for application behavior but cannot establish
PostgreSQL compatibility on their own.

For a live VPS with its production configuration, additionally run
`npm run verify:vps` and check authenticated administrator, learner, media,
and payment-provider sandbox flows. Local checks do not establish production acceptance.

## Problems reproduced and fixed

| Problem | Change | Regression evidence |
| --- | --- | --- |
| Account saves, support writes, and several admin operations call `db.batch`, which the Postgres driver does not provide | Execute the existing batch queries sequentially inside a native transaction | PostgreSQL batch commit and rollback tests |
| Native transaction callbacks bypassed the `get`/`all` query compatibility layer | Wrap callback transaction objects with the same adapter | Read helpers and rollback inside a transaction |
| Payment confirmation called D1-only `$client.prepare` / `$client.batch` | Claim pending orders with `UPDATE ... RETURNING` and grant access in one transaction | Duplicate callbacks, failed orders, longer existing access, and rollback after a failed grant |
| Renewal invoices used SQLite scalar `MAX(a,b)` | Use PostgreSQL `GREATEST(a,b)` | Renewal and older invoice delivery tests |
| The access-lockdown migration was absent from the Drizzle journal | Register migration `0001_lock_down_public_tables` | Standard migrator creates tables with RLS enabled and browser roles without table privileges |
| Database rows lost their types at `getDb(): any` | Preserve Drizzle schema types and declare the adapter's read helpers | TypeScript check |
| Upload closure narrowing, stream types, metadata, and worker context had type mismatches | Retain the validated part size and correct the boundary types | TypeScript check and existing upload tests |
| Legacy tests used obsolete Cloudflare environment stubs, omitted a new import, and expected old payment labels | Supply isolated process configuration, wire the transcript helper, and assert the current UI | Full test suite |

The new PostgreSQL tests first reproduced missing batch/transaction helpers,
D1 payment API calls, and the absent journal entry before fixes were applied.
The renewal test also executes the webhook's SQL against PostgreSQL rather than
only inspecting the SQL text.

## Validation for this update

- Production build: passed.
- TypeScript: passed; baseline had 101 errors.
- Lint: passed with 190 existing warnings and zero errors.
- Tests: 21 passed, zero failed, including seven PostgreSQL regression tests.
- Chromium smoke test: production homepage rendered with both primary headings, no uncaught page errors, and anonymous access to the admin users API returned 403.
- Diff whitespace check and targeted private-key/live-Stripe-key scan: passed. This is a focused source check, not a complete security audit.
- Coverage percentage: not established; legacy VM-transpiled tests do not provide a reliable application coverage measurement.
- Production Supabase, VPS storage, and real payment/provider acceptance: not performed; credentials are not configured in this workspace.

The PostgreSQL engine tests use an isolated PGlite process. They validate transactional
behavior and callback replay, but do not measure contention across independent
production database connections or production capacity.
