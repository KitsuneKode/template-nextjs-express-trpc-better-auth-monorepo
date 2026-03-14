import {
  validateProjectName,
  checkCompatibility,
  CLIArgsSchema,
  ProjectConfigSchema,
  TestingSchema,
  DeploymentSchema,
  DatabaseSchema,
} from '../src/types/schemas'
import { describe, expect, it } from 'bun:test'

describe('validateProjectName', () => {
  it('accepts valid project names', () => {
    expect(validateProjectName('my-app')).toEqual({ valid: true })
    expect(validateProjectName('cool-project-123')).toEqual({ valid: true })
    expect(validateProjectName('app')).toEqual({ valid: true })
  })

  it('rejects empty names', () => {
    const result = validateProjectName('')
    expect(result.valid).toBe(false)
    expect(result.error).toContain('empty')
  })

  it('rejects names with only special characters', () => {
    const result = validateProjectName('---')
    expect(result.valid).toBe(false)
  })
})

describe('checkCompatibility', () => {
  it('returns no warnings for default config', () => {
    const warnings = checkCompatibility({
      database: 'postgres',
      orm: 'prisma',
    })
    expect(warnings).toEqual([])
  })

  it('warns when MongoDB is used without mongoose', () => {
    const warnings = checkCompatibility({
      database: 'mongodb',
      orm: 'prisma',
    })
    expect(warnings.some((w: string) => w.includes('MongoDB'))).toBe(true)
  })

  it('warns when pgvector is used without postgres', () => {
    const warnings = checkCompatibility({
      database: 'mongodb',
      vectorDatabase: 'pgvector',
    })
    expect(warnings.some((w: string) => w.includes('pgvector'))).toBe(true)
  })

  it('warns when chat example is used without websocket addon', () => {
    const warnings = checkCompatibility({
      example: 'chat',
      addons: [],
    })
    expect(warnings.some((w: string) => w.includes('WebSocket'))).toBe(true)
  })
})

describe('Zod schemas', () => {
  describe('TestingSchema', () => {
    it('accepts valid values', () => {
      expect(TestingSchema.parse('bun')).toBe('bun')
      expect(TestingSchema.parse('none')).toBe('none')
    })

    it('rejects invalid values', () => {
      expect(() => TestingSchema.parse('jest')).toThrow()
    })
  })

  describe('DeploymentSchema', () => {
    it('accepts valid values', () => {
      expect(DeploymentSchema.parse('vercel-railway')).toBe('vercel-railway')
      expect(DeploymentSchema.parse('none')).toBe('none')
    })
  })

  describe('DatabaseSchema', () => {
    it('accepts valid database types', () => {
      expect(DatabaseSchema.parse('postgres')).toBe('postgres')
      expect(DatabaseSchema.parse('mongodb')).toBe('mongodb')
      expect(DatabaseSchema.parse('sqlite')).toBe('sqlite')
      expect(DatabaseSchema.parse('none')).toBe('none')
    })
  })

  describe('CLIArgsSchema', () => {
    it('parses minimal args', () => {
      const result = CLIArgsSchema.parse({})
      expect(result.yes).toBe(false)
      expect(result.help).toBe(false)
      expect(result.version).toBe(false)
    })

    it('parses full args', () => {
      const result = CLIArgsSchema.parse({
        projectName: 'my-app',
        yes: true,
        install: true,
        git: true,
        testing: 'bun',
        deployment: 'vercel-railway',
      })
      expect(result.projectName).toBe('my-app')
      expect(result.yes).toBe(true)
      expect(result.testing).toBe('bun')
    })
  })

  describe('ProjectConfigSchema', () => {
    it('applies defaults correctly', () => {
      const result = ProjectConfigSchema.parse({
        projectName: 'test-app',
      })
      expect(result.database).toBe('postgres')
      expect(result.orm).toBe('prisma')
      expect(result.backend).toBe('express-bun')
      expect(result.runtime).toBe('bun')
      expect(result.testing).toBe('bun')
      expect(result.deployment).toBe('vercel-railway')
      expect(result.includeDocker).toBe(true)
      expect(result.includeCi).toBe(true)
      expect(result.initializeGit).toBe(true)
      expect(result.installDependencies).toBe(true)
    })
  })
})
