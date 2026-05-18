import { Metadata } from 'next'
import { FamilyTable } from '@/components/arche/family-table'
import { Navbar } from '@/components/arche/navbar'

export const metadata: Metadata = {
  title: 'Architecture Families',
  description: 'Compare and choose the best starter template for your next project.',
}

export default function FamiliesPage() {
  return (
    <main className="min-h-screen bg-black font-sans text-white selection:bg-white selection:text-black">
      <Navbar />

      <div className="mx-auto flex min-h-[calc(100vh-56px)] max-w-[1200px] flex-col border-r border-l border-zinc-800">
        {/* Header Area */}
        <section className="relative overflow-hidden border-b border-zinc-800 bg-black p-6 md:p-16">
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:24px_24px]" />

          <div className="relative z-10 flex max-w-3xl flex-col items-start">
            <div className="mb-8 inline-flex items-center gap-2 border border-zinc-800 bg-black px-3 py-1 text-xs font-bold tracking-wider uppercase shadow-[4px_4px_0_0_rgba(39,39,42,1)]">
              Arche Families
            </div>

            <h1 className="mb-8 text-5xl leading-[0.9] font-black tracking-tighter text-white uppercase md:text-7xl">
              Pick your <br />
              <span className="text-stroke-white text-transparent">Foundation.</span>
            </h1>

            <p className="text-lg leading-snug font-medium text-zinc-400 md:text-xl">
              11 distinct starter templates. Choose the exact architecture you need without the
              bloat of the things you don't.
            </p>
          </div>
        </section>

        {/* Table Section */}
        <section className="flex-1 bg-black p-6 md:p-16">
          <FamilyTable />
        </section>
      </div>
    </main>
  )
}
