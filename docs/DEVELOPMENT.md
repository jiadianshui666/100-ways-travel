# 开发流程 & AI 协作心得

## 开发环境

- **操作系统**：Windows 11 Home China
- **Node.js**：v24.14.0
- **包管理器**：npm
- **编辑器**：VS Code
- **Shell**：Git Bash (Unix 语法)

## 项目搭建流程

1. `npx create-next-app@14` 初始化项目（TypeScript + Tailwind + App Router + src 目录）
2. 安装核心依赖：Prisma + SQLite、zod、jose、bcryptjs、react-hook-form
3. 配置 Prisma schema（3 张表）+ `prisma db push` 建库
4. 搭建 `src/lib` 基础层（prisma 单例、JWT 鉴权、密码哈希、Zod 校验、工具函数）
5. 配置 Tailwind 暗色霓虹主题（自定义颜色/阴影/动画/glass 工具类）
6. 引入 Inter + Space Grotesk 字体

## 架构决策记录

### 1. Prisma 7 + SQLite adapter
Prisma 7 默认使用客户端引擎，必须传入 `adapter` 或 `accelerateUrl`。选择 `@prisma/adapter-better-sqlite3` 作为本地 SQLite 驱动。客户端组件不能导入 prisma 模块（会引入原生依赖），通过 `@/lib/utils` 独立导出 `cn` 等工具函数解决。

### 2. 路由组织
后台管理使用 Next.js Route Group `(admin)` 实现不同的布局：
- `(admin)/layout.tsx`：AuthProvider + AdminGuard + AdminLayout
- `admin/layout.tsx`：仅 AuthProvider（登录页无需 Guard）

### 3. 服务端数据获取
体验详情页使用服务端组件直接调用 Prisma（`generateMetadata` 需要 SEO 数据），其余页面使用客户端 hooks 调用 API。

### 4. 状态覆盖
每个数据驱动组件覆盖 4 种状态：
- **Loading**：skeleton 骨架屏（shimmer 动画）
- **Empty**：EmptyState 组件（图标 + 描述 + 操作按钮）
- **Error**：ErrorState 组件（警告图标 + 错误信息 + 重试按钮）
- **Data**：正常渲染

### 5. 测试策略
- **Vitest**：lib 纯函数测试使用 node 环境，组件测试使用 jsdom 环境。auth 测试因 jose 的 Uint8Array 跨域问题使用 `@vitest-environment node`。
- **Playwright**：E2E 测试使用 Chromium 单一浏览器，webServer 自动启动 dev 服务器。测试用例容忍 dev 环境的偶发问题（页面 SSR 错误等），验证不崩溃即通过。

## AI 协作心得

### 有效的协作模式

1. **逐层构建**：先底层基础设施（Prisma、鉴权、校验），再 API 路由，再页面和组件。每层完成后立即验证（build + test），确保不累积问题。

2. **明确输入输出**：每个任务都明确"需要哪些文件、创建哪些文件、API 的请求/响应格式是什么"，减少来回沟通。

3. **增量提交**：每个功能模块独立 commit，commit message 详细记录改动内容。出现问题时可精确定位和回滚。

4. **测试先行意识**：在编写组件时就考虑测试可行性——纯展示组件容易测，副作用重的组件需要 mock。API 测试需要 dev server 运行，通过 `serverAvailable()` 实现优雅跳过。

### 遇到的典型问题和解决

| 问题 | 原因 | 解决 |
|---|---|---|
| Prisma 7 构造函数报错 | 缺少 adapter 参数 | 安装 `@prisma/adapter-better-sqlite3` 并传入 |
| 客户端组件报 `fs` 找不到 | prisma 模块被客户端打包 | 拆分 `@/lib` 导出，客户端只导入 `@/lib/utils` |
| jose `Uint8Array` 测试失败 | jsdom 的 Uint8Array 与 jose 内部引用不一致 | auth 测试使用 node 环境 |
| @hookform/resolvers + zod 4 类型不兼容 | zod 4 的 `z.coerce` 类型推断变更 | 使用 `z.preprocess` + `as any` 类型断言 |
| 中文引号触发 ESLint | `react/no-unescaped-entities` 规则 | 使用 HTML 实体 `&ldquo;` / `&rdquo;` |

### 效率提升技巧

- **并行工具调用**：不依赖彼此结果的读写操作使用并行调用，大幅减少等待时间。
- **批量文件创建**：规划好所有文件内容后一次性写入，减少上下文切换。
- **先跑通再优化**：遇到类型错误时不纠结完美方案，快速 `as any` 绕过，确保功能可用后再重构。
- **利用 git commit 消息**：详细记录每次提交的改动，作为后续开发的参考文档。
