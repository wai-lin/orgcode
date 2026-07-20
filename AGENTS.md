<!--VITE PLUS START-->

# Using Vite+, the Unified Toolchain for the Web

This project is using Vite+, a unified toolchain built on top of Vite, Rolldown, Vitest, tsdown, Oxlint, Oxfmt, and Vite Task. Vite+ wraps runtime management, package management, and frontend tooling in a single global CLI called `vp`. Vite+ is distinct from Vite, and it invokes Vite through `vp dev` and `vp build`. Run `vp help` to print a list of commands and `vp <command> --help` for information about a specific command.

Docs are local at `node_modules/vite-plus/docs` or online at https://viteplus.dev/guide/.

## Review Checklist

- [ ] Run `vp install` after pulling remote changes and before getting started.
- [ ] Run `vp check` and `vp test` to format, lint, type check and test changes.
- [ ] Check if there are `vite.config.ts` tasks or `package.json` scripts necessary for validation, run via `vp run <script>`.
- [ ] If setup, runtime, or package-manager behavior looks wrong, run `vp env doctor` and include its output when asking for help.

<!--VITE PLUS END-->

<!-- Git START -->

# Git Guideline

When doing commit, please follow the following guideline:

- Run `vpr precommit` to run pre-commit checks and fix any warnings, issues and errors.
- Group related changes together in a single commit.
- Write clear and concise one line commit messages.
- Use the present tense for commit messages.
- Follow the commit message format: `<type>(<scope>): <subject>`.

<!-- Git END -->

<!-- Development START -->

# Development Guideline

> IMPORTANT NOTE: Always follow the task flow and TDD process to implement the features.

When developing the project, please follow the following guideline:

- Create a worktree for each feature implementation.
- Plan the feature implementation in the Kanban tasks [folder](./tasks).
- Define and implement the test cases first.
- Implement the feature code in TDD manner.
- Refactor the code as needed after the feature is implemented (YAGNI).
- Update the [task files](./tasks) to track the progress of each feature.
- Update the [docs files](./docs) to reflect the changes in the code.
- Commit the code regularly by following the Git guideline.

<!-- Development END -->
