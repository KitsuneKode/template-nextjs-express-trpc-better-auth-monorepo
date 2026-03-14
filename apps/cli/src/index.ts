#!/usr/bin/env node
import {
  cancel,
  confirm,
  intro,
  isCancel,
  note,
  outro,
  select,
  spinner,
  text,
} from '@clack/prompts'
import { scaffoldProject, sanitizeProjectName } from './lib/scaffold'
import type { CLIArgs, ProjectConfig } from './types/schemas'
import { checkCompatibility } from './types/schemas'
import { resolve } from 'node:path'
import pc from 'picocolors'

// Package info (keep in sync with package.json)
const PKG_NAME = '@kitsu/create'
const PKG_VERSION = '0.1.0'

function printHelp(): void {
  console.log(`
${pc.cyan(PKG_NAME)} v${PKG_VERSION}

${pc.bold('Usage:')}
  npx ${PKG_NAME} [project-name] [options]
  bunx ${PKG_NAME} [project-name] [options]

${pc.bold('Options:')}
  --yes              Skip prompts, use defaults
  --git              Initialize git repository (default: yes)
  --no-git           Skip git initialization
  --install          Run bun install (default: yes)
  --no-install       Skip dependency installation
  --showcase         Keep landing/demo content (default: no)
  --no-showcase      Strip showcase content
  --worker           Keep background worker workspace (default: no)
  --no-worker        Remove worker workspace
  --docker           Generate docker-compose.yml (default: yes)
  --no-docker        Skip Docker file generation
  --ci               Generate GitHub Actions workflow (default: yes)
  --no-ci            Skip CI generation
  --tests=<mode>     Testing setup: bun, none (default: bun)
  --deployment=<m>   Deployment guide: vercel-railway, none (default: vercel-railway)
  --backend=<b>      Backend: express-bun, hono-bun, none (default: express-bun)
  --database=<d>     Database: postgres, sqlite, mongodb, none (default: postgres)
  --orm=<o>          ORM: prisma, drizzle, mongoose, none (default: prisma)
  -v, --version      Show version number
  -h, --help         Show this help message

${pc.bold('Examples:')}
  ${pc.dim('# Interactive mode')}
  npx ${PKG_NAME} my-app

  ${pc.dim('# Non-interactive with defaults')}
  npx ${PKG_NAME} my-app --yes

  ${pc.dim('# Skip Docker and CI')}
  npx ${PKG_NAME} my-app --no-docker --no-ci

  ${pc.dim('# Hono backend with SQLite')}
  npx ${PKG_NAME} my-app --backend=hono-bun --database=sqlite

${pc.bold('Documentation:')}
  https://github.com/kitsunekode/template-nextjs-express-trpc-bettera-auth-monorepo
`)
}

function parseArgs(argv: string[]): CLIArgs {
  const parsed: CLIArgs = { yes: false, help: false, version: false }

  for (const arg of argv) {
    // Help and version flags
    if (arg === '--help' || arg === '-h') {
      parsed.help = true
      continue
    }
    if (arg === '--version' || arg === '-v') {
      parsed.version = true
      continue
    }

    // Project name (first non-flag argument)
    if (!arg.startsWith('-') && !parsed.projectName) {
      parsed.projectName = arg
      continue
    }

    // Boolean flags
    if (arg === '--yes') parsed.yes = true
    if (arg === '--install') parsed.install = true
    if (arg === '--no-install') parsed.install = false
    if (arg === '--git') parsed.git = true
    if (arg === '--no-git') parsed.git = false
    if (arg === '--showcase') parsed.includeShowcase = true
    if (arg === '--no-showcase') parsed.includeShowcase = false
    if (arg === '--worker') parsed.includeWorker = true
    if (arg === '--no-worker') parsed.includeWorker = false
    if (arg === '--docker') parsed.includeDocker = true
    if (arg === '--no-docker') parsed.includeDocker = false
    if (arg === '--ci') parsed.includeCi = true
    if (arg === '--no-ci') parsed.includeCi = false

    // Value flags
    if (arg.startsWith('--tests='))
      parsed.testing = arg.slice('--tests='.length) as CLIArgs['testing']
    if (arg.startsWith('--deployment='))
      parsed.deployment = arg.slice('--deployment='.length) as CLIArgs['deployment']
    if (arg.startsWith('--backend='))
      parsed.backend = arg.slice('--backend='.length) as CLIArgs['backend']
    if (arg.startsWith('--database='))
      parsed.database = arg.slice('--database='.length) as CLIArgs['database']
    if (arg.startsWith('--orm=')) parsed.orm = arg.slice('--orm='.length) as CLIArgs['orm']
  }

  return parsed
}

