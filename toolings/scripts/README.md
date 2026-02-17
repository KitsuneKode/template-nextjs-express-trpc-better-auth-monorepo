# Tooling Scripts

Utility scripts for managing the monorepo.

## rename-scope.ts

Automatically renames the package scope from `@template` to match your root package name.

### Usage

```bash
# Dry run (preview changes without modifying files)
bun run rename-scope:dry
# or
bun toolings/scripts/rename-scope.ts --dry-run

# Apply changes
bun run rename-scope

# Verbose mode (detailed logs)
bun run rename-scope:verbose

# Quiet mode (minimal output)
bun toolings/scripts/rename-scope.ts --quiet

# Show help
bun toolings/scripts/rename-scope.ts --help
```

### Options

| Flag        | Alias | Description                              |
| ----------- | ----- | ---------------------------------------- |
| `--dry-run` | `-d`  | Preview changes without modifying files  |
| `--verbose` | `-v`  | Show detailed logs of all changes        |
| `--quiet`   | `-q`  | Minimal output (errors and summary only) |
| `--help`    | `-h`  | Show help message                        |

### What it does

1. **Detects** the root `package.json` name to generate the new scope
2. **Scans** all `package.json` files and updates:
   - Package names from `@template/*` to `@yourproject/*`
   - Dependencies, devDependencies, and peerDependencies
3. **Updates** source code files:
   - Import statements across TypeScript, JavaScript, JSON, and Markdown files
   - Counts and reports all replacements
4. **Skips** build directories and node_modules

### Output Metrics

The script provides detailed metrics:

- **Package Metadata**: Number of package.json files modified
- **Packages Renamed**: List of renamed packages (verbose mode)
- **Dependencies Updated**: Number of dependency references changed
- **Source Files**: Number of files and total replacements made

### Example Output

```
════════════════════════════════════════════════════════════
📊 Change Summary
════════════════════════════════════════════════════════════
📊 Migration: "@template" → "@myproject"

📊 📦 Package Metadata (8 files)
   Modified 8 package.json file(s)

📊 🏷️  Packages Renamed (7)
   Renamed 7 package(s)

📊 🔗 Dependencies Updated (14 references)
   Updated 14 dependency reference(s)

📊 📝 Source Files (23 files, 45 replacements)
   Modified 23 source file(s)
   Replaced 45 import reference(s)

════════════════════════════════════════════════════════════
```

### Already Correct Scope

If your project already uses the correct scope, you'll see:

```
✅ Scope already correct: "@myproject"
ℹ️  No changes needed. Your project is already configured correctly.
```

### Post-execution Steps

After running the script successfully:

1. Run `bun install` to link the renamed packages
2. Run `bun run lint` to verify no import errors
3. Test your application
4. Commit your changes

### Advanced Usage

Combine flags for different output levels:

```bash
# Dry run with verbose output
bun toolings/scripts/rename-scope.ts --dry-run --verbose

# Apply changes quietly
bun toolings/scripts/rename-scope.ts --quiet
```
