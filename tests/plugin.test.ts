import { expect, test } from "vite-plus/test";
import type { Config, PluginInput } from "@opencode-ai/plugin";
import plugin from "../src/index.ts";

function makePluginInput(): PluginInput {
  return {
    client: {} as never,
    project: {} as never,
    directory: "/tmp/test",
    worktree: "/tmp/test",
    experimental_workspace: { register: () => {} },
    serverUrl: new URL("http://localhost:4096"),
    $: {} as never,
  };
}

test("plugin registers agents, commands, and tools", async () => {
  const hooks = await plugin(makePluginInput());

  expect(hooks.config).toBeDefined();
  expect(hooks.tool).toBeDefined();
  expect(hooks.tool?.orgcode_task).toBeDefined();

  const cfg: Config = { agent: {}, command: {} };
  await hooks.config!(cfg);

  expect(cfg.agent?.["orgcode-manager"]).toBeDefined();
  expect(cfg.agent?.["orgcode-manager"]!.mode).toBe("primary");
  expect(cfg.agent?.["orgcode-senior"]).toBeDefined();
  expect(cfg.agent?.["orgcode-senior"]!.mode).toBe("subagent");
  expect(cfg.agent?.["orgcode-techlead"]).toBeDefined();
  expect(cfg.agent?.["orgcode-techlead"]!.mode).toBe("subagent");

  expect(cfg.command?.["orgcode"]).toBeDefined();
  expect(cfg.command?.["orgcode_yolo"]).toBeDefined();
  expect(cfg.command?.["orgcode"].agent).toBe("orgcode-manager");
});

test("plugin preserves existing agents and commands", async () => {
  const hooks = await plugin(makePluginInput());

  const cfg: Config = {
    agent: { existing: { mode: "primary", description: "existing" } as never },
    command: { existing: { template: "existing" } as never },
  };
  await hooks.config!(cfg);

  expect(cfg.agent?.existing).toBeDefined();
  expect(cfg.command?.existing).toBeDefined();
  expect(cfg.agent?.["orgcode-manager"]).toBeDefined();
});
