/**
 * Database Best Practices Documentation
 *
 * See packages/store/src/index.ts for actual Prisma client setup.
 */

/**
 * Connection pooling recommendations:
 *
 * For PostgreSQL with Prisma:
 * - Prisma handles connection pooling via the adapter (PrismaPg)
 * - Default connection limit is 10
 * - Set via pool_size parameter in connection string
 *
 * Example with custom pool size:
 * DATABASE_URL="postgresql://user:pass@host:5432/db?schema=public&pool_size=20"
 *
 * For production:
 * - Use Neon, Supabase, or Railway for managed databases
 * - Monitor connection count and adjust pool size
 * - Use read replicas for read-heavy workloads
 * - Enable statement timeout to prevent hanging queries
 *
 * Query Optimization:
 * - Use findUnique() for single lookups (indexed queries)
 * - Use include/select to fetch related data in one query (avoid N+1)
 * - Use pagination for large result sets
 * - Leverage Prisma's automatic query batching
 *
 * Example avoiding N+1 query:
 * GOOD:
 *   const users = await prisma.user.findMany({
 *     include: { posts: true },  // Fetches posts in one query
 *   })
 *
 * BAD:
 *   const users = await prisma.user.findMany()
 *   for (const user of users) {
 *     user.posts = await prisma.post.findMany({ where: { userId: user.id } })
 *   }
 *
 * Health Check:
 * Use `prisma.$queryRaw\`SELECT 1\`` to verify DB connectivity
 */
