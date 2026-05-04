# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
quasar dev          # Start dev server at http://localhost:9030
quasar build -m pwa # Build PWA to dist/pwa
pnpm lint           # ESLint check
pnpm format         # Prettier format
quasar serve dist/pwa # Preview production build locally
```

## Architecture

Vue 3 (Composition API) + Quasar Framework v2 (Vite) PWA, deployed to Vercel.

- **Router**: `src/router/routes.js` — hash mode, single layout wrapping all pages
- **Layout**: `src/layouts/MainLayout.vue` — QLayout with drawer + header dark-mode toggle
- **State**: Pinia stores in `src/stores/`
- **i18n**: `src/i18n/`, loaded via `src/boot/i18n.js`
- **HTTP**: axios instance in `src/boot/axios.js`
- **PWA**: `src-pwa/` — Workbox GenerateSW mode, manifest in `quasar.config.js`

## Design System

Full color spec: [`doc/ColorTheme.md`](doc/ColorTheme.md)

**Light mode** (Sunset Beach / 夕陽沙灘):
- Primary `#56C6CC` · Secondary `#7FCBD0` · Accent `#FFB97A`
- Background `#f7eedb` · Drawer `#FAD9A8` · Text `#3A4A52` · Hero `#FFE9A8`

**Dark mode** (Twilight Beach / 暮色沙灘):
- Primary `#6A3A78` · Secondary `#C26A86` · Accent `#F2B788`
- Dark background `#0B1844` · Surface `#2A1F5C` · Drawer `#0A0B22` · Text `#F2D5A8`

Color variables live in `src/css/app.css`. Dark mode is toggled via `$q.dark.toggle()` bound to the header icon.

## RWD Breakpoints

| Breakpoint | Device | Drawer behaviour |
|---|---|---|
| `xs` (< 600px) | iPhone | Hidden, toggled by hamburger |
| `sm` / `md` (≥ 600px) | iPad / MacBook | Fixed left, `show-if-above` |

Main content area: centred, `max-width: 900px`.

## Key Conventions

- Use Vue 3 Composition API (`<script setup>`) throughout
- Prefer Quasar built-in components over custom HTML
- Icons: Material Icons (primary) — already loaded via `quasar.config.js` extras
- Mobile-first RWD using Quasar grid classes (`col-xs-12`, `lt-md`, `gt-sm`, etc.)
- Project context and phase history: [`doc/projContext.md`](doc/projContext.md)
