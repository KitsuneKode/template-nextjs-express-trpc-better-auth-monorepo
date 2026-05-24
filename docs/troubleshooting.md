# Troubleshooting Guide

Common production issues and how to resolve them.

## Deployment & Startup Issues

### Application Won't Start

**Symptoms:** Server crashes on startup, error in logs

**Diagnosis:**

```bash
# Check error logs
docker logs <container-id>
pm2 logs app

# Check environment variables
printenv | grep NODE_

# Validate configuration
npm run validate-env
```

**Common Causes & Fixes:**

```bash
# Missing .env file
# Fix: Copy .env.example to .env and fill values
cp .env.example .env

# Port already in use
# Fix: Change port or kill process
lsof -i :3000
kill -9 <PID>

# Database connection failed
# Fix: Check DATABASE_URL, ensure DB is running
psql $DATABASE_URL -c "SELECT 1"

# Missing migrations
# Fix: Run migrations
npx prisma migrate deploy
```

### Graceful Shutdown Timeout

**Symptoms:** Process takes too long to shut down, hits kill timeout

**Check graceful shutdown:**

```typescript
// apps/server/src/server.ts
import { setupGracefulShutdown } from '@arche-template/backend-common'

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

setupGracefulShutdown(server, {
  timeout: 30000, // 30 seconds
  onShutdown: async () => {
    // Close database connections
    await prisma.$disconnect()
  },
})
```

**If still timing out:**

```bash
# Find hanging connections
psql $DATABASE_URL -c "SELECT * FROM pg_stat_activity WHERE state != 'idle';"

# Terminate idle connections
psql $DATABASE_URL -c "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE state = 'idle';"
```

## Database Issues

### Database Connection Errors

**Error: `connect ECONNREFUSED`**

```bash
# Check if database is running
docker ps | grep postgres
pg_isready -h localhost -p 5432

# Check connection string
echo $DATABASE_URL

# Verify credentials
psql -U postgres -h localhost
```

**Error: `FATAL: too many connections`**

```typescript
// Reduce connection pool size
const prisma = new PrismaClient({
  __internal: {
    debug: true,
  },
})

// Or use connection pooler
// See docs/scaling-strategies.md - Connection Pooling
```

### Slow Queries

**Diagnosis:**

```sql
-- Show current queries
SELECT pid, usename, application_name, state, query
FROM pg_stat_activity
WHERE state != 'idle';

-- Find slow queries
SELECT query, calls, mean_time, max_time
FROM pg_stat_statements
ORDER BY mean_time DESC LIMIT 10;

-- Analyze query plan
EXPLAIN ANALYZE
SELECT * FROM posts WHERE user_id = 123 ORDER BY created_at DESC LIMIT 10;
```

**Common Fixes:**

```sql
-- Missing index
CREATE INDEX idx_posts_user_id ON posts(user_id);
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);

-- Index on filtered query
CREATE INDEX idx_posts_published ON posts(published)
WHERE published = true;

-- Composite index
CREATE INDEX idx_posts_user_published ON posts(user_id, published);
```

### Database Disk Space

**Check disk usage:**

```sql
-- Database size
SELECT datname, pg_size_pretty(pg_database_size(datname))
FROM pg_database
ORDER BY pg_database_size(datname) DESC;

-- Table size
SELECT schemaname, tablename, pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename))
FROM pg_tables
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

**Clean up:**

```bash
# Remove old backups
rm -rf backups/old-*.dump

# Vacuum database
psql $DATABASE_URL -c "VACUUM ANALYZE;"

# Archive old data to separate table
psql $DATABASE_URL -c "
  CREATE TABLE posts_archive AS
  SELECT * FROM posts WHERE created_at < NOW() - INTERVAL '1 year';
  DELETE FROM posts WHERE created_at < NOW() - INTERVAL '1 year';
"
```

## API & Request Issues

### High Error Rate

**Diagnosis:**

```bash
# Check error logs
grep "ERROR" logs/error.log | tail -50

# Check status codes
grep -o '"status":[0-9]*' logs/access.log | sort | uniq -c

# Check error rates from monitoring
# Sentry: https://sentry.io/
# DataDog: https://app.datadoghq.com/
```

**Common 5xx Errors:**

```typescript
// 500: Unhandled exception
// Fix: Check logs, implement error handling

