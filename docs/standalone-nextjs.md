# Standalone Next.js Template Guide

This guide covers setting up a Next.js-only template for frontend applications, marketing sites, and SPAs.

## When to Use Standalone Next.js

Use this template when you:

- Don't need a backend (yet)
- Are building a marketing site or landing page
- Want to integrate with external APIs
- Are using a third-party BaaS (Firebase, Supabase, Clerk)
- Are training frontend developers
- Want minimal setup complexity

## Project Structure

```bash
template-nextjs-standalone/
├── app/
│   ├── (marketing)/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── about/page.tsx
│   │   ├── pricing/page.tsx
│   │   └── contact/page.tsx
│   ├── (auth)/
│   │   ├── signin/page.tsx
│   │   ├── signup/page.tsx
│   │   └── verify/page.tsx
│   ├── (dashboard)/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── settings/page.tsx
│   ├── api/
│   │   └── (optional for client proxies)
│   ├── layout.tsx
│   └── error.tsx
├── components/
│   ├── shared/
│   │   ├── header.tsx
│   │   ├── footer.tsx
│   │   ├── navigation.tsx
│   │   └── mobile-nav.tsx
│   ├── sections/
│   │   ├── hero.tsx
│   │   ├── features.tsx
│   │   └── cta.tsx
│   ├── forms/
│   │   ├── contact-form.tsx
│   │   └── subscribe-form.tsx
│   └── ui/
│       ├── button.tsx
│       ├── card.tsx
│       └── modal.tsx
├── lib/
│   ├── api.ts                 # API client configuration
│   ├── seo.ts                 # SEO utilities
│   ├── constants.ts
│   └── utils.ts
├── hooks/
│   ├── useLocalStorage.ts
│   ├── useMediaQuery.ts
│   └── useScrollPosition.ts
├── styles/
│   ├── globals.css
│   └── variables.css
├── public/
│   ├── images/
│   ├── icons/
│   └── fonts/
├── env.ts                     # Environment validation
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

## Core Setup

### 1. Environment Validation

**env.ts**

```typescript
import { z } from 'zod'

const envSchema = z.object({
  NEXT_PUBLIC_API_URL: z.string().url().optional(),
  NEXT_PUBLIC_SENTRY_DSN: z.string().optional(),
  NEXT_PUBLIC_GA_ID: z.string().optional(),
})

const env = envSchema.parse({
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
  NEXT_PUBLIC_GA_ID: process.env.NEXT_PUBLIC_GA_ID,
})

export default env
```

### 2. API Client

**lib/api.ts**

```typescript
import env from '@/env'

const BASE_URL = env.NEXT_PUBLIC_API_URL || 'https://api.example.com'

export const apiClient = {
  async get<T>(endpoint: string): Promise<T> {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })

    if (!res.ok) throw new Error(`API error: ${res.status}`)
    return res.json()
  },

  async post<T>(endpoint: string, data: unknown): Promise<T> {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    if (!res.ok) throw new Error(`API error: ${res.status}`)
    return res.json()
  },

  async put<T>(endpoint: string, data: unknown): Promise<T> {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    if (!res.ok) throw new Error(`API error: ${res.status}`)
    return res.json()
  },

  async delete<T>(endpoint: string): Promise<T> {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    })

    if (!res.ok) throw new Error(`API error: ${res.status}`)
    return res.json()
  },
}
```

### 3. SEO Utilities

**lib/seo.ts**

```typescript
import { Metadata } from 'next'

export interface SeoMetadata {
  title: string
  description: string
  image?: string
  url?: string
  author?: string
}

export function buildMetadata(meta: SeoMetadata): Metadata {
  return {
    title: meta.title,
    description: meta.description,
    openGraph: {
      title: meta.title,
      description: meta.description,
      images: meta.image ? [{ url: meta.image, width: 1200, height: 630 }] : [],
      url: meta.url,
    },
    twitter: {
      card: 'summary_large_image',
      title: meta.title,
      description: meta.description,
      images: meta.image ? [meta.image] : [],
    },
  }
}

export const defaultMeta: SeoMetadata = {
  title: 'My App',
  description: 'Welcome to my app',
  url: 'https://example.com',
}
```

## Authentication Integration Options

### Option 1: Clerk Authentication

**Installation:**

```bash
npm install @clerk/nextjs
```

**Setup:**

```typescript
// middleware.ts
import { clerkMiddleware } from '@clerk/nextjs/server'

export default clerkMiddleware()

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
}
```

**Usage:**

```typescript
'use client'

import { UserButton, useAuth, useUser } from '@clerk/nextjs'

export default function Dashboard() {
  const { userId } = useAuth()
  const { user } = useUser()

  if (!userId) return <div>Not signed in</div>

  return (
    <div>
      <h1>Welcome, {user?.firstName}</h1>
      <UserButton />
    </div>
  )
}
```

### Option 2: Auth0

**Installation:**

```bash
npm install @auth0/nextjs-auth0
```

**Setup:**

```typescript
// app/api/auth/[auth0]/route.ts
import { handleAuth } from '@auth0/nextjs-auth0'

export const GET = handleAuth()
```

**Usage:**

```typescript
'use client'

import { useUser } from '@auth0/nextjs-auth0/client'

