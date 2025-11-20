'use client'

import Link from 'next/link'
import { motion } from 'motion/react'
import React, { useState } from 'react'
import { ArrowLeft, Mail, Lock, Github, Chrome } from 'lucide-react'

export default function AuthDemoPage() {
  const [isLogin, setIsLogin] = useState(true)

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-neutral-950 p-4">
      {/* Background Gradients */}
      <div className="pointer-events-none absolute top-0 left-0 h-full w-full overflow-hidden">
        <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="absolute right-1/4 bottom-1/4 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />
      </div>

      <div className="absolute top-8 left-8 z-20">
        <Link
          href="/demo"
          className="flex items-center gap-2 text-neutral-400 transition-colors hover:text-white"
        >
          <ArrowLeft size={20} />
          Back to Demos
        </Link>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 w-full max-w-md rounded-2xl border border-neutral-800 bg-neutral-900/50 p-8 shadow-2xl backdrop-blur-xl"
      >
        <div className="mb-8 text-center">
          <h2 className="mb-2 text-3xl font-bold text-white">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="text-neutral-400">
            {isLogin
              ? 'Enter your credentials to access your account'
              : 'Sign up to get started with our platform'}
          </p>
        </div>

        <div className="space-y-4">
          <button className="flex h-12 w-full items-center justify-center gap-3 rounded-lg bg-white font-medium text-black transition-colors hover:bg-neutral-200">
            <Chrome size={20} />
            Continue with Google
          </button>
          <button className="flex h-12 w-full items-center justify-center gap-3 rounded-lg bg-neutral-800 font-medium text-white transition-colors hover:bg-neutral-700">
            <Github size={20} />
            Continue with GitHub
          </button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-neutral-800"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-neutral-900 px-2 text-neutral-500">
                Or continue with
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-300">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-neutral-500" />
                <input
                  type="email"
                  placeholder="hello@example.com"
                  className="h-12 w-full rounded-lg border border-neutral-800 bg-neutral-950 pr-4 pl-10 text-white transition-all placeholder:text-neutral-600 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-300">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-neutral-500" />
                <input
                  type="password"
                  placeholder="••••••••"
                  className="h-12 w-full rounded-lg border border-neutral-800 bg-neutral-950 pr-4 pl-10 text-white transition-all placeholder:text-neutral-600 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <button className="mt-6 h-12 w-full rounded-lg bg-emerald-600 font-medium text-white transition-colors hover:bg-emerald-500">
            {isLogin ? 'Sign In' : 'Create Account'}
          </button>

          <div className="mt-6 text-center">
            <p className="text-sm text-neutral-400">
              {isLogin
                ? "Don't have an account? "
                : 'Already have an account? '}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="font-medium text-emerald-400 hover:text-emerald-300 hover:underline"
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
