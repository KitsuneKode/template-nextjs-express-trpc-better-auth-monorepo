import Link from 'next/link'

const mockups = [
  {
    path: '/mockup-1',
    title: '1. Terminal Brutalist',
    desc: 'Highly aligned with the original spec. Very dark, heavy monospace, sharp edges, purely utilitarian.',
  },
  {
    path: '/mockup-2',
    title: '2. Ethereal Spatial',
    desc: 'Glassmorphism, floating elements, concentric border radii, subtle staggered animations, soft glows.',
  },
  {
    path: '/mockup-3',
    title: '3. Editorial Maximalism',
    desc: 'Extremely bold, high-contrast. Drenched in amber with massive typography and asymmetrical layout.',
  },
  {
    path: '/mockup-4',
    title: '4. Refined Apple-esque',
    desc: 'Very clean, highly polished light mode. Perfect typography, subtle inset shadows, generous spacing.',
  },
  {
    path: '/mockup-5',
    title: '5. Dark Neo-Brutalism',
    desc: 'Blueprint style. Structured, grid-based, highly analytical. Perfect for a serious developer tool.',
  },
  {
    path: '/mockup-6',
    title: '6. Tactile Skeuomorphic',
    desc: 'Light mode feeling like physical objects. Soft, embossed/debossed UI elements with beautiful shadows.',
  },
  {
    path: '/mockup-7',
    title: '7. High-Tech Glow',
    desc: 'Very minimal, deep black with subtle amber/white glows and ultra-thin borders. High contrast, sleek.',
  },
  {
    path: '/mockup-8',
    title: '8. Editorial Magazine',
    desc: 'Breaks the developer tool mold. Beautiful serif pairing, massive typography, wide margins, off-white.',
  },
  {
    path: '/mockup-9',
    title: '9. Bento Architecture',
    desc: 'Dark glassmorphism highlighting the modular packages with deep amber glows.',
  },
  {
    path: '/mockup-10',
    title: '10. CLI Console Focus',
    desc: 'Absolute black. Highly interactive terminal feel, typing animations, pure hacker aesthetic.',
  },
  {
    path: '/mockup-11',
    title: '11. Stealth Agent-First',
    desc: 'Deep blue-black. Massive overlapping typography, emphasis on AI-readiness and repo hygiene.',
  },
  {
    path: '/mockup-12',
    title: '12. Interactive Flow',
    desc: 'Dark elegance. Diagrammatic layouts, elegant cards showing the flow of Next.js to Express to DB.',
  },
  {
    path: '/mockup-13',
    title: '13. Stripe/Notion Hybrid',
    desc: 'Hyper-clean light mode. Ultimate trust, pure white, subtle borders, perfect typography.',
  },
  {
    path: '/mockup-14',
    title: '14. Stark Brutalism (Linear)',
    desc: '1px solid borders everywhere. Pure black/white, sharp corners, highly technical grid systems.',
  },
  {
    path: '/mockup-15',
    title: '15. Cyber-Organic / Web3',
    desc: 'Moving fluid mesh gradients behind frosted glass cards. Magical, creative, fluid aesthetic.',
  },
]

export default function MockupNavigator() {
  return (
    <main className="min-h-screen bg-zinc-950 p-8 font-sans text-zinc-300 md:p-16">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-4 text-4xl font-bold text-white">Arche Design Mockups</h1>
        <p className="mb-12 max-w-2xl text-lg text-zinc-500">
          I have removed the overlapping Navbar, so these pages will render cleanly. Select a mockup
          below to preview the aesthetic direction.
        </p>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {mockups.map((m) => (
            <Link
              key={m.path}
              href={m.path}
              className="group flex flex-col rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 shadow-lg transition-all hover:border-zinc-600 hover:bg-zinc-800/80"
            >
              <h2 className="mb-3 text-xl font-bold text-zinc-100 transition-colors group-hover:text-amber-500">
                {m.title}
              </h2>
              <p className="text-sm leading-relaxed font-medium text-zinc-400">{m.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}
