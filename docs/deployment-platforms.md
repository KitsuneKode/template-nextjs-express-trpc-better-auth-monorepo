# Deployment Platforms Guide

Choose your deployment strategy: serverless, managed containers, or self-hosted.

## Platform Comparison

| Platform          | Frontend   | Backend          | Database          | Cost   | Scaling | Complexity |
| ----------------- | ---------- | ---------------- | ----------------- | ------ | ------- | ---------- |
| **Vercel**        | ⭐⭐⭐⭐⭐ | ⭐⭐ (Functions) | ⭐⭐⭐ (Postgres) | Low    | Auto    | Low        |
| **AWS**           | ⭐⭐⭐⭐   | ⭐⭐⭐⭐⭐       | ⭐⭐⭐⭐⭐        | Varies | Auto    | High       |
| **Heroku**        | ⭐⭐⭐     | ⭐⭐⭐           | ⭐⭐⭐            | Medium | Manual  | Low        |
| **Railway**       | ⭐⭐⭐     | ⭐⭐⭐⭐         | ⭐⭐⭐            | Low    | Auto    | Low        |
| **Fly.io**        | ⭐⭐⭐     | ⭐⭐⭐⭐         | ⭐⭐⭐            | Low    | Auto    | Medium     |
| **Docker (Self)** | ⭐⭐⭐⭐   | ⭐⭐⭐⭐         | ⭐⭐⭐⭐          | Varies | Manual  | High       |
| **Kubernetes**    | ⭐⭐⭐⭐   | ⭐⭐⭐⭐⭐       | ⭐⭐⭐⭐          | High   | Auto    | Very High  |

---

## Option 1: Vercel (Easiest for Full Stack)

Best for: Next.js frontend + serverless backend

### Setup

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod

# Follow prompts, connect GitHub for auto-deploy
```

### Environment Variables

1. Go to https://vercel.com/dashboard
2. Select project → Settings → Environment Variables
3. Add all from `.env.production`:
   ```
   DATABASE_URL
   REDIS_URL (optional)
   SENTRY_DSN
   NEXT_PUBLIC_API_URL (if backend separate)
   ...
   ```

### Frontend (Next.js)

✅ Automatic: Deploys on `git push` to main
✅ Automatic: Custom domain, SSL, CDN
✅ Automatic: Environment-based preview deployments

### Backend (Express/API)

⚠️ **Problem**: Vercel Functions have 10-second timeout. Express needs longer.

**Solution 1: Move backend elsewhere** (Recommended)

- Deploy Express to Railway, Fly, Render
- Set `NEXT_PUBLIC_API_URL=https://api.example.com` in Vercel
- Frontend talks to separate backend URL

**Solution 2: Use Vercel Functions** (Limited)

- Rewrite Express routes as serverless functions
- Works for simple CRUD, not for long-running processes
- Jobs/workers won't work

### Database

**Use Vercel Postgres** (managed PostgreSQL):

```bash
# In Vercel dashboard: Storage → Create Database

# Pull connection string
vercel env pull .env.production.local

# Run migrations
DATABASE_URL=<vercel_postgres_url> npx prisma migrate deploy
```

Or use external PostgreSQL (AWS RDS, Supabase, Neon):

```
DATABASE_URL=postgresql://user:pass@db.example.com:5432/myapp
```

### Auto-Deploy

```bash
# GitHub integration automatic
git push origin main
  ↓
GitHub webhook → Vercel
  ↓
npm run build
  ↓
Deploy preview + production
```

### Monitoring

```bash
# In Vercel dashboard: Settings → Monitoring
# Enable Web Analytics, Performance
```

### Cost

- Hobby: Free (1 deployment per day limit, not for production)
- Pro: $20/month (unlimited deployments)
- Database add-on: $10-30/month

---

## Option 2: AWS (Most Powerful, Most Complex)

Best for: Full control, multi-region, high traffic

### Frontend (CloudFront + S3)

```bash
# Build frontend
npm run build

# Deploy to S3
aws s3 sync apps/web/.next s3://my-app-frontend/

# Invalidate CloudFront
aws cloudfront create-invalidation --distribution-id E123456 --paths "/*"
```

Or use **AWS Amplify** (easier):

```bash
# Connect GitHub repo
# Auto-deploy on push
```

### Backend (ECS or EC2)

**ECS (Recommended - managed containers):**

```bash
# Create Docker image
docker build -t my-api:latest .
docker tag my-api:latest 123456789.dkr.ecr.us-east-1.amazonaws.com/my-api:latest

# Push to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 123456789.dkr.ecr.us-east-1.amazonaws.com
docker push 123456789.dkr.ecr.us-east-1.amazonaws.com/my-api:latest

# Create ECS task definition
aws ecs register-task-definition --cli-input-json file://task-definition.json

# Create ECS service
aws ecs create-service --cluster my-cluster --service-name my-api --task-definition my-api:1 --desired-count 3
```

