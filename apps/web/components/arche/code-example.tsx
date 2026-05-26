import { connection } from 'next/server'

import { highlightCode } from '@/lib/highlight'

import { CodeExampleClient } from '@/components/arche/code-example-client'

const examples = [
  {
    id: 'trpc',
    title: 'tRPC Procedure',
    desc: 'Fully typed API endpoints with input validation and middleware.',
    lang: 'typescript',
    code: `import { z } from "zod";
import { protectedProcedure, router } from "../trpc";

export const userRouter = router({
  getProfile: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.user.findUnique({
        where: { id: input.id },
      });
    }),
});`,
  },
  {
    id: 'auth',
    title: 'Auth Provider',
    desc: 'Better Auth configuration with OAuth providers and database adapter.',
    lang: 'typescript',
    code: `import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { db } from "@arche-template/store";

export const auth = betterAuth({
  database: prismaAdapter(db),
});`,
  },
  {
    id: 'prisma',
    title: 'Prisma Schema',
    desc: 'Single source of truth for your database models and relations.',
    lang: 'prisma',
    code: `model User {
  id        String    @id @default(cuid())
  email     String    @unique
  name      String?
  posts     Post[]
  sessions  Session[]
}

model Post {
  id        String   @id @default(cuid())
  title     String
  content   String
  authorId  String
  author    User     @relation(fields: [authorId], references: [id])
}`,
  },
  {
    id: 'docker',
    title: 'Docker Compose',
    desc: 'Local infrastructure for Postgres and Redis, ready instantly.',
    lang: 'yaml',
    code: `services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: arche
      POSTGRES_PASSWORD: password
      POSTGRES_DB: arche_db
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"`,
  },
] as const

export async function CodeExample() {
  await connection()

  const highlighted = await Promise.all(
    examples.map(async (ex) => ({
      id: ex.id,
      title: ex.title,
      desc: ex.desc,
      highlightedHtml: await highlightCode(ex.code, ex.lang),
    })),
  )

  return <CodeExampleClient examples={highlighted} />
}
