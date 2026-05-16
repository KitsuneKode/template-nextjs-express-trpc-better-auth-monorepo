# Production Monitoring: Sentry & DataDog Setup Guide

This guide covers integrating Sentry for error tracking and DataDog for APM/infrastructure monitoring.

## Overview

**Sentry** - Error tracking and crash reporting
**DataDog** - Full-stack observability (APM, logs, infrastructure)

## Part 1: Sentry Setup

### Installation

```bash
npm install @sentry/nextjs @sentry/node @sentry/trpc
```

### Frontend Setup (Next.js)

**sentry.client.config.ts**

```typescript
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  
  // Performance Monitoring
  tracesSampleRate: 0.1,
  profilesSampleRate: 0.1,
  
  // Release tracking
  release: process.env.NEXT_PUBLIC_RELEASE_VERSION,
  
  // Error filtering
  beforeSend(event, hint) {
    // Filter out specific errors
    if (event.exception) {
      const error = hint.originalException
      if (error instanceof TypeError && error.message.includes('localStorage')) {
        return null // Don't send localStorage errors
      }
    }
    return event
  },

  // Replay
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,

  integrations: [
    new Sentry.Replay({
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],
})
```

**sentry.server.config.ts**

```typescript
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1,
  release: process.env.RELEASE_VERSION,
})
```

**next.config.js**

```javascript
const { withSentryConfig } = require('@sentry/nextjs')

const nextConfig = {
  // Your Next.js config
}

module.exports = withSentryConfig(nextConfig, {
  silent: !process.env.CI,
  org: 'your-org',
  project: 'your-project',
})
```

### Backend Setup (Express)

**packages/backend-common/src/utils/sentry.ts**

```typescript
import * as Sentry from '@sentry/node'
import { nodeProfilingIntegration } from '@sentry/profiling-node'
import { Express, Request, Response, NextFunction } from 'express'

export function initSentry() {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV,
    
    // Profiling
    integrations: [nodeProfilingIntegration()],
    tracesSampleRate: 0.1,
    profilesSampleRate: 0.1,

    // Release
    release: process.env.RELEASE_VERSION,

    // Error filtering
    beforeSend(event, hint) {
      // Filter 404s
      if (event.request?.url?.includes('favicon')) {
        return null
      }
      return event
    },
  })
}

export function sentryMiddleware(app: Express) {
  // RequestHandler
  app.use(Sentry.Handlers.requestHandler())

  // TracingMiddleware
  app.use(Sentry.Handlers.tracingHandler())
}

export function sentryErrorHandler(app: Express) {
  // Error handler
  app.use(Sentry.Handlers.errorHandler())
}

export function captureException(error: Error, context?: Record<string, unknown>) {
  Sentry.captureException(error, {
    extra: context,
  })
}

export function captureMessage(message: string, level: Sentry.SeverityLevel = 'info') {
  Sentry.captureMessage(message, level)
}

export function setUser(userId: string, email?: string, username?: string) {
  Sentry.setUser({
    id: userId,
    email,
    username,
  })
}

export function setTags(tags: Record<string, string>) {
  Object.entries(tags).forEach(([key, value]) => {
    Sentry.setTag(key, value)
  })
}

export function setContext(name: string, context: Record<string, unknown>) {
  Sentry.setContext(name, context)
}
```

**apps/server/src/app.ts**

```typescript
import { sentryMiddleware, sentryErrorHandler } from '@template/backend-common/sentry'

export function createApp(): Express {
  const app = express()

  sentryMiddleware(app)

  // Your routes

  sentryErrorHandler(app)

  return app
}
```

### tRPC Integration

**packages/trpc/src/trpc.ts**

```typescript
import * as Sentry from '@sentry/node'
import { initTRPC, TRPCError } from '@trpc/server'

const t = initTRPC.context<typeof createContext>().create({
  isServer: true,
  isDev: true,
})

export const middleware = t.middleware(async (opts) => {
  const { next, path, type } = opts

  const startTime = Date.now()

  const result = await next()

  const duration = Date.now() - startTime

  if (!result.ok) {
    Sentry.captureException(result.error, {
      extra: {
        path,
        type,
        duration,
      },
    })
  }

  return result
})

export const publicProcedure = t.procedure
export const protectedProcedure = t.procedure.use(middleware)
```

### Error Capture Examples

**Using Sentry in application code:**

