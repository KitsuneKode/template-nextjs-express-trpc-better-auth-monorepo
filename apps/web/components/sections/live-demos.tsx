"use client";

import React from "react";
import * as Tabs from "@radix-ui/react-tabs";
import { SectionWrapper } from "../ui/section-wrapper";
import { motion } from "motion/react";

// Placeholder imports for demo components - will implement next
import { RealtimeChat } from "../demos/realtime-chat";
import { AuthFlow } from "../demos/auth-flow";
import { BlogCrud } from "../demos/blog-crud";
import { DatabasePlayground } from "../demos/database-playground";

const DEMO_TABS = [
  { id: "chat", label: "Real-time Chat" },
  { id: "auth", label: "Authentication" },
  { id: "blog", label: "Blog CRUD" },
  { id: "db", label: "DB Playground" },
];

export const LiveDemos = () => {
  return (
    <SectionWrapper id="demos">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
          Experience the Power
        </h2>
        <p className="text-lg text-neutral-400">
          Interact with live demos powered by the template's core technologies.
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
            <RealtimeChat />
          </Tabs.Content>
          <Tabs.Content value="auth" className="w-full focus:outline-none">
            <AuthFlow />
          </Tabs.Content>
          <Tabs.Content value="blog" className="w-full focus:outline-none">
            <BlogCrud />
          </Tabs.Content>
          <Tabs.Content value="db" className="w-full focus:outline-none">
            <DatabasePlayground />
          </Tabs.Content>
        </div>
      </Tabs.Root>
    </SectionWrapper>
  );
};
