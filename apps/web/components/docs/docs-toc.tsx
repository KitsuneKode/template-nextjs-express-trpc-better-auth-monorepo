'use client'

import { useEffect, useState } from 'react'

import { cn } from '@arche-template/ui/lib/utils'

export type TocItem = {
  id: string
  title: string
  depth: 2 | 3
}

function collectHeadings(container: HTMLElement): TocItem[] {
  return Array.from(container.querySelectorAll('h2, h3')).map((el) => ({
    id: el.id,
    title: el.textContent?.trim() ?? '',
    depth: el.tagName === 'H3' ? 3 : 2,
  }))
}

export function DocsTocRail({ className }: { className?: string }) {
  const [items, setItems] = useState<TocItem[]>([])
  const [activeId, setActiveId] = useState<string>('')

  useEffect(() => {
    const prose = document.querySelector<HTMLElement>('.docs-prose')
    if (!prose) return

    const headings = collectHeadings(prose).filter((item) => item.id && item.title)
    setItems(headings)
    if (headings.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible[0]?.target.id) {
          setActiveId(visible[0].target.id)
        }
      },
      { rootMargin: '-80px 0px -70% 0px', threshold: 0 },
    )

    for (const item of headings) {
      const el = document.getElementById(item.id)
      if (el) observer.observe(el)
    }

    return () => observer.disconnect()
  }, [])

  if (items.length < 2) return null

  return (
    <nav
      aria-label="On this page"
      className={cn(
        'sticky top-24 hidden h-[calc(100vh-8rem)] w-52 shrink-0 overflow-y-auto xl:block',
        className,
      )}
    >
      <p className="mb-3 font-mono text-[10px] tracking-[0.2em] text-zinc-500 uppercase">
        On this page
      </p>
      <ul className="space-y-1 border-l border-zinc-800">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className={cn(
                'block border-l py-1.5 pl-3 text-sm leading-snug transition-colors',
                item.depth === 3 && 'pl-6 text-xs',
                activeId === item.id
                  ? 'border-white text-white'
                  : 'border-transparent text-zinc-500 hover:text-zinc-300',
              )}
            >
              {item.title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
