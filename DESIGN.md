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

## Content Rules

Never claim production readiness, publication, or remote cache defaults unless the repo verifies it.
Prefer status labels such as `Release guarded`, `Foundation`, `Composable`, and `Source workflow`
until the release and generated-project validation gates are green.
