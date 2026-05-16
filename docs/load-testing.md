# Load Testing Guide

This guide covers load testing strategies and tools for validating application performance under realistic traffic.

## Load Testing Goals

1. Validate application can handle peak traffic
2. Identify bottlenecks and breaking points
3. Determine optimal resource allocation
4. Test graceful degradation under load
5. Validate auto-scaling policies
6. Measure resource consumption at scale

## Load Testing Tools Comparison

| Tool | Language | Type | Best For |
|------|----------|------|----------|
| **Artillery** | YAML/JS | HTTP/WebSocket | Simple API testing |
| **k6** | JavaScript | HTTP/WebSocket/gRPC | Performance-focused |
| **JMeter** | Java GUI | HTTP/Database/FTP | Complex scenarios |
| **Locust** | Python | HTTP | Custom load patterns |
| **Gatling** | Scala/Java | HTTP/WebSocket | Enterprise grade |

## Artillery Load Testing

### Installation

```bash
npm install -D artillery
```

### Basic Configuration

**load-test.yml**

```yaml
config:
  # Target
  target: 'http://localhost:3000'
  
  # Load phases
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
    - duration: 30
      arrivalRate: 10
      name: 'Cool down'
  
  # Settings
  settings:
    # Maximum concurrent connections
    maxErrorRate: 1
    # Show progress
    verbose: true
    # Logging
    logging:
      level: 'info'

# CSV data source
payload:
  path: './test-data.csv'
  fields:
    - 'user_id'
    - 'post_id'
    - 'email'

# Test scenarios
scenarios:
  - name: 'Read and Write Mix'
    weight: 80
    flow:
      # GET list
      - get:
          url: '/api/posts'
          capture:
            - json: '$.data[0].id'
              as: 'post_id'
      
      # GET by ID
      - get:
          url: '/api/posts/{{ post_id }}'
          expect:
            - statusCode: 200
      
      # POST new post
      - post:
          url: '/api/posts'
          json:
            title: 'Load test post'
            content: 'Testing under load'
          expect:
            - statusCode: 201
      
      # DELETE post
      - delete:
          url: '/api/posts/{{ post_id }}'
          expect:
            - statusCode: 204
  
  - name: 'Authentication Flow'
    weight: 20
    flow:
      - post:
          url: '/api/auth/login'
          json:
            email: '{{ email }}'
            password: 'TestPassword123'
          capture:
            - json: '$.token'
              as: 'auth_token'
          expect:
            - statusCode: 200
      
      - get:
          url: '/api/user/profile'
          headers:
            Authorization: 'Bearer {{ auth_token }}'
          expect:
            - statusCode: 200

# Reporting
after:
  flow:
    - think: 2
    - log: 'Load test complete'
```

**test-data.csv**

```csv
user_id,post_id,email
1,101,user1@test.com
2,102,user2@test.com
3,103,user3@test.com
4,104,user4@test.com
5,105,user5@test.com
```

### Run Load Test

```bash
# Run test
artillery run load-test.yml

# Run with specific phase
artillery run load-test.yml --target http://production.com

# Generate HTML report
artillery run load-test.yml --output results.json
artillery report results.json
```

## k6 Load Testing

### Installation

```bash
# macOS
brew install k6

# Linux
sudo apt-get install k6

# Or use Docker
docker run -i grafana/k6 run - < script.js
```

### k6 Script Example

**load-test.js**

```javascript
import http from 'k6/http'
import { check, group, sleep } from 'k6'
import { Rate, Trend, Counter, Gauge } from 'k6/metrics'

// Custom metrics
const errorRate = new Rate('errors')
const postDuration = new Trend('post_duration')
const activeUsers = new Gauge('active_users')
const totalRequests = new Counter('total_requests')

// Load phases
export const options = {
  vus: 10, // Virtual users
  stages: [
    { duration: '30s', target: 20 }, // Ramp up
    { duration: '1m30s', target: 100 }, // Stay at 100
    { duration: '20s', target: 0 }, // Ramp down
  ],
  thresholds: {
    // Performance thresholds
    'http_req_duration': ['p(95)<500', 'p(99)<1000'],
    'http_req_failed': ['rate<0.1'], // Less than 10% failure
    'errors': ['rate<0.1'],
  },
}

// Setup - run once before test
export function setup() {
  const loginRes = http.post('http://localhost:3000/api/auth/login', {
    email: 'testuser@example.com',
    password: 'TestPassword123',
  })

  return { token: loginRes.json('token') }
}

// Main test function
export default function (data) {
  const { token } = data
  activeUsers.add(1)

  group('API Tests', () => {
    // Test 1: List posts
    group('List Posts', () => {
      const res = http.get('http://localhost:3000/api/posts')
      check(res, {
        'status is 200': (r) => r.status === 200,
        'response time < 200ms': (r) => r.timings.duration < 200,
      })
    })

    // Test 2: Get single post
    group('Get Post', () => {
      const res = http.get('http://localhost:3000/api/posts/1')
      check(res, {
        'status is 200': (r) => r.status === 200,
        'has title': (r) => r.json('title') !== null,
      })
    })

    // Test 3: Create post
    group('Create Post', () => {
      const payload = {
        title: `Load test ${__VU}-${__ITER}`,
        content: 'Testing with k6',
      }

      const res = http.post('http://localhost:3000/api/posts', JSON.stringify(payload), {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      })

      postDuration.add(res.timings.duration)

      if (res.status !== 201) {
        errorRate.add(1)
      }

      check(res, {
        'status is 201': (r) => r.status === 201,
        'has id': (r) => r.json('id') !== null,
      })
    })

    // Test 4: Search (if available)
    group('Search Posts', () => {
      const res = http.get('http://localhost:3000/api/posts?q=test&limit=10')
      check(res, {
        'status is 200': (r) => r.status === 200,
        'has results': (r) => r.json('total') >= 0,
      })
    })
  })

  totalRequests.add(1)
  sleep(1)
}

// Teardown - run once after test
export function teardown(data) {
  http.post('http://localhost:3000/api/auth/logout', {}, {
    headers: {
      'Authorization': `Bearer ${data.token}`,
    },
  })
}
```

