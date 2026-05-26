# Arche blog (MDX)

Posts live in `content/blog/` as `.mdx` files. Fumadocs generates `.source/` on `postinstall` and before `check-types`.

## Frontmatter template

```yaml
---
title: Post title (sentence case)
description: One-line summary for SEO, RSS, and the blog index.
date: '2026-05-26'
category: guide # changelog | guide | technical
draft: false # optional — hidden from index, RSS, and sitemap
author: KitsuneKode # optional
image: /brand/og-image.png # optional — absolute URL or site path; else /blog/[slug]/opengraph-image
tags: # optional
  - presets
  - cli
---
```

## Categories

| `category`  | Use for                         |
| ----------- | ------------------------------- |
| `changelog` | Release notes, breaking changes |
| `guide`     | How-to and onboarding           |
| `technical` | Architecture, tooling           |

## After adding a post

```bash
bun run --cwd apps/web mdx:generate
bun run --cwd apps/web check-types
```

## Routes

- Index: `/blog` (all posts, static)
- Category: `/blog/category/changelog` | `guide` | `technical` (static)
- Post: `/blog/[slug]` (e.g. `/blog/changelog-0-2-1`)
- RSS: `/rss.xml`
- OG image: `/blog/[slug]/opengraph-image` (build-time PNG; legacy fallback `/blog/og?title=…`)

Old `?category=` URLs redirect to `/blog/category/…` via `next.config.js`.
