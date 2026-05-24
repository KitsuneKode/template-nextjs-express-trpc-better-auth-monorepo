export function renderTurboRootScripts(): Record<string, string> {
  return {
    dev: 'turbo run dev',
    build: 'turbo run build',
    typecheck: 'turbo run typecheck',
    lint: 'turbo run lint',
    test: 'turbo run test',
    fmt: 'oxfmt',
    'fmt:check': 'oxfmt --check',
  }
}
