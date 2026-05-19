<p align="center">
  <strong>Arche</strong> — The beginning of every project
</p>

<p align="center">
  Full-stack TypeScript monorepo template and CLI.<br/>
  Next.js, Express, tRPC, Better Auth, Prisma, Turborepo — wired and ready.
</p>

<p align="center">
  <a href="https://arche.kitsunelabs.xyz">arche.kitsunelabs.xyz</a>
  ·
  <a href="https://github.com/KitsuneKode/template-nextjs-express-trpc-bettera-auth-monorepo/actions/workflows/ci.yml">
    <img src="https://github.com/KitsuneKode/template-nextjs-express-trpc-bettera-auth-monorepo/actions/workflows/ci.yml/badge.svg" alt="CI" />
  </a>
</p>

---

## Create a project

```sh
npx arche create my-app
cd my-app
bun install
bun dev
```

From this monorepo (development):

```sh
bun run dev:cli -- my-app --yes --dir=../projects
```

> Scaffold **outside** the template repo when using defaults: use `--dir=../projects` or similar.

## Documentation

- **Deploy:** [docs/deployment.md](docs/deployment.md) · [production playbook](docs/production-playbook.md)
- CLI usage: [docs/bootstrap-cli.md](docs/bootstrap-cli.md)
- CLI development: [docs/cli-development.md](docs/cli-development.md)
- Portfolio `SHOWCASE.mdx`: [docs/portfolio-sync.md](docs/portfolio-sync.md)

## Repository layout

```text
apps/
  server/     Express + tRPC + Better Auth
  web/        Next.js (marketing site + app)
  cli/        @arche/create bootstrap CLI
  worker/     Background jobs
packages/     Shared auth, store, trpc, ui, …
```

## Use as a template (without CLI)

```sh
bun create turbo@latest --example https://github.com/KitsuneKode/template-nextjs-express-trpc-bettera-auth-monorepo
```

Requires [Bun](https://bun.sh).
