import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Scaling Strategies',
  description: 'How to grow your Arche project from MVP to millions of users.',
}

export default function ScalingDocsPage() {
  return (
    <div className="flex h-full flex-col">
      <section className="relative overflow-hidden border-b border-zinc-800 bg-black p-6 text-left md:p-12">
        <div className="relative z-10 flex max-w-3xl flex-col items-start">
          <div className="mb-6 inline-flex items-center gap-2 border border-zinc-800 bg-black px-3 py-1 text-xs font-bold tracking-wider uppercase">
            Operations
          </div>
          <h1 className="mb-6 text-4xl leading-[0.9] font-black tracking-tighter text-white uppercase md:text-5xl">
            Scale with <br />
            <span className="text-stroke-white text-transparent">Confidence.</span>
          </h1>
          <p className="text-lg leading-snug font-medium text-zinc-300">
            Architected to scale horizontally. No bottleneck in sight.
          </p>
        </div>
      </section>

      <section className="max-w-4xl space-y-12 p-6 md:p-12">
        <div className="space-y-6">
          <h2 className="text-2xl font-bold tracking-tight text-white uppercase">
            Horizontal API Scaling
          </h2>
          <p className="leading-relaxed font-medium text-zinc-400">
            The Express server is stateless by design. Use a load balancer to distribute traffic
            across multiple instances. Better Auth sessions are stored in your database (or Redis),
            making instance affinity unnecessary.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="border border-zinc-800 p-6 transition-colors hover:border-zinc-500">
            <h3 className="mb-3 text-sm font-bold tracking-tight text-white uppercase">
              Redis Caching
            </h3>
            <p className="text-sm text-zinc-500">
              Pre-integrated Redis client in packages/store to handle high-frequency data access and
              session storage.
            </p>
          </div>
          <div className="border border-zinc-800 p-6 transition-colors hover:border-zinc-500">
            <h3 className="mb-3 text-sm font-bold tracking-tight text-white uppercase">
              Prisma Accelerate
            </h3>
            <p className="text-sm text-zinc-500">
              Optional integration with Prisma Data Proxy for connection pooling and edge-side
              caching.
            </p>
          </div>
        </div>

        <div className="border border-zinc-800 bg-black p-8">
          <h3 className="mb-4 flex items-center gap-3 text-lg font-bold text-white uppercase">
            <span className="size-2 bg-blue-500" />
            Load Testing
          </h3>
          <p className="mb-6 text-sm leading-relaxed text-zinc-400">
            We provide a benchmarking suite in{' '}
            <code className="text-zinc-300">tests/load-testing.md</code> to help you verify your
            infrastructure limits before you hit them.
          </p>
          <div className="font-mono text-xs text-zinc-500">$ bun run test:load</div>
        </div>
      </section>
    </div>
  )
}
