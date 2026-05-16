# Docker Deployment Guide

## Local Development

Start the development environment with:

```bash
docker compose up -d
```

This starts PostgreSQL (or MongoDB), Redis, and other services. Your app connects to them on `localhost`.

## Production Deployment

### Prerequisites

- Docker and Docker Compose installed
- Valid SSL certificates in `nginx/ssl/` (cert.pem, key.pem)
- Environment variables set in `.env` files

### Step 1: Prepare SSL certificates

```bash
# Option A: Using Let's Encrypt (recommended for production)
# Follow your hosting provider's SSL setup instructions

# Option B: Self-signed (testing only)
openssl req -x509 -newkey rsa:4096 -keyout nginx/ssl/key.pem -out nginx/ssl/cert.pem -days 365 -nodes

# Option C: Local development with mkcert
./scripts/setup-local-ssl.sh
```

### Step 2: Enable HTTPS in nginx/nginx.conf

Uncomment the HTTPS server block and comment out HTTP.

### Step 3: Update environment variables

Edit `.env` files for production:

```bash
# apps/server/.env
NODE_ENV=production
DATABASE_URL=postgresql://user:password@host:5432/dbname
BETTER_AUTH_URL=https://your-domain.com
FRONTEND_URL=https://your-domain.com
REDIS_URL=redis://your-redis-host:6379

# apps/web/.env
NEXT_PUBLIC_API_URL=https://your-domain.com
```

### Step 4: Build and run

```bash
# Build the containers (this may take 5-10 minutes)
docker compose -f docker-compose.prod.yml build

# Start production environment
docker compose -f docker-compose.prod.yml up -d

# View logs
docker compose -f docker-compose.prod.yml logs -f

# Stop
docker compose -f docker-compose.prod.yml down
```

## Monitoring

Monitor your application:

```bash
# View container logs
docker compose -f docker-compose.prod.yml logs web
docker compose -f docker-compose.prod.yml logs server
docker compose -f docker-compose.prod.yml logs worker

# Check container status
docker compose -f docker-compose.prod.yml ps

# View resource usage
docker stats
```

## Troubleshooting

### Port already in use

```bash
# Find and kill process using port 80
lsof -i :80
kill -9 <PID>
```

### SSL certificate errors

Ensure `nginx/ssl/cert.pem` and `nginx/ssl/key.pem` exist and are readable.

### Database connection errors

Check DATABASE_URL is correct and database is accessible from Docker containers.

### Worker not processing jobs

- Ensure Redis is running and accessible
- Check worker logs: `docker compose logs worker`
- Verify REDIS_URL is set correctly
