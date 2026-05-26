'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { cn } from '@arche-template/ui/lib/utils'

const sections = [
  {
    title: 'Start',
    links: [
      { href: '/docs/getting-started', label: 'Getting started' },
      { href: '/docs/philosophy', label: 'Philosophy' },
    ],
  },
  {
    title: 'Guides',
    links: [
      { href: '/docs/guides/first-hour', label: 'First hour' },
      { href: '/docs/guides/agent-context', label: 'Agent context' },
      { href: '/docs/guides/verification-and-presets', label: 'Verification' },
      { href: '/docs/guides/package-managers', label: 'Package managers' },
      { href: '/docs/guides/scaffold-lifecycle', label: 'Scaffold lifecycle' },
      { href: '/docs/guides/showcase-and-portfolio', label: 'Showcase & portfolio' },
    ],
  },
  {
    title: 'Walkthroughs',
    links: [
      { href: '/docs/guides/walkthrough-typescript-fullstack', label: 'TypeScript fullstack' },
      { href: '/docs/guides/walkthrough-convex-product', label: 'Convex product' },
      { href: '/docs/guides/walkthrough-rust', label: 'Rust API & fullstack' },
      { href: '/docs/guides/walkthrough-solana', label: 'Solana family' },
      { href: '/docs/guides/walkthrough-customize', label: 'Customize & experiments' },
      { href: '/docs/guides/walkthrough-automation', label: 'Automation (JSON/MCP)' },
    ],
  },
  {
    title: 'CLI',
    links: [
      { href: '/docs/cli', label: 'Overview' },
      { href: '/docs/cli/flags', label: 'Flags' },
      { href: '/docs/cli/subcommands', label: 'Subcommands' },
      { href: '/docs/cli/generated-output', label: 'Generated output' },
    ],
  },
  {
    title: 'Presets',
    links: [{ href: '/docs/presets', label: 'Preset catalog' }],
  },
  {
    title: 'Stack',
    links: [
      { href: '/docs/architecture', label: 'TypeScript architecture' },
      { href: '/docs/architecture/convex', label: 'Convex' },
      { href: '/docs/architecture/rust', label: 'Rust' },
      { href: '/docs/architecture/solana', label: 'Solana' },
      { href: '/docs/packages/auth', label: 'Authentication' },
      { href: '/docs/packages/store', label: 'Prisma store' },
      { href: '/docs/packages/trpc', label: 'tRPC' },
    ],
  },
  {
    title: 'Operations',
    links: [
      { href: '/docs/operations/deploy', label: 'Deployment' },
      { href: '/docs/operations/env-vars', label: 'Environment variables' },
      { href: '/docs/operations/workers-and-queues', label: 'Workers & queues' },
      { href: '/docs/operations/ci-and-testing', label: 'CI & testing' },
      { href: '/docs/operations/scaling', label: 'Scaling' },
      { href: '/docs/operations/security', label: 'Security' },
      { href: '/docs/operations/troubleshooting', label: 'Troubleshooting' },
    ],
  },
  {
    title: 'Reference',
    links: [
      { href: '/docs/reference/links', label: 'Stack links' },
      { href: '/docs/reference/capabilities', label: 'Capabilities' },
      { href: '/docs/reference/source-template', label: 'This source repo' },
      { href: '/examples', label: 'Code examples' },
    ],
  },
] as const

function isActive(pathname: string, href: string) {
  if (href === '/examples') return pathname === '/examples'
  return pathname === href || pathname.startsWith(`${href}/`)
}

export function DocsSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-full shrink-0 border-b border-zinc-800 bg-zinc-950/30 p-6 md:w-64 md:border-r md:border-b-0">
      <div className="md:sticky md:top-20 md:max-h-[calc(100vh-5rem)] md:overflow-y-auto">
        <div className="mb-6 flex items-center gap-2 font-mono text-[10px] tracking-widest text-zinc-500 uppercase">
          <span className="block size-1.5 bg-white" aria-hidden />
          Documentation
        </div>

        <nav className="space-y-8">
          {sections.map((section) => (
            <div key={section.title}>
              <h4 className="mb-3 text-xs font-bold tracking-widest text-zinc-400 uppercase">
                {section.title}
              </h4>
              <ul className="space-y-1">
                {section.links.map((link) => {
                  const active = isActive(pathname, link.href)
                  return (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className={cn(
                          'block rounded-sm px-2 py-1.5 text-sm font-medium transition-colors',
                          active
                            ? 'bg-white text-black'
                            : 'text-zinc-400 hover:bg-zinc-900 hover:text-white',
                        )}
                      >
                        {link.label}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </nav>
      </div>
    </aside>
  )
}
