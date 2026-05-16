import { describe, it, expect } from 'bun:test'

describe('auth flow integration', () => {
  it('validates project structure has auth package', async () => {
    const { auth } = await import('@template/auth/server')
    expect(auth).toBeDefined()
    expect(typeof auth.api.getSession).toBe('function')
  })

  it('validates auth client is importable', async () => {
    const authClient = await import('@template/auth/client')
    expect(authClient).toBeDefined()
  })
})
