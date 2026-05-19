# RuoYi-Vue 前端项目

## 项目介绍
RuoYi-Vue 是一个基于 Vue.js 的前端项目，集成了门禁管理、监控中心、报警管理等功能模块。项目采用现代化的前端技术栈，提供了完整的用户界面和交互体验。本项目主要面向企业级应用，提供了丰富的功能组件和完善的权限管理系统。

## 功能特性

### 1. 门禁管理
- 门禁设备管理：支持设备的添加、修改、删除和状态控制
- 门禁记录查询：支持按时间、设备、状态等多维度查询
- 实时状态监控：支持门禁开关状态的实时显示和控制
- 权限管理：支持不同用户对门禁设备的权限控制

### 2. 监控中心
- 实时视频监控：支持多路视频流的实时显示
- 多画面分割：支持单屏、四分屏、六分屏等多种显示模式
- 视频控制：支持视频流的开启、关闭、全屏等操作
- 设备状态：实时显示设备在线状态和连接状态

### 3. 报警管理
- 报警记录：支持报警事件的记录和查询
- 报警处理：支持报警事件的处理和状态更新
- 报警推送：支持报警信息的实时推送
- 报警统计：支持报警数据的统计和分析

### 4. 多语言支持
- 支持中文和英文两种语言
- 支持语言实时切换
- 支持界面元素的动态翻译
- 支持系统提示信息的多语言显示

### 5. 响应式设计
- 自适应布局：适配不同尺寸的显示设备
- 移动端支持：支持在移动设备上访问
- 界面优化：针对不同设备进行界面优化
- 交互优化：针对触摸设备优化交互体验

## 技术栈

### 1. 核心框架
- Vue.js 2.x：渐进式 JavaScript 框架
- Vuex：状态管理
- Vue Router：路由管理
- Element UI：基于 Vue 的组件库

### 2. 网络请求
- Axios：基于 Promise 的 HTTP 客户端
- WebSocket：实时通信
- RESTful API：标准的接口规范

### 3. 工具库
- moment.js：日期时间处理
- lodash：实用工具库
- echarts：图表库
- file-saver：文件保存

### 4. 开发工具
- ESLint：代码检查
- Prettier：代码格式化
- Babel：JavaScript 编译器
- Webpack：模块打包工具

## 开发环境要求

### 1. 基础环境
- Node.js >= 12.0.0
- npm >= 6.0.0
- Git >= 2.0.0

### 2. 开发工具
- VSCode（推荐）
- Chrome 浏览器
- Vue DevTools

### 3. 系统要求
- Windows 10 或更高版本
- macOS 10.13 或更高版本
- Linux（推荐 Ubuntu 18.04 或更高版本）

## 开发步骤

### 1. 克隆项目
```bash
# 克隆项目
git clone https://gitee.com/y_project/RuoYi-Vue

# 进入项目目录
cd ruoyi-ui
```

### 2. 安装依赖
```bash
# 使用 npm 安装依赖
npm install

# 如果下载速度慢，可以使用国内镜像源
npm install --registry=https://registry.npmmirror.com
```

### 3. 启动开发服务器
```bash
# 启动开发服务器
npm run dev

# 启动开发服务器（指定端口）
npm run dev -- --port 8080
```

### 4. 访问项目
- 开发环境：http://localhost:80


## 项目构建

### 1. 构建测试环境
```bash
# 构建测试环境
npm run build:stage

# 构建测试环境（指定环境变量）
npm run build:stage -- --mode test
```

### 2. 构建生产环境
```bash
# 构建生产环境
npm run build:prod

# 构建生产环境（指定环境变量）
npm run build:prod -- --mode production
```

