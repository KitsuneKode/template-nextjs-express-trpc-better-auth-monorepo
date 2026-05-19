export const healthService = {
  check() {
    return { status: 'ok' as const }
  },
}
