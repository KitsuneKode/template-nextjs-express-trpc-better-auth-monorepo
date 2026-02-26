import Link from 'next/link'
import { Streamdown } from 'streamdown'
import { ArrowLeft, Calendar, Clock } from '@template/ui/components/icons'

type Author = {
  name: string | null
}

type BlogPostDetail = {
  title: string
  content: string
  createdAt: Date
  author: Author
}

interface PremiumBlogArticleProps {
  post: BlogPostDetail
  backHref?: string
  backLabel?: string
}

export function PremiumBlogArticle({
  post,
  backHref = '/landing/blog',
  backLabel = 'Back to premium blog',
}: PremiumBlogArticleProps) {
  return (
    <article className="mx-auto w-full max-w-[1000px] px-4 pb-24 sm:px-6 lg:px-8">
      <Link
        href={backHref}
        className="mb-8 inline-flex items-center gap-2 text-sm text-[#bda990] transition-colors hover:text-[#f1e6d8]"
      >
        <ArrowLeft className="h-4 w-4" /> {backLabel}
      </Link>

      <h1 className="max-w-[24ch] font-serif text-4xl leading-tight text-[#f6eee2] md:text-6xl">
        {post.title}
      </h1>

      <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-[#bca78d]">
        <span>{post.author.name ?? 'Anonymous'}</span>
        <span className="inline-flex items-center gap-1.5">
          <Calendar className="h-4 w-4" />
          {new Date(post.createdAt).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
          })}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Clock className="h-4 w-4" />
          {Math.max(1, Math.ceil(post.content.length / 1000))} min read
        </span>
      </div>

      <div className="mt-10 rounded-3xl border border-white/10 bg-[#0e1319]/86 p-6 md:p-9">
        <div className="prose prose-invert prose-headings:text-[#f5ede2] prose-p:text-[#c5b09a] prose-a:text-[#d8b287] prose-a:no-underline hover:prose-a:underline prose-pre:border prose-pre:border-white/10 prose-pre:bg-[#080c10] max-w-none">
          <Streamdown>{post.content}</Streamdown>
        </div>
      </div>
    </article>
  )
}
