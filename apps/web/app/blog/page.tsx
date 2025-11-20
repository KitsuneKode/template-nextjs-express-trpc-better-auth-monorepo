import { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@template/store";
import { SectionWrapper } from "@/components/ui/section-wrapper";
import { AnimatedGradient } from "@/components/ui/animated-gradient";
import { motion } from "motion/react";
import { ArrowRight, Calendar, Clock, User } from "lucide-react";

export const metadata: Metadata = {
  title: "Blog | Template",
  description: "Insights, tutorials, and updates from the team.",
};

export default async function BlogIndexPage() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
    include: { author: true },
  });

  return (
    <main className="min-h-screen bg-neutral-950 text-white selection:bg-[var(--solar-purple)] selection:text-white">
      <div className="fixed inset-0 z-0 opacity-30 pointer-events-none">
        <AnimatedGradient />
      </div>

      <SectionWrapper className="pt-32 pb-20 relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-neutral-200 to-neutral-400 bg-clip-text text-transparent">
            Engineering Blog
          </h1>
          <p className="text-xl text-neutral-400 max-w-2xl mx-auto">
            Deep dives into modern web development, monorepo architectures, and building scalable systems.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {posts.map((post) => (
            <Link 
              key={post.id} 
              href={`/blog/${post.slug}`}
              className="group relative flex flex-col bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-[var(--solar-purple)] transition-colors duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--solar-purple)]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="p-8 flex flex-col h-full relative z-10">
                <div className="flex items-center gap-4 text-sm text-neutral-400 mb-4">
                  <span className="flex items-center gap-1">
                    <Calendar size={14} />
                    {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={14} />
                    {Math.ceil(post.content.length / 1000)} min read
                  </span>
                </div>

                <h2 className="text-2xl font-bold mb-3 group-hover:text-[var(--solar-teal)] transition-colors">
                  {post.title}
                </h2>
                
                <p className="text-neutral-400 line-clamp-3 mb-6 flex-1">
                  {post.content.substring(0, 150)}...
                </p>

                <div className="flex items-center justify-between mt-auto pt-6 border-t border-white/5">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--solar-orange)] to-[var(--solar-magenta)] flex items-center justify-center text-xs font-bold">
                      {post.author.name?.[0] || "A"}
                    </div>
                    <span className="text-sm font-medium text-neutral-300">
                      {post.author.name || "Anonymous"}
                    </span>
                  </div>
                  <span className="flex items-center gap-1 text-[var(--solar-teal)] text-sm font-medium group-hover:translate-x-1 transition-transform">
                    Read Article <ArrowRight size={16} />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {posts.length === 0 && (
          <div className="text-center py-20 border border-dashed border-neutral-800 rounded-2xl bg-neutral-900/50">
            <h3 className="text-xl font-semibold text-neutral-300 mb-2">No posts found</h3>
            <p className="text-neutral-500">Check back later for new content.</p>
          </div>
        )}
      </SectionWrapper>
    </main>
  );
}
