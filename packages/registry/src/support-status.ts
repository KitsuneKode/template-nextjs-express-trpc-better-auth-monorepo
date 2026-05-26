export type SupportStatus = 'stable' | 'experimental' | 'requiresValidation'

export const SUPPORT_LABELS: Record<SupportStatus, string> = {
  stable: 'Stable',
  experimental: 'Experimental',
  requiresValidation: 'Requires validation',
}

export function formatSupportStatus(status: SupportStatus): string {
  return SUPPORT_LABELS[status]
}
