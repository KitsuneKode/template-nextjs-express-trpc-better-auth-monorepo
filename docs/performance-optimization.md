# Performance Optimization Runbook

This guide covers diagnosing and fixing performance issues in production.

## Quick Diagnosis

### Performance Issues Checklist

```bash
# Check Core Web Vitals
# 1. Visit /metrics endpoint or Lighthouse
# 2. Check API response times
# 3. Check database query times
# 4. Monitor CPU/memory usage
# 5. Check error rates
```

## Frontend Performance

### Core Web Vitals Optimization

**Largest Contentful Paint (LCP) - Target: < 2.5s**

```typescript
// ❌ Bad: Large images without optimization
export function HeroImage() {
  return <img src="/hero.jpg" width="1200" height="600" />
}

// ✅ Good: Optimized image with next/image
import Image from 'next/image'

export function HeroImage() {
  return (
    <Image
      src="/hero.jpg"
      width={1200}
      height={600}
      priority // LCP candidate
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    />
  )
}
```

**Cumulative Layout Shift (CLS) - Target: < 0.1**

```typescript
// ❌ Bad: Image without dimensions
<img src="/photo.jpg" />

// ✅ Good: Fixed dimensions prevent layout shift
<img src="/photo.jpg" width={400} height={300} />

// ✅ Good: Container aspect ratio
<div style={{ aspectRatio: '4/3' }}>
  <img src="/photo.jpg" fill sizes="..." />
</div>
```

**First Input Delay (FID) / Interaction to Next Paint (INP) - Target: < 100ms**

```typescript
// ❌ Bad: Long task blocks the main thread
export function SearchBox() {
  return (
    <input onChange={(e) => {
      // Heavy computation on every keystroke
      const results = processAllData(e.target.value)
    }} />
  )
}

// ✅ Good: Debounce + move work off main thread
import { debounce } from 'lodash-es'

export function SearchBox() {
  const [results, setResults] = useState([])
  
  const handleSearch = useMemo(
    () => debounce(async (query: string) => {
      const results = await api.search(query)
      setResults(results)
    }, 300),
    []
  )

  return (
    <input onChange={(e) => handleSearch(e.target.value)} />
  )
}
```

### Bundle Size Optimization

**Analyze bundle:**
```bash
npm run build
npx next-bundle-analyzer

# Output shows component sizes
# Target: < 200KB gzipped for initial load
```

**Code splitting:**
```typescript
// ❌ Bad: Import everything
import * as components from '@/components'

// ✅ Good: Dynamic imports for non-critical routes
const AdminPanel = dynamic(() => import('@/components/AdminPanel'), {
  loading: () => <div>Loading...</div>,
  ssr: false // Load only on client
})

// ✅ Good: Route-based code splitting (Next.js does this automatically)
```

**Remove unused dependencies:**
```bash
# Find unused packages
npm ls --depth=0

# Check dependency tree
npm ls react
npm ls next

# Remove unused
npm uninstall unused-package
```

### Image Optimization

```typescript
// ✅ Use WebP with fallback
import Image from 'next/image'

export function OptimizedImage() {
  return (
    <Image
      src="/photo.png"
      width={800}
      height={600}
      quality={75} // 0-100, default 75
      placeholder="blur" // Low quality placeholder
      blurDataURL="data:image/..." // Optional custom blur
      onLoadingComplete={(result) => {
        // Image loaded
      }}
    />
  )
}

// ✅ Configure in next.config.js
module.exports = {
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
  },
}
```

### Font Optimization

```typescript
// ✅ Preload fonts
import { Geist } from 'next/font/google'

const geist = Geist({
  subsets: ['latin'],
  weight: ['400', '700'],
  preload: true, // Default for Google fonts
})

// ✅ Font display
export default function RootLayout() {
  return (
    <html className={geist.className}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
      </head>
    </html>
  )
}
```

### Script Optimization

