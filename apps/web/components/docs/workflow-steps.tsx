import { CodePanel } from '@/components/arche/site-primitives'

export type WorkflowStepItem = {
  title: string
  command: string
  note?: string
}

export function WorkflowSteps({ steps }: { steps: WorkflowStepItem[] }) {
  return (
    <ol className="not-prose my-10 grid list-none gap-6 p-0">
      {steps.map((step, index) => (
        <li
          key={step.title}
          className="grid gap-4 border border-zinc-800 bg-zinc-950/40 p-6 md:grid-cols-[minmax(0,10rem)_1fr]"
        >
          <div>
            <div className="font-mono text-[10px] tracking-[0.18em] text-zinc-500 uppercase">
              Step {index + 1}
            </div>
            <div className="mt-2 text-lg font-bold tracking-tight text-white uppercase">
              {step.title}
            </div>
            {step.note ? (
              <p className="mt-2 text-sm leading-relaxed text-pretty text-zinc-500">{step.note}</p>
            ) : null}
          </div>
          <CodePanel title="Command">
            <code className="break-all whitespace-pre-wrap">{step.command}</code>
          </CodePanel>
        </li>
      ))}
    </ol>
  )
}
