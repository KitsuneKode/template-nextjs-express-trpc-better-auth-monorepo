import { Navbar } from '@/components/arche/navbar'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'

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
    `
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
    `
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
    `
  }
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
    <main className="min-h-screen bg-black text-white font-sans selection:bg-white selection:text-black">
      <Navbar />

      <article className="max-w-[1200px] mx-auto border-l border-r border-zinc-800 min-h-[calc(100vh-56px)] flex flex-col">
        
        {/* Article Header */}
        <header className="border-b border-zinc-800 p-6 md:p-20 relative overflow-hidden bg-black">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
          
          <div className="relative z-10 flex flex-col items-start max-w-4xl">
            <div className="flex items-center gap-4 mb-8">
              <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest">{post.date}</span>
              <span className="size-1 bg-zinc-800 rounded-full" />
              <span className="text-xs font-mono text-amber-500 uppercase tracking-widest">{post.category}</span>
            </div>
            
            <h1 className="text-5xl md:text-8xl font-black tracking-tighter leading-[0.85] mb-12 uppercase text-white">
              {post.title}
            </h1>
            
            <div className="h-px w-32 bg-white mb-12" />
          </div>
        </header>

        {/* Article Body */}
        <div className="flex-1 p-6 md:p-20 bg-black">
          <div 
            className="max-w-3xl prose prose-invert prose-zinc 
              prose-h2:uppercase prose-h2:font-black prose-h2:tracking-tight prose-h2:text-3xl prose-h2:border-b prose-h2:border-zinc-800 prose-h2:pb-4 prose-h2:mt-16
              prose-p:text-lg prose-p:leading-relaxed prose-p:text-zinc-300
              prose-code:text-amber-300 prose-code:bg-zinc-900 prose-code:px-1.5 prose-code:py-0.5 prose-code:before:content-none prose-code:after:content-none
              prose-blockquote:border-l-4 prose-blockquote:border-white prose-blockquote:italic prose-blockquote:text-2xl prose-blockquote:font-medium prose-blockquote:text-zinc-100 prose-blockquote:py-2
              prose-pre:bg-zinc-900 prose-pre:border prose-pre:border-zinc-800 prose-pre:rounded-none prose-pre:p-6
              prose-li:text-zinc-300 prose-li:text-lg
            "
            dangerouslySetInnerHTML={{ __html: post.body }}
          />
          
          <div className="mt-24 pt-12 border-t border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-4">
              <div className="size-12 bg-white rounded-none" />
              <div>
                <div className="text-sm font-bold uppercase tracking-tight text-white">Arche Team</div>
                <div className="text-xs font-mono text-zinc-500 uppercase tracking-widest">Core Engineering</div>
              </div>
            </div>
            <a href="/blog" className="text-sm font-bold uppercase tracking-widest border border-white px-6 py-3 hover:bg-white hover:text-black transition-colors">
              ← Back to Changelog
            </a>
          </div>
        </div>

      </article>
    </main>
  )
}
