import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Security Best Practices',
  description: 'Ensure your application is secure by default with Arche.',
}

export default function SecurityDocsPage() {
  return (
    <div className="flex h-full flex-col">
      <section className="relative overflow-hidden border-b border-zinc-800 bg-black p-6 text-left md:p-12">
        <div className="relative z-10 flex max-w-3xl flex-col items-start">
          <div className="mb-6 inline-flex items-center gap-2 border border-zinc-800 bg-black px-3 py-1 text-xs font-bold tracking-wider uppercase">
            Operations
          </div>
          <h1 className="mb-6 text-4xl leading-[0.9] font-black tracking-tighter text-white uppercase md:text-5xl">
            Secure by <br />
            <span className="text-stroke-white text-transparent">Design.</span>
          </h1>
          <p className="text-lg leading-snug font-medium text-zinc-300">
            Security is not an after-thought. It is baked into the foundation.
          </p>
        </div>
      </section>

      <section className="max-w-4xl space-y-16 p-6 md:p-12">
        <div className="space-y-6">
          <h2 className="text-2xl font-bold tracking-tight text-white uppercase">
            Data Protection
          </h2>
          <ul className="space-y-4 font-medium text-zinc-400">
            <li className="flex items-start gap-4">
              <span className="mt-2 size-1.5 shrink-0 rounded-full bg-red-500" />
              <span>
                <strong className="text-white">Input Validation:</strong> Every tRPC procedure uses
                Zod to enforce strict schema validation, preventing injection attacks.
              </span>
            </li>
            <li className="flex items-start gap-4">
              <span className="mt-2 size-1.5 shrink-0 rounded-full bg-red-500" />
              <span>
                <strong className="text-white">CSRF/XSS:</strong> Better Auth handles modern session
                security, including HttpOnly cookies and protection against common web
                vulnerabilities.
              </span>
            </li>
            <li className="flex items-start gap-4">
              <span className="mt-2 size-1.5 shrink-0 rounded-full bg-red-500" />
              <span>
                <strong className="text-white">Credential Safety:</strong> Enforced environment
                variable validation ensuring no secrets are leaked in client bundles.
              </span>
            </li>
          </ul>
        </div>

        <div className="border border-zinc-800 bg-zinc-900/50 p-8">
          <h3 className="mb-4 text-lg font-bold tracking-tight text-white uppercase">
            Middleware Interception
          </h3>
          <p className="mb-6 text-sm leading-relaxed text-zinc-400">
            Arche provides <code className="text-zinc-200">protectedProcedure</code> by default,
            which verifies the user session before executing any sensitive logic.
          </p>
          <div className="border border-zinc-800 bg-black p-4 font-mono text-xs text-pink-400">
            router.getSecretData.protectedProcedure.query(...)
          </div>
        </div>

        <div className="flex flex-col gap-8 border border-zinc-800 bg-zinc-950/50 p-6 md:flex-row md:items-center">
          <div className="flex-1">
            <h3 className="mb-2 text-xs font-bold text-white uppercase">Audit Logs</h3>
            <p className="text-sm text-zinc-500">
              Optional package integration for tracking every administrative action across the
              monorepo.
            </p>
          </div>
          <div className="flex-1">
            <h3 className="mb-2 text-xs font-bold text-white uppercase">Health Checks</h3>
            <p className="text-sm text-zinc-500">
              Automated security auditing tools integrated via `bun run repo:doctor`.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
