# Task 4 Runtime Acceptance Report

Date: 2026-09-18 (Asia/Shanghai)

Status: **PASS_WITH_CONCERNS**

The required web, API, authenticated community/recommendation, admin, media, auth, quiz, and profile checks completed without a source-code change. All required success routes returned HTTP 200/201, and the expected unauthenticated routes returned HTTP 401. Elasticsearch was unavailable during the run and introduced fallback latency; browser-console behavior was not inspected interactively because the brief permits safe HTTP checks or existing local tests.

## Scope and safety

- Worktree: `C:\Users\40683\Desktop\Code\project\youpu\.worktrees\admin-information-architecture`
- Branch: `codex/admin-information-architecture`
- Existing listeners were reused only after read-only process working-directory inspection confirmed ownership by this worktree:
  - port 3000: `apps\web`
  - port 3001: `apps\api`
  - port 3002: `apps\admin`
- No service was restarted and no build ran against a live `.next` directory.
- No source file was changed.
- `ADMIN_TOKEN` was read from the existing local environment file into memory and was not echoed.
- Access and refresh token values were held only in one PowerShell process and were not printed or persisted.
- SMTP credentials and database/Redis/Elasticsearch URLs were not printed.
- Authentication used one unique `codex-baseline-20260918-<random>@example.com` account. The only authenticated write was that account registration plus one recommendation run; no unrelated account or seed record was changed.
- All HTTP calls had bounded timeouts. No endpoint hung and no process required interruption. The final image request used a 10-second timeout.

## Controller/schema inspection

The request paths and payloads were derived from these existing files before calls were made:

- `apps/api/src/health/health.controller.ts`
- `apps/api/src/catalog/catalog.controller.ts`
- `apps/api/src/search/search.controller.ts`
- `apps/api/src/auth/auth.controller.ts`
- `apps/api/src/community/community.controller.ts`
- `apps/api/src/admin/admin.controller.ts`
- `packages/schema/src/auth.ts`
- `packages/schema/src/community.ts`
- `apps/web/src/lib/content.ts`
- `apps/web/src/lib/image-url.ts`
- `apps/web/src/app/api/image-proxy/route.ts`

The recommendation body used `categorySlug: "snowboard"` and the implemented answer shape (`level`, `scene[]`, `weight`, `budget`, `flex`, `priority`).

## Page HTTP acceptance

| Check | Status | Elapsed | Content type | UTF-8 response size |
|---|---:|---:|---|---:|
| Web `/` | 200 | 321 ms | `text/html` | 127,324 B |
| Admin `/` | 200 | 34 ms | `text/html` | 5,963 B |
| Browse `/browse/snowboard` | 200 | 85 ms | `text/html` | 257,327 B |
| Search `/search?q=burton` | 200 | 893 ms | `text/html` | 40,195 B |
| Product `/gear/sb-01` | 200 | 45 ms | `text/html` | 158,358 B |
| Quiz `/quiz` | 200 | 223 ms | `text/html` | 41,100 B |
| Auth `/auth` | 200 | 34 ms | `text/html` | 39,028 B |
| Profile `/me` | 200 | 393 ms | `text/html` | 35,057 B |

All required server-rendered pages returned non-empty HTML. These were safe HTTP checks, not an interactive browser session.

## Public API and authorization boundaries

| Check | Status | Elapsed | Sanitized response shape/result |
|---|---:|---:|---|
| `GET /api/health` | 200 | 1,739 ms initial | `{status, db, redis, es}` |
| health repeat 1 | 200 | 1,219 ms | `status=ok`, `db=true`, `redis=true`, `es=false` |
| health repeat 2 | 200 | 1,213 ms | same |
| health repeat 3 | 200 | 2,006 ms | same |
| `GET /api/products?category=snowboard&page=1&pageSize=3` | 200 | 18 ms | `{items,page,pageSize,total}`, 3 items; first slug `capita-horrorscope-2024` |
| `GET /api/search?q=burton&page=1&pageSize=3` | 200 | 5,089 ms | `{facets,items,page,pageSize,query,sort,total}`, 2 items; first slug `burton-custom-camber-2026` |
| `GET /api/me` without Authorization | **401 expected** | 3 ms | `{error,message,statusCode}` |
| `GET /api/auth/me` without Authorization | **401 expected** | 2 ms | `{error,message,statusCode}` |
| `GET /api/admin/auth/me` without Authorization | **401 expected** | 122 ms | `{error,message,statusCode}` |

Catalog and search returned valid JSON. Search succeeded through its implemented fallback path while Elasticsearch was unavailable.

## Development email authentication and authenticated routes

The email-code response included `devCode`, so no external mailbox was used.

| Check | Status | Elapsed | Sanitized response shape/result |
|---|---:|---:|---|
| `POST /api/auth/email/code` | 201 | 6,672 ms | `{devCode,expiresIn,ok}`; development code present, value not logged |
| `POST /api/auth/register` | 201 | 8,047 ms | account + access/refresh session fields; token values not logged |
| `GET /api/auth/me` | 200 | 5 ms | `{avatarUrl,createdAt,email,id,nickname,riderProfile,role,status}` |
| `GET /api/me` | 200 | 15 ms | `{account,favorites,notifications,ratings,recommendationRuns}`; each collection initially empty |
| `GET /api/me/favorites` | 200 | 6 ms | empty top-level array |
| `GET /api/me/notifications` | 200 | 5 ms | empty top-level array |
| `GET /api/products/burton-custom-camber-2026/ratings` | 200 | 10 ms | `{items,productId,productSlug,summary}`; `items=0` |
| `POST /api/recommendations` | 201 | 15 ms | `{categorySlug,picks}`; `picks=3` |

