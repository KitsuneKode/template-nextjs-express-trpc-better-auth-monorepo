import { Navbar } from '@/components/arche/navbar'
import { DocsSidebar } from '@/components/docs/docs-sidebar'

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex min-h-screen flex-col bg-black font-sans text-white selection:bg-white selection:text-black">
      <Navbar />

      <div className="mx-auto flex w-full max-w-[1200px] flex-1 flex-col border-r border-l border-zinc-800 md:flex-row">
        <DocsSidebar />
        <div className="flex min-w-0 flex-1 flex-col">{children}</div>
      </div>
    </main>
  )
}