// 502: Bad Gateway (database offline, upstream crashed)
// Fix: Check database health, restart services

// 503: Service Unavailable (overloaded)
// Fix: Scale up, reduce load, check for leaks
```

### High Latency

**Diagnosis:**

```bash
# Check response times
tail -f logs/access.log | grep -E "duration|time"

# Check with curl
curl -w "@curl-format.txt" -o /dev/null -s https://api.example.com/posts
# See docs/performance-optimization.md for curl-format.txt

# Check from DataDog/Sentry dashboards
```

**Common Causes:**

1. Database query slow → Add indexes, optimize queries
2. External API call slow → Implement caching, timeout
3. Memory leak → Restart service, investigate
4. CPU overloaded → Scale up, optimize code

### Timeouts

**API timeout configuration:**

```typescript
app.use(express.json({ timeout: '10s' }))

// tRPC timeout
router.createCaller(context)

// HTTP timeout
const client = new http.Agent({ keepAliveTimeout: 1000 * 60 * 60 })
```

**Increase if needed:**

```bash
# Nginx upstream timeout
proxy_connect_timeout 60s;
proxy_send_timeout 60s;
proxy_read_timeout 60s;

# AWS ALB timeout
aws elbv2 modify-target-group \
  --target-group-arn arn:aws:elasticloadbalancing:... \
  --deregistration-delay-timeout-seconds 60
```

## Memory & Performance Issues

### Memory Leak

**Symptoms:** Memory usage grows over time, never freed

**Diagnose with heap snapshot:**

```typescript
import heapdump from 'heapdump'

// Take snapshots
app.get('/debug/heap-snapshot', (req, res) => {
  heapdump.writeSnapshot(`./heap-${Date.now()}.heapsnapshot`)
  res.json({ message: 'Snapshot created' })
})

// Take two snapshots 10 minutes apart
// Use Chrome DevTools to compare
```

**Common Causes:**

```typescript
// ❌ Circular references
const obj = { self: null }
obj.self = obj

// ❌ Unbounded cache
const cache = new Map()
router.get('/data/:id', (req, res) => {
  if (!cache.has(req.params.id)) {
    cache.set(req.params.id, fetchData(req.params.id))
  }
  res.json(cache.get(req.params.id))
})

// ✅ Fix: Use LRU cache with limits
import LRU from 'lru-cache'
const cache = new LRU({ max: 1000, ttl: 1000 * 60 * 5 })

// ❌ Event listener accumulation
emitter.on('event', handler)
emitter.on('event', handler) // Memory leak

// ✅ Fix: Always remove listeners
emitter.removeListener('event', handler)
```

### CPU Spike

**Diagnosis:**

```bash
# Check CPU usage
top -p $(pgrep -f "node.*app")

# Find bottleneck
node --prof app.js
node --prof-process isolate-*.log > profile.txt
cat profile.txt | grep -i "overhead\|us\|pc"
```

**Common Causes:**

1. Infinite loop → Fix logic, restart
2. Regex catastrophic backtracking → Simplify regex
3. N+1 queries → Add eager loading
4. Heavy computation on request handler → Move to worker

### Connection Pool Exhaustion

**Symptoms:** Error "sorry, too many clients already", connection timeouts

```sql
-- Check connections
SELECT count(*) FROM pg_stat_activity;
SELECT max_conn FROM pg_settings WHERE name = 'max_connections';

-- Increase if needed
ALTER SYSTEM SET max_connections = 300;
SELECT pg_reload_conf();
```

**Diagnose from app:**

```typescript
app.get('/debug/db-connections', async (req, res) => {
  const result = await prisma.$queryRaw`SELECT count(*) FROM pg_stat_activity;`
  res.json(result)
})
```

## Authentication & Authorization Issues

### Users Can't Login

**Diagnosis:**

```bash
# Check auth service logs
docker logs auth-service
grep ERROR logs/auth.log

# Test auth endpoint
curl -X POST http://localhost:3000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password"}'
```

**Common Issues:**

```typescript
// Better Auth not initialized
// Fix: Check apps/server/src/app.ts has auth route

// Session expired
// Fix: Check session timeout in packages/auth/config.ts

// CORS issue with auth cookie
// Fix: Add proper CORS headers
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
)

// Database migration not run
// Fix: npx prisma migrate deploy
```

### Permission Denied

**Diagnosis:**

```typescript
// Check middleware
app.get('/api/admin', requireAdmin, (req, res) => {
  // ...
})