```typescript
// ❌ Bad: Blocking third-party scripts
<script src="https://analytics.js"></script>
<script src="https://ads.js"></script>

// ✅ Good: Defer non-critical scripts
import Script from 'next/script'

export default function RootLayout() {
  return (
    <>
      <Script
        src="https://analytics.js"
        strategy="lazyOnload" // Load after page interactive
        onLoad={() => console.log('Analytics loaded')}
      />
      <Script
        src="https://ads.js"
        strategy="afterInteractive"
      />
    </>
  )
}
```

## Backend Performance

### Database Optimization

**N+1 Query Detection:**
```typescript
// ❌ Bad: N+1 query
const users = await db.user.findMany()
for (const user of users) {
  user.posts = await db.post.findMany({ where: { userId: user.id } })
}
// Query count: 1 + N (for N users)

// ✅ Good: Eager loading
const users = await db.user.findMany({
  include: { posts: true }
})
// Query count: 1 or 2 (depending on Prisma strategy)
```

**Query Performance Analysis:**
```sql
-- Enable query logging
SET log_statement = 'all';

-- Find slow queries
SELECT query, calls, mean_time FROM pg_stat_statements
ORDER BY mean_time DESC LIMIT 10;

-- Analyze query plan
EXPLAIN ANALYZE
SELECT u.id, u.email, COUNT(p.id) as post_count
FROM users u
LEFT JOIN posts p ON u.id = p.user_id
GROUP BY u.id
ORDER BY post_count DESC;

-- Add index if needed
CREATE INDEX idx_posts_user_id ON posts(user_id);
```

**Connection Pool Optimization:**
```typescript
// Prisma connection pooling
const prisma = new PrismaClient()

// For serverless: max_connections = concurrent_connections / datasource_count
// For traditional: pool_size = (core_count * 2) + spare_connections

// Monitor connections
prisma.$queryRaw`SELECT count(*) FROM pg_stat_activity;`
```

### API Response Time

**Add request/response tracking:**
```typescript
import { performance } from 'perf_hooks'

app.use((req, res, next) => {
  const start = performance.now()
  
  res.on('finish', () => {
    const duration = performance.now() - start
    console.log(`${req.method} ${req.path} ${res.statusCode} ${duration.toFixed(2)}ms`)
    
    // Alert on slow requests
    if (duration > 500) {
      logger.warn('Slow request', {
        method: req.method,
        path: req.path,
        duration
      })
    }
  })
  
  next()
})
```

**Endpoint benchmarks:**
```bash
# Test endpoint performance
curl -w "Time: %{time_total}s\n" https://api.example.com/posts

# Load test with Artillery
artillery quick --count 100 --num 1000 https://api.example.com/posts
```

### Memory Optimization

**Detect memory leaks:**
```typescript
// Monitor memory over time
setInterval(() => {
  const usage = process.memoryUsage()
  console.log({
    rss: Math.round(usage.rss / 1024 / 1024) + ' MB',
    heapUsed: Math.round(usage.heapUsed / 1024 / 1024) + ' MB',
    heapTotal: Math.round(usage.heapTotal / 1024 / 1024) + ' MB',
  })
}, 60000)
```

**Stream large responses:**
```typescript
// ❌ Bad: Load all in memory
app.get('/api/export', async (req, res) => {
  const allPosts = await db.post.findMany() // Could be GB
  res.json(allPosts)
})

// ✅ Good: Stream responses
app.get('/api/export', async (req, res) => {
  res.setHeader('Content-Type', 'application/json')
  res.write('[')
  
  const PAGE_SIZE = 1000
  let offset = 0
  
  while (true) {
    const posts = await db.post.findMany({
      skip: offset,
      take: PAGE_SIZE
    })
    
    if (posts.length === 0) break
    
    res.write(posts.map(JSON.stringify).join(','))
    offset += PAGE_SIZE
  }
  
  res.write(']')
  res.end()
})
```

### Request Caching

