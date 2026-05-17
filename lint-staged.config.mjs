/**
 * @filename: lint-staged.config.mjs
 * @type {import('lint-staged').Configuration}
 */
export default {
  // TypeScript/JavaScript files in apps and packages
  '(apps|packages|toolings)/**/*.{js,ts,jsx,tsx}': (files) => {
    const escapedFiles = files.map((f) => `'${f.replace(/'/g, "'\\''")}'`).join(' ')
    return [`oxlint --fix ${escapedFiles}`, `oxfmt ${escapedFiles}`]
  },

  // Markdown: format first, then lint/fix content rules
  '**/*.md': ['oxfmt', 'markdownlint-cli2 --fix'],

  // oxfmt for non-code text formats
  '**/*.{json,yml,yaml}': ['oxfmt'],

  // Prisma schema formatting
  'packages/store/prisma/schema.prisma': (file) => [`prisma format --schema ${file}`],
}
