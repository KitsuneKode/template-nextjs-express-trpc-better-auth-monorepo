# CLI Scaffolding — Portfolio-Aware Extension Spec

## Context

This scaffolding CLI (`apps/cli`) bootstraps projects from the monorepo template. This spec describes the planned extension to make scaffolded projects **portfolio-ready** by default — every new project gets the files needed to automatically appear on the KitsuneKode portfolio at `kitsunekode.in`.

## The Portfolio Ecosystem

KitsuneKode's developer ecosystem has interconnected parts:

- **Portfolio** (`kitsunekode.in`) — Next.js 15 + Supabase, hybrid content architecture
- **Learning repos** (`kaitai-*`) — domain-specific deep dives with AI mentor CLAUDE.md files
- **Content pipeline** — Obsidian vault → publish script → portfolio blog
- **This CLI** — scaffolds new projects that are born portfolio-ready

The portfolio syncs project content from GitHub repos via `SHOWCASE.mdx` files. When this CLI scaffolds a project, it should include everything needed for that sync to work.

## What "Portfolio-Ready" Means

Every scaffolded project automatically includes:

### 1. `SHOWCASE.mdx` Template

A pre-filled template at the project root with:

- Frontmatter pre-populated with the project name from CLI input
- Available MDX components documented in comments
- Freeform body sections (Why I Built This, Architecture, etc.)
- Ready to fill in and push — portfolio picks it up via GitHub webhook

The template lives in the `internals` repo at `docs/SHOWCASE-TEMPLATE.mdx`.

### 2. GitHub Webhook Awareness

- Include a note in the project README about the portfolio webhook
- Optionally: GitHub Actions workflow that pings the portfolio's revalidation endpoint when `SHOWCASE.mdx` changes

### 3. Portfolio Metadata in `package.json`

```json
{
  "portfolio": {
    "type": "fullstack",
    "tags": ["next.js", "express", "trpc"],
    "featured": false
  }
}
```

This metadata can be read by the portfolio sync pipeline as a fallback when frontmatter isn't enough.

## Template Types to Support

| Template             | Description                                     | Default Tags                      |
| -------------------- | ----------------------------------------------- | --------------------------------- |
| Monorepo (TurboRepo) | Next.js + Express + tRPC + BetterAuth (current) | next.js, express, trpc, turborepo |
| Standalone Next.js   | Simpler single-app setup                        | next.js, react                    |
| Solana project       | Anchor + Next.js frontend                       | solana, anchor, next.js           |
| AI project           | Python/Node.js backend + Next.js frontend       | ai, next.js                       |
| CLI tool             | Node.js CLI with TypeScript                     | typescript, cli                   |

Each template type should include the `SHOWCASE.mdx` template with type-appropriate default frontmatter (e.g., Solana projects get `type: web3`, AI projects get `type: ai`).

## CLI Flow (Extended)

```
$ kaitai-scaffold my-project

? What type of project?
  ❯ Monorepo (TurboRepo)
    Standalone Next.js
    Solana (Anchor + Next.js)
    AI (Python/Node + Next.js)
    CLI Tool

? Project name: my-project
? Description: A cool thing
? Include portfolio showcase file? (Y/n): Y

Scaffolding my-project...
  ✓ Created project structure
  ✓ Added SHOWCASE.mdx (portfolio-ready)
  ✓ Configured package.json with portfolio metadata
  ✓ Initialized git repo

Done! Next steps:
  1. cd my-project && bun install
  2. Fill in SHOWCASE.mdx when ready to showcase
  3. Push to GitHub — portfolio will auto-sync
```

## Implementation Notes

- The SHOWCASE.mdx template should be copied and have placeholders replaced (project name, type, GitHub URL)
- The CLI should not require the portfolio to be set up — the showcase file is just a markdown file that happens to be portfolio-compatible
- Keep this extension backwards-compatible — existing `template:clean` workflow should still work

## Priority

This extension is LOW priority — after the portfolio v1 ships. The manual SHOWCASE.mdx template works for existing projects now. The CLI automates it for future projects.
