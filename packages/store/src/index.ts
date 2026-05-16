import { PrismaClient } from './generated/client'
import { PrismaPg } from '@prisma/adapter-pg'
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
})

const globalForPrisma = global as unknown as {
  prisma: PrismaClient
}

const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter,
    log:
      process.env.NODE_ENV === 'development'
        ? ['query', 'info', 'warn', 'error']
        : ['warn', 'error'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export { prisma }
