const WORDS_PER_MINUTE = 200

export function countWords(text: string): number {
  return text
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/[#>*_`[\]()]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .filter(Boolean).length
}

export function formatReadingTime(wordCount: number): string {
  const minutes = Math.max(1, Math.ceil(wordCount / WORDS_PER_MINUTE))
  return `${minutes} min read`
}

export function readingTimeFromText(...parts: (string | undefined)[]): string {
  const combined = parts.filter(Boolean).join(' ')
  return formatReadingTime(countWords(combined))
}
