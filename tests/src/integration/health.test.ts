import { describe, it, expect } from 'bun:test'

describe('server health', () => {
  it('loads Express app', async () => {
    const app = await import('@template/server/app')
    expect(app.default).toBeDefined()
  })
})
