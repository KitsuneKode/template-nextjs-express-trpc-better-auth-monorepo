# CLI Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the flat family-first CLI foundation with the first capability-registry, recipe, context, and package-manager primitives needed for verified presets.

**Architecture:** Keep existing scaffold behavior working while introducing the new model beside it. The first slice adds typed registry/recipe modules, native Bun/pnpm workspace renderers, generated agent-context docs, and tests that prove the model can drive future CLI prompts and generated output.

**Tech Stack:** Bun, TypeScript, Zod, Turborepo, oxlint/oxfmt conventions, existing `bun test` suite.

---

## Outcome

Completed on 2026-05-24.

- Added additive registry, compatibility, recipe, replay, workspace-renderer,
  and agent-context modules.
- Kept existing family parsing and scaffold behavior available.
- Corrected the original plan while implementing: target presets remain
  `requiresValidation` until their generated-project verification matrices are
  implemented and passing.
- Verified `bun test apps/cli/tests`: 250 pass, 1 pre-existing skipped E2E, 0
  fail.
- Verified `bun run --cwd apps/cli check-types`: pass.
- Verified `bun run --cwd apps/cli lint`: pass.

## Scope

This is the first implementation slice only. It does not rewrite every template or mark new presets stable. It creates the foundation needed for later preset renderers.

## File Map

- Create: `apps/cli/src/registry/support-status.ts` - support status type and labels.
- Create: `apps/cli/src/registry/capabilities.ts` - capability definitions and compatibility metadata.
- Create: `apps/cli/src/registry/presets.ts` - curated preset definitions.
- Create: `apps/cli/src/registry/compatibility.ts` - validation for preset/capability selections.
- Create: `apps/cli/src/recipe/schema.ts` - `arche.json` schema and inferred types.
- Create: `apps/cli/src/recipe/replay.ts` - replay command builder for recipes.
- Create: `apps/cli/src/render/workspace/bun.ts` - Bun workspace/catalog renderer.
- Create: `apps/cli/src/render/workspace/pnpm.ts` - pnpm workspace/catalog renderer.
- Create: `apps/cli/src/render/workspace/turbo.ts` - root scripts and Turbo command helpers.
- Create: `apps/cli/src/render/docs/agent-context.ts` - generated `AGENTS.md`, symlink policy text, `.docs`, and `.plans` index renderers.
- Modify: `apps/cli/src/types/schemas.ts` - add new preset/package-manager/runtime enums while keeping old family config compatible.
- Modify: `apps/cli/src/lib/reproducible.ts` - support recipe-style replay commands without removing legacy commands.
- Test: `apps/cli/tests/registry.test.ts`
- Test: `apps/cli/tests/recipe.test.ts`
- Test: `apps/cli/tests/workspace-renderers.test.ts`
- Test: `apps/cli/tests/agent-context.test.ts`
- Test: update `apps/cli/tests/schemas.test.ts`

## Task 1: Add Support Status And Registry Types

**Files:**

- Create: `apps/cli/src/registry/support-status.ts`
- Create: `apps/cli/src/registry/capabilities.ts`
- Create: `apps/cli/src/registry/presets.ts`
- Test: `apps/cli/tests/registry.test.ts`

- [ ] **Step 1: Write failing registry tests**

Create `apps/cli/tests/registry.test.ts`:

```ts
import { describe, expect, it } from 'bun:test'
import { CAPABILITIES } from '../src/registry/capabilities'
import { PRESETS } from '../src/registry/presets'
import { SUPPORT_LABELS } from '../src/registry/support-status'

describe('capability registry', () => {
  it('labels supported states for menu display', () => {
    expect(SUPPORT_LABELS.stable).toBe('Stable')
    expect(SUPPORT_LABELS.experimental).toBe('Experimental')
    expect(SUPPORT_LABELS.requiresValidation).toBe('Requires validation')
  })

  it('keeps Bun default and pnpm first-class', () => {
    expect(CAPABILITIES.packageManager.options.bun.status).toBe('stable')
    expect(CAPABILITIES.packageManager.options.bun.default).toBe(true)
    expect(CAPABILITIES.packageManager.options.pnpm.status).toBe('stable')
    expect(CAPABILITIES.packageManager.options.npm.status).toBe('experimental')
  })

  it('defines the first approved preset set', () => {
    expect(PRESETS.map((preset) => preset.id)).toEqual([
      'typescript-fullstack',
      'rust-api',
      'rust-fullstack',
      'solana-program',
      'solana-web',
      'solana-mobile',
      'solana-product',
      'customize',
      'experiments',
    ])
  })

  it('does not mark experiments stable', () => {
    const experiments = PRESETS.find((preset) => preset.id === 'experiments')
    expect(experiments?.status).toBe('experimental')
  })
})
```

