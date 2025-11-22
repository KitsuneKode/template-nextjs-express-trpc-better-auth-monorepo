'use client'

import { motion } from 'motion/react'
import confetti from 'canvas-confetti'
import React, { useState } from 'react'
import { CodeBlock } from '../ui/code-block'
import { authClient } from '@template/auth/client'
import { Mail, Lock, Github, CheckCircle, LogOut } from 'lucide-react'

export const AuthFlow = ({ mode = 'real' }: { mode?: 'mock' | 'real' }) => {
  const [isLoading, setIsLoading] = useState(false)
  const { data: session } = authClient.useSession()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mockSession, setMockSession] = useState<{
    user: { name: string }
  } | null>(null)

  const currentSession = mode === 'mock' ? mockSession : session

  const handleLogin = async () => {
    setIsLoading(true)

    if (mode === 'mock') {
      setTimeout(() => {
        setMockSession({ user: { name: 'Demo User' } })
        setIsLoading(false)
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#FF6B6B', '#4ECDC4', '#45B7D1'],
        })
      }, 1000)
      return
    }

    await authClient.signIn.email(
      {
        email,
        password,
      },
      {
        onSuccess: () => {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#FF6B6B', '#4ECDC4', '#45B7D1'],
          })
          setIsLoading(false)
        },
        onError: (ctx) => {
          alert(ctx.error.message)
          setIsLoading(false)
        },
      },
    )
  }

  const handleSignOut = async () => {
    if (mode === 'mock') {
      setMockSession(null)
      return
    }
    await authClient.signOut()
  }

  return (
    <div className="grid h-[500px] gap-8 lg:grid-cols-2">
      <div className="flex items-center justify-center rounded-2xl border border-white/10 bg-neutral-900/50 p-8">
        {currentSession ? (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center"
          >
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-500/20">
              <CheckCircle className="h-10 w-10 text-green-500" />
            </div>
            <h3 className="mb-2 text-2xl font-bold text-white">
              Welcome, {currentSession.user.name}!
            </h3>
            <p className="mb-6 text-neutral-400">
              You are securely authenticated.
            </p>
            <button
              onClick={handleSignOut}
              className="mx-auto flex items-center gap-2 rounded-lg bg-white/5 px-4 py-2 text-white transition-colors hover:bg-white/10"
            >
              <LogOut size={16} />
              Sign out
            </button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full max-w-sm space-y-4"
          >
            <div className="mb-8 text-center">
              <h3 className="text-2xl font-bold text-white">Welcome Back</h3>
              <p className="text-neutral-400">Sign in to your account</p>
            </div>

            <div className="space-y-4">
              <div className="relative">
                <Mail className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-neutral-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="demo@example.com"
                  className="h-12 w-full rounded-lg border border-white/10 bg-neutral-950 pr-4 pl-10 text-white transition-colors focus:border-[var(--solar-teal)] focus:outline-none"
                />
              </div>
              <div className="relative">
                <Lock className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-neutral-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="h-12 w-full rounded-lg border border-white/10 bg-neutral-950 pr-4 pl-10 text-white transition-colors focus:border-[var(--solar-teal)] focus:outline-none"
                />
              </div>
            </div>

            <button
              onClick={handleLogin}
              disabled={isLoading}
              className="flex h-12 w-full items-center justify-center rounded-lg bg-[var(--solar-teal)] font-bold text-neutral-900 transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-neutral-900 border-t-transparent" />
              ) : (
                'Sign In'
              )}
            </button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-neutral-900 px-2 text-neutral-500">
                  Or continue with
                </span>
              </div>
            </div>

            <button
              onClick={() =>
                mode === 'mock'
                  ? handleLogin()
                  : authClient.signIn.social({ provider: 'github' })
              }
              className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-white font-medium text-black transition-colors hover:bg-neutral-200"
            >
              <Github size={20} />
              GitHub
            </button>
          </motion.div>
        )}
      </div>

      <div className="hidden lg:block">
        <CodeBlock
          filename="apps/web/lib/auth-client.ts"
          code={`import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: "http://localhost:3000",
});

// Usage in component
const { data: session } = authClient.useSession();

const signIn = async () => {
  await authClient.signIn.email({
    email,
    password
  });
};`}
        />
      </div>
    </div>
  )
}
