/**
 * Generator barrel export
 *
 * All generators accept ProjectConfig and return string content
 * for the files they produce. The scaffold orchestrator calls them
 * and writes the output to the destination directory.
 */

export { renderDockerCompose } from './docker'
export { buildServerEnv, buildWebEnv } from './env'
export { renderGithubActionsWorkflow } from './ci'
export { renderDeploymentGuide } from './deployment'
export { applyBackendTransform } from './backend'
export { applyDatabaseTransform } from './database'
export { applyOrmTransform } from './orm'
