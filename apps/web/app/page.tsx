import { Hero } from "@/components/sections/hero";
import { Features } from "@/components/sections/features";
import { LiveDemos } from "@/components/sections/live-demos";
import { Architecture } from "@/components/sections/architecture";
import { Metrics } from "@/components/sections/metrics";
import { QuickStart } from "@/components/sections/quick-start";
import { Footer } from "@/components/landing/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Next.js Monorepo Template | Better Auth + Prisma + tRPC",
  description: "Production-ready full-stack monorepo template with Better Auth, Prisma ORM, tRPC, Next.js 15, and Upstash Redis. Type-safe, scalable, and developer-friendly.",
  keywords: ["Next.js", "Monorepo", "tRPC", "Prisma", "Better Auth", "Turborepo", "TypeScript", "Full-Stack", "Template"],
  authors: [{ name: "KitsuneKode" }],
  openGraph: {
    title: "Next.js Monorepo Template | Better Auth + Prisma + tRPC",
    description: "Production-ready full-stack monorepo template. Stop configuring and start shipping.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Next.js Monorepo Template",
    description: "Production-ready full-stack monorepo template with Better Auth, Prisma, and tRPC.",
  },
};

export default function Page() {
  return (
    <main className="min-h-screen bg-neutral-950 text-white selection:bg-[var(--solar-orange)] selection:text-white">
      <Hero />
      <Features />
      <LiveDemos mode="mock" />
      <Architecture />
      <Metrics />
      <QuickStart />
      <Footer />
    </main>
  );
}
