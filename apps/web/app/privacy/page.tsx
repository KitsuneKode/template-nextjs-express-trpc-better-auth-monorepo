import { buildMetadata } from '@/lib/seo'

export const metadata = buildMetadata({
  title: 'Privacy Policy',
  path: '/privacy',
})

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h1 className="text-4xl sm:text-5xl font-bold mb-2 text-neutral-900">Privacy Policy</h1>
        <p className="text-sm text-neutral-600 mb-12">Last updated: {new Date().toLocaleDateString()}</p>

        <div className="prose max-w-none bg-white rounded-lg shadow-sm p-8">
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-neutral-800">Introduction</h2>
            <p className="text-neutral-600">
              This is a privacy policy template. Replace this with your actual privacy policy detailing how you collect,
              use, and protect user data.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-neutral-800">Information We Collect</h2>
            <p className="text-neutral-600 mb-4">
              Describe the types of information you collect from users:
            </p>
            <ul className="list-disc pl-6 text-neutral-600 space-y-2">
              <li>Account information (name, email, password)</li>
              <li>Usage data (pages visited, features used)</li>
              <li>Device and browser information</li>
              <li>Cookies and similar tracking technologies</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-neutral-800">How We Use Information</h2>
            <p className="text-neutral-600">
              Explain how you use the collected information (service delivery, improvements, communications, etc.).
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-neutral-800">Data Security</h2>
            <p className="text-neutral-600">
              Describe the security measures you take to protect user data.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-neutral-800">Your Rights</h2>
            <p className="text-neutral-600">
              Outline user rights regarding their data (access, deletion, portability, etc.).
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-neutral-800">Contact Us</h2>
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
