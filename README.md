# 檬橙IT工具箱

[![Vue 3](https://img.shields.io/badge/Vue-3.4-4FC08D?logo=vue.js)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0-646CFF?logo=vite)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)

一款面向 IT 开发者的实用工具集合，提供变量名转换、文本比较、JSON 处理、二维码生成等常用功能。所有操作均在本地浏览器运行，数据不上传服务器，安全可靠。

## 功能模块

### 文本工具

| 工具 | 说明 |
|------|------|
| **变量名转换** | 支持驼峰式、帕斯卡式、下划线式、中划线式、大写下划线等多种命名风格互转 |
| **文本比较** | 对比两段文本差异，高亮显示新增/删除内容，支持行号对照 |

### 数据工具

| 工具 | 说明 |
|------|------|
| **JSON 美化** | 将压缩 JSON 格式化为易读缩进格式，支持自定义缩进和压缩模式 |
| **JSON 对比** | 对比两个 JSON 对象差异，支持嵌套结构深度对比，标记新增/删除/修改键值 |

### 编码工具

| 工具 | 说明 |
|------|------|
| **URL 编码解码** | 对 URL 进行编码和解码操作，支持组件编码和完整 URL 编码 |

### 生成工具

| 工具 | 说明 |
|------|------|
| **二维码生成** | 将文本/URL 转换为二维码，支持自定义尺寸、颜色、样式、中心图标 |
| **Crontab 生成器** | 可视化配置定时任务，生成 Crontab 表达式，预览未来执行时间 |

### 数据库工具

| 工具 | 说明 |
|------|------|
| **IN 条件生成** | 将数据列表转换为 SQL IN 条件，支持分段、去重、排序 |

## 功能亮点

- **本地运行** — 所有功能均在浏览器本地执行，数据不上传服务器
- **实时预览** — 输入即响应，实时查看结果
- **一键复制** — 快速复制结果到剪贴板
- **深色模式** — 支持浅色/深色主题切换，保护视力
- **响应式设计** — 适配桌面端和移动端
- **无广告纯净** — 无广告、无弹窗、无干扰

## 技术栈

- **前端框架**: Vue 3 + TypeScript
- **构建工具**: Vite 5
- **样式框架**: TailwindCSS 3
- **图标库**: Lucide Vue Next
- **二维码**: qrcode
- **文本差异**: diff

## 快速开始

### 环境要求

- Node.js >= 18.0
- npm >= 9.0

### 安装运行

```bash
# 克隆项目
git clone https://github.com/Anskory/mengch-it-tools.git

# 进入目录
cd mengch-it-tools

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览构建结果
npm run preview
```

### 访问地址

开发服务器启动后，访问 http://localhost:5173

## 项目结构

```
mengch-it-tools/
├── public/              # 静态资源
│   └── cv.png           # 网站 Logo
├── src/
│   ├── components/      # 公共组件
│   │   ├── NavBar.vue   # 侧边栏导航
│   │   ├── ToolCard.vue # 工具卡片
│   │   └── Toast.vue    # 提示消息
│   ├── composables/     # 组合式函数
│   │   └── useTheme.ts  # 主题切换
│   ├── pages/           # 功能页面
│   │   ├── HomePage.vue          # 首页
│   │   ├── VariableConverter.vue # 变量名转换
│   │   ├── TextDiff.vue          # 文本比较
│   │   ├── JsonBeautify.vue      # JSON 美化
│   │   ├── JsonDiff.vue          # JSON 对比
│   │   ├── QrCode.vue            # 二维码生成
│   │   ├── UrlEncoder.vue        # URL 编码解码
│   │   ├── InConditionGenerator.vue # IN 条件生成
│   │   └── CrontabGenerator.vue  # Crontab 生成器
│   ├── router/          # 路由配置
│   │   └── index.ts
│   ├── utils/           # 工具函数
│   │   ├── variable.ts  # 变量名转换
│   │   ├── text.ts      # 文本处理
│   │   ├── json.ts      # JSON 处理
│   │   ├── url.ts       # URL 编解码
│   │   └── qrcode.ts    # 二维码生成
│   ├── App.vue          # 根组件
│   ├── main.ts          # 入口文件
│   └── style.css        # 全局样式
├── index.html           # HTML 入口
├── package.json         # 项目配置
├── vite.config.ts       # Vite 配置
├── tailwind.config.js   # TailwindCSS 配置
└── tsconfig.json        # TypeScript 配置
```

## 贡献指南

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 提交 Pull Request

## 开发计划

- [ ] 正则表达式测试工具
- [ ] Base64 编码解码
- [ ] MD5/SHA 加密
- [ ] 时间戳转换
- [ ] 颜色选择器
- [ ] 图片压缩
- [ ] 更多工具...

## 许可证

MIT License

## 联系方式

- 作者: 檬橙
- 网站: https://www.mengch.com
- 备案号: [桂ICP备2021007060号](https://beian.miit.gov.cn/)