## 项目结构
```
ruoyi-ui/
├── public/                 # 静态资源
│   ├── favicon.ico        # 网站图标
│   └── index.html         # HTML 模板
├── src/                    # 源代码
│   ├── api/               # API 接口
│   │   ├── system/       # 系统管理接口
│   │   └── user/         # 用户管理接口
│   ├── assets/            # 主题、字体等静态资源
│   │   ├── images/       # 图片资源
│   │   └── styles/       # 样式文件
│   ├── components/        # 全局公用组件
│   │   ├── Breadcrumb/   # 面包屑组件
│   │   └── SvgIcon/      # SVG 图标组件
│   ├── layout/            # 全局 layout
│   │   ├── components/   # 布局组件
│   │   └── index.vue     # 布局入口
│   ├── router/            # 路由
│   │   └── index.js      # 路由配置
│   ├── store/             # 全局 store管理
│   │   ├── modules/      # store 模块
│   │   └── index.js      # store 入口
│   ├── utils/             # 全局公用方法
│   │   ├── auth.js       # 权限相关
│   │   └── request.js    # 请求封装
│   ├── views/             # views 所有页面
│   │   ├── system/       # 系统管理页面
│   │   └── user/         # 用户管理页面
│   ├── App.vue            # 入口页面
│   └── main.js            # 入口文件
├── .env.xxx               # 环境变量配置
├── .eslintrc.js          # eslint 配置项
├── .gitignore            # git 忽略项
├── babel.config.js       # babel-loader 配置
├── package.json          # package.json
└── vue.config.js         # vue-cli 配置
```

## 开发规范

### 1. 代码规范
- 使用 ESLint 进行代码检查
- 使用 Prettier 进行代码格式化
- 遵循 Vue.js 官方风格指南
- 使用 TypeScript 进行类型检查

### 2. 命名规范
- 文件夹：小写字母，多个单词用连字符（-）连接
- 组件：大驼峰命名（PascalCase）
- 变量：小驼峰命名（camelCase）
- 常量：大写字母，多个单词用下划线（_）连接

### 3. 注释规范
- 文件头部添加文件说明
- 复杂逻辑添加详细注释
- 组件添加功能说明
- API 接口添加参数说明

## 注意事项
1. 建议不要直接使用 cnpm 安装依赖，可能会有各种诡异的 bug
2. 如果使用 npm 安装依赖较慢，建议使用国内镜像源
3. 确保 Node.js 和 npm 版本符合要求
4. 开发时请遵循项目的代码规范
5. 提交代码前进行代码格式化和检查
6. 注意保护敏感信息，不要提交到代码仓库

## 常见问题

### 1. 依赖安装问题
- 问题：依赖安装失败
- 解决方案：
  1. 删除 node_modules 文件夹
  2. 删除 package-lock.json 文件
  3. 清除 npm 缓存：npm cache clean --force
  4. 重新安装依赖：npm install

### 2. 端口占用问题
- 问题：开发服务器端口被占用
- 解决方案：
  1. 在 vue.config.js 中修改端口配置
  2. 关闭占用端口的进程
  3. 使用其他可用端口

### 3. 跨域问题
- 问题：接口请求跨域
- 解决方案：
  1. 检查后端接口配置
  2. 配置代理服务器
  3. 设置 CORS 响应头

### 4. 性能优化
- 问题：页面加载速度慢
- 解决方案：
  1. 使用路由懒加载
  2. 优化图片资源
  3. 使用 CDN 加速
  4. 开启 Gzip 压缩

## 贡献指南

### 1. 提交规范
- feat: 新功能
- fix: 修复 bug
- docs: 文档更新
- style: 代码格式
- refactor: 重构
- test: 测试
- chore: 构建过程或辅助工具的变动

### 2. 提交流程
1. Fork 本仓库
2. 创建新的功能分支
3. 提交代码
4. 创建 Pull Request

### 3. 代码审查
- 确保代码符合规范
- 添加必要的测试
- 更新相关文档
- 确保所有测试通过

## 版本历史
- v1.0.0 (2023-01-01)
  - 初始版本发布
  - 基础功能实现
- v1.1.0 (2023-02-01)
  - 添加多语言支持
  - 优化用户界面
- v1.2.0 (2023-03-01)
  - 添加新功能模块
  - 修复已知问题

## 版权说明
版权所有：广东中科凯泽信息科技有限公司

