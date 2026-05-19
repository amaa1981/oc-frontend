# 项目结构

```
src/
├── api/                  # 后端 API 模块（每个资源一个文件）
│   ├── login.js          # 认证接口
│   ├── menu.js           # 菜单接口
│   ├── system/           # 系统管理 API（设备、用户、角色、告警、AI 等）
│   ├── monitor/          # 监控 API（任务、日志、缓存、服务器）
│   ├── alarm/            # 告警记录 API
│   └── tool/             # 代码生成工具 API
├── assets/
│   ├── icons/svg/        # SVG 图标（通过 svg-sprite-loader 加载，使用 `icon-[name]`）
│   ├── images/           # 静态图片
│   ├── styles/           # 全局 SCSS（index.scss、element-variables.scss、ruoyi.scss）
│   ├── font/             # 自定义字体（DS-DIGI、YouSheBiaoTiHei）
│   └── logo/             # 应用 Logo
├── components/           # 可复用组件（PascalCase 目录 + index.vue）
│   ├── Pagination/       # 全局分页组件
│   ├── RightToolbar/     # 表格工具栏
│   ├── Editor/           # Quill 富文本编辑器
│   ├── FileUpload/       # 文件上传
│   ├── ImageUpload/      # 图片上传
│   ├── ImagePreview/     # 图片预览
│   ├── DictTag/          # 字典标签展示
│   ├── MapboxMap/        # Mapbox GL 地图封装
│   ├── SmartMap/         # 智能地图组件
│   ├── Player/           # 视频播放器
│   ├── AiReportDialog/   # AI 报告生成对话框
│   ├── AlarmDetail/      # 告警详情展示
│   └── ...               # 其他（Breadcrumb、LangSelect、TopNav 等）
├── directive/            # 自定义 Vue 指令
├── lang/                 # 国际化翻译文件（en.js、zh.js）
├── layout/               # 应用外壳布局（侧边栏、导航栏、标签页、主内容区）
├── plugins/              # Vue 插件（缓存、弹窗、标签页、下载等）
├── router/               # 路由定义（constantRoutes + dynamicRoutes）
├── store/                # Vuex 状态管理
│   ├── modules/          # app、dict、user、mqtt、tagsView、permission、settings
│   └── getters.js        # 根级 getters
├── utils/                # 工具模块
│   ├── request.js        # Axios 实例（含认证拦截器）
│   ├── auth.js           # Token 管理（js-cookie）
│   ├── validate.js       # 输入验证工具
│   ├── ruoyi.js          # 框架工具函数（parseTime、handleTree 等）
│   ├── websocket.js      # WebSocket 工具
│   └── permission.js     # 权限检查工具
├── views/                # 页面组件（按功能模块组织）
│   ├── system/           # 系统管理页面（设备、用户、角色、告警、数据等）
│   ├── monitor/          # 监控页面（任务、日志、缓存、服务器）
│   ├── dashboard/        # 仪表盘图表
│   ├── tool/             # 开发工具（代码生成、表单构建）
│   └── error/            # 401、404 页面
├── main.js               # 应用入口 — 注册全局组件和插件
├── permission.js         # 路由守卫（token 检查、动态路由加载）
├── settings.js           # 应用设置（主题、布局开关、地图配置）
└── App.vue               # 根组件
```

## 约定规范
- API 模块：每个资源一个文件，导出命名函数（`listX`、`getX`、`addX`、`updateX`、`delX`）
- 所有 API 调用通过 `src/utils/request.js`（axios 封装，自动注入 Bearer token）
- 组件：PascalCase 目录 + `index.vue` 入口
- 视图：按 `src/views/{模块}/` 组织，与路由结构对应
- 全局组件在 `main.js` 中注册：Pagination、RightToolbar、Editor、FileUpload、ImageUpload、ImagePreview、DictTag
- 全局原型方法：`getDicts`、`parseTime`、`resetForm`、`handleTree`、`download` 等
- 认证：JWT token 存储在 cookie `Admin-Token` 中，通过 axios 拦截器注入
- 路由：`constantRoutes`（公开）+ `dynamicRoutes`（权限控制，从后端菜单加载）
- 权限：基于角色（`roles`）和菜单权限（`permissions`），配置在路由 meta 中
