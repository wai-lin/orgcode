import fs from "node:fs/promises";
import path from "node:path";
import { expect, test } from "vite-plus/test";
import { orgcodeTask } from "../src/tools.ts";

async function makeContext() {
  const tmpDir = await fs.mkdtemp(path.join(process.env.TMPDIR ?? "/tmp", "orgcode-tools-"));
  return {
    sessionID: "test-session",
    messageID: "test-message",
    agent: "test-agent",
    directory: tmpDir,
    worktree: tmpDir,
    abort: new AbortController().signal,
    metadata: () => {},
    ask: async () => {},
  };
}

test("orgcode_task creates and lists tasks", async () => {
  const context = await makeContext();

  const createResult = await orgcodeTask.execute(
    {
      action: "create",
      task: {
        id: "feat-001",
        title: "First task",
        status: "todo",
        content: "Description.",
      },
    },
    context,
  );

  expect(createResult).toContain("feat-001");
  expect(createResult).toContain("First task");

  const listResult = await orgcodeTask.execute({ action: "list" }, context);

  expect(listResult).toContain("feat-001");
  expect(listResult).toContain('"count": 1');
});

test("orgcode_task gets and updates tasks", async () => {
  const context = await makeContext();

  await orgcodeTask.execute(
    {
      action: "create",
      task: {
        id: "feat-002",
        title: "Second task",
        status: "todo",
      },
    },
    context,
  );

  const getResult = await orgcodeTask.execute({ action: "get", id: "feat-002" }, context);

  expect(getResult).toContain("Second task");

  const updateResult = await orgcodeTask.execute(
    {
      action: "update",
      id: "feat-002",
      task: { status: "in_progress", assignee: "senior" },
    },
    context,
  );

  expect(updateResult).toContain("in_progress");
  expect(updateResult).toContain("senior");
});

test("orgcode_task filters tasks", async () => {
  const context = await makeContext();

  await orgcodeTask.execute(
    {
      action: "create",
      task: { id: "a", title: "A", status: "todo" },
    },
    context,
  );
  await orgcodeTask.execute(
    {
      action: "create",
      task: { id: "b", title: "B", status: "done" },
    },
    context,
  );

  const result = await orgcodeTask.execute({ action: "list", filter: { status: "done" } }, context);

  expect(result).toContain("b");
  expect(result).not.toContain('"id": "a"');
});

test("orgcode_task stores tasks under .orgcode/tasks/", async () => {
  const context = await makeContext();

  await orgcodeTask.execute(
    {
      action: "create",
      task: { id: "feat-003", title: "Third task", status: "todo" },
    },
    context,
  );

  const expectedPath = path.join(context.directory, ".orgcode", "tasks", "feat-003.md");
  const file = await fs.readFile(expectedPath, "utf8");
  expect(file).toContain("Third task");
});

test("orgcode_task reports missing tasks", async () => {
  const context = await makeContext();
  const result = await orgcodeTask.execute({ action: "get", id: "missing" }, context);
  expect(result).toContain("Task not found");
});
