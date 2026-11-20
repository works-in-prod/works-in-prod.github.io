---
title: "Journey to the centre of the stack"
slug: journey-to-the-centre-of-the-stack
description: Containerising legacy software has always been a journey into the unknown. What's changed is who you take with you.
date: 2020-11-30 11:00:00 +0000
modified: 2026-05-21T00:00:00.000Z
tags:
  - docker
  - legacy-software
  - modernisation
  - ai-engineering
  - developer-experience
last_updated: 2026-11-20T10:38:51.000Z
---

I first wrote this post in 2020 after spending several weeks containerising a legacy application I hadn't built and didn't fully understand. It was mostly archaeology: reading old configuration, tracing hardcoded paths and figuring out what half a dozen processes did before touching anything. By the time I had a working Docker image, I'd earned it.

I'd approach parts of that work differently now, with AI tools helping me investigate the code. The decisions still need just as much care.

<!-- truncate -->

## Getting oriented

Working in unfamiliar legacy code takes concentration. Before you can decide what to change, you need to understand what you're looking at.

An agent can help map dependencies, find uses of a configuration value, summarise a module or trace what happens to an uploaded file. Those answers need checking, but they can give you a starting point faster than opening files without a clear route through them.

That leaves more time for the architectural questions: where state belongs, how processes interact and which assumptions a container will break.

## What the code doesn't tell you

A hardcoded path might look easy to replace with an environment variable. But the code won't necessarily tell you about the cron job on the production server that expects files at that path.

The same problem applies to session storage, deployment defaults and shared directories. Some choices reflect constraints that still exist. Others are leftovers. You need evidence before deciding which is which.

An agent can only use the context it has. Deployment constraints, team agreements and the reasons behind old decisions may be missing from the repository. Talk to the people who know the system and check the running environment where you can.

Finding a dependency is useful. Establishing that it's safe to change is a separate job.

## How I'd approach it now

**Map the application first.** Find the processes, configuration files, external services and hardcoded paths. Use an agent's summary to guide investigation, then verify the important relationships. A static read won't reveal every runtime behaviour.

**Identify the decisions.** Session handling, persistent storage, secrets and multiple running instances need deliberate choices. Get those questions in front of the people who can answer them before spending days polishing the Dockerfile.

**Keep the image straightforward.** A common base image can help when several applications share a runtime and need the same updates. Don't introduce one just because the Dockerfiles look similar.

**Make environment-specific configuration explicit.** Paths, service URLs and feature flags need a clear configuration mechanism. Supply secrets through the deployment platform's secret mechanism; don't bake them into the image.

**Run the application early.** Build a small working container, find the first failure, fix it and repeat. Check behaviour at the boundaries you're changing, especially storage and process startup.

**Account for dependencies.** Every system library, OCR engine or local model becomes part of what you build, update and operate. Our [Docling experience](/we-spent-five-weeks-making-docling-work-then-we-deleted-it/) is a reminder of how much work can hide behind adding one package.

The journey to the centre of the stack still involves unfamiliar code and decisions with consequences. Better tools can reduce the reading needed to reach those decisions. They don't remove the need to understand them.
