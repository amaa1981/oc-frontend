# Tech stack

## Core

- Vue 2
- Vuex 3
- Vue Router 3 (history mode)
- Element UI 2.15
- SCSS

## Main dependencies

- axios 0.24 — HTTP client (`src/utils/request.js`)
- vue-i18n 7 — i18n (en/zh)
- echarts 5.4 — charts
- @jiaminghi/data-view — DataV dashboard
- mapbox-gl 2.15 — maps
- js-cookie — token and preferences
- jsencrypt — RSA login encryption
- quill 1.3 — rich text
- dayjs — dates
- lodash — utilities
- file-saver — downloads
- cos-js-sdk-v5 — Tencent COS uploads

## Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Dev server (port 80, proxies `/api` and `/ai-api`) |
| `npm run build:linux` | Linux production build |
| `npm run build:windows` | Windows production build |
| `npm run build:report` | Production build + bundle analyzer |
| `npm run lint` | ESLint on `src/**/*.{js,vue}` |

Output directory: `web/` (not `dist/`).

## ESLint style

- 2-space indent
- Single quotes, no semicolons
- No trailing commas
- `prefer-const`, `eqeqeq` (except null)
- Vue component names PascalCase
- Max 10 attributes per single-line element

## Environment variables

`.env.development`, `.env.linux`, `.env.windows`:

- `VUE_APP_BASE_API` — backend API base URL
- `VUE_APP_TYPE` — `linux` or `windows`
- `VUE_APP_AI_*` — AI service settings
- `VUE_APP_AI_WS_URL` — AI WebSocket chat endpoint

## Dev server proxy

`VUE_APP_BASE_API` → `http://localhost:8081`
