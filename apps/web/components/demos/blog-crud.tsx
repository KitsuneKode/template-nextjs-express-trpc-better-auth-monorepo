'use client'

import React, { useState } from 'react'
import { CodeBlock } from '@/components/ui/code-block'
import { motion, AnimatePresence } from 'motion/react'
import { Plus, Trash2, Edit2, Save, X, Loader2 } from 'lucide-react'
import { useTRPC} from '@/trpc/client'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export const BlogCrud = () => {
  const [isCreating, setIsCreating] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newContent, setNewContent] = useState('')

  const trpc = useTRPC()

  const queryClient = useQueryClient()

  const { data: posts, isLoading } = useQuery( trpc.post.list.queryOptions()
)
  const createPost =useMutation( trpc.post.create.mutationOptions({
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: trpc.post.list.queryKey()})
      setNewTitle('')
      setNewContent('')
      setIsCreating(false)
    },
  }))

  const deletePost = useMutation(trpc.post.delete.mutationOptions({
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: trpc.post.list.queryKey()})
    },
  }))

  const handleCreate = () => {
    if (!newTitle.trim() || !newContent.trim()) return
    createPost.mutate({
      title: newTitle,
      content: newContent,
      slug: newTitle.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now(),
      published: true,
    })
  }

  return (
    <div className="grid h-[500px] gap-8 lg:grid-cols-2">
      <div className="flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-neutral-900/50">
        <div className="flex items-center justify-between border-b border-white/10 p-6">
          <h3 className="text-xl font-bold text-white">Posts</h3>
          <button
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
                    onClick={() => setIsCreating(false)}
                    className="px-3 py-1.5 text-sm text-neutral-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
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
              posts?.map((post: any) => (
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
                      <span>{post.author.name || 'Anonymous'}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                    <button
                      onClick={() => deletePost.mutate({ id: post.id })}
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
