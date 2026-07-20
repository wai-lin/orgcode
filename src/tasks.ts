import fs from "node:fs/promises";
import path from "node:path";
import * as toml from "smol-toml";

export type TaskStatus = "todo" | "in_progress" | "in_review" | "done";
export type TaskAssignee = "manager" | "senior" | "techlead";
export type TaskPriority = "low" | "medium" | "high";

export interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  assignee?: TaskAssignee;
  priority?: TaskPriority;
  content: string;
}

export interface TaskFilter {
  status?: TaskStatus;
  assignee?: TaskAssignee;
}

export function parseTask(raw: string): Task {
  const lines = raw.split("\n");
  let frontmatterStart = -1;
  let frontmatterEnd = -1;

  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trim();
    if (trimmed === "+++") {
      if (frontmatterStart === -1) {
        frontmatterStart = i;
      } else {
        frontmatterEnd = i;
        break;
      }
    }
  }

  const defaults: Task = {
    id: "",
    title: "",
    status: "todo",
    content: raw,
  };

  if (frontmatterStart === -1 || frontmatterEnd === -1) {
    return defaults;
  }

  const tomlLines = lines.slice(frontmatterStart + 1, frontmatterEnd);
  const bodyLines = lines.slice(frontmatterEnd + 1);
  const body = bodyLines.join("\n").replace(/^\n+/, "");

  try {
    const parsed = toml.parse(tomlLines.join("\n")) as { task?: Partial<Task> };
    const meta = parsed.task ?? {};
    return {
      ...defaults,
      ...meta,
      content: body,
    };
  } catch {
    return defaults;
  }
}

export function stringifyTask(task: Task): string {
  const meta: Partial<Task> = { ...task };
  delete meta.content;

  const frontmatter = toml.stringify({ task: meta });
  const body = task.content.trim();

  return `+++\n${frontmatter}+++\n\n${body}\n`;
}

export async function listTasks(tasksDir: string, filter?: TaskFilter): Promise<Task[]> {
  const entries = await fs.readdir(tasksDir, { withFileTypes: true });
  const files = entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".md"))
    .map((entry) => entry.name);

  const tasks: Task[] = [];
  for (const file of files) {
    const raw = await fs.readFile(path.join(tasksDir, file), "utf8");
    const task = parseTask(raw);
    if (task.id && task.id === path.basename(file, ".md")) {
      tasks.push(task);
    } else if (!task.id) {
      task.id = path.basename(file, ".md");
      tasks.push(task);
    }
  }

  return tasks.filter((task) => {
    if (filter?.status && task.status !== filter.status) return false;
    if (filter?.assignee && task.assignee !== filter.assignee) return false;
    return true;
  });
}

export async function getTask(tasksDir: string, id: string): Promise<Task | undefined> {
  try {
    const raw = await fs.readFile(path.join(tasksDir, `${id}.md`), "utf8");
    const task = parseTask(raw);
    return { ...task, id };
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "ENOENT") {
      return undefined;
    }
    throw error;
  }
}

export async function createTask(
  tasksDir: string,
  task: Omit<Task, "content"> & { content?: string },
): Promise<Task> {
  const full: Task = {
    content: "",
    ...task,
  };
  await fs.mkdir(tasksDir, { recursive: true });
  await fs.writeFile(path.join(tasksDir, `${full.id}.md`), stringifyTask(full));
  return full;
}

export async function updateTask(
  tasksDir: string,
  id: string,
  updates: Partial<Omit<Task, "id">>,
): Promise<Task> {
  const existing = await getTask(tasksDir, id);
  if (!existing) {
    throw new Error(`Task not found: ${id}`);
  }

  const definedUpdates: Partial<Omit<Task, "id">> = {};
  for (const [key, value] of Object.entries(updates)) {
    if (value !== undefined) {
      definedUpdates[key as keyof Omit<Task, "id">] = value as never;
    }
  }

  const updated: Task = { ...existing, ...definedUpdates, id };
  await fs.writeFile(path.join(tasksDir, `${id}.md`), stringifyTask(updated));
  return updated;
}
