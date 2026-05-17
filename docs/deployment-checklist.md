# Production Deployment Checklist

Use this checklist the first time you deploy to production. It covers security, performance, monitoring, and incident response.

## Pre-Deployment (1-2 hours before)

### Code & Repo

- [ ] All tests pass: `npm run test` ✓
- [ ] Build succeeds: `npm run build` ✓
- [ ] No TypeScript errors: `npm run check-types` ✓
- [ ] No ESLint warnings: `npm run lint` ✓
- [ ] All dependencies are pinned (no `*` or `^` for production packages)
- [ ] Sensitive data not in `.env` file tracked by git
- [ ] `.env.example` is up-to-date with all required variables

### Environment

- [ ] Production `.env` file created with all values (not committed to git)
- [ ] Database URL points to production database
- [ ] `NODE_ENV=production`
- [ ] `NEXT_PUBLIC_API_URL` points to production API (not localhost)
- [ ] All secret keys rotate properly (JWT_SECRET, API keys, etc.)
- [ ] Redis URL set (if using queues/caching)
- [ ] Monitoring credentials set (Sentry DSN, DataDog keys)

### Database

- [ ] Migrations applied: `npx prisma migrate deploy`
- [ ] Database backup exists
- [ ] Connection pooling configured (PgBouncer or Prisma Pool)
- [ ] Indexes created for common queries
- [ ] Database credentials are strong
- [ ] Database accessible from production servers
- [ ] SSL/TLS enforced for database connection

### Secrets & Security

- [ ] No `.env` files in Docker image
- [ ] Secrets loaded from environment at runtime, not baked into code
- [ ] SSH keys for deployments are secured
- [ ] SSL certificate valid for domain
- [ ] CORS configured to allow only frontend domain
- [ ] Rate limiting middleware deployed
- [ ] Helmet.js security headers enabled
- [ ] CSRF protection configured
- [ ] Default passwords/API keys changed

### Domain & DNS

