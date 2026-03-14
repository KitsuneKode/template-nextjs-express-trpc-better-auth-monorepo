#!/usr/bin/env bun
import { dirname, resolve } from 'path'
import { access, mkdir, rm } from 'fs/promises'

type CleanupTarget = 'showcase' | 'seed' | 'worker' | 'tests' | 'readme'
type ActionType = 'remove' | 'write'

interface CleanupAction {
  type: ActionType
  path: string
  description: string
  content?: string
}

interface CleanupOptions {
  dryRun: boolean
  yes: boolean
  targets: CleanupTarget[]
}

const DEFAULT_TARGETS: CleanupTarget[] = ['showcase', 'seed', 'worker', 'tests', 'readme']

const STARTER_LAYOUT = `import { Suspense } from 'react'
import { Toaster } from 'sonner'
import '@template/ui/globals.css'
import type { Metadata } from 'next'
import { Providers } from '@/components/providers'
import { RouteTopLoader } from '@/components/shell/route-top-loader'

export const metadata: Metadata = {
  title: {
    default: 'App',
    template: '%s | App',
  },
  description: 'Application built from the monorepo starter.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <Suspense fallback={null}>
          <RouteTopLoader />
        </Suspense>
        <Providers>{children}</Providers>
        <Toaster theme="dark" position="bottom-right" className="font-sans" />
      </body>
    </html>
  )
}
`

const STARTER_PAGE = `const NEXT_STEPS = [
  'Rename the root package scope and product copy.',
  'Replace auth providers and environment variables with your own values.',
  'Build your first feature in apps/web and packages/trpc.',
]

export default function Page() {
  return (
    <main className="min-h-screen bg-neutral-950 px-6 py-16 text-white sm:px-10">
      <div className="mx-auto flex max-w-4xl flex-col gap-10">
        <div className="space-y-4">
          <p className="text-xs font-semibold tracking-[0.24em] text-neutral-400 uppercase">
            Starter Ready
          </p>
          <h1 className="max-w-3xl text-4xl font-semibold tracking-tight sm:text-6xl">
            Your product starts here.
          </h1>
          <p className="max-w-2xl text-base leading-7 text-neutral-400 sm:text-lg">
            The showcase routes were removed so this app can become a clean product surface.
            Keep the shared packages, wire your real domain logic, and ship.
          </p>
        </div>

        <div className="grid gap-6 rounded-3xl border border-white/10 bg-white/[0.03] p-8 shadow-2xl shadow-black/20 md:grid-cols-[1.4fr_0.9fr]">
          <div className="space-y-4">
            <h2 className="text-2xl font-medium">Recommended next steps</h2>
            <ul className="space-y-3 text-sm leading-6 text-neutral-300">
              {NEXT_STEPS.map((step) => (
                <li key={step} className="flex gap-3">
                  <span className="mt-2 h-2 w-2 rounded-full bg-emerald-400" />
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4 rounded-2xl border border-white/10 bg-black/20 p-5">
            <h2 className="text-sm font-semibold tracking-[0.18em] text-neutral-400 uppercase">
              Starter notes
            </h2>
            <p className="text-sm leading-6 text-neutral-300">
              Keep shared packages for auth, database, and API contracts. Replace the homepage,
              metadata, and starter copy with your product-specific experience next.
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
`

const STARTER_SEED = `import { prisma } from '../index'

async function main() {
  console.log('No default seed data configured.')
  console.log('Add your own records to packages/store/src/scripts/seed.ts when ready.')
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
`

function buildStarterReadme(projectName: string): string {
  return `# ${projectName}

Monorepo starter built with Bun, Turborepo, Next.js, Express, Better Auth, Prisma, and tRPC.

## Quick Start

\`\`\`sh
bun install
bun dev
\`\`\`

## Common Commands

- \`bun dev\`
- \`bun run build\`
- \`bun run lint\`
- \`bun run check-types\`
- \`bun run db:generate\`
- \`bun run db:migrate\`
- \`bun run db:seed\`

## Cleanup And Maintenance

- \`bun run repo:doctor\`
- \`bun run template:clean:dry\`
- \`bun run template:clean\`
- \`bun run commit:check\`

Update this README, the agent docs, and product metadata once the starter is customized.
`
}

