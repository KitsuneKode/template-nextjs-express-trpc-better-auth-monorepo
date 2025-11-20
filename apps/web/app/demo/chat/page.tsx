'use client'

import Link from 'next/link'
import { motion, AnimatePresence } from 'motion/react'
import { ArrowLeft, Send, User, Bot } from 'lucide-react'
import React, { useState, useRef, useEffect } from 'react'

type Message = {
  id: string
  text: string
  sender: 'user' | 'bot'
  timestamp: Date
}

export default function ChatDemoPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm the demo bot. How can I help you today?",
      sender: 'bot',
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSend = () => {
    if (!input.trim()) return

    const newMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, newMessage])
    setInput('')

    // Simulate bot response
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: 'This is a simulated response. In a real app, this would connect to Upstash Redis for real-time messaging!',
        sender: 'bot',
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, botResponse])
    }, 1000)
  }

  return (
    <div className="flex min-h-screen flex-col bg-neutral-950">
      <header className="sticky top-0 z-10 flex h-16 items-center border-b border-neutral-800 bg-neutral-900/50 px-6 backdrop-blur-md">
        <Link
          href="/demo"
          className="mr-6 flex items-center gap-2 text-neutral-400 transition-colors hover:text-white"
        >
          <ArrowLeft size={20} />
        </Link>
        <div className="flex items-center gap-3">
          <div className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
          <h1 className="font-semibold text-white">Live Chat Demo</h1>
        </div>
      </header>

      <main className="mx-auto flex h-[calc(100vh-4rem)] w-full max-w-4xl flex-1 flex-col p-4">
        <div
          ref={scrollRef}
          className="scrollbar-thin scrollbar-thumb-neutral-800 scrollbar-track-transparent flex-1 space-y-6 overflow-y-auto p-4"
        >
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`flex max-w-[80%] items-end gap-2 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  <div
                    className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${
                      msg.sender === 'user' ? 'bg-blue-600' : 'bg-neutral-700'
                    }`}
                  >
                    {msg.sender === 'user' ? (
                      <User size={16} className="text-white" />
                    ) : (
                      <Bot size={16} className="text-white" />
                    )}
                  </div>
                  <div
                    className={`rounded-2xl p-4 ${
                      msg.sender === 'user'
                        ? 'rounded-br-none bg-blue-600 text-white'
                        : 'rounded-bl-none bg-neutral-800 text-neutral-200'
                    }`}
                  >
                    <p>{msg.text}</p>
                    <span className="mt-1 block text-xs opacity-50">
                      {msg.timestamp.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="mt-4 rounded-t-2xl border-t border-neutral-800 bg-neutral-900/30 p-4">
          <div className="flex gap-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type a message..."
              className="flex-1 rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-3 text-white transition-colors focus:border-blue-500 focus:outline-none"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              className="rounded-xl bg-blue-600 p-3 text-white transition-colors hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
