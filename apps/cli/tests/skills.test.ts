import { describe, expect, it } from 'bun:test'
import { existsSync, mkdtempSync, readFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import {
  buildSkillRecommendations,
  writeSkillConfigs,
  writeCursorRules,
} from '../src/lib/generators/skills'
import type { ProjectConfig } from '../src/types/schemas'

function makeConfig(overrides: Partial<ProjectConfig> = {}): ProjectConfig {
  return {
    projectName: 'test-app',
    destinationDir: '/tmp/test-app',
    family: 'fullstack',
    bundles: ['product'],
    packageManager: 'bun',
    database: 'postgres',
    vectorDatabase: 'none',
    orm: 'prisma',
    backend: 'express-bun',
    runtime: 'bun',
    addons: [],
    example: 'none',
    testing: 'bun',
    deployment: 'vercel-railway',
    includeShowcase: false,
    includeWorker: false,
    includeDocker: true,
    includeCi: true,
    initializeGit: true,
    installDependencies: true,
    presets: [],
    ...overrides,
  }
}

describe('buildSkillRecommendations', () => {
  it('returns non-empty string for fullstack config', () => {
    const result = buildSkillRecommendations(makeConfig())
    expect(result).toBeTruthy()
    expect(result).toContain('next-best-practices')
  })

  it('includes prisma skill when orm is prisma', () => {
    const result = buildSkillRecommendations(makeConfig({ orm: 'prisma' }))
    expect(result).toContain('prisma')
  })

  it('includes drizzle skill when orm is drizzle', () => {
    const result = buildSkillRecommendations(makeConfig({ orm: 'drizzle' }))
    expect(result).toContain('drizzle')
  })

  it('includes vercel-ai-sdk when ai bundle is selected', () => {
    const result = buildSkillRecommendations(makeConfig({ bundles: ['product', 'ai'] }))
    expect(result).toContain('vercel-ai-sdk')
  })

  it('includes supabase skill for postgres database', () => {
    const result = buildSkillRecommendations(makeConfig({ database: 'postgres' }))
    expect(result).toContain('supabase')
  })

  it('returns empty string for simple family without matching skills', () => {
    const result = buildSkillRecommendations(
      makeConfig({ family: 'rust', backend: 'none', database: 'none', orm: 'none', bundles: [] }),
    )
    expect(result).toBe('')
  })
})

describe('writeSkillConfigs', () => {
  it('writes skills.json to .opencode directory', () => {
    const tmpDir = mkdtempSync(join(tmpdir(), 'kitsu-skills-test-'))
    try {
      writeSkillConfigs(tmpDir, makeConfig())
      const skillsPath = join(tmpDir, '.opencode/skills.json')
      expect(existsSync(skillsPath)).toBe(true)
      const content = JSON.parse(readFileSync(skillsPath, 'utf8'))
      expect(content.version).toBe('0.2.0')
      expect(Array.isArray(content.skills)).toBe(true)
      expect(content.skills.length).toBeGreaterThan(0)
      expect(content.skills[0]).toHaveProperty('source')
      expect(content.skills[0]).toHaveProperty('name')
    } finally {
      rmSync(tmpDir, { recursive: true, force: true })
    }
  })

  it('does not write file when no skills match', () => {
    const tmpDir = mkdtempSync(join(tmpdir(), 'kitsu-skills-empty-'))
    try {
      writeSkillConfigs(
        tmpDir,
        makeConfig({ family: 'rust', backend: 'none', database: 'none', orm: 'none', bundles: [] }),
      )
      const skillsPath = join(tmpDir, '.opencode/skills.json')
      expect(existsSync(skillsPath)).toBe(false)
    } finally {
      rmSync(tmpDir, { recursive: true, force: true })
    }
  })

  it('writes only opencode skills by default', () => {
    const tmpDir = mkdtempSync(join(tmpdir(), 'kitsu-skills-agent-'))
    try {
      writeSkillConfigs(tmpDir, makeConfig())
      const content = JSON.parse(readFileSync(join(tmpDir, '.opencode/skills.json'), 'utf8'))
      for (const skill of content.skills) {
        expect(skill.name).toBeTruthy()
      }
    } finally {
      rmSync(tmpDir, { recursive: true, force: true })
    }
  })
})

describe('writeCursorRules', () => {
  it('writes cursor rules for fullstack family', () => {
    const tmpDir = mkdtempSync(join(tmpdir(), 'kitsu-cursor-test-'))
    try {
      writeCursorRules(tmpDir, makeConfig())
      const rulesDir = join(tmpDir, '.cursor/rules')
      expect(existsSync(rulesDir)).toBe(true)
      const files = ['project.mdc', 'database.mdc', 'auth.mdc']
      for (const f of files) {
        expect(existsSync(join(rulesDir, f))).toBe(true)
        const content = readFileSync(join(rulesDir, f), 'utf8')
        expect(content).toContain('description:')
      }
    } finally {
      rmSync(tmpDir, { recursive: true, force: true })
    }
  })

  it('writes fewer rules for simple families', () => {
    const tmpDir = mkdtempSync(join(tmpdir(), 'kitsu-cursor-simple-'))
    try {
      writeCursorRules(
        tmpDir,
        makeConfig({ family: 'cli', database: 'none', orm: 'none', backend: 'none' }),
      )
      const rulesDir = join(tmpDir, '.cursor/rules')
      expect(existsSync(rulesDir)).toBe(true)
      const files = ['project.mdc']
      for (const f of files) {
        expect(existsSync(join(rulesDir, f))).toBe(true)
      }
    } finally {
      rmSync(tmpDir, { recursive: true, force: true })
    }
  })

  it('writes only base project rule for families without backend rules', () => {
    const tmpDir = mkdtempSync(join(tmpdir(), 'kitsu-cursor-none-'))
    try {
      writeCursorRules(
        tmpDir,
        makeConfig({ family: 'rust', backend: 'none', database: 'none', orm: 'none', bundles: [] }),
      )
      const rulesDir = join(tmpDir, '.cursor/rules')
      expect(existsSync(rulesDir)).toBe(true)
      expect(existsSync(join(rulesDir, 'project.mdc'))).toBe(true)
      expect(existsSync(join(rulesDir, 'database.mdc'))).toBe(false)
      expect(existsSync(join(rulesDir, 'auth.mdc'))).toBe(false)
      expect(existsSync(join(rulesDir, 'trpc.mdc'))).toBe(false)
    } finally {
      rmSync(tmpDir, { recursive: true, force: true })
    }
  })
})
