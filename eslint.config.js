import { config } from '@template/eslint-config/base'

/** @type {import("eslint").Linter.Config} */
const rootConfig = [{ ignores: ['apps/**', 'packages/**', 'toolings/**', 'test/**'] }, ...config]

export default rootConfig
