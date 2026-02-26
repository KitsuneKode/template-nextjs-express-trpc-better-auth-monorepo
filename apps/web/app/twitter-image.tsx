import { createSocialImage } from './social-image'

export const runtime = 'edge'
export const alt =
  'Kitsune Stack Template: ship faster with Next.js, Express, tRPC, Better Auth, and Prisma.'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default function TwitterImage() {
  return createSocialImage({
    eyebrow: 'Next.js Starter',
    title: 'Ship faster with a real full-stack baseline.',
    subtitle:
      'Type-safe APIs, auth, database, reusable UI, and monorepo structure already connected from day one.',
  })
}
