---
title: "Supervising coding agents"
slug: ai-coding-has-moved-from-generation-to-supervision
description: Keep coding-agent work scoped, checked and reviewable, with clear permissions and human ownership.
date: 2026-06-02T16:45:12.804Z
modified: 2026-06-02T16:45:12.804Z
draft: true
generated_by: public-seed-draft
source_seed: publishing/public-seeds/ai-coding-has-moved-from-generation-to-supervision.md
template: pattern-note
authors: [ambersariya]
tags:
  - ai-engineering
  - developer-experience
  - testing
  - security
last_updated: 2026-11-20T10:38:51.000Z
---

A coding agent can produce a plausible change before you've decided how to check it. That's the part I want to make explicit: what the agent is allowed to change, what evidence it needs to collect and who decides whether the result is good enough.

Code generation is one step. The surrounding engineering work still needs an owner.

<!-- truncate -->

## Give the change a boundary

Consider a task such as moving a parser behind an interface. Before asking an agent to do it, establish the behaviour that must stay the same, the callers affected and the checks that will show whether the move worked.

That gives both the agent and reviewer something concrete to assess. A broad instruction to "improve the module" leaves too much room for changes nobody intended.

Kief Morris's [Humans and Agents in Software Engineering Loops](https://martinfowler.com/articles/exploring-gen-ai/humans-and-agents.html) describes humans working on the development loop, rather than choosing between abandoning oversight and micromanaging every line. I find that a useful framing: improve the conditions under which changes are made and checked.

For the parser example, that might mean:

- Agree on the observable behaviour before changing tests.
- Keep the task small enough to review as one change.
- Make dependencies explicit so relevant behaviour can be checked deterministically.
- Run the repository's existing checks and report what wasn't verified.
- Review the resulting code and responsibilities, as well as the test result.

Those are ordinary engineering practices. An agent makes the feedback loop more visible because it can repeat a mistaken assumption quickly.

## Put repeatable rules in checks

Written instructions help explain a repository. Automated checks can enforce some of its expectations.

[Architecture tests](/your-codebase-has-rules-does-ci-know-that/) can detect forbidden imports. Type checks and linters catch other classes of mistake. Behavioural tests provide feedback about the expectations they cover.

The limits matter. Passing checks don't establish that every requirement is satisfied or that the design is easy to maintain. Tests that simply repeat the implementation can reinforce the same mistake. Someone still needs to understand what the checks demonstrate.

DORA's [2025 report](https://dora.dev/research/2025/dora-report/) describes AI as amplifying existing organisational strengths and weaknesses. My reading is that faster generation makes the quality of the surrounding development process more consequential, rather than making it optional.

## Match permissions to the task

An agent that can read files, install packages, fetch web content and call remote services has more capability than an autocomplete tool. Its permissions need to reflect that.

The [OWASP Top 10 for LLM Applications](https://genai.owasp.org/llm-top-10/) covers risks including prompt injection and excessive agency. For a coding workflow, I'd limit filesystem, network and remote-action access to what the task needs, and require explicit approval for consequential actions.

A paragraph telling the agent to be careful isn't a substitute for those boundaries. Retrieved content also needs to be treated as data, rather than permission to act.

## Review the result and the evidence

For the parser change, I'd want to know:

- Does the interface preserve the agreed behaviour?
- Are the callers and external effects accounted for?
- Did the agent add complexity the task didn't need?
- Which checks ran, and which risks remain untested?
- Can the team explain and maintain the result?

Generating a diff quickly is useful if it reduces the time to a change we understand and can support. If review, debugging and rework grow faster than generation gets cheaper, the apparent speed isn't much of a gain.
