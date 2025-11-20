"use client";

import React, { useState } from "react";
import { Play, Database, Table } from "lucide-react";
import { CodeBlock } from "@/components/ui/code-block";

export const DatabasePlayground = () => {
  const [query, setQuery] = useState(`await prisma.user.findMany({
  where: {
    role: 'ADMIN'
  },
  include: {
    posts: true
  }
})`);
  const [result, setResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const runQuery = () => {
    setIsLoading(true);
    setResult(null);
    setTimeout(() => {
      setResult(JSON.stringify([
        {
          id: "cuid_123",
          email: "admin@example.com",
          role: "ADMIN",
          posts: [
            { id: 1, title: "Hello World" },
            { id: 2, title: "Prisma is cool" }
          ]
        }
      ], null, 2));
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="grid lg:grid-cols-2 gap-8 h-[500px]">
      <div className="flex flex-col gap-4">
        <div className="flex-1 rounded-2xl border border-white/10 bg-neutral-900/50 overflow-hidden flex flex-col">
          <div className="p-4 border-b border-white/10 bg-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2 text-white font-medium">
              <Database size={18} className="text-[var(--solar-purple)]" />
              <span>Prisma Query</span>
            </div>
            <button 
              onClick={runQuery}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-1.5 bg-[var(--solar-purple)] text-neutral-900 font-bold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              <Play size={16} />
              Run
            </button>
          </div>
          <div className="flex-1 p-4 font-mono text-sm">
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full h-full bg-transparent text-neutral-200 resize-none focus:outline-none"
              spellCheck={false}
            />
          </div>
        </div>

        <div className="h-48 rounded-2xl border border-white/10 bg-neutral-900/50 overflow-hidden flex flex-col">
          <div className="p-3 border-b border-white/10 bg-white/5 flex items-center gap-2 text-white font-medium text-sm">
            <Table size={16} className="text-neutral-400" />
            <span>Result</span>
          </div>
          <div className="flex-1 p-4 overflow-auto font-mono text-xs text-green-400">
            {isLoading ? (
              <span className="text-neutral-500">Running query...</span>
            ) : result ? (
              <pre>{result}</pre>
            ) : (
              <span className="text-neutral-600">// Results will appear here</span>
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
  );
};
