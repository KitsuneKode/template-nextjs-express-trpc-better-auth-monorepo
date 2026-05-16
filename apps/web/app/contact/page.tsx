import { buildMetadata } from '@/lib/seo'

export const metadata = buildMetadata({
  title: 'Contact Us',
  path: '/contact',
  description: 'Get in touch with us for questions or feedback',
})

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h1 className="text-4xl sm:text-5xl font-bold mb-2 text-neutral-900">Contact Us</h1>
        <p className="text-xl text-neutral-600 mb-12">We'd love to hear from you.</p>

        <form className="bg-white rounded-lg shadow-sm p-8 space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-neutral-900 mb-2">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Your name"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-neutral-900 mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-neutral-900 mb-2">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              required
              rows={5}
              className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Tell us what's on your mind..."
            />
          </div>

          <button
            type="submit"
            className="w-full px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
          >
            Send Message
          </button>
        </form>

        <p className="text-sm text-neutral-600 text-center mt-8">
          You can also reach us at{' '}
          <a href="mailto:hello@example.com" className="text-blue-600 hover:underline">
            hello@example.com
          </a>
        </p>
      </div>
    </div>
  )
}
