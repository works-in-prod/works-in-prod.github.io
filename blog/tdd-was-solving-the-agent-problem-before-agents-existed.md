---
title: "TDD makes code easier for agents to work with"
slug: tdd-was-solving-the-agent-problem-before-agents-existed
date: 2026-05-21T04:00:00.000Z
authors: [ambersariya]
tags:
  - ai-engineering
  - tdd
  - developer-experience
  - agile
last_updated: 2026-11-20T10:38:51.000Z
---

The first time I set an agent loose on a real codebase, it ran out of context before it had done anything useful. That's a clarifying experience.

It was a Python monorepo with shared libraries and infrastructure code. I sketched the context window as a rectangle and filled in what the agent had loaded: the directory tree, instructions, modules, configuration and dependencies. More than half the space was gone before it reached the task.

<!-- truncate -->

A codebase with unclear boundaries, large modules and implicit conventions makes an agent spend its context working out where it is. A new engineer has the same orientation problem, but can build understanding over weeks. In the setup I was using, the agent started each session without that accumulated knowledge.

That made familiar engineering practices feel useful in a new way.

## Tests give the agent somewhere to start

Test-driven development (TDD) and the Extreme Programming (XP) practices around it encourage small steps, simple design and regular refactoring. When applied well, those practices can produce focused modules, explicit interfaces and tests that describe intended behaviour.

Those are useful properties when an agent can only hold part of a codebase in context.

A test called `test_chat_service_returns_error_on_empty_prompt` gives it a place to investigate the empty-prompt rule. It still needs to read the assertions and relevant implementation. But it has a starting point, rather than several hundred lines of service code to search without direction.

Tests also give feedback after a change. The agent doesn't have to infer every expectation from the current implementation, which might be the thing that's wrong.

This depends on the tests. A suite tied to private methods or incidental implementation details can make changes harder. Passing tests show that the checked expectations hold, not that the design is sound or every requirement is covered.

## Structure reduces repeated investigation

I've watched agents re-read files, trace implicit dependencies and rediscover conventions that could have been explicit. That costs time and context. With token-based billing, it can cost money too.

Small modules help when they have clear responsibilities. Splitting one confusing module into ten confusing files doesn't solve the problem.

[Architecture tests](/your-codebase-has-rules-does-ci-know-that/) can help with structural rules. If the API must not import database modules, make that expectation executable. Human and agent get the same feedback when a change crosses the boundary.

TDD doesn't guarantee that a codebase will be easy for agents to navigate. But the things I value in a testable codebase also help here: behaviour I can find, dependencies I can see and changes I can check without understanding the whole system first.
