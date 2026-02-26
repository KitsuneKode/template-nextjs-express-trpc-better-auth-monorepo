import {
  Zap,
  Shield,
  Globe,
  Database,
  Layout,
  Code2,
  Lock,
} from '@template/ui/components/icons'

export const features = [
  {
    title: 'Type-Safe Everything',
    description:
      'End-to-end type safety with tRPC. Catch errors at compile time, not runtime.',
    icon: Shield,
    color: 'var(--solar-orange)',
    code: `const user = await trpc.user.byId.query({ id: '1' });
console.log(user.name); // Typed!`,
  },
  {
    title: 'Modern Authentication',
    description:
      'Secure authentication flows with Better Auth. Social logins, email magic links, and more.',
    icon: Lock,
    color: 'var(--solar-teal)',
    code: `const session = await auth.api.getSession({
  headers: req.headers
});`,
  },
  {
    title: 'Real-Time Ready',
    description:
      'Built-in support for real-time features using Upstash Redis and Server-Sent Events.',
    icon: Zap,
    color: 'var(--solar-blue)',
    code: `await redis.publish('chat', JSON.stringify({
  text: 'Hello World!',
  userId: 'user_123'
}));`,
  },
  {
    title: 'Database Power',
    description:
      'Prisma ORM configured with PostgreSQL. Visual schema editing and type-safe queries.',
    icon: Database,
    color: 'var(--solar-green)',
    code: `model User {
  id    String @id @default(cuid())
  email String @unique
  posts Post[]
}`,
  },
  {
    title: 'Monorepo Architecture',
    description:
      'Scalable Turborepo structure. Share UI components and logic across apps.',
    icon: Layout,
    color: 'var(--solar-purple)',
    code: `apps/
  web/
  server/
packages/
  ui/
  db/`,
  },
  {
    title: 'Developer Experience',
    description:
      'Hot reload, TypeScript, ESLint, Prettier. Everything configured for speed.',
    icon: Code2,
    color: 'var(--solar-orange)',
    code: `pnpm dev
> Ready in 1234ms`,
  },
]

export const terminalSteps = [
  {
    command:
      'bun create-turbo@latest --example https://github.com/kitsunekode/template-nextjs-express-trpc-bettera-auth-monorepo my-app',
    output: 'Downloading template...',
    description: 'Create a new project using the template',
  },
  {
    command: 'cd my-app && bun install',
    output: 'Installing dependencies...',
    description: 'Install all dependencies',
  },
  {
    command: 'bun run rename-scope:dry',
    output: 'Preview scope rename from @template to @myapp',
    description: 'Preview the scope rename (dry run)',
  },
  {
    command: 'bun run rename-scope',
    output: 'Renaming @template to @myapp across all packages...',
    description: 'Rename the package scope to your project name',
  },
  {
    command: 'bunx shadcn@latest add button card dialog dropdown-menu',
    output: 'Adding components to packages/ui...',
    description: 'Install reusable shadcn components into the shared UI package',
  },
  {
    command: 'bun dev',
    output: 'Ready on http://localhost:3000',
    description: 'Start the development server',
  },
]
