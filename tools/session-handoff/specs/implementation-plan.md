# Session Handoff — Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development
> (if subagents available) or superpowers:executing-plans to implement this plan.
> Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Validate, iterate, and ship the session-handoff skill so it reliably
produces high-quality handoff files across diverse coding scenarios.

**Architecture:** This is a markdown-only skill — no source code to compile.
"Implementation" means running the skill-creator eval loop to test the skill's
behavior when used by an agent, iterating on SKILL.md based on results, then
optimizing the description for LLM triggering accuracy.

**Tech Stack:** skill-creator eval framework, Claude Code, markdown

**Spec:** `tools/session-handoff/specs/design.md`

---

## Chunk 1: Phase 1 — Eval Setup and Test Prompts

### Task 1: Create eval directory and test prompts

**Files:**

- Create: `tools/session-handoff/evals/evals.json`

- [ ] **Step 1: Write test prompts**

Create `evals/evals.json` with 3 realistic test prompts that exercise the
skill's two main operations (session-end compaction and session-start
orientation). These should be the kind of thing a real user would say:

```json
{
  "skill_name": "session-handoff",
  "evals": [
    {
      "id": 1,
      "prompt": "I've been working on adding a new tRPC router for user preferences in packages/trpc/src/routers/preferences.ts. I also updated the app router in _app.ts and added a Prisma model. I'm done for today — save my progress so I can pick up tomorrow.",
      "expected_output": "A .context/handoff.md file with Done section listing the files touched with line references, a Next section with remaining work, and a Key Files section. Should be 30-80 lines, under 1k tokens.",
      "files": [],
      "expectations": [
        "Creates .context/handoff.md",
        "Handoff has YAML frontmatter with updated, branch, session_name fields",
        "Done section references specific files with line numbers",
        "Next section contains actionable checklist items",
        "Key Files section lists all relevant files",
        "Total handoff is under 80 lines"
      ]
    },
    {
      "id": 2,
      "prompt": "Continue from where I left off. I want to keep working on the preferences feature.",
      "expected_output": "Agent reads .context/handoff.md, identifies the task, and starts working from the Next checklist without re-exploring files already documented in Key Files. Should NOT run broad codebase searches.",
      "files": [".context/handoff.md"],
      "expectations": [
        "Reads .context/handoff.md as first action",
        "References the session_name from the handoff",
        "Starts from the Next checklist items",
        "Does NOT run broad grep/glob searches for files already in Key Files",
        "Mentions the branch from the handoff"
      ]
    },
    {
      "id": 3,
      "prompt": "I've been debugging a memory leak in the Redis connection pool for the last hour. Hit a wall — the leak only reproduces under load and I can't figure out the connection lifecycle. I need to stop and come back to this later with fresh eyes. Save where I am.",
      "expected_output": "A handoff that captures the debugging state: what was tried, what didn't work (as gotchas), the specific files involved, and clear next steps for resuming the investigation.",
      "files": [],
      "expectations": [
        "Creates .context/handoff.md",
        "Blocked section describes the reproduction issue",
        "Decisions section captures debugging approaches tried",
        "Key Files section includes Redis-related files",
        "Next section has specific investigation steps, not vague 'continue debugging'"
      ]
    }
  ]
}
```

- [ ] **Step 2: Verify JSON is valid**

Run: `cat tools/session-handoff/evals/evals.json | python3 -m json.tool > /dev/null`
Expected: no output (valid JSON)

- [ ] **Step 3: Commit**

```bash
cd tools/session-handoff
git add evals/evals.json
git commit -m "test: add initial eval prompts for skill validation"
```

---

### Task 2: Run eval loop — with-skill vs baseline

**Files:**

- Create: `tools/session-handoff-workspace/iteration-1/` (eval output directory)

This follows the skill-creator's eval process exactly.

- [ ] **Step 1: Create workspace directory**

```bash
mkdir -p tools/session-handoff-workspace/iteration-1
```

- [ ] **Step 2: Spawn all test runs in parallel**

For each of the 3 eval prompts, spawn TWO subagents in the same turn:

