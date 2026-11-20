---
title: "Managing runtimes and tasks with mise"
slug: stop-arguing-with-your-terminal-about-python-versions
date: 2026-05-21T01:00:00.000Z
authors: [ambersariya]
tags:
  - tooling
  - developer-experience
  - mise
last_updated: 2026-11-20T10:38:51.000Z
---

You clone a repo you haven't touched in six months. The README says Python 3.11. You have 3.12. Before writing any code, you're working out which version manager the project uses and how to run its checks.

I use [mise](https://mise.jdx.dev/) to keep runtime versions and project tasks in one place.

<!-- truncate -->

The problem isn't limited to Python. Switching projects can mean switching between `pyenv`, `nvm`, `tfenv`, Makefiles and shell scripts. Each can work well, but you still need to discover the conventions for the repo in front of you.

## Versions and tasks in one file

For a Python project with pytest already installed in its project environment, a small `mise.toml` might look like this:

```toml
[tools]
python = "3.12.3"

[tasks.test]
description = "Run the test suite"
run = "pytest"

[tasks.verify]
description = "Run all project checks"
depends = ["test"]
```

The Python version is illustrative; use a supported version that your project has agreed on. The config doesn't install pytest or the application dependencies. Keep the project's environment setup explicit too.

Review the file before [trusting the project configuration](https://mise.jdx.dev/walkthrough.html), then run:

```bash
mise trust
mise install
mise tasks
mise run verify
```

`mise tasks` lists the available tasks. `mise run verify` gives contributors a consistent command, even if the checks behind it change.

The [task dependency rules](https://mise.jdx.dev/tasks/task-configuration.html) matter: dependencies can run in parallel. Listing `test` and `build` in `depends` doesn't mean that one finishes before the other starts.

## Hide the mechanics behind a useful command

One project needed a custom k6 binary for testing a streaming API. Building it involved Go, xk6 and an SSE extension. The build task ran:

```bash
xk6 build --with github.com/phymbert/xk6-sse
```

Wrapping that in a task gave the team one command to remember. It didn't remove the prerequisites: the project still needed to install and pin Go and xk6, as well as the extension version if we wanted repeatable builds.

That's the useful distinction. A task can hide the mechanics at the call site while keeping them visible in the repository.

## Use the same task in CI

The same approach works in GitHub Actions:

```yaml
jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: jdx/mise-action@v4
      - run: mise run verify
```

This is the task-running part of a workflow, not a complete application setup. Add the project's dependency installation before verification. The action versions shown are an example; review and pin the versions you use.

Sharing the command and tool configuration reduces one source of drift between local development and CI. It doesn't make their operating systems, services or environment variables identical.

## Bootstrap the machine separately

mise needs to be installed before it can manage a project. I handle that through [chezmoi](https://www.chezmoi.io/), which manages my dotfiles and bootstrap scripts. The shell configuration activates mise for interactive use:

```bash
eval "$(mise activate zsh)"
```

chezmoi handles my machine setup; mise handles the developer toolchain and project commands. Keeping those responsibilities clear has been more useful than trying to make one tool own everything.

I wouldn't migrate a settled `nvm` and `make` project just to standardise it for its own sake. For me, the benefit comes from switching between projects without having to rediscover how each one works.
