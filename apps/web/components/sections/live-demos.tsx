'use client'

import React from 'react'
import { AuthFlow } from '@/components/demos/auth-flow'
import { BlogCrud } from '@/components/demos/blog-crud'
import { RealtimeChat } from '@/components/demos/realtime-chat'
import { SectionWrapper } from '@/components/ui/section-wrapper'
import { DatabasePlayground } from '@/components/demos/database-playground'
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
    <SectionWrapper id="demos" className="py-24 sm:py-32">
      <div className="mb-12 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <p className="mb-4 text-xs font-semibold tracking-widest text-[#D9AB72] uppercase">
            Functional Proof
          </p>
          <h2 className="font-serif text-4xl font-medium tracking-tight text-[#FAFAFA] sm:text-5xl">
            This is not just pretty scaffolding.
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-[#A1A1AA]">
            Click through the demos to verify real interaction patterns before
            writing your own features.
          </p>
        </div>
        <div className="hidden lg:block">
          <div className="rounded-xl border border-white/10 bg-white/[0.02] px-5 py-3 text-sm text-[#A1A1AA]">
            Live execution environment
          </div>
        </div>
      </div>

      <Tabs defaultValue="chat" className="flex w-full flex-col gap-8">
        <div className="scrollbar-hide w-full overflow-x-auto pb-2">
          <TabsList className="inline-flex !h-auto min-w-full items-stretch justify-start gap-2 rounded-none bg-transparent p-0 lg:grid lg:grid-cols-4 lg:gap-4">
            {DEMO_TABS.map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="group flex !h-auto min-w-[280px] shrink-0 flex-col items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.02] p-5 text-left whitespace-normal transition-all hover:bg-white/[0.04] data-[state=active]:border-[#D9AB72]/30 data-[state=active]:bg-[#D9AB72]/[0.02] lg:min-w-0"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/5 text-[#D9AB72] ring-1 ring-white/10 transition-colors group-data-[state=active]:bg-[#D9AB72]/10 group-data-[state=active]:text-[#D9AB72] group-data-[state=active]:ring-[#D9AB72]/30">
                    <tab.icon className="h-5 w-5" />
                  </div>
                  <span className="text-base font-medium text-[#FAFAFA]">
                    {tab.label}
                  </span>
                </div>
                <span className="text-sm leading-relaxed text-[#A1A1AA] group-data-[state=active]:text-[#D4D4D8]">
                  {tab.description}
                </span>
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <div className="min-w-0 rounded-2xl border border-white/10 bg-[#0A0A0A] shadow-2xl">
          <div className="flex items-center gap-2 border-b border-white/5 px-4 py-3">
            <div className="h-2 w-2 rounded-full bg-white/20" />
            <div className="h-2 w-2 rounded-full bg-white/20" />
            <div className="h-2 w-2 rounded-full bg-white/20" />
          </div>
          <div className="p-4 sm:p-6">
            <TabsContent value="chat" className="m-0 focus:outline-none">
              <RealtimeChat mode={mode} />
            </TabsContent>
            <TabsContent value="auth" className="m-0 focus:outline-none">
              <AuthFlow mode={mode} />
            </TabsContent>
            <TabsContent value="blog" className="m-0 focus:outline-none">
              <BlogCrud mode={mode} />
            </TabsContent>
            <TabsContent value="db" className="m-0 focus:outline-none">
              <DatabasePlayground />
            </TabsContent>
          </div>
        </div>
      </Tabs>
    </SectionWrapper>
  )
}
