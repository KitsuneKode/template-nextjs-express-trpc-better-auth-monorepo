# Build from repository root:
#   docker build -f apps/server/Dockerfile .

FROM oven/bun:1 AS base
WORKDIR /app

FROM base AS deps
COPY package.json bun.lock turbo.json ./
COPY toolings toolings
COPY apps/server/package.json apps/server/package.json
COPY packages packages
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

FROM oven/bun:1-slim AS production
WORKDIR /app/apps/server
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=8080
COPY --from=build /app/apps/server/dist ./dist
COPY --from=build /app/node_modules /app/node_modules
EXPOSE 8080
CMD ["bun", "./dist/server.js"]
