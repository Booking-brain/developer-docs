# Booking Brain Developer API Documentation

The official API documentation site for Booking Brain, live at **[docs.bookingbrain.com](https://docs.bookingbrain.com)**.

Built with [Docusaurus](https://docusaurus.io/) and hosted on Firebase Hosting.

## What's in the box

- **Guides** — Quick start, authentication, booking flow walkthrough, error handling, AI integration
- **API Reference** — Auto-generated from [OpenAPI spec](../openapi.yaml) with interactive "Try It" explorer
- **SDK & MCP** — Node.js SDK (`@bookingbrain/sdk`) and MCP server (`@bookingbrain/mcp-server`) for AI agents
- **Search** — Full-text local search across all docs
- **Copy for LLM** — One-click button to copy any page as clean Markdown for AI assistants
- **Bug Report Widget** — Slide-out panel that uses AI to analyse reports and create GitHub issues automatically

## Quick start

```bash
npm install
npm start
```

Opens at [localhost:3000](http://localhost:3000). Hot-reloads on save.

## Build

```bash
npm run build
```

Generates static output in `build/`. To preview locally:

```bash
npm run serve
```

## Regenerate API docs

When the OpenAPI spec changes:

```bash
npx docusaurus gen-api-docs bookingbrain
```

To clean and regenerate:

```bash
npx docusaurus clean-api-docs bookingbrain
npx docusaurus gen-api-docs bookingbrain
```

## Deploy

Deployed to Firebase Hosting (project `bookingbrain-docs-43d7f`):

```bash
FIREBASE_TOKEN=$(grep FIREBASE_TOKEN .env | cut -d= -f2) npx firebase deploy --only hosting
```

Custom domain: `docs.bookingbrain.com` (CNAME via DynaDot).

## Project structure

```
developer-docs/
├── docs/                    # Markdown content (guides, changelog, versioning)
│   ├── api/                 # Auto-generated from OpenAPI spec
│   └── guides/              # Integration guides (SDK, AI, test data)
├── src/
│   ├── clientModules/       # Client-side JS (bug widget, LLM copy, lang sync)
│   ├── components/          # React components (BookingFlowDiagram)
│   ├── css/                 # Custom styles
│   └── pages/               # Standalone pages (homepage)
├── static/                  # Static assets (images, favicons, llms.txt)
├── docusaurus.config.ts     # Site configuration
├── firebase.json            # Hosting config, redirects, security headers, CSP
├── sidebars.ts              # Sidebar navigation
└── openapi.yaml             # → ../openapi.yaml (API spec, shared with SDK/MCP)
```

## Key features

| Feature | Implementation |
|---|---|
| OpenAPI explorer | `docusaurus-plugin-openapi-docs` + `docusaurus-theme-openapi-docs` |
| Local search | `@easyops-cn/docusaurus-search-local` |
| Self-hosted fonts | `@fontsource/inter` (no Google Fonts dependency) |
| Security headers | CSP, HSTS (2yr + preload), X-Frame-Options, nosniff, Referrer-Policy |
| SEO | JSON-LD, OG tags, canonical URLs, sitemap with lastmod, robots.txt |
| AI-ready | `/llms.txt`, `/llms-full.txt`, Copy for LLM button, operationIds on all endpoints |
| Bug reports | AI-powered: user describes issue → Anthropic analyses → GitHub issue created |
| Dark mode | System preference detection + manual toggle |
| URL redirects | 301s from old `/docs/` prefix (Docusaurus plugin + Firebase server-side) |

## Related repositories

| Repo | Description |
|---|---|
| [`bb-sdk`](https://github.com/Booking-brain/bb-sdk) | Node.js SDK (`@bookingbrain/sdk`) |
| [`bb-mcp-server`](https://github.com/Booking-brain/bb-mcp-server) | MCP server for AI agents |
| [`bb_app_api`](https://github.com/Booking-brain/bb_app_api) | Backend API (NestJS) |
| [`openapi.yaml`](../openapi.yaml) | OpenAPI 3.0 specification |

## Sandbox API key

Start making API calls immediately — no sign-up required:

```
bb_sandbox_test_key_do_not_use_in_production
```

Add as `X-API-Key` header. Returns real property data; won't create bookings or process payments.

## License

Copyright Booking Brain Ltd. All rights reserved.