- [ ] **Step 2: Run the failing test**

Run:

```bash
bun test apps/cli/tests/registry.test.ts
```

Expected: fail because `../src/registry/*` modules do not exist.

- [ ] **Step 3: Add support status module**

Create `apps/cli/src/registry/support-status.ts`:

```ts
export type SupportStatus = 'stable' | 'experimental' | 'requiresValidation'

export const SUPPORT_LABELS: Record<SupportStatus, string> = {
  stable: 'Stable',
  experimental: 'Experimental',
  requiresValidation: 'Requires validation',
}

export function formatSupportStatus(status: SupportStatus): string {
  return SUPPORT_LABELS[status]
}
```

- [ ] **Step 4: Add capability definitions**

Create `apps/cli/src/registry/capabilities.ts`:

```ts
import type { SupportStatus } from './support-status'

export interface CapabilityOption {
  id: string
  label: string
  status: SupportStatus
  default?: boolean
  description?: string
}

export interface CapabilityDefinition {
  id: string
  label: string
  options: Record<string, CapabilityOption>
}

export const CAPABILITIES = {
  packageManager: {
    id: 'package-manager',
    label: 'Package manager',
    options: {
      bun: {
        id: 'bun',
        label: 'Bun',
        status: 'stable',
        default: true,
        description: 'Default workspace/package manager with Bun-native catalogs.',
      },
      pnpm: {
        id: 'pnpm',
        label: 'pnpm',
        status: 'stable',
        description: 'First-class workspace/package manager with pnpm-native catalogs.',
      },
      npm: {
        id: 'npm',
        label: 'npm',
        status: 'experimental',
        description: 'Not part of the stable generated-project matrix.',
      },
    },
  },
  typescriptRuntime: {
    id: 'typescript-runtime',
    label: 'TypeScript runtime',
    options: {
      node: { id: 'node', label: 'Node.js', status: 'stable', default: true },
      bun: { id: 'bun', label: 'Bun runtime', status: 'requiresValidation' },
    },
  },
  rustApi: {
    id: 'rust-api',
    label: 'Rust API',
    options: {
      axum: { id: 'axum', label: 'Axum', status: 'stable', default: true },
    },
  },
  database: {
    id: 'database',
    label: 'Database',
    options: {
      postgresSqlx: {
        id: 'postgres-sqlx',
        label: 'Postgres + SQLx',
        status: 'stable',
        default: true,
      },
      none: { id: 'none', label: 'None', status: 'stable' },
      seaOrm: { id: 'sea-orm', label: 'SeaORM', status: 'experimental' },
    },
  },
} as const satisfies Record<string, CapabilityDefinition>
```

- [ ] **Step 5: Add preset definitions**

Create `apps/cli/src/registry/presets.ts`:

