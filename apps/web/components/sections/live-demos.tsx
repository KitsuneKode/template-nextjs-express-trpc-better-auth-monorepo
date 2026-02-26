'use client'

import React from 'react'
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
import { SectionWrapper } from '@/components/ui/section-wrapper'
import { AuthFlow } from '@/components/demos/auth-flow'
import { BlogCrud } from '@/components/demos/blog-crud'
import { RealtimeChat } from '@/components/demos/realtime-chat'
import { DatabasePlayground } from '@/components/demos/database-playground'

const DEMO_TABS = [
  {
    id: 'auth',
    label: 'Authentication',
    icon: Lock,
    component: AuthFlow,
    description: 'Email + social login flows powered by Better Auth.',
  },
  {
    id: 'chat',
    label: 'Realtime Chat',
    icon: MessageSquare,
    component: RealtimeChat,
    description: 'Message send/list flow backed by tRPC + Redis.',
  },
  {
    id: 'blog',
    label: 'Blog CMS',
    icon: FileText,
    component: BlogCrud,
    description: 'Create/publish/delete content with Prisma mutations.',
  },
  {
    id: 'db',
    label: 'Database',
    icon: Database,
    component: DatabasePlayground,
    description: 'Interactive query playground for rapid schema iteration.',
  },
]

export const LiveDemos = ({ mode = 'real' }: { mode?: 'mock' | 'real' }) => {
  return (
    <SectionWrapper id="demos" className="pb-14">
      <div className="mb-10 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <p className="mb-3 text-xs tracking-[0.2em] text-[#ccb392] uppercase">
            Functional Proof
          </p>
          <h2 className="font-serif text-3xl leading-tight text-[#f7efe4] md:text-5xl">
            This is not just pretty scaffolding.
          </h2>
          <p className="mt-4 text-base text-[#d0c0ad] md:text-lg">
            Click through the demos to verify real interaction patterns before
            writing your own features.
          </p>
        </div>
        <div className="rounded-2xl border border-white/12 bg-white/4 px-4 py-3 text-sm text-[#dbcab6]">
          Each demo maps directly to production concerns: auth, data, realtime,
          content.
        </div>
      </div>

      <Tabs defaultValue="chat" className="flex flex-col gap-6">
        <TabsList className="grid w-full grid-cols-1 gap-2 border border-white/12 bg-[#10161d]/80 p-2 md:grid-cols-2 xl:grid-cols-4">
          {DEMO_TABS.map((tab) => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              className="group rounded-2xl border border-transparent px-4 py-3 text-left transition-all data-[state=active]:border-[#d9ab72]/45 data-[state=active]:bg-[#d9ab72]/12"
            >
              <div className="flex items-start gap-3">
                <span className="mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-lg border border-white/12 bg-white/6 text-[#d9ab72]">
                  <tab.icon className="h-4 w-4" />
                </span>
                <span>
                  <span className="block text-sm font-semibold text-[#f4eadc]">
                    {tab.label}
                  </span>
                  <span className="mt-1 block text-xs leading-relaxed text-[#b7a896] group-data-[state=active]:text-[#ddd0be]">
                    {tab.description}
                  </span>
                </span>
              </div>
            </TabsTrigger>
          ))}
        </TabsList>

        <div className="relative overflow-hidden rounded-3xl border border-white/12 bg-[#0f151c]/82 p-3 md:p-5">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-white/6 to-transparent" />
          <TabsContent value="chat" className="w-full focus:outline-none">
            <RealtimeChat mode={mode} />
          </TabsContent>
          <TabsContent value="auth" className="w-full focus:outline-none">
            <AuthFlow mode={mode} />
          </TabsContent>
          <TabsContent value="blog" className="w-full focus:outline-none">
            <BlogCrud mode={mode} />
          </TabsContent>
          <TabsContent value="db" className="w-full focus:outline-none">
            <DatabasePlayground />
          </TabsContent>
        </div>
      </Tabs>
    </SectionWrapper>
  )
}
