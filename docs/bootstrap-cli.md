# Bootstrap CLI

`create-kitsu-stack` is the bootstrap CLI for this template. It is meant to
give this repo a friendlier first-run story, similar in spirit to
`create-better-t-stack`, but specialized for the actual structure and cleanup
flows already present here.

## Current Goal

- copy the template without repo-local noise
- rename the internal package scope to the new project name
- optionally strip showcase code and optional workspaces
- optionally generate Docker, CI, and deployment docs

## Local Development

```sh
bun run dev:cli -- my-app
```

## Planned Published Usage

```sh
bunx create-kitsu-stack my-app
```

## Generated Extras

- `apps/web/.env.example`
- `apps/server/.env.example`
- `docker-compose.yml` when Docker services are enabled
- `.github/workflows/ci.yml` when CI is enabled
- `docs/deployment.md` when the deployment guide is enabled

## Defaults

- strip showcase routes
- remove the worker workspace
- keep the Bun tests workspace
- generate Docker and CI
- generate a Vercel plus Railway deployment guide
- initialize git
- run `bun install`
