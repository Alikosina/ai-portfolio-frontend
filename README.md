# Transform Frontend

A personal portfolio site for a software engineer — hero intro, an experience
timeline, account/login views, and a floating AI-assistant chat widget with
light/dark theming.

The design was created in **Claude Design** (Nocturne design system) and the
Next.js implementation was generated with **Claude Code**, translating the
design's template bindings and view logic into idiomatic React.

## Stack

- **[Next.js](https://nextjs.org)** 16 (App Router) — React framework and dev/build tooling
- **[React](https://react.dev)** 19
- **TypeScript**
- Plain CSS with a token-based design system (custom properties for color,
  spacing, radius, and elevation), no CSS framework
- **[Phosphor Icons](https://phosphoricons.com)** (web font, via CDN) and
  **Inter** (Google Fonts) for iconography and typography
- **ESLint** (`eslint-config-next`) for linting

## Project structure

```
app/
  layout.tsx      # root layout — fonts, icon stylesheet, page metadata
  page.tsx         # the portfolio page (client component): theme/view state,
                    # hero + experience timeline, login, profile, chat widget
  globals.css      # design tokens and component classes (buttons, cards,
                    # tags, forms, nav, dialog, etc.) plus light-theme overrides
```

The page is a single client-rendered component that switches between three
views (`home`, `login`, `profile`) and a chat panel via local React state —
no routing or backend involved.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view it.

## Build

```bash
npm run build
npm run start
```

## Docker

The app builds into a minimal, self-contained image using Next.js'
[`standalone`](https://nextjs.org/docs/app/api-reference/config/next-config-js/output)
output (enabled in `next.config.ts`). The server listens on port `3000`
inside the container.

Build and run directly:

```bash
docker build -t transform-frontend .
docker run -d --name transform-frontend -p 3000:3000 transform-frontend
```

Or with Docker Compose (also picks up an optional `HOST_PORT` env var if you
want to expose it on a different host port, e.g. `HOST_PORT=8080`):

```bash
docker compose up -d --build
```

Then open [http://localhost:3000](http://localhost:3000) (or your chosen
`HOST_PORT`).
