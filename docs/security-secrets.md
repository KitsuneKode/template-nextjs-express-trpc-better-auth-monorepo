# Secrets and git hygiene

## Never commit

- `.env`, `.env.local`, `.env.production`, `.env.deploy`
- `wrangler.json` / `wrangler.toml` with `vars` or secrets inline
- Real `DATABASE_URL`, `REDIS_URL`, `BETTER_AUTH_SECRET`, OAuth client secrets

Use **platform dashboards** (Vercel, Render, Railway) or `wrangler secret put` for production values.

## `render.yaml` is not a secret store

Keys like `BETTER_AUTH_SECRET` use `sync: false` — you paste values in the Render dashboard only.  
Do **not** use `generateValue: true` in git if you want secrets created only in the dashboard with no blueprint-side generation.

## Local scan

```bash
gitleaks detect --source .
```

CI runs the same on every push/PR (`.github/workflows/gitleaks.yml`).

## If something leaked

1. **Rotate** every exposed credential (Neon password reset, new `BETTER_AUTH_SECRET`, Upstash token, OAuth clients).
2. Purge from git history: `git filter-repo --path path/to/file --invert-paths --force`
3. Force-push only after confirming with `gitleaks detect`; coordinate with anyone else using the repo.

## Template repo audit (2026-05)

- **GitHub `main`:** no real secrets found in history (gitleaks clean).
- **Removed from all local history:** `apps/server/wrangler.json` (had Neon `DATABASE_URL` + `BETTER_AUTH_SECRET` on branch `feat/biome` only — never pushed to `origin`).
- **Rotate** those credentials if they were ever used in production.