```ts
import type { SupportStatus } from './support-status'

export type PresetId =
  | 'typescript-fullstack'
  | 'rust-api'
  | 'rust-fullstack'
  | 'solana-program'
  | 'solana-web'
  | 'solana-mobile'
  | 'solana-product'
  | 'customize'
  | 'experiments'

export interface PresetDefinition {
  id: PresetId
  label: string
  status: SupportStatus
  description: string
  capabilities: string[]
}

export const PRESETS: PresetDefinition[] = [
  {
    id: 'typescript-fullstack',
    label: 'TypeScript Fullstack',
    status: 'stable',
    description:
      'Next.js plus TypeScript API, contracts, auth, database, and deployment foundations.',
    capabilities: ['web', 'api', 'database', 'auth', 'deployment'],
  },
  {
    id: 'rust-api',
    label: 'Rust API',
    status: 'stable',
    description: 'Axum API with Cargo workspace, SQLx-ready persistence, and Rust quality gates.',
    capabilities: ['api', 'database', 'deployment'],
  },
  {
    id: 'rust-fullstack',
    label: 'Rust Fullstack',
    status: 'stable',
    description: 'Next.js frontend plus Axum API with Cargo workspace and Clerk/JWT auth boundary.',
    capabilities: ['web', 'api', 'database', 'auth', 'deployment'],
  },
  {
    id: 'solana-program',
    label: 'Solana Program',
    status: 'stable',
    description: 'Anchor program foundation with IDL/client generation contract.',
    capabilities: ['solana-program', 'generated-client'],
  },
  {
    id: 'solana-web',
    label: 'Solana Web dApp',
    status: 'stable',
    description: 'Next.js dApp with Anchor program and generated Solana client.',
    capabilities: ['web', 'solana-program', 'generated-client', 'web-wallet'],
  },
  {
    id: 'solana-mobile',
    label: 'Solana Mobile dApp',
    status: 'stable',
    description:
      'Expo Router app with Anchor program, generated client, and mobile wallet boundary.',
    capabilities: ['mobile', 'solana-program', 'generated-client', 'mobile-wallet'],
  },
  {
    id: 'solana-product',
    label: 'Solana Product',
    status: 'stable',
    description: 'Web, mobile, program, generated client, and shared Solana configuration.',
    capabilities: [
      'web',
      'mobile',
      'solana-program',
      'generated-client',
      'web-wallet',
      'mobile-wallet',
    ],
  },
  {
    id: 'customize',
    label: 'Customize',
    status: 'requiresValidation',
    description: 'Build from supported capabilities with compatibility validation.',
    capabilities: [],
  },
  {
    id: 'experiments',
    label: 'Experiments',
    status: 'experimental',
    description: 'Explicit opt-in for proof-gated or unstable stack routes.',
    capabilities: [],
  },
]
```

- [ ] **Step 6: Verify registry test passes**

Run:

```bash
bun test apps/cli/tests/registry.test.ts
```

Expected: pass.

## Task 2: Add Recipe Schema And Replay Commands

**Files:**

- Create: `apps/cli/src/recipe/schema.ts`
- Create: `apps/cli/src/recipe/replay.ts`
- Modify: `apps/cli/src/types/schemas.ts`
- Modify: `apps/cli/src/lib/reproducible.ts`
- Test: `apps/cli/tests/recipe.test.ts`
- Test: update `apps/cli/tests/schemas.test.ts`

- [ ] **Step 1: Write failing recipe tests**

Create `apps/cli/tests/recipe.test.ts`:

```ts
import { describe, expect, it } from 'bun:test'
import { RecipeSchema } from '../src/recipe/schema'
import { buildRecipeReplayCommand } from '../src/recipe/replay'

describe('recipe schema', () => {
  it('parses the approved rust-fullstack recipe shape', () => {
    const recipe = RecipeSchema.parse({
      version: 1,
      preset: 'rust-fullstack',
      support: 'stable',
      packageManager: 'bun',
      runtime: { web: 'node', api: 'rust' },
      workspace: { turbo: true, cargo: true },
      capabilities: {
        web: { framework: 'next' },
        api: { language: 'rust', framework: 'axum' },
        database: { engine: 'postgres', client: 'sqlx', owner: 'rust' },
        auth: { provider: 'clerk' },
        deployment: { target: 'vercel-render' },
      },
    })

    expect(recipe.preset).toBe('rust-fullstack')
    expect(recipe.workspace.cargo).toBe(true)
  })

  it('rejects npm as a stable package manager in recipes', () => {
    expect(() =>
      RecipeSchema.parse({
        version: 1,
        preset: 'typescript-fullstack',
        support: 'stable',
        packageManager: 'npm',
        runtime: { web: 'node' },
        workspace: { turbo: true, cargo: false },
        capabilities: {},
      }),
    ).toThrow()
  })
})

describe('recipe replay', () => {
  it('builds a stable replay command', () => {
    const command = buildRecipeReplayCommand('acme', {
      version: 1,
      preset: 'rust-fullstack',
      support: 'stable',
      packageManager: 'bun',
      runtime: { web: 'node', api: 'rust' },
      workspace: { turbo: true, cargo: true },
      capabilities: {
        auth: { provider: 'clerk' },
        database: { engine: 'postgres', client: 'sqlx', owner: 'rust' },
        deployment: { target: 'vercel-render' },
      },
    })

    expect(command).toBe(
      'arche create acme --preset rust-fullstack --package-manager bun --web-runtime node --auth clerk --db postgres-sqlx --deploy vercel-render',
    )
  })
})
```

- [ ] **Step 2: Run the failing recipe test**

Run:

```bash
bun test apps/cli/tests/recipe.test.ts
```

