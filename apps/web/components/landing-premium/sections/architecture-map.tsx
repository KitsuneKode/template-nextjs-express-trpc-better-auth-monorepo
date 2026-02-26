import { architectureGroups, flowSteps } from './content'
import { ArrowRight } from '@template/ui/components/icons'

export function ArchitectureMap() {
  return (
    <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
      <div className="rounded-3xl border border-white/10 bg-[#0d1218]/86 p-5">
        <div className="grid gap-4 md:grid-cols-2">
          {architectureGroups.map((group) => (
            <section key={group.column}>
              <p className="mb-3 text-xs font-semibold tracking-[0.16em] text-[#cfaf87] uppercase">
                {group.column}
              </p>
              <div className="space-y-3">
                {group.items.map((item) => (
                  <article
                    key={item.name}
                    className="rounded-xl border border-white/8 bg-[#090d12] p-3"
                  >
                    <p className="inline-flex items-center gap-2 text-sm font-semibold text-[#f1e6d8]">
                      <item.icon className="h-4 w-4 text-[#d7ae7f]" />{' '}
                      {item.name}
                    </p>
                    <p className="mt-1 text-sm text-[#bba88f]">{item.role}</p>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>

      <div className="rounded-3xl border border-white/10 bg-[#0d1218]/86 p-5">
        <p className="mb-3 text-xs font-semibold tracking-[0.16em] text-[#cfaf87] uppercase">
          Request flow
        </p>
        <ol className="space-y-3">
          {flowSteps.map((step, index) => (
            <li
              key={step}
              className="rounded-xl border border-white/8 bg-[#090d12] p-3"
            >
              <p className="mb-1 inline-flex items-center gap-2 text-xs font-semibold tracking-[0.14em] text-[#dbc29f] uppercase">
                Step {index + 1}
                {index < flowSteps.length - 1 ? (
                  <ArrowRight className="h-3 w-3" />
                ) : null}
              </p>
              <p className="text-sm text-[#bfaa91]">{step}</p>
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}
