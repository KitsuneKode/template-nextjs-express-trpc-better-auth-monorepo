'use client'

import React from 'react'
import { motion } from 'motion/react'
import { cn } from '@template/ui/lib/utils'
import { Zap, Shield, Globe, Database, Layout, Code2 } from '@template/ui/components/icons'

const features = [
  {
    title: 'Blazing Fast',
    description:
      'Built on Next.js 15 with TurboPack for incredible development speed and performance.',
    icon: <Zap className="h-6 w-6 text-yellow-400" />,
  },
  {
    title: 'Type-Safe API',
    description:
      'End-to-end type safety with tRPC. Catch errors at compile time, not runtime.',
    icon: <Shield className="h-6 w-6 text-green-400" />,
  },
  {
    title: 'Global Scale',
    description:
      'Deploy anywhere with ease. Optimized for edge computing and global CDNs.',
    icon: <Globe className="h-6 w-6 text-blue-400" />,
  },
  {
    title: 'Database Ready',
    description:
      'Prisma ORM configured with PostgreSQL. Ready for your data models.',
    icon: <Database className="h-6 w-6 text-purple-400" />,
  },
  {
    title: 'Modern UI',
    description:
      'Beautifully crafted components with Tailwind CSS and Framer Motion.',
    icon: <Layout className="h-6 w-6 text-pink-400" />,
  },
  {
    title: 'Monorepo',
    description:
      'Scalable architecture with Turborepo. Share code between web, mobile, and server.',
    icon: <Code2 className="h-6 w-6 text-indigo-400" />,
  },
]

export const Features = () => {
  return (
    <section className="relative overflow-hidden bg-neutral-950 py-24">
      <div className="relative z-10 container px-4 md:px-6">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-4 text-3xl font-bold text-white md:text-5xl"
          >
            Everything you need to ship
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-lg text-neutral-400"
          >
            A complete toolkit designed for modern web development. Stop
            configuring and start building.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} index={index} />
          ))}
        </div>
      </div>

      {/* Background Elements */}
      <div className="absolute top-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-neutral-800 to-transparent" />
      <div className="absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-neutral-800 to-transparent" />
    </section>
  )
}

const FeatureCard = ({
  feature,
  index,
}: {
  feature: (typeof features)[0]
  index: number
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -5 }}
      className="group relative overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900/50 p-8 transition-colors hover:border-neutral-700"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      <div className="relative z-10">
        <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-neutral-800/50 transition-colors group-hover:bg-neutral-800">
          {feature.icon}
        </div>
        <h3 className="mb-2 text-xl font-semibold text-white">
          {feature.title}
        </h3>
        <p className="leading-relaxed text-neutral-400">
          {feature.description}
        </p>
      </div>
    </motion.div>
  )
}
