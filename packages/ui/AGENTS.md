# UI Package Notes

## Purpose

`packages/ui` is the shared component and style library used by the web app.

## Read First

- `src/styles/globals.css`
- `src/components`
- `src/lib/utils.ts`
- `components.json`
- `turbo/generators/config.ts`

## Owns

- shared design primitives
- shared icons and form controls
- global Tailwind v4 styles
- shadcn aliases and component generation config

## Common Tasks

- style system changes:
  `src/styles/globals.css`
- shared component changes:
  `src/components/*`
- shadcn alias or generator changes:
  `components.json`, `turbo/generators/config.ts`

## Notes

- `apps/web` imports global styles from `@template/ui/globals.css`.
- This package mixes hand-written shared components with shadcn-oriented setup.

## Update When

Update this file when shared UI exports, global styles, aliases, or generation
workflow change.
