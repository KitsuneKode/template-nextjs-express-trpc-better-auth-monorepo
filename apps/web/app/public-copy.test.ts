import { describe, expect, it } from 'bun:test'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const appRoot = import.meta.dir

const publicCopyFiles = [
  'layout.tsx',
  'page.tsx',
  'docs/page.tsx',
  'docs/cli/page.tsx',
  'families/page.tsx',
  '../components/arche/animated-terminal.tsx',
  '../components/arche/architecture-graph.tsx',
  '../components/arche/feature-grid.tsx',
  '../components/arche/family-table.tsx',
]

const bannedClaims = [
  'Status: Production Ready',
  'Production Ready',
  'Zero to Production',
  'Next.js 15',
  'remote cache enabled by default',
  'rules for Cursor',
  '11 distinct starter templates',
  '/brand/og-image.png',
]

describe('public website copy', () => {
  it('does not publish stale capability or asset claims', () => {
    const combinedCopy = publicCopyFiles
      .map((file) => readFileSync(join(appRoot, file), 'utf8'))
      .join('\n')

    for (const claim of bannedClaims) {
      expect(combinedCopy).not.toContain(claim)
    }
  })
})
