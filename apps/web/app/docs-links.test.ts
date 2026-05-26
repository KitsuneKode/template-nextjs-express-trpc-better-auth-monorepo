import { describe, expect, it } from 'bun:test'
import fs from 'node:fs'
import path from 'node:path'

import { source } from '@/lib/source'
import meta from '../content/docs/meta.json'

const docsRoot = path.join(import.meta.dir, '../content/docs')

describe('docs IA', () => {
  it('meta.json pages resolve to MDX files or folders', () => {
    const pages = meta.pages.filter((entry) => !entry.startsWith('---'))

    for (const page of pages) {
      const mdxPath = path.join(docsRoot, `${page}.mdx`)
      expect(fs.existsSync(mdxPath)).toBe(true)
    }
  })

  it('fumadocs source includes every meta page', () => {
    const urls = new Set(source.getPages().map((p) => p.url))
    const pages = meta.pages.filter((entry) => !entry.startsWith('---'))

    for (const page of pages) {
      expect(urls.has(`/docs/${page}`)).toBe(true)
    }
  })

  it('internal /docs/ links in MDX point at known routes', () => {
    const urls = new Set(source.getPages().map((p) => p.url))
    const linkPattern = /\]\((\/docs\/[^)]+)\)/g

    const walk = (dir: string) => {
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name)
        if (entry.isDirectory()) walk(full)
        else if (entry.name.endsWith('.mdx')) {
          const content = fs.readFileSync(full, 'utf8')
          for (const match of content.matchAll(linkPattern)) {
            const href = match[1].split('#')[0]
            expect(urls.has(href)).toBe(true)
          }
        }
      }
    }

    walk(docsRoot)
  })
})
