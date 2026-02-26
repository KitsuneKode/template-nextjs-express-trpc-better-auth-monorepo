import { createSocialImage } from './social-image'

export const runtime = 'edge'
export const alt =
  'Kitsune Stack Template: Next.js, Express, tRPC, Better Auth, Prisma, and Turborepo.'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default function OpenGraphImage() {
  return createSocialImage({
    eyebrow: 'Production Monorepo Template',
    title: 'Build full-stack apps without setup drag.',
    subtitle:
      'A production-ready monorepo with Next.js, Express, tRPC, Better Auth, Prisma, shared UI, and real demo flows.',
  })
}