Expected: fail because recipe modules do not exist.

- [ ] **Step 3: Add recipe schema**

Create `apps/cli/src/recipe/schema.ts`:

```ts
import { z } from 'zod'

export const StablePackageManagerSchema = z.enum(['bun', 'pnpm'])
export type StablePackageManager = z.infer<typeof StablePackageManagerSchema>

export const RecipeSchema = z.object({
  $schema: z.string().optional(),
  version: z.literal(1),
  preset: z.enum([
    'typescript-fullstack',
    'rust-api',
    'rust-fullstack',
    'solana-program',
    'solana-web',
    'solana-mobile',
    'solana-product',
    'customize',
    'experiments',
  ]),
  support: z.enum(['stable', 'experimental', 'requiresValidation']),
  packageManager: StablePackageManagerSchema,
  runtime: z.record(z.string(), z.string()),
  workspace: z.object({
    turbo: z.boolean().default(true),
    cargo: z.boolean().default(false),
  }),
  capabilities: z.record(z.string(), z.record(z.string(), z.unknown())),
})

export type Recipe = z.infer<typeof RecipeSchema>
```

- [ ] **Step 4: Add recipe replay builder**

Create `apps/cli/src/recipe/replay.ts`:

```ts
import type { Recipe } from './schema'

export function buildRecipeReplayCommand(projectName: string, recipe: Recipe): string {
  const parts = [
    'arche',
    'create',
    projectName,
    '--preset',
    recipe.preset,
    '--package-manager',
    recipe.packageManager,
  ]

  const webRuntime = recipe.runtime.web
  if (webRuntime) parts.push('--web-runtime', webRuntime)

  const authProvider = recipe.capabilities.auth?.provider
  if (typeof authProvider === 'string') parts.push('--auth', authProvider)

  const database = recipe.capabilities.database
  if (
    typeof database?.engine === 'string' &&
    typeof database?.client === 'string' &&
    database.engine !== 'none'
  ) {
    parts.push('--db', `${database.engine}-${database.client}`)
  }

  const deployTarget = recipe.capabilities.deployment?.target
  if (typeof deployTarget === 'string') parts.push('--deploy', deployTarget)

  return parts.join(' ')
}
```

- [ ] **Step 5: Extend public schemas without breaking legacy config**

Modify `apps/cli/src/types/schemas.ts` by adding new schemas near the existing package-manager schema:

```ts
export const PresetSchema = z.enum([
  'typescript-fullstack',
  'rust-api',
  'rust-fullstack',
  'solana-program',
  'solana-web',
  'solana-mobile',
  'solana-product',
  'customize',
  'experiments',
])
export type Preset = z.infer<typeof PresetSchema>

export const StablePackageManagerSchema = z.enum(['bun', 'pnpm'])
export type StablePackageManager = z.infer<typeof StablePackageManagerSchema>
```

Then change `PackageManagerSchema` to keep legacy parsing but mark npm as non-stable in comments:

```ts
export const PackageManagerSchema = z.enum(['bun', 'pnpm', 'npm'])
export type PackageManager = z.infer<typeof PackageManagerSchema>
```

Do not remove the existing family schema in this task.

- [ ] **Step 6: Add schema expectations**

Update `apps/cli/tests/schemas.test.ts` to import `PresetSchema` and `StablePackageManagerSchema`, then add:

```ts
describe('new preset schemas', () => {
  it('parses approved presets', () => {
    expect(PresetSchema.parse('rust-fullstack')).toBe('rust-fullstack')
    expect(PresetSchema.parse('solana-product')).toBe('solana-product')
  })

  it('keeps stable package managers to Bun and pnpm', () => {
    expect(StablePackageManagerSchema.parse('bun')).toBe('bun')
    expect(StablePackageManagerSchema.parse('pnpm')).toBe('pnpm')
    expect(() => StablePackageManagerSchema.parse('npm')).toThrow()
  })
})
```

- [ ] **Step 7: Verify recipe and schema tests**

Run:

```bash
bun test apps/cli/tests/recipe.test.ts apps/cli/tests/schemas.test.ts
```

Expected: pass.

## Task 3: Add Native Bun And pnpm Workspace Renderers

**Files:**

- Create: `apps/cli/src/render/workspace/bun.ts`
- Create: `apps/cli/src/render/workspace/pnpm.ts`
- Create: `apps/cli/src/render/workspace/turbo.ts`
- Test: `apps/cli/tests/workspace-renderers.test.ts`

