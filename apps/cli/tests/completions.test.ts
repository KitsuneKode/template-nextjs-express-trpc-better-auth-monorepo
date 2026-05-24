import { describe, expect, it } from 'bun:test'
import { renderCompletion } from '../src/lib/completions'

describe('shell completions', () => {
  it('renders bash completion with commands, presets, and package managers', () => {
    const completion = renderCompletion('bash')

    expect(completion).toContain('complete -F _arche_completion arche create-arche')
    expect(completion).toContain('solana-product')
    expect(completion).toContain('typescript-fullstack')
    expect(completion).toContain('bun pnpm npm')
    expect(completion).toContain('--preset=')
  })

  it('renders zsh completion with commands, presets, and package managers', () => {
    const completion = renderCompletion('zsh')

    expect(completion).toContain('#compdef arche create-arche')
    expect(completion).toContain('"completion"')
    expect(completion).toContain('"solana-product"')
    expect(completion).toContain('"pnpm"')
    expect(completion).toContain('--package-manager=')
  })
})
