---
slug: publish-docusaurus-github-blog
title: "Publishing a Docusaurus blog on GitHub Pages"
tags:
  - docusaurus
  - blog
  - how-to
modified: 2022-05-18T14:09:58.864Z
date: 2022-05-18T11:27:11.104Z
draft: true
last_updated: 2026-11-20T10:38:51.000Z
---

These are draft setup notes for a Docusaurus blog on GitHub Pages. They don't yet cover the full deployment workflow.

<!-- truncate -->

## Create the site

For a user or organisation site, create a GitHub repository named `<account>.github.io`, replacing `<account>` with the account name. A project site uses a different URL path and configuration.

Create a local Docusaurus site:

```shell
npx create-docusaurus@latest my-blog classic --typescript
cd my-blog
```

Check the generated package scripts and run the local development server using the package manager selected during setup.

## Configure deployment

Before deploying, set the site URL, base URL, organisation name and project name to match the repository. Follow the [Docusaurus GitHub Pages deployment guide](https://docusaurus.io/docs/deployment#deploying-to-github-pages) for the chosen publishing method.

Before publishing this draft, add and verify a complete build-and-deploy example for the chosen publishing method.
