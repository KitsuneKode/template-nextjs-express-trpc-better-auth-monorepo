# Bootstrap CLI Notes

## Purpose

`apps/cli` contains the `create-kitsu-stack` bootstrap CLI for this template.

## Read First

- `src/index.ts`
- `src/lib/scaffold.ts`
- `README.md`

## Owns

- project bootstrap prompts
- template copy and customization flow
- generated Docker, CI, env example, and deployment guide files

## Common Tasks

- prompt or UX changes:
  `src/index.ts`
- generation logic:
  `src/lib/scaffold.ts`
- usage docs:
  `README.md`, `../../docs/bootstrap-cli.md`

## Update When

Update this file when bootstrap options, generated files, or published CLI
usage changes.
