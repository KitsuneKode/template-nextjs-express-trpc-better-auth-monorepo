'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'motion/react'
import { Lock, MessageSquare, FileText, ArrowLeft } from 'lucide-react'

const demos = [
  {
    title: 'Authentication',
    description: 'Secure sign-in and sign-up flows with Better Auth.',
    icon: <Lock className="h-8 w-8 text-emerald-400" />,
    href: '/demo/auth',
    color:
      'bg-emerald-500/10 border-emerald-500/20 hover:border-emerald-500/50',
  },
  {
    title: 'Real-time Chat',
    description: 'Live chat functionality powered by Upstash Redis.',
    icon: <MessageSquare className="h-8 w-8 text-blue-400" />,
    href: '/demo/chat',
    color: 'bg-blue-500/10 border-blue-500/20 hover:border-blue-500/50',
  },
  {
    title: 'Blog & CMS',
    description: 'Dynamic content management with Markdown support.',
    icon: <FileText className="h-8 w-8 text-purple-400" />,
    href: '/demo/blog',
    color: 'bg-purple-500/10 border-purple-500/20 hover:border-purple-500/50',
  },
]

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-neutral-950 p-8 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12">
          <Link
            href="/"
            className="mb-8 inline-flex items-center text-neutral-400 transition-colors hover:text-white"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
          <h1 className="mb-4 text-4xl font-bold md:text-6xl">
            Template Demos
          </h1>
          <p className="max-w-2xl text-xl text-neutral-400">
            Explore the capabilities of this starter template. Each demo
            showcases a specific feature implementation.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {demos.map((demo, index) => (
            <Link key={index} href={demo.href}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`h-full rounded-2xl border p-8 transition-all duration-300 hover:scale-[1.02] ${demo.color}`}
              >
                <div className="mb-6 w-fit rounded-xl bg-neutral-900/50 p-4">
                  {demo.icon}
                </div>
                <h2 className="mb-3 text-2xl font-bold">{demo.title}</h2>
                <p className="text-neutral-400">{demo.description}</p>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
