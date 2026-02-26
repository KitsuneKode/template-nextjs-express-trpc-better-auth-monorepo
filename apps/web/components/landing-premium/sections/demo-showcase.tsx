'use client'

import { Suspense } from 'react'
import dynamic from 'next/dynamic'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@template/ui/components/tabs'
import {
  Database,
  FileText,
  Lock,
  MessageSquare,
} from '@template/ui/components/icons'

const AuthFlow = dynamic(() =>
  import('@/components/demos/auth-flow').then((m) => m.AuthFlow),
)
const RealtimeChat = dynamic(() =>
  import('@/components/demos/realtime-chat').then((m) => m.RealtimeChat),
)
const BlogCrud = dynamic(() =>
  import('@/components/demos/blog-crud').then((m) => m.BlogCrud),
)
const DatabasePlayground = dynamic(() =>
  import('@/components/demos/database-playground').then(
    (m) => m.DatabasePlayground,
  ),
)

const tabs = [
  { id: 'auth', label: 'Authentication', icon: Lock },
  { id: 'chat', label: 'Realtime Chat', icon: MessageSquare },
  { id: 'blog', label: 'Blog CMS', icon: FileText },
  { id: 'db', label: 'Database', icon: Database },
] as const

function DemoFallback() {
  return (
    <div className="grid h-[500px] animate-pulse gap-4 rounded-2xl border border-white/10 bg-[#0d1218]/86 p-4 lg:grid-cols-2">
      <div className="rounded-xl bg-white/5" />
      <div className="rounded-xl bg-white/5" />
    </div>
  )
}

export function DemoShowcase() {
  return (
    <Tabs defaultValue="auth" className="w-full">
      <TabsList className="grid w-full grid-cols-2 gap-2 rounded-2xl border border-white/10 bg-[#0e1319]/86 p-2 md:grid-cols-4">
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.id}
            value={tab.id}
            className="rounded-xl border border-transparent px-3 py-2 text-xs font-semibold tracking-[0.1em] text-[#c8b59d] uppercase transition data-[state=active]:border-[#d7ae7f]/30 data-[state=active]:bg-[#d7ae7f]/12 data-[state=active]:text-[#f4e7d8]"
          >
            <span className="inline-flex items-center gap-2">
              <tab.icon className="h-4 w-4" /> {tab.label}
            </span>
          </TabsTrigger>
        ))}
      </TabsList>

      <div className="mt-4 rounded-3xl border border-white/10 bg-[#0d1218]/88 p-3 md:p-5">
        <TabsContent value="auth" className="w-full focus:outline-none">
          <Suspense fallback={<DemoFallback />}>
            <AuthFlow mode="mock" />
          </Suspense>
        </TabsContent>
        <TabsContent value="chat" className="w-full focus:outline-none">
          <Suspense fallback={<DemoFallback />}>
            <RealtimeChat mode="mock" />
          </Suspense>
        </TabsContent>
        <TabsContent value="blog" className="w-full focus:outline-none">
          <Suspense fallback={<DemoFallback />}>
            <BlogCrud mode="mock" />
          </Suspense>
        </TabsContent>
        <TabsContent value="db" className="w-full focus:outline-none">
          <Suspense fallback={<DemoFallback />}>
            <DatabasePlayground />
          </Suspense>
        </TabsContent>
      </div>
    </Tabs>
  )
}
