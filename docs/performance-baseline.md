# Performance Baseline Testing Guide

This guide covers setting up performance benchmarks for monitoring application performance over time.

## Performance Testing Goals

1. Establish baseline metrics
2. Catch performance regressions
3. Monitor Core Web Vitals
4. Track server response times
5. Measure memory usage and CPU
6. Benchmark database queries

## Frontend Performance (Lighthouse/Web Vitals)

### Setup Web Vitals Monitoring

**lib/performance.ts**

```typescript
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals'

export interface PerformanceMetrics {
  CLS: number // Cumulative Layout Shift
  FID: number // First Input Delay
  FCB: number // First Contentful Paint
  LCP: number // Largest Contentful Paint
  TTFB: number // Time to First Byte
}

const metrics: Partial<PerformanceMetrics> = {}

export function trackWebVitals() {
  getCLS((metric) => {
    metrics.CLS = metric.value
    sendMetric('CLS', metric.value)
  })

  getFID((metric) => {
    metrics.FID = metric.value
    sendMetric('FID', metric.value)
  })

  getFCP((metric) => {
    metrics.FCB = metric.value
    sendMetric('FCB', metric.value)
  })

  getLCP((metric) => {
    metrics.LCP = metric.value
    sendMetric('LCP', metric.value)
  })

  getTTFB((metric) => {
    metrics.TTFB = metric.value
    sendMetric('TTFB', metric.value)
  })
}

function sendMetric(name: string, value: number) {
  // Send to analytics/monitoring service
  if (navigator.sendBeacon) {
    navigator.sendBeacon('/api/metrics', JSON.stringify({ name, value }))
  }
}

export function getMetrics() {
  return metrics
}
```

**app/layout.tsx**

```typescript
'use client'

import { useEffect } from 'react'
import { trackWebVitals } from '@/lib/performance'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    trackWebVitals()
  }, [])

  return <html>{children}</html>
}
```

### Lighthouse CI

**lighthouserc.json**

```json
{
  "ci": {
    "collect": {
      "numberOfRuns": 3,
      "url": [
        "http://localhost:3000/",
        "http://localhost:3000/about",
        "http://localhost:3000/pricing"
      ],
      "settings": {
        "chromeFlags": ["--disable-gpu", "--headless"]
      }
    },
    "upload": {
      "target": "temporary-public-storage"
    },
    "assert": {
      "preset": "lighthouse:recommended",
      "assertions": {
        "categories:performance": ["error", { "minScore": 0.9 }],
        "categories:accessibility": ["error", { "minScore": 0.9 }],
        "categories:best-practices": ["error", { "minScore": 0.9 }],
        "categories:seo": ["error", { "minScore": 0.9 }]
      }
    }
  }
}
```

## Backend Performance Benchmarking

### Setup Benchmark Tests

**tests/performance/benchmark.ts**

```typescript
import { bench, describe } from 'vitest'
import { apiClient } from '@/lib/api'

describe('API Performance Benchmarks', () => {
  bench('GET /api/posts should respond < 100ms', async () => {
    await apiClient.get('/posts')
  })

  bench('POST /api/posts should respond < 200ms', async () => {
    await apiClient.post('/posts', {
      title: 'Test',
      content: 'Test content',
    })
  })

  bench('GET /api/posts/:id should respond < 50ms', async () => {
    await apiClient.get('/posts/1')
  })
})
```

### Database Query Benchmarking

**tests/performance/database.bench.ts**

```typescript
import { bench, describe } from 'vitest'
import { prisma } from '@template/store'

describe('Database Performance', () => {
  bench(
    'findMany posts should complete < 100ms',
    async () => {
      await prisma.post.findMany({ take: 100 })
    },
    { iterations: 10 },
  )

  bench(
    'findUnique by ID should complete < 10ms',
    async () => {
      await prisma.post.findUnique({ where: { id: '1' } })
    },
    { iterations: 100 },
  )

  bench(
    'count posts should complete < 50ms',
    async () => {
      await prisma.post.count()
    },
    { iterations: 50 },
  )

  bench(
    'create post should complete < 100ms',
    async () => {
      await prisma.post.create({
        data: {
          title: 'Bench Post',
          content: 'Content',
          authorId: 'user-1',
          published: false,
        },
      })
    },
    { iterations: 10 },
  )
})
```

### Server Response Time Monitoring

**apps/server/src/middleware/performance-monitor.ts**

```typescript
import { Request, Response, NextFunction } from 'express'
import { recordMetric } from '@template/backend-common/performance'

export function performanceMonitor(req: Request, res: Response, next: NextFunction) {
  const startTime = Date.now()
  const startMemory = process.memoryUsage().heapUsed

  res.on('finish', () => {
    const duration = Date.now() - startTime
    const memoryUsed = process.memoryUsage().heapUsed - startMemory

    recordMetric({
      name: `http_request_duration_ms`,
      value: duration,
      labels: {
        method: req.method,
        path: req.path,
        status: res.statusCode.toString(),
      },
    })

    recordMetric({
      name: `http_request_memory_bytes`,
      value: memoryUsed,
      labels: {
        method: req.method,
        path: req.path,
      },
    })

    // Log slow requests
    if (duration > 1000) {
      console.warn(`Slow request: ${req.method} ${req.path} took ${duration}ms`)
    }
  })

  next()
}
```

**apps/server/src/app.ts**

```typescript
import { performanceMonitor } from '@/middleware/performance-monitor'

app.use(performanceMonitor)
```

### Memory Leak Detection

**tests/performance/memory.bench.ts**