async function promptIfNeeded<T>(value: T | undefined, prompt: () => Promise<T>): Promise<T> {
  if (value !== undefined) return value
  return prompt()
}

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2))

  // Handle --version
  if (args.version) {
    console.log(PKG_VERSION)
    process.exit(0)
  }

  // Handle --help
  if (args.help) {
    printHelp()
    process.exit(0)
  }

  intro(pc.cyan(PKG_NAME))

  const rawProjectName = await promptIfNeeded(args.projectName, async () => {
    const value = await text({
      message: 'Project name',
      placeholder: 'my-kitsu-app',
      defaultValue: 'my-kitsu-app',
      validate: (input) => {
        try {
          sanitizeProjectName(input ?? '')
          return undefined
        } catch (error) {
          return error instanceof Error ? error.message : String(error)
        }
      },
    })

    if (isCancel(value)) {
      cancel('Project creation cancelled.')
      process.exit(0)
    }

    return String(value)
  })

  const projectName = sanitizeProjectName(rawProjectName)
  const destinationDir = resolve(process.cwd(), projectName)

  // --- Stack selection prompts ---

  const backend = args.yes
    ? (args.backend ?? 'express-bun')
    : await promptIfNeeded(args.backend, async () => {
        const value = await select({
          message: 'Backend framework',
          initialValue: 'express-bun',
          options: [
            {
              label: 'Express (Bun)',
              value: 'express-bun',
              hint: 'production-ready, current default',
            },
            { label: 'Hono (Bun)', value: 'hono-bun', hint: 'lightweight, edge-ready' },
            { label: 'None', value: 'none', hint: 'frontend only' },
          ],
        })
        if (isCancel(value)) {
          cancel('Project creation cancelled.')
          process.exit(0)
        }
        return value as ProjectConfig['backend']
      })

  const database = args.yes
    ? (args.database ?? 'postgres')
    : await promptIfNeeded(args.database, async () => {
        const value = await select({
          message: 'Database',
          initialValue: 'postgres',
          options: [
            { label: 'PostgreSQL', value: 'postgres', hint: 'recommended for production' },
            { label: 'SQLite', value: 'sqlite', hint: 'zero-config, file-based' },
            { label: 'None', value: 'none', hint: 'API-only or external DB' },
          ],
        })
        if (isCancel(value)) {
          cancel('Project creation cancelled.')
          process.exit(0)
        }
        return value as ProjectConfig['database']
      })

  const orm = args.yes
    ? (args.orm ?? 'prisma')
    : await promptIfNeeded(args.orm, async () => {
        // Filter ORM choices based on database selection
        const ormOptions =
          database === 'none'
            ? [{ label: 'None', value: 'none' as const, hint: 'no database selected' }]
            : [
                { label: 'Prisma', value: 'prisma' as const, hint: 'type-safe, migration support' },
                { label: 'Drizzle', value: 'drizzle' as const, hint: 'lightweight, SQL-first' },
                { label: 'None', value: 'none' as const, hint: 'raw queries' },
              ]

        const value = await select({
          message: 'ORM',
          initialValue: database === 'none' ? 'none' : 'prisma',
          options: ormOptions,
        })
        if (isCancel(value)) {
          cancel('Project creation cancelled.')
          process.exit(0)
        }
        return value as ProjectConfig['orm']
      })

  // --- Project structure prompts ---

  const includeShowcase = args.yes
    ? (args.includeShowcase ?? false)
    : await promptIfNeeded(args.includeShowcase, async () => {
        const value = await confirm({
          message: 'Keep the landing/demo showcase in the generated app?',
          initialValue: false,
        })
        if (isCancel(value)) {
          cancel('Project creation cancelled.')
          process.exit(0)
        }
        return value
      })

  const includeWorker = args.yes
    ? (args.includeWorker ?? false)
    : await promptIfNeeded(args.includeWorker, async () => {
        const value = await confirm({
          message: 'Keep the background worker workspace?',
          initialValue: false,
        })
        if (isCancel(value)) {
          cancel('Project creation cancelled.')
          process.exit(0)
        }
        return value
      })

  const testing = args.yes
    ? (args.testing ?? 'bun')
    : await promptIfNeeded(args.testing, async () => {
        const value = await select({
          message: 'Testing setup',
          initialValue: 'bun',
          options: [
            { label: 'Bun tests workspace', value: 'bun', hint: 'keep starter script tests' },
            { label: 'None', value: 'none', hint: 'remove the tests workspace' },
          ],
        })
        if (isCancel(value)) {
          cancel('Project creation cancelled.')
          process.exit(0)
        }
        return value as ProjectConfig['testing']
      })

  const includeDocker = args.yes
    ? (args.includeDocker ?? true)
    : await promptIfNeeded(args.includeDocker, async () => {
        const dockerHint =
          database === 'postgres'
            ? 'Generate a local Docker Compose file for PostgreSQL and Redis?'
            : 'Generate a local Docker Compose file for Redis?'
        const value = await confirm({
          message: dockerHint,
          initialValue: true,
        })
        if (isCancel(value)) {
          cancel('Project creation cancelled.')
          process.exit(0)
        }
        return value
      })

  const includeCi = args.yes
    ? (args.includeCi ?? true)
    : await promptIfNeeded(args.includeCi, async () => {
        const value = await confirm({
          message: 'Generate a GitHub Actions CI workflow?',
          initialValue: true,
        })
        if (isCancel(value)) {
          cancel('Project creation cancelled.')
          process.exit(0)
        }
        return value
      })

  const deployment = args.yes
    ? (args.deployment ?? 'vercel-railway')
    : await promptIfNeeded(args.deployment, async () => {
        const value = await select({
          message: 'Deployment guide',
          initialValue: 'vercel-railway',
          options: [
            {
              label: 'Vercel + Railway guide',
              value: 'vercel-railway',
              hint: 'recommended split for this stack',
            },
            { label: 'None', value: 'none', hint: 'skip deployment notes' },
          ],
        })
        if (isCancel(value)) {
          cancel('Project creation cancelled.')
          process.exit(0)
        }
        return value as ProjectConfig['deployment']
      })

  const initializeGit = args.yes
    ? (args.git ?? true)
    : await promptIfNeeded(args.git, async () => {
        const value = await confirm({
          message: 'Initialize a fresh git repository in the generated project?',
          initialValue: true,
        })
        if (isCancel(value)) {
          cancel('Project creation cancelled.')
          process.exit(0)
        }
        return value
      })

  const installDependencies = args.yes
    ? (args.install ?? true)
    : await promptIfNeeded(args.install, async () => {
        const value = await confirm({
          message: 'Run bun install after generation?',
          initialValue: true,
        })
        if (isCancel(value)) {
          cancel('Project creation cancelled.')
          process.exit(0)
        }
        return value
      })

  const options: ProjectConfig = {
    destinationDir,
    projectName,
    backend,
    database,
    orm,
    vectorDatabase: 'none',
    runtime: 'bun',
    addons: [],
    example: 'none',
    includeShowcase,
    includeWorker,
    testing,
    includeDocker,
    includeCi,
    deployment,
    initializeGit,
    installDependencies,
  }

  // Validate option compatibility
  const { warnings, errors } = checkCompatibility(options)

  if (errors.length > 0) {
    cancel(`Incompatible options:\n${errors.map((e) => `  ${pc.red('x')} ${e}`).join('\n')}`)
    process.exit(1)
  }

  if (warnings.length > 0) {
    note(warnings.map((w) => `${pc.yellow('!')} ${w}`).join('\n'), 'Compatibility warnings')
  }

  note(
    [
      `Project: ${pc.bold(projectName)}`,
      `Backend: ${options.backend}`,
      `Database: ${options.database}`,
      `ORM: ${options.orm}`,
      `Showcase: ${options.includeShowcase ? 'keep' : 'strip'}`,
      `Worker: ${options.includeWorker ? 'keep' : 'remove'}`,
      `Testing: ${options.testing}`,
      `Docker: ${options.includeDocker ? 'generate' : 'skip'}`,
      `CI: ${options.includeCi ? 'generate' : 'skip'}`,
      `Deployment guide: ${options.deployment}`,
      `Install deps: ${options.installDependencies ? 'yes' : 'no'}`,
    ].join('\n'),
    'Bootstrap plan',
  )

  const step = spinner()
  step.start('Generating project...')

  try {
    const result = await scaffoldProject(options)
    step.stop('Project generated successfully.')

    note(
      [
        `Path: ${result.destinationDir}`,
        `Scope: @${result.packageName}`,
        `Cleanup targets: ${result.cleanupTargets.join(', ') || 'none'}`,
        `Generated files: ${result.generatedFiles.join(', ') || 'none'}`,
      ].join('\n'),
      'Result',
    )

    outro(
      `Next steps:\n` +
        `  cd ${projectName}\n` +
        `${options.installDependencies ? '' : '  bun install\n'}` +
        `  bun run repo:doctor\n` +
        `  bun dev`,
    )
  } catch (error) {
    step.stop('Project generation failed.')
    cancel(error instanceof Error ? error.message : String(error))
    process.exit(1)
  }
}

main().catch((error) => {
  console.error(pc.red('Fatal error:'), error)
  process.exit(1)
})
