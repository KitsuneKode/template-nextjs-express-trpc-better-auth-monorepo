"use client";

import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { ArrowRight, Github } from "lucide-react";
import Link from "next/link";
import { AnimatedGradient } from "../ui/animated-gradient";
import { CodeBlock } from "../ui/code-block";
import { fadeInUp, staggerChildren } from "../../lib/animations";

const TYPING_TEXTS = [
  "Better Auth",
  "Prisma ORM",
  "tRPC API",
  "Next.js 15",
  "Upstash Redis"
];

export const Hero = () => {
  const [textIndex, setTextIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentText = TYPING_TEXTS[textIndex] || "";
    const speed = isDeleting ? 50 : 100;

    const timer = setTimeout(() => {
      if (!isDeleting && displayText === currentText) {
        setTimeout(() => setIsDeleting(true), 2000);
      } else if (isDeleting && displayText === "") {
        setIsDeleting(false);
        setTextIndex((prev) => (prev + 1) % TYPING_TEXTS.length);
      } else {
        setDisplayText(
          currentText.substring(0, displayText.length + (isDeleting ? -1 : 1))
        );
      }
    }, speed);

    return () => clearTimeout(timer);
  }, [displayText, isDeleting, textIndex]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <AnimatedGradient />
      
      <div className="container mx-auto px-4 md:px-6 relative z-10 grid lg:grid-cols-2 gap-12 items-center">
        <motion.div
          variants={staggerChildren}
          initial="hidden"
          animate="visible"
          className="text-center lg:text-left"
        >
          <motion.div variants={fadeInUp} className="inline-block mb-4 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm">
            <span className="text-sm font-medium text-[var(--solar-teal)]">
              v2.0 Now Available
            </span>
          </motion.div>
          
          <motion.h1 variants={fadeInUp} className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-6">
            The Full-Stack <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--solar-orange)] to-[var(--solar-purple)]">
              Monorepo Template
            </span>
          </motion.h1>
          
          <motion.div variants={fadeInUp} className="h-8 mb-6 text-xl md:text-2xl text-neutral-300 font-mono">
            Built with <span className="text-[var(--solar-green)]">{displayText}</span>
            <span className="animate-pulse">|</span>
          </motion.div>
          
          <motion.p variants={fadeInUp} className="text-lg text-neutral-400 mb-8 max-w-xl mx-auto lg:mx-0">
            Production-ready architecture with Better Auth, Prisma, tRPC, and Next.js. 
            Stop configuring and start shipping your next big idea.
          </motion.p>
          
          <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Link
              href="#demos"
              className="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-lg bg-[var(--solar-orange)] px-8 font-medium text-white transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(255,107,107,0.5)]"
            >
              <span className="mr-2">View Live Demos</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
            
            <Link
              href="https://github.com/kitsunekode/template-nextjs-express-trpc-bettera-auth-monorepo"
              target="_blank"
              className="inline-flex h-12 items-center justify-center rounded-lg border border-white/10 bg-white/5 px-8 font-medium text-white transition-all hover:bg-white/10 hover:scale-105"
            >
              <Github className="mr-2 w-5 h-5" />
              Star on GitHub
            </Link>
          </motion.div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="hidden lg:block relative"
        >
          <motion.div
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="relative z-10"
          >
            <CodeBlock
              filename="apps/web/app/page.tsx"
              code={`import { auth } from "@template/auth";
import { trpc } from "@template/trpc";

export default async function Page() {
  const session = await auth();
  const data = await trpc.hello.query();

  return (
    <main>
      <h1>Welcome {session.user.name}</h1>
      <p>{data.message}</p>
    </main>
  );
}`}
            />
          </motion.div>
          
          {/* Decorative elements */}
          <div className="absolute -top-20 -right-20 w-96 h-96 bg-[var(--solar-purple)] rounded-full blur-3xl opacity-20 animate-pulse" />
          <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-[var(--solar-orange)] rounded-full blur-3xl opacity-20 animate-pulse" />
        </motion.div>
      </div>
    </section>
  );
};
