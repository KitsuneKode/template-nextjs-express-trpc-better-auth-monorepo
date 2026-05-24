# Arche Web Truth and Design Hardening Plan

> **For agentic workers:** Execute one slice at a time. Read
> `PRODUCT.md` and `.docs/product/web-brand-ui-brief.md` before editing public
> web surfaces. Do not load historical planning documents as current truth.

**Goal:** Turn the current public website into an accurate, distinctive Arche
product surface without allowing visual polish to preserve stale claims.

**Architecture:** Stable product intent lives in `PRODUCT.md`; website-specific
truth and UI guardrails live in `.docs/product/web-brand-ui-brief.md`.
Implementation proceeds from copy correctness to an approved design system,
then landing/docs polish and final accessibility/SEO checks.

**Truth source:** `.docs/product/verification-matrix.md` owns public status
claims until all promoted preset evidence is green.

## Slice Status

| Slice | Purpose                                                   | Status                     |
| ----- | --------------------------------------------------------- | -------------------------- |
| W0    | Repair shared UI lint warnings and establish handoff docs | Complete                   |
| W1    | Correct public copy and metadata drift                    | Ready                      |
| W2    | Approve and encode design system/assets                   | Blocked on visual approval |
| W3    | Rebuild landing hierarchy against approved system         | Pending                    |
| W4    | Bring presets/docs UX in line with registry truth         | Pending                    |
| W5    | Accessibility, responsive, metadata, and build polish     | Pending                    |

## W0: Shared UI and handoff foundation

- [x] Reproduce `packages/ui` accessibility warnings with
      `bun run --cwd packages/ui lint -- --deny-warnings`.
- [x] Make `Label` expose `htmlFor` on its rendered semantic element.
- [x] Remove unnecessary `role="group"` from the generic `Field` wrapper;
      grouped controls use `FieldSet`.
- [x] Add `PRODUCT.md` for durable brand/product truth.
- [x] Expand `.docs/product/web-brand-ui-brief.md` with drift findings, slices,
      agent constraints, and a paste-ready W1 prompt.
- [x] Run verification and commit this foundation slice.

Evidence before commit: initial reproduction used
`bun run --cwd packages/ui lint -- --deny-warnings`; after making strict lint
the package default, `bun run --cwd packages/ui lint` passes with zero
warnings. `bun run ci` passes with 316 tests passing, 3 explicit skips, and
Repo Doctor reporting zero errors or warnings; `bun run build:docs` passes for
the public site.

## W1: Truth before styling

- [ ] Replace unsupported “Production Ready” messaging on the home route.
- [ ] Correct the hero, feature, docs, families, architecture, and metadata
      statements identified in the web brief.
- [ ] Add focused regression checks for claim-bearing text if an appropriate
      web test boundary is introduced.
- [ ] Verify web tests, lint, typecheck, and docs build.
- [ ] Commit as one truthful-copy slice.

## W2: Visual source of truth

- [ ] Audit active pages, global tokens, fonts, old template marks, icons, and
      social metadata assets.
- [ ] Present a compact design-system direction for approval before broad
      styling changes.
- [ ] Write `DESIGN.md` from the approved system only, not from stale mixed
      tokens.
- [ ] Replace old brand assets and add a real OG image before referencing it.
- [ ] Consolidate/remove stale token families after the approved replacement is
      wired.
- [ ] Verify and commit as one brand-system slice.

## W3-W5: Public experience completion

- [ ] Rebuild home hierarchy using the approved system and truthful artifacts.
- [ ] Rebuild families/presets and docs navigation around current registry
      language.
- [ ] Audit keyboard behavior, reduced motion, responsive layouts, contrast,
      metadata, sitemap/robots behavior, and social assets.
- [ ] Verify the full web/repo gate and commit completed slices separately.

## Verification Contract

For web/UI slices:

```bash
bun run --cwd packages/ui lint
bun test apps/web/app/route-discovery.test.ts
bun run --cwd apps/web lint
bun run --cwd apps/web check-types
bun run build:docs
bun run repo:doctor
```

For the final web milestone, additionally run:

```bash
bun run ci
bun run build:affected
```
