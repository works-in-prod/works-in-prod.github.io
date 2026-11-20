---
title: "Start with a walking skeleton"
slug: establishing-a-walking-skeleton-for-projects
date: 2021-09-16T11:56:19.338Z
modified: 2022-05-18T13:29:31.906Z
last_updated: 2026-11-20T10:38:51.000Z
---

I've been reading [Growing Object-Oriented Software, Guided by Tests](https://www.goodreads.com/en/book/show/4268826-growing-object-oriented-software-guided-by-tests). One idea I wish I'd applied sooner is the walking skeleton: a small implementation that connects the main parts of a system and can be deployed end to end.

<!-- truncate -->

It's tempting to start a new project by solving the interesting problem in code and leave deployment until later. I've done that. We built an application locally, intending to put it online when the first feature was ready.

When we tried, we hit security policies, technology restrictions and release processes we hadn't accounted for. Sorting them out took a couple of months of back and forth between development, operations and administration teams.

We knew there were constraints. Deferring the details seemed reasonable until those details stopped us releasing anything.

A walking skeleton would have given us that feedback earlier. Even a hello-world application passing through the real deployment process would have forced us to deal with access, infrastructure and release approvals before building features around untested assumptions.

That's what I'd tell my past self: get something small running end to end, then build on it. A working application on your laptop hasn't proved that you can release it.
