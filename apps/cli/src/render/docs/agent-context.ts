export interface GeneratedAgentsOptions {
  projectName: string
}

export function renderGeneratedAgentsMd(options: GeneratedAgentsOptions): string {
  return `# Agent guide

Canonical guide for ${options.projectName}.

Read this file first, then the nearest local AGENTS.md for the workspace you are editing.

## Loading order

1. Use docs/README.md for public commands and user-facing docs.
2. Use .docs/README.md for internal architecture and capability context.
3. Load one task-specific .docs topic, not the whole tree.
4. Load one matching .plans/active file only for approved in-flight work.
5. Never treat .plans/archive as current behavior.

## Project rules

- Keep framework entrypoints thin.
- Keep services and use-cases framework-agnostic.
- Put persistence in repositories, queries, or DB packages/crates.
- Put validation and API contracts in DTO, schema, or contract files.
- Put permission decisions in policies.
- Put response shaping in mappers.
- Do not return raw database objects directly.
- Use PATCH for partial updates and PUT only for full replacement.

## Context hygiene

Do not add duplicate instruction directories. This project uses AGENTS.md as the canonical instruction surface.
`
}

export function renderInternalDocsIndex(): string {
  return `# Internal docs

This directory is for durable maintainer and agent context.

Do not load this whole tree by default.

## Sections

- architecture/
- capabilities/
- reference/
- decisions/
`
}

export function renderPlansIndex(): string {
  return `# Plans

Plans are for approved work, execution notes, and shipped outcomes.

## Directories

- active/
- completed/
- archive/

Never treat \`archive/\` as current behavior.
`
}
