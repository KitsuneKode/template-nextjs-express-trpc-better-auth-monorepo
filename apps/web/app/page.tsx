'use client'
import Link from 'next/link'
import { useState } from 'react'
import { CopyCheckIcon, CheckIcon } from 'lucide-react'
import { Button } from '@template/ui/components/button'
import { Textarea } from '@template/ui/src/components/textarea'

export default function Home() {
  const [copied, setCopied] = useState(false)
  const value =
    'bun create turbo@latest --example https://github.com/KitsuneKode/template-nextjs-express-trpc-bettera-auth-monorepo'
  return (
    <main className="flex min-h-svh flex-col items-center px-6 py-16">
      <section className="max-w-4xl space-y-4 text-center">
        <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
          Next.js × Express × tRPC × Bun × Better Auth × Prisma × Turborepo
        </h1>
        <p className="text-base text-slate-600 md:text-lg dark:text-slate-400">
          Production-ready monorepo template. Type-safe end-to-end. Batteries
          included.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Button asChild>
            <Link
              href="https://github.com/KitsuneKode/template-nextjs-express-trpc-bettera-auth-monorepo"
              target="_blank"
              rel="noreferrer"
            >
              View on GitHub
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/demo">Open Demo</Link>
          </Button>
        </div>
      </section>

      <section className="mt-12 grid w-full max-w-5xl gap-6 md:grid-cols-2">
        <div className="rounded-lg border p-5">
          <h2 className="mb-2 text-lg font-semibold">Quick start</h2>
          <pre className="relative overflow-x-auto rounded-md border bg-slate-950 p-3 text-sm text-slate-100">
            <Textarea value={value} rows={4} readOnly />
            <Button
              variant="outline"
              className="absolute right-3 bottom-3"
              onClick={() => {
                navigator.clipboard.writeText(value)
                setCopied(true)
                setTimeout(() => setCopied(false), 2000)
              }}
            >
              {copied ? <CheckIcon /> : <CopyCheckIcon />}
            </Button>
          </pre>
        </div>
        <div className="rounded-lg border p-5">
          <h2 className="mb-2 text-lg font-semibold">Tips</h2>
          <ul className="list-disc space-y-1 pl-5 text-sm">
            <li>
              Run all apps with <code>bun dev</code> (Turborepo orchestrates
              tasks).
            </li>
            <li>
              Shared UI via <code>@template/ui</code>, e.g.{' '}
              <code>@template/ui/components/button</code>.
            </li>
            <li>
              Auth lives in <code>packages/auth/</code> (Better Auth).
            </li>
            <li>
              tRPC routers and helpers in <code>packages/trpc/</code>.
            </li>
          </ul>
        </div>
      </section>

      <section className="mt-12 w-full max-w-5xl">
        <h2 className="mb-3 text-lg font-semibold">Useful links</h2>
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
          <a
            className="rounded-md border p-3 transition hover:bg-slate-50 dark:hover:bg-slate-900"
            href="https://nextjs.org/"
            target="_blank"
            rel="noreferrer"
          >
            Next.js
          </a>
          <a
            className="rounded-md border p-3 transition hover:bg-slate-50 dark:hover:bg-slate-900"
            href="https://expressjs.com/"
            target="_blank"
            rel="noreferrer"
          >
            Express
          </a>
          <a
            className="rounded-md border p-3 transition hover:bg-slate-50 dark:hover:bg-slate-900"
            href="https://trpc.io/"
            target="_blank"
            rel="noreferrer"
          >
            tRPC
          </a>
          <a
            className="rounded-md border p-3 transition hover:bg-slate-50 dark:hover:bg-slate-900"
            href="https://bun.sh/"
            target="_blank"
            rel="noreferrer"
          >
            Bun
          </a>
          <a
            className="rounded-md border p-3 transition hover:bg-slate-50 dark:hover:bg-slate-900"
            href="https://www.prisma.io/"
            target="_blank"
            rel="noreferrer"
          >
            Prisma
          </a>
          <a
            className="rounded-md border p-3 transition hover:bg-slate-50 dark:hover:bg-slate-900"
            href="https://turbo.build/"
            target="_blank"
            rel="noreferrer"
          >
            Turborepo
          </a>
          <a
            className="rounded-md border p-3 transition hover:bg-slate-50 dark:hover:bg-slate-900"
            href="https://better-auth.com/"
            target="_blank"
            rel="noreferrer"
          >
            Better Auth
          </a>
        </div>
      </section>
    </main>
  )
}
