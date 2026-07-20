# ORGCODE

ORGCODE is an opinionated multi-agent workflow plugin for [OpenCode](https://opencode.ai). It adds three specialized agents and a task tracker to your OpenCode project:

- **Manager** — plans, assigns, and orchestrates the workflow.
- **Senior** — implements features using TDD.
- **Techlead** — reviews the senior's output.

## Quick start

1. Make sure you have a project folder with OpenCode already initialized.
2. Create or open your `opencode.json` file in the project root.
3. Add `orgcode` to the `plugin` array:

   ```json
   {
     "$schema": "https://opencode.ai/config.json",
     "plugin": ["orgcode"]
   }
   ```

4. Save the file and restart OpenCode.
5. OpenCode will automatically download and install the ORGCODE plugin from npm.
6. In your OpenCode session, type `/orgcode` to start the workflow.

No `npm install`, no cloning, no manual setup is required.

## Install

ORGCODE is published on npm. OpenCode auto-installs npm plugins, so you do not need to clone this repository or run any install command yourself.

### Step 1: add the plugin to your OpenCode config

Open `opencode.json` in your project root and add `"orgcode"` to the `plugin` array:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "plugin": ["orgcode"]
}
```

### Step 2: restart OpenCode

Quit and restart OpenCode. The plugin will be downloaded and installed automatically.

### Step 3: verify it loaded

Type `/` in the OpenCode prompt. You should see `/orgcode` and `/orgcode_yolo` in the command list.

## Usage

### Checkpoint mode

Run one full task cycle at a time and ask for confirmation before continuing:

```
/orgcode
```

### Autonomous mode

Run continuously until all tasks are done or an error occurs:

```
/orgcode_yolo
```

Run only specific tasks:

```
/orgcode_yolo feat-001 feat-002
```

Missing or already-done tasks are skipped automatically.

## Creating tasks

Before running `/orgcode`, create at least one task in the `tasks/` folder.

Tasks are Markdown files with a TOML frontmatter block:

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

Allowed values:

- `status`: `todo`, `in_progress`, `in_review`, `done`
- `assignee`: `manager`, `senior`, `techlead`
- `priority`: `low`, `medium`, `high`

Agents manage tasks through the `orgcode_task` custom tool. Do not edit task files directly unless you have to.

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
