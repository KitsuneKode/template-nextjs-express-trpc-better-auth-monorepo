import { basename, join, resolve } from 'node:path'

function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._ -]/g, '')
    .replace(/[._ ]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/** Slug for package scope / folder name (basename only — not a filesystem path). */
export function sanitizeProjectName(input: string): string {
  const normalized = slugify(basename(input))
  if (!normalized) {
    throw new Error('Project name must contain at least one alphanumeric character.')
  }
  return normalized
}

/**
 * Resolve output directory from project name and optional --dir / --output parent.
 * When `dirFlag` basename matches the slug, it is treated as the full destination path.
 */
export function resolveDestinationDir(
  projectNameInput: string,
  dirFlag?: string,
): { projectName: string; destinationDir: string } {
  const projectName = sanitizeProjectName(projectNameInput)

  if (!dirFlag) {
    return { projectName, destinationDir: resolve(process.cwd(), projectName) }
  }

  const resolved = resolve(dirFlag)
  if (basename(resolved) === projectName) {
    return { projectName, destinationDir: resolved }
  }

  return { projectName, destinationDir: join(resolved, projectName) }
}