export default function Profile() {
  const { user, isLoading } = useUser()

  if (isLoading) return <div>Loading...</div>
  if (!user) return <div>Not authenticated</div>

  return <h1>Welcome {user.name}</h1>
}
```

### Option 3: NextAuth.js

**Installation:**

```bash
npm install next-auth
```

**Setup:**

```typescript
// app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
})

export { handler as GET, handler as POST }
```

**Usage:**

```typescript
'use client'

import { SessionProvider, useSession, signOut } from 'next-auth/react'

export default function Dashboard() {
  const { data: session } = useSession()

  if (!session) return <div>Not signed in</div>

  return (
    <div>
      <h1>Welcome {session.user?.name}</h1>
      <button onClick={() => signOut()}>Sign Out</button>
    </div>
  )
}
```

## Example Pages

### Marketing Home Page

```typescript
// app/(marketing)/page.tsx
import { Metadata } from 'next'
import { buildMetadata, defaultMeta } from '@/lib/seo'
import { Hero } from '@/components/sections/hero'
import { Features } from '@/components/sections/features'
import { CTA } from '@/components/sections/cta'

export const metadata: Metadata = buildMetadata({
  ...defaultMeta,
  title: 'Home | My App',
})

export default function Home() {
  return (
    <main>
      <Hero />
      <Features />
      <CTA />
    </main>
  )
}
```

### Dashboard Page

```typescript
// app/(dashboard)/page.tsx
'use client'

import { useUser } from '@clerk/nextjs'
import { UserProfile } from '@/components/user-profile'

export default function Dashboard() {
  const { user, isLoaded } = useUser()

  if (!isLoaded) return <div>Loading...</div>
  if (!user) return <div>Unauthorized</div>

  return (
    <div className="max-w-4xl mx-auto py-12">
      <h1>Dashboard</h1>
      <UserProfile user={user} />
    </div>
  )
}
```

### Contact Form Page

```typescript
// app/(marketing)/contact/page.tsx
import { Metadata } from 'next'
import { ContactForm } from '@/components/forms/contact-form'
import { buildMetadata } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'Contact Us',
  description: 'Get in touch with us',
})

export default function ContactPage() {
  return (
    <div className="max-w-2xl mx-auto py-12">
      <h1 className="text-3xl font-bold mb-8">Contact Us</h1>
      <ContactForm />
    </div>
  )
}
```

## Custom Hooks

### useLocalStorage

```typescript
// hooks/useLocalStorage.ts
'use client'

import { useState, useEffect } from 'react'

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(initialValue)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    const item = typeof window !== 'undefined' ? window.localStorage?.getItem(key) : null
    if (item) {
      try {
        setStoredValue(JSON.parse(item))
      } catch (error) {
        console.warn(`Error parsing localStorage key "${key}":`, error)
      }
    }
  }, [key])

  const setValue = (value: T) => {
    try {
      setStoredValue(value)
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(value))
      }
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error)
    }
  }

  return [storedValue, setValue, isMounted] as const
}
```

### useMediaQuery

```typescript
// hooks/useMediaQuery.ts
'use client'

import { useEffect, useState } from 'react'

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const media = window.matchMedia(query)
    if (media.matches !== matches) {
      setMatches(media.matches)
    }

    const listener = () => setMatches(media.matches)
    media.addEventListener('change', listener)
    return () => media.removeEventListener('change', listener)
  }, [matches, query])

  return matches
}
```

## Deployment

### Vercel (Recommended)

```bash
# Connect your GitHub repo
vercel import

# Deploy
vercel deploy
```

### Netlify

```bash
# Install CLI
npm install -g netlify-cli

# Connect and deploy
netlify deploy
```

### Self-hosted (Docker)

**Dockerfile**

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package.json bun.lockb ./
RUN npm ci

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

## Performance Optimization

### Image Optimization

```typescript
import Image from 'next/image'

export function OptimizedImage() {
  return (
    <Image
      src="/image.jpg"
      alt="Description"
      width={1200}
      height={630}
      priority // For above-the-fold images
    />
  )
}
```

### Font Optimization

```typescript
// app/layout.tsx
import { Inter, JetBrains_Mono } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })
const mono = JetBrains_Mono({ subsets: ['latin'] })

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html className={inter.className}>
      <body>{children}</body>
    </html>
  )
}
```

### Code Splitting

```typescript
// Dynamic imports for heavy components
import dynamic from 'next/dynamic'

const HeavyComponent = dynamic(() => import('@/components/heavy'), {
  loading: () => <div>Loading...</div>,
})

export default function Page() {
  return <HeavyComponent />
}
```

## Environment Variables

**.env.local**

```bash
# API Configuration
NEXT_PUBLIC_API_URL=https://api.example.com

# Authentication (Clerk)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

# Analytics
NEXT_PUBLIC_GA_ID=

# Error Tracking
NEXT_PUBLIC_SENTRY_DSN=
```

## Best Practices

✅ Use App Router (not Pages Router)
✅ Implement proper error boundaries
✅ Use TypeScript strictly
✅ Optimize images and fonts
✅ Implement proper SEO metadata
✅ Use environment validation (Zod)
✅ Cache API responses when possible
✅ Implement proper error handling
✅ Use reusable components from packages/ui
✅ Deploy to Vercel for best Next.js support

## Migrating to Full Stack

When you need a backend:

1. Add `apps/server` with Express + tRPC
2. Add `packages/store` with Prisma
3. Add `packages/auth` with Better Auth
4. Update API client to use tRPC
5. Implement proper authentication

See `docs/template-variants.md` for more details.
