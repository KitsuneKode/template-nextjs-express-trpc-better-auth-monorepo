import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { prisma } from '@template/store'
import { PremiumBlogArticle } from '@/components/landing-premium/sections/premium-blog-article'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await prisma.post.findUnique({ where: { slug } })

  if (!post) {
    return { title: 'Post Not Found | Premium Blog' }
  }

  return {
    title: `${post.title} | Premium Blog`,
    description: post.content.slice(0, 160),
  }
}

export default async function LandingBlogDetailPage({ params }: Props) {
  const { slug } = await params

  const post = await prisma.post.findUnique({
    where: { slug, published: true },
    include: { author: true },
  })

  if (!post) {
    notFound()
  }

  return (
    <div className="pt-10 md:pt-14">
      <PremiumBlogArticle post={post} />
    </div>
  )
}