- [ ] **Step 1: Write failing workspace renderer tests**

Create `apps/cli/tests/workspace-renderers.test.ts`:

```ts
import { describe, expect, it } from 'bun:test'
import { renderBunRootPackageJson } from '../src/render/workspace/bun'
import { renderPnpmWorkspaceYaml } from '../src/render/workspace/pnpm'
import { renderTurboRootScripts } from '../src/render/workspace/turbo'

const catalog = {
  typescript: '^5.7.3',
  turbo: '^2.3.3',
  vitest: '^4.0.0',
  '@types/node': '^24.10.13',
  '@types/bun': '^1.3.11',
}

describe('workspace renderers', () => {
  it('renders Bun-native workspaces and catalogs', () => {
    const pkg = renderBunRootPackageJson({
      name: 'acme',
      packages: ['apps/*', 'packages/*', 'tooling/*'],
      catalog,
      bunVersion: '1.3.11',
      nodeVersion: '24.13.1',
    })

    expect(pkg.packageManager).toBe('bun@1.3.11')
    expect(pkg.workspaces.packages).toContain('apps/*')
    expect(pkg.workspaces.catalog.typescript).toBe('^5.7.3')
    expect(pkg.engines).toEqual({ bun: '^1.3.11', node: '^24.13.1' })
  })

  it('renders pnpm-native workspace catalogs', () => {
    const yaml = renderPnpmWorkspaceYaml({
      packages: ['apps/*', 'packages/*', 'tooling/*'],
      catalog,
    })

    expect(yaml).toContain('packages:')
    expect(yaml).toContain('  - apps/*')
    expect(yaml).toContain('catalog:')
    expect(yaml).toContain('  typescript: ^5.7.3')
    expect(yaml).toContain('  "@types/node": ^24.10.13')
  })

  it('uses turbo run in root scripts', () => {
    expect(renderTurboRootScripts()).toEqual({
      dev: 'turbo run dev',
      build: 'turbo run build',
      typecheck: 'turbo run typecheck',
      lint: 'turbo run lint',
      test: 'turbo run test',
      fmt: 'oxfmt',
      'fmt:check': 'oxfmt --check',
    })
  })
})
```

- [ ] **Step 2: Run failing workspace tests**

Run:

```bash
bun test apps/cli/tests/workspace-renderers.test.ts
```

Expected: fail because workspace renderer modules do not exist.

- [ ] **Step 3: Add Turbo script renderer**

Create `apps/cli/src/render/workspace/turbo.ts`:

```ts
export function renderTurboRootScripts(): Record<string, string> {
  return {
    dev: 'turbo run dev',
    build: 'turbo run build',
    typecheck: 'turbo run typecheck',
    lint: 'turbo run lint',
    test: 'turbo run test',
    fmt: 'oxfmt',
    'fmt:check': 'oxfmt --check',
  }
}
```

- [ ] **Step 4: Add Bun renderer**

Create `apps/cli/src/render/workspace/bun.ts`:

```ts
import { renderTurboRootScripts } from './turbo'

export interface BunRootPackageJsonOptions {
  name: string
  packages: string[]
  catalog: Record<string, string>
  bunVersion: string
  nodeVersion: string
}

export function renderBunRootPackageJson(
  options: BunRootPackageJsonOptions,
): Record<string, unknown> {
  return {
    name: options.name,
    private: true,
    type: 'module',
    workspaces: {
      packages: options.packages,
      catalog: options.catalog,
    },
    scripts: renderTurboRootScripts(),
    engines: {
      bun: `^${options.bunVersion}`,
      node: `^${options.nodeVersion}`,
    },
    packageManager: `bun@${options.bunVersion}`,
  }
}
```

- [ ] **Step 5: Add pnpm renderer**

Create `apps/cli/src/render/workspace/pnpm.ts`:

```ts
export interface PnpmWorkspaceYamlOptions {
  packages: string[]
  catalog: Record<string, string>
}

function quoteYamlKey(key: string): string {
  return key.startsWith('@') ? `"${key}"` : key
}

export function renderPnpmWorkspaceYaml(options: PnpmWorkspaceYamlOptions): string {
  const packageLines = options.packages.map((pattern) => `  - ${pattern}`)
  const catalogLines = Object.entries(options.catalog).map(
    ([name, version]) => `  ${quoteYamlKey(name)}: ${version}`,
  )

  return ['packages:', ...packageLines, '', 'catalog:', ...catalogLines, ''].join('\n')
}
```

