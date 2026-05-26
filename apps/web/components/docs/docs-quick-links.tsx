import Link from 'next/link'

const DEFAULT_LINKS = [
  { href: '/docs/presets', label: 'Presets' },
  { href: '/docs/cli', label: 'CLI' },
  { href: '/docs/operations/deploy', label: 'Deploy' },
  { href: '/examples', label: 'Examples' },
  { href: '/families', label: 'Families' },
] as const

export function DocsQuickLinks({
  links = DEFAULT_LINKS,
}: {
  links?: ReadonlyArray<{ href: string; label: string }>
}) {
  return (
    <div className="not-prose my-8 flex flex-wrap gap-2">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="border border-zinc-800 bg-black px-3 py-1.5 font-mono text-[10px] tracking-widest text-zinc-400 uppercase transition-colors hover:border-zinc-600 hover:text-white"
        >
          {link.label}
        </Link>
      ))}
    </div>
  )
}