function parseTargets(argv: string[]): CleanupTarget[] {
  const removeArg = argv.find((entry) => entry.startsWith('--remove='))
  if (!removeArg) return DEFAULT_TARGETS

  const selected = removeArg
    .slice('--remove='.length)
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean) as CleanupTarget[]

  if (selected.length === 0) {
    throw new Error('At least one cleanup target is required when using --remove=')
  }

  const invalid = selected.filter((entry) => !DEFAULT_TARGETS.includes(entry))
  if (invalid.length > 0) {
    throw new Error(`Unknown cleanup target(s): ${invalid.join(', ')}`)
  }

  return [...new Set(selected)]
}

function parseArgs(argv: string[]): CleanupOptions {
  if (argv.includes('--help') || argv.includes('-h')) {
    console.log(`Usage: bun toolings/scripts/template-cleanup.ts [options]

Strip the template showcase and optional workspaces from a cloned project.

Options:
  --dry-run               Preview changes without writing files
  --yes                   Apply changes without confirmation prompt
  --remove=a,b,c          Choose from showcase,seed,worker,tests,readme
  -h, --help              Show this message

Examples:
  bun toolings/scripts/template-cleanup.ts --dry-run
  bun toolings/scripts/template-cleanup.ts --remove=showcase,seed --yes
  bun toolings/scripts/template-cleanup.ts --yes
`)
    process.exit(0)
  }

  return {
    dryRun: argv.includes('--dry-run'),
    yes: argv.includes('--yes'),
    targets: parseTargets(argv),
  }
}

function buildShowcaseActions(): CleanupAction[] {
  return [
    { type: 'remove', path: 'apps/web/app/demo', description: 'Remove demo routes' },
    { type: 'remove', path: 'apps/web/app/landing', description: 'Remove landing routes' },
    { type: 'remove', path: 'apps/web/app/blog', description: 'Remove template blog routes' },
    { type: 'remove', path: 'apps/web/components/demos', description: 'Remove demo components' },
    { type: 'remove', path: 'apps/web/components/landing', description: 'Remove landing components' },
    {
      type: 'remove',
      path: 'apps/web/components/landing-premium',
      description: 'Remove premium landing components',
    },
    { type: 'remove', path: 'apps/web/components/sections', description: 'Remove marketing sections' },
    {
      type: 'remove',
      path: 'apps/web/components/ui/animated-gradient.tsx',
      description: 'Remove showcase-only UI helper',
    },
    {
      type: 'remove',
      path: 'apps/web/components/ui/code-block.tsx',
      description: 'Remove showcase-only code block component',
    },
    {
      type: 'remove',
      path: 'apps/web/components/ui/feature-card.tsx',
      description: 'Remove showcase-only feature card component',
    },
    {
      type: 'remove',
      path: 'apps/web/components/ui/section-wrapper.tsx',
      description: 'Remove showcase-only section wrapper',
    },
    {
      type: 'remove',
      path: 'apps/web/components/shell/design-toggle.tsx',
      description: 'Remove template design toggle',
    },
    {
      type: 'remove',
      path: 'apps/web/components/shell/link-pending-indicator.tsx',
      description: 'Remove landing-only link indicator',
    },
    {
      type: 'remove',
      path: 'apps/web/components/shell/navbar-switcher.tsx',
      description: 'Remove showcase navbar switcher',
    },
    { type: 'remove', path: 'apps/web/lib/animations.ts', description: 'Remove showcase animation helpers' },
    { type: 'remove', path: 'apps/web/lib/demo-data.ts', description: 'Remove showcase demo data' },
    { type: 'remove', path: 'apps/web/lib/scroll.ts', description: 'Remove showcase scroll helper' },
    { type: 'remove', path: 'apps/web/lib/site-design.ts', description: 'Remove template design state helper' },
    { type: 'remove', path: 'apps/web/public/brand', description: 'Remove template brand assets' },
    {
      type: 'remove',
      path: 'apps/web/app/opengraph-image.tsx',
      description: 'Remove template social image route',
    },
    {
      type: 'remove',
      path: 'apps/web/app/twitter-image.tsx',
      description: 'Remove template Twitter image route',
    },
    {
      type: 'remove',
      path: 'apps/web/app/social-image.tsx',
      description: 'Remove template social image route',
    },
    {
      type: 'write',
      path: 'apps/web/app/layout.tsx',
      description: 'Replace layout metadata with a starter version',
      content: STARTER_LAYOUT,
    },
    {
      type: 'write',
      path: 'apps/web/app/page.tsx',
      description: 'Replace marketing homepage with a starter page',
      content: STARTER_PAGE,
    },
  ]
}

