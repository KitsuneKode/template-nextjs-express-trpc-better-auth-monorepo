/**
 * Security Best Practices Guide
 *
 * This document outlines security considerations and best practices.
 */

# Security Best Practices

## Environment Variables

- ✅ Never commit .env files
- ✅ Use strong secrets (minimum 32 characters)
- ✅ Rotate secrets regularly in production
- ✅ Use different secrets per environment
- ✅ Validate all environment variables on startup

Example:
```bash
BETTER_AUTH_SECRET=your-random-32-character-minimum-secret
```

## Authentication

- ✅ Use HTTPS everywhere
- ✅ Use SameSite cookies
- ✅ Implement CSRF protection for non-tRPC routes
- ✅ Set secure and httpOnly flags on session cookies
- ✅ Implement session timeout
- ✅ Log out on logout

## Database

- ✅ Use parameterized queries (Prisma/ORM does this)
- ✅ Validate and sanitize user input
- ✅ Limit database user permissions (follow principle of least privilege)
- ✅ Enable database audit logging
- ✅ Regular backups and test recovery

## API Security

- ✅ Rate limiting on all endpoints
- ✅ Input validation and sanitization
- ✅ Security headers (helmet middleware)
- ✅ CORS properly configured
- ✅ API versioning
- ✅ Audit logging for sensitive operations

## Frontend Security

- ✅ Content Security Policy (CSP) headers
- ✅ No sensitive data in localStorage (except tokens)
- ✅ Validate data from tRPC/API
- ✅ Error boundaries to prevent white screens
- ✅ No eval() or innerHTML with user data

## Deployment

- ✅ Use HTTPS/TLS
- ✅ Security headers configured
- ✅ Rate limiting at reverse proxy level (Nginx)
- ✅ DDoS protection
- ✅ Web Application Firewall (WAF)
- ✅ Regular security updates

## Secrets Management

For production:
- AWS Secrets Manager
- Google Cloud Secret Manager
- HashiCorp Vault
- Doppler
- 1Password Secrets

Never:
- ❌ Commit secrets to git
- ❌ Log secrets
- ❌ Pass secrets in URLs
- ❌ Share secrets via email/chat
