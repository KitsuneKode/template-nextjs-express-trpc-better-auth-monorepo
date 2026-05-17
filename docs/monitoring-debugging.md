/\*\*

- Monitoring and Debugging Guide
-
- How to monitor production systems, debug issues, and optimize performance.
  \*/

# Monitoring & Debugging

## Local Development Debugging

### Enable Debug Logging

```bash
# Set log level to debug
LOG_LEVEL=debug bun run dev

# Show all tRPC calls
DEBUG=trpc:* bun run dev

# Show Prisma queries
# Already enabled by default in development
# See packages/store/src/index.ts
```

### Use Browser DevTools

```typescript
// Log performance metrics
import { getMetricStats } from '@template/backend-common/performance'

console.log(getMetricStats('database:query'))
// Output: { count: 42, avg: 12.5, min: 2, max: 145 }
```

### Inspect Network Requests

```typescript
// tRPC calls are normal HTTP requests
// Use browser Network tab to inspect
// Look for calls to /api/trpc/* with detailed request/response
```

## Production Monitoring

### Log Aggregation

For production, send logs to a centralized service:

```typescript
// Example: Sending logs to external service
import { logger } from '@template/backend-common/logger'

// Configure Winston transports to send to:
// - DataDog
// - Sentry
// - New Relic
// - Loggly
// - Sumologic
```

### Performance Monitoring

Track key metrics:

```typescript
import { measureAsync } from '@template/backend-common/performance'

// Automatically tracked:
// - Request latency
// - Database query duration
// - Cache hit rate
// - Worker job duration
```

Services:

- **Sentry** - Error tracking and performance
- **DataDog** - Full observability
- **New Relic** - APM and monitoring
- **Grafana** - Dashboards and alerts

### Uptime Monitoring

```bash
# Health endpoint is available at /health
curl https://api.example.com/health

# Should return:
# { "status": "OK", "database": "connected" }
```

Services:

- UptimeRobot
- Ping (StatusPage)
- Checkly
- Grafana Cloud

### Database Monitoring

Monitor database metrics:

- **Connection pool usage** - Ensure not running out of connections
- **Query performance** - Identify slow queries
- **Disk space** - Prevent running out of storage
- **Replication lag** - Ensure replicas stay in sync

```bash
# PostgreSQL query logs
SELECT query, mean_exec_time, max_exec_time
FROM pg_stat_statements
ORDER BY mean_exec_time DESC
LIMIT 10;

# Check connections
SELECT datname, usename, count(*) FROM pg_stat_activity GROUP BY datname, usename;
```

### Redis Monitoring

```bash
# Check Redis memory usage
redis-cli INFO memory

# Monitor commands
redis-cli MONITOR

# Check queue depth
redis-cli LLEN myqueue
```

## Debugging Common Issues

### High CPU Usage

1. Check slow queries: `SELECT * FROM pg_stat_statements ORDER BY mean_exec_time DESC`
2. Look for N+1 queries: Use `@prisma/client` extensions or query profiling
3. Check worker job count: `redis-cli LLEN bull:*`
4. Profile with: `node --prof app.js` then `node --prof-process isolate-*.log > profile.txt`

### High Memory Usage

1. Check for memory leaks: Use heap dumps
2. Monitor worker queue depth
3. Check database connection count
4. Use `clinic.js` for profiling: `clinic doctor -- bun run start`

### Database Connection Issues

```bash
# Check connection pool
psql -h localhost -U postgres -c "SELECT datname, count(*) FROM pg_stat_activity GROUP BY datname;"

# Increase pool size in DATABASE_URL:
# postgresql://user:pass@host:5432/db?schema=public&pool_size=20
```

### Slow API Endpoints

1. Check database query duration
2. Look for missing indexes
3. Check for unnecessary joins in Prisma queries
4. Consider caching with Redis
5. Use query profiling tools

```typescript
// Add logging to understand bottleneck
import { measureAsync } from '@template/backend-common/performance'

export const myProcedure = publicProcedure
  .input(z.object({ id: z.string() }))
  .query(async ({ input }) => {
    return measureAsync('fetch-user', async () => {
      return await prisma.user.findUnique({ where: { id: input.id } })
    })
  })
```

## Performance Optimization Checklist

- [ ] Database queries indexed appropriately
- [ ] Slow query log enabled and reviewed
- [ ] N+1 queries eliminated (use `prisma.findUnique()` with relations)
- [ ] Caching implemented for frequently accessed data
- [ ] Rate limiting working correctly
- [ ] Compression enabled on responses
- [ ] Static assets have proper cache headers
- [ ] Image optimization enabled (next/image)
- [ ] Bundle size optimized (code splitting)
- [ ] Database connection pooling configured
- [ ] Redis used for session/cache where appropriate
- [ ] Background jobs processing without blocking requests
- [ ] Error rates monitored and alerting configured
- [ ] Load testing performed before production launch
