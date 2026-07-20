# ORGCODE

ORGCODE is an opinionated multi-agent workflow plugin for [OpenCode](https://opencode.ai). It adds three specialized agents and a task tracker to your OpenCode project:

- **Manager** — plans, assigns, and orchestrates the workflow.
- **Senior** — implements features using TDD.
- **Techlead** — reviews the senior's output.

## Install

ORGCODE is published on npm. OpenCode automatically installs and loads npm plugins, so you do **not** need to clone this repo or run `npm install` yourself.

Add ORGCODE to your project's `opencode.json`:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "plugin": ["orgcode"]
}
```

Then restart OpenCode. The plugin will be downloaded and installed automatically on startup.

## Usage

In your OpenCode session:

```
/orgcode
```

Starts the workflow in **checkpoint mode**. The manager runs one full task cycle (senior → techlead → done) and then asks you whether to continue.

```
/orgcode_yolo feat-001 feat-002
```

Starts the workflow in **autonomous mode** for the given task IDs. It will skip missing or already-done tasks. If you omit the IDs, it runs every `todo` task until completion or error.

## Tasks

Tasks live in the `tasks/` directory as Markdown files with a TOML frontmatter block:

```markdown
+++
[task]
id = "feat-001"
title = "Add user authentication"
status = "todo"
assignee = "senior"
priority = "high"
+++

# Add user authentication

Implement email/password authentication.
```

Allowed `status` values: `todo`, `in_progress`, `in_review`, `done`.
Allowed `assignee` values: `manager`, `senior`, `techlead`.
Allowed `priority` values: `low`, `medium`, `high`.

Agents manage tasks through the `orgcode_task` custom tool instead of editing files directly.

## Workflow

1. Manager lists tasks and picks the next `todo` one.
2. Manager assigns it to the senior agent.
3. Senior implements the feature using TDD.
4. Manager assigns it to the techlead agent.
5. Techlead reviews and either approves or lists issues.
6. If issues are found, the task goes back to the senior.
7. Once approved, the manager marks the task as `done` and moves to the next one.

## Development

These commands are for contributors working on the ORGCODE plugin itself:

```bash
vp install
vp test
vp check
vp pack
```

## License

MIT
