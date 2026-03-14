import { access, cp, mkdir, readdir, readFile, writeFile } from 'node:fs/promises'
import { basename, dirname, join, resolve } from 'node:path'
import { runCommand, tryCommand } from './spawn'
import { fileURLToPath } from 'node:url'

export type TestingMode = 'bun' | 'none'
export type DeploymentMode = 'vercel-railway' | 'none'
export type CleanupTarget = 'showcase' | 'seed' | 'worker' | 'tests' | 'readme'

export interface BootstrapOptions {
  destinationDir: string
  projectName: string
  includeShowcase: boolean
  includeWorker: boolean
  testing: TestingMode
  includeDocker: boolean
  includeCi: boolean
  deployment: DeploymentMode
  initializeGit: boolean
  installDependencies: boolean
}

export interface ScaffoldResult {
  destinationDir: string
  packageName: string
  cleanupTargets: CleanupTarget[]
  generatedFiles: string[]
}

const EXCLUDED_SEGMENTS = new Set([
  '.git',
  '.turbo',
  '.vercel',
  'node_modules',
  '.claude',
  '.cursor',
  '.vscode',
  'logs',
])

// Files that should not appear in scaffolded output
const EXCLUDED_FILES = new Set(['bun.lock', 'docs/cli-development.md', 'docs/bootstrap-cli.md'])

// Node.js compatible path resolution (works in both Node and Bun)
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Detect if running from bundled dist or source
// Source: apps/cli/src/lib/scaffold.ts (4 levels to root)
// Bundled: apps/cli/dist/index.js (3 levels to root)
const isBundled = __dirname.includes('/dist') || !__dirname.includes('/src/')
const ROOT_DIR = resolve(__dirname, isBundled ? '../../..' : '../../../..')

