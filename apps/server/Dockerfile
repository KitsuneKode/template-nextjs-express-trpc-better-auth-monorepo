FROM oven/bun:1 AS base
WORKDIR /app

FROM base AS deps
COPY package.json bun.lock* ./
COPY apps/server/package.json apps/server/package.json
COPY packages packages
RUN bun install --frozen-lockfile

FROM base AS build
COPY tsconfig.json ./
COPY apps/server/tsconfig.json apps/server/tsconfig.json
COPY apps/server/src apps/server/src
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/packages ./packages
RUN bun build ./apps/server/src/server.ts --outdir ./apps/server/dist --target bun --minify --sourcemap

FROM oven/bun:1-slim AS production
WORKDIR /app
COPY --from=build /app/apps/server/dist ./dist
COPY --from=deps /app/node_modules ./node_modules
ENV NODE_ENV=production
EXPOSE 3001
CMD ["bun", "run", "dist/server.js"]
