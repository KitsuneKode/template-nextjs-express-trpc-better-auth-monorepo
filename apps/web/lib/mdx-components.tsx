import defaultMdxComponents from 'fumadocs-ui/mdx'
import type { MDXComponents } from 'mdx/types'
import Link from 'next/link'
import type { ReactNode } from 'react'

import { cn } from '@arche-template/ui/lib/utils'

const prose =
  'prose prose-invert prose-zinc max-w-3xl prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tight prose-headings:scroll-mt-24 prose-p:text-lg prose-p:leading-relaxed prose-p:text-zinc-300 prose-a:text-white prose-a:underline prose-a:underline-offset-4 prose-code:text-amber-300 prose-code:bg-zinc-900 prose-code:px-1.5 prose-code:py-0.5 prose-code:before:content-none prose-code:after:content-none prose-pre:bg-zinc-900 prose-pre:border prose-pre:border-zinc-800 prose-pre:rounded-none'

function slugify(value: ReactNode): string {
  const text =
    typeof value === 'string'
      ? value
      : Array.isArray(value)
        ? value.map((part) => (typeof part === 'string' ? part : '')).join('')
        : String(value ?? '')

  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/-+/g, '-')
}

function createHeading(level: 2 | 3 | 4) {
  const Tag = `h${level}` as const

  return function Heading({
    children,
    className,
    ...props
  }: React.HTMLAttributes<HTMLHeadingElement>) {
    const id = slugify(children)
    return (
      <Tag id={id} className={cn('group relative', className)} {...props}>
        {id ? (
          <a
            href={`#${id}`}
            className="absolute top-1/2 -left-6 hidden -translate-y-1/2 text-zinc-600 opacity-0 transition-opacity group-hover:opacity-100 md:inline"
            aria-label={`Link to section ${id}`}
          >
            #
          </a>
        ) : null}
        {children}
      </Tag>
    )
  }
}

function MdxLink({ href, children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  if (href?.startsWith('/')) {
    return (
      <Link href={href} {...props}>
        {children}
      </Link>
    )
  }
  if (href?.startsWith('#')) {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    )
  }
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
      {children}
    </a>
  )
}

export function getMdxComponents(overrides?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    ...overrides,
    h2: createHeading(2),
    h3: createHeading(3),
    h4: createHeading(4),
    a: MdxLink,
    article: ({ className, ...props }) => <article className={cn(prose, className)} {...props} />,
  }
}