**EC2 (More control, but you manage updates):**

```bash
# Launch EC2 instance
aws ec2 run-instances --image-id ami-0c55b159cbfafe1f0 --instance-type t3.medium

# SSH and install Docker, Node
ssh ec2-user@instance
sudo yum update && sudo yum install -y docker nodejs

# Run container
docker run -d -p 3000:3000 --env-file .env my-api:latest
```

### Database (RDS)

```bash
# Create PostgreSQL RDS instance
aws rds create-db-instance \
  --db-instance-identifier my-app-db \
  --db-instance-class db.t3.micro \
  --engine postgres \
  --master-username admin \
  --master-user-password <strong-password>

# Wait for instance to be available, then get endpoint
aws rds describe-db-instances --db-instance-identifier my-app-db

# Migrate
DATABASE_URL=postgresql://admin:password@my-app-db.xxxxx.us-east-1.rds.amazonaws.com:5432/myapp npx prisma migrate deploy
```

### Load Balancer (ALB)

```bash
# Create Application Load Balancer
aws elbv2 create-load-balancer \
  --name my-api-alb \
  --subnets subnet-12345678 subnet-87654321 \
  --security-groups sg-12345678

# Create target group
aws elbv2 create-target-group \
  --name my-api-targets \
  --protocol HTTP \
  --port 3000 \
  --vpc-id vpc-12345678

# Register targets (ECS instances or EC2)
aws elbv2 register-targets \
  --target-group-arn arn:aws:elasticloadbalancing:... \
  --targets Id=i-1234567890abcdef0 Id=i-0987654321fedcba0
```

### Auto Scaling

```bash
# Create auto-scaling group
aws autoscaling create-auto-scaling-group \
  --auto-scaling-group-name my-api-asg \
  --launch-template LaunchTemplateName=my-api,Version=\$Latest \
  --min-size 3 \
  --max-size 10 \
  --desired-capacity 5

# Scale up policy
aws autoscaling put-scaling-policy \
  --auto-scaling-group-name my-api-asg \
  --policy-name scale-up \
  --policy-type TargetTrackingScaling \
  --target-tracking-configuration '{...}'
```

### Cost

- EC2: $0.10-0.50/hour per instance
- RDS: $15-50/month per instance
- ALB: $15/month
- Total: $100-500/month (depending on scale)

---

## Option 3: Heroku (Easiest Traditional)

Best for: Small apps, rapid iteration, don't want to manage infrastructure

### Setup

```bash
# Install Heroku CLI
brew tap heroku/brew && brew install heroku

# Login
heroku login

# Create app
heroku create my-app

# Add PostgreSQL
heroku addons:create heroku-postgresql:hobby-dev

# Set environment variables
heroku config:set NODE_ENV=production SENTRY_DSN=...

# Deploy (from git push)
git push heroku main
```

### Automatic Deploys

```bash
# In Heroku dashboard: Deploy → GitHub
# Connect repo, enable auto-deploy
```

### Logs

```bash
heroku logs --tail

# Or in dashboard: More → View logs
```

### Scaling

```bash
# Scale dynos (web processes)
heroku ps:scale web=3

# Auto-scaling (Autoscaling add-on, $50/month)
heroku addons:create autoscaling:standard
```

### Cost

- Hobby (free): 550 hours/month (not for production)
- Standard (dynos): $7/month per dyno
- Premium: $50/month per dyno
- PostgreSQL: $9-50/month
- Total: $25-100/month

---

## Option 4: Railway (Best Balance)

Best for: Good developer experience + reasonable cost + auto-scaling

### Setup

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Link to project
railway link

# Deploy
railway up
```

### Dashboard

1. Go to https://railway.app/dashboard
2. Create new project
3. Add services: Node.js backend + PostgreSQL
4. Set environment variables
5. GitHub integration for auto-deploy

### Scaling

```bash
# In dashboard: Services → my-app → Scale
# Adjust CPU, memory, replica count
```

### Database

```bash
# Add PostgreSQL in dashboard
# Get connection string from Service → PostgreSQL → Connect

# Migrate
DATABASE_URL=... npx prisma migrate deploy
```

### Cost

- Fixed plan: $5-20/month per service
- Pay-as-you-go: $0.12/vCPU-hour, $0.05/GB-month
- Database: included in vCPU usage
- Total: $10-50/month depending on usage

---

## Option 5: Fly.io (Powerful + Cheap)

Best for: Global deployment, fast, modern infrastructure

### Setup

```bash
# Install Fly CLI
brew install flyctl

# Login
fly auth login

# Launch app
fly launch

# Follow prompts, creates fly.toml
```

### fly.toml Configuration

```toml
app = "my-app"
primary_region = "sjc"

