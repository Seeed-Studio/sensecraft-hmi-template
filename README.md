# SenseCraft HMI Template

一个具有现代设计感的多功能展示页面。灵感来源于红点设计奖作品，采用简约的设计语言。专为 800x480 分辨率优化的深黑色主题设计。

## 功能特点

### 主页导航
- 功能导航目录，展示所有可用功能
- 简洁的卡片式设计，方便选择

### Time Clock
- 实时数字时钟显示
- 简约主义设计风格
- 支持通过 `/time-clock` 路由直接访问时钟页面

### World Clock
- 世界时钟显示（支持多个时区）
- 支持通过 `/world-clock` 路由访问世界时钟页面

### GitHub 组织数据展示
- Seeed-Studio GitHub 组织核心数据统计
- 包括 Total Stars、Followers、Repositories、Public Members
- 本地缓存机制，避免 API 限流
- 支持通过 `/github-org` 路由访问

## 技术栈

- Next.js 13+ (App Router)
- TailwindCSS
- TypeScript
- date-fns (时间处理)

## 开发环境设置

1. 克隆项目
```bash
git clone [your-repository-url]
cd dynamic-time-display
```

2. 安装依赖
```bash
npm install
```

3. 启动开发服务器
```bash
npm run dev
```

4. 构建生产版本
```bash
npm run build
```

## Cloudflare Pages 部署

1. Fork 此仓库到你的 GitHub 账号
2. 在 Cloudflare Pages 中创建新项目
3. 选择你 fork 的仓库
4. 设置构建配置：
   - 构建命令：`npm run build`
   - 构建输出目录：`.next`
   - Node.js 版本：18.x

## 项目结构

```
├── app/                 # Next.js 13 App Router
│   ├── page.tsx        # 主页面
│   ├── layout.tsx      # 根布局
│   ├── globals.css     # 全局样式
│   ├── time-clock/     # 时钟页面路由
│   │   └── page.tsx    # 时钟页面组件
│   └── world-clock/    # 世界时钟页面路由
│       └── page.tsx    # 世界时钟页面组件
├── components/         # React 组件
│   ├── TimeDisplay.tsx # 时间显示组件
│   └── WorldClock.tsx  # 世界时钟组件
├── styles/            # 样式文件
└── public/            # 静态资源
```

## 使用说明

1. 主页面：访问网站根路径 `/` 即可查看主页面
2. 时钟页面：访问 `/time-clock` 路径可直接查看时钟显示界面
3. 世界时钟：访问 `/world-clock` 路径可查看世界各地时间

页面会自动适应设备的深色/浅色模式。

## 更新日志

### v1.4.0
- 新增世界时钟功能
- 支持多个时区显示
- 优化时钟显示效果
- 新增导航菜单

### v1.3.0
- 新增独立的时钟页面路由 `/time-clock`
- 优化时钟页面布局

### v1.2.0
- 优化界面适配 800x480 分辨率
- 更新为深黑色主题设计
- 优化表盘布局和尺寸

### v1.1.0
- 移除页面切换动效
- 优化页面性能

### v1.0.0
- 初始版本发布
- 实现基础时间显示功能
- 支持主题切换

## 新增功能：GitHub 组织数据展示

### 用途

通过 `/github-org` 页面，可以一键查看 Seeed-Studio GitHub 组织的核心数据，包括：
- 粉丝数（followers）
- 仓库数（repositories）
- 项目数（projects）
- 公开成员数（people）
- 组织头像、简介、主页链接
- *Discussions 数量暂不支持统计*

### 使用方法

1. 启动开发服务器：
   ```bash
   npm run dev
   ```
2. 在浏览器访问：
   ```
   http://localhost:3000/github-org
   ```
3. 页面会自动展示 Seeed-Studio 组织的最新数据，并每10分钟自动刷新。

### 字段说明
- 粉丝数：关注该组织的 GitHub 用户数量
- 仓库数：该组织下的公开仓库数量
- 项目数：该组织下的公开项目数量（如未启用则为0）
- 公开成员数：该组织公开展示的成员数量
- Discussions：GitHub API 暂不支持直接统计组织下所有讨论数

### 设计说明
- 页面风格简洁，黑白主题，适配 800x480 分辨率
- 代码有详细注释，便于理解和二次开发 