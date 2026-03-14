/**
 * GitHub Actions CI workflow generator
 *
 * Generates .github/workflows/ci.yml adapted to runtime and testing config.
 */

import type { ProjectConfig } from '../../types/schemas'

export function renderGithubActionsWorkflow(config: ProjectConfig): string {
  const testStep =
    config.testing !== 'none'
      ? `      - name: Run tests
        run: bun test tests/src
`
      : ''

  return (
    `name: CI

on:
  push:
    branches:
      - main
  pull_request:

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Bun
        uses: oven-sh/setup-bun@v2
        with:
          bun-version: 1.3.9

      - name: Install dependencies
        run: bun install --frozen-lockfile

      - name: Lint
        run: bun run lint

      - name: Typecheck
        run: bun run check-types

      - name: Repo doctor
        run: bun run repo:doctor:strict

${testStep}`.trimEnd() + '\n'
  )
}
