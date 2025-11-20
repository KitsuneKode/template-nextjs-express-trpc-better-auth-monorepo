'use client'

import Link from 'next/link'
import { useState } from 'react'
import { motion, Variants } from 'motion/react'
import { Badge } from '@template/ui/components/badge'
import { Button } from '@template/ui/components/button'
import { Textarea } from '@template/ui/components/textarea'
import { GithubButton } from '@template/ui/components/github-button'
import {
  Copy,
  Check,
  ArrowRight,
  ShieldCheck,
  Package,
  Zap,
  Cable,
  Workflow,
  Gauge,
  Lock,
  FileCode,
} from 'lucide-react'

export default function Home() {
  const [copied, setCopied] = useState(false)
  const repoUrl =
    'https://github.com/KitsuneKode/template-nextjs-express-trpc-better-auth-monorepo'
  const quickStartCommand = `bun create turbo@latest --example ${repoUrl}`

  const handleCopy = () => {
    navigator.clipboard.writeText(quickStartCommand)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Animation variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  }

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: [0.4, 0.0, 0.2, 1] },
    },
  }

  const features = [
    {
      icon: <Cable className="h-6 w-6" />,
      title: 'End-to-End Type Safety',
      description:
        'Full-stack type safety with tRPC. Share types between frontend and backend without code generation.',
    },
    {
      icon: <ShieldCheck className="h-6 w-6" />,
      title: 'Better Auth Integration',
      description:
        'Secure session-based authentication with email/password, OAuth providers, and role-based access control.',
    },
    {
      icon: <Package className="h-6 w-6" />,
      title: 'Optimized Monorepo',
      description:
        'Turborepo with incremental builds, task caching, and parallel execution for blazing-fast development.',
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: 'Bun-Powered',
      description:
        'Lightning-fast package installation, bundling, and runtime performance with the Bun JavaScript runtime.',
    },
    {
      icon: <Workflow className="h-6 w-6" />,
      title: 'Shared Packages',
      description:
        'Reusable UI components, utilities, and configurations shared across all apps in the monorepo.',
    },
    {
      icon: <Gauge className="h-6 w-6" />,
      title: 'Database with Prisma',
      description:
        'Type-safe database access with Prisma ORM, migrations, and seeding scripts included.',
    },
    {
      icon: <Lock className="h-6 w-6" />,
      title: 'Production Ready',
      description:
        'Docker configurations, environment validation, error handling, and logging built-in.',
    },
    {
      icon: <FileCode className="h-6 w-6" />,
      title: 'Developer Experience',
      description:
        'ESLint, Prettier, TypeScript strict mode, and Git hooks for consistent code quality.',
    },
  ]

  const techStack = [
    { name: 'Next.js 15', href: 'https://nextjs.org/' },
    { name: 'Express', href: 'https://expressjs.com/' },
    { name: 'tRPC', href: 'https://trpc.io/' },
    { name: 'Bun', href: 'https://bun.sh/' },
    { name: 'Prisma', href: 'https://www.prisma.io/' },
    { name: 'Turborepo', href: 'https://turbo.build/' },
    { name: 'Better Auth', href: 'https://better-auth.com/' },
    { name: 'Shadcn/UI', href: 'https://ui.shadcn.com/' },
  ]

  const benefits = [
    {
      title: 'Shared Code, Zero Duplication',
      description:
        'Share validation schemas, types, utilities, and UI components across frontend and backend without code duplication.',
    },
    {
      title: 'Incremental Builds',
      description:
        'Turborepo only rebuilds what changed. Edit a shared package and only affected apps rebuild automatically.',
    },
    {
      title: 'Remote Caching',
      description:
        'Share build cache across your team and CI/CD. Never rebuild the same code twice, even on different machines.',
    },
  ]

  return (
    <main className="bg-background relative min-h-svh w-full overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 -z-10 h-full w-full">
        <div className="absolute h-full w-full bg-[radial-gradient(circle_at_50%_50%,rgba(var(--primary-rgb,100,100,100),0.1),transparent_50%)]"></div>
        <div className="bg-primary/10 absolute top-0 right-0 h-[500px] w-[500px] translate-x-1/4 -translate-y-1/4 rounded-full blur-3xl"></div>
        <div className="bg-accent/10 absolute bottom-0 left-0 h-[500px] w-[500px] -translate-x-1/4 translate-y-1/4 rounded-full blur-3xl"></div>
      </div>

      <motion.div
        className="mx-auto flex max-w-6xl flex-col items-center px-4 py-16 sm:py-24"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Hero Section */}
        <motion.section className="w-full text-center" variants={itemVariants}>
          <Badge
            variant="outline"
            className="border-primary/50 bg-primary/10 mb-6 px-4 py-1.5"
          >
            Production-Ready Full-Stack Template
          </Badge>
          <h1 className="text-foreground text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Build Modern Apps, <span className="text-primary">Faster.</span>
          </h1>
          <p className="text-muted-foreground mx-auto mt-6 max-w-2xl text-lg">
            A type-safe monorepo with Next.js, Express, tRPC, Better Auth, and
            the best of the modern web. Ship production-ready apps in days, not
            weeks.
          </p>

          <motion.div
            className="mt-10 flex flex-wrap items-center justify-center gap-4"
            variants={itemVariants}
          >
            <Button asChild size="lg" className="h-12">
              <Link href="/demo">
                View Demo <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <GithubButton repoUrl={repoUrl} targetStars={10} />
          </motion.div>

          <p className="text-muted-foreground mt-4 text-sm">
            Star the repo to show your support! ⭐
          </p>
        </motion.section>

        {/* Quick Start */}
        <motion.section
          className="mt-20 w-full max-w-2xl"
          variants={itemVariants}
        >
          <div className="group border-border bg-card relative rounded-xl border p-6 shadow-md transition-all duration-300 hover:shadow-lg">
            <div className="from-primary via-accent to-secondary absolute -inset-0.5 rounded-xl bg-linear-to-r opacity-0 blur transition duration-500 group-hover:opacity-20"></div>
            <div className="relative">
              <h2 className="bg-gre text-card-foreground text-xl font-semibold">
                Quick Start
              </h2>
              <p className="text-muted-foreground mb-4 text-sm">
                Get your project running with a single command
              </p>
              <div className="border-border bg-muted relative overflow-hidden rounded-lg border">
                <Textarea
                  value={quickStartCommand}
                  readOnly
                  rows={2}
                  className="text-foreground"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-1/2 right-2 -translate-y-1/2"
                  onClick={handleCopy}
                >
                  {copied ? (
                    <Check className="text-primary h-5 w-5" />
                  ) : (
                    <Copy className="h-5 w-5" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Features Grid */}
        <motion.section className="mt-24 w-full" variants={itemVariants}>
          <div className="text-center">
            <h2 className="text-foreground text-3xl font-bold tracking-tight">
              Everything You Need
            </h2>
            <p className="text-muted-foreground mt-2">
              Batteries included, best practices enforced
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <motion.div
                key={feature.title}
                className="group border-border bg-card hover:border-primary/50 rounded-lg border p-6 shadow-sm transition-all duration-300 hover:shadow-md"
                variants={itemVariants}
                whileHover={{ scale: 1.03 }}
              >
                <div className="text-primary mb-4">{feature.icon}</div>
                <h3 className="text-card-foreground font-semibold">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground mt-2 text-sm">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Benefits Section */}
        <motion.section className="mt-24 w-full" variants={itemVariants}>
          <div className="text-center">
            <h2 className="text-foreground text-3xl font-bold tracking-tight">
              Why Turborepo Monorepo?
            </h2>
            <p className="text-muted-foreground mt-2">
              Work smarter, not harder
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {benefits.map((benefit) => (
              <div
                key={benefit.title}
                className="border-border bg-card rounded-lg border p-6 shadow-sm"
              >
                <h3 className="text-card-foreground font-semibold">
                  {benefit.title}
                </h3>
                <p className="text-muted-foreground mt-2 text-sm">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Tech Stack */}
        <motion.section className="mt-24 w-full" variants={itemVariants}>
          <div className="text-center">
            <p className="text-muted-foreground text-sm font-medium tracking-wider uppercase">
              Powered By
            </p>
            <h2 className="text-foreground mt-2 text-2xl font-bold tracking-tight">
              Modern Tech Stack
            </h2>
          </div>

          <motion.div
            className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4"
            variants={containerVariants}
          >
            {techStack.map((tech) => (
              <motion.a
                key={tech.name}
                href={tech.href}
                target="_blank"
                rel="noreferrer"
                variants={itemVariants}
                className="group border-border bg-card hover:border-primary/50 hover:bg-accent/10 rounded-lg border p-4 text-center transition-all duration-300"
                whileHover={{ scale: 1.05 }}
              >
                <span className="text-muted-foreground group-hover:text-foreground font-medium transition-colors">
                  {tech.name}
                </span>
              </motion.a>
            ))}
          </motion.div>
        </motion.section>

        {/* CTA Section */}
        <motion.section
          className="mt-24 w-full text-center"
          variants={itemVariants}
        >
          <div className="border-border bg-card rounded-xl border p-12 shadow-lg">
            <h2 className="text-card-foreground text-3xl font-bold">
              Ready to Build?
            </h2>
            <p className="text-muted-foreground mx-auto mt-4 max-w-lg">
              Explore the repository for documentation, examples, and detailed
              setup instructions.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Button asChild size="lg">
                <Link href={repoUrl} target="_blank" rel="noreferrer">
                  Explore Repository
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/demo">View Live Demo</Link>
              </Button>
            </div>
          </div>
        </motion.section>
      </motion.div>
    </main>
  )
}
