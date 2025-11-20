"use client";

import { AuthFlow } from "@/components/demos/auth-flow";
import { SectionWrapper } from "@/components/ui/section-wrapper";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AuthDemoPage() {
  return (
    <div className="min-h-screen bg-neutral-950 pt-24 pb-12">
      <SectionWrapper>
        <div className="mb-8">
          <Link 
            href="/demo"
            className="inline-flex items-center gap-2 text-neutral-400 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft size={16} />
            Back to Demos
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2">Authentication Demo</h1>
          <p className="text-neutral-400">
            Full-featured authentication with email/password and social providers using Better Auth.
          </p>
        </div>

        <div className="bg-neutral-900/50 border border-white/10 rounded-2xl p-6">
          <AuthFlow mode="real" />
        </div>
      </SectionWrapper>
    </div>
  );
}
