import { stackCards } from './content'

export function StackGrid() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {stackCards.map((card) => (
        <article
          key={card.title}
          className="group min-w-0 overflow-hidden rounded-3xl border border-white/10 bg-[#0e131a]/88 p-5 transition-transform duration-300 hover:-translate-y-1"
          style={{
            boxShadow: `inset 0 0 0 1px color-mix(in srgb, ${card.accent} 20%, transparent)`,
          }}
        >
          <div
            className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03]"
            style={{ color: card.accent }}
          >
            <card.icon className="h-5 w-5" />
          </div>
          <h3 className="text-xl font-semibold text-[#f6eee3]">{card.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-[#baa68f]">
            {card.description}
          </p>
          <pre className="mt-4 rounded-xl border border-white/8 bg-[#090d12] p-3 text-xs break-all whitespace-pre-wrap text-[#9eb2c3]">
            <code>{card.snippet}</code>
          </pre>
        </article>
      ))}
    </div>
  )
}
