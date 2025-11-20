'use client'

import { useTRPC } from '@/trpc/client'
import { CodeBlock } from '@/components/ui/code-block'
import { authClient } from '@template/auth/client'
import { motion, AnimatePresence } from 'motion/react'
import React, { useState, useEffect, useRef } from 'react'
import { Send, User, Bot, Wifi, Loader2 } from 'lucide-react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export const RealtimeChat = () => {
  const [input, setInput] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)
  const { data: session } = authClient.useSession()

  const trpc = useTRPC()

  const queryClient = useQueryClient()

  const { data: messages, isLoading } = useQuery(trpc.chat.list.queryOptions())

  const sendMessage = useMutation(trpc.chat.send.mutationOptions({
    
    onSuccess:async () => {
      const queryKey = trpc.chat.list.queryKey()
      await queryClient.invalidateQueries({ queryKey })
      setInput('')
    },
  }))

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSend = () => {
    if (!input.trim()) return
    sendMessage.mutate({ content: input })
  }

  return (
    <div className="grid h-[500px] gap-8 lg:grid-cols-2">
      <div className="flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-neutral-900/50">
        <div className="flex items-center justify-between border-b border-white/10 bg-white/5 p-4">
          <div className="flex items-center gap-3">
            <div className="h-3 w-3 animate-pulse rounded-full bg-green-500" />
            <span className="font-medium text-white">Live Chat</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-neutral-400">
            <Wifi size={14} />
            <span>Connected to DB</span>
          </div>
        </div>

        <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto p-4">
          {isLoading ? (
            <div className="flex h-full items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-[var(--solar-blue)]" />
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {messages?.map((msg: any) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className={`flex ${msg.senderId === session?.user?.id ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl p-3 ${
                      msg.senderId === session?.user?.id
                        ? 'rounded-br-none bg-[var(--solar-blue)] text-white'
                        : 'rounded-bl-none bg-white/10 text-neutral-200'
                    }`}
                  >
                    <div className="mb-1 text-xs opacity-50">
                      {msg.sender.name}
                    </div>
                    {msg.content}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>

        <div className="border-t border-white/10 bg-white/5 p-4">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSend()
            }}
            className="flex gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={session ? 'Type a message...' : 'Sign in to chat'}
              disabled={!session}
              className="flex-1 rounded-lg border border-white/10 bg-neutral-950 px-4 py-2 text-white transition-colors focus:border-[var(--solar-blue)] focus:outline-none disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!input.trim() || sendMessage.isPending || !session}
              className="rounded-lg bg-[var(--solar-blue)] p-2 text-white transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {sendMessage.isPending ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <Send size={20} />
              )}
            </button>
          </form>
        </div>
      </div>

      <div className="hidden lg:block">
        <CodeBlock
          filename="apps/server/src/routers/chat.ts"
          code={`// Real tRPC implementation
export const chatRouter = {
  list: publicProcedure.query(async () => {
    return prisma.message.findMany({
      orderBy: { createdAt: "asc" },
      include: { sender: true },
    });
  }),

  send: protectedProcedure
    .input(z.object({ content: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return prisma.message.create({
        data: {
          content: input.content,
          senderId: ctx.session.user.id,
        },
      });
    }),
}`}
        />
      </div>
    </div>
  )
}