- [ ] Domain registered and points to server
- [ ] DNS propagated (check with `dig`)
- [ ] SSL certificate obtained (Let's Encrypt or purchased)
- [ ] CDN configured (if using)
- [ ] CORS headers configured for CDN domain

---

## Deployment (30 minutes)

### Docker & Container Build

- [ ] Dockerfile uses multi-stage build (dev deps not in production image)
- [ ] Image tagged: `myapp:latest` and `myapp:1.0.0` (version tag)
- [ ] Image size checked (should be < 500MB for Node)
- [ ] Docker build tested locally: `docker build -t myapp:latest . && docker run -it myapp:latest`

### Infrastructure Setup

- [ ] Server/container resources allocated: CPU 2+ cores, RAM 2GB+
- [ ] Persistent volumes mounted for uploads/data (if needed)
- [ ] Logs collected and centralized
- [ ] Load balancer configured (if multiple instances)
- [ ] Health check endpoint working: `GET /health` → 200

### Deployment Strategy

- [ ] Blue-green deployment configured (old version stays running until new is healthy)
- [ ] OR canary deployment configured (% of traffic to new version)
- [ ] OR rolling deployment configured (0 downtime)
- [ ] Rollback plan documented and tested
- [ ] Graceful shutdown implemented (connections drain, jobs finish)
- [ ] Startup script runs migrations if needed (but preferably before deployment)

### Services Started

- [ ] API server started: check `GET /health` returns 200
- [ ] Frontend built and serving: check HTTPS works
- [ ] Worker processes started (if using queues)
- [ ] Redis connected (if using)
- [ ] Database connected (check via API)
- [ ] All services reachable from internet on correct ports

---

## Verification (15 minutes after deployment)

### API Health

- [ ] `GET /health` returns 200
- [ ] `GET /api/trpc/sample.hello` (or similar test endpoint) works
- [ ] Response times acceptable (< 500ms)
- [ ] No 500 errors in logs

### Frontend Health

- [ ] Homepage loads: `curl https://example.com/`
- [ ] Page is interactive (JavaScript loaded)
- [ ] CSS/images loaded correctly
- [ ] Navigation works
- [ ] No console errors in browser

### Authentication Flow

- [ ] Sign up page accessible
- [ ] Can create account
- [ ] Can log in
- [ ] Session persists across page reload
- [ ] Can access protected route (redirected to login if not authenticated)
- [ ] Can log out
- [ ] Logout clears session

### Database

- [ ] Can read from database (check user list from API)
- [ ] Can write to database (create test record)
- [ ] No connection pool exhaustion in logs
- [ ] Query performance acceptable

### Monitoring

- [ ] Sentry configured and capturing errors
- [ ] DataDog agent running (if configured)
- [ ] Logs aggregated and searchable
- [ ] Dashboards accessible

---

## First Week Checks

### Daily

- [ ] No errors from Sentry alerts
- [ ] Error rate < 1% (from logs/monitoring)
- [ ] API response time p95 < 500ms
- [ ] No OOMKilled or crash loops
- [ ] Database disk usage stable

### Performance

- [ ] Core Web Vitals (LCP, FID, CLS) within targets
- [ ] First page load < 3 seconds
- [ ] Database queries < 500ms
- [ ] API responses < 500ms
- [ ] No memory leaks (heap size stable)

### Security

- [ ] No unauthorized access attempts in logs
- [ ] Rate limiting working (test with many requests)
- [ ] CORS not too permissive
- [ ] Security headers present (check with curl -I)
- [ ] SSL certificate valid (check with `openssl s_client`)

### Data

- [ ] Backups running (check backup logs)
- [ ] Can restore from backup (test on staging)
- [ ] Data encrypted in transit (HTTPS) and at rest (if applicable)
- [ ] No sensitive data in logs

---

## Emergency Procedures

**If something goes wrong:**

1. **Is the site still up?**

   ```bash
   curl -I https://example.com
   ```

2. **Check logs immediately**

   ```bash
   tail -f /var/log/app/error.log
   # or
   docker logs <container> --tail 100
   ```

3. **Check monitoring**
   - Sentry.io (errors)
   - DataDog (CPU, memory, requests)
   - Database (connections, queries)

4. **Quick fixes**
   - Restart service: `docker restart api` or `systemctl restart app`
   - Scale up: `kubectl scale deployment api --replicas=5`
   - Enable cache: increase Redis TTL temporarily
   - Circuit breaker: disable external API calls if they're failing

5. **Rollback if needed**

   ```bash
   docker pull myapp:previous-version
   docker stop myapp && docker rm myapp
   docker run -d myapp:previous-version
   ```

6. **Communicate**
   - Post to #incidents channel
   - Update status page
   - Notify on-call engineer
   - Do NOT ignore it

---

## Operational Checklist (Monthly)

- [ ] Review error logs for patterns
- [ ] Check disk usage (clean up old logs if needed)
- [ ] Verify backups are working (test restore)
- [ ] Update dependencies (security patches)
- [ ] Review performance metrics
- [ ] Check SSL certificate expiration (renew 30 days before)
- [ ] Review and adjust monitoring thresholds
- [ ] Test disaster recovery plan
- [ ] Review access logs for suspicious activity
- [ ] Check database fragmentation (run VACUUM)
- [ ] Rotate secrets/API keys
- [ ] Update runbooks based on incidents

---

## Common First-Week Issues

| Issue             | Cause                          | Fix                                        |
| ----------------- | ------------------------------ | ------------------------------------------ |
| Blank page        | Frontend build missing         | `npm run build` in Docker                  |
| 404 on routes     | Wrong API URL in frontend      | Check `NEXT_PUBLIC_API_URL` env var        |
| Login fails       | Database not migrated          | `npx prisma migrate deploy`                |
| High memory       | Memory leak                    | Take heap snapshot, investigate            |
| Slow API          | N+1 queries                    | Add indexes, eager load in queries         |
| Email not sending | External service failing       | Check API keys, test endpoint              |
| Jobs not running  | Redis not connected            | `redis-cli ping`, check REDIS_URL          |
| CORS errors       | Headers not set                | Check `apps/server/src/app.ts` CORS config |
| Uploads failing   | Disk full or permission denied | Check disk space, verify permissions       |
| Workers crashing  | Unhandled exception            | Add error handling, check logs             |

---

## Success Criteria

After deployment, you should be able to check these boxes:

✅ Site accessible at HTTPS
✅ No 5xx errors in first hour
✅ < 1% error rate
✅ Monitoring working and alerting
✅ Backups running
✅ Can reproduce an auth flow start-to-finish
✅ Can create/edit/delete data through UI
✅ SSL certificate valid
✅ Database connections pooled
✅ Graceful shutdown works (kill -TERM doesn't lose data)
✅ Logs centralized and searchable
✅ Incident response plan documented

If all are ✅, you're good.

---

## Next Steps

→ Pick your deployment platform: `deployment-platforms.md`

- Vercel (frontend) / render (backend)
- AWS (EC2, ECS, EKS)
- Heroku
- Self-hosted (Docker Compose)
- Railway, Fly.io, etc.
