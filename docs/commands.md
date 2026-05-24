# Commands

## Repository development

- `bun install` - Install workspace dependencies and run postinstall generation.
- `bun dev` - Run all workspace dev tasks through Turbo.
- `bun run dev:web` - Run the Next.js app.
- `bun run dev:server` - Run the TypeScript API server.
- `bun run dev:worker` - Run the worker.
- `bun run dev:cli -- <args>` - Run the Arche CLI from source.

## CLI development

- `bun run dev:cli -- my-app --yes --dir=../projects` - Scaffold from source.
- `bun run build:cli` - Build `@arche/create`.
- `bun test apps/cli/tests` - Run CLI tests.
- `bun run --cwd apps/cli check-types` - Typecheck the CLI package.
- `bun run --cwd apps/cli lint` - Lint the CLI package.

## Web development

- `bun run --cwd apps/web check-types` - Typecheck the web app.
- `bun run --cwd apps/web lint` - Lint the web app.
- `bun test apps/web/app/route-discovery.test.ts` - Check hidden design-lab route discovery controls.

## Build and checks

- `bun run build` - Build the workspace.
- `bun run lint` - Lint packages through Turbo.
- `bun run check-types` - Run workspace type checks.
- `bun run format` - Format with Oxfmt.
- `bun run format:check` - Check formatting.
- `bun run repo:doctor` - Audit stale scaffolding, broken exports, placeholder files, and doc drift.
- `bun run repo:doctor:strict` - Fail on warnings and errors for CI or pre-release checks.

## Database

- `bun run db:generate` - Generate Prisma client.
- `bun run db:migrate` - Run Prisma migrate dev via Turbo.
- `bun run db:seed` - Seed the database.
- `bun run db:studio` - Open Prisma Studio.

## Template operations

- `bun run rename-scope:dry` - Preview package-name replacement.
- `bun run rename-scope` - Apply scope rename across the repo.
- `bun run rename-scope:verbose` - Apply scope rename with verbose logging.
- `bun run template:clean:dry` - Preview cleanup for showcase code and optional workspaces.
- `bun run template:clean` - Apply the recommended cleanup plan.

## Deployment smoke

- `bun run test:deploy` - Live API smoke against the default Render target.
- `bun run test:deploy:all` - Smoke Render and template Vercel URLs where accessible.

These commands hit live services only when the required environment variables
are set and deployment protection allows access.

## Commit validation

- `bun run commit:check` - Validate the most recent commit message.

Preferred format:

```text
type(scope): short imperative summary
```

Example:

```text
feat(cli): add solana program preset
```
