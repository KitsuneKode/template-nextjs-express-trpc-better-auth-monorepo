'use client'

import { Tabs, TabsList, TabsTrigger, TabsContent } from '@arche-template/ui/components/tabs'
import { motion } from 'motion/react'

const examples = [
  {
    id: 'trpc',
    title: 'tRPC Procedure',
    desc: 'Fully typed API endpoints with input validation and middleware.',
    code: `import { z } from "zod";
import { protectedProcedure, router } from "../trpc";

export const userRouter = router({
  getProfile: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      // ctx.db is typed via Prisma
      // input.id is validated via Zod
      return ctx.db.user.findUnique({
        where: { id: input.id },
      });
    }),
});`,
    lang: 'typescript',
  },
  {
    id: 'auth',
    title: 'Auth Provider',
    desc: 'Better Auth configuration with OAuth providers and database adapter.',
    code: `import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { db } from "@arche/store";

export const auth = betterAuth({
  providers: [
    {
      id: "google",
      name: "Google",
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
    {
      id: "github",
      name: "GitHub",
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }
  ],
  database: prismaAdapter(db),
});`,
    lang: 'typescript',
  },
  {
    id: 'prisma',
    title: 'Prisma Schema',
    desc: 'Single source of truth for your database models and relations.',
    code: `model User {
  id        String    @id @default(cuid())
  email     String    @unique
  name      String?
  posts     Post[]
  sessions  Session[]
}

model Session {
  id        String   @id @default(cuid())
  userId    String
  expiresAt DateTime
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model Post {
  id        String   @id @default(cuid())
  title     String
  content   String
  authorId  String
  author    User     @relation(fields: [authorId], references: [id])
}`,
    lang: 'prisma',
  },
  {
    id: 'docker',
    title: 'Docker Compose',
    desc: 'Local infrastructure for Postgres and Redis, ready instantly.',
    code: `version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: arche
      POSTGRES_PASSWORD: password
      POSTGRES_DB: arche_db
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data
  
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  pgdata:`,
    lang: 'yaml',
  },
]

export function CodeExample() {
  return (
    <div className="w-full border border-zinc-800 bg-black shadow-[8px_8px_0_0_rgba(39,39,42,1)]">
      <Tabs defaultValue="trpc" className="w-full">
        {/* Header / Tabs List */}
        <div className="flex flex-col justify-between gap-4 border-b border-zinc-800 bg-zinc-900 px-2 py-2 sm:flex-row sm:items-center">
          <TabsList className="h-auto w-full justify-start overflow-x-auto rounded-none border border-zinc-800 bg-black p-1 sm:w-auto">
            {examples.map((ex) => (
              <TabsTrigger
                key={ex.id}
                value={ex.id}
                className="rounded-none px-4 py-2 font-mono text-xs tracking-widest text-zinc-400 uppercase data-[state=active]:bg-zinc-800 data-[state=active]:text-white"
              >
                {ex.title}
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="hidden items-center gap-2 pr-4 sm:flex">
            <span className="size-2 rounded-full bg-red-500"></span>
            <span className="size-2 rounded-full bg-amber-500"></span>
            <span className="size-2 rounded-full bg-green-500"></span>
          </div>
        </div>

        {/* Tab Content */}
        {examples.map((ex) => (
          <TabsContent key={ex.id} value={ex.id} className="mt-0 outline-none">
            <div className="flex flex-col divide-y divide-zinc-800 md:flex-row md:divide-x md:divide-y-0">
              {/* Description sidebar */}
              <div className="shrink-0 bg-zinc-950/30 p-6 md:w-64">
                <h3 className="mb-2 font-bold tracking-tight text-white uppercase">{ex.title}</h3>
                <p className="text-sm leading-relaxed font-medium text-zinc-500">{ex.desc}</p>
              </div>

              {/* Code block */}
              <div className="flex-1 overflow-x-auto bg-[#0d0d0d] p-6">
                <motion.pre
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="font-mono text-sm leading-relaxed break-all whitespace-pre-wrap"
                >
                  <code dangerouslySetInnerHTML={{ __html: syntaxHighlight(ex.code) }} />
                </motion.pre>
              </div>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}

function syntaxHighlight(code: string) {
  // First, escape HTML characters
  let html = code.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

  // Patterns to match
  const patterns = [
    // Comments
    { regex: /(\/\/.*)/g, class: 'text-zinc-500' },
    // Strings
    { regex: /(".*?"|'.*?')/g, class: 'text-amber-300' },
    // Keywords
    {
      regex:
        /\b(import|from|export|const|async|await|return|model|version|services|volumes|environment|ports)\b/g,
      class: 'text-pink-500',
    },
    // Types and Functions
    {
      regex:
        /\b(protectedProcedure|router|z|object|string|betterAuth|prismaAdapter|User|Post|Session|DateTime|String)\b/g,
      class: 'text-blue-400',
    },
  ]

  // We need to apply these in a way that doesn't overlap.
  // One way is to identify all matches first and then rebuild the string.

  // Simple approach: apply replacements one by one but avoid re-matching inside <span> tags
  // This is still risky with regex. Let's try a safer token-based replacement.

  // For a robust brutalist highlighter, we'll just do one pass with a combined regex.
  const combinedRegex = new RegExp(patterns.map((p) => `(${p.regex.source})`).join('|'), 'g')

  return html.replace(combinedRegex, (match, ...args) => {
    // Find which group matched
    for (let i = 0; i < patterns.length; i++) {
      const pattern = patterns[i]
      if (pattern && args[i]) {
        return `<span class="${pattern.class}">${match}</span>`
      }
    }
    return match
  })
}