### Run k6 Test

```bash
# Run script
k6 run load-test.js

# Run with custom VUs
k6 run -u 50 -d 5m load-test.js

# Run with custom output format
k6 run --out json=results.json load-test.js

# Live monitoring
k6 run --liveStats 5s load-test.js
```

## Database Load Testing

### Redis Load Testing

**load-test-redis.js**

```javascript
import redis from 'k6/x/redis'

const client = new redis.Client({
  url: 'redis://localhost:6379',
})

export default function () {
  // SET operation
  client.set('key:' + __VU + ':' + __ITER, 'value ' + __ITER)

  // GET operation
  client.get('key:' + __VU + ':' + __ITER)

  // LPUSH operation
  client.lpush('list:' + __VU, 'item ' + __ITER)

  // LPOP operation
  client.lpop('list:' + __VU)
}
```

### PostgreSQL Load Testing

```javascript
import sql from 'k6/x/sql'

const db = sql.open({
  connectionString: 'postgres://user:pass@localhost/testdb',
})

export default function () {
  // Query
  const result = db.query('SELECT * FROM posts LIMIT 10')

  // Insert
  db.exec(`
    INSERT INTO posts (title, content) 
    VALUES ('Post ' || $1, 'Content ' || $1)
  `, [__VU + __ITER])
}
```

## Load Test Scenarios

### Realistic Traffic Pattern

```yaml
scenarios:
  - name: 'Realistic Traffic'
    weight: 100
    flow:
      # Morning spike
      - think: 5
      - get:
          url: '/api/posts'
      
      # User browsing
      - think: 10
      - get:
          url: '/api/posts/{{ post_id }}'
      
      # Comment activity
      - think: 15
      - post:
          url: '/api/posts/{{ post_id }}/comments'
          json:
            content: 'Great post!'
      
      # Sharing/engagement
      - think: 8
      - post:
          url: '/api/posts/{{ post_id }}/like'
```

### Stress Testing

```yaml
config:
  phases:
    # Ramp to breaking point
    - duration: 300
      arrivalRate: 1
      rampTo: 100
      name: 'Stress'
    
    # Maintain stress
    - duration: 60
      arrivalRate: 100
      name: 'Hold'
    
    # Measure recovery
    - duration: 60
      arrivalRate: 10
      name: 'Recovery'
```

### Soak Testing

```yaml
config:
  phases:
    # Long duration with moderate load
    - duration: 3600 # 1 hour
      arrivalRate: 20
      name: 'Soak test'
```

## CI/CD Integration

**.github/workflows/load-test.yml**

```yaml
name: Load Testing

on:
  schedule:
    - cron: '0 2 * * *' # Daily at 2 AM
  workflow_dispatch:

jobs:
  load-test:
    runs-on: ubuntu-latest

    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres

    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - uses: grafana/k6-action@v0.3.0

      - name: Start application
        run: npm run dev &
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost/testdb

      - name: Wait for app
        run: npx wait-on http://localhost:3000

      - name: Run load test
        run: |
          k6 run load-test.js \
            --out json=results.json \
            --summary-export=summary.json

      - name: Upload results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: load-test-results
          path: |
            results.json
            summary.json

      - name: Check thresholds
        run: |
          jq '.thresholds[] | select(.ok == false)' summary.json
          if [ $? -eq 0 ]; then exit 1; fi
```

## Load Test Results Analysis

**Analyze results.json**

```bash
# Convert to human-readable format
k6 run --out json=results.json load-test.js

# Parse results with jq
cat results.json | jq '.metrics[] | {name, value}'

# Check error rate
cat results.json | jq '.metrics[] | select(.name == "http_req_failed")'

# Check response times
cat results.json | jq '.metrics[] | select(.name == "http_req_duration")'
```

## Performance Under Load

**Metrics to Track:**

- Request rate (RPS)
- Response time (p50, p95, p99)
- Error rate
- Success rate
- CPU usage
- Memory usage
- Database connections
- Network bandwidth

**Acceptable Thresholds:**

- Error rate: < 0.1%
- P95 response: < 500ms
- P99 response: < 1s
- CPU usage: < 80%
- Memory usage: < 80%

## Load Test Checklist

Before running in production:

✅ Test in staging environment
✅ Set realistic traffic patterns
✅ Monitor system resources
✅ Test graceful degradation
✅ Test auto-scaling behavior
✅ Measure database query times
✅ Check cache hit rates
✅ Verify error handling
✅ Test long-running connections
✅ Measure recovery time
✅ Document breaking points
✅ Have rollback plan

## Common Issues

**Issue: "Too many connections"**
- Solution: Implement connection pooling
- Increase database max connections

**Issue: "Memory leak detected"**
- Solution: Check for event listener leaks
- Monitor heap usage

**Issue: "Cache ineffective"**
- Solution: Increase cache TTL
- Review cache invalidation strategy

**Issue: "Slow database queries"**
- Solution: Add missing indexes
- Optimize query complexity

## Best Practices

✅ Run tests regularly (daily/weekly)
✅ Test realistic scenarios
✅ Test graceful degradation
✅ Monitor resources during tests
✅ Set performance thresholds
✅ Document baselines
✅ Compare against previous tests
✅ Test during peak hours simulation
✅ Have incident response plan
✅ Share results with team