**With-skill run** (for each eval):

```text
Execute this task:
- Skill path: tools/session-handoff/SKILL.md
- Task: <eval prompt from evals.json>
- Input files: <eval files if any>
- Save outputs to: tools/session-handoff-workspace/iteration-1/eval-<ID>/with_skill/outputs/
- Outputs to save: the .context/handoff.md file if created, and a transcript summary
```

**Baseline run** (same prompt, no skill):

```text
Execute this task:
- Task: <same eval prompt>
- No skill loaded
- Save outputs to: tools/session-handoff-workspace/iteration-1/eval-<ID>/without_skill/outputs/
- Outputs to save: any .context/handoff.md file if created, and a transcript summary
```

- [ ] **Step 3: Write eval_metadata.json for each eval**

For each eval directory, create:

```json
{
  "eval_id": 1,
  "eval_name": "session-end-feature-work",
  "prompt": "<the prompt>",
  "assertions": []
}
```

- [ ] **Step 4: Draft assertions while runs are in progress**

Review the expectations from `evals.json` and draft verifiable assertions for
each eval. Update the `eval_metadata.json` files and `evals/evals.json` with
the refined assertions.

- [ ] **Step 5: Capture timing data as runs complete**

As each subagent completes, save `timing.json` with `total_tokens`,
`duration_ms`, and `total_duration_seconds`.

---

### Task 3: Grade, aggregate, and review

- [ ] **Step 1: Grade each run**

Spawn a grader subagent (read `~/.agents/skills/skill-creator/agents/grader.md`)
that evaluates assertions against outputs. Save `grading.json` in each run
directory using the exact schema from
`~/.agents/skills/skill-creator/references/schemas.md`.

- [ ] **Step 2: Aggregate benchmark**

```bash
python -m scripts.aggregate_benchmark \
  tools/session-handoff-workspace/iteration-1 \
  --skill-name session-handoff
```

Run from `~/.agents/skills/skill-creator/`.

- [ ] **Step 3: Run analyzer pass**

Read `~/.agents/skills/skill-creator/agents/analyzer.md` and surface patterns
the aggregate stats might hide.

- [ ] **Step 4: Launch eval viewer**

```bash
nohup python ~/.agents/skills/skill-creator/eval-viewer/generate_review.py \
  tools/session-handoff-workspace/iteration-1 \
  --skill-name "session-handoff" \
  --benchmark tools/session-handoff-workspace/iteration-1/benchmark.json \
  > /dev/null 2>&1 &
```

- [ ] **Step 5: User reviews results in browser**

Present: "Results are in your browser. Two tabs — 'Outputs' for qualitative
review, 'Benchmark' for quantitative comparison. Come back when done."

- [ ] **Step 6: Read feedback.json and plan improvements**

Read the feedback, identify patterns, and plan SKILL.md improvements.

---

## Chunk 2: Phase 1 — Iterate and Optimize

### Task 4: Iterate on SKILL.md based on eval feedback

**Files:**

- Modify: `tools/session-handoff/SKILL.md`

- [ ] **Step 1: Apply improvements to SKILL.md**

