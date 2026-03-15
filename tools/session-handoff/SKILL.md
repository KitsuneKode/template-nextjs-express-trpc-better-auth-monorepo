---
name: session-handoff
version: 0.2.0
description: Manage session continuity by writing and reading compressed handoff state between AI coding sessions. Use this skill whenever a session is starting and .context/handoff.md exists, whenever a session is ending or the user says goodbye or wraps up, when context is getting heavy and compaction would help, when the user asks to save progress or checkpoint, when switching between unrelated tasks mid-session, or when the user invokes /session-handoff. Even if the user doesn't explicitly mention handoff — if a session is ending and work was done, this skill should activate.
---

# Context Handoff

Session continuity for coding agents. Write compressed state at session end,
read it at session start. The next session skips re-discovery and starts
working immediately.

**Why this matters**: LLMs are stateless. Every new session starts from zero.
Without a handoff, agents waste 30-50% of their context window just
rediscovering what the last session already knew — files, decisions, blockers.
This skill solves that by compressing session state into a lightweight file
that the next session reads in seconds.

## When This Skill Activates

- Session start when `.context/handoff.md` exists
- Session end or when the user asks to wrap up
- When context usage is high and compaction is needed
- When the user invokes `/session-handoff` directly
- When switching between tasks within a session

## Session Start Behavior

If `.context/handoff.md` exists (injected via SessionStart hook or read
manually), use it as your primary orientation:

1. Read the handoff file.
2. Note the branch, what was done, what's in progress, and what's next.
3. Check alignment: does the handoff's `session_name` and content match what
   the user is asking you to do now? If the user's new task is unrelated to
   the handoff (e.g., handoff says "notifications work" but the user asks
   about authentication), ask: "I have a handoff from a previous session on
   [session_name]. Is this related to what you're working on, or should I
   start fresh?" This avoids wasting context on irrelevant prior state.
4. **Verify files exist** before trusting the handoff. Spot-check 1-2 files
   from "Key Files" to confirm they're present on disk. If they're missing
   (e.g., branch mismatch, uncommitted work from another worktree), tell the
   user and either switch branches or rebuild from the handoff's descriptions.
5. If files are present and aligned, start working from the "Next" checklist —
   do NOT re-explore files already documented in "Key Files" unless the handoff
   indicates uncertainty.
6. If the handoff is stale (branch doesn't match, files have changed
   significantly since `updated` timestamp), mention this to the user and
   do targeted re-discovery only on changed areas.

## Session End Behavior

When the session is ending (user says goodbye, you're about to /clear, or
context is getting heavy):

### Step 1: Read Config

Check `.context/config.yaml` for mode setting. If no config exists, default to
`mode: ask`.

### Step 2: Introspect

Gather state from:

- `git diff --stat` and `git branch --show-current`
- Files you read, created, or edited during this session
- Decisions you made (especially where you chose between alternatives)
- Blockers you hit or gotchas you discovered
- The user's original task and any refinements

### Step 3: Draft Handoff

Write a handoff document with these sections:

```markdown
---
updated: [current ISO 8601 timestamp — use the real time, not a placeholder]
branch: [current branch from git branch --show-current]
session_name: '[brief label for this work]'
context_pressure: [low | medium | high]
---

## Done

[Completed work — each item references specific files:line numbers]

## In Progress

[Partially completed work — what state it's in]

## Blocked

[External dependencies, failing tests, missing info]

## Next

- [ ] [Ordered actionable checklist]

## Decisions

[Non-obvious choices and why they were made]

## Key Files

[All files relevant to the task, with line refs where useful]
```

### Step 4: Write or Ask

- **yolo mode**: Write `.context/handoff.md` directly. Tell the user you saved
  the handoff.
- **ask mode**: Show the draft to the user. Ask if they want to modify anything.
  Incorporate feedback, then write.

## Compaction Philosophy

The handoff is a compression of truth, not a transcript. Think of it like a
teammate's sticky note: just enough to get you going, nothing more.

**Include (high signal):**

- Key files with line numbers — this is the most valuable part because it lets
  the next session jump straight to the right code without searching
- Decisions made and why — without these, the next session will re-debate the
  same choices and possibly choose differently, creating inconsistency
- Blockers and gotchas — the next session will hit the same walls without these
- Next steps as ordered checklist — gives the next session a clear starting
  point instead of asking "what should I do?"

**Exclude (noise):**

- Full file contents — the files are on disk, just reference them. Copying
  content into the handoff wastes the very tokens we're trying to save.
- Code snippets — do NOT paste code into the handoff. Reference by
  `file:line` instead. A 50-line code block in a handoff defeats the purpose
  of compaction. The one exception: a one-line type signature or API shape
  that the next session needs to know without reading the file.
- Tool call transcripts — the handoff replaces the need for these
- Exploratory dead ends — unless they're gotchas worth warning about
- Verbose error output — summarize the error and what fixed it

**Quality targets:**

- 30-80 lines (under 1k tokens) — longer handoffs defeat the purpose
- Every "Done" item has a file:line reference — vague summaries don't help
- "Next" items are actionable without reading conversation history
- A new agent reading only the handoff should start productive work within
  2-3 tool calls — that's the litmus test

## Manual Checkpoint

The user can invoke `/session-handoff` mid-session to checkpoint progress
without ending the session. This writes the handoff and the session continues.

## Config Reference

`.context/config.yaml` (optional, all fields have defaults):

```yaml
handoff:
  mode: ask # yolo | ask
  auto_trigger: true # true: activate on session end. false: only on /session-handoff
  include_git_diff: true # include git diff --stat
  max_key_files: 20 # cap on listed files
```

When `auto_trigger` is false, the skill only writes a handoff when explicitly
invoked via `/session-handoff`. It will not activate automatically at session
end. This is useful if you only want handoff for specific tasks.

## Hook Setup (Recommended)

Add to `.claude/settings.local.json` for automatic handoff injection:

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
