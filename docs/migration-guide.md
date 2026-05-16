/**
 * Migration & Upgrade Guide
 *
 * This guide helps migrate from older versions and upgrade dependencies safely.
 */

# Upgrading Your Project

## Before You Start

1. **Commit your changes**: Ensure your codebase is clean
2. **Test locally**: Test all upgrades on your local machine first
3. **Check breaking changes**: Read changelog for the package you're upgrading
4. **Backup database**: Take a snapshot in production before major upgrades

## Upgrading Dependencies

### Next.js

```bash
# Check outdated packages
bun outdated

# Upgrade Next.js (major version)
bun add next@latest react@latest react-dom@latest

# Test build
bun run build
bun run dev

# Test production build
bun run build && bun run start
```

### Prisma

```bash
# Check current version
prisma --version

# Upgrade
bun add -D prisma@latest @prisma/client@latest

# Generate new client
bun run db:generate

# Review and run migrations
bun run db:migrate
```

### tRPC

```bash
# Upgrade (usually non-breaking in patch/minor)
bun add @trpc/client@latest @trpc/server@latest

# Test API calls
```

### Better Auth

```bash
# Check changelog before upgrading
bun add better-auth@latest

# Test auth flows (login, oauth, logout)
```

## Database Migrations

### PostgreSQL

```bash
# Create backup
pg_dump -U postgres dbname > backup.sql

# Review pending migrations
bun run db:migrate --dry-run

# Apply migrations
bun run db:migrate

# Seed data if needed
bun run db:seed
```

### SQLite

```bash
# Create backup
cp dev.db dev.db.backup

# Apply migrations
bun run db:migrate
```

## Environment Variables

When updating dependencies, you may need new environment variables:

```bash
# Copy old .env to .env.old
cp apps/server/.env apps/server/.env.old

# Generate new .env template
cp apps/server/.env.example apps/server/.env

# Merge old values into new template
# (compare old and new, update new with values from old)
```

## Testing After Upgrade

```bash
# Type check everything
bun run check-types

# Lint
bun run lint

# Run tests
bun run test

# Full build
bun run build
```

## Troubleshooting

### Build fails with module not found
```bash
# Clear build cache
rm -rf .turbo .next dist

# Reinstall dependencies
rm -rf node_modules
bun install
```

### Database connection errors after upgrade
```bash
# Verify DATABASE_URL is correct
echo $DATABASE_URL

# Test connection
bun run db:generate
```

### Type errors after upgrade
```bash
# Regenerate types
bun run check-types --force

# Clear TypeScript cache
rm -rf node_modules/.cache
```

## Production Deployment

1. **Test in staging first**
2. **Deploy during low-traffic period**
3. **Have rollback plan ready**
4. **Monitor logs and errors**
5. **Have database backup available**

```bash
# Example deployment steps
# 1. Pull latest code
git pull origin main

# 2. Install dependencies
bun install

# 3. Run migrations
bun run db:migrate

# 4. Build
bun run build

# 5. Restart service
systemctl restart myapp

# 6. Verify health
curl https://api.example.com/health
```

## Version Pinning

For production stability, consider pinning major versions in package.json:

```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^19.0.0",
    "@trpc/server": "^11.0.0"
  }
}
```

Use `~` for patch updates, `^` for minor updates, and pin major versions if you need strict control.
