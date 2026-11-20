# Website

This website is built using [Docusaurus 3](https://docusaurus.io/), a modern static website generator.

### Installation

```
$ pnpm install
```

### Mise toolchain

This repo pins its local Node and pnpm toolchain in `mise.toml` and exposes the
main project commands as discoverable tasks.

```
$ mise trust
$ mise install
$ mise tasks ls
$ mise run install
```

Review `mise.toml` before the first `mise trust`; Mise requires that trust step
before it will load project tasks. The toolchain tracks the Node 24 LTS line
used by the GitHub Pages workflows. Existing pnpm commands work directly when
the pinned tools are already on `PATH`.

### Colour themes

The footer theme selector offers the six Claude Design palettes. Colour values are in
`src/theme/palettes.json` and `src/css/palettes.css`; the default palette and
browser storage key are in `src/theme/palette-settings.json`.

Palette selection uses `data-palette` on the HTML element. Docusaurus keeps its
own `data-theme` attribute for light/dark mode and syntax highlighting. The
selection is restored before the page renders. If browser storage is unavailable,
switching still works for the current page.

The supplied layout styles are in `src/css/site.css`. Docusaurus-specific styles
are in `src/css/custom.css`; custom page layouts and the masthead/footer live in
`src/theme/`. Keep the `.navbar` class on the static masthead: Docusaurus uses it
when calculating table-of-contents offsets.

Silkscreen, Literata and IBM Plex Mono are self-hosted under `static/fonts/`.
Keep the accompanying font licence files when redistributing them. Font-face
definitions are in `src/css/fonts.css`.

### Local Development

```
$ mise run dev
```

or:

```
$ pnpm start
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

### Build

```
$ mise run verify
```

or, for only the site build:

```
$ mise run build
```

or:

```
$ pnpm build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

### Agent authoring workflow

The canonical repo-local post authoring skill lives at `skills/code-eat-code-post-authoring/SKILL.md`. Codex can discover the companion shim under `.agents/skills/code-eat-code-post-authoring/`; Claude-style workflows can use or mirror the canonical `skills/` body without copying its rules.

- Generate a draft from an approved sanitized seed card: `Use $code-eat-code-post-authoring to create a local Code Eat Code draft from this approved seed card: ...`
- Review a draft before publish: `Use $code-eat-code-post-authoring to review blog/<post>.md for privacy, editorial quality, SEO/GEO, and verification gaps before publish.`

### Deployment

Using SSH:

```
$ USE_SSH=true pnpm deploy
```

Not using SSH:

```
$ GIT_USER=<Your GitHub username> pnpm deploy
```

If you are using GitHub pages for hosting, this command is a convenient way to build the website and push to the `gh-pages` branch.
