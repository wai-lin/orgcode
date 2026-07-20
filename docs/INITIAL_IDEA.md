# ORGCODE Initial Idea

An opencode plugin or sdk extended version to have oppioniated agent behavior.

## How it works

When starting a new project, user choose ORGCODE.

The ORGCODE will create at least 3 agents:

- `senior-agent` - A senior level agent that is responsible for almost all the tasks of the project.
- `techlead-agent` - A techlead level agent that is responsible for the code review and quality control from the `senior-agent`.
- `manager-agent` - A manager level agent that is responsible for the project management tasks of the project.

### Agent Behavior

- `senior-agent`
  - Get assigned tasks from the `manager-agent`.
  - Follows the TDD process to implement the features.
  - Follows the [guideline](../AGENTS.md) to do the tasks.
- `techlead-agent`
  - Get assigned tasks from the `manager-agent`.
  - Follows the TDD process to review the code of the `senior-agent`.
  - Follows the [guideline](../AGENTS.md) to do the tasks.
- `manager-agent`
  - Define the project tasks and manage the project. Assign the tasks to the `senior-agent` and `techlead-agent`.
  - Monitor the project progress and ensure the project is on track.
  - Coordinate the communication between the agents.
  - Manage the tasks of the project in [tasks](../tasks/) folder.

### Workflow

1. `manager-agent` defines the project tasks and manage the project.
2. `manager-agent` assigns the tasks to the `senior-agent` and `techlead-agent`.
3. `senior-agent` implements the features.
4. `techlead-agent` reviews the code of the `senior-agent`.
5. `manager-agent` monitors the project progress and ensures the project is on track.
6. `manager-agent` coordinates the communication between the agents.
7. `manager-agent` manages the tasks of the project in [tasks](../tasks/) folder.
