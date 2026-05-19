# 技术栈

## 核心框架
- Vue 2.6（Options API）+ Vue CLI 4.4
- Vuex 3 状态管理
- Vue Router 3（history 模式）
- Element UI 2.15 组件库
- SCSS 样式

## 主要依赖
- axios 0.24 — HTTP 客户端（封装在 `src/utils/request.js`）
- vue-i18n 7 — 国际化（中/英）
- echarts 5.4 — 图表
- @jiaminghi/data-view — DataV 大屏组件
- mapbox-gl 2.15 — 地图渲染
- js-cookie — token 和偏好存储
- jsencrypt — 登录 RSA 加密
- quill 1.3 — 富文本编辑器
- dayjs — 日期工具
- lodash — 工具函数
- file-saver — 文件下载
- cos-js-sdk-v5 — 腾讯云 COS 上传

## 构建与开发命令

| 命令 | 说明 |
|---|---|
| `npm run dev` | 启动开发服务器（端口 80，代理 `/prod-api` 和 `/ai-api`） |
| `npm run build:linux` | Linux 生产构建 |
| `npm run build:windows` | Windows 生产构建 |
| `npm run build:report` | 生产构建 + 打包分析 |
| `npm run lint` | ESLint 检查 `src/**/*.{js,vue}` |

输出目录：`web/`（非默认的 `dist/`）

## 代码风格（ESLint）
- 2 空格缩进
- 单引号，无分号
- 禁止尾逗号
- 强制 `prefer-const`
- 强制 `eqeqeq`（null 除外）
- Vue 组件名使用 PascalCase
- 单行元素最多 10 个属性

## 环境变量
定义在 `.env.development`、`.env.linux`、`.env.windows` 中：
- `VUE_APP_BASE_API` — 后端 API 基础地址
- `VUE_APP_TYPE` — `linux` 或 `windows`
- `VUE_APP_AI_BASE_URL` / `VUE_APP_AI_API_KEY` / `VUE_APP_AI_MODEL` — AI 服务配置
- `VUE_APP_AI_WS_URL` — AI WebSocket 聊天端点

## 开发服务器代理
- `VUE_APP_BASE_API` → `http://localhost:8080`
- `/ai-api` → `VUE_APP_AI_BASE_URL`
