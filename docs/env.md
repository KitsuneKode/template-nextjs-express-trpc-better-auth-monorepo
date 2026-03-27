# Environment Variables

## Client (Next.js)

- `NEXT_PUBLIC_APP_URL` — Frontend URL
- `NEXT_PUBLIC_API_URL` — Backend API URL
- `NODE_ENV` — Environment (development/production)

## Server (Express)

- `PORT` — Server port
- `FRONTEND_URL` — Allowed frontend origin
- `DATABASE_URL` — PostgreSQL connection string
- `REDIS_URL` — Redis connection string
- `BETTER_AUTH_URL` — Auth server URL
- `BETTER_AUTH_SECRET` — Auth secret key
- `NODE_ENV` — Environment

## Optional Social Auth

- `GITHUB_CLIENT_ID` — GitHub OAuth client ID
- `GITHUB_CLIENT_SECRET` — GitHub OAuth client secret
- `GOOGLE_CLIENT_ID` — Google OAuth client ID
- `GOOGLE_CLIENT_SECRET` — Google OAuth client secret

`apps/server/.env.example` is the safe example source for the backend keys.
