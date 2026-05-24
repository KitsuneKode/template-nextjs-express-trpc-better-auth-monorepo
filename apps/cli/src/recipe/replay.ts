import type { Recipe } from './schema'

export function buildRecipeReplayCommand(projectName: string, recipe: Recipe): string {
  const parts = [
    'arche',
    'create',
    projectName,
    '--preset',
    recipe.preset,
    '--package-manager',
    recipe.packageManager,
  ]

  const webRuntime = recipe.runtime.web
  if (webRuntime) parts.push('--web-runtime', webRuntime)

  const authProvider = recipe.capabilities.auth?.provider
  if (typeof authProvider === 'string') parts.push('--auth', authProvider)

  const database = recipe.capabilities.database
  if (
    typeof database?.engine === 'string' &&
    typeof database.client === 'string' &&
    database.engine !== 'none'
  ) {
    parts.push('--db', `${database.engine}-${database.client}`)
  }

  const deployTarget = recipe.capabilities.deployment?.target
  if (typeof deployTarget === 'string') parts.push('--deploy', deployTarget)

  return parts.join(' ')
}
