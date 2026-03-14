# Context Maintenance

These docs are for fast agent navigation. Keep them small, current, and
path-heavy.

## What To Update

Update the nearest local `AGENTS.md` when any of these change:

- entry files
- public route mounts
- exported subpaths
- workspace ownership
- required commands
- cleanup guidance
- important new folders worth reading first

Update a shared doc in `docs/` only when the change crosses workspace
boundaries or changes the recommended navigation path.

## How To Write Updates

- Prefer exact paths over prose.
- Prefer bullets over long paragraphs.
- State the current truth, not a change log.
- Replace stale instructions instead of appending history.
- Keep local files focused on the workspace in front of the agent.

## Local AGENTS.md Shape

Each workspace `AGENTS.md` should stay short and usually include:

- what the workspace owns
- read-first files
- common tasks
- cleanup notes if the workspace still contains template-only content
- when this file must be updated

## Multi-Agent Handoff

- If a change stays inside one workspace, update only that local `AGENTS.md`.
- If a change affects more than one workspace, update the local file and the
  relevant shared doc in `docs/`.
- Do not keep running task diaries in these files.
- If a workspace is mostly scaffold or placeholder code, say that directly.

## Anti-Patterns

- Do not mirror the entire repo tree.
- Do not duplicate long shared explanations across many files.
- Do not copy secrets or local `.env` values into docs.
- Do not leave removed paths in routing notes.
