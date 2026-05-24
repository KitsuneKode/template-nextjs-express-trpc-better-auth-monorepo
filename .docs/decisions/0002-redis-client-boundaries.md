# 0002 Redis client boundaries

## Status

Accepted.

## Decision

Use the official `redis` package (`node-redis`) for application-owned Redis
access. Keep `ioredis` only behind BullMQ connection helpers.

## Context

The fullstack template currently has two different Redis concerns:

- `@arche-template/backend-common/redis` provides lifecycle connectivity for
  the API and worker bootstrap.
- `@arche-template/backend-common/redis/bull` provides `Queue` and `Worker`
  connections for BullMQ.

The application lifecycle helper was moved from Bun's Redis API to `ioredis`
when a Render runtime did not provide the expected Bun Redis client. That fixed
deployment startup, but it made the general application boundary inherit the
queue implementation's client choice.

Redis recommends `redis` as the maintained JavaScript client for new
application integrations. BullMQ documents and types its reusable connection
boundary around `ioredis`.

## Consequences

- Direct cache, session, command, and future Redis Stack integrations should
  start from `@arche-template/backend-common/redis`, backed by `redis`.
- Queue producers and workers import only
  `@arche-template/backend-common/redis/bull`, backed by `ioredis`.
- Generated TypeScript fullstack projects retain both dependencies while the
  BullMQ worker/admin surface is present.
- Projects that later remove queues can remove the BullMQ helper and
  `ioredis` without rewriting their application Redis client.
- Do not pass an application `redis` client into BullMQ. Keep the two
  connection lifecycles explicit.

## Verification

- Typechecking must validate the two client APIs independently.
- Scaffold tests must prove generated TypeScript fullstack output records both
  dependencies and preserves the separate subpath exports.
- Full repository CI and the Vercel server build must remain green.
