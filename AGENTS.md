<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# booknook_client

## Commands

```bash
npm run dev      # dev server (Turbopack) on http://localhost:3000
npm run lint     # biome check — linter + format check + import organizing
npm run format   # biome format --write (format only)
npx biome check --write   # auto-fix lint AND formatting AND imports
npm run build    # production build; this is the only typecheck (no tsc script)
```

- Biome 2 replaces ESLint + Prettier entirely. `npm run lint` fails on formatting/import-order diffs even when code is correct — fix with `npx biome check --write`, don't argue with it by hand.
- No test framework, no CI, no env vars. Verification = `npm run lint` then `npm run build`.

## Next.js specifics

- App Router in `src/app`. Route-typed helper types like `LayoutProps<"/">` are used per-file (see `layout.tsx`) — don't type props by hand.
- `reactCompiler: true` in `next.config.ts` — don't write `useMemo`, `useCallback`, or `React.memo`; keep components pure and let the compiler handle memoization.
- Tailwind CSS v4 has **no config file**. Theme tokens live in `src/app/globals.css` (`@theme`, `@custom-variant dark`). Tailwind is wired as a Turbopack loader rule in `next.config.ts` — not a PostCSS plugin. Edit the CSS file, not a nonexistent `tailwind.config.ts`.

## shadcn/ui — base-nova style on Base UI, NOT Radix

- `src/components/ui/*` are shadcn CLI-generated (`components.json`, style `base-nova`; `shadcn` is a local dependency, so `npx shadcn add <name>` works). They are currently uncommitted boilerplate.
- Primitives import from `@base-ui/react/*` subpaths (e.g. `@base-ui/react/accordion`) — there is **no `@radix-ui/*` in the deps**. API props differ from Radix.
- `cn` comes from the `"cn"` npm package (re-exported at `@/lib/utils`); existing components import it as `import { cn } from "cn"`. Path alias: `@/*` → `src/*`.

## Repo state

Fresh scaffold: single route `/` (`src/app/page.tsx`), no API routes, no backend in this repo.
