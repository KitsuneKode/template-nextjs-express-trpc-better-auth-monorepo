import { buildMetadata } from '@/lib/seo'

export const metadata = buildMetadata({
  title: 'About Us',
  path: '/about',
})

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100">
      <div className="mx-auto max-w-4xl px-4 py-20 sm:px-6 lg:px-8">
        <h1 className="mb-6 text-4xl font-bold text-neutral-900 sm:text-5xl">About Us</h1>

        <div className="prose max-w-none">
          <p className="mb-6 text-xl text-neutral-600">
            Tell your story. What problem does your app solve? Who built it and why?
          </p>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-bold text-neutral-800">Our Mission</h2>
            <p className="mb-4 text-neutral-600">
              Describe your mission and the impact you want to have. What values guide your work?
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-bold text-neutral-800">The Team</h2>
            <p className="mb-4 text-neutral-600">
              Share information about your team. Who are the people behind this project?
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-bold text-neutral-800">Get in Touch</h2>
            <p className="text-neutral-600">
              Have questions?{' '}
              <a href="/contact" className="text-blue-600 hover:underline">
                Contact us
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