async function detectProjectName(): Promise<string> {
  const rootPackage = (await Bun.file('package.json').json()) as { name?: string }
  const rawName = rootPackage.name?.trim() || 'app'
  return rawName.startsWith('@') ? rawName.slice(1) : rawName
}

export async function buildCleanupPlan(targets: CleanupTarget[]): Promise<CleanupAction[]> {
  const actions: CleanupAction[] = []

  if (targets.includes('showcase')) {
    actions.push(...buildShowcaseActions())
  }

  if (targets.includes('seed')) {
    actions.push({
      type: 'write',
      path: 'packages/store/src/scripts/seed.ts',
      description: 'Replace template-branded seed data with a starter seed script',
      content: STARTER_SEED,
    })
  }

  if (targets.includes('worker')) {
    actions.push({
      type: 'remove',
      path: 'apps/worker',
      description: 'Remove the optional worker workspace',
    })
  }

  if (targets.includes('tests')) {
    actions.push({
      type: 'remove',
      path: 'tests',
      description: 'Remove the optional tests workspace',
    })
  }

  if (targets.includes('readme')) {
    actions.push({
      type: 'write',
      path: 'README.md',
      description: 'Replace the template-branded root README with a starter README',
      content: buildStarterReadme(await detectProjectName()),
    })
  }

  return actions
}

async function pathExists(path: string): Promise<boolean> {
  try {
    await access(path)
    return true
  } catch {
    return false
  }
}

async function applyAction(action: CleanupAction, dryRun: boolean): Promise<void> {
  const absolutePath = resolve(action.path)
  const exists = await pathExists(action.path)

  if (action.type === 'remove') {
    if (!exists) return
    if (!dryRun) {
      await rm(absolutePath, { recursive: true, force: true })
    }
    return
  }

  if (!dryRun) {
    const parent = dirname(absolutePath)
    await mkdir(parent, { recursive: true })
    await Bun.write(absolutePath, action.content ?? '')
  }
}

function printPlan(actions: CleanupAction[], options: CleanupOptions): void {
  console.log('Template Cleanup Plan')
  console.log(`Mode: ${options.dryRun ? 'dry-run' : 'write'}`)
  console.log(`Targets: ${options.targets.join(', ')}`)
  console.log('')

  for (const action of actions) {
    console.log(`- [${action.type}] ${action.path}`)
    console.log(`  ${action.description}`)
  }

  console.log('')
  console.log('After cleanup, review AGENTS/docs files so they describe your new repo shape.')
}

async function main(): Promise<void> {
  const options = parseArgs(process.argv.slice(2))
  if (!options.dryRun && !options.yes) {
    console.error('Refusing to modify files without --yes. Run with --dry-run first if needed.')
    process.exit(1)
  }

  const actions = await buildCleanupPlan(options.targets)
  printPlan(actions, options)

  for (const action of actions) {
    await applyAction(action, options.dryRun)
  }
}

if (import.meta.main) {
  await main()
}