// Verify user role/permissions
app.get('/debug/session', (req, res) => {
  res.json(req.user) // Check role field
})
```

**Fix:**

```typescript
// Ensure role is set correctly in database
UPDATE users SET role = 'admin' WHERE email = 'admin@example.com';

// Or check authentication flow
// See packages/auth/config.ts for role assignment
```

## File & Storage Issues

### Upload Failures

**Diagnosis:**

```bash
# Check disk space
df -h

# Check file permissions
ls -la /uploads/

# Check upload logs
tail -f logs/upload.log
```

**Common Issues:**

```bash
# No disk space
# Fix: Delete old files or expand disk
rm -rf /uploads/old-*

# Permission denied
# Fix: Change ownership
chown www-data:www-data /uploads/
chmod 755 /uploads/

# Filename issues
# Fix: Sanitize filenames in code
```

## Third-Party Service Failures

### External API Down

**Graceful degradation:**

```typescript
async function getDataWithFallback() {
  try {
    return await externalApi.get('/data')
  } catch (error) {
    logger.error('External API failed', error)
    // Fall back to cache or default
    return getCachedData() || DEFAULT_DATA
  }
}

// Add circuit breaker
import CircuitBreaker from 'opossum'

const breaker = new CircuitBreaker(externalApi.get, {
  timeout: 3000,
  errorThresholdPercentage: 50,
  resetTimeout: 30000,
})
```

### Payment Processing Failures

**Diagnosis:**

```bash
# Check payment service logs
# Stripe: https://dashboard.stripe.com/logs
# Test webhook
curl -X POST http://localhost:3000/api/webhooks/stripe \
  -H "Content-Type: application/json" \
  -d '{"type":"payment_intent.succeeded"}'
```

**Common Fixes:**

```typescript
// Retry logic
async function processPayment(amount: number) {
  for (let i = 0; i < 3; i++) {
    try {
      return await stripe.paymentIntents.create({ amount })
    } catch (error) {
      if (i === 2) throw error
      await sleep(1000 * (i + 1)) // Exponential backoff
    }
  }
}

// Webhook acknowledgment
app.post('/api/webhooks/stripe', (req, res) => {
  // Send 200 immediately
  res.json({ received: true })

  // Process async
  handleStripeEvent(req.body).catch((err) => {
    logger.error('Webhook processing failed', err)
    // Re-queue or alert
  })
})
```

## Monitoring Issues

### Alerts Not Firing

**Check alert configuration:**

```bash
# Sentry: https://sentry.io/ → Settings → Alerts
# DataDog: https://app.datadoghq.com/ → Monitors

# Test alert
# Generate error intentionally
# Trigger high CPU usage
# Monitor for alert notification
```

**Common Issues:**

- Wrong email configured
- Slack webhook invalid
- Threshold set too high
- Sampling rate too low

## Emergency Procedures

### Site Down - Immediate Response

1. **Verify it's actually down:**

   ```bash
   curl -I https://api.example.com
   ping example.com
   ```

2. **Check monitoring:**
   - Sentry: Error spike?
   - DataDog: CPU/memory spike?
   - Database: Responding?
   - External APIs: Status page

3. **Check logs:**

   ```bash
   tail -f logs/error.log
   docker logs <service> --tail 100
   ```

4. **Restart services:**

   ```bash
   docker restart api worker
   systemctl restart node-app
   ```

5. **Scale up if needed:**

   ```bash
   kubectl scale deployment api --replicas=5
   ```

6. **Communicate status:**
   - Update status page
   - Post to incident channel
   - Notify users if needed

### Rollback Deployment

```bash
# Revert to previous version
docker pull api:previous-tag
docker stop api && docker rm api
docker run -d api:previous-tag

# Or
git revert <commit-hash>
git push
# Re-deploy

# Or use blue-green deployment
# Switch traffic back to stable version
```

## Performance Checklist

Production Health:

- ✅ Error rate < 1%
- ✅ API p95 response time < 500ms
- ✅ Memory usage stable
- ✅ CPU usage < 70%
- ✅ Database connections < 50% of max
- ✅ Disk usage < 80%
- ✅ All integrations responding
- ✅ Backups running
- ✅ Logs aggregated
- ✅ Alerts configured

If anything is ❌, investigate immediately.
