# Context Handoff Skill — Design Spec

## Problem

AI coding agents start every session stateless. They burn tokens re-discovering
what was done, what's in progress, and where key files are. In parallel
workflows, agents have no way to signal state to each other. The result is
wasted context window (the "dumb zone"), repeated work, and lost continuity.

## Goals

1. Session continuity without resuming stale context windows.
2. Automatic state capture at session end — minimal human effort.
3. Clean session start — new agent reads compressed state, skips re-discovery.
4. Portable across any project (not tied to a specific template or framework).
5. User control over automation level (yolo vs ask).

## Non-Goals

- Replacing git (handoff complements commits, doesn't duplicate them).
- Managing AGENTS.md or project documentation structure (Phase 2).
- Enforcing research-plan-implement workflow (separate concern).
- Cross-branch state persistence (handoff is branch-local).

---

## Architecture

### Two Operations

#### Session Start (orient)

1. Check for `.context/handoff.md`.
2. If found, read and inject into agent context.
3. Agent uses handoff state to skip re-discovery and resume work.
4. If not found, proceed normally (no handoff available).

#### Session End (compact)

1. Agent introspects its session: git diff, files read/edited, decisions made,
   blockers encountered.
2. Drafts a handoff document.
3. Based on mode:
   - `yolo`: writes `.context/handoff.md` directly.
   - `ask`: shows draft to user, incorporates feedback, then writes.
4. Handoff overwrites the previous file (single source of truth, not a log).

### Flow Diagram

```text
Session N ending
    |
    +-- Agent introspects: git diff --stat, files touched, key decisions
    +-- Drafts handoff sections
    |
    +-- mode: yolo? --> Write .context/handoff.md, done
    |
    +-- mode: ask?  --> Show draft to user via AskUserQuestion
                         +-- User approves --> write
                         +-- User edits   --> incorporate, write

Session N+1 starting
    |
    +-- SessionStart hook: cat .context/handoff.md
    +-- Agent reads injected state
    +-- Skips re-discovery, starts working
```

---

## File Formats

### Handoff File: `.context/handoff.md`

```markdown
---
updated: 2026-03-15T14:30:00Z
branch: feat/notifications-router
session_name: 'notifications work'
context_used_pct: 58
---

## Done

- Added notification router: packages/trpc/src/routers/notification.ts (new)
- Registered in app router: packages/trpc/src/routers/\_app.ts:15
- Added Prisma model: packages/store/prisma/schema.prisma:89-102

## In Progress

- Client hook wiring in apps/web/trpc/client.tsx (started, not tested)

## Blocked

- Notification model needs migration: run `bun run db:migrate`

## Next

- [ ] Run migration
- [ ] Add useNotifications hook in apps/web
- [ ] Test with bun run dev

## Decisions

- Polling over WebSocket (simpler, sufficient for v1)
- Notifications per-user, not per-org

## Key Files

- packages/trpc/src/routers/notification.ts (new, 85 lines)
- packages/trpc/src/routers/\_app.ts:15
- packages/store/prisma/schema.prisma:89-102
- apps/web/trpc/client.tsx (in progress)
```

**Section Rules:**

| Section          | Required      | Purpose                                        |
| ---------------- | ------------- | ---------------------------------------------- |
| YAML frontmatter | Yes           | Machine-parseable metadata                     |
| Done             | Yes           | What was completed — files with line refs      |
| In Progress      | If applicable | Partially completed work                       |
| Blocked          | If applicable | Blockers the next session must resolve         |
| Next             | Yes           | Ordered checklist of remaining work            |
| Decisions        | If applicable | Non-obvious choices made (and why)             |
| Key Files        | Yes           | All files relevant to the task, with line refs |

**Frontmatter Fields:**

| Field              | Type               | Purpose                                       |
| ------------------ | ------------------ | --------------------------------------------- |
| `updated`          | ISO 8601 timestamp | When the handoff was written                  |
| `branch`           | string             | Current git branch                            |
| `session_name`     | string             | Human-readable session label                  |
| `context_used_pct` | number (0-100)     | Context window usage when handoff was written |

### Config File: `.context/config.yaml`

```yaml
handoff:
  mode: ask # yolo | ask — default: ask
  auto_trigger: true # true: activate on session end. false: only on /session-handoff
  include_git_diff: true # include git diff --stat in handoff — default: true
  max_key_files: 20 # cap on key files listed — default: 20
```

Config is optional. All fields have sensible defaults. If no config exists, the
skill behaves as if `mode: ask` and `auto_trigger: true`.

When `auto_trigger` is false, the skill only writes a handoff when explicitly
invoked via `/session-handoff`. It will not activate automatically at session
end. This is useful when the user only wants handoff for specific long-running
tasks, not every session.

---

## Compaction Strategy

This section codifies the compaction principles from Dex Horthy's context
engineering framework applied to the handoff workflow.

### When to Compact

| Signal                                                           | Action                            |
| ---------------------------------------------------------------- | --------------------------------- |
| Context usage > 60%                                              | Agent should consider compacting  |
| Switching tasks within a session                                 | Compact current task, start fresh |
| Session ending (user says goodbye, /clear, closes terminal)      | Write handoff                     |
| Agent hits diminishing returns (repeated corrections, confusion) | Compact immediately               |

### What to Compact (Priority Order)

1. **Key files with line numbers** — most important, enables precise resumption
2. **Decisions made and why** — prevents the next session from re-debating
3. **Blockers and gotchas** — saves the next session from hitting the same walls
4. **Next steps as ordered checklist** — directs the next session immediately
5. **What was done** — summary, not play-by-play

### What NOT to Compact

- Full file contents (the files are on disk — reference, don't copy)
- Tool call transcripts (the handoff replaces these with summaries)
- Exploratory dead ends (unless they're gotchas the next session should avoid)
- Verbose error output (summarize the error and its resolution)

### Compaction Quality Targets

- Handoff file should be **30-80 lines** (under 1k tokens)
- Each "Done" and "In Progress" item should reference **specific files:lines**
- "Next" items should be actionable without reading the conversation history
- A new agent reading only the handoff should be able to start working within
  its first 2-3 tool calls

---

## Introspection: How the Agent Builds the Handoff

The agent constructs the handoff by examining:

1. **Git state**: `git diff --stat`, `git log --oneline -5`, current branch
2. **Files touched in session**: files read, created, or edited during the
   conversation (available from the agent's own tool call history)
3. **Decisions**: extracted from the conversation — any point where the agent
   chose between alternatives or the user directed a specific approach
4. **Blockers**: any point where work stopped due to an external dependency,
   missing information, or a failing test
5. **User's stated intent**: the original task description and any refinements

The agent synthesizes these into the handoff sections. It does NOT copy raw
tool output — it compresses findings into actionable summaries.

---

## Hook Integration

### SessionStart Hook (recommended, not required)

Automatically injects the handoff into the agent's context at session start.

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

Add to `.claude/settings.local.json` or `.claude/settings.json`.

### Optional: Context Pressure via CLAUDE.md

Claude Code does not currently have a `PreCompact` hook event. To encourage
handoff writing before compaction, add this to CLAUDE.md instead:

```markdown
When context is getting heavy (>60%) or before running /compact, write your
current state to .context/handoff.md using the session-handoff skill format.
```

If a `PreCompact` hook event is added in the future, it would replace this
CLAUDE.md instruction with a deterministic trigger.

---

## Parallel Agent Considerations

When multiple agents work in separate worktrees on the same repo:

- Each worktree has its own `.context/handoff.md` (branch-local).
- Agents do not read each other's handoff files.
- When worktree work is merged back, the handoff file does not merge (it's
  gitignored).
- For orchestration across parallel agents, a separate concern (out of scope
  for Phase 1, noted for Phase 2).

---

## Portability

The skill is designed to work on any codebase:

- **No project-specific assumptions** — introspects via git and the agent's own
  session, not project docs.
- **No dependencies** — pure markdown skill, no scripts or binaries.
- **Installable globally** — copy into `.claude/skills/` or `~/.agents/skills/`.
  A package registry install path (`npx skills add`) is planned for when the
  skill is published as a standalone repo.
- **Works with any agent** — Claude Code, Cursor, Codex, or any tool that reads
  markdown skill files.

### Setup Requirements

After installing the skill, users must:

1. Add `.context/` to their project's `.gitignore` — the handoff file contains
   session-local state that should not be committed.
2. Optionally add the SessionStart hook to `.claude/settings.local.json` for
   automatic injection (see Hook Integration above).
3. Optionally create `.context/config.yaml` to customize behavior.

### Extraction as Standalone Repo

The skill source lives in `tools/session-handoff/` within this template repo
and can be extracted to its own repository:

```text
session-handoff/
  SKILL.md                    # The skill definition
  README.md                   # Usage docs for the standalone repo
  .context/
    config.yaml.example       # Config template
    handoff.md.example        # Handoff format example
  specs/
    design.md                 # Copy of this spec
```

When extracting, copy this spec file (don't symlink) so the repo is
self-contained.

---

## User Experience

### First Use

1. User installs the skill (global or per-project).
2. At end of first session, agent says:
   > "I'll write a handoff file so the next session can pick up where we left
   > off. Here's what I'm capturing: [draft]. Want me to save this?"
3. User approves or edits.
4. `.context/handoff.md` is written.
5. Skill suggests adding the SessionStart hook for automatic pickup.

### Steady State (yolo mode)

1. Session starts — hook injects handoff — agent reads it — starts working.
2. Session ends — agent writes updated handoff — no human interaction needed.
3. User can always read `.context/handoff.md` to see current state.

### Manual Override

User can always:

- Edit `.context/handoff.md` directly (it's just markdown).
- Delete it to force a fresh start.
- Switch modes in `.context/config.yaml` at any time.
- Run the skill manually mid-session to checkpoint progress.

---

## Phase 2 (Future)

- `/context-doctor`: Audit AGENTS.md duplication, suggest moves to
  `.claude/rules/`, validate `@imports`, flag CLAUDE.md bloat.
- Parallel agent state signaling (shared `.context/agents/` directory).
- Auto-trigger via custom hook at context pressure thresholds.
- Integration with research-plan-implement workflows.

---

## Success Criteria

1. A new session reading only `.context/handoff.md` starts productive work
   within 2-3 tool calls (no re-discovery).
2. Handoff file stays under 80 lines / 1k tokens.
3. Zero manual effort in yolo mode.
4. Skill works on a fresh project with no project-specific configuration.
5. Handoff quality: another human reading the file can understand what happened,
   what's next, and why.

---

## References

- Dex Horthy, "Advanced Context Engineering for Coding Agents" (2026)
- Anthropic, "Effective Harnesses for Long-Running Agents"
- Anthropic, "Best Practices for Claude Code"
- Vincent van Deth, "Context Rot in Claude Code: Automatic Rotation"
- Martin Fowler, "Context Engineering for Coding Agents"
