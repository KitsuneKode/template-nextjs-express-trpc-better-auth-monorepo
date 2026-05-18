# Arche v3 — Site Redesign Guidelines

For the UI agent building the new face of Arche at `arche.kitsunelabs.xyz`.

---

## Brand

| Key | Value |
|-----|-------|
| Product name | Arche |
| Tagline | The beginning of every project |
| CLI command | `npx arche create my-app` |
| Domain | `arche.kitsunelabs.xyz` |
| Repo | `github.com/kitsunekode/template-nextjs-express-trpc-bettera-auth-monorepo` |
| CLI package | `@arche/create` |

### Design Tokens

```
Background:  neutral-950 (near-black, rich)
Surface:     neutral-900/800 (cards, inputs)
Border:      neutral-800/700 (subtle separation)
Text:        white / neutral-100 (headings), neutral-400 (body)
Accent:     amber-500 (warm, origin/beginning feel)
Code:       sky-300 (on dark), neutral-800 (on light)
Success:    emerald-400
Error:      red-400

Font:       Geist (sans), Geist Mono (code)
Radius:     1rem (cards), 0.625rem (inputs/buttons)
Shadow:     shadow-2xl shadow-black/20 (cards)
```

---

## Pages

### 1. `/` — Landing

**Hero section**
```
Headline: "Arche"
Subhead: "One command. Full-stack TypeScript monorepo. Auth, database, API, frontend — wired and ready."

CTA:
  <TerminalBlock command="npx arche create my-app" />

Three badges below CTA:
  [Fullstack Monorepo] [Better Auth] [tRPC] [Prisma] [Express] [Next.js]
```

**Feature grid** (3×2)
```
Create — "Pick a family. Answer 5 prompts. Get a working monorepo in seconds."
Extend — "Add realtime WebSocket, AI bundles, analytics, or S3 storage post-scaffold."
Type-Safe — "End-to-end types from database schema through tRPC to your frontend."
Auth Ready — "Better Auth with social providers, sessions, and protected routes."
Scale Aware — "Docker Compose, nginx config, GitHub Actions CI — all generated."
Agent-First — "Every project ships with AGENTS.md, CLAUDE.md, and IDE rules files."
```

**Family selector preview** (interactive tabs or static grid)
```
Show 6 most popular families as pills/cards:
  [fullstack] [next] [backend] [polyglot] [rust] [mobile]

Clicking shows what that family includes.
```

### 2. `/families` — Family comparison

Full comparison table. Each row is a family, columns show what ships:

| Family | Frontend | Backend | DB | Auth | tRPC | Docker | CI |
|--------|----------|---------|-----|------|------|--------|----|
| fullstack | Next.js | Express/Hono | Postgres/SQLite/MongoDB | Better Auth | ✓ | ✓ | ✓ |
| next | Next.js | — | — | Optional | — | — | — |
| backend | — | Express/Hono | Postgres/SQLite | — | — | ✓ | ✓ |
| polyglot | Next.js | Go/Rust/Python | — | — | — | — | — |
| rust | — | Rust (Axum) | — | — | — | — | — |
| solana | — | — | — | — | — | — | — |
| mobile | Expo/RN | — | — | — | — | — | — |
| convex | Next.js | Convex | Convex | Convex | — | — | — |
| worker | — | — | — | — | — | — | — |
| lib | — | — | — | — | — | — | — |
| cli | — | — | — | — | — | — | — |

### 3. `/docs` — Quick start

**3-step flow**
```
1. Install    npx arche create my-app --yes
2. Start      cd my-app && bun dev
3. Build      Open http://localhost:3000 — it's running
```

**Stack diagram** (visual)
```
┌─────────────────────────────────────┐
│ apps/web (Next.js)                  │
│  ↑ tRPC client                     │
├─────────────────────────────────────┤
│ packages/trpc (shared routers)      │
│  ↑                                 │
├─────────────────────────────────────┤
│ apps/server (Express)               │
│  ├── Better Auth (/api/auth/*)     │
│  └── tRPC endpoint (/api/trpc)     │
│  ↓                                 │
│ packages/store (Prisma client)      │
└─────────────────────────────────────┘
```

**Command reference table**
```
bun dev               Start all workspaces
bun run build         Production build
bun run lint          Lint all packages
bun run check-types   Type check
bun run db:generate   Generate Prisma client
bun run db:migrate    Run migrations
bun run db:seed       Seed database
bun run repo:doctor   Audit project health
```

