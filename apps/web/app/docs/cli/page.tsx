import { Metadata } from 'next'
import { CommandTable } from '@/components/arche/command-table'

export const metadata: Metadata = {
  title: 'CLI Tooling',
  description: 'Master the Arche CLI for project bootstrapping and maintenance.',
}

export default function CliDocsPage() {
  return (
    <div className="flex h-full flex-col">
      {/* Header Area */}
      <section className="relative overflow-hidden border-b border-zinc-800 bg-black p-6 md:p-12">
        <div className="relative z-10 flex max-w-3xl flex-col items-start">
          <div className="mb-6 inline-flex items-center gap-2 border border-zinc-800 bg-black px-3 py-1 text-xs font-bold tracking-wider uppercase">
            CLI Tooling
          </div>
          <h1 className="mb-6 text-4xl leading-[0.9] font-black tracking-tighter text-white uppercase md:text-5xl">
            Arche <br />
            <span className="text-stroke-white text-transparent">CLI.</span>
          </h1>
          <p className="text-lg leading-snug font-medium text-zinc-400">
            The entry point for every Arche project. A Bun-native interactive CLI to scaffold your
            monorepo.
          </p>
        </div>
      </section>

      <section className="max-w-4xl space-y-12 p-6 md:p-12">
        <div>
          <h2 className="mb-4 text-2xl font-bold tracking-tight uppercase">Local Execution</h2>
          <p className="mb-6 font-medium text-zinc-400">
            Run the CLI directly from this template repo to bootstrap a new workspace.
          </p>
          <div className="border border-zinc-800 bg-zinc-900 p-4 font-mono text-sm text-white">
            bun run dev:cli -- my-app
          </div>
        </div>

        <div>
          <h2 className="mb-4 text-2xl font-bold tracking-tight uppercase">Features</h2>
          <ul className="space-y-4">
            {[
              {
                title: 'Workspace Scoping',
                desc: 'Automatically renames all @template/* package scopes to your chosen project name.',
              },
              {
                title: 'Family Selection',
                desc: 'Interactive selection of 11+ architecture families (fullstack, mobile, convex, etc).',
              },
              {
                title: 'Smart Cleaning',
                desc: 'Optionally strips out showcase content and demo data for a clean slate.',
              },
              {
                title: 'Infrastructure Generation',
                desc: 'Generates Docker Compose files and GitHub Actions workflows tailored to your selection.',
              },
            ].map((f, i) => (
              <li key={i} className="flex gap-4">
                <span className="font-mono text-zinc-600">0{i + 1}</span>
                <div>
                  <div className="font-bold text-white">{f.title}</div>
                  <div className="text-sm text-zinc-500">{f.desc}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="mb-6 text-2xl font-bold tracking-tight uppercase">Repo Hygiene</h2>
          <p className="mb-8 font-medium text-zinc-400">
            The CLI workspace also includes maintenance tools for existing projects.
          </p>
          <CommandTable />
        </div>
      </section>
    </div>
  )
}
