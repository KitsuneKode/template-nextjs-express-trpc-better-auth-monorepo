# session-handoff

Session continuity for AI coding agents. Write compressed state at session end,
read it at session start. No re-discovery, no wasted tokens.

## Quick Start

### Install as a Claude Code skill

```bash
# Copy into your project
cp -r tools/session-handoff/.  .claude/skills/session-handoff/

# Or install globally
cp -r tools/session-handoff/.  ~/.agents/skills/session-handoff/
```

### Add the SessionStart hook

Add to `.claude/settings.local.json`:

```json
{
  "hooks": {
    "SessionStart": [
      {
        "type": "command",
        "command": "if [ -f .context/handoff.md ]; then echo '--- PRIOR SESSION STATE ---'; cat .context/handoff.md; echo '--- END SESSION STATE ---'; else echo 'No prior session state.'; fi"
      }
    ]
  }
}
```

### Add `.context/` to `.gitignore`

```bash
echo '.context/' >> .gitignore
```

## Usage

The skill activates automatically:

- **Session start**: reads `.context/handoff.md` if it exists
- **Session end**: writes compressed state to `.context/handoff.md`
- **Mid-session**: invoke `/session-handoff` to checkpoint

## Config

Create `.context/config.yaml` to customize behavior:

```yaml
handoff:
  mode: ask # yolo (auto-write) | ask (show draft first)
  auto_trigger: true # write on session end
  include_git_diff: true # include git diff summary
  max_key_files: 20 # cap on listed files
```

Default is `mode: ask` — the agent shows you the draft before saving.
Switch to `yolo` once you trust the output.

## How It Works

**At session end**, the agent:

1. Checks git state (branch, diff, recent commits)
2. Reviews files it touched during the session
3. Extracts decisions, blockers, and next steps
4. Compresses everything into a 30-80 line handoff file

**At session start**, the agent:

1. Reads the handoff (injected by hook or read manually)
2. Skips re-discovery — knows what was done, what's next
3. Starts working from the "Next" checklist immediately

## Handoff Format

```markdown
---
updated: 2026-03-15T14:30:00Z
branch: feat/my-feature
session_name: 'feature work'
context_used_pct: 58
---

## Done

- [completed work with file:line references]

## In Progress

- [partial work and its current state]

## Blocked

- [external dependencies or failing tests]

## Next

- [ ] [ordered actionable steps]

## Decisions

- [non-obvious choices and reasoning]

## Key Files

- [all relevant files with line refs]
```

## Design Spec

See `specs/design.md` for the full design document including compaction
strategy, parallel agent considerations, and phase 2 plans.

## Portability

Works with any codebase and any AI coding agent that reads markdown skills.
No project-specific assumptions — introspects via git and the agent's own
session context.
