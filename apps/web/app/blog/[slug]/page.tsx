import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Navbar } from '@/components/arche/navbar'

// Real content for the blog posts
const content = {
  'agent-first-philosophy': {
    title: 'The Agent-First Philosophy',
    date: 'May 18, 2026',
    category: 'Architecture',
    body: `
      <p>In 2026, we are no longer just writing code for other humans to read. We are writing code to be co-authored by AI agents. This shift requires a fundamental change in how we structure our repositories.</p>
      
      <h2>Beyond Standard Templates</h2>
      <p>Most templates focus on human developer experience (DX). Arche focuses on Agent DX (AX). By shipping with native <code>AGENTS.md</code> and <code>CLAUDE.md</code> files in every package, we provide the semantic context an AI needs to understand intent, not just syntax.</p>
      
      <blockquote>"Taste is the differentiator in a world where everyone's software is good enough." - Arche Core Philosophy</blockquote>
      
      <h2>Strict Boundaries for Clear Reasoning</h2>
      <p>AI models reason better when context is bounded. Arche's monorepo structure forces strict domain isolation. When an agent is working in <code>packages/auth</code>, it doesn't get distracted by the UI logic in <code>apps/web</code>. This isolation reduces hallucinations and increases the accuracy of AI-generated features.</p>
      
      <h2>The Future of Co-Authorship</h2>
      <p>We believe the best repositories of the future will be self-documenting for both carbon and silicon-based engineers. Arche is our first step towards that reality.</p>
    `,
  },
  'mastering-monorepos-2026': {
    title: 'Monorepo vs Polyrepo in 2026',
    date: 'May 10, 2026',
    category: 'Engineering',
    body: `
      <p>The debate between monorepos and polyrepos is over. For high-velocity teams, the monorepo has won, thanks to tools like Turborepo and Bun.</p>
      
      <h2>Scaling Without Friction</h2>
      <p>Arche utilizes Turborepo's advanced caching to ensure that your build pipeline only executes what is necessary. Changes in the <code>auth</code> package only trigger tests for <code>auth</code> and its direct dependents, not the entire repo.</p>
      
      <h2>Shared Types, Shared Success</h2>
      <p>The biggest benefit of the Arche monorepo is the shared <code>packages/trpc</code> layer. By sharing API contracts as TypeScript types rather than documentation, we eliminate an entire class of production bugs related to client-server mismatch.</p>
      
      <pre>
// In packages/trpc
export type AppRouter = typeof appRouter;

// In apps/web
const user = trpc.user.me.useQuery(); // Fully typed
      </pre>
      
      <h2>Conclusion</h2>
      <p>A monorepo isn't just about putting all your code in one place; it's about creating a unified engineering system. Arche provides that system out of the box.</p>
    `,
  },
  'typesafe-api-glue': {
    title: 'The Typesafe API Glue',
    date: 'May 05, 2026',
    category: 'Productivity',
    body: `
      <p>Type safety shouldn't stop at your database or your frontend. It should be the connective tissue that binds your entire stack together.</p>
      
      <h2>The Origin Story</h2>
      <p>Arche was built to solve the "data desert"—the gap between your database schema and your UI components where types go to die. By combining Prisma and tRPC, we've created a seamless pipeline.</p>
      
      <h2>How it works</h2>
      <ol>
        <li><strong>Prisma:</strong> Defines the source of truth for your data models.</li>
        <li><strong>tRPC:</strong> Projects those models into your API layer without manual codegen.</li>
        <li><strong>Next.js:</strong> Consumes the API with full autocomplete and hover-documentation.</li>
      </ol>
      
      <p>This "Typesafe Glue" is what allows Arche developers to move 10x faster than those using traditional REST or GraphQL setups with manual type definitions.</p>
    `,
  },
}

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = content[slug as keyof typeof content]
  if (!post) return { title: 'Post Not Found' }
  return {
    title: post.title,
    description: post.category + ' article on Arche Engineering Blog.',
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = content[slug as keyof typeof content]

  if (!post) notFound()

  return (
    <main className="min-h-screen bg-black font-sans text-white selection:bg-white selection:text-black">
      <Navbar />

      <article className="mx-auto flex min-h-[calc(100vh-56px)] max-w-[1200px] flex-col border-r border-l border-zinc-800">
        {/* Article Header */}
        <header className="relative overflow-hidden border-b border-zinc-800 bg-black p-6 md:p-20">
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:32px_32px]" />

          <div className="relative z-10 flex max-w-4xl flex-col items-start">
            <div className="mb-8 flex items-center gap-4">
              <span className="font-mono text-xs tracking-widest text-zinc-500 uppercase">
                {post.date}
              </span>
              <span className="size-1 rounded-full bg-zinc-800" />
              <span className="font-mono text-xs tracking-widest text-amber-500 uppercase">
                {post.category}
              </span>
            </div>

            <h1 className="mb-12 text-5xl leading-[0.85] font-black tracking-tighter text-white uppercase md:text-8xl">
              {post.title}
            </h1>

            <div className="mb-12 h-px w-32 bg-white" />
          </div>
        </header>

        {/* Article Body */}
        <div className="flex-1 bg-black p-6 md:p-20">
          <div
            className="prose prose-invert prose-zinc prose-h2:uppercase prose-h2:font-black prose-h2:tracking-tight prose-h2:text-3xl prose-h2:border-b prose-h2:border-zinc-800 prose-h2:pb-4 prose-h2:mt-16 prose-p:text-lg prose-p:leading-relaxed prose-p:text-zinc-300 prose-code:text-amber-300 prose-code:bg-zinc-900 prose-code:px-1.5 prose-code:py-0.5 prose-code:before:content-none prose-code:after:content-none prose-blockquote:border-l-4 prose-blockquote:border-white prose-blockquote:italic prose-blockquote:text-2xl prose-blockquote:font-medium prose-blockquote:text-zinc-100 prose-blockquote:py-2 prose-pre:bg-zinc-900 prose-pre:border prose-pre:border-zinc-800 prose-pre:rounded-none prose-pre:p-6 prose-li:text-zinc-300 prose-li:text-lg max-w-3xl"
            dangerouslySetInnerHTML={{ __html: post.body }}
          />

          <div className="mt-24 flex flex-col items-center justify-between gap-8 border-t border-zinc-800 pt-12 md:flex-row">
            <div className="flex items-center gap-4">
              <div className="size-12 rounded-none bg-white" />
              <div>
                <div className="text-sm font-bold tracking-tight text-white uppercase">
                  Arche Team
                </div>
                <div className="font-mono text-xs tracking-widest text-zinc-500 uppercase">
                  Core Engineering
                </div>
              </div>
            </div>
            <a
              href="/blog"
              className="border border-white px-6 py-3 text-sm font-bold tracking-widest uppercase transition-colors hover:bg-white hover:text-black"
            >
              ← Back to Changelog
            </a>
          </div>
        </div>
      </article>
    </main>
  )
}
