# Generated-project verification matrix

This matrix records evidence for preset support claims. A route can only be
called `Stable` after its advertised package-manager/runtime routes pass the
relevant generated-project checks.

The code-level guard lives in
`apps/cli/src/registry/verification-matrix.ts`.

## Status key

- `yes` - verified by current tests or generated-output checks.
- `no` - not yet verified.
- `n/a` - not applicable to the preset.

## Current evidence

| Preset                 | Structure | Bun | pnpm | Install | Lint | Typecheck | Test | Build | Docs/agent | Rust gates | Solana gates | Deploy |
| ---------------------- | --------- | --- | ---- | ------- | ---- | --------- | ---- | ----- | ---------- | ---------- | ------------ | ------ |
| `typescript-fullstack` | yes       | yes | yes  | no      | no   | no        | no   | no    | yes        | n/a        | n/a          | no     |
| `rust-api`             | yes       | yes | no   | no      | no   | no        | no   | no    | yes        | no         | n/a          | no     |
| `rust-fullstack`       | yes       | yes | no   | no      | no   | no        | no   | no    | yes        | no         | n/a          | no     |
| `solana-program`       | no        | no  | no   | no      | no   | no        | no   | no    | no         | n/a        | no           | no     |
| `solana-web`           | no        | no  | no   | no      | no   | no        | no   | no    | no         | n/a        | no           | no     |
| `solana-mobile`        | no        | no  | no   | no      | no   | no        | no   | no    | no         | n/a        | no           | no     |
| `solana-product`       | no        | no  | no   | no      | no   | no        | no   | no    | no         | n/a        | no           | no     |
| `customize`            | no        | no  | no   | no      | no   | no        | no   | no    | no         | n/a        | n/a          | no     |
| `experiments`          | no        | no  | no   | no      | no   | no        | no   | no    | no         | n/a        | n/a          | no     |

## Current proof sources

- TypeScript fullstack structure and Bun/pnpm catalog output:
  `apps/cli/tests/workspace-output.test.ts`.
- Standalone JavaScript package-manager pinning:
  `apps/cli/tests/workspace-output.test.ts`.
- Rust API structure:
  `apps/cli/tests/rust-scaffold.test.ts`.
- Rust-backed fullstack structure and Cargo workspace:
  `apps/cli/tests/preset-scaffold.test.ts`.
- Agent-context output:
  `apps/cli/tests/agent-context.test.ts` and `apps/cli/tests/add.test.ts`.
- Preset support-label guard:
  `apps/cli/tests/registry.test.ts` and
  `apps/cli/tests/verification-matrix.test.ts`.

## Stable graduation requirements

Before any preset becomes `Stable`, add generated-project checks that prove:

- the project can be generated from the preset and package manager;
- dependencies can be installed or the route has a documented no-install mode;
- lint/typecheck/test/build commands pass where the generated project advertises
  them;
- Rust routes pass Cargo workspace checks and Rust quality gates;
- Solana routes generate the expected Anchor/client/mobile/web boundaries and
  pass available local Solana/Anchor checks;
- deployment docs/config match the generated shape;
- generated `AGENTS.md`, `.docs`, `.plans`, and `arche.json` remain accurate.
