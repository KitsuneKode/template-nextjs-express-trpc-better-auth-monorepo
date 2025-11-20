import React from 'react'
import Link from 'next/link'
import { Github, Twitter, Linkedin, Heart } from 'lucide-react'

export const Footer = () => {
  return (
    <footer className="border-t border-neutral-800 bg-neutral-950 py-12">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-12 grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="mb-4 block text-2xl font-bold text-white">
              Template
            </Link>
            <p className="max-w-xs text-neutral-400">
              The ultimate starter kit for your next great idea. Built with
              modern tools for modern developers.
            </p>
          </div>

          <div>
            <h4 className="mb-4 font-semibold text-white">Product</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/features"
                  className="text-neutral-400 transition-colors hover:text-white"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="/pricing"
                  className="text-neutral-400 transition-colors hover:text-white"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  href="/docs"
                  className="text-neutral-400 transition-colors hover:text-white"
                >
                  Documentation
                </Link>
              </li>
              <li>
                <Link
                  href="/changelog"
                  className="text-neutral-400 transition-colors hover:text-white"
                >
                  Changelog
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-semibold text-white">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/privacy"
                  className="text-neutral-400 transition-colors hover:text-white"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-neutral-400 transition-colors hover:text-white"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-neutral-800 pt-8 md:flex-row">
          <div className="flex items-center gap-1 text-sm text-neutral-500">
            © {new Date().getFullYear()} Template. Made with{' '}
            <Heart className="h-4 w-4 fill-red-500 text-red-500" /> by
            KitsuneKode.
          </div>

          <div className="flex gap-4">
            <Link
              href="#"
              className="text-neutral-400 transition-colors hover:text-white"
            >
              <Github className="h-5 w-5" />
            </Link>
            <Link
              href="#"
              className="text-neutral-400 transition-colors hover:text-white"
            >
              <Twitter className="h-5 w-5" />
            </Link>
            <Link
              href="#"
              className="text-neutral-400 transition-colors hover:text-white"
            >
              <Linkedin className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
