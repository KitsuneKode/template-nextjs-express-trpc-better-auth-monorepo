import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { homedir } from 'node:os'
import { join } from 'node:path'

export interface HistoryEntry {
  timestamp: string
  projectName: string
  destinationDir: string
  family: string
  backend: string
  database: string
  orm: string
  reproducible: string
}

const HISTORY_DIR = join(homedir(), '.kitsu')
const HISTORY_FILE = join(HISTORY_DIR, 'history.json')

function ensureHistoryDir(): void {
  if (!existsSync(HISTORY_DIR)) {
    mkdirSync(HISTORY_DIR, { recursive: true })
  }
}

function readHistory(): HistoryEntry[] {
  ensureHistoryDir()
  if (!existsSync(HISTORY_FILE)) return []
  try {
    const raw = readFileSync(HISTORY_FILE, 'utf8')
    return JSON.parse(raw) as HistoryEntry[]
  } catch {
    return []
  }
}

function writeHistory(entries: HistoryEntry[]): void {
  ensureHistoryDir()
  writeFileSync(HISTORY_FILE, JSON.stringify(entries, null, 2) + '\n')
}

/** Record a scaffold in the local history store */
export function recordHistory(entry: HistoryEntry): void {
  const entries = readHistory()
  entries.unshift(entry)
  // Keep last 50 entries
  writeHistory(entries.slice(0, 50))
}

/** Get recent scaffold history */
export function getHistory(limit = 10): HistoryEntry[] {
  return readHistory().slice(0, limit)
}

/** Print history to stdout */
export function printHistory(limit = 10): void {
  const entries = getHistory(limit)
  if (entries.length === 0) {
    console.log('No scaffold history found.')
    return
  }
  console.log(`Recent scaffolds (last ${entries.length}):\n`)
  for (const entry of entries) {
    console.log(
      `  ${entry.timestamp.slice(0, 10)} ${entry.projectName.padEnd(20)} ${entry.family.padEnd(10)} ${entry.reproducible}`,
    )
  }
}
