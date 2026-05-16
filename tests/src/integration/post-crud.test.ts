import { describe, it, expect } from 'bun:test'

describe('post CRUD integration', () => {
  it('loads tRPC app router', async () => {
    const trpc = await import('@template/trpc')
    expect(trpc.appRouter).toBeDefined()
    expect(trpc.createCaller).toBeDefined()
  })

  it('loads Prisma client', async () => {
    const store = await import('@template/store')
    expect(store.prisma).toBeDefined()
  })
})
