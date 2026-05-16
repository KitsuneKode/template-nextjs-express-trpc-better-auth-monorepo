import { buildMetadata } from '@/lib/seo'

export const metadata = buildMetadata({
  title: 'Terms of Service',
  path: '/terms',
})

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h1 className="text-4xl sm:text-5xl font-bold mb-2 text-neutral-900">Terms of Service</h1>
        <p className="text-sm text-neutral-600 mb-12">Last updated: {new Date().toLocaleDateString()}</p>

        <div className="prose max-w-none bg-white rounded-lg shadow-sm p-8">
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-neutral-800">Introduction</h2>
            <p className="text-neutral-600">
              This is a terms of service template. Replace this with your actual terms that govern user access and use
              of your service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-neutral-800">Use License</h2>
            <p className="text-neutral-600 mb-4">
              Permission is granted to temporarily download one copy of the materials (information or software) on our
              service for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer
              of title, and under this license you may not:
            </p>
            <ul className="list-disc pl-6 text-neutral-600 space-y-2">
              <li>Modify or copy the materials</li>
              <li>Use the materials for any commercial purpose or for any public display</li>
              <li>Attempt to decompile or reverse engineer any software on the service</li>
              <li>Remove any copyright or other proprietary notations from the materials</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-neutral-800">Disclaimer</h2>
            <p className="text-neutral-600">
              The materials on our service are provided on an 'as is' basis. We make no warranties, expressed or
              implied, and hereby disclaim and negate all other warranties including, without limitation, implied warranties
              or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property
              or other violation of rights.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-neutral-800">Limitations</h2>
            <p className="text-neutral-600">
              In no event shall our company or its suppliers be liable for any damages (including, without limitation,
              damages for loss of data or profit, or due to business interruption) arising out of the use or
              inability to use the materials on the service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-neutral-800">Governing Law</h2>
            <p className="text-neutral-600">
              These terms and conditions are governed by and construed in accordance with the laws of your jurisdiction,
              and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