PowerShell's `ConvertFrom-Json` represents an empty top-level JSON array as no pipeline object; the favorites and notifications responses were therefore recorded as empty arrays rather than object-key shapes.

## Admin API acceptance

No product mutation was needed.

| Check | Status | Elapsed | Sanitized response shape/result |
|---|---:|---:|---|
| `GET /api/admin/auth/me` | 200 | 2 ms | `{authenticated,role}` |
| `GET /api/admin/dashboard` | 200 | 15 ms | `{metrics,recentProducts}`; 5 recent products |
| `GET /api/admin/analytics` | 200 | 5,749 ms | `{daily,eventBreakdown,from,rangeDays,recentEvents,summary,system,to,topPaths,topProducts}`; 14 daily rows, 24 recent events |
| `GET /api/admin/products` | 200 | 15 ms | `{items,page,pageSize,total}`; 20 items |
| `GET /api/admin/moderation/ratings` | 200 | 5 ms | empty array (`[]`, 2-byte body) |
| `GET /api/admin/moderation/reports` | 200 | 5 ms | empty array (`[]`, 2-byte body) |
| `GET /api/admin/audit-logs` | 200 | 7 ms | `{items,page,pageSize,total}`; 0 items |

## Media and fallback acceptance

- Known content image: `data/badminton-racket/yonex-arcsaber-11-pro-2026.yaml` first `images[].url` through `GET /api/image-proxy` returned **200** in **2,001 ms**, `Content-Type: image/webp`, 241,164 bytes.
- An unapproved `example.com` image URL returned **403** in 9 ms, confirming the proxy allowlist boundary.
- An earlier probe accidentally selected the YAML `origin_url` metadata instead of `images[].url`; it completed with 403 in 355 ms and did not hang. The corrected image-field probe above succeeded.
- Focused existing tests were run with:

  `pnpm --filter @youpu/web exec node --import tsx --test src/lib/content.test.ts src/lib/search.test.ts src/lib/image-url.test.ts`

  Result: **14 passed, 0 failed, 0 skipped**, 297.9523 ms. This includes API-content failure fallback to the local content pack, search fallback, no-store API requests, and image URL/proxy allowlisting.

## Concerns and limitations

1. **Elasticsearch unavailable:** health consistently reported `es=false`. The endpoint still reported `status=ok` because DB and Redis were healthy, matching the controller's current definition. This appears to cause the slower search fallback (5,089 ms) and may contribute to analytics latency (5,749 ms).
2. **Health latency:** repeated health calls took 1.2-2.0 seconds while waiting for the bounded Elasticsearch ping. The response is bounded but not especially quick.
3. **Auth setup latency:** development code issuance took 6.7 seconds and registration took 8.0 seconds, although both completed inside the 30-second bound.
4. **Browser limitation:** no interactive browser-console or hydration inspection was performed. The permitted substitute was non-empty HTTP 200 checks for every requested page plus the 14 focused fallback/media tests. Therefore client-only console warnings, layout regressions, and post-hydration interaction issues remain outside this acceptance evidence.
5. **No hanging endpoint:** no HTTP request or browser check was left running. The slowest completed route was registration at 8,047 ms; the last media probe was explicitly bounded to 10 seconds.

## Commands/evidence summary

- Read-only Git/worktree and process ownership checks (`git rev-parse`, `git status --short`, listener PID working-directory inspection).
- Bounded `Invoke-WebRequest` calls for pages and API endpoints, with response bodies reduced to status, elapsed time, content type, top-level keys, and array counts.
- One in-memory development-email registration flow and authenticated route suite.
- Admin calls with an in-memory bearer header loaded without echoing its value.
- One corrected 10-second-bounded live image proxy request.
- Focused Node test run: 14/14 passing.

No commit was created.

## Important Task 4 evidence-gap check

Exact command run from `apps/web` (child process only; 1.15 seconds):

```powershell
cmd.exe /d /c "set NEXT_PUBLIC_CONTENT_SOURCE=api&&set NEXT_PUBLIC_API_BASE=http://127.0.0.1:3999&&pnpm.cmd exec tsx -e `"import React from 'react'; globalThis.React=React; import BrowsePage from './src/app/browse/[slug]/page'; globalThis.fetch=async()=>{throw new Error('simulated API outage')}; (async()=>{ const timer=setTimeout(()=>{throw new Error('check timeout')},14000); try { const page:any=await BrowsePage({params:{slug:'snowboard'}}); const pool=page?.props?.children?.props?.initialPool; if(!Array.isArray(pool)||pool.length===0) throw new Error('initialPool must be a non-empty array'); const marker=pool.find((item:any)=>JSON.stringify(item).includes('Burton')||JSON.stringify(item).includes('Custom Camber')); if(!marker) throw new Error('known local product marker missing'); console.log(JSON.stringify({fallbackItemCount:pool.length,marker:marker.slug||marker.model||marker.brand})); } finally { clearTimeout(timer); } })().catch((error)=>{console.error(error);process.exitCode=1});`""
```

Result: `{"fallbackItemCount":15,"marker":"Custom Camber"}`; exit code 0. The real `BrowsePage` rendered its Suspense child with a non-empty local fallback pool after the simulated API outage. Cleanup: no source, service, or database was changed; the ignored report was appended only, and no commit was created.
