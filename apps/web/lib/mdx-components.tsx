import defaultMdxComponents from 'fumadocs-ui/mdx'
import type { MDXComponents } from 'mdx/types'

import { cn } from '@arche-template/ui/lib/utils'

const prose =
  'prose prose-invert prose-zinc max-w-3xl prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tight prose-p:text-lg prose-p:leading-relaxed prose-p:text-zinc-300 prose-a:text-white prose-a:underline prose-a:underline-offset-4 prose-code:text-amber-300 prose-code:bg-zinc-900 prose-code:px-1.5 prose-code:py-0.5 prose-code:before:content-none prose-code:after:content-none prose-pre:bg-zinc-900 prose-pre:border prose-pre:border-zinc-800 prose-pre:rounded-none'

export function getMdxComponents(overrides?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    ...overrides,
    article: ({ className, ...props }) => <article className={cn(prose, className)} {...props} />,
  }
}
