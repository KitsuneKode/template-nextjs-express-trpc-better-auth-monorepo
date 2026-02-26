'use client'

import {
  Database,
  Lock,
  MessageSquare,
  Shield,
} from '@template/ui/components/icons'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@template/ui/components/tabs'

const proof = [
  {
    id: 'auth',
    label: 'Auth',
    icon: Lock,
    detail:
      'Session checks and provider login flow are pre-wired with Better Auth. No glue code sprint before your first feature.',
    snippet: `await authClient.signIn.email({\n  email,\n  password\n})`,
  },
  {
    id: 'api',
    label: 'Typed API',
    icon: Shield,
    detail:
      'tRPC routers provide end-to-end inference so query/mutation contracts are enforced by TypeScript.',
    snippet: `const posts = await trpc.post.list.query()\nposts[0]?.title // typed`,
  },
  {
    id: 'data',
    label: 'Data',
    icon: Database,
    detail:
      'Prisma models, migrations, and shared store package are set for predictable schema evolution.',
    snippet: `await prisma.post.create({\n  data: { title, authorId }\n})`,
  },
  {
    id: 'realtime',
    label: 'Realtime',
    icon: MessageSquare,
    detail:
      'Redis-backed patterns let you ship chat/event features without refactoring core app structure.',
    snippet: `await redis.publish('chat', payload)`,
  },
] as const

export function ProofTabs() {
  return (
    <Tabs defaultValue="auth" className="w-full">
      <TabsList className="grid w-full grid-cols-2 gap-2 rounded-2xl border border-white/10 bg-[#0e1319]/86 p-2 md:grid-cols-4">
        {proof.map((item) => (
          <TabsTrigger
            key={item.id}
            value={item.id}
            className="rounded-xl border border-transparent px-3 py-2 text-xs font-semibold tracking-[0.1em] text-[#c8b59d] uppercase transition data-[state=active]:border-[#d7ae7f]/30 data-[state=active]:bg-[#d7ae7f]/12 data-[state=active]:text-[#f4e7d8]"
          >
            <span className="inline-flex items-center gap-2">
              <item.icon className="h-4 w-4" /> {item.label}
            </span>
          </TabsTrigger>
        ))}
      </TabsList>

      {proof.map((item) => (
        <TabsContent
          key={item.id}
          value={item.id}
          className="mt-4 rounded-2xl border border-white/10 bg-[#0d1218]/88 p-5"
        >
          <p className="text-sm leading-relaxed text-[#c4b19a]">
            {item.detail}
          </p>
          <pre className="mt-4 rounded-xl border border-white/8 bg-[#080c11] p-3 text-xs break-all whitespace-pre-wrap text-[#9eb2c3]">
            <code>{item.snippet}</code>
          </pre>
        </TabsContent>
      ))}
    </Tabs>
  )
}
