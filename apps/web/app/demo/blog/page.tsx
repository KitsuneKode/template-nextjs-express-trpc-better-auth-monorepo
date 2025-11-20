'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'motion/react'
import { ArrowLeft, Calendar, Clock, ArrowRight } from 'lucide-react'

const posts = [
  {
    id: 1,
    title: 'The Future of Web Development with Next.js 15',
    excerpt:
      'Explore the groundbreaking features in the latest Next.js release, from TurboPack to enhanced server actions.',
    date: 'Nov 20, 2025',
    readTime: '5 min read',
    category: 'Engineering',
    image: 'bg-gradient-to-br from-purple-500/20 to-indigo-500/20',
  },
  {
    id: 2,
    title: 'Mastering tRPC: Type-Safe APIs Made Easy',
    excerpt:
      'Learn how to build robust, type-safe APIs without the boilerplate of REST or GraphQL.',
    date: 'Nov 18, 2025',
    readTime: '8 min read',
    category: 'Tutorial',
    image: 'bg-gradient-to-br from-emerald-500/20 to-teal-500/20',
  },
  {
    id: 3,
    title: 'Scaling Monorepos with Turborepo',
    excerpt:
      'Best practices for managing large-scale applications with multiple packages and apps.',
    date: 'Nov 15, 2025',
    readTime: '6 min read',
    category: 'DevOps',
    image: 'bg-gradient-to-br from-orange-500/20 to-red-500/20',
  },
]

export default function BlogDemoPage() {
  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <div className="container mx-auto max-w-6xl px-4 py-12">
        <div className="mb-12">
          <Link
            href="/demo"
            className="mb-8 flex items-center gap-2 text-neutral-400 transition-colors hover:text-white"
          >
            <ArrowLeft size={20} />
            Back to Demos
          </Link>
          <h1 className="mb-4 text-4xl font-bold md:text-6xl">
            Engineering Blog
          </h1>
          <p className="max-w-2xl text-xl text-neutral-400">
            Insights, tutorials, and updates from the team. Built with our
            custom CMS.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group flex h-full flex-col overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900/30 transition-colors hover:border-neutral-700"
            >
            

              <div
                className={`h-48 w-full ${post.image} relative overflow-hidden`}
              >
                <div className="absolute inset-0 bg-neutral-900/10 transition-colors group-hover:bg-transparent" />
              </div>

              <div className="flex flex-1 flex-col p-6">
                <div className="mb-4 flex items-center gap-4 text-xs text-neutral-500">
                  <span className="rounded-full bg-neutral-800 px-2 py-1 text-neutral-300">
                    {post.category}
                  </span>
                  <div className="flex items-center gap-1">
                    <Calendar size={14} />
                    {post.date}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock size={14} />
                    {post.readTime}
                  </div>
                </div>

                <h2 className="mb-3 text-xl font-bold transition-colors group-hover:text-indigo-400">
                  {post.title}
                </h2>
                <p className="mb-6 flex-1 text-sm text-neutral-400">
                  {post.excerpt}
                </p>

                <button className="group/btn mt-auto flex items-center text-sm font-medium text-white">
                  Read Article
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                </button>
              </div>
            </motion.article>

          ))}
        </div>
      </div>
    </div>
  )
}
