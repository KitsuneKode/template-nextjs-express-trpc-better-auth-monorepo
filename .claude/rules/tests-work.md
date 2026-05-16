---
paths: ["tests/**"]
---

Tests workspace at `tests/` covers repo tooling and scaffold output validation:

- `src/toolings/` — tests for `repo-doctor.ts`, `template-cleanup.ts`
- `src/integration/` — runtime integration tests (auth flow, post CRUD, server health)

CLI-specific tests live in `apps/cli/tests/`, not in this workspace.

Run `bun test` from root to run all tests across workspaces.
