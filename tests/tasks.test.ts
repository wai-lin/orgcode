import fs from "node:fs/promises";
import path from "node:path";
import { expect, test } from "vite-plus/test";
import {
  createTask,
  getTask,
  listTasks,
  parseTask,
  stringifyTask,
  updateTask,
} from "../src/tasks.ts";

async function makeTasksDir() {
  const tmpDir = await fs.mkdtemp(path.join(process.env.TMPDIR ?? "/tmp", "orgcode-tasks-"));
  const tasksDir = path.join(tmpDir, "tasks");
  await fs.mkdir(tasksDir, { recursive: true });
  return tasksDir;
}

const sampleTask = `+++
[task]
id = "feat-001"
title = "Add user authentication"
status = "todo"
assignee = "senior"
priority = "high"
+++

# Add user authentication

Implement email/password authentication.
`;

test("parseTask extracts TOML frontmatter and markdown body", () => {
  const task = parseTask(sampleTask);
  expect(task.id).toBe("feat-001");
  expect(task.title).toBe("Add user authentication");
  expect(task.status).toBe("todo");
  expect(task.assignee).toBe("senior");
  expect(task.priority).toBe("high");
  expect(task.content).toContain("# Add user authentication");
  expect(task.content).toContain("Implement email/password authentication.");
});

test("parseTask handles missing frontmatter gracefully", () => {
  const content = "# No frontmatter\n\nJust a description.";
  const task = parseTask(content);
  expect(task.id).toBe("");
  expect(task.title).toBe("");
  expect(task.status).toBe("todo");
  expect(task.content).toBe(content);
});

test("stringifyTask produces TOML-in-Markdown output", () => {
  const task = {
    id: "feat-002",
    title: "Write tests",
    status: "in_progress" as const,
    assignee: "senior" as const,
    priority: "medium" as const,
    content: "# Write tests\n\nCover the task library.",
  };
  const output = stringifyTask(task);
  expect(output).toContain("+++");
  expect(output).toContain('id = "feat-002"');
  expect(output).toContain("# Write tests");
});

test("listTasks reads all tasks and filters by status", async () => {
  const tasksDir = await makeTasksDir();
  await fs.writeFile(
    path.join(tasksDir, "feat-001.md"),
    stringifyTask({
      id: "feat-001",
      title: "First task",
      status: "todo",
      content: "",
    }),
  );
  await fs.writeFile(
    path.join(tasksDir, "feat-002.md"),
    stringifyTask({
      id: "feat-002",
      title: "Second task",
      status: "done",
      content: "",
    }),
  );

  const all = await listTasks(tasksDir);
  expect(all).toHaveLength(2);

  const todo = await listTasks(tasksDir, { status: "todo" });
  expect(todo).toHaveLength(1);
  expect(todo[0].id).toBe("feat-001");
});

test("getTask returns a task by ID", async () => {
  const tasksDir = await makeTasksDir();
  await fs.writeFile(
    path.join(tasksDir, "feat-001.md"),
    stringifyTask({
      id: "feat-001",
      title: "First task",
      status: "todo",
      content: "",
    }),
  );

  const task = await getTask(tasksDir, "feat-001");
  expect(task).toBeDefined();
  expect(task?.title).toBe("First task");

  const missing = await getTask(tasksDir, "missing");
  expect(missing).toBeUndefined();
});

test("createTask writes a new task file", async () => {
  const tasksDir = await makeTasksDir();
  const task = await createTask(tasksDir, {
    id: "feat-003",
    title: "New task",
    status: "todo",
    content: "Description here.",
  });

  expect(task.id).toBe("feat-003");
  const file = await fs.readFile(path.join(tasksDir, "feat-003.md"), "utf8");
  expect(file).toContain("Description here.");
});

test("updateTask modifies an existing task", async () => {
  const tasksDir = await makeTasksDir();
  await createTask(tasksDir, {
    id: "feat-004",
    title: "Before",
    status: "todo",
    content: "Original.",
  });

  const updated = await updateTask(tasksDir, "feat-004", {
    status: "in_progress",
    assignee: "senior",
  });

  expect(updated.status).toBe("in_progress");
  expect(updated.assignee).toBe("senior");
  expect(updated.title).toBe("Before");

  const fromDisk = await getTask(tasksDir, "feat-004");
  expect(fromDisk?.status).toBe("in_progress");
});

test("updateTask throws when task does not exist", async () => {
  const tasksDir = await makeTasksDir();
  await expect(updateTask(tasksDir, "missing", { status: "done" })).rejects.toThrow();
});
