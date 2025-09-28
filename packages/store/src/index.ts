import { PrismaClient } from './generated/client'

export const prisma =
  globalThis.prisma ||
  new PrismaClient({
    // omit: {
    //   user: { password_hash: true },
    // },
  })

declare global {
  var prisma:
    | PrismaClient<{
        // omit: { user: { : true } }
      }>
    | undefined
}

if (process.env.NODE_ENV === 'development') globalThis.prisma = prisma
