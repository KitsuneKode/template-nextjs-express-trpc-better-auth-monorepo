import { Badge } from '@arche-template/ui/components/badge'
import { Button } from '@arche-template/ui/components/button'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@arche-template/ui/components/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@arche-template/ui/components/tabs'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { Navbar } from '@/components/arche/navbar'

export const metadata: Metadata = {
  title: 'Component Showcase',
  description: 'Explore the brutalist UI components built with shadcn/ui.',
}

export default function ShowcasePage() {
  if (process.env.NODE_ENV === 'production') {
    notFound()
  }

  return (
    <main className="min-h-screen bg-black font-sans text-white selection:bg-white selection:text-black">
      <Navbar />

      <div className="mx-auto flex min-h-[calc(100vh-56px)] max-w-[1200px] flex-col border-r border-l border-zinc-800">
        {/* Header Area */}
        <section className="relative overflow-hidden border-b border-zinc-800 bg-black p-6 text-left md:p-16">
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:24px_24px]" />

          <div className="relative z-10 flex max-w-3xl flex-col items-start">
            <div className="mb-8 inline-flex items-center gap-2 border border-zinc-800 bg-black px-3 py-1 text-xs font-bold tracking-wider uppercase shadow-[4px_4px_0_0_rgba(39,39,42,1)]">
              Component Showcase
            </div>

            <h1 className="mb-8 text-5xl leading-[0.9] font-black tracking-tighter text-white uppercase md:text-7xl">
              The <br />
              <span className="text-stroke-white text-transparent">Atomic Units.</span>
            </h1>

            <p className="text-xl leading-snug font-medium text-zinc-300">
              Every component is built with shadcn/ui and strictly follows the Dark Stark Brutalism
              design system. Sharp edges, 1px borders, and high technical contrast.
            </p>
          </div>
        </section>

        {/* Showcase Grid */}
        <section className="space-y-24 p-6 md:p-16">
          {/* Buttons & Badges */}
          <div className="space-y-8">
            <h2 className="border-b border-zinc-800 pb-4 text-2xl font-bold tracking-tight uppercase">
              Actions & Signals
            </h2>
            <div className="flex flex-wrap items-center gap-4">
              <Button className="rounded-none border border-white bg-white font-bold text-black shadow-[4px_4px_0_0_rgba(255,255,255,0.2)] hover:bg-zinc-200">
                Primary Action
              </Button>
              <Button
                variant="outline"
                className="rounded-none border-zinc-800 bg-black text-white shadow-[4px_4px_0_0_rgba(39,39,42,1)] hover:bg-zinc-900"
              >
                Secondary
              </Button>
              <Button variant="ghost" className="rounded-none text-zinc-400 hover:text-white">
                Ghost Link
              </Button>
              <div className="ml-4 flex gap-2">
                <Badge className="rounded-none bg-white font-bold tracking-tighter text-black uppercase">
                  v3.0.0
                </Badge>
                <Badge
                  variant="outline"
                  className="rounded-none border-zinc-800 font-mono text-zinc-400"
                >
                  DEV ONLY
                </Badge>
                <Badge className="rounded-none border-amber-500 bg-amber-500 font-bold tracking-tighter text-black uppercase">
                  BETA
                </Badge>
              </div>
            </div>
          </div>

          {/* Cards */}
          <div className="space-y-8">
            <h2 className="border-b border-zinc-800 pb-4 text-2xl font-bold tracking-tight uppercase">
              Containers
            </h2>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <Card className="rounded-none border-zinc-800 bg-zinc-950 shadow-[8px_8px_0_0_rgba(39,39,42,1)]">
                <CardHeader>
                  <div className="mb-2 font-mono text-[10px] tracking-widest text-zinc-500 uppercase">
                    Module / 01
                  </div>
                  <CardTitle className="font-black tracking-tight text-white uppercase">
                    Technical Spec Card
                  </CardTitle>
                  <CardDescription className="text-zinc-400">
                    High contrast container for technical data.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="border border-zinc-800 bg-black p-4 font-mono text-xs text-blue-400">
                    trpc.user.get.useQuery();
                  </div>
                  <p className="text-sm text-zinc-400">
                    Cards feature a solid dark gray shadow to maintain the brutalist depth while
                    respecting the dark theme.
                  </p>
                </CardContent>
                <CardFooter className="flex justify-between border-t border-zinc-800 py-4">
                  <span className="font-mono text-[10px] text-zinc-600 uppercase">PRISMA_V6</span>
                  <Button variant="link" className="h-auto p-0 text-zinc-400 hover:text-white">
                    Learn More →
                  </Button>
                </CardFooter>
              </Card>

              <Card className="rounded-none border-zinc-800 bg-black shadow-[8px_8px_0_0_rgba(255,255,255,0.05)]">
                <CardHeader>
                  <CardTitle className="text-stroke-white font-black tracking-tight text-transparent text-white uppercase">
                    Hollow Header
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed text-zinc-300">
                    By combining <code className="bg-zinc-900 px-1 text-white">text-stroke</code>{' '}
                    with transparent fills, we can create high-impact headers that don't weigh down
                    the visual balance of the page.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Interactive */}
          <div className="space-y-8">
            <h2 className="border-b border-zinc-800 pb-4 text-2xl font-bold tracking-tight uppercase">
              Tabbed Navigation
            </h2>
            <div className="max-w-2xl">
              <Tabs defaultValue="architecture" className="w-full">
                <TabsList className="h-auto w-full justify-start rounded-none border border-zinc-800 bg-zinc-900 p-1">
                  <TabsTrigger
                    value="architecture"
                    className="rounded-none px-6 py-2 font-mono text-xs tracking-widest text-zinc-400 uppercase data-[state=active]:bg-black data-[state=active]:text-white"
                  >
                    Architecture
                  </TabsTrigger>
                  <TabsTrigger
                    value="tooling"
                    className="rounded-none px-6 py-2 font-mono text-xs tracking-widest text-zinc-400 uppercase data-[state=active]:bg-black data-[state=active]:text-white"
                  >
                    Tooling
                  </TabsTrigger>
                  <TabsTrigger
                    value="deployment"
                    className="rounded-none px-6 py-2 font-mono text-xs tracking-widest text-zinc-400 uppercase data-[state=active]:bg-black data-[state=active]:text-white"
                  >
                    Deployment
                  </TabsTrigger>
                </TabsList>
                <TabsContent
                  value="architecture"
                  className="mt-0 border-x border-b border-zinc-800 bg-black p-8"
                >
                  <h3 className="mb-4 text-xl font-bold uppercase">Monolithic Core</h3>
                  <p className="text-sm leading-relaxed text-zinc-400">
                    Arche enforces strict package boundaries to ensure that as your team grows, your
                    code remains modular and testable. No circular dependencies, guaranteed by
                    Turborepo.
                  </p>
                </TabsContent>
                <TabsContent
                  value="tooling"
                  className="mt-0 border-x border-b border-zinc-800 bg-black p-8 py-16 text-center"
                >
                  <p className="font-mono text-sm tracking-widest text-zinc-600 uppercase">
                    Component / Empty State
                  </p>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
