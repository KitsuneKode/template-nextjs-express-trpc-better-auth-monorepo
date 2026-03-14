# Backend Common Notes

## Purpose

`packages/backend-common` holds shared backend utilities used by both the server
and the worker.

## Read First

- `src/utils/config.ts`
- `src/utils/logger.ts`
- `src/redis/index.ts`
- `package.json`

## Owns

- backend env validation
- worker env validation
- shared winston logger factory
- shared Bun Redis client helper

## Common Tasks

- add or rename backend env keys:
  `src/utils/config.ts`
- change log format or file output:
  `src/utils/logger.ts`
- change Redis connection creation:
  `src/redis/index.ts`

## Notes

- `src/index.ts` is effectively empty; meaningful imports use subpath exports.

## Update When

Update this file when env schemas, log behavior, Redis wiring, or package
exports change.
