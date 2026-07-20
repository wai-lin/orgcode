import path from "node:path";
import { tool, type ToolDefinition } from "@opencode-ai/plugin";
import { createTask, getTask, listTasks, updateTask } from "./tasks.ts";

const taskStatusSchema = tool.schema.enum(["todo", "in_progress", "in_review", "done"]);

const taskAssigneeSchema = tool.schema.enum(["manager", "senior", "techlead"]);

const taskPrioritySchema = tool.schema.enum(["low", "medium", "high"]);

const taskUpdateSchema = tool.schema.object({
  id: tool.schema.string().optional(),
  title: tool.schema.string().optional(),
  status: taskStatusSchema.optional(),
  assignee: taskAssigneeSchema.optional(),
  priority: taskPrioritySchema.optional(),
  content: tool.schema.string().optional(),
});

const filterSchema = tool.schema.object({
  status: taskStatusSchema.optional(),
  assignee: taskAssigneeSchema.optional(),
});

export const orgcodeTask: ToolDefinition = tool({
  description:
    "Manage ORGCODE tasks. Use this to list, read, create, or update tasks in the tasks/ folder. Always prefer this tool over reading or editing task files directly.",
  args: {
    action: tool.schema.enum(["list", "get", "create", "update"]),
    id: tool.schema.string().optional(),
    task: taskUpdateSchema.optional(),
    filter: filterSchema.optional(),
  },
  async execute(args, context) {
    const tasksDir = path.join(context.directory, "tasks");

    try {
      switch (args.action) {
        case "list": {
          const tasks = await listTasks(tasksDir, args.filter);
          return JSON.stringify({ count: tasks.length, tasks }, null, 2);
        }
        case "get": {
          if (!args.id) return "Missing id";
          const task = await getTask(tasksDir, args.id);
          return task ? JSON.stringify({ task }, null, 2) : `Task not found: ${args.id}`;
        }
        case "create": {
          if (!args.task?.id || !args.task?.title) {
            return "Missing task.id or task.title";
          }
          const created = await createTask(tasksDir, {
            id: args.task.id,
            title: args.task.title,
            status: args.task.status ?? "todo",
            assignee: args.task.assignee,
            priority: args.task.priority,
            content: args.task.content ?? "",
          });
          return JSON.stringify({ task: created }, null, 2);
        }
        case "update": {
          if (!args.id) return "Missing id";
          const updates = args.task ?? {};
          const updated = await updateTask(tasksDir, args.id, {
            title: updates.title,
            status: updates.status,
            assignee: updates.assignee,
            priority: updates.priority,
            content: updates.content,
          });
          return JSON.stringify({ task: updated }, null, 2);
        }
      }
    } catch (error) {
      return `Error: ${error instanceof Error ? error.message : String(error)}`;
    }
  },
});
