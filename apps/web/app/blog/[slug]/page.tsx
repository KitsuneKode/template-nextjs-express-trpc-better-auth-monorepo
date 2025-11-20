import Link from 'next/link'
import { Metadata } from 'next'
import { cacheLife } from 'next/cache'
import { Streamdown } from 'streamdown'
import { prisma } from '@template/store'
import { notFound } from 'next/navigation'
import { SectionWrapper } from '@/components/ui/section-wrapper'
import { AnimatedGradient } from '@/components/ui/animated-gradient'
import {
  ArrowLeft,
  Calendar,
  Clock,
  Share2,
  Twitter,
  Linkedin,
} from 'lucide-react'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  'use cache'
  cacheLife('hours')

  const slug = (await params).slug
  if (!slug) {
    return { title: 'Post Not Found' }
  }

  const post = await prisma.post.findUnique({
    where: { slug },
  })

  if (!post) return { title: 'Post Not Found' }

  return {
    title: `${post.title} | Template Blog`,
    description: post.content.substring(0, 160),
  }
}

export default async function BlogPostPage({ params }: Props) {
  'use cache'
  cacheLife('days')

  const slug = (await params).slug
  const post = await prisma.post.findUnique({
    where: { slug },
    include: { author: true },
  })

  if (!post) notFound()

  return (
    <main className="min-h-screen bg-neutral-950 text-white selection:bg-[var(--solar-purple)] selection:text-white">
      <div className="pointer-events-none fixed inset-0 z-0 opacity-20">
        <AnimatedGradient />
      </div>

      <article className="relative z-10">
        {/* Header */}
        <div className="border-b border-white/10 bg-neutral-900/30 pt-32 pb-16 backdrop-blur-sm">
          <SectionWrapper>
            <Link
              href="/blog"
              className="mb-8 inline-flex items-center gap-2 text-neutral-400 transition-colors hover:text-white"
            >
              <ArrowLeft size={16} /> Back to Blog
            </Link>

            <h1 className="mb-8 max-w-4xl text-4xl leading-tight font-bold md:text-6xl">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-6 text-neutral-400">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[var(--solar-orange)] to-[var(--solar-magenta)] text-sm font-bold text-white">
                  {post.author.name?.[0] || 'A'}
                </div>
                <div>
                  <div className="font-medium text-white">
                    {post.author.name || 'Anonymous'}
                  </div>
                  <div className="text-sm">Author</div>
                </div>
              </div>
              <div className="h-10 w-px bg-white/10" />
              <div className="flex items-center gap-2">
                <Calendar size={18} />
                {new Date(post.createdAt).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </div>
              <div className="flex items-center gap-2">
                <Clock size={18} />
                {Math.ceil(post.content.length / 1000)} min read
              </div>
            </div>
          </SectionWrapper>
        </div>

        {/* Content */}
        <SectionWrapper className="py-16">
          <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1fr_300px]">
            <div className="prose prose-invert prose-lg prose-headings:font-bold prose-headings:text-white prose-p:text-neutral-300 prose-a:text-[var(--solar-teal)] prose-a:no-underline hover:prose-a:underline prose-code:text-[var(--solar-orange)] prose-pre:bg-neutral-900 prose-pre:border prose-pre:border-white/10 max-w-none">
              {/* 
                In a real app, you'd use a markdown parser here like 'react-markdown' or 'mdx-remote'.
                For this demo, we'll just render the text with line breaks.
              */}
              {post.content.split('\n').map((paragraph, i) => (
                <Streamdown key={i} className="mb-4">
                  {paragraph}
                </Streamdown>
              ))}
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              <div className="sticky top-24 rounded-2xl border border-white/10 bg-white/5 p-6">
                <h3 className="mb-4 font-bold text-white">
                  Share this article
                </h3>
                <div className="flex gap-2">
                  <button className="rounded-lg bg-[#1DA1F2]/10 p-2 text-[#1DA1F2] transition-colors hover:bg-[#1DA1F2]/20">
                    <Twitter size={20} />
                  </button>
                  <button className="rounded-lg bg-[#0A66C2]/10 p-2 text-[#0A66C2] transition-colors hover:bg-[#0A66C2]/20">
                    <Linkedin size={20} />
                  </button>
                  <button className="rounded-lg bg-white/5 p-2 text-white transition-colors hover:bg-white/10">
                    <Share2 size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </SectionWrapper>
      </article>
    </main>
  )
}
