---
title: "Enforcing architecture rules in CI"
slug: your-codebase-has-rules-does-ci-know-that
date: 2026-05-21T06:00:00.000Z
authors: [ambersariya]
tags:
  - python
  - testing
  - architecture
  - ai-engineering
last_updated: 2026-11-20T10:38:51.000Z
---

Two engineers can review the same pull request and disagree about where the code belongs. They may have worked in the same repository for months without realising they have different ideas about its architecture.

We've caught that kind of drift with architecture tests: checks that turn agreed dependency rules into failures in continuous integration (CI).

<!-- truncate -->

Different projects and professional backgrounds teach different habits. Unless a team makes its boundaries explicit, those habits become assumptions that surface during code review.

[pytest-archon](https://github.com/jwbargsten/pytest-archon) lets you express import rules for a Python codebase. For example, suppose the team has agreed that API modules must not import database modules directly:

```python
from pytest_archon import archrule


def test_api_does_not_import_database():
    (
        archrule("api-layer-isolation", use_regex=True)
        .match(r"^myapp\.api(\..*)?$")
        .should_not_import(r"^myapp\.database(\..*)?$")
        .check("myapp", only_direct_imports=True)
    )
```

The patterns include the package modules themselves and their submodules. `only_direct_imports=True` limits this rule to direct imports; without it, pytest-archon also checks transitive dependencies.

Run the test in CI and an API handler that imports a database model will fail the check. It won't prevent every possible way of reaching the database at runtime. It checks the import boundary we've described.

## The same feedback for humans and agents

An agent doesn't automatically know that your team agreed on this boundary six months ago. Written instructions help, but an executable check also tells it when its change violates the rule.

That's useful for human contributors too. A visible, consistently checked rule can reduce the time spent repeating the same dependency discussion in review.

The test doesn't decide whether the boundary is right. The team still needs to agree on it, explain why it matters and change it when the design changes. Architecture tests can enforce a poor decision just as reliably as a good one.

What they give us is a way to catch divergence early, before different assumptions become established patterns across the repository.
