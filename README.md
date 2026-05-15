# weldonweb.co.uk

Source for [weldonweb.co.uk](https://weldonweb.co.uk) — my blog on Azure, API Management, and AI infrastructure.

## Stack

- [Astro](https://astro.build) — static site generator
- Markdown content in `src/content/blog/`
- Deployed to Cloudflare Pages on push to `main`

## Running locally

```bash
npm install
npm run dev
```

Runs at `http://localhost:4321`.

## Adding a post

New markdown file in `src/content/blog/`. Filename becomes the URL slug — posts live at `weldonweb.co.uk/{slug}`, no date prefixes.

Frontmatter:

```yaml
---
title: "Post title"
description: "Meta description for SEO and social previews"
publishDate: 2026-05-15
tags: ["azure", "apim", "mcp"]
draft: false
---
```

Set `draft: true` to keep a post out of the production build.

## Build and deploy

```bash
npm run build      # production build to ./dist
npm run preview    # preview the production build
```

Pushes to `main` trigger a Cloudflare Pages build. Other branches get preview deployments — useful for sharing drafts before they're live.

## Current series

**MCP on Azure APIM** — six-part series, May–June 2026.

1. [Exposing enterprise APIs as MCP servers through Azure APIM](https://weldonweb.co.uk/mcp-apim-reference-architecture)
2. Five things the docs don't tell you about MCP on APIM *(coming)*
3. Why the API gateway is the right control plane for AI agents *(coming)*
4. Seven Azure platform constraints when running MCP through APIM *(coming)*
5. How I built a production Azure reference architecture with Claude Code *(coming)*
6. MCP-on-APIM: a fixed-price engagement *(coming)*

## About

I'm Jack Weldon — Microsoft Certified Azure Solutions Architect Expert, UK-based, working on Azure integrations and AI infrastructure. Previously built APIM platforms at RBS and other financial services clients.

For consulting work or to compare notes:

- LinkedIn: [linkedin.com/in/jackweldon](https://linkedin.com/in/jackweldon)
- Contact form: [weldonweb.co.uk/contact](https://weldonweb.co.uk/contact)

## Licence

Content © Jack Weldon. Code samples in posts are MIT licensed unless noted otherwise.