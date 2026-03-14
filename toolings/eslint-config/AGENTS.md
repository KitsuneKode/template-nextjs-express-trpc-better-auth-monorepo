# ESLint Config Notes

## Purpose

`toolings/eslint-config` provides the shared flat ESLint presets used across the
workspace.

## Read First

- `package.json`
- `base.js`
- `backend.js`
- `next.js`
- `react-internal.js`

## Owns

- shared base lint rules
- backend-focused lint rules
- Next.js lint preset exported as `./next-js`
- internal React library lint rules

## Common Tasks

- add global lint rules:
  `base.js`
- change backend package linting:
  `backend.js`
- change Next.js app linting:
  `next.js`
- change shared UI/library linting:
  `react-internal.js`

## Update When

Update this file when exports, preset names, or shared lint behavior change.
