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
  it('returns no warnings or errors for default config', () => {
    const result = checkCompatibility({
      database: 'postgres',
      orm: 'prisma',
    })
    expect(result.warnings).toEqual([])
    expect(result.errors).toEqual([])
  })

  it('warns when MongoDB is used with Prisma', () => {
    const result = checkCompatibility({
      database: 'mongodb',
      orm: 'prisma',
    })
    expect(result.warnings.some((w: string) => w.includes('MongoDB'))).toBe(true)
  })

  it('errors when pgvector is used without postgres', () => {
    const result = checkCompatibility({
      database: 'mongodb',
      vectorDatabase: 'pgvector',
    })
    expect(result.errors.some((e: string) => e.includes('pgvector'))).toBe(true)
  })

  it('warns when chat example is used without websocket addon', () => {
    const result = checkCompatibility({
      example: 'chat',
      addons: [],
    })
    expect(result.warnings.some((w: string) => w.includes('WebSocket'))).toBe(true)
  })

  it('errors when Drizzle is used with MongoDB', () => {
    const result = checkCompatibility({
      database: 'mongodb',
      orm: 'drizzle',
    })
    expect(result.errors.some((e: string) => e.includes('Drizzle'))).toBe(true)
  })

  it('errors when Mongoose is used without MongoDB', () => {
    const result = checkCompatibility({
      database: 'postgres',
      orm: 'mongoose',
    })
    expect(result.errors.some((e: string) => e.includes('Mongoose'))).toBe(true)
  })

  it('errors when ORM is set but database is none', () => {
    const result = checkCompatibility({
      database: 'none',
      orm: 'prisma',
    })
    expect(result.errors.some((e: string) => e.includes('requires a database'))).toBe(true)
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
        destinationDir: '/tmp/test-app',
      })
      expect(result.database).toBe('postgres')
      expect(result.orm).toBe('prisma')
      expect(result.backend).toBe('express-bun')
      expect(result.runtime).toBe('bun')
      expect(result.testing).toBe('bun')
      expect(result.deployment).toBe('vercel-railway')
      expect(result.includeShowcase).toBe(false)
      expect(result.includeWorker).toBe(false)
      expect(result.includeDocker).toBe(true)
      expect(result.includeCi).toBe(true)
      expect(result.initializeGit).toBe(true)
      expect(result.installDependencies).toBe(true)
    })
  })
})
