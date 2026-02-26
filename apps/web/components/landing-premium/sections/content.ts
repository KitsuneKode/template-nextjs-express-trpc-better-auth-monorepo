import {
  Code2,
  Database,
  Globe,
  Layout,
  Lock,
  MessageSquare,
  Shield,
  Sparkles,
  Table,
  Zap,
} from '@template/ui/components/icons'

export const premiumMetrics = [
  { value: '4', label: 'Production Flows', note: 'auth, data, realtime, cms' },
  { value: '<10m', label: 'Bootstrap Time', note: 'from clone to running stack' },
  { value: '100%', label: 'Typed Boundary', note: 'api, client, database alignment' },
  { value: '1', label: 'Monorepo Truth', note: 'shared ui + shared contracts' },
] as const

export const stackCards = [
  {
    title: 'API Contract via tRPC',
    description:
      'No drift between frontend and backend calls. Inference carries types from router to UI.',
    icon: Shield,
    accent: '#d6ae7f',
    snippet: `const user = await trpc.user.byId.query({ id: 'u_1' })\nuser.email // strongly typed`,
  },
  {
    title: 'Auth with Better Auth',
    description:
      'Session-aware flows and social auth are already wired so product teams skip auth boilerplate.',
    icon: Lock,
    accent: '#66c5b8',
    snippet: `const session = await auth.api.getSession({\n  headers: req.headers\n})`,
  },
  {
    title: 'Prisma-First Data Layer',
    description:
      'Schema, client, and query patterns are structured for maintainability and migrations.',
    icon: Database,
    accent: '#79b3d2',
    snippet: `model Post {\n  id String @id @default(cuid())\n  title String\n  author User @relation(...)\n}`,
  },
  {
    title: 'Realtime Patterns Included',
    description:
      'Redis-ready architecture for chat-style updates and event-driven behavior without redesigning later.',
    icon: MessageSquare,
    accent: '#8fb5e8',
    snippet: `await redis.publish('chat', JSON.stringify({\n  text: 'hello',\n  userId: 'u_1'\n}))`,
  },
  {
    title: 'Shared UI + shadcn Workflow',
    description:
      'Component ownership is centralized in packages/ui, enabling consistency across apps.',
    icon: Layout,
    accent: '#df9f7a',
    snippet: `bunx shadcn@latest add button card dialog\n# components live in packages/ui`,
  },
  {
    title: 'Developer Throughput',
    description:
      'Sane scripts, isolated packages, and fast local loops with Turborepo caching.',
    icon: Code2,
    accent: '#b6a2df',
    snippet: `bun dev\n# web, server, worker start together`,
  },
] as const

export const quickStartSteps = [
  {
    title: 'Scaffold from template',
    command:
      'bun create-turbo@latest --example https://github.com/kitsunekode/template-nextjs-express-trpc-bettera-auth-monorepo my-app',
  },
  {
    title: 'Install dependencies',
    command: 'cd my-app && bun install',
  },
  {
    title: 'Rename package scope',
    command: 'bun run rename-scope',
  },
  {
    title: 'Add shared shadcn components',
    command: 'bunx shadcn@latest add button card dialog dropdown-menu',
  },
  {
    title: 'Run the full stack locally',
    command: 'bun dev',
  },
] as const

export const architectureGroups = [
  {
    column: 'Apps',
    items: [
      { name: 'apps/web', role: 'Next.js app router + UI', icon: Globe },
      { name: 'apps/server', role: 'Express + tRPC handlers', icon: Zap },
      { name: 'apps/worker', role: 'Async jobs + queue processing', icon: Sparkles },
    ],
  },
  {
    column: 'Shared Packages',
    items: [
      { name: 'packages/ui', role: 'shadcn-based shared component system', icon: Layout },
      { name: 'packages/trpc', role: 'router contracts and type-safe client links', icon: Shield },
      { name: 'packages/store', role: 'Prisma schema + generated client', icon: Table },
    ],
  },
] as const

export const flowSteps = [
  'UI actions call typed procedures through tRPC clients.',
  'Server handlers validate input and execute business logic.',
  'Prisma persists and retrieves relational data predictably.',
  'Worker and Redis power async and realtime features without changing architecture.',
] as const