```typescript
import { captureException, setUser, setContext } from '@template/backend-common/sentry'

// In auth callback
export async function handleLogin(user: User) {
  setUser(user.id, user.email, user.name)
}

// Capture specific errors
async function criticalOperation() {
  try {
    // Your code
  } catch (error) {
    captureException(error, {
      operation: 'criticalOperation',
      userId: userId,
    })
  }
}

// Add context
setContext('database', {
  connectionPool: 'active',
  queryCount: totalQueries,
})
```

### Source Maps

**Environment variables**

```bash
SENTRY_AUTH_TOKEN=your-auth-token
SENTRY_ORG=your-org
SENTRY_PROJECT=your-project
RELEASE_VERSION=1.0.0
```

**Automatic upload in CI/CD**

```yaml
# .github/workflows/deploy.yml
- name: Upload source maps to Sentry
  uses: getsentry/action-release@v1
  env:
    SENTRY_AUTH_TOKEN: ${{ secrets.SENTRY_AUTH_TOKEN }}
    SENTRY_ORG: your-org
    SENTRY_PROJECT: your-project
  with:
    version: ${{ github.sha }}
    sourcemaps: ./apps/web/.next,./dist
```

## Part 2: DataDog Setup

### Installation

```bash
npm install dd-trace @datadog/browser-rum
```

### Initialize DataDog

**packages/backend-common/src/utils/datadog.ts**

```typescript
import tracer from 'dd-trace'

export function initDatadog() {
  tracer.init({
    service: 'api',
    env: process.env.NODE_ENV,
    version: process.env.RELEASE_VERSION,
    
    // Sampling
    sampler: { 
      rateLimit: 100, // max 100 traces per second
    },

    // Tags
    tags: {
      'service.name': process.env.SERVICE_NAME || 'api',
      'env': process.env.NODE_ENV,
      'version': process.env.RELEASE_VERSION,
    },

    // Hostname
    hostname: process.env.DD_AGENT_HOST || 'localhost',
    port: parseInt(process.env.DD_TRACE_AGENT_PORT || '8126'),
  })

  return tracer
}

export function getTra cer() {
  return tracer
}

export function createSpan(name: string, tags?: Record<string, unknown>) {
  const span = tracer.startSpan(name)
  if (tags) {
    Object.entries(tags).forEach(([key, value]) => {
      span.setTag(key, value)
    })
  }
  return span
}
```

**apps/server/src/server.ts**

```typescript
import { initDatadog } from '@template/backend-common/datadog'

// Initialize DataDog tracing
initDatadog()

// Rest of your server setup
```

### Frontend RUM Setup

**app/layout.tsx**

```typescript
'use client'

import { useEffect } from 'react'
import { datadogRum } from '@datadog/browser-rum'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    datadogRum.init({
      applicationId: process.env.NEXT_PUBLIC_DD_APP_ID!,
      clientToken: process.env.NEXT_PUBLIC_DD_CLIENT_TOKEN!,
      site: 'datadoghq.com',
      service: 'web',
      env: process.env.NODE_ENV,
      version: process.env.NEXT_PUBLIC_RELEASE_VERSION,
      sessionSampleRate: 100,
      sessionReplaySampleRate: 20,
      trackUserInteractions: true,
      trackResources: true,
      trackLongTasks: true,
      defaultPrivacyLevel: 'mask-user-input',
    })

    datadogRum.startSessionReplayRecording()
  }, [])

  return <html>{children}</html>
}
```

### Database Monitoring

**Automatic PostgreSQL tracing:**

```typescript
import tracer from 'dd-trace'
import pg from 'pg'

// DataDog automatically traces pg queries
const client = new pg.Client({
  connectionString: process.env.DATABASE_URL,
})

// Queries will be traced automatically
await client.query('SELECT * FROM users')
```

### Custom Instrumentation

**Trace custom operations:**

```typescript
import { getTracer } from '@template/backend-common/datadog'

const tracer = getTracer()

export async function processPost(postId: string) {
  const span = tracer.startSpan('process_post')
  span.setTag('post_id', postId)

  try {
    const post = await getPost(postId)
    span.setTag('post_title', post.title)

    // Do work
    const result = await complexOperation(post)

    span.setTag('result', 'success')
    return result
  } catch (error) {
    span.setTag('error', true)
    span.setTag('error_message', error instanceof Error ? error.message : 'unknown')
    throw error
  } finally {
    span.finish()
  }
}
```

### Metrics Submission

```typescript
import { getTracer } from '@template/backend-common/datadog'

const tracer = getTracer()

export function recordMetric(name: string, value: number, tags?: Record<string, string>) {
  const dogstatsd = tracer.dogstatsd
  dogstatsd.gauge(name, value, tags)
}

// Usage
recordMetric('api.request.duration', 145, { endpoint: '/posts' })
recordMetric('database.query.time', 25, { table: 'posts' })
```

