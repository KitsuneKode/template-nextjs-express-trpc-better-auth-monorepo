'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { AuthFlow } from '@/components/demos/auth-flow'
import { SectionWrapper } from '@/components/ui/section-wrapper'

export default function AuthDemoPage() {
  return (
    <div className="min-h-screen bg-neutral-950 pt-24 pb-12">
      <SectionWrapper>
        <div className="mb-8">
          <Link
            href="/demo"
            className="mb-4 inline-flex items-center gap-2 text-neutral-400 transition-colors hover:text-white"
          >
            <ArrowLeft size={16} />
            Back to Demos
          </Link>
          <h1 className="mb-2 text-3xl font-bold text-white">
            Authentication Demo
          </h1>
          <p className="text-neutral-400">
            Full-featured authentication with email/password and social
            providers using Better Auth.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-neutral-900/50 p-6">
          <AuthFlow mode="real" />
        </div>
      </SectionWrapper>
    </div>
  )
}
