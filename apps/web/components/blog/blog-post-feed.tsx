import Link from 'next/link'

import { formatBlogDate, type BlogPostSummary } from '@/lib/blog'

type Props = {
  posts: BlogPostSummary[]
}

export function BlogPostFeed({ posts }: Props) {
  if (posts.length === 0) {
    return (
      <p className="p-6 font-mono text-sm tracking-wide text-zinc-500 uppercase md:p-12">
        No posts in this category yet.
      </p>
    )
  }

  return (
    <div className="divide-y divide-zinc-800 border-b border-zinc-800">
      {posts.map((post) => (
        <Link
          key={post.url}
          href={`/blog/${post.slug}`}
          className="group block p-6 transition-colors hover:bg-zinc-950 md:p-12"
        >
          <div className="mb-4 flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div className="flex items-center gap-4">
              {post.date ? (
                <time
                  dateTime={post.date}
                  className="font-mono text-[10px] tracking-widest text-zinc-500 uppercase tabular-nums"
                >
                  {formatBlogDate(post.date)}
                </time>
              ) : null}
              <span className="size-1 rounded-full bg-zinc-800" aria-hidden />
              <span className="font-mono text-[10px] tracking-widest text-amber-500 uppercase">
                {post.category}
              </span>
            </div>
            <span className="text-xs font-bold tracking-widest text-zinc-400 uppercase transition-colors group-hover:text-white">
              Read article
            </span>
          </div>
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-balance text-white uppercase transition-colors group-hover:text-zinc-200 md:text-4xl">
            {post.title}
          </h2>
          <p className="max-w-2xl text-lg leading-relaxed font-medium text-pretty text-zinc-400">
            {post.description}
          </p>
        </Link>
      ))}
    </div>
  )
}
