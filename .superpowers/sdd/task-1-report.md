# Task 1 Report

## Implementation details

- Added `apps/api/src/health/health-check.ts` with `checkWithTimeout(probe, timeoutMs)` and a 1,000 ms default timeout.
- Rejected probes and timed-out probes return `false`; completed probes preserve their boolean result; the helper does not reject to its caller.
- Updated `HealthController` to wrap only the optional Elasticsearch probe with `checkWithTimeout`.
- Preserved the existing required status semantics: database and Redis alone determine `status`; `es` reports the optional dependency state.
- Added the focused `test:health` script to `apps/api/package.json`.

## Files changed

- `apps/api/src/health/health-check.ts`
- `apps/api/src/health/health-check.test.ts`
- `apps/api/src/health/health.controller.ts`
- `apps/api/package.json`

## TDD evidence

### RED

Command:

```text
node --import tsx --test apps/api/src/health/health-check.test.ts
```

Initial output:

```text
Error [ERR_MODULE_NOT_FOUND]: Cannot find package 'tsx' imported from ...\\admin-information-architecture\\
✖ apps\\api\\src\\health\\health-check.test.ts
exit_code=1
```

Per the brief, `pnpm install` was attempted. Its postinstall failed because Prisma could not rename the Windows query-engine DLL:

```text
EPERM: operation not permitted, rename '...query_engine-windows.dll.node.tmp27076' -> '...query_engine-windows.dll.node'
```

Dependencies were then prepared with `pnpm install --ignore-scripts`. The required test command was rerun before production implementation and failed for the expected missing-module reason:

```text
Error: Cannot find module './health-check'
✖ src\\health\\health-check.test.ts
exit_code=1
```

### GREEN

Commands:

```text
pnpm --filter @youpu/api test:health
pnpm --filter @youpu/schema build
```

Output:

```text
✔ returns false when an optional health probe times out (20.8796ms)
✔ returns false when an optional health probe rejects (0.2104ms)
✔ preserves a successful health probe result (0.0939ms)
ℹ tests 3
ℹ pass 3
ℹ fail 0

> @youpu/schema@0.1.0 build
> tsc -p tsconfig.json

health_exit=0 schema_exit=0
```

Additional verification: `git diff --check` passed.

## Self-review findings

- The timeout timer is cleared in `finally`, including when the probe resolves or rejects first.
- A late probe settlement cannot reject the helper because its rejection is handled in `probeResult`.
- The controller changes only the Elasticsearch branch; DB and Redis checks and status calculation are unchanged.
- The implementation is minimal and matches the requested interface and timeout behavior.

## Concerns

- The ordinary `pnpm install` command remains affected by a Windows Prisma generated-DLL rename `EPERM`. The focused tests and schema build pass after `pnpm install --ignore-scripts`; this does not affect the committed source changes.

## Commit

`66453e158a36d77acaba392897aeed8870d565a6` — `fix: make optional search health checks bounded`

## Evidence-gap follow-up

### Focused HTTP health check

The API was already running on the project endpoint, so no process was started.
Secrets were not printed.

Command: PowerShell `Invoke-WebRequest http://localhost:3001/api/health -TimeoutSec 5` with a stopwatch.

Output:

```text
{"status":200,"elapsed_ms":1252,"body":"{\"status\":\"ok\",\"db\":true,\"redis\":true,\"es\":false}"}
```

Applicability: HTTP status was 200; the response confirms `status=ok`, `db=true`, `redis=true`, and optional `es=false`. The elapsed time was 1252 ms.

### Migration and data validation

Command:

```text
pnpm db:migrate
pnpm --filter @youpu/api validate:data
```

Migration output ended with:

```text
Error: Prisma schema validation - (get-config wasm)
Error code: P1012
error: Environment variable not found: DATABASE_URL.
migrate_exit=1
```

Applicability: `pnpm db:migrate` could not run because this shell has no `DATABASE_URL`; no secret value was exposed. `pnpm --filter @youpu/api validate:data` did run and passed:

```text
类目 7 / 品牌 16 / 产品 50 通过校验
全部通过
validate_exit=0
```

### Focused test rerun

Command: `pnpm --filter @youpu/api test:health`

Output:

```text
✔ returns false when an optional health probe times out (21.2871ms)
✔ returns false when an optional health probe rejects (0.2438ms)
✔ preserves a successful health probe result (0.1369ms)
ℹ tests 3
ℹ pass 3
ℹ fail 0
exit_code=0
```

No implementation source changed for this follow-up; only this report was updated.
