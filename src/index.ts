import type { Plugin, PluginInput } from "@opencode-ai/plugin";
import { managerPrompt, seniorPrompt, techleadPrompt } from "./prompts.ts";
import { orgcodeTask } from "./tools.ts";

const plugin: Plugin = async (_input: PluginInput) => {
  return {
    config: async (cfg) => {
      cfg.agent ??= {};
      cfg.agent["orgcode-manager"] = {
        mode: "primary",
        description:
          "ORGCODE manager agent that orchestrates senior and techlead agents. Use this to run the ORGCODE workflow.",
        prompt: managerPrompt,
        permission: {
          task: { "orgcode-*": "allow", "*": "deny" },
          read: "allow",
          edit: "allow",
          bash: "ask",
          glob: "allow",
          grep: "allow",
          list: "allow",
          todowrite: "allow",
        } as never,
      };
      cfg.agent["orgcode-senior"] = {
        mode: "subagent",
        hidden: true,
        description:
          "ORGCODE senior agent. Implement assigned features using TDD. Use when the manager assigns an implementation task.",
        prompt: seniorPrompt,
        permission: {
          task: "deny",
          read: "allow",
          edit: "allow",
          bash: "allow",
          glob: "allow",
          grep: "allow",
          list: "allow",
          todowrite: "allow",
        } as never,
      };
      cfg.agent["orgcode-techlead"] = {
        mode: "subagent",
        hidden: true,
        description:
          "ORGCODE techlead agent. Review code produced by the senior agent. Use when the manager assigns a review task.",
        prompt: techleadPrompt,
        permission: {
          task: "deny",
          read: "allow",
          edit: "deny",
          bash: "allow",
          glob: "allow",
          grep: "allow",
          list: "allow",
          todowrite: "allow",
        } as never,
      };

      cfg.command ??= {};
      cfg.command["orgcode"] = {
        description: "Start ORGCODE with user checkpoints",
        agent: "orgcode-manager",
        template:
          "Start ORGCODE in normal mode. Run the senior → techlead → done workflow one full task cycle at a time. After each complete task cycle, stop and ask the user whether to continue or stop. If no tasks exist in .orgcode/tasks/, ask the user what to build and create the first task.",
      };
      cfg.command["orgcode_yolo"] = {
        description: "Start ORGCODE in autonomous mode",
        agent: "orgcode-manager",
        template:
          'Start ORGCODE in yolo mode.\n\n$ARGUMENTS\n\nRun the senior → techlead → done workflow continuously. Only stop on errors, test failures, or when you need clarification. If task IDs are provided above, only run those tasks (skip missing or already-done IDs). If no IDs are provided, run all tasks with status "todo".',
      };
    },
    tool: {
      orgcode_task: orgcodeTask,
    },
  };
};

export default plugin;
