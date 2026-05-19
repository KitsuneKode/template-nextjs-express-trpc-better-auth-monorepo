# Build from repository root:
#   docker build -f apps/server/Dockerfile .

# Pin Bun to match .bun-version — floating `oven/bun:1` (e.g. 1.3.14) breaks frozen lockfile.
ARG BUN_VERSION=1.3.12
FROM oven/bun:${BUN_VERSION} AS base
WORKDIR /app

FROM base AS deps
COPY package.json bun.lock turbo.json ./
COPY toolings toolings
COPY packages packages
# All workspace package.json files must exist before `bun install` at repo root.
COPY apps/server/package.json apps/server/package.json
COPY apps/web/package.json apps/web/package.json
COPY apps/cli/package.json apps/cli/package.json
COPY apps/worker/package.json apps/worker/package.json
COPY tests/package.json tests/package.json
COPY apps/server apps/server
ENV CI=true
RUN bun install --frozen-lockfile

FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY package.json bun.lock turbo.json ./
COPY toolings toolings
COPY apps/server apps/server
COPY packages packages
RUN bun run build --filter=@template/server

FROM oven/bun:${BUN_VERSION}-slim AS production
WORKDIR /app/apps/server
ENV NODE_ENV=production
ENV HOST=0.0.0.0
# PORT is injected by Render at runtime; 8080 is only a local `docker run` fallback.
ENV PORT=8080
COPY --from=build /app/apps/server/dist ./dist
COPY --from=build /app/node_modules /app/node_modules
EXPOSE 8080
CMD ["bun", "./dist/server.js"]
