'use client'

import React from 'react'
import Link from 'next/link'
import { ArrowRight, Sparkles } from '@template/ui/components/icons'
import { motion, useScroll, useTransform } from 'motion/react'

export const Hero = () => {
  const { scrollY } = useScroll()
  const y1 = useTransform(scrollY, [0, 500], [0, 200])
  const y2 = useTransform(scrollY, [0, 500], [0, -150])
  const opacity = useTransform(scrollY, [0, 300], [1, 0])

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-neutral-950 pt-20">
      {/* Background Gradients */}
      <div className="absolute inset-0 h-full w-full bg-neutral-950">
        <div className="absolute top-0 left-0 h-full w-full bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />
        <div className="absolute bottom-0 left-0 h-full w-full bg-[radial-gradient(ellipse_80%_80%_at_50%_120%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />
      </div>

      <div className="relative z-10 container flex flex-col items-center px-4 text-center md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-neutral-300 backdrop-blur-sm"
        >
          <Sparkles className="h-4 w-4 text-yellow-400" />
          <span>The Ultimate Starter Template</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-6 bg-gradient-to-b from-neutral-100 to-neutral-500 bg-clip-text text-5xl font-bold tracking-tight text-transparent text-white md:text-7xl lg:text-8xl"
        >
          Build Faster. <br />
          <span className="text-indigo-400">Scale Better.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-10 max-w-2xl text-lg text-neutral-400 md:text-xl"
        >
          A production-ready monorepo template with Next.js, tRPC, Prisma, and
          Authentication. Everything you need to launch your next big idea.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col gap-4 sm:flex-row"
        >
          <Link
            href="/demo"
            className="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-md bg-indigo-600 px-8 font-medium text-white transition-all duration-300 hover:scale-105 hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-neutral-900 focus:outline-none"
          >
            <span className="mr-2">View Demo</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            <div className="absolute inset-0 -z-10 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          </Link>
          <Link
            href="https://github.com/kitsunekode/template-nextjs-express-trpc-bettera-auth-monorepo"
            target="_blank"
            className="inline-flex h-12 items-center justify-center rounded-md border border-neutral-800 bg-neutral-950 px-8 font-medium text-neutral-300 transition-all duration-300 hover:bg-neutral-900 hover:text-white focus:ring-2 focus:ring-neutral-700 focus:ring-offset-2 focus:ring-offset-neutral-900 focus:outline-none"
          >
            GitHub Repo
          </Link>
        </motion.div>
      </div>

      {/* Animated Illustration / Parallax Elements */}
      <motion.div
        style={{ y: y1, opacity }}
        className="pointer-events-none absolute top-1/4 -left-20 h-72 w-72 rounded-full bg-purple-500/10 blur-3xl"
      />
      <motion.div
        style={{ y: y2, opacity }}
        className="pointer-events-none absolute -right-20 bottom-1/4 h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl"
      />

      {/* Floating Elements (Mock UI) */}
      <div className="perspective-1000 relative mx-auto mt-20 w-full max-w-5xl">
        <motion.div
          initial={{ rotateX: 20, opacity: 0, y: 100 }}
          animate={{ rotateX: 0, opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5, type: 'spring' }}
          className="relative overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900/50 shadow-2xl backdrop-blur-xl"
        >
          <div className="flex items-center gap-2 border-b border-neutral-800 bg-neutral-900/80 px-4 py-3">
            <div className="h-3 w-3 rounded-full border border-red-500/50 bg-red-500/20" />
            <div className="h-3 w-3 rounded-full border border-yellow-500/50 bg-yellow-500/20" />
            <div className="h-3 w-3 rounded-full border border-green-500/50 bg-green-500/20" />
            <div className="ml-4 h-6 w-64 rounded-md bg-neutral-800/50" />
          </div>
          <div className="grid grid-cols-1 gap-6 p-8 md:grid-cols-3">
            <div className="col-span-2 space-y-4">
              <div className="h-32 animate-pulse rounded-lg bg-neutral-800/30" />
              <div className="h-8 w-3/4 rounded bg-neutral-800/30" />
              <div className="h-4 w-full rounded bg-neutral-800/30" />
              <div className="h-4 w-5/6 rounded bg-neutral-800/30" />
            </div>
            <div className="space-y-4">
              <div className="h-20 rounded-lg border border-indigo-500/20 bg-indigo-500/10" />
              <div className="h-20 rounded-lg border border-purple-500/20 bg-purple-500/10" />
              <div className="h-20 rounded-lg border border-pink-500/20 bg-pink-500/10" />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
