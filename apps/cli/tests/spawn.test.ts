import { describe, expect, it } from 'bun:test'
import { runCommand, runCommandWithOutput, tryCommand } from '../src/lib/spawn'

describe('runCommand', () => {
  it('throws for empty command', () => {
    expect(() => runCommand([], { cwd: process.cwd() })).toThrow('Command cannot be empty')
  })

  it('executes simple commands successfully', () => {
    // This should not throw
    expect(() => runCommand(['echo', 'hello'], { cwd: process.cwd(), silent: true })).not.toThrow()
  })

  it('throws when command fails', () => {
    expect(() => runCommand(['false'], { cwd: process.cwd(), silent: true })).toThrow()
  })
})

describe('runCommandWithOutput', () => {
  it('returns command output', () => {
    const output = runCommandWithOutput(['echo', 'hello world'], { cwd: process.cwd() })
    expect(output).toBe('hello world')
  })

  it('throws for empty command', () => {
    expect(() => runCommandWithOutput([], { cwd: process.cwd() })).toThrow(
      'Command cannot be empty',
    )
  })
})

describe('tryCommand', () => {
  it('returns true for successful commands', () => {
    const result = tryCommand(['echo', 'test'], { cwd: process.cwd() })
    expect(result).toBe(true)
  })

  it('returns false for failed commands', () => {
    const result = tryCommand(['false'], { cwd: process.cwd() })
    expect(result).toBe(false)
  })

  it('returns false for non-existent commands', () => {
    const result = tryCommand(['nonexistent-command-12345'], { cwd: process.cwd() })
    expect(result).toBe(false)
  })
})
