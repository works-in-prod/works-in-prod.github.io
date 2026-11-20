---
modified: 2022-05-19T11:05:24.210Z
date: 2022-05-19T11:46:52.000Z
title: "A VS Code snippet for Markdown front matter"
slug: vscode-snippet-to-add-markdown-frontmatter
draft: false
tags:
  - docusaurus
  - blog
  - how-to
last_updated: 2026-11-20T10:38:51.000Z
---

I use a [VS Code snippet](https://code.visualstudio.com/docs/editing/userdefinedsnippets) to add the front matter for a post on this blog.

<!-- truncate -->

1. Open **Snippets: Configure Snippets** from the Command Palette.
2. Choose **New Global Snippets file** and give it a name.
3. Add the JSON below.
4. In a Markdown file, run **Insert Snippet** and choose **Add Docusaurus blog front matter**, or type `frontmatter` and select the completion when offered.

```json
{
  "Add Docusaurus blog front matter": {
    "scope": "markdown,mdx",
    "prefix": "frontmatter",
    "description": "Add draft post metadata for this blog",
    "body": [
      "---",
      "draft: true",
      "date: ${1:YYYY-MM-DDT00:00:00.000Z}",
      "title: \"${2:Post title}\"",
      "slug: ${TM_FILENAME_BASE}",
      "authors: [ambersariya]",
      "tags:",
      "  - ${3:tag}",
      "---",
      "",
      "$0"
    ]
  }
}
```

Name the file in kebab case, such as `my-new-post.md`; the snippet uses that name without the extension as the slug. Use Tab to move through the date, title and tag fields.

Replace the date placeholder with a real UTC timestamp. The trailing `Z` means UTC; appending it to VS Code's local-time variables would mislabel the time.

The author key is specific to this site. Change it for another blog, and review the metadata before removing `draft: true`.
