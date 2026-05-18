import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Authentication Guide',
  description: 'Unified authentication setup for Next.js and Express.',
}

export default function AuthDocsPage() {
  return (
    <div className="flex h-full flex-col">
      <section className="relative overflow-hidden border-b border-zinc-800 bg-black p-6 md:p-12">
        <div className="relative z-10 flex max-w-3xl flex-col items-start">
          <div className="mb-6 inline-flex items-center gap-2 border border-zinc-800 bg-black px-3 py-1 text-xs font-bold tracking-wider uppercase">
            Package / Auth
          </div>
          <h1 className="mb-6 text-4xl leading-[0.9] font-black tracking-tighter text-white uppercase md:text-5xl">
            Better <br />
            <span className="text-stroke-white text-transparent">Auth.</span>
          </h1>
          <p className="text-lg leading-snug font-medium text-zinc-400">
            A unified authentication package that works seamlessly across the Express API and
            Next.js UI.
          </p>
        </div>
      </section>

      <section className="max-w-4xl space-y-12 p-6 md:p-12">
        <div>
          <h2 className="mb-4 text-2xl font-bold tracking-tight uppercase">Overview</h2>
          <p className="leading-relaxed font-medium text-zinc-400">
            Arche uses{' '}
            <a href="https://better-auth.com" className="text-white underline underline-offset-4">
              Better Auth
            </a>{' '}
            for its simplicity and monorepo compatibility. The auth logic is encapsulated in{' '}
            <code className="border border-zinc-800 bg-zinc-900 px-1.5 py-0.5 text-zinc-200">
              packages/auth
            </code>
            , exporting both a server-side instance and a client-side SDK.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="border border-zinc-800 p-6">
            <h3 className="mb-3 text-lg font-bold tracking-tight uppercase">Server Side</h3>
            <p className="mb-4 text-sm text-zinc-500">
              Configured in <code className="text-zinc-300">src/index.ts</code>. Integrated into
              Express as a middleware handler.
            </p>
            <div className="border border-zinc-800 bg-black p-4 font-mono text-[11px] text-blue-400">
              export const auth = betterAuth({'{'}
              <br />
              &nbsp;&nbsp;database: prismaAdapter(db),
              <br />
              &nbsp;&nbsp;providers: [ ... ]<br />
              {'}'})
            </div>
          </div>
          <div className="border border-zinc-800 p-6">
            <h3 className="mb-3 text-lg font-bold tracking-tight uppercase">Client Side</h3>
            <p className="mb-4 text-sm text-zinc-500">
              Configured in <code className="text-zinc-300">src/client.ts</code>. Used by the
              Next.js app to handle sessions.
            </p>
            <div className="border border-zinc-800 bg-black p-4 font-mono text-[11px] text-pink-400">
              export const authClient = createAuthClient({'{'}
              <br />
              &nbsp;&nbsp;baseURL: process.env.API_URL
              <br />
              {'}'})
            </div>
          </div>
        </div>

        <div>
          <h2 className="mb-4 text-2xl font-bold tracking-tight uppercase">Implementation</h2>
          <ul className="space-y-4 font-medium text-zinc-400">
            <li className="flex items-start gap-4">
              <span className="mt-1.5 size-2 shrink-0 bg-white" />
              <span>
                <strong className="text-white">Session Sharing:</strong> Cookies are shared between
                subdomains if configured, allowing seamless auth across your monorepo.
              </span>
            </li>
            <li className="flex items-start gap-4">
              <span className="mt-1.5 size-2 shrink-0 bg-white" />
              <span>
                <strong className="text-white">Protected Routes:</strong> Middleware in both Express
                and Next.js can intercept requests based on the shared session.
              </span>
            </li>
          </ul>
        </div>
      </section>
    </div>
  )
}