- [ ] **Step 6: Verify workspace renderer tests**

Run:

```bash
bun test apps/cli/tests/workspace-renderers.test.ts
```

Expected: pass.

## Task 4: Add Agent Context Renderers

**Files:**

- Create: `apps/cli/src/render/docs/agent-context.ts`
- Test: `apps/cli/tests/agent-context.test.ts`

- [ ] **Step 1: Write failing agent-context tests**

Create `apps/cli/tests/agent-context.test.ts`:

```ts
import { describe, expect, it } from 'bun:test'
import {
  renderGeneratedAgentsMd,
  renderInternalDocsIndex,
  renderPlansIndex,
} from '../src/render/docs/agent-context'

describe('agent context renderers', () => {
  it('keeps AGENTS.md short and directive', () => {
    const content = renderGeneratedAgentsMd({ projectName: 'acme' })
    expect(content).toContain('# Agent guide')
    expect(content).toContain('Read this file first')
    expect(content).toContain('.docs/README.md')
    expect(content).toContain('.plans/active')
    expect(content).not.toContain('CONTEXT.md')
    expect(content).not.toContain('.cursor/rules')
    expect(content).not.toContain('.claude/rules')
  })

  it('renders internal docs index with loading rules', () => {
    const content = renderInternalDocsIndex()
    expect(content).toContain('Do not load this whole tree by default')
    expect(content).toContain('architecture/')
    expect(content).toContain('capabilities/')
    expect(content).toContain('decisions/')
  })

  it('renders plans lifecycle rules', () => {
    const content = renderPlansIndex()
    expect(content).toContain('active/')
    expect(content).toContain('completed/')
    expect(content).toContain('archive/')
    expect(content).toContain('Never treat `archive/` as current behavior')
  })
})
```

- [ ] **Step 2: Run failing agent-context test**

Run:

```bash
bun test apps/cli/tests/agent-context.test.ts
```

Expected: fail because `render/docs/agent-context` does not exist.

- [ ] **Step 3: Add agent-context renderer**

Create `apps/cli/src/render/docs/agent-context.ts`:

```ts
export interface GeneratedAgentsOptions {
  projectName: string
}

export function renderGeneratedAgentsMd(options: GeneratedAgentsOptions): string {
  return `# Agent guide

Canonical guide for ${options.projectName}.

Read this file first, then the nearest local AGENTS.md for the workspace you are editing.

## Loading order

1. Use docs/README.md for public commands and user-facing docs.
2. Use .docs/README.md for internal architecture and capability context.
3. Load one task-specific .docs topic, not the whole tree.
4. Load one matching .plans/active file only for approved in-flight work.
5. Never treat .plans/archive as current behavior.

## Project rules

- Keep framework entrypoints thin.
- Keep services and use-cases framework-agnostic.
- Put persistence in repositories, queries, or DB packages/crates.
- Put validation and API contracts in DTO, schema, or contract files.
- Put permission decisions in policies.
- Put response shaping in mappers.
- Do not return raw database objects directly.
- Use PATCH for partial updates and PUT only for full replacement.

## Context hygiene

Do not add duplicate instruction directories. This project uses AGENTS.md as the canonical instruction surface.
`
}

export function renderInternalDocsIndex(): string {
  return `# Internal docs

This directory is for durable maintainer and agent context.

Do not load this whole tree by default.

## Sections

- architecture/
- capabilities/
- reference/
- decisions/
`
}

export function renderPlansIndex(): string {
  return `# Plans

Plans are for approved work, execution notes, and shipped outcomes.

## Directories

- active/
- completed/
- archive/

Never treat \`archive/\` as current behavior.
`
}
```

- [ ] **Step 4: Verify agent-context tests**

Run:

```bash
bun test apps/cli/tests/agent-context.test.ts
```

Expected: pass.

## Task 5: Add Compatibility Validation Foundation

**Files:**

- Create: `apps/cli/src/registry/compatibility.ts`
- Test: update `apps/cli/tests/registry.test.ts`

- [ ] **Step 1: Add failing compatibility tests**

Append to `apps/cli/tests/registry.test.ts`:

```ts
import { validateCapabilitySelection } from '../src/registry/compatibility'

