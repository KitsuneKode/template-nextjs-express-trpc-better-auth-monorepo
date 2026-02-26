import Link from 'next/link'
import { Calendar, Clock, ArrowRight } from '@template/ui/components/icons'

type Author = {
  name: string | null
}

type BlogPostListItem = {
  id: string
  slug: string
  title: string
  content: string
  createdAt: Date
  author: Author
}

interface PremiumBlogListProps {
  posts: BlogPostListItem[]
  basePath?: string
}

export function PremiumBlogList({
  posts,
  basePath = '/landing/blog',
}: PremiumBlogListProps) {
  if (posts.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-white/20 bg-white/[0.02] p-10 text-center">
        <p className="text-lg font-semibold text-[#f4eadc]">No posts published yet.</p>
        <p className="mt-2 text-sm text-[#b9a68f]">Publish your first article to populate this feed.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
      {posts.map((post) => (
        <Link
          key={post.id}
          href={`${basePath}/${post.slug}`}
          className="group min-w-0 overflow-hidden rounded-3xl border border-white/10 bg-[#0e1319]/86 p-6 transition-transform duration-300 hover:-translate-y-1"
        >
          <div className="mb-4 flex flex-wrap items-center gap-4 text-xs text-[#b8a58d]">
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              {new Date(post.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              {Math.max(1, Math.ceil(post.content.length / 1000))} min read
            </span>
          </div>

          <h3 className="line-clamp-2 text-2xl leading-tight font-semibold text-[#f5ede1]">{post.title}</h3>
          <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-[#baa68d]">{post.content}</p>

          <div className="mt-5 flex items-center justify-between border-t border-white/8 pt-4 text-sm">
            <span className="text-[#d8c8b6]">{post.author.name ?? 'Anonymous'}</span>
            <span className="inline-flex items-center gap-1.5 text-[#d7ae7f]">
              Read article <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </span>
          </div>
        </Link>
      ))}
    </div>
  )
}