## Environment Variables

**.env.production**

```bash
# Sentry
NEXT_PUBLIC_SENTRY_DSN=https://your-key@sentry.io/your-project-id
SENTRY_DSN=https://your-key@sentry.io/your-project-id
SENTRY_AUTH_TOKEN=your-auth-token
SENTRY_ORG=your-org
SENTRY_PROJECT=your-project

# DataDog
DD_AGENT_HOST=localhost
DD_TRACE_AGENT_PORT=8126
DD_TRACE_SAMPLE_RATE=0.1
DD_TRACE_ANALYTICS_ENABLED=true

NEXT_PUBLIC_DD_APP_ID=your-app-id
NEXT_PUBLIC_DD_CLIENT_TOKEN=your-client-token
NEXT_PUBLIC_RELEASE_VERSION=1.0.0

# Service
SERVICE_NAME=api
```

## Docker Compose with DataDog Agent

**docker-compose.prod.yml**

```yaml
version: '3.8'

services:
  dd-agent:
    image: gcr.io/datadoghq/agent:latest
    environment:
      DD_API_KEY: ${DD_API_KEY}
      DD_SITE: datadoghq.com
      DD_TRACE_ENABLED: 'true'
      DD_LOGS_ENABLED: 'true'
      DD_PROCESS_AGENT_ENABLED: 'true'
    ports:
      - '8126:8126'
      - '8125:8125/udp'
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock

  api:
    build: .
    environment:
      DD_AGENT_HOST: dd-agent
      DD_TRACE_AGENT_PORT: 8126
      SENTRY_DSN: ${SENTRY_DSN}
    ports:
      - '3000:3000'
    depends_on:
      - dd-agent
```

## Monitoring Dashboards

### Key Metrics to Track

**Backend:**
- Request rate (RPS)
- Error rate
- Response time (p50, p95, p99)
- Database query time
- Memory usage
- CPU usage
- Active database connections

**Frontend:**
- Page load time
- Core Web Vitals
- JavaScript errors
- API call failures
- Session replay

### Creating Dashboards

Both Sentry and DataDog provide built-in dashboards, but you can create custom ones:

**DataDog Custom Dashboard:**
```
1. Go to Dashboards
2. Click "New Dashboard"
3. Add widgets for:
   - Request rate graph
   - Error rate
   - Response time histogram
   - Database query metrics
```

## Alerts & Incidents

### Sentry Alerts

**Create alert rule:**

```
Condition: When issues are first seen
Then: Notify team
```

**Error budget:**

```
Alert when error rate > 1%
Alert when P99 response time > 1s
Alert when availability < 99%
```

### DataDog Alerts

```python
# Create via API
{
  "name": "High error rate on API",
  "query": "avg:trace.web.request.errors{service:api}.as_count() > 10",
  "type": "metric alert",
  "thresholds": {
    "critical": 10
  }
}
```

## CI/CD Integration

**.github/workflows/monitor.yml**

```yaml
name: Monitoring

on:
  deployment:

jobs:
  monitor:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Upload Sentry release
        run: |
          npm install -g @sentry/cli
          sentry-cli releases create ${{ github.sha }}
          sentry-cli releases deploys ${{ github.sha }} new -e production

      - name: Tag DataDog deployment
        run: |
          curl -X POST "https://api.datadoghq.com/api/v1/events" \
            -H "Content-Type: application/json" \
            -H "DD-API-KEY: ${{ secrets.DD_API_KEY }}" \
            -d '{
              "title": "Deployment",
              "text": "Deployed ${{ github.sha }} to production",
              "priority": "normal",
              "tags": ["service:api", "env:production"]
            }'
```

## Troubleshooting

**No traces appearing:**
- Check DataDog agent is running
- Verify DD_AGENT_HOST and DD_TRACE_AGENT_PORT
- Check firewall/network rules

**High volume of errors:**
- Review beforeSend filter
- Check error sampling rate
- Implement error recovery

**Source maps not resolving:**
- Verify source maps uploaded
- Check release version matches
- Verify file paths in bundle

## Best Practices

✅ Use consistent release versioning
✅ Set appropriate sampling rates
✅ Filter out expected errors
✅ Tag transactions with metadata
✅ Monitor error budgets
✅ Set up pagerduty/slack integration
✅ Review dashboards regularly
✅ Alert on anomalies
✅ Keep monitoring costs in mind
✅ Use structured logging
