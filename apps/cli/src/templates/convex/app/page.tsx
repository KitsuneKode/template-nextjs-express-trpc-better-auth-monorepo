export default function Home() {
  return (
    <main style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif' }}>
      <h1>Convex + Next.js</h1>
      <p>
        Run <code>bun run dev</code> to start Convex and Next.js together. After the first{' '}
        <code>convex dev</code> run, wire <code>useQuery</code> from <code>convex/react</code>{' '}
        against <code>convex/posts.ts</code>.
      </p>
      <p>
        See <code>docs/convex-integration.md</code> in the Arche template repo for Better Auth
        wiring.
      </p>
    </main>
  )
}
