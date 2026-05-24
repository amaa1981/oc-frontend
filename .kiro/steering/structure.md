# Project structure

```
src/
├── api/                  # Backend API modules (one file per resource)
│   ├── login.js
│   ├── menu.js
│   ├── system/           # System APIs (device, user, role, alarm, AI, …)
│   ├── monitor/
│   ├── alarm/
│   └── tool/
├── assets/
│   ├── icons/svg/
│   ├── images/
│   ├── styles/
│   └── logo/
├── components/           # Reusable components (PascalCase + index.vue)
├── directive/
├── lang/                 # en.js, zh.js
├── layout/
├── plugins/
├── router/
├── store/
├── utils/
│   ├── request.js        # Axios + auth interceptor
│   ├── auth.js
│   └── ruoyi.js
├── views/                # Pages by feature
├── main.js
├── permission.js
├── settings.js
└── App.vue
```

## Conventions

- API: `listX`, `getX`, `addX`, `updateX`, `delX` via `request.js`
- Components: PascalCase folder + `index.vue`
- Views: `src/views/{module}/` aligned with routes
- Global components registered in `main.js`
- Auth: JWT in cookie `Admin-Token`
- Routes: `constantRoutes` + permission-based `dynamicRoutes` from backend menus