describe('capability compatibility', () => {
  it('allows stable rust-fullstack defaults', () => {
    const result = validateCapabilitySelection({
      preset: 'rust-fullstack',
      packageManager: 'bun',
      databaseOwner: 'rust',
      databaseClient: 'sqlx',
      authProvider: 'clerk',
    })

    expect(result.errors).toEqual([])
  })

  it('rejects Prisma when Rust owns persistence', () => {
    const result = validateCapabilitySelection({
      preset: 'rust-fullstack',
      packageManager: 'bun',
      databaseOwner: 'rust',
      databaseClient: 'prisma',
      authProvider: 'clerk',
    })

    expect(result.errors).toContain('Prisma requires TypeScript database ownership.')
  })

  it('rejects native Better Auth as Rust auth', () => {
    const result = validateCapabilitySelection({
      preset: 'rust-fullstack',
      packageManager: 'pnpm',
      databaseOwner: 'rust',
      databaseClient: 'sqlx',
      authProvider: 'better-auth-native-rust',
    })

    expect(result.errors).toContain('Better Auth native Rust support is not a stable capability.')
  })
})
```

- [ ] **Step 2: Run failing compatibility tests**

Run:

```bash
bun test apps/cli/tests/registry.test.ts
```

Expected: fail because `registry/compatibility` does not exist.

- [ ] **Step 3: Add compatibility validator**

Create `apps/cli/src/registry/compatibility.ts`:

```ts
export interface CapabilitySelection {
  preset: string
  packageManager: string
  databaseOwner?: 'typescript' | 'rust' | 'none'
  databaseClient?: string
  authProvider?: string
}

export interface CompatibilityResult {
  warnings: string[]
  errors: string[]
}

export function validateCapabilitySelection(selection: CapabilitySelection): CompatibilityResult {
  const warnings: string[] = []
  const errors: string[] = []

  if (selection.packageManager !== 'bun' && selection.packageManager !== 'pnpm') {
    warnings.push('Only Bun and pnpm are first-class package managers.')
  }

  if (selection.databaseOwner === 'rust' && selection.databaseClient === 'prisma') {
    errors.push('Prisma requires TypeScript database ownership.')
  }

  if (selection.databaseOwner === 'typescript' && selection.databaseClient === 'sqlx') {
    errors.push('SQLx requires Rust database ownership.')
  }

  if (selection.authProvider === 'better-auth-native-rust') {
    errors.push('Better Auth native Rust support is not a stable capability.')
  }

  return { warnings, errors }
}
```

- [ ] **Step 4: Verify compatibility tests**

Run:

```bash
bun test apps/cli/tests/registry.test.ts
```

Expected: pass.

## Task 6: Run Foundation Verification

**Files:**

- No new files.

- [ ] **Step 1: Run focused CLI tests**

Run:

```bash
bun test apps/cli/tests/registry.test.ts apps/cli/tests/recipe.test.ts apps/cli/tests/workspace-renderers.test.ts apps/cli/tests/agent-context.test.ts apps/cli/tests/schemas.test.ts
```

Expected: all selected tests pass.

- [ ] **Step 2: Run full CLI test suite**

Run:

```bash
bun test apps/cli/tests
```

Expected: existing suite passes, with only the pre-existing scaffold E2E skip if `SCAFFOLD_E2E` is not set.

- [ ] **Step 3: Run typecheck**

Run:

```bash
bun run --cwd apps/cli check-types
```

Expected: TypeScript check passes.

- [ ] **Step 4: Run lint**

Run:

```bash
bun run --cwd apps/cli lint
```

Expected: oxlint passes or reports only issues introduced by this slice that must be fixed before completion.

- [ ] **Step 5: Update active design plan status**

Modify `.plans/active/2026-05-24-cli-capability-registry.md` to add an implementation evidence section:

```md
## Implementation evidence

- Foundation registry, recipe, workspace renderer, and agent-context modules added.
- Focused CLI tests passed.
- Full CLI tests passed.
- Typecheck passed.
- Lint passed.
```

Only add this section after the commands above actually pass.

## Self-Review Checklist

- [ ] New modules are additive and do not remove legacy family behavior.
- [ ] Bun remains the default package manager.
- [ ] pnpm is first-class in schema/renderers.
- [ ] npm is not part of the stable package-manager schema.
- [ ] Recipe replay command matches the approved CLI direction.
- [ ] Agent-context renderer does not generate `CONTEXT.md`, `.cursor/rules`, or `.claude/rules`.
- [ ] No unrelated `apps/web` mockup or robots changes are touched.