[services]
  http_checks = [{grace_period = "10s", interval = "30s", timeout = "5s", protocol = "http", method = "GET", path = "/health"}]
  processes = ["app"]

  [[services.ports]]
    handlers = ["http"]
    port = 80

  [[services.ports]]
    handlers = ["tls", "http"]
    port = 443

  [[services.tcp_checks]]
    grace_period = "10s"
    interval = "30s"
    timeout = "5s"

[env]
  NODE_ENV = "production"

[processes]
  app = "node dist/server.js"
```

### Database

```bash
# Create PostgreSQL cluster
fly postgres create --name my-app-db

# Attach to app
fly postgres attach --postgres-app my-app-db

# Migrate
DATABASE_URL=postgres://... npx prisma migrate deploy
```

### Deploy

```bash
# Deploy
fly deploy

# Scale
fly scale count 3

# View logs
fly logs
```

### Cost

- Compute: $0.10/vCPU-hour, $0.01/GB-hour
- Database: Included
- Minimum: ~$5-15/month
- Scales with traffic

---

## Option 6: Self-Hosted Docker Compose

Best for: Full control, learning, on-premises

### Structure

```
myapp/
  docker-compose.yml
  nginx/
    nginx.conf
  apps/
    server/
      Dockerfile
    web/
      Dockerfile
  .env.production
  backups/
```

### docker-compose.yml

```yaml
version: '3.8'

services:
  nginx:
    image: nginx:latest
    ports:
      - '80:80'
      - '443:443'
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf
      - ./certs:/etc/nginx/certs
    depends_on:
      - api

  api:
    build:
      context: .
      dockerfile: apps/server/Dockerfile
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://user:pass@db:5432/myapp
      - REDIS_URL=redis://redis:6379
    ports:
      - '3000:3000'
    depends_on:
      - db
      - redis
    healthcheck:
      test: ['CMD', 'curl', '-f', 'http://localhost:3000/health']
      interval: 10s
      timeout: 3s
      retries: 3

  web:
    build:
      context: .
      dockerfile: apps/web/Dockerfile
    ports:
      - '3001:3000'
    environment:
      - NEXT_PUBLIC_API_URL=https://api.example.com

  db:
    image: postgres:15
    environment:
      - POSTGRES_PASSWORD=<strong-password>
      - POSTGRES_DB=myapp
    volumes:
      - db-data:/var/lib/postgresql/data
    ports:
      - '5432:5432'

  redis:
    image: redis:7
    ports:
      - '6379:6379'

volumes:
  db-data:
```

### Deploy

```bash
# SSH to server
ssh user@example.com

# Clone repo
git clone https://github.com/myuser/myapp.git

# Set .env
cp .env.example .env.production
vim .env.production  # Set real values

# Run
docker-compose -f docker-compose.yml up -d

# Check
docker-compose logs -f
curl https://example.com
```

### SSL Certificate (Let's Encrypt)

```bash
# Using Certbot
sudo apt-get install certbot python3-certbot-nginx

# Get certificate
sudo certbot certonly --standalone -d example.com -d api.example.com

# Copy to certs folder
sudo cp /etc/letsencrypt/live/example.com/fullchain.pem ./certs/
sudo cp /etc/letsencrypt/live/example.com/privkey.pem ./certs/

# Auto-renew
sudo certbot renew --dry-run
```

### Monitoring & Logging

```bash
# View logs
docker-compose logs -f api

# System metrics
docker stats

# Backup database
docker-compose exec db pg_dump -U user myapp > backup.sql
```

### Cost

- Server: $5-20/month (DigitalOcean, Linode)
- Domain: $10/year
- SSL: Free (Let's Encrypt)
- Total: $60-240/year

---

## Render (API + Postgres + Redis)

For this monorepo’s Express API (`apps/server`), use the root **Blueprint** — not a Native Bun web service.

| Resource     | Blueprint name         | Purpose                           |
| ------------ | ---------------------- | --------------------------------- |
| Web (Docker) | `arche-template-api`   | API (`/health`, `/api/trpc`, `/`) |
| Postgres     | `arche-template-db`    | `DATABASE_URL`                    |
| Key Value    | `arche-template-redis` | `REDIS_URL`                       |

**Step-by-step and failure causes:** [deployment-render.md](./deployment-render.md)

Frontend on Vercel: set `NEXT_PUBLIC_API_URL` to the Render service URL.

---

## Quick Decision Tree

**Q: Want serverless + minimal DevOps?**
→ Vercel (frontend) + Railway/Render (backend) — see [deployment-render.md](./deployment-render.md) for this template

**Q: Need global distribution + high traffic?**
→ Fly.io or AWS (CloudFront + ECS)

**Q: Learning or small side project?**
→ Railway or Heroku

**Q: Full control + low cost?**
→ Self-hosted Docker on DigitalOcean/Linode

**Q: Enterprise + compliance?**
→ AWS (VPC, RDS, compliance tools)

---

## Next: Deploy to Kubernetes

For large-scale operations, see: `deployment-kubernetes.md`
