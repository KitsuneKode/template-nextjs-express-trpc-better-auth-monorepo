import { cn } from '@arche-template/ui/lib/utils'
import { highlightCode } from '@/lib/highlight'

import { CodePanel } from '@/components/arche/site-primitives'

export async function HighlightedCode({
  code,
  lang = 'typescript',
  title = 'Code',
  className,
}: {
  code: string
  lang?: string
  title?: string
  className?: string
}) {
  const html = await highlightCode(code, lang)

  return (
    <CodePanel title={title}>
      <div
        className={cn(
          'highlighted-code [&_pre]:!m-0 [&_pre]:!bg-transparent [&_pre]:!p-0 [&_code]:text-sm [&_code]:leading-relaxed',
          className,
        )}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </CodePanel>
  )
}
