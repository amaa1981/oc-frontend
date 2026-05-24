# Edge Terminal Frontend

Vue 2 frontend for the Edge Terminal platform: alarm management, monitoring, devices, configuration, and system administration.

## Features

- Alarm map and monitoring center
- Device and area management
- Alarm logs and facial information
- System configuration (users, roles, menus, dictionary)
- English UI by default (optional Chinese via language switcher)

## Tech stack

- Vue 2, Vue Router, Vuex
- Element UI
- Axios, WebSocket
- ECharts, Mapbox GL JS

## Development

```bash
npm install
npm run dev
```

Default dev URL: http://localhost:80 (see `vue.config.js` for port/proxy).

API proxy targets `http://localhost:8081` via `VUE_APP_BASE_API=/api`.

## Build

```bash
npm run build:prod
```

Output directory: `web/`.

## Language

- Default locale: **English** (`en`)
- Translations: `src/lang/en.js`, `src/lang/zh.js`
- Locale cookie: `language`

## Copyright

Guangdong CAS Cogniser Information Technology Co., Ltd.
