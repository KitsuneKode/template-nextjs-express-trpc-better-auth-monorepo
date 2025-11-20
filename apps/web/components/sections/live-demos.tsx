"use client";

import React, { useState } from "react";
import * as Tabs from "@radix-ui/react-tabs";
import { SectionWrapper } from "../ui/section-wrapper";
import { motion } from "motion/react";

// Placeholder imports for demo components - will implement next
import { RealtimeChat } from "@/components/demos/realtime-chat";
import { AuthFlow } from "@/components/demos/auth-flow";
import { BlogCrud } from "@/components/demos/blog-crud";
import { DatabasePlayground } from "@/components/demos/database-playground";
import { Database, FileText, MessageSquare } from "lucide-react";

const DEMO_TABS = [
  {
    id: "auth",
    label: "Authentication",
    icon: Lock,
    component: AuthFlow,
    description: "Secure email & social auth with Better Auth",
  },
  {
    id: "chat",
    label: "Real-time Chat",
    icon: MessageSquare,
    component: RealtimeChat,
    description: "Live messaging powered by tRPC & Redis",
  },
  {
    id: "blog",
    label: "Blog CMS",
    icon: FileText,
    component: BlogCrud,
    description: "Full CRUD operations with Prisma ORM",
  },
  {
    id: "db",
    label: "Database",
    icon: Database,
    component: DatabasePlayground,
    description: "Direct database interaction & visualization",
  },
];

export const LiveDemos = ({ mode = "real" }: { mode?: "mock" | "real" }) => {

  return (
    <SectionWrapper id="demos" className="py-24 relative overflow-hidden">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white via-neutral-200 to-neutral-400 bg-clip-text text-transparent">
          Interactive Demos
        </h2>
        <p className="text-xl text-neutral-400 max-w-2xl mx-auto">
          Experience the power of the stack. Try out the live demos below.
        </p>
      </div>

      <Tabs.Root defaultValue="chat" className="flex flex-col items-center">
        <Tabs.List className="flex flex-wrap justify-center gap-2 mb-12 p-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
          {DEMO_TABS.map((tab) => (
            <Tabs.Trigger
              key={tab.id}
              value={tab.id}
              className="px-6 py-2.5 rounded-full text-sm font-medium text-neutral-400 transition-all data-[state=active]:bg-[var(--solar-orange)] data-[state=active]:text-white data-[state=active]:shadow-lg hover:text-white focus:outline-none"
            >
              {tab.label}
            </Tabs.Trigger>
          ))}
        </Tabs.List>

        <div className="w-full max-w-5xl min-h-[600px] relative">
          <Tabs.Content value="chat" className="w-full focus:outline-none">
            <RealtimeChat mode={mode} />
          </Tabs.Content>
          <Tabs.Content value="auth" className="w-full focus:outline-none">
            <AuthFlow mode={mode} />
          </Tabs.Content>
          <Tabs.Content value="blog" className="w-full focus:outline-none">
            <BlogCrud mode={mode} />
          </Tabs.Content>
          <Tabs.Content value="db" className="w-full focus:outline-none">
            <DatabasePlayground />
          </Tabs.Content>
        </div>
      </Tabs.Root>
    </SectionWrapper>
  );
};
