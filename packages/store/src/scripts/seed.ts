import { prisma } from '../index'

async function main() {
  console.log('🌱 Seeding database...')

  // Create a default user if not exists
  const user = await prisma.user.upsert({
    where: { email: 'demo@example.com' },
    update: {},
    create: {
      email: 'demo@example.com',
      name: 'Kitsune Team',
      emailVerified: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      id: 'user_demo_123',
    },
  })

  const posts = [
    {
      title: 'The Future of Full-Stack: Why We Chose Monorepos',
      slug: 'future-of-full-stack-monorepos',
      content: `In the rapidly evolving landscape of web development, the architecture of your codebase is just as critical as the code itself. At KitsuneKode, we've bet big on monorepos, and specifically, the power of Turborepo combined with Next.js and Express.

## The Monorepo Advantage

Gone are the days of managing ten different repositories for a single product. Context switching kills productivity. With a monorepo, your frontend, backend, and shared libraries live in harmony.

1. **Shared Types**: Define your Zod schemas in one package and use them in your API and your UI forms. No more out-of-sync interfaces.
2. **Atomic Commits**: Change an API endpoint and the consuming frontend component in a single PR.
3. **Unified Tooling**: One lint config, one build command, one happy developer.

## Why Bun?

We switched to Bun for this template because speed matters. Package installation is instant. Tests run in milliseconds. It's not just a runtime; it's a quality of life improvement.

## Conclusion

This template isn't just a starter; it's a philosophy. It's about reducing friction and letting you focus on building features that matter. Give it a spin and let us know what you build!`,
      published: true,
    },
    {
      title: 'Mastering tRPC: End-to-End Type Safety',
      slug: 'mastering-trpc-type-safety',
      content: `If you've ever had your frontend crash because the backend API changed a field name without you knowing, you need tRPC. It's not just a library; it's a contract between your client and server that is enforced by the compiler.

## How it Works

tRPC allows you to export the *type* of your router, not the router itself. Your frontend imports this type and suddenly, your IDE knows exactly what endpoints exist, what inputs they expect, and what they return.

\`\`\`typescript
// Backend
export const appRouter = t.router({
  hello: t.procedure.input(z.string()).query(({ input }) => {
    return \`Hello \${input}\`;
  }),
});

// Frontend
trpc.hello.useQuery('World'); // Type-safe!
\`\`\`

## The Developer Experience

The autocomplete is magical. You type \`trpc.\` and see your entire API surface. Refactoring becomes a breeze—rename a procedure in the backend, and TypeScript immediately highlights every usage in the frontend that needs updating.

## Performance

tRPC is lightweight and built on standard HTTP. With our setup using React Query (TanStack Query), you get caching, optimistic updates, and invalidation strategies out of the box.`,
      published: true,
    },
    {
      title: 'Designing for the Dark: The Solar Dusk Theme',
      slug: 'designing-solar-dusk-theme',
      content: `Dark mode isn't just about inverting colors. It's about creating an atmosphere. For this template, we wanted something that felt premium, modern, and slightly futuristic. Enter "Solar Dusk".

## The Palette

We moved away from pure blacks (#000000) which can be harsh on high-contrast displays. Instead, we use rich, deep neutrals (#0a0a0a) layered with translucent whites.

The accent colors are where the magic happens:
- **Solar Orange**: Energy, action, primary CTAs.
- **Solar Magenta**: Creativity, gradients, secondary highlights.
- **Solar Teal**: Success, information, technical details.

## Glassmorphism & Depth

We use \`backdrop-filter: blur()\` extensively to create depth. UI elements aren't just flat cards; they are layers of glass floating above a dynamic background. This provides context and hierarchy without cluttering the screen with borders and shadows.

## Micro-interactions

Static interfaces are boring. We use Framer Motion (now Motion) to add life. Buttons scale slightly on press. Cards lift on hover. Lists cascade in. These micro-interactions make the application feel responsive and alive.`,
      published: true,
    },
  ]

  for (const post of posts) {
    await prisma.post.upsert({
      where: { slug: post.slug },
      update: {},
      create: {
        ...post,
        authorId: user.id,
      },
    })
  }

  console.log('✅ Seeding complete!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
