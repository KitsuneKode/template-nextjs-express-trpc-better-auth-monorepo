import { basename } from 'node:path'

function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._ -]/g, '')
    .replace(/[._ ]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function sanitizeProjectName(input: string): string {
  const normalized = slugify(basename(input))
  if (!normalized) {
    throw new Error('Project name must contain at least one alphanumeric character.')
  }
  return normalized
}
