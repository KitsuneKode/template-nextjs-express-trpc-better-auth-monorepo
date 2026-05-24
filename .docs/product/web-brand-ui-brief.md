# Arche Web Brand/UI Brief

Use this as the source brief for a UI/design agent. Do not load every product
doc by default; load this file plus the web files being edited.

## Product truth

Arche is a personal project-vault and scaffold CLI. It should feel like a sharp
starting point for serious projects, not a generic boilerplate gallery.

Primary promises:

- Start projects fast without repeating setup chores.
- Generate agent-ready context: `AGENTS.md`, `.docs/`, `.plans/`, and
  `arche.json`.
- Support TypeScript monorepos, Rust services, and Solana product foundations.
- Keep support claims honest through the verification matrix.

## Visual direction

Aim for a precise, technical, slightly premium tool identity.

- Avoid "SaaS gradient soup" and generic dashboard cards.
- Prefer strong typography, restrained motion, dark/light surfaces that feel
  engineered, and code/project-structure artifacts that communicate usefulness.
- Arche can have subtle KitsuneKode personality, but the product should read as
  reliable infrastructure first.
- Use the word "vault" carefully: it means a personal launch system and project
  memory, not a secret-storage product.

## Required pages/surfaces

- Home: explain Arche in one screen with a real CLI example and current support
  status.
- Docs/CLI: show preset commands, package-manager stance, and generated context.
- Families/presets: TypeScript, Rust, and Solana should have distinct cards and
  honest validation labels.
- Design lab: keep `__design-lab` hidden, noindexed, and absent from sitemap.

## OG/icon direction

Create an Arche mark that works at favicon size and social-card size.

- Suggested mark language: an arch/gateway, seed/crystal, or precise monogram.
- Avoid fox/mascot-first branding unless it is extremely restrained.
- OG image should say: `Arche`, "Project scaffolds with memory", and a compact
  command like `bunx @arche/create my-app --preset=rust-fullstack`.
- Keep generated image assets source-tracked with a note describing prompt,
  date, and intended usage.

## Handoff checklist for UI agent

1. Read `AGENTS.md`, this brief, `docs/rebranding.md`, and only the web files
   being edited.
2. Audit current `apps/web` routes and assets before designing.
3. Propose a small visual system first: type, color, surfaces, hero structure,
   cards, command blocks, and OG/icon direction.
4. Do not alter CLI behavior or generated-project tests.
5. Keep copy truthful to `.docs/product/verification-matrix.md`.
6. Verify with `bun run build:docs`, `bun run --cwd apps/web check-types`, and
   `bun run --cwd apps/web lint`.
