import Link from 'next/link'
import { Metadata } from 'next'
import { cacheLife } from 'next/cache'
import { cookies } from 'next/headers'
import { Streamdown } from 'streamdown'
import { prisma } from '@template/store'
import { notFound } from 'next/navigation'
import { Footer } from '@/components/landing/Footer'
import { SectionWrapper } from '@/components/ui/section-wrapper'
import { resolveSiteDesign, SITE_DESIGN_COOKIE_NAME } from '@/lib/site-design'
import { PremiumSiteShell } from '@/components/landing-premium/primitives/premium-site-shell'
import { PremiumBlogArticle } from '@/components/landing-premium/sections/premium-blog-article'
import {
  ArrowLeft,
  Calendar,
  Clock,
  Share2,
  Twitter,
  Linkedin,
} from '@template/ui/components/icons'

interface Props {
  params: Promise<{ slug: string }>
}

async function getPostBySlug(slug: string) {
  'use cache'
  cacheLife('days')

  return prisma.post.findUnique({
    where: { slug },
    include: { author: true },
  })
}

async function getPostMetadata(slug: string) {
  'use cache'
  cacheLife('hours')

  return prisma.post.findUnique({
    where: { slug },
  })
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = (await params).slug
  if (!slug) {
    return { title: 'Post Not Found' }
  }

  const post = await getPostMetadata(slug)

  if (!post) return { title: 'Post Not Found' }

  return {
    title: `${post.title} | Template Blog`,
    description: post.content.substring(0, 160),
  }
}

export default async function BlogPostPage({ params }: Props) {
  const slug = (await params).slug
  const [cookieStore, post] = await Promise.all([
    cookies(),
    getPostBySlug(slug),
  ])

  if (!post) notFound()

  const design = resolveSiteDesign(
    cookieStore.get(SITE_DESIGN_COOKIE_NAME)?.value,
  )

  if (design === 'design2') {
    return (
      <PremiumSiteShell>
        <div className="pt-10 md:pt-14">
          <PremiumBlogArticle
            post={post}
            backHref="/blog"
            backLabel="Back to blog"
          />
        </div>
      </PremiumSiteShell>
    )
  }

  return (
    <main className="min-h-screen bg-[#0A0A0A] text-[#EDEDED] selection:bg-[#D9AB72]/30 selection:text-white">
      <div className="pointer-events-none fixed inset-0 -z-10 flex justify-center">
        <div className="absolute top-[-20%] h-[600px] w-[600px] rounded-full bg-[#D9AB72]/[0.03] blur-[120px]" />
      </div>

      <article className="relative z-10 flex min-h-screen flex-col">
        <div className="border-b border-white/10 bg-white/[0.02] pt-32 pb-16">
          <SectionWrapper>
            <Link
              href="/blog"
              className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-[#A1A1AA] transition-colors hover:text-[#FAFAFA]"
            >
              <ArrowLeft size={16} /> Back to Blog
            </Link>

            <h1 className="mb-8 max-w-4xl font-serif text-4xl leading-tight font-medium tracking-tight text-[#FAFAFA] sm:text-6xl">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-6 text-sm text-[#A1A1AA]">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-sm font-medium text-[#D9AB72] ring-1 ring-white/10">
                  {post.author.name?.[0] || 'A'}
                </div>
                <div>
                  <div className="font-medium text-[#FAFAFA]">
                    {post.author.name || 'Anonymous'}
                  </div>
                  <div className="text-xs">Author</div>
                </div>
              </div>
              <div className="h-10 w-px bg-white/10" />
              <div className="flex items-center gap-2 font-medium">
                <Calendar size={16} />
                {new Date(post.createdAt).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </div>
              <div className="flex items-center gap-2 font-medium">
                <Clock size={16} />
                {Math.ceil(post.content.length / 1000)} min read
              </div>
            </div>
          </SectionWrapper>
        </div>

        <SectionWrapper className="flex-1 py-16">
          <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1fr_300px]">
            <div className="prose prose-invert prose-lg prose-headings:font-serif prose-headings:font-medium prose-headings:tracking-tight prose-headings:text-[#FAFAFA] prose-p:text-[#D4D4D8] prose-p:leading-relaxed prose-a:text-[#D9AB72] hover:prose-a:text-[#E5BE8C] prose-a:underline prose-a:underline-offset-4 prose-code:text-[#5FD1C4] prose-code:bg-white/[0.03] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:font-medium prose-code:before:content-none prose-code:after:content-none prose-pre:bg-[#0A0A0A] prose-pre:border prose-pre:border-white/10 prose-img:rounded-xl prose-img:border prose-img:border-white/10 max-w-none">
              <Streamdown>{post.content}</Streamdown>
            </div>

            <div className="space-y-8">
              <div className="sticky top-24 rounded-2xl border border-white/10 bg-white/[0.02] p-6">
                <h3 className="mb-4 font-serif text-lg font-medium text-[#FAFAFA]">
                  Share this article
                </h3>
                <div className="flex gap-3">
                  <button
                    type="button"
                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-[#A1A1AA] ring-1 ring-white/10 transition-colors hover:bg-[#1DA1F2]/10 hover:text-[#1DA1F2] hover:ring-[#1DA1F2]/30"
                  >
                    <Twitter size={18} />
                  </button>
                  <button
                    type="button"
                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-[#A1A1AA] ring-1 ring-white/10 transition-colors hover:bg-[#0A66C2]/10 hover:text-[#0A66C2] hover:ring-[#0A66C2]/30"
                  >
                    <Linkedin size={18} />
                  </button>
                  <button
                    type="button"
                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-[#A1A1AA] ring-1 ring-white/10 transition-colors hover:bg-white/10 hover:text-[#FAFAFA]"
                  >
                    <Share2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </SectionWrapper>
        <Footer />
      </article>
    </main>
  )
}
