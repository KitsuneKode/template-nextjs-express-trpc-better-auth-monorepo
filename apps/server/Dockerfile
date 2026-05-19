# Build from repository root:
#   docker build -f apps/server/Dockerfile .
#
# Uses turbo prune (see KitsuneKode/buzz8n docker/Dockerfile.server) so workspace
# deps resolve correctly during `bun build`.

ARG BUN_VERSION=1.3.12
FROM oven/bun:${BUN_VERSION} AS base
WORKDIR /app

# --- Prune monorepo to @template/server and its workspace dependencies ---
FROM base AS pruner
COPY . .
RUN bunx turbo@2.9.14 prune @template/server --docker

# --- Install deps from pruned lockfile (no Husky / git hooks) ---
FROM base AS deps
WORKDIR /app
COPY --from=pruner /app/out/json/ .
ENV CI=true
ENV HUSKY=0
RUN bun install --frozen-lockfile

# --- Generate Prisma client + build server (turbo ^build graph) ---
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=pruner /app/out/full/ .
ENV CI=true
ENV HUSKY=0
RUN bun run db:generate
RUN bun run build --filter=@template/server

# --- Production runtime ---
FROM oven/bun:${BUN_VERSION}-slim AS production
WORKDIR /app/apps/server
ENV NODE_ENV=production
ENV HOST=0.0.0.0
# PORT is injected by Render at runtime; 8080 is a local `docker run` fallback only.
ENV PORT=8080

COPY --from=builder /app/apps/server/dist ./dist
COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/packages /app/packages
COPY --from=builder /app/apps/server/package.json ./package.json

EXPOSE 8080
CMD ["bun", "./dist/server.js"]