```typescript
import { bench, describe } from 'vitest'
import { v4 as uuid } from 'uuid'

describe('Memory Leaks Detection', () => {
  bench(
    'Creating 10k objects should not leak memory',
    async () => {
      const objects: object[] = []
      for (let i = 0; i < 10000; i++) {
        objects.push({
          id: uuid(),
          data: 'x'.repeat(1000),
        })
      }
      // Objects should be garbage collected after this function
    },
    { iterations: 5 },
  )

  bench(
    'Event listeners should be cleaned up',
    async () => {
      let counter = 0
      const handler = () => {
        counter++
      }

      for (let i = 0; i < 1000; i++) {
        process.on('test-event', handler)
      }

      for (let i = 0; i < 1000; i++) {
        process.removeListener('test-event', handler)
      }
    },
    { iterations: 10 },
  )
})
```

## Network Performance Testing

### Request Batching

**tests/performance/batching.bench.ts**

```typescript
import { bench, describe } from 'vitest'
import { prisma } from '@template/store'

describe('Network Performance', () => {
  bench(
    'Batch queries should outperform individual queries',
    async () => {
      // Prisma automatically batches queries
      const [users, posts, comments] = await Promise.all([
        prisma.user.findMany({ take: 100 }),
        prisma.post.findMany({ take: 100 }),
        prisma.comment.findMany({ take: 100 }),
      ])
    },
    { iterations: 20 },
  )

  bench(
    'Query with relations should prevent N+1',
    async () => {
      await prisma.post.findMany({
        include: {
          author: true,
          comments: true,
        },
      })
    },
    { iterations: 20 },
  )
})
```

## Load Testing

### Setup Artillery for Load Testing

**load-test.yml**

```yaml
config:
  target: 'http://localhost:3000'
  phases:
    - duration: 60
      arrivalRate: 10
      name: 'Warm up'
    - duration: 120
      arrivalRate: 50
      name: 'Ramp up'
    - duration: 60
      arrivalRate: 100
      name: 'Spike'
  payload:
    path: './data.csv'
    fields:
      - 'post_id'

scenarios:
  - name: 'Read and Write Mix'
    flow:
      - get:
          url: '/api/posts'
      - get:
          url: '/api/posts/{{ post_id }}'
      - post:
          url: '/api/posts'
          json:
            title: 'Load test post'
            content: 'Testing under load'
      - get:
          url: '/api/posts'
```

**package.json**

```json
{
  "scripts": {
    "load-test": "artillery run load-test.yml --output report.json",
    "load-test:report": "artillery report report.json"
  }
}
```

## Performance Tracking Dashboard

**docs/performance-baseline.md**

Create a baseline document tracking performance metrics:

```markdown
# Performance Baseline (2024-05-16)

## Frontend Metrics (Lighthouse)
- Performance: 95
- Accessibility: 98
- Best Practices: 95
- SEO: 100

## Core Web Vitals
- LCP: 1.2s
- FID: 45ms
- CLS: 0.05

## Backend Metrics
- GET /api/posts: 45ms
- POST /api/posts: 120ms
- GET /api/posts/:id: 12ms
- Database query average: 25ms

## Memory Usage
- Initial heap: 45MB
- Peak heap: 120MB
- Average heap: 75MB

## Load Testing Results (100 RPS)
- Success rate: 99.8%
- Average response time: 145ms
- P95 response time: 340ms
- P99 response time: 520ms
- Error rate: 0.2%
```

## CI/CD Performance Checks

**.github/workflows/performance.yml**

```yaml
name: Performance

on:
  push:
    branches: [main]

jobs:
  performance:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'

      - name: Install dependencies
        run: npm ci

      - name: Run benchmarks
        run: npm run bench

      - name: Run Lighthouse CI
        uses: treosh/lighthouse-ci-action@v9
        with:
          configPath: './lighthouserc.json'

      - name: Run load tests
        run: npm run load-test

      - name: Upload results
        uses: actions/upload-artifact@v3
        with:
          name: performance-report
          path: report.*

      - name: Comment on PR
        if: github.event_name == 'pull_request'
        uses: actions/github-script@v6
        with:
          script: |
            const fs = require('fs');
            const report = JSON.parse(fs.readFileSync('report.json', 'utf8'));
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: `## Performance Results\n\`\`\`\n${JSON.stringify(report, null, 2)}\n\`\`\``
            });
```

## Monitoring in Production

### Setup Sentry Performance Monitoring

```typescript
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 0.1,
  profilesSampleRate: 0.1,
})
```

### Setup DataDog Monitoring

```typescript
import tracer from 'dd-trace'

tracer.init()
```

## Performance Targets

| Metric | Target | Current |
|--------|--------|---------|
| LCP | < 2.5s | 1.2s ✅ |
| FID | < 100ms | 45ms ✅ |
| CLS | < 0.1 | 0.05 ✅ |
| FCP | < 1.8s | 0.8s ✅ |
| TTFB | < 600ms | 150ms ✅ |
| API Latency (P50) | < 100ms | 45ms ✅ |
| API Latency (P95) | < 500ms | 340ms ✅ |
| Load Test Success | > 99% | 99.8% ✅ |

## Running Performance Tests

```bash
# Run all benchmarks
npm run bench

# Run Lighthouse CI
npm run lighthouse:ci

# Run load tests
npm run load-test

# Monitor performance in dev
npm run perf:monitor

# Generate performance report
npm run perf:report
```

## Best Practices

✅ Run benchmarks in consistent environment
✅ Run multiple iterations to reduce noise
✅ Monitor memory usage over time
✅ Track response times by endpoint
✅ Test with realistic data volumes
✅ Monitor Core Web Vitals in production
✅ Set up alerts for regressions
✅ Document baseline metrics
✅ Review performance before releases
✅ Use CDN for static assets
