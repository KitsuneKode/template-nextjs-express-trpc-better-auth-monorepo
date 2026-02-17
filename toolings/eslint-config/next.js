import eslintConfigPrettier from 'eslint-config-prettier'
import pluginReactHooks from 'eslint-plugin-react-hooks'
import turboConfig from 'eslint-config-turbo/flat'
import pluginNext from '@next/eslint-plugin-next'
import { config as baseConfig } from './base.js'
import turboPlugin from 'eslint-plugin-turbo'
import pluginReact from 'eslint-plugin-react'
import tseslint from 'typescript-eslint'
import globals from 'globals'
import js from '@eslint/js'

/**
 * A custom ESLint configuration for libraries that use Next.js.
 *
 * @type {import("eslint").Linter.Config[]}
 * */
export const nextJsConfig = [
  ...baseConfig,
  ...turboConfig,
  js.configs.recommended,
  eslintConfigPrettier,

  ...tseslint.configs.recommended,
  {
    ...pluginReact.configs.flat.recommended,
    languageOptions: {
      ...pluginReact.configs.flat.recommended.languageOptions,
      globals: {
        ...globals.serviceworker,
      },
    },
  },
  {
    plugins: {
      '@next/next': pluginNext,
      turbo: turboPlugin,
    },
    rules: {
      ...pluginNext.configs.recommended.rules,
      ...pluginNext.configs['core-web-vitals'].rules,
      'turbo/no-undeclared-env-vars': 'error',
    },
  },
  {
    plugins: {
      'react-hooks': pluginReactHooks,
    },
    settings: { react: { version: 'detect' } },
    rules: {
      ...pluginReactHooks.configs.recommended.rules,
      // React scope no longer necessary with new JSX transform.
      'react/react-in-jsx-scope': 'off',
      // Disable set-state-in-effect rule as it's too strict for real-world use cases
      'react-hooks/set-state-in-effect': 'off',
    },
  },
  {
    ignores: ['.next/**', 'out/**', 'build/**', 'next-env.d.ts'],
  },
]
