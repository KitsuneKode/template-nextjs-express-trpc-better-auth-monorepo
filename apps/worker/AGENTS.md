# Worker Notes

## Purpose

`apps/worker` is a placeholder worker workspace. The Redis and logger wiring
exists, but the runtime logic is still stub-level.

## Read First

- `src/index.ts`
- `src/redis/index.ts`
- `src/utils/logger.ts`

## Owns

- future background jobs
- worker-specific logging
- worker Redis connection bootstrap

## Current State

- `src/index.ts` only logs a placeholder startup message.
- There is no queue, scheduler, or real job processor yet.

## Common Tasks

- Build real jobs or consumers in `src/index.ts` or new files under `src/`
- Reuse the shared Redis/config/logger helpers instead of re-implementing them

## Cleanup Notes

- Remove this workspace if the product will not use background jobs.

## Update When

Update this file when real jobs, queues, schedules, or worker entrypoints are
added.
