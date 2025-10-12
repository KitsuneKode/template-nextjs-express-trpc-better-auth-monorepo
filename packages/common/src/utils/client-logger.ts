const clientTag = '[template-client]'

type LogLevel = 'error' | 'warn' | 'info' | 'debug'

export interface LoggerType {
  error: (...args: unknown[]) => void
  warn: (...args: unknown[]) => void
  info: (...args: unknown[]) => void
  debug: (...args: unknown[]) => void
}

function formatMessage(level: LogLevel, ...args: unknown[]) {
  const timestamp = new Date().toISOString()
  const colorMap: Record<LogLevel, string> = {
    error: 'color: red;',
    warn: 'color: orange;',
    info: 'color: cyan;',
    debug: 'color: gray;',
  }

  // Add color to the level + timestamp in browser console
  const header = `%c${clientTag} [${level.toUpperCase()}] [${timestamp}]`
  const style = colorMap[level]

  // Browser consoles support formatting like console.log("%cHello", "color: red")
  return [header, style, ...args]
}

export const clientLogger: LoggerType = {
  error: (...args) => console.error(...formatMessage('error', ...args)),
  warn: (...args) => console.warn(...formatMessage('warn', ...args)),
  info: (...args) => console.info(...formatMessage('info', ...args)),
  debug: (...args) => console.debug(...formatMessage('debug', ...args)),
}
