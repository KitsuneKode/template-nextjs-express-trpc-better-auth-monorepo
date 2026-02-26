'use client'

import React, { useState } from 'react'
import { Play, Database, Table } from '@template/ui/components/icons'
import { CodeBlock } from '@/components/ui/code-block'

export const DatabasePlayground = () => {
  const [query, setQuery] = useState(`await prisma.user.findMany({
  where: {
    role: 'ADMIN'
  },
  include: {
    posts: true
  }
})`)
  const [result, setResult] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const runQuery = () => {
    setIsLoading(true)
    setResult(null)
    setTimeout(() => {
      setResult(
        JSON.stringify(
          [
            {
              id: 'cuid_123',
              email: 'admin@example.com',
              role: 'ADMIN',
              posts: [
                { id: 1, title: 'Hello World' },
                { id: 2, title: 'Prisma is cool' },
              ],
            },
          ],
          null,
          2,
        ),
      )
      setIsLoading(false)
    }, 800)
  }

  return (
    <div className="grid h-[500px] gap-8 lg:grid-cols-2">
      <div className="flex flex-col gap-4">
        <div className="flex flex-1 flex-col overflow-hidden rounded-2xl border border-white/10 bg-neutral-900/50">
          <div className="flex items-center justify-between border-b border-white/10 bg-white/5 p-4">
            <div className="flex items-center gap-2 font-medium text-white">
              <Database size={18} className="text-[var(--solar-purple)]" />
              <span>Prisma Query</span>
            </div>
            <button
              onClick={runQuery}
              disabled={isLoading}
              className="flex items-center gap-2 rounded-lg bg-[var(--solar-purple)] px-4 py-1.5 font-bold text-neutral-900 transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              <Play size={16} />
              Run
            </button>
          </div>
          <div className="flex-1 p-4 font-mono text-sm">
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="h-full w-full resize-none bg-transparent text-neutral-200 focus:outline-none"
              spellCheck={false}
            />
          </div>
        </div>

        <div className="flex h-48 flex-col overflow-hidden rounded-2xl border border-white/10 bg-neutral-900/50">
          <div className="flex items-center gap-2 border-b border-white/10 bg-white/5 p-3 text-sm font-medium text-white">
            <Table size={16} className="text-neutral-400" />
            <span>Result</span>
          </div>
          <div className="flex-1 overflow-auto p-4 font-mono text-xs text-green-400">
            {isLoading ? (
              <span className="text-neutral-500">Running query...</span>
            ) : result ? (
              <pre>{result}</pre>
            ) : (
              <span className="text-neutral-600">
                // Results will appear here
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="hidden lg:block">
        <CodeBlock
          filename="prisma/schema.prisma"
          language="prisma"
          code={`datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  role      Role     @default(USER)
  posts     Post[]
  createdAt DateTime @default(now())
}

model Post {
  id        Int      @id @default(autoincrement())
  title     String
  content   String?
  published Boolean  @default(false)
  author    User     @relation(fields: [authorId], references: [id])
  authorId  String
}

enum Role {
  USER
  ADMIN
}`}
        />
      </div>
    </div>
  )
}
