import { absoluteSiteUrl } from '@/lib/seo'

export type BreadcrumbItem = {
  name: string
  path: string
}

const SECTION_LABELS: Record<string, string> = {
  guides: 'Guides',
  cli: 'CLI',
  architecture: 'Stack',
  packages: 'Stack',
  operations: 'Operations',
  reference: 'Reference',
  presets: 'Presets',
}

function walkthroughSection(slug: string[]): boolean {
  const leaf = slug.at(-1) ?? ''
  return slug[0] === 'guides' && leaf.startsWith('walkthrough-')
}

/** Build docs breadcrumb trail: Home → Documentation → section → current page. */
export function buildDocsBreadcrumbs(slug: string[], title: string): BreadcrumbItem[] {
  const crumbs: BreadcrumbItem[] = [
    { name: 'Home', path: '/' },
    { name: 'Documentation', path: '/docs/getting-started' },
  ]

  if (slug.length === 0) {
    crumbs.push({ name: title, path: '/docs/getting-started' })
    return crumbs
  }

  const sectionKey = slug[0] ?? ''

  if (sectionKey === 'guides' && walkthroughSection(slug)) {
    crumbs.push({ name: 'Walkthroughs', path: '/docs/guides/walkthrough-typescript-fullstack' })
  } else if (sectionKey && SECTION_LABELS[sectionKey]) {
    const sectionPath =
      sectionKey === 'presets'
        ? '/docs/presets'
        : sectionKey === 'cli'
          ? '/docs/cli'
          : sectionKey === 'architecture'
            ? '/docs/architecture'
            : sectionKey === 'packages'
              ? '/docs/packages/auth'
              : sectionKey === 'operations'
                ? '/docs/operations/deploy'
                : sectionKey === 'reference'
                  ? '/docs/reference/links'
                  : '/docs/guides/first-hour'

    crumbs.push({ name: SECTION_LABELS[sectionKey], path: sectionPath })
  }

  const pagePath = `/docs/${slug.join('/')}`
  crumbs.push({ name: title, path: pagePath })

  return crumbs
}

export function breadcrumbListJsonLd(items: BreadcrumbItem[]) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteSiteUrl(item.path),
    })),
  }
}
