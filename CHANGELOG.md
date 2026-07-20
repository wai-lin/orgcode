# Changelog

## 0.1.4

### Bug Fixes

- Fix the published exports.

## 0.1.3

### Bug Fixes

- Restored `./server` and `./tui` exports in `package.json` (lost in v0.1.2).

## 0.1.2

### Bug Fixes

- Added `./server` and `./tui` exports to `package.json` for npm plugin loading.
- Fixed async config hook type definition.

## 0.1.0

### Features

- Initial release of the ORGCODE OpenCode plugin.
- Added three opinionated agents: `orgcode-manager`, `orgcode-senior`, and `orgcode-techlead`.
- Added `/orgcode` checkpoint command and `/orgcode_yolo` autonomous command.
- Added `orgcode_task` custom tool for managing TOML-in-Markdown tasks.
- Enforced TDD and YAGNI principles in senior and techlead prompts.
- Published as an npm package with MIT license.
