---
title: "Walking skeletons for AI projects"
slug: the-blockers-dont-care-that-youre-using-ai
date: 2026-05-21T03:00:00.000Z
authors: [ambersariya]
tags:
  - ai-engineering
  - software-delivery
  - walking-skeleton
last_updated: 2026-11-20T10:38:51.000Z
---

I [wrote about walking skeletons in 2021](/establishing-a-walking-skeleton-for-projects/): get something small running end to end before going deep on features. It exposes permissions, deployment and infrastructure problems while there's still little code depending on your assumptions.

I've found the same approach useful on AI projects.

<!-- truncate -->

Model access, inference, data pipelines and evaluation each add things to connect. They can work in isolation and still fail when you put them together in the environment where the application needs to run.

On a recent AI project, we pushed to establish that path early. We hit IAM permissions that didn't behave as expected, model API access that needed a different approval route, and tooling that worked locally but failed in containers.

These were familiar delivery problems. Calling the project an AI project hadn't removed any of them.

AI tooling did help us work through them. Investigating IAM policies, drafting access requests and finding the right cloud configuration went faster with an assistant alongside. That's my experience on this project, rather than a guarantee about how quickly these problems can be fixed.

The walking skeleton gave us something concrete to investigate. Without trying the deployment, we wouldn't have known which assumptions were wrong.

The temptation to skip that step is still there. It's easy to get a prototype working and keep adding features before checking whether it can run in production. Faster code generation can leave you with more code waiting for a pipeline that doesn't exist yet.

For an AI application, I'd start with a thin path through the actual deployment and a real model call, using suitable test data. Then build out from something we know can run. It doesn't need to do much. It needs to expose the things that could stop us shipping.
