# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

블레싱월드 (Blessing World) — a Korean-language marriage-blessing guidance service (세계평화통일가정연합 가정행복국), built as a from-scratch reimplementation of an existing site (`https://blessinghome.lovable.app/`). The reimplementation spec lives in `BlessingWorld_PRD.md` (§0 explains how to use it — sections §3–§9 map to stack/design/layout/data-model/per-page specs/acceptance criteria). A later restructuring plan that supersedes parts of the PRD's IA is `docs/2026-08-26_6축개편_설계.md` ("6축 개편" — reorganizes the site around 6 hubs: 축복의 씨앗/행복의 꽃/사랑의 기술/축복로드맵/축복센터/축복관리자). `legacy/` is a static HTML/CSS/JS snapshot of the *original* site kept only as a scraping reference, not part of the build. `DESIGN.md` documents the design-token source of truth (colors/typography/spacing) that `src/index.css` and `tailwind.config.ts` implement.

When implementing a feature, check the PRD section it corresponds to and check `docs/2026-08-26_6축개편_설계.md` for whether that area was later redesigned — the restructuring doc wins on conflicts.

## Commands

```bash
npm install
npm run dev            # http://localhost:5173
npm run build           # tsc -b && vite build (production)
npm run build:preview   # tsc -b && bundles everything into a single artifact-preview.html
                          # (HashRouter + inlined base64 images) for sharing as a Claude Artifact
npm run lint             # eslint .
npm run preview          # serve the production build locally
```

There is no test runner configured in this repo.

### Environment gotcha (Google Drive sync)

This working directory is expected to live under a Google Drive-synced folder. If `npm install` fails with `EPERM`/`EBADF`/`ENOTEMPTY`, Google Drive's sync client is locking files (node_modules has tens of thousands of small files, which is especially prone to this). Pause Drive sync and retry, or move the project to a non-synced local path — `node_modules`/`dist` are gitignored and don't need to sync anyway.

### Env vars

Copy `.env.example` to `.env` and fill `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` to enable Supabase. Leaving them empty is a supported, intentional state — see "Optional Supabase backend" below.

## Architecture

**Stack**: Vite + React 18 + TypeScript + React Router v6 + TanStack Query + Tailwind + Radix-based UI primitives (`src/components/ui/`) + Supabase. Path alias `@/*` → `src/*`.

### Content vs. lib vs. components/pages

Three-layer separation used consistently across features:

- `src/content/*.ts` — static copy and structured data (page text, nav items, FAQ text, document checklists). Pure data, no logic.
- `src/lib/*.ts` — data-access layer. Each file (e.g. `courses.ts`, `churches.ts`, `stories.ts`, `faq.ts`, `guidance.ts`, `roadmap.ts`, `members.ts`, `siteStats.ts`) implements the same fallback chain: **Supabase table (if configured) → localStorage override → `content/*.ts` default**. This lets every page work with zero backend configured, and lets admin pages "save" changes locally even without Supabase.
- `src/pages/*.tsx` and `src/components/**/*.tsx` — presentation, composed from the above.

When adding a new data-backed feature, follow this pattern rather than calling `supabase` directly from a component.

### Optional Supabase backend

`src/integrations/supabase/client.ts` exports `supabase: SupabaseClient | null` and `isSupabaseConfigured: boolean`. The client is `null` whenever env vars are unset — this is a deliberate, permanent product decision (not a temporary bootstrap state), because this app must run and demo correctly with zero backend. Every Supabase call site must guard on `isSupabaseConfigured`/`supabase` and degrade gracefully (see the lib files above, and `RequireAdmin`/`AuthProvider`).

Known library quirk: the installed `@supabase/supabase-js` version's `.upsert()` types collapse to `never` against this repo's hand-written `Database` type (`src/integrations/supabase/types.ts`); `select`/`delete` are unaffected. The established workaround (see `src/lib/courses.ts`) is a single `as any` cast on the `.upsert()` call with a comment explaining why — don't try to "fix" this by loosening types elsewhere.

Migrations live in `supabase/migrations/`, applied in numeric filename order (`0001_init.sql` … `0017_values_assessment.sql`); there's no migration tool wired up beyond the Supabase CLI/SQL editor. `supabase/functions/purge-guidance-requests/` is an Edge Function scaffold for scheduled PII purging (deploy command in a header comment in that file).

### Auth & authorization

`src/lib/auth.tsx` (`AuthProvider`/`useAuth`) wraps Supabase auth session state plus a `profiles.role` lookup (`user` | `staff` | `admin`). It's a no-op ("always signed out") when Supabase isn't configured, rather than throwing.

- `RequireAuth` (`src/components/auth/`) gates end-user routes (`/mypage`, `/reset-password`) on having a session.
- `RequireAdmin` (`src/components/admin/`) gates `/admin/*` routes on `profile.role` being `staff` or `admin`, and shows distinct states for "Supabase not configured" / "loading" / "not logged in" / "logged in but not staff."

### Routing (`src/App.tsx`)

- All routes except a few small ones are `React.lazy`-loaded per-route — this is intentional (see the comment in `App.tsx`: bundling everything blew past the 200KB gzip budget).
- Two router modes selected by `VITE_USE_HASH_ROUTER` env var: `BrowserRouter` (default, for real deployments with server-side rewrites) vs `HashRouter` (for GitHub Pages and the artifact-preview build, which can't rewrite deep links to `index.html`). Don't assume `BrowserRouter` when writing routing-adjacent code — check both paths.
- HashRouter + Supabase auth redirects conflict (Supabase appends `#access_token=...` which HashRouter misreads as a route). `src/lib/authHashRedirect.ts` runs in `main.tsx` *before* React mounts to intercept and rewrite that hash when in HashRouter mode.
- The site went through an IA restructuring ("6축 개편"): old routes like `/civil-affairs`, `/churches`, `/documents`, `/onboarding`, `/guide/curriculum` are kept as `<Navigate replace>` redirects to their new homes under `/center/*` or `/curriculum` for backwards-compat with bookmarks/search results — don't delete these redirects when touching routing.
- Static assets referenced in `content/*.ts` must be built with `import.meta.env.BASE_URL` prefixed (e.g. `` `${import.meta.env.BASE_URL}image/${file}` ``), never an absolute `/image/...` path — GitHub Pages serves from a `/BlessingWorld/` subpath (`VITE_BASE_PATH`), so an absolute path 404s there even though it works locally.

### Deployment

`.github/workflows/deploy-pages.yml` builds and deploys to GitHub Pages on every push to `main`, forcing `VITE_USE_HASH_ROUTER=true` and `VITE_BASE_PATH=/BlessingWorld/`. Supabase secrets are injected from repo Actions secrets and are allowed to be empty (build still succeeds; Supabase-dependent features just stay disabled per the optional-backend design above).

### Design tokens

`DESIGN.md` frontmatter is the canonical token source (colors, typography scale, spacing, radii). It's implemented as CSS custom properties in `src/index.css` and exposed to Tailwind via `tailwind.config.ts` (e.g. `primary`/`accent` each have `DEFAULT`/`foreground`/`soft`/`deep` variants backed by `hsl(var(--...))`). Fonts: Noto Sans KR for body/UI, Noto Serif KR/Noto Serif for headlines and quotes.
