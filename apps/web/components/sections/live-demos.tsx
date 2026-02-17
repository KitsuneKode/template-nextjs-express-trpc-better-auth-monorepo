'use client'

import React, { useState } from 'react'
import { SectionWrapper } from '@/components/ui/section-wrapper'
import {
  Tabs,
  TabsContent,
  TabsTrigger,
  TabsList,
} from '@template/ui/components/tabs'

// Placeholder imports for demo components - will implement next
import { AuthFlow } from '@/components/demos/auth-flow'
import { BlogCrud } from '@/components/demos/blog-crud'
import { RealtimeChat } from '@/components/demos/realtime-chat'
import { Database, FileText, Lock, MessageSquare } from 'lucide-react'
import { DatabasePlayground } from '@/components/demos/database-playground'

const DEMO_TABS = [
  {
    id: 'auth',
    label: 'Authentication',
    icon: Lock,
    component: AuthFlow,
    description: 'Secure email & social auth with Better Auth',
  },
  {
    id: 'chat',
    label: 'Real-time Chat',
    icon: MessageSquare,
    component: RealtimeChat,
    description: 'Live messaging powered by tRPC & Redis',
  },
  {
    id: 'blog',
    label: 'Blog CMS',
    icon: FileText,
    component: BlogCrud,
    description: 'Full CRUD operations with Prisma ORM',
  },
  {
    id: 'db',
    label: 'Database',
    icon: Database,
    component: DatabasePlayground,
    description: 'Direct database interaction & visualization',
  },
]

export const LiveDemos = ({ mode = 'real' }: { mode?: 'mock' | 'real' }) => {
  return (
    <SectionWrapper id="demos" className="relative overflow-hidden py-24">
      <div className="mb-16 text-center">
        <h2 className="mb-6 bg-gradient-to-r from-white via-neutral-200 to-neutral-400 bg-clip-text text-3xl font-bold text-transparent md:text-5xl">
          Interactive Demos
        </h2>
        <p className="mx-auto max-w-2xl text-xl text-neutral-400">
          Experience the power of the stack. Try out the live demos below.
        </p>
      </div>

      <Tabs defaultValue="chat" className="flex flex-col items-center">
        <TabsList className="mb-12 flex flex-wrap justify-center gap-2 rounded-full border border-white/10 bg-white/5 p-1 backdrop-blur-sm">
          {DEMO_TABS.map((tab) => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              className="rounded-full px-6 py-2.5 text-sm font-medium text-neutral-400 transition-all hover:text-white focus:outline-none data-[state=active]:bg-[var(--solar-orange)] data-[state=active]:text-white data-[state=active]:shadow-lg"
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <div className="relative min-h-[600px] w-full max-w-5xl">
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