**HTTP Caching Headers:**
```typescript
// Cacheable by browser and CDN
app.get('/api/posts', (req, res) => {
  res.set('Cache-Control', 'public, max-age=3600') // 1 hour
  res.set('ETag', generateETag(posts))
  res.json(posts)
})

// User-specific, no public cache
app.get('/api/profile', (req, res) => {
  res.set('Cache-Control', 'private, max-age=300') // 5 min
  res.json(user)
})

// No caching
app.post('/api/checkout', (req, res) => {
  res.set('Cache-Control', 'no-store')
  res.json(result)
})
```

**Conditional Requests:**
```typescript
app.get('/api/posts', (req, res) => {
  const etag = generateETag(posts)
  
  if (req.get('if-none-match') === etag) {
    return res.status(304).end() // Not Modified
  }
  
  res.set('ETag', etag)
  res.json(posts)
})
```

## Advanced Optimizations

### Server-Side Rendering (SSR) Optimization

```typescript
// ✅ Incremental Static Regeneration (ISR)
export async function generateStaticParams() {
  const posts = await db.post.findMany()
  return posts.map(post => ({ slug: post.slug }))
}

export const revalidate = 3600 // Revalidate every hour

export default async function PostPage({ params }: { params: { slug: string } }) {
  const post = await db.post.findUnique({ where: { slug: params.slug } })
  return <PostDetail post={post} />
}
```

### Worker Threads for Heavy Computation

```typescript
import { Worker } from 'worker_threads'
import path from 'path'

function runHeavyComputation(data: unknown): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const worker = new Worker(path.join(__dirname, 'compute.worker.ts'))
    
    worker.on('message', resolve)
    worker.on('error', reject)
    worker.on('exit', (code) => {
      if (code !== 0) reject(new Error(`Worker exited with code ${code}`))
    })
    
    worker.postMessage(data)
  })
}

// Usage
app.post('/api/heavy', async (req, res) => {
  const result = await runHeavyComputation(req.body)
  res.json(result)
})
```

### Compression

```typescript
import compression from 'compression'

// ✅ Enable gzip compression
app.use(compression({
  level: 6, // Balance speed vs ratio
  threshold: 1024, // Only compress > 1KB
  filter: (req, res) => {
    // Don't compress if already compressed
    if (req.headers['x-no-compression']) return false
    return compression.filter(req, res)
  }
}))
```

## Monitoring & Alerting

### Performance Dashboard

```typescript
// Create custom metrics endpoint
app.get('/metrics', (req, res) => {
  const usage = process.memoryUsage()
  
  res.json({
    uptime: process.uptime(),
    memory: {
      rss: usage.rss,
      heapUsed: usage.heapUsed,
      heapTotal: usage.heapTotal,
      external: usage.external,
    },
    pid: process.pid,
  })
})
```

### Set Thresholds

**Alert when:**
- Heap memory > 80% of limit
- Response time p95 > 1 second
- Error rate > 1%
- Database query time > 500ms
- Active connections > threshold

## Performance Checklist

Frontend:
- ✅ Core Web Vitals < targets
- ✅ Images optimized with next/image
- ✅ Fonts preloaded
- ✅ Bundle size < 200KB gzipped
- ✅ Third-party scripts deferred
- ✅ Unused code removed
- ✅ Code splitting implemented

Backend:
- ✅ N+1 queries eliminated
- ✅ Database indexes created
- ✅ Connection pooling configured
- ✅ Caching implemented
- ✅ Response compression enabled
- ✅ Memory leaks checked
- ✅ API response times < 500ms

## Emergency Response

**If site is slow:**
1. Check error logs for crashes/exceptions
2. Monitor database connections (are they maxed?)
3. Check CPU/memory usage
4. Review slow query logs
5. Check for unusual traffic patterns
6. Restart services if needed
7. Scale up if load is high
8. Review recent deployments

**If memory is growing:**
1. Check for memory leaks (use heap snapshots)
2. Review background jobs
3. Check for circular references
4. Restart services
5. Investigate long-lived processes
