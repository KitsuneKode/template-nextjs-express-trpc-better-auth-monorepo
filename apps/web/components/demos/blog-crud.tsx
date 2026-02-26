'use client'

import React, { useState } from 'react'
import { useTRPC } from '@/trpc/client'
import { motion, AnimatePresence } from 'motion/react'
import { CodeBlock } from '@/components/ui/code-block'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  Plus,
  Trash2,
  Loader2,
} from '@template/ui/components/icons'

type DemoPost = {
  id: string
  title: string
  content: string
  createdAt: Date | string
  author: { name: string | null }
}

export const BlogCrud = ({ mode = 'real' }: { mode?: 'mock' | 'real' }) => {
  const [isCreating, setIsCreating] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newContent, setNewContent] = useState('')

  // Mock Data
  const [mockPosts, setMockPosts] = useState<DemoPost[]>([
    {
      id: '1',
      title: 'Getting Started with Next.js',
      content: 'Next.js is awesome...',
      createdAt: new Date('2026-01-10T10:00:00.000Z'),
      author: { name: 'Demo User' },
    },
    {
      id: '2',
      title: 'Why Monorepos?',
      content: 'Monorepos help scale...',
      createdAt: new Date('2026-01-12T12:00:00.000Z'),
      author: { name: 'Demo User' },
    },
  ])

  const trpc = useTRPC()
  const queryClient = useQueryClient()

  // Real Data
  const { data: realPosts, isLoading: isRealLoading } = useQuery({
    ...trpc.post.list.queryOptions(),
    enabled: mode === 'real',
  })

  const createPost = useMutation(
    trpc.post.create.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: trpc.post.list.queryKey() })
        setNewTitle('')
        setNewContent('')
        setIsCreating(false)
      },
    }),
  )

  const deletePost = useMutation(
    trpc.post.delete.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: trpc.post.list.queryKey() })
      },
    }),
  )

  const posts = mode === 'mock' ? mockPosts : (realPosts ?? [])
  const isLoading = mode === 'real' ? isRealLoading : false

  const handleCreate = () => {
    if (!newTitle.trim() || !newContent.trim()) return

    if (mode === 'mock') {
      const newPost = {
        id: Date.now().toString(),
        title: newTitle,
        content: newContent,
        createdAt: new Date(),
        author: { name: 'You' },
      }
      setMockPosts((prev) => [newPost, ...prev])
      setNewTitle('')
      setNewContent('')
      setIsCreating(false)
      return
    }

    createPost.mutate({
      title: newTitle,
      content: newContent,
      slug: newTitle.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now(),
      published: true,
    })
  }

  const handleDelete = (id: string) => {
    if (mode === 'mock') {
      setMockPosts((prev) => prev.filter((p) => p.id !== id))
      return
    }
    deletePost.mutate({ id })
  }

  return (
    <div className="grid h-auto gap-8 lg:h-[500px] lg:grid-cols-2">
      <div className="flex h-[400px] flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0A0A0A] ring-1 ring-white/5 lg:h-auto">
        <div className="flex items-center justify-between border-b border-white/10 p-6">
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-bold text-white">Posts</h3>
            <span
              className={`rounded-full px-2 py-0.5 text-xs ${mode === 'real' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}
            >
              {mode === 'real' ? 'Real DB' : 'Mock Data'}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setIsCreating(true)}
            className="rounded-lg bg-[var(--solar-orange)] p-2 text-white transition-opacity hover:opacity-90"
          >
            <Plus size={20} />
          </button>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto p-6">
          <AnimatePresence mode="popLayout">
            {isCreating && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="rounded-xl border border-white/10 bg-white/5 p-4"
              >
                <input
                  autoFocus
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Post title..."
                  className="mb-4 w-full border-none bg-transparent font-medium text-white placeholder:text-neutral-500 focus:outline-none"
                />
                <textarea
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Write something amazing..."
                  className="mb-4 h-20 w-full resize-none border-none bg-transparent text-neutral-300 placeholder:text-neutral-500 focus:outline-none"
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsCreating(false)}
                    className="px-3 py-1.5 text-sm text-neutral-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleCreate}
                    disabled={createPost.isPending}
                    className="flex items-center gap-2 rounded-lg bg-[var(--solar-green)] px-3 py-1.5 text-sm font-medium text-neutral-900"
                  >
                    {createPost.isPending && (
                      <Loader2 size={14} className="animate-spin" />
                    )}
                    Publish
                  </button>
                </div>
              </motion.div>
            )}

            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-[var(--solar-teal)]" />
              </div>
            ) : posts?.length === 0 ? (
              <div className="py-8 text-center text-neutral-500">
                No posts yet. Create one!
              </div>
            ) : (
              posts?.map((post) => (
                <motion.div
                  key={post.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="group flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-4 transition-colors hover:bg-white/10"
                >
                  <div>
                    <h4 className="mb-1 font-medium text-white">
                      {post.title}
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-neutral-400">
                      <span>
                        {new Date(post.createdAt).toLocaleDateString()}
                      </span>
                      <span>•</span>
                      <span>{post.author?.name || 'Anonymous'}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                    <button
                      type="button"
                      onClick={() => handleDelete(post.id)}
                      disabled={deletePost.isPending}
                      className="rounded-lg p-2 text-red-400 transition-colors hover:bg-red-500/10 hover:text-red-300"
                    >
                      {deletePost.isPending ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <Trash2 size={16} />
                      )}
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="hidden lg:block">
        <CodeBlock
          filename="apps/web/app/posts/page.tsx"
          code={`'use client'
import { trpc } from '@/lib/trpc'

export default function PostsPage() {
  const utils = trpc.useUtils()
  const { data: posts } = trpc.post.list.useQuery()

  const createPost = trpc.post.create.useMutation({
    onSuccess: () => {
      utils.post.list.invalidate()
    }
  })

  const deletePost = trpc.post.delete.useMutation({
    onSuccess: () => {
      utils.post.list.invalidate()
    }
  })

  return (
    <div>
      {posts?.map(post => (
        <PostCard
          key={post.id}
          post={post}
          onDelete={() => deletePost.mutate({ id: post.id })}
        />
      ))}
    </div>
  )
}`}
        />
      </div>
    </div>
  )
}
