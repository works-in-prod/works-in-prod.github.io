---
title: "What to leave out of an architecture diagram"
slug: the-art-of-the-architecture-diagram-is-knowing-what-to-leave-out
date: 2026-05-21T07:00:00.000Z
authors: [ambersariya]
tags:
  - architecture
  - diagrams
  - c4
  - d2
last_updated: 2026-11-20T10:31:14.000Z
---

There's a particular type of diagram that engineers love producing and nobody can read. Boxes for every service, arrows for every dependency, and a legend that requires its own legend. The details may all be accurate, but you still can't tell what the system does.

A useful architecture diagram answers a question for its reader. Deciding what to leave out is part of that job.

I've been doing [C4 modelling](https://c4model.com/diagrams) for a while, and that's what I like about it. System Context, Container, Component, Code: four levels of detail for different questions and audiences. Mixing those levels makes it harder to see what a diagram is trying to explain.

<!-- truncate -->

The tooling has been a headache. I tried a few diagram-as-code options that seemed to get in the way more than they helped. I've recently switched to [D2](https://d2lang.com/), and it's been noticeably better for me. The syntax is small, the output is clean, and I can spend more time on what the diagram needs to say.

## What question does the diagram answer?

Engineers instinctively want to put everything in. Every dependency. Every call. Every integration they personally wired up at 11pm on a Thursday and feel a certain proprietary affection for.

Those details can matter. If you're debugging how a chat request moves through the system, protocols, authentication and session storage are relevant:

```d2
direction: right

user -> api_gateway: HTTPS POST /v1/chat
api_gateway -> auth_service: JWT validation
auth_service -> user_db: SELECT users WHERE id=?
api_gateway -> chat_service: gRPC StreamChat
chat_service -> redis: GET session:{id}
chat_service -> llm_provider: POST /completions
llm_provider -> chat_service: SSE stream
chat_service -> redis: SET session:{id}
chat_service -> postgres: INSERT messages
chat_service -> api_gateway: SSE stream
api_gateway -> user: SSE stream
```

But if someone asks, "What are the main parts of this chat application?", the request-level detail gets in the way. A simpler view helps:

```d2
direction: down

user: User {shape: person}
web_app: Web App
api: API Service
llm: LLM Provider
db: Database {shape: cylinder}

user -> web_app: uses
web_app -> api: sends messages
api -> llm: streams completions
api -> db: persists conversations
```

The first view helps trace a request. The second shows the broad responsibilities: the web app sends messages to an API, which calls a language-model provider and stores conversations.

These are illustrative sketches, not equivalent views of a fully specified system. The second deliberately leaves out authentication, caching and the gateway. Those need to appear in another view if they're relevant to the reader's question. A full [C4 container diagram](https://c4model.com/diagrams/container) would also show the system boundary, major technology choices and how the applications and data stores communicate.

Removing detail is useful only if the remaining picture still answers the question accurately.

## Give AI tools the same brief

AI tools can make the arrows problem worse. Ask for an architecture diagram without saying who it's for or what it needs to explain, and you can end up with every import, function call and database relationship the tool can find.

That might help you investigate dependencies. It won't necessarily help a new team member understand the system.

Tell the tool the audience, the question and the level of detail. Review what it leaves out as carefully as what it includes. Access to the code doesn't tell it which relationships matter for this particular explanation.

I prefer top-down layouts because I find them easier to scan. But layout comes after scope. Neatly arranging too much detail still leaves you with too much detail.

The test I use: can someone new to the team look at the diagram and explain the part of the system it covers, without me hovering over their shoulder narrating? If they need me to explain the diagram first, I've drawn a very expensive set of notes.