Based on feedback from Task 3, improve the skill. Follow skill-creator's
guidance: generalize from feedback (don't overfit to test cases), keep the
prompt lean, explain the WHY.

- [ ] **Step 2: Re-run all test cases into iteration-2/**

Spawn all 6 runs (3 with-skill, 3 without-skill) into
`tools/session-handoff-workspace/iteration-2/`.

- [ ] **Step 3: Grade, aggregate, launch viewer with --previous-workspace**

```bash
nohup python ~/.agents/skills/skill-creator/eval-viewer/generate_review.py \
  tools/session-handoff-workspace/iteration-2 \
  --skill-name "session-handoff" \
  --benchmark tools/session-handoff-workspace/iteration-2/benchmark.json \
  --previous-workspace tools/session-handoff-workspace/iteration-1 \
  > /dev/null 2>&1 &
```

- [ ] **Step 4: User reviews, repeat until satisfied**

Keep iterating until feedback is all empty or user says they're happy.
Max 5 iterations.

- [ ] **Step 5: Commit final SKILL.md**

```bash
cd tools/session-handoff
git add SKILL.md
git commit -m "feat: improve skill based on eval feedback (iteration N)"
```

---

### Task 5: Optimize description for triggering accuracy

**Files:**

- Modify: `tools/session-handoff/SKILL.md` (frontmatter description)
- Create: `tools/session-handoff/evals/trigger-evals.json`

- [ ] **Step 1: Generate 20 trigger eval queries**

Create a mix of 10 should-trigger and 10 should-not-trigger queries. Focus on
edge cases per skill-creator guidance. Save to `evals/trigger-evals.json`.

Should-trigger examples (substantive, realistic):

```json
{
  "query": "ok I'm done for the day, been working on the payment integration for the last 3 hours. made good progress on the stripe webhook handler in src/webhooks/stripe.ts but still need to wire up the frontend. save my state somehow",
  "should_trigger": true
}
```

Should-not-trigger examples (near-misses):

```json
{
  "query": "I need to refactor how we handle context in the React app — the useContext provider in src/providers is getting messy",
  "should_trigger": false
}
```

- [ ] **Step 2: Review trigger evals with user**

Use the HTML template from
`~/.agents/skills/skill-creator/assets/eval_review.html` to present the eval
set for user review.

- [ ] **Step 3: Run description optimization loop**

```bash
python -m scripts.run_loop \
  --eval-set tools/session-handoff/evals/trigger-evals.json \
  --skill-path tools/session-handoff \
  --model claude-opus-4-6 \
  --max-iterations 5 \
  --verbose
```

Run from `~/.agents/skills/skill-creator/`.

- [ ] **Step 4: Apply best description**

Update SKILL.md frontmatter with the `best_description` from the optimization
output.

- [ ] **Step 5: Commit**

```bash
cd tools/session-handoff
git add SKILL.md evals/
git commit -m "feat: optimize description for triggering accuracy"
```

---

### Task 6: Distribution setup

**Files:**

- Modify: `tools/session-handoff/README.md`

- [ ] **Step 1: Package the skill**

```bash
python ~/.agents/skills/skill-creator/scripts/package_skill.py \
  tools/session-handoff
```

This creates a `.skill` file for distribution.

- [ ] **Step 2: Update README with install instructions**

Add the `npx skills add` command once the skill is published to a GitHub repo.
For now, update the README to clarify the manual install path works from
anywhere (not just the template repo).

- [ ] **Step 3: Install globally for testing**

```bash
cp -r tools/session-handoff/. ~/.agents/skills/session-handoff/
```

Verify the skill appears and triggers in a fresh Claude Code session on a
different project.

- [ ] **Step 4: Commit and tag**

```bash
cd tools/session-handoff
git add -A
git commit -m "chore: prepare v0.1.0 for distribution"
git tag v0.1.0
```

Also commit in parent repo:

```bash
cd /home/kitsunekode/Projects/templates/template-nextjs-express-trpc-bettera-auth-monorepo
git add tools/session-handoff/
git commit -m "feat(tools): session-handoff v0.1.0 ready for distribution"
```

---

## Chunk 3: Phase 2 — Context Doctor Skill

### Task 7: Design context-doctor skill

**Files:**

- Create: `tools/context-doctor/SKILL.md`
- Create: `tools/context-doctor/specs/design.md`

- [ ] **Step 1: Create skill directory**

```bash
mkdir -p tools/context-doctor/specs
```

- [ ] **Step 2: Write SKILL.md for context-doctor**

The context-doctor skill audits a project's documentation structure for context
engineering best practices. It should:

1. **Detect AGENTS.md duplication** — find facts repeated across multiple
   AGENTS.md files and suggest consolidating to a single source of truth.
2. **Suggest `.claude/rules/` migration** — identify content in AGENTS.md or
   CLAUDE.md that should be path-scoped rules instead of always-loaded context.
3. **Flag CLAUDE.md bloat** — warn when CLAUDE.md exceeds recommended size
   (~50 lines) and suggest what to move out.
4. **Validate `@imports`** — check that `@path/to/file` references in CLAUDE.md
   point to real files.
5. **Check `.context/` setup** — verify `.context/` is gitignored, suggest
   SessionStart hook if not configured.

```markdown
---
name: context-doctor
version: 0.1.0
description: Audit project documentation for context engineering best practices.
  Use when the user asks about documentation quality, when AGENTS.md or CLAUDE.md
  feels bloated or duplicated, when setting up a new project's agent documentation,
  or when the user wants to optimize their context window usage. Also use when the
  user says things like "my agent keeps reading too many files" or "context is
  getting wasted on docs" or "how should I structure my CLAUDE.md".
---
```

- [ ] **Step 3: Write specs/design.md**

Document the audit checks, output format (report with findings + suggestions),
and how it integrates with session-handoff.

- [ ] **Step 4: Commit**

```bash
cd tools/context-doctor
git init
git add -A
git commit -m "feat: initial context-doctor skill with audit checks"
```

---

### Task 8: Implement context-doctor audit logic

**Files:**

- Create: `tools/context-doctor/scripts/audit.sh`
- Modify: `tools/context-doctor/SKILL.md`

The skill is markdown-driven but includes a helper script for deterministic
checks that don't need LLM judgment.

- [ ] **Step 1: Write audit.sh**

A bash script that performs the mechanical checks:

```bash
#!/usr/bin/env bash
# context-doctor audit script
# Run from project root: bash .claude/skills/context-doctor/scripts/audit.sh

set -euo pipefail

echo "=== Context Doctor Audit ==="
echo ""

# Check 1: CLAUDE.md line count
if [ -f CLAUDE.md ]; then
  lines=$(wc -l < CLAUDE.md)
  if [ "$lines" -gt 50 ]; then
    echo "WARNING: CLAUDE.md is $lines lines (recommended: <50)"
  else
    echo "OK: CLAUDE.md is $lines lines"
  fi
else
  echo "INFO: No CLAUDE.md found"
fi

# Check 2: @import validation
if [ -f CLAUDE.md ]; then
  grep -oP '@[^\s]+\.(md|txt|json)' CLAUDE.md 2>/dev/null | while read -r ref; do
    path="${ref#@}"
    path="${path/#\~/$HOME}"
    if [ ! -f "$path" ]; then
      echo "BROKEN: @import '$ref' points to missing file"
    fi
  done
fi

# Check 3: .context/ gitignore check
if [ -f .gitignore ]; then
  if grep -q '.context' .gitignore 2>/dev/null; then
    echo "OK: .context/ is gitignored"
  else
    echo "MISSING: .context/ is not in .gitignore"
  fi
fi

# Check 4: Count AGENTS.md files
agents_count=$(find . -name 'AGENTS.md' -not -path './.git/*' | wc -l)
echo "INFO: Found $agents_count AGENTS.md files"

# Check 5: Find duplicated content across AGENTS.md files
echo ""
echo "=== Duplication Check ==="
find . -name 'AGENTS.md' -not -path './.git/*' -exec grep -l 'stub\|scaffold\|placeholder' {} \;
```

- [ ] **Step 2: Make script executable**

```bash
chmod +x tools/context-doctor/scripts/audit.sh
```

- [ ] **Step 3: Update SKILL.md to reference the script**

Add a section telling the agent to run the audit script first for mechanical
checks, then use LLM judgment for semantic analysis (dedup detection, migration
suggestions).

- [ ] **Step 4: Commit**

```bash
cd tools/context-doctor
git add -A
git commit -m "feat: add audit script for mechanical checks"
```

---

### Task 9: Test context-doctor on this template repo

**Files:**

- Create: `tools/context-doctor/evals/evals.json`

- [ ] **Step 1: Write test prompts**

```json
{
  "skill_name": "context-doctor",
  "evals": [
    {
      "id": 1,
      "prompt": "Audit this repo's documentation structure. Are there any issues with my AGENTS.md files or CLAUDE.md?",
      "expected_output": "Report identifying duplication across AGENTS.md files, CLAUDE.md size assessment, and actionable suggestions for improvement.",
      "files": [],
      "expectations": [
        "Runs the audit.sh script",
        "Identifies duplicated facts across AGENTS.md files",
        "Assesses CLAUDE.md size and content",
        "Suggests specific content to move to .claude/rules/",
        "Checks @import references are valid"
      ]
    }
  ]
}
```

- [ ] **Step 2: Run the eval manually on this repo**

Invoke the skill on this template repo and check the output against the
known duplication issues identified during brainstorming (e.g., "worker is
a stub" appearing in 5 files, template surface list in 5 files).

- [ ] **Step 3: Iterate on SKILL.md based on results**

- [ ] **Step 4: Commit**

```bash
cd tools/context-doctor
git add -A
git commit -m "test: validate context-doctor against template repo"
```

---

### Task 10: Apply context-doctor recommendations to this repo

**Files:**

- Modify: `CLAUDE.md`
- Modify: `AGENTS.md`
- Create: `.claude/rules/` (path-scoped rules as needed)
- Modify: Various workspace `AGENTS.md` files (dedup)

- [ ] **Step 1: Run context-doctor audit**

Run the audit and collect the full report.

- [ ] **Step 2: Deduplicate AGENTS.md files**

For each duplicated fact (identified during brainstorming):

- "worker is a stub" — keep only in `apps/worker/AGENTS.md` and root `AGENTS.md`
- Template surface list — keep only in `docs/start-fresh.md` and
  `apps/web/AGENTS.md`, reference from elsewhere
- Read order — keep only in `CLAUDE.md`, remove from `AGENTS.md` and
  `docs/README.md`

- [ ] **Step 3: Merge docs/README.md into root AGENTS.md**

Move commands, env names, and commit convention from `docs/README.md` into
root `AGENTS.md` (single source of truth per hybrid approach).

- [ ] **Step 4: Create path-scoped rules**

Move workspace-specific guidance into `.claude/rules/`:

```markdown
# .claude/rules/trpc-work.md

---

## paths: ["packages/trpc/**", "apps/server/src/app.ts"]

tRPC routers live in packages/trpc/src/routers/.
Context resolves in src/trpc.ts from Better Auth session + Prisma.
Each router is a separate file, imported in src/routers/\_app.ts.
```

- [ ] **Step 5: Slim down CLAUDE.md**

Add `.context/handoff.md` reference and compaction guidance. Keep it under
20 lines.

- [ ] **Step 6: Run repo:doctor to verify no doc drift**

```bash
bun run repo:doctor
```

- [ ] **Step 7: Commit**

```bash
git add CLAUDE.md AGENTS.md .claude/rules/ docs/ apps/ packages/ toolings/ tests/
git commit -m "refactor(docs): deduplicate AGENTS.md, apply context-doctor recommendations"
```

---

## Chunk 4: Phase 2 — Finalize and Ship

### Task 11: Final validation and commit

- [ ] **Step 1: Install session-handoff globally**

```bash
cp -r tools/session-handoff/. ~/.agents/skills/session-handoff/
```

- [ ] **Step 2: Test on a fresh project**

Open a new Claude Code session on a different project directory. Do some work.
Say "save my progress." Verify the skill triggers and writes a valid handoff.
Start a new session. Verify the handoff is read and the agent picks up
correctly.

- [ ] **Step 3: Test context-doctor on a fresh project**

Run context-doctor on a project that has no AGENTS.md files. Verify it
provides useful setup suggestions rather than just "no issues found."

- [ ] **Step 4: Tag and commit both skill repos**

```bash
cd tools/session-handoff && git tag v0.1.0
cd tools/context-doctor && git tag v0.1.0
```

- [ ] **Step 5: Final parent repo commit**

```bash
git add tools/ CLAUDE.md AGENTS.md .claude/ docs/
git commit -m "feat: session-handoff v0.1.0 and context-doctor v0.1.0"
```