### 4. `/examples` — Code snippets

Each example is a tab with description + syntax-highlighted code block.

```
Tab: "tRPC Procedure"
  Shows: router, procedure, protected middleware, input validation

Tab: "Auth Provider"  
  Shows: Better Auth config with Google + GitHub providers

Tab: "Prisma Schema"
  Shows: User, Post, Session models

Tab: "Docker Compose"
  Shows: postgres + redis services

Tab: "Monorepo Structure"
  Shows: tree output of a freshly scaffolded project
```

---

## Components needed

### New (build from scratch)

| Component | Location | Purpose |
|-----------|----------|---------|
| `Hero` | `components/arche/hero.tsx` | Landing hero with terminal block |
| `TerminalBlock` | `components/arche/terminal-block.tsx` | Copyable CLI command display |
| `FeatureGrid` | `components/arche/feature-grid.tsx` | 3×2 feature cards |
| `FamilyTable` | `components/arche/family-table.tsx` | Comparison table with checkmarks |
| `StackDiagram` | `components/arche/stack-diagram.tsx` | Visual monorepo flow |
| `CommandTable` | `components/arche/command-table.tsx` | Reference table |
| `CodeExample` | `components/arche/code-example.tsx` | Tabbed code snippets |
| `NavArche` | `components/shell/nav-arche.tsx` | Minimal nav: logo + Families/Docs/Examples links |
| `FooterArche` | `components/shell/footer-arche.tsx` | GitHub link + credit |

### Keep from existing

| Component | Reason |
|-----------|--------|
| `providers.tsx` | Theme + TRPC provider shell |
| `route-top-loader.tsx` | Navigation progress bar |
| UI primitives (tabs, accordion, button) | shadcn components |

### Remove (template showcase content)

All demo/landing/blog/landing-premium components, sections, and routes. Strip down to the arche-branded site only.

---

## Route map

```
apps/web/app/
├── layout.tsx                    Root layout (NavArche + Providers + FooterArche)
├── page.tsx                      Landing hero
├── families/
│   └── page.tsx                  Family comparison
├── docs/
│   └── page.tsx                  Quick start + commands
└── examples/
    └── page.tsx                  Code examples
```

Remove: `app/demo/`, `app/landing/`, `app/blog/`, `app/contact/`, `app/settings/`, `app/opengraph-image.tsx`, `app/twitter-image.tsx`, `app/social-image.tsx`

Remove: `components/demos/`, `components/landing/`, `components/landing-premium/`, `components/sections/`, `components/ui/animated-gradient.tsx`, `components/ui/code-block.tsx`, `components/ui/feature-card.tsx`, `components/ui/section-wrapper.tsx`, `components/shell/navbar-switcher.tsx`, `components/shell/design-toggle.tsx`, `components/shell/link-pending-indicator.tsx`

Remove: `lib/animations.ts`, `lib/demo-data.ts`, `lib/scroll.ts`, `lib/site-design.ts`, `lib/seo.ts`

---

## Metadata

```ts
export const metadata: Metadata = {
  metadataBase: new URL('https://arche.kitsunelabs.xyz'),
  title: {
    default: 'Arche — The beginning of every project',
    template: '%s | Arche',
  },
  description:
    'Full-stack TypeScript monorepo template. One command to auth, database, API, and frontend. Built with Next.js, Express, Better Auth, Prisma, and tRPC.',
  openGraph: {
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/og-image.png'],
  },
  robots: { index: true, follow: true },
}
```

---

## Implementation order for UI agent

1. **Strip showcase content** — remove demo/landing/blog routes and components
2. **Build shell** — `NavArche`, `FooterArche`, `layout.tsx` with Providers
3. **Build `/` landing** — `Hero`, `TerminalBlock`, `FeatureGrid`
4. **Build `/families`** — `FamilyTable` with all 11 families
5. **Build `/docs`** — `StackDiagram`, `CommandTable`, 3-step flow
6. **Build `/examples`** — `CodeExample` with tabs for each snippet
7. **Update metadata** — title, description, OG images
8. **Test** — `bun dev`, check all routes render, check lighthouse
9. **Replace brand assets** — `public/brand/` logos, og-image.png
