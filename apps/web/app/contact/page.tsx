import { buildMetadata } from '@/lib/seo'

export const metadata = buildMetadata({
  title: 'Contact Us',
  path: '/contact',
  description: 'Get in touch with us for questions or feedback',
})

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100">
      <div className="mx-auto max-w-2xl px-4 py-20 sm:px-6 lg:px-8">
        <h1 className="mb-2 text-4xl font-bold text-neutral-900 sm:text-5xl">Contact Us</h1>
        <p className="mb-12 text-xl text-neutral-600">We'd love to hear from you.</p>

        <form className="space-y-6 rounded-lg bg-white p-8 shadow-sm">
          <div>
            <label htmlFor="name" className="mb-2 block text-sm font-medium text-neutral-900">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              className="w-full rounded-lg border border-neutral-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
              placeholder="Your name"
            />
          </div>

          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-medium text-neutral-900">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              className="w-full rounded-lg border border-neutral-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label htmlFor="message" className="mb-2 block text-sm font-medium text-neutral-900">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              required
              rows={5}
              className="w-full rounded-lg border border-neutral-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
              placeholder="Tell us what's on your mind..."
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700"
          >
            Send Message
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-neutral-600">
          You can also reach us at{' '}
          <a href="mailto:hello@example.com" className="text-blue-600 hover:underline">
            hello@example.com
          </a>
        </p>
      </div>
    </div>
  )
}
