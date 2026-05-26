import Link from 'next/link'

import { cn } from '@arche-template/ui/lib/utils'
import { BLOG_CATEGORIES } from '@/lib/blog'
import type { BlogCategory } from '@/lib/blog-source'

type Props = {
  activeCategory: BlogCategory | 'all'
}

export function BlogCategoryNav({ activeCategory }: Props) {
  return (
    <nav aria-label="Blog categories" className="flex flex-wrap gap-2">
      {BLOG_CATEGORIES.map((cat) => (
        <Link
          key={cat.id}
          href={cat.id === 'all' ? '/blog' : `/blog/category/${cat.id}`}
          className={cn(
            'inline-flex min-h-10 items-center border px-4 py-2 font-mono text-[10px] tracking-widest uppercase transition-[background-color,color,transform] duration-150 ease-out active:scale-[0.96]',
            activeCategory === cat.id
              ? 'border-white bg-white text-black'
              : 'border-zinc-800 bg-black text-zinc-400 hover:text-white',
          )}
          aria-current={activeCategory === cat.id ? 'page' : undefined}
        >
          {cat.label}
        </Link>
      ))}
    </nav>
  )
}
