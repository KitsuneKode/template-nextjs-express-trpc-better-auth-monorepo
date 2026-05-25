---
name: Arche Web
description: Dark, sharp-edged project-origin system for scaffold tooling.
colors:
  background: '#050505'
  surface: '#09090b'
  surfaceRaised: '#18181b'
  border: '#27272a'
  text: '#fafafa'
  muted: '#a1a1aa'
  amber: '#f59e0b'
  emerald: '#10b981'
  blue: '#60a5fa'
fonts:
  sans: 'Oxanium'
  serif: 'Merriweather'
  mono: 'Fira Code'
radii:
  base: '0px'
  panel: '0px'
  control: '0px'
---

# Arche Web Design Source

## Intent

Arche should feel like a precise project origin console: direct, dark, modular, and serious. It is
not a generic SaaS landing page. The product promise is faster project starts with truthful
scaffolds, reliable defaults, and agent-readable context.

## Visual Language

Use black and zinc surfaces, hard borders, square geometry, compact uppercase labels, and visible
terminal/workspace language. Accent colors are signals, not decoration: amber means guarded or
needs validation, emerald means verified/ready, blue means data/API flow.

## Typography

Use Oxanium for the product voice, Merriweather only when editorial depth is needed, and Fira Code
for commands, paths, identifiers, status labels, and numbers. Headings should be short, heavy,
uppercase, and balanced. Body text should be plain, precise, and pretty-wrapped.

## Components

Prefer reusable primitives from `apps/web/components/arche/site-primitives.tsx` before creating a
new one-off surface. Public pages should use:

- `SiteShell` and `SiteFrame` for page chrome.
- `HeroBlock`, `StatusPill`, and `SectionHeading` for hierarchy.
- `PrimaryLink` for square CTA links with press feedback.
- `CodePanel` for commands and code-adjacent copy.

## Motion

Motion should clarify hierarchy or state. Use short ease-out transitions, staggered entrance only
for marketing sections, and press feedback at `scale(0.96)`. Do not animate high-frequency command
actions. Respect reduced-motion through the global stylesheet.

## Brand assets

Canonical mark and logo: `apps/web/public/brand/arche-mark.svg`, `arche-logo.svg`.

| Asset                | Location                                                                              | Role                                                                    |
| -------------------- | ------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| Dynamic OG / favicon | `apps/web/app/opengraph-image.tsx`, `icon.tsx`, `apple-icon.tsx`, `twitter-image.tsx` | Primary social + app icons (uses `lib/brand/mark-data-uri.ts` from SVG) |
| Static OG backup     | `apps/web/public/brand/og-image.png`                                                  | Kept on disk for external links; not duplicated in `layout` metadata    |
| Identity board       | `docs/assets/brand/arche-brand-kit.png`                                               | Reference deck (not deployed from `public/`)                            |

React component: `apps/web/components/arche/brand-mark.tsx`.

Palette for marks: background `#050505` / `#09090b`, border `#27272a`, text `#fafafa`,
amber `#f59e0b`, emerald `#10b981`, blue `#60a5fa`.

Future: `bun run brand:export-og` may regenerate static PNG from `/opengraph-image` when dynamic vs static strategy is finalized.

## Content Rules

Never claim production readiness, publication, or remote cache defaults unless the repo verifies it.
Prefer status labels such as `Release guarded`, `Foundation`, `Composable`, and `Source workflow`
until the release and generated-project validation gates are green.
