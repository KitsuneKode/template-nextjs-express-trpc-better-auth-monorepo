export const SITE_DESIGN_COOKIE_NAME = 'useDesign2'

export type SiteDesign = 'design1' | 'design2'
export type SiteDesignNamespace = 'canonical' | 'landing'

const TRUE_FLAG_VALUES = new Set(['1', 'true', 'yes', 'on'])

export function resolveSiteDesign(value?: string | null): SiteDesign {
  if (!value) {
    return 'design1'
  }

  return TRUE_FLAG_VALUES.has(value.toLowerCase()) ? 'design2' : 'design1'
}

export function parseDesignFromCookieString(cookieString: string): SiteDesign {
  const cookiePrefix = `${SITE_DESIGN_COOKIE_NAME}=`

  for (const segment of cookieString.split(';')) {
    const trimmed = segment.trim()
    if (trimmed.startsWith(cookiePrefix)) {
      return resolveSiteDesign(trimmed.slice(cookiePrefix.length))
    }
  }

  return 'design1'
}

export function toSiteDesignCookieValue(design: SiteDesign): '0' | '1' {
  return design === 'design2' ? '1' : '0'
}
