import Link from 'next/link'

export function DocsNextSteps({
  links,
}: {
  links: ReadonlyArray<{ href: string; label: string; description?: string }>
}) {
  if (links.length === 0) return null

  return (
    <section className="not-prose mt-16 border-t border-zinc-800 pt-10">
      <h2 className="mb-4 font-mono text-[10px] tracking-[0.2em] text-zinc-500 uppercase">
        Next steps
      </h2>
      <ul className="grid gap-3 sm:grid-cols-1">
        {links.slice(0, 3).map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="group block border border-zinc-800 bg-zinc-950/50 px-4 py-3 transition-colors hover:border-zinc-600"
            >
              <span className="font-semibold text-white group-hover:underline">{link.label}</span>
              {link.description ? (
                <span className="mt-1 block text-sm text-zinc-500">{link.description}</span>
              ) : null}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
