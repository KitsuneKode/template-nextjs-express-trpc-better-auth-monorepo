# Scaling Strategies Guide

This guide covers scaling patterns and strategies for production applications.

## Scaling Approaches

### Vertical Scaling (Scale Up)
- Increase resources (CPU, RAM) on existing servers
- Simpler but has limits
- Eventually becomes expensive
- Causes downtime during upgrades

### Horizontal Scaling (Scale Out)
- Add more servers/instances
- Distribute load across instances
- Better for cloud infrastructure
- Requires load balancing and state management

## Application Layer Scaling

### Stateless Application Design

**Good (Stateless):**
```typescript
app.get('/api/user/:id', async (req, res) => {
  const user = await db.user.findUnique({ where: { id: req.params.id } })
  res.json(user)
})
```

**Bad (Stateful):**
```typescript
const userCache: Map<string, User> = new Map()

app.get('/api/user/:id', (req, res) => {
  const user = userCache.get(req.params.id) // Only on this server!
  res.json(user)
})
```

### Containerization & Orchestration

**Docker Compose (Development):**
```yaml
version: '3.8'
services:
  api-1:
    image: api:latest
    ports:
      - '3001:3000'
  api-2:
    image: api:latest
    ports:
      - '3002:3000'
  api-3:
    image: api:latest
    ports:
      - '3003:3000'
```

**Kubernetes (Production):**
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api
spec:
  replicas: 3
  selector:
    matchLabels:
      app: api
  template:
    metadata:
      labels:
        app: api
    spec:
      containers:
      - name: api
        image: api:latest
        ports:
        - containerPort: 3000
        resources:
          requests:
            memory: "512Mi"
            cpu: "250m"
          limits:
            memory: "1Gi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 10
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5
```

### Load Balancing

**Nginx Load Balancer:**
```nginx
upstream api_backend {
    least_conn;
    server api-1:3000;
    server api-2:3000;
    server api-3:3000;
}

server {
    listen 80;
    server_name api.example.com;

    location / {
        proxy_pass http://api_backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Session stickiness (if needed)
        proxy_cookie_path / "/";
    }
}
```

**AWS Application Load Balancer:**
```bash
aws elbv2 create-load-balancer \
  --name api-alb \
  --subnets subnet-12345678 subnet-87654321 \
  --security-groups sg-12345678 \
  --type application

# Create target group
aws elbv2 create-target-group \
  --name api-targets \
  --protocol HTTP \
  --port 3000 \
  --vpc-id vpc-12345678 \
  --health-check-protocol HTTP \
  --health-check-path /health
```

## Database Scaling

### Read Replicas

**PostgreSQL Read Replica Setup:**
```bash
# Create read replica
aws rds create-db-instance-read-replica \
  --db-instance-identifier api-db-replica \
  --source-db-instance-identifier api-db

# Use in application
const writeDb = new Pool({
  host: 'write.example.com',
  database: 'api'
})

const readDb = new Pool({
  host: 'read-replica.example.com',
  database: 'api'
})

// Read queries to replica
app.get('/api/posts', async (req, res) => {
  const posts = await readDb.query('SELECT * FROM posts')
  res.json(posts.rows)
})

// Write queries to primary
app.post('/api/posts', async (req, res) => {
  const post = await writeDb.query('INSERT INTO posts (...) RETURNING *')
  res.json(post.rows[0])
})
```

### Connection Pooling

**PgBouncer Configuration:**
```ini
[databases]
api = host=postgres.example.com port=5432 dbname=api

[pgbouncer]
pool_mode = transaction
max_client_conn = 1000
default_pool_size = 25
min_pool_size = 10
reserve_pool_size = 5
reserve_pool_timeout = 3
```

**Prisma with Connection Pooling:**
```typescript
const prisma = new PrismaClient({
  log: ['query'],
})

// Connection pool managed by Prisma
// Limit: connection_limit = 5 (default for serverless)
```

### Database Sharding

**Simple Sharding Strategy:**
```typescript
type ShardKey = 'user_id'

function getShardId(key: string, shardCount: number): number {
  return parseInt(key) % shardCount
}

async function getFromShard(userId: string, query: string) {
  const shardId = getShardId(userId, 4) // 4 shards
  const shardHost = `db-shard-${shardId}.example.com`
  
  const db = new Pool({
    host: shardHost,
    database: 'api'
  })
  
  return db.query(query, [userId])
}
```

## Caching Strategies

### Redis Caching

**Cache-Aside Pattern:**
```typescript
async function getPost(postId: string) {
  // Try cache first
  const cached = await redis.get(`post:${postId}`)
  if (cached) return JSON.parse(cached)

  // Cache miss - query database
  const post = await db.post.findUnique({ where: { id: postId } })
  
  // Store in cache
  await redis.setex(`post:${postId}`, 3600, JSON.stringify(post))
  
  return post
}
```

**Write-Through Caching:**
```typescript
async function updatePost(postId: string, data: PostUpdate) {
  // Update database
  const post = await db.post.update({
    where: { id: postId },
    data
  })
  
  // Update cache
  await redis.setex(`post:${postId}`, 3600, JSON.stringify(post))
  
  return post
}
```

**Cache Invalidation:**
```typescript
// Invalidate on changes
async function deletePost(postId: string) {
  await db.post.delete({ where: { id: postId } })
  await redis.del(`post:${postId}`) // Invalidate cache
}

