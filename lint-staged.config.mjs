/**
 * @filename: lint-staged.config.mjs
 * @type {import('lint-staged').Configuration}
 */
export default {
  '(apps|packages|toolings)/**/*.{js,ts,jsx,tsx}': (files) => {
    const escapedFiles = files.map((f) => `'${f.replace(/'/g, "'\\''")}'`).join(' ')
    return [`oxlint --fix ${escapedFiles}`, `oxfmt ${escapedFiles}`]
  },

  '**/*.md': ['oxfmt'],

  '**/*.{json,yml,yaml}': ['oxfmt'],

  'packages/store/prisma/schema.prisma': (file) => [`prisma format --schema ${file}`],
}