function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._ -]/g, '')
    .replace(/[._ ]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function sanitizeProjectName(input: string): string {
  const normalized = slugify(basename(input))
  if (!normalized) {
    throw new Error('Project name must contain at least one alphanumeric character.')
  }
  return normalized
}

export function buildCleanupTargets(
  options: Pick<BootstrapOptions, 'includeShowcase' | 'includeWorker' | 'testing'>,
): CleanupTarget[] {
  const targets = new Set<CleanupTarget>(['readme'])

  if (!options.includeShowcase) {
    targets.add('showcase')
    targets.add('seed')
  }

  if (!options.includeWorker) {
    targets.add('worker')
  }

  if (options.testing === 'none') {
    targets.add('tests')
  }

  return [...targets]
}

export function renderDockerCompose(projectName: string): string {
  const databaseName = sanitizeProjectName(projectName).replace(/-/g, '_')

  return `services:
  postgres:
    image: postgres:16-alpine
    restart: unless-stopped
    environment:
      POSTGRES_DB: ${databaseName}
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    ports:
      - "5432:5432"
    volumes:
      - postgres-data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    restart: unless-stopped
    ports:
      - "6379:6379"
    volumes:
      - redis-data:/data

volumes:
  postgres-data:
  redis-data:
`
}

export function renderGithubActionsWorkflow(options: { includeTests: boolean }): string {
  const testStep = options.includeTests
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

export function renderDeploymentGuide(options: {
  projectName: string
  includeWorker: boolean
  includeDocker: boolean
}): string {
  const workerLine = options.includeWorker
    ? '- Deploy `apps/worker` as a separate Railway or container service if background jobs are required.'
    : '- Worker deployment is not needed unless you add the workspace back later.'

  const dockerLine = options.includeDocker
    ? '- Local Docker services are available via `docker-compose.yml` for PostgreSQL and Redis.'
    : '- Local Docker services were not generated; provide managed PostgreSQL and Redis endpoints manually.'

  return `# Deployment Guide

## Recommended Split

- Deploy \`apps/web\` to Vercel.
- Deploy \`apps/server\` to Railway, Fly.io, Render, or another Bun-friendly host.
${workerLine}

## Required Environment Variables

- Web:
  \`NEXT_PUBLIC_APP_URL\`, \`NEXT_PUBLIC_API_URL\`
- Server:
  \`PORT\`, \`NODE_ENV\`, \`DATABASE_URL\`, \`REDIS_URL\`, \`FRONTEND_URL\`,
  \`BETTER_AUTH_URL\`, \`BETTER_AUTH_SECRET\`

## Local Services

${dockerLine}

## Suggested Rollout Order

1. Deploy the database and Redis.
2. Deploy the server and validate \`/health\`.
3. Deploy the web app with the correct \`NEXT_PUBLIC_API_URL\`.
4. Add CI gates before the first production release.

## Notes

This guide was generated by \`@kitsu/create\` for ${options.projectName}.
Review it alongside the repo docs before production rollout.
`
}

export function buildServerEnvExample(projectName: string): string {
  const safeName = sanitizeProjectName(projectName).replace(/-/g, '_')
  return `PORT=8080
NODE_ENV=development
JWT_SECRET=replace-me
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/${safeName}
FRONTEND_URL=http://localhost:3000
REDIS_URL=redis://localhost:6379
BETTER_AUTH_SECRET=replace-with-a-long-random-secret
BETTER_AUTH_URL=http://localhost:8080
`
}

export function buildWebEnvExample(): string {
  return `NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:8080
`
}

async function pathExists(path: string): Promise<boolean> {
  try {
    await access(path)
    return true
  } catch {
    return false
  }
}

async function ensureDestinationAvailable(destinationDir: string): Promise<void> {
  if (!(await pathExists(destinationDir))) return

  const entries = await readdir(destinationDir)
  if (entries.length > 0) {
    throw new Error(`Destination directory is not empty: ${destinationDir}`)
  }
}

function shouldCopyPath(relativePath: string): boolean {
  if (!relativePath) return true

  const segments = relativePath.split('/').filter(Boolean)
  if (segments[0] === 'apps' && segments[1] === 'cli') return false
  if (segments.some((segment) => EXCLUDED_SEGMENTS.has(segment))) return false
  if (EXCLUDED_FILES.has(relativePath)) return false

  const fileName = segments.at(-1) ?? ''
  if (fileName.startsWith('.env') && !fileName.endsWith('.example')) return false

  return true
}

async function copyTemplate(destinationDir: string): Promise<void> {
  await cp(ROOT_DIR, destinationDir, {
    recursive: true,
    filter: (sourcePath) => {
      const relativePath = sourcePath === ROOT_DIR ? '' : sourcePath.slice(ROOT_DIR.length + 1)
      return shouldCopyPath(relativePath)
    },
  })
}

// Scripts that reference the CLI workspace and should not appear in scaffolded output
const CLI_SCRIPTS = new Set(['dev:cli', 'build:cli'])

async function updateRootPackageJson(destinationDir: string, packageName: string): Promise<void> {
  const packageJsonPath = join(destinationDir, 'package.json')
  const packageJson = JSON.parse(await readFile(packageJsonPath, 'utf8')) as Record<string, unknown>
  packageJson.name = packageName

  // Strip CLI-only scripts that reference the excluded CLI workspace
  if (packageJson.scripts && typeof packageJson.scripts === 'object') {
    const scripts = packageJson.scripts as Record<string, unknown>
    for (const key of CLI_SCRIPTS) {
      delete scripts[key]
    }
  }

  await writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n')
}

async function writeGeneratedFile(
  destinationDir: string,
  relativePath: string,
  content: string,
): Promise<void> {
  const filePath = join(destinationDir, relativePath)
  await mkdir(dirname(filePath), { recursive: true })
  await writeFile(filePath, content)
}

export async function scaffoldProject(options: BootstrapOptions): Promise<ScaffoldResult> {
  const packageName = sanitizeProjectName(options.projectName)
  const destinationDir = resolve(options.destinationDir)

  await ensureDestinationAvailable(destinationDir)
  await copyTemplate(destinationDir)
  await updateRootPackageJson(destinationDir, packageName)

  runCommand(['bun', 'toolings/scripts/rename-scope.ts', '--quiet'], { cwd: destinationDir })

  const cleanupTargets = buildCleanupTargets(options)
  if (cleanupTargets.length > 0) {
    runCommand(
      [
        'bun',
        'toolings/scripts/template-cleanup.ts',
        `--remove=${cleanupTargets.join(',')}`,
        '--yes',
      ],
      { cwd: destinationDir },
    )
  }

  const generatedFiles: string[] = []

  // Generate .env.example files (for reference/documentation)
  await writeGeneratedFile(
    destinationDir,
    'apps/server/.env.example',
    buildServerEnvExample(packageName),
  )
  generatedFiles.push('apps/server/.env.example')

  await writeGeneratedFile(destinationDir, 'apps/web/.env.example', buildWebEnvExample())
  generatedFiles.push('apps/web/.env.example')

  // Generate .env files (for immediate local development)
  await writeGeneratedFile(destinationDir, 'apps/server/.env', buildServerEnvExample(packageName))
  generatedFiles.push('apps/server/.env')

  await writeGeneratedFile(destinationDir, 'apps/web/.env', buildWebEnvExample())
  generatedFiles.push('apps/web/.env')

  if (options.includeDocker) {
    await writeGeneratedFile(destinationDir, 'docker-compose.yml', renderDockerCompose(packageName))
    generatedFiles.push('docker-compose.yml')
  }

  if (options.includeCi) {
    await writeGeneratedFile(
      destinationDir,
      '.github/workflows/ci.yml',
      renderGithubActionsWorkflow({ includeTests: options.testing === 'bun' }),
    )
    generatedFiles.push('.github/workflows/ci.yml')
  }

  if (options.deployment !== 'none') {
    await writeGeneratedFile(
      destinationDir,
      'docs/deployment.md',
      renderDeploymentGuide({
        projectName: packageName,
        includeWorker: options.includeWorker,
        includeDocker: options.includeDocker,
      }),
    )
    generatedFiles.push('docs/deployment.md')
  }

  if (options.initializeGit) {
    // Use tryCommand since git might not be installed
    tryCommand(['git', 'init', '-b', 'main'], { cwd: destinationDir })
  }

  if (options.installDependencies) {
    runCommand(['bun', 'install'], { cwd: destinationDir })
  }

  return {
    destinationDir,
    packageName,
    cleanupTargets,
    generatedFiles,
  }
}
