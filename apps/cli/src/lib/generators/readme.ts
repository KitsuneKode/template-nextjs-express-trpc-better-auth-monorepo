import type { ProjectConfig } from '../../types/schemas'
import { sanitizeProjectName } from '../slug'

function quickStart(config: ProjectConfig): string {
  if (config.family === 'rust') {
    return 'cp .env.example .env\ncargo run'
  }
  return 'bun install\nbun dev'
}

export function buildReadme(config: ProjectConfig): string {
  const name = sanitizeProjectName(config.projectName)
  const preset = config.preset ?? config.family

  return `# ${name}

Scaffolded with [@arche/create](https://github.com/KitsuneKode/arche) (\`${preset}\`).

## Quick start

\`\`\`bash
${quickStart(config)}
\`\`\`

## Commands

| Command | Description |
| ------- | ----------- |
| \`bun dev\` | Start development (or \`cargo run\` for Rust-only) |
| \`bun run build\` | Build all packages |
| \`bun run lint\` | Lint |
| \`bun run check-types\` | Typecheck |

## Project context

- \`AGENTS.md\` — agent entrypoint
- \`.docs/architecture/generated-project.md\` — architecture notes
- \`arche.json\` — scaffold choices and replay command

${config.includeShowcase && config.family === 'fullstack' ? 'Fill in `SHOWCASE.mdx` when you are ready for portfolio sync.\n' : ''}`
}
