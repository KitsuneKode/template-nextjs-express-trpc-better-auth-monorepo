import { describe, expect, it } from 'bun:test'
import {
  renderGeneratedAgentsMd,
  renderInternalDocsIndex,
  renderPlansIndex,
} from '../src/render/docs/agent-context'

describe('agent context renderers', () => {
  it('keeps AGENTS.md short and directive', () => {
    const content = renderGeneratedAgentsMd({ projectName: 'acme' })
    expect(content).toContain('# Agent guide')
    expect(content).toContain('Read this file first')
    expect(content).toContain('.docs/README.md')
    expect(content).toContain('.plans/active')
    expect(content).not.toContain('CONTEXT.md')
    expect(content).not.toContain('.cursor/rules')
    expect(content).not.toContain('.claude/rules')
  })

  it('renders internal docs index with loading rules', () => {
    const content = renderInternalDocsIndex()
    expect(content).toContain('Do not load this whole tree by default')
    expect(content).toContain('architecture/')
    expect(content).toContain('capabilities/')
    expect(content).toContain('decisions/')
  })

  it('renders plans lifecycle rules', () => {
    const content = renderPlansIndex()
    expect(content).toContain('active/')
    expect(content).toContain('completed/')
    expect(content).toContain('archive/')
    expect(content).toContain('Never treat `archive/` as current behavior')
  })
})
