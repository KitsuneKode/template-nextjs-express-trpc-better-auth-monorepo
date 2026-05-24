# Changesets

Use Changesets only for `@arche/create` releases.

```sh
bun changeset
bun run changeset:status
bun run version:packages
```

The release workflow is intentionally dry-run/PR oriented until live npm
trusted publishing is enabled.
