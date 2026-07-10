## 1. 架构设计

```mermaid
layeredGraph LR
    subgraph "前端应用"
        A[UI层] --> B[组件层]
        B --> C[工具函数层]
        C --> D[数据处理层]
    end
    subgraph "本地存储"
        E[localStorage]
    end
    A --> E
```

## 2. 技术栈

- **前端框架**: Vue 3.4 + TypeScript
- **构建工具**: Vite 6
- **CSS框架**: TailwindCSS 3
- **图标库**: Lucide Vue Next
- **代码高亮**: Prism.js
- **二维码生成**: qrcode
- **差异对比**: diff
- **状态管理**: Vue Composition API (响应式)
- **路由**: Vue Router 4

## 3. 路由定义

| 路由 | 用途 |
|------|------|
| / | 首页，展示所有工具入口 |
| /variable-converter | 变量名转换工具 |
| /text-diff | 文本比较工具 |
| /json-beautify | JSON美化格式化工具 |
| /json-diff | JSON对比工具 |
| /qr-code | 二维码生成工具 |
| /url-encoder | URL编码解码工具 |

## 4. 项目结构

```
src/
├── components/           # 通用组件
│   ├── NavBar.vue        # 导航栏组件
│   ├── ToolCard.vue      # 工具卡片组件
│   ├── InputArea.vue     # 输入区域组件
│   ├── OutputArea.vue    # 输出区域组件
│   └── Toast.vue         # Toast提示组件
├── views/               # 页面视图
│   ├── Home.vue          # 首页
│   ├── VariableConverter.vue
│   ├── TextDiff.vue
│   ├── JsonBeautify.vue
│   ├── JsonDiff.vue
│   ├── QrCode.vue
│   └── UrlEncoder.vue
├── utils/               # 工具函数
│   ├── variable.ts       # 变量名转换逻辑
│   ├── text.ts           # 文本处理逻辑
│   ├── json.ts           # JSON处理逻辑
│   ├── qrcode.ts         # 二维码生成逻辑
│   └── url.ts            # URL编码解码逻辑
├── router/              # 路由配置
│   └── index.ts
├── styles/              # 全局样式
│   └── main.css
├── App.vue              # 根组件
└── main.ts              # 入口文件
```

## 5. 核心功能实现说明

### 5.1 变量名转换
- 输入: 任意格式的变量名
- 输出: camelCase、snake_case、kebab-case、PascalCase、UPPER_SNAKE_CASE
- 算法: 使用正则表达式匹配单词边界，根据目标格式重新拼接

### 5.2 文本比较
- 输入: 两段文本
- 输出: 差异高亮显示
- 算法: 使用diff库进行行级差异比较，生成差异对象并渲染

### 5.3 JSON美化
- 输入: 压缩或格式混乱的JSON字符串
- 输出: 格式化后的JSON，带语法高亮
- 算法: JSON.parse解析，JSON.stringify格式化，Prism.js高亮

### 5.4 JSON对比
- 输入: 两个JSON字符串
- 输出: 可视化差异，标记新增/修改/删除的键值对
- 算法: 递归遍历两个对象，比较每个层级的差异

### 5.5 二维码生成
- 输入: 文本或URL
- 输出: SVG格式的二维码图片
- 算法: 使用qrcode库生成二维码数据，渲染为SVG

### 5.6 URL编码解码
- 输入: URL或编码后的文本
- 输出: 编码/解码结果
- 算法: 使用encodeURIComponent/decodeURIComponent

## 6. 状态管理

- 使用Vue 3 Composition API的响应式系统
- 每个工具组件内部管理自己的状态
- localStorage保存用户的最近使用记录和主题偏好

## 7. 性能优化

- 组件懒加载，按需导入
- 输入防抖，避免频繁计算
- 代码高亮使用虚拟滚动（长文本）
- 缓存计算结果，相同输入直接返回缓存