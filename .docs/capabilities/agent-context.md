# Agent context

Generated projects should be optimized for long-running agentic coding without
duplicating instruction surfaces or overloading context.

## Generated context layout

```text
AGENTS.md                  canonical root operating map
CLAUDE.md -> AGENTS.md     symlink, not a duplicate file

docs/                      user-facing docs
.docs/                     internal architecture, reference, decisions
.plans/                    active, completed, and archived work plans
```

Do not generate:

- `CONTEXT.md`
- `.cursor/rules/`
- `.claude/rules/`
- duplicated instruction files

## Loading rules

Root `AGENTS.md` should be short and directive:

1. Read root `AGENTS.md`.
2. Read the nearest local `AGENTS.md` for files being edited.
3. Read `docs/README.md` for user-facing commands.
4. Read `.docs/README.md` and one task-specific `.docs` topic for internal
   implementation context.
5. Read one matching `.plans/active` file only for approved in-flight work.

Never treat `.plans/archive` as current behavior.
