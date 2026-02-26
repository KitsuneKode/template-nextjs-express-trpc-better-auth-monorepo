import Link from 'next/link'
import { ArrowRight, Check } from '@template/ui/components/icons'
import { CommandRecipePanel } from './command-recipe-panel'

const keyPoints = [
  'Typed API contract from router to UI',
  'Shared shadcn component system in packages/ui',
  'Server + worker architecture included from day one',
] as const

interface PremiumHeroProps {
  startHref?: string
  demosHref?: string
}

export function PremiumHero({
  startHref = '/landing/start',
  demosHref = '/landing/demos',
}: PremiumHeroProps) {
  return (
    <section className="relative overflow-hidden pt-28 pb-14 md:pt-36 md:pb-22">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_12%_20%,rgba(215,174,127,0.22),transparent_45%),radial-gradient(circle_at_86%_18%,rgba(102,200,186,0.2),transparent_38%),radial-gradient(circle_at_48%_80%,rgba(128,160,196,0.16),transparent_50%)]" />

      <div className="mx-auto grid w-full max-w-[1200px] gap-8 px-4 sm:px-6 lg:grid-cols-[0.92fr_1.08fr] lg:gap-10 lg:px-8">
        <div className="min-w-0">
          <p className="mb-4 inline-flex rounded-full border border-[#d7ae7f]/35 bg-[#d7ae7f]/12 px-4 py-1.5 text-xs font-semibold tracking-[0.16em] text-[#e5c8a4] uppercase">
            Premium Monorepo Foundation
          </p>

          <h1 className="font-serif text-4xl leading-[0.95] text-[#f7f1e8] sm:text-5xl lg:text-7xl">
            Ship product logic,
            <span className="mt-1 block text-[#d7ae7f]">not setup scripts.</span>
          </h1>

          <p className="mt-6 max-w-[34ch] text-base leading-relaxed text-[#c4b09a] sm:text-lg">
            A full-stack template for teams who care about architecture, delivery speed, and long-term maintainability.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={startHref}
              className="group inline-flex items-center gap-2 rounded-full bg-[#d7ae7f] px-5 py-2.5 text-xs font-semibold tracking-[0.14em] text-[#19120c] uppercase transition hover:brightness-110"
            >
              Start in 5 minutes
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href={demosHref}
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.03] px-5 py-2.5 text-xs font-semibold tracking-[0.14em] text-[#e3d3c1] uppercase transition-colors hover:bg-white/[0.06]"
            >
              Explore demos
            </Link>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {keyPoints.map((point) => (
              <article
                key={point}
                className="min-w-0 rounded-2xl border border-white/10 bg-[#0f151c]/80 p-3.5 transition-transform duration-300 hover:-translate-y-0.5"
              >
                <div className="mb-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#67c8ba]/14 text-[#67c8ba]">
                  <Check className="h-4 w-4" />
                </div>
                <p className="text-sm leading-relaxed text-[#ccb9a3]">{point}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="min-w-0">
          <CommandRecipePanel />
        </div>
      </div>
    </section>
  )
}
