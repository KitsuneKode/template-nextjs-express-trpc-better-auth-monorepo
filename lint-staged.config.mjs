/**
 * @filename: lint-staged.config.mjs
 * @type {import('lint-staged').Configuration}
 */
export default {
  // TypeScript/JavaScript files in apps and packages
  '(apps|packages)/**/*.{js,ts,jsx,tsx}': (files) => {
    // Group files by their config path
    const filesByConfig = files.reduce((acc, file) => {
      let configPath = './eslint.config.js' // default

      if (file.startsWith('apps/web/')) {
        configPath = './apps/web/eslint.config.js'
      } else if (file.startsWith('packages/ui/')) {
        configPath = './packages/ui/eslint.config.mjs'
      }
      // Add more conditions as needed

      if (!acc[configPath]) {
        acc[configPath] = []
      }
      acc[configPath].push(file)
      return acc
    }, {})

    // Generate commands for each config group
    const commands = []

    for (const [configPath, groupedFiles] of Object.entries(filesByConfig)) {
      const escapedFiles = groupedFiles.map((f) => `'${f.replace(/'/g, "'\\''")}'`).join(' ')
      commands.push(`eslint --fix -c ${configPath} ${escapedFiles}`)
    }

    // Prettier runs on all files at once
    const escapedAllFiles = files.map((f) => `'${f.replace(/'/g, "'\\''")}'`).join(' ')
    commands.push(`prettier --write ${escapedAllFiles}`)

    return commands
  },

  // Markdown: format first, then lint/fix content rules
  '**/*.md': ['prettier --write', 'markdownlint-cli2 --fix'],

  // Prettier for non-code text formats
  '**/*.{json,yml,yaml}': ['prettier --write'],

  // Prisma schema formatting
  'packages/store/prisma/schema.prisma': (file) => [`prisma format --schema ${file}`],
}
