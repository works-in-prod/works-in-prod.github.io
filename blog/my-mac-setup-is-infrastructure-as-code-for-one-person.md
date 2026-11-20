---
title: "Keeping my Mac setup reproducible"
slug: my-mac-setup-is-infrastructure-as-code-for-one-person
description: How I use Homebrew, mise and chezmoi to manage and rebuild my Mac setup.
date: 2026-06-04T00:00:00.000Z
authors: [ambersariya]
tags:
  - macos
  - tooling
  - developer-experience
  - mise
  - chezmoi
last_updated: 2026-11-20T10:38:51.000Z
---

I've become weirdly happy with my Mac setup. I can describe how to rebuild it without relying on a memory of everything I've installed over the years.

Three tools have clear jobs: Homebrew installs Mac apps and system packages, mise manages developer tools, and chezmoi manages my dotfiles and setup scripts.

<!-- truncate -->

It's the same idea I liked in server bootstrap tooling: the machine shouldn't be a mystery. I'd accepted that for servers years ago, while still treating my laptop as something assembled by hand and repaired from memory.

## Give each tool a job

For my setup, the split is:

| Tool | What I use it for |
| --- | --- |
| [Homebrew](https://brew.sh/) | Desktop apps, system packages, fonts and bootstrap tools |
| [mise](https://mise.jdx.dev/) | Language runtimes, formatters and developer CLIs |
| [chezmoi](https://www.chezmoi.io/) | Shell configuration, aliases, editor defaults, package inventories and setup scripts |

There's overlap in what these tools can do. The useful part is choosing an owner for each piece so I don't install the same thing through several routes.

When I need a Mac app, I reach for Homebrew. When I need a project runtime, I reach for mise. When I change how my shell behaves, I change the chezmoi source.

That's easier to follow than "I probably installed this with whatever the README told me in 2021."

## Keep the developer toolchain in one place

I already wrote about [managing runtimes and tasks with mise](/stop-arguing-with-your-terminal-about-python-versions/). Here, the benefit is knowing where developer tools belong.

The exact tools change. The ownership rule stays the same. A new formatter or command-line utility goes into the toolchain configuration rather than becoming another installer command I need to remember.

Pinning versions gives you more control over rebuilds. Using `latest` is a choice to accept newer releases when installing, rather than a guarantee that a fresh machine will get the same versions.

## Review configuration before applying it

chezmoi gives me a simple workflow:

```bash
chezmoi diff
chezmoi apply
chezmoi status
```

I can see the proposed changes, apply them, then inspect differences between the managed files and their target state. This covers the files chezmoi manages; it isn't a health check for the entire machine.

Templates let me share configuration without assuming every machine is identical. Machine-specific values can live outside the public source. Secrets need their own handling, rather than being committed as template values.

The shell setup is where I notice the difference most. Bash and zsh can share common interactive behaviour. Aliases have a home, PATH setup is deliberate, and the rc files become entry points rather than junk drawers.

Instead of asking, "Which file did I hack this into?", I can ask, "Which tool owns this?"

## Check the result

One of my favourite pieces is a small doctor script that runs after applying changes. It checks whether expected tools are reachable, whether package inventories have drifted and whether managed files match what I expect.

It doesn't prove the whole setup is correct. It turns some common failures into a list I can act on, which is better than opening a terminal and vaguely feeling that something's off.

## The cost is maintenance

I still have to review changes, update the source and keep the boundary between the three tools clear. Pasting a random installer into a shell startup file can undo that clarity quite quickly.

I'd rather maintain a visible configuration than a vague memory of how the machine became useful. The aim is to make the important parts repeatable, without automating every preference I might ever have.

The old infrastructure saying is that servers should be cattle, not pets. My laptop is personal enough that I don't quite want that. A well-documented pet will do: it has my preferences, but if it disappears tomorrow, I have a map for rebuilding it.
