import { buildMetadata } from '@/lib/seo'

export const metadata = buildMetadata({
  title: 'Privacy Policy',
  path: '/privacy',
})

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100">
      <div className="mx-auto max-w-4xl px-4 py-20 sm:px-6 lg:px-8">
        <h1 className="mb-2 text-4xl font-bold text-neutral-900 sm:text-5xl">Privacy Policy</h1>
        <p className="mb-12 text-sm text-neutral-600">Last updated: January 2025</p>

        <div className="prose max-w-none rounded-lg bg-white p-8 shadow-sm">
          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-bold text-neutral-800">Introduction</h2>
            <p className="text-neutral-600">
              This is a privacy policy template. Replace this with your actual privacy policy
              detailing how you collect, use, and protect user data.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-bold text-neutral-800">Information We Collect</h2>
            <p className="mb-4 text-neutral-600">
              Describe the types of information you collect from users:
            </p>
            <ul className="list-disc space-y-2 pl-6 text-neutral-600">
              <li>Account information (name, email, password)</li>
              <li>Usage data (pages visited, features used)</li>
              <li>Device and browser information</li>
              <li>Cookies and similar tracking technologies</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-bold text-neutral-800">How We Use Information</h2>
            <p className="text-neutral-600">
              Explain how you use the collected information (service delivery, improvements,
              communications, etc.).
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-bold text-neutral-800">Data Security</h2>
            <p className="text-neutral-600">
              Describe the security measures you take to protect user data.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-bold text-neutral-800">Your Rights</h2>
            <p className="text-neutral-600">
              Outline user rights regarding their data (access, deletion, portability, etc.).
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-bold text-neutral-800">Contact Us</h2>
            <p className="text-neutral-600">
              If you have questions about this privacy policy, please{' '}
              <a href="/contact" className="text-blue-600 hover:underline">
                contact us
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
