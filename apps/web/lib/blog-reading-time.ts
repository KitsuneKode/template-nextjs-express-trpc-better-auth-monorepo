import fs from 'node:fs'
import path from 'node:path'

import { countWords, formatReadingTime } from '@/lib/reading-time'

export function readingTimeForBlogSlug(slug: string): string {
  const filePath = path.join(process.cwd(), 'content/blog', `${slug}.mdx`)
  try {
    const raw = fs.readFileSync(filePath, 'utf8')
    const body = raw.replace(/^---[\s\S]*?---\n?/, '')
    return formatReadingTime(countWords(body))
  } catch {
    return '5 min read'
  }
}