// Tag-based invalidation
async function invalidateUserPosts(userId: string) {
  const posts = await redis.keys(`post:user:${userId}:*`)
  if (posts.length > 0) {
    await redis.del(...posts)
  }
}
```

### CDN Integration

**CloudFront Configuration:**
```bash
aws cloudfront create-distribution \
  --origin-domain-name api.example.com \
  --default-cache-behavior \
    TrustedSigners=12345678 \
    ViewerProtocolPolicy=https-only \
    Compress=true \
    CachePolicyId=4135ea3d-c35e-46eb-81d7-edf51f153011
```

**Cache Headers:**
```typescript
app.get('/api/posts', (req, res) => {
  res.set('Cache-Control', 'public, max-age=3600') // 1 hour
  res.set('CDN-Cache-Control', 'max-age=86400') // 1 day for CDN
  res.json(posts)
})

app.get('/api/user/profile', (req, res) => {
  res.set('Cache-Control', 'private, max-age=300') // 5 minutes, user-specific
  res.json(user)
})
```

## Message Queues for Scaling

### BullMQ for Distributed Jobs

**Distributed Job Processing:**
```typescript
// Producer (multiple app instances)
const queue = new Queue('email', { connection: redis })

app.post('/api/send-email', async (req, res) => {
  await queue.add('send', {
    to: req.body.email,
    subject: req.body.subject
  }, {
    attempts: 3,
    backoff: { type: 'exponential', delay: 2000 }
  })
  res.json({ queued: true })
})

// Consumer (separate worker processes)
const worker = new Worker('email', emailHandler, { connection: redis })

async function emailHandler(job: Job) {
  await sendEmail(job.data)
}
```

## Multi-Region Deployment

### Active-Active Across Regions

```yaml
# Primary region (us-east-1)
api-primary:
  region: us-east-1
  db: primary.us-east-1.example.com
  replicas: 3

# Secondary region (eu-west-1)
api-secondary:
  region: eu-west-1
  db: primary.eu-west-1.example.com
  replicas: 3

# Global Load Balancer (Route 53)
health_check: /health
failover_policy: latency-based
```

### Database Replication

**Cross-Region Replication:**
```bash
# Create secondary database
aws rds create-db-instance-read-replica \
  --db-instance-identifier api-db-eu \
  --source-db-instance-identifier arn:aws:rds:us-east-1:account:db:api-db \
  --region eu-west-1
```

## Autoscaling

### Kubernetes Horizontal Pod Autoscaler

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: api-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: api
  minReplicas: 3
  maxReplicas: 20
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
  behavior:
    scaleUp:
      stabilizationWindowSeconds: 60
      policies:
      - type: Percent
        value: 50
        periodSeconds: 60
    scaleDown:
      stabilizationWindowSeconds: 300
      policies:
      - type: Percent
        value: 10
        periodSeconds: 60
```

### AWS Auto Scaling

```bash
aws autoscaling create-auto-scaling-group \
  --auto-scaling-group-name api-asg \
  --launch-configuration api-lc \
  --min-size 3 \
  --max-size 20 \
  --desired-capacity 5 \
  --health-check-type ELB \
  --health-check-grace-period 300

aws autoscaling put-scaling-policy \
  --auto-scaling-group-name api-asg \
  --policy-name scale-up \
  --policy-type TargetTrackingScaling \
  --target-tracking-configuration file://target-tracking.json
```

## Performance Optimization for Scaling

### Query Optimization

```typescript
// Bad: N+1 query
const users = await db.user.findMany()
for (const user of users) {
  user.posts = await db.post.findMany({ where: { userId: user.id } })
}

// Good: Eager loading
const users = await db.user.findMany({
  include: { posts: true }
})

// Good: Projection
const posts = await db.post.findMany({
  select: { id: true, title: true }, // Only needed fields
  take: 100
})
```

### Index Strategy

```sql
-- Create indexes on frequently queried columns
CREATE INDEX idx_user_email ON users(email);
CREATE INDEX idx_post_user_id ON posts(user_id);
CREATE INDEX idx_post_created_at ON posts(created_at DESC);
CREATE INDEX idx_post_published ON posts(published) WHERE published = true;

-- Composite index for common queries
CREATE INDEX idx_post_user_published ON posts(user_id, published);
```

## Monitoring Scaling

**Key Metrics:**
- CPU utilization (target: 60-70%)
- Memory utilization (target: 70-80%)
- Network I/O
- Disk I/O
- Database connections
- Request latency
- Error rate

**Alerts:**
- Scale up when CPU > 75%
- Scale down when CPU < 30% for 10 minutes
- Alert when scaling reaches limits
- Alert on database connection limits

## Cost Optimization

### Reserved Instances
- Commit to 1-3 year terms for 30-60% discount
- Good for baseline capacity

### Spot Instances
- Up to 90% discount
- Use for fault-tolerant workloads
- Mix spot + on-demand

### Resource Limits
```yaml
resources:
  requests:
    memory: "512Mi"   # Minimum guaranteed
    cpu: "250m"
  limits:
    memory: "1Gi"     # Maximum allowed
    cpu: "500m"
```

## Migration Path

1. **Phase 1:** Single server with basic monitoring
2. **Phase 2:** Add read replicas, implement caching
3. **Phase 3:** Containerize, add load balancer
4. **Phase 4:** Implement auto-scaling
5. **Phase 5:** Multi-region deployment
6. **Phase 6:** Optimize and refine

## Scaling Checklist

✅ Application is stateless
✅ Database is optimized (indexes, connection pooling)
✅ Caching strategy implemented
✅ Load balancer configured
✅ Health checks working
✅ Auto-scaling policies defined
✅ Monitoring and alerting set up
✅ Graceful shutdown handling
✅ Database replication working
✅ Disaster recovery plan
