import { cn } from '@template/ui/lib/utils'
import type { ReactNode } from 'react'

interface SectionShellProps {
  id?: string
  eyebrow?: string
  title: string
  description?: string
  className?: string
  children: ReactNode
}

export function SectionShell({
  id,
  eyebrow,
  title,
  description,
  className,
  children,
}: SectionShellProps) {
  return (
    <section id={id} className={cn('relative py-16 md:py-24', className)}>
      <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <div className="mb-10 max-w-3xl md:mb-14">
          {eyebrow ? (
            <p className="mb-3 text-xs font-semibold tracking-[0.18em] text-[#d2ad80] uppercase">
              {eyebrow}
            </p>
          ) : null}
          <h2 className="font-serif text-3xl leading-[1.08] text-[#f6efe6] sm:text-4xl md:text-5xl">
            {title}
          </h2>
          {description ? (
            <p className="mt-4 max-w-[70ch] text-sm leading-relaxed text-[#bda88f] sm:text-base">
              {description}
            </p>
          ) : null}
        </div>
        {children}
      </div>
    </section>
  )
}
