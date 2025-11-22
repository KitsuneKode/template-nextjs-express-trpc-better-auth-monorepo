'use client'

import Link from 'next/link'
import { motion } from 'motion/react'
import { ArrowRight, Github } from 'lucide-react'
import React, { useState, useEffect } from 'react'
import { CodeBlock } from '@/components/ui/code-block'
import { AnimatedGradient } from '../ui/animated-gradient'
import { fadeInUp, staggerChildren } from '../../lib/animations'

const TYPING_TEXTS = [
  'Better Auth',
  'Prisma ORM',
  'tRPC API',
  'Next.js 16',
  'Upstash Redis',
]

export const Hero = () => {
  const [textIndex, setTextIndex] = useState(0)
  const [displayText, setDisplayText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const currentText = TYPING_TEXTS[textIndex] || ''
    const speed = isDeleting ? 50 : 100

    const timer = setTimeout(() => {
      if (!isDeleting && displayText === currentText) {
        setTimeout(() => setIsDeleting(true), 2000)
      } else if (isDeleting && displayText === '') {
        setIsDeleting(false)
        setTextIndex((prev) => (prev + 1) % TYPING_TEXTS.length)
      } else {
        setDisplayText(
          currentText.substring(0, displayText.length + (isDeleting ? -1 : 1)),
        )
      }
    }, speed)

    return () => clearTimeout(timer)
  }, [displayText, isDeleting, textIndex])

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
      <AnimatedGradient />

      <div className="relative z-10 container mx-auto grid items-center gap-12 px-4 md:px-6 lg:grid-cols-2">
        <motion.div
          variants={staggerChildren}
          initial="hidden"
          animate="visible"
          className="text-center lg:text-left"
        >
          <motion.div
            variants={fadeInUp}
            className="mb-4 inline-block rounded-full border border-white/10 bg-white/5 px-4 py-1.5 backdrop-blur-sm"
          >
            <span className="text-sm font-medium text-[var(--solar-teal)]">
              v2.0 Now Available
            </span>
          </motion.div>

          <motion.h1
            variants={fadeInUp}
            className="mb-6 text-4xl font-bold tracking-tight text-white md:text-6xl lg:text-7xl"
          >
            The Full-Stack <br />
            <span className="bg-gradient-to-r from-[var(--solar-orange)] to-[var(--solar-purple)] bg-clip-text text-transparent">
              Monorepo Template
            </span>
          </motion.h1>

          <motion.div
            variants={fadeInUp}
            className="mb-6 h-8 font-mono text-xl text-neutral-300 md:text-2xl"
          >
            Built with{' '}
            <span className="text-[var(--solar-green)]">{displayText}</span>
            <span className="animate-pulse">|</span>
          </motion.div>

          <motion.p
            variants={fadeInUp}
            className="mx-auto mb-8 max-w-xl text-lg text-neutral-400 lg:mx-0"
          >
            Production-ready architecture with Better Auth, Prisma, tRPC, and
            Next.js. Stop configuring and start shipping your next big idea.
          </motion.p>

          <motion.div
            variants={fadeInUp}
            className="flex flex-col justify-center gap-4 sm:flex-row lg:justify-start"
          >
            <Link
              href="#demos"
              className="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-lg bg-[var(--solar-orange)] px-8 font-medium text-white transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(255,107,107,0.5)]"
            >
              <span className="mr-2">View Live Demos</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>

            <Link
              href="https://github.com/kitsunekode/template-nextjs-express-trpc-bettera-auth-monorepo"
              target="_blank"
              className="inline-flex h-12 items-center justify-center rounded-lg border border-white/10 bg-white/5 px-8 font-medium text-white transition-all hover:scale-105 hover:bg-white/10"
            >
              <Github className="mr-2 h-5 w-5" />
              Star on GitHub
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="relative hidden lg:block"
        >
          <motion.div
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            className="relative z-10"
          >
            <CodeBlock
              filename="apps/web/app/page.tsx"
              code={`import { auth } from "@template/auth";
import { trpc } from "@template/trpc";

export default async function Page() {
  const session = await auth();
  const data = await trpc.hello.query();

  return (
    <main>
      <h1>Welcome {session.user.name}</h1>
      <p>{data.message}</p>
    </main>
  );
}`}
            />
          </motion.div>

          {/* Decorative elements */}
          <div className="absolute -top-20 -right-20 h-96 w-96 animate-pulse rounded-full bg-[var(--solar-purple)] opacity-20 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-96 w-96 animate-pulse rounded-full bg-[var(--solar-orange)] opacity-20 blur-3xl" />
        </motion.div>
      </div>
    </section>
  )
}
