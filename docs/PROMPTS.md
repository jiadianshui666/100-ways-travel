# 核心 Prompts 记录

以下记录了百途旅行项目各开发阶段的核心 Prompt，以及每个阶段的意图和修正说明。

---

## 阶段 1：项目脚手架

### Prompt
```
帮我建一个 100-ways-travel 的 Next.js 14 全栈项目，SQLite + Prisma
（Category/TravelExperience/User 三张表），装好 zod/jose/bcryptjs/
react-hook-form 这些依赖，搭好 src/lib 基础文件，tailwind 走暗色霓虹风，
配好 vitest 和 playwright，最后 git init 提交。
```

### 意图
初始化项目骨架，建立数据模型、工具库、样式主题和测试框架。

### 修正说明
- Prisma 7 需要 `@prisma/adapter-better-sqlite3` 客户端驱动
- 需配置 `prisma.config.ts` 和构造函数 adapter 参数
- Tailwind 自定义插件方式添加 glass/neon 工具类
- vitest.config.ts 需配置 `@` 路径别名

---

## 阶段 2：种子数据 + API

### Prompt
```
写种子数据（5分类8体验+admin），建全部API（公开的experiences列表/详情/分类/搜索，
管理的login+experiences和categories增删改查），Zod校验+JWT鉴权，跑通验证后git commit。
```

### 意图
填充初始数据，搭建完整 REST API，实现 JWT 认证和输入校验。

### 修正说明
- 种子脚本使用 PrismaClient adapter 参数
- API 响应统一使用 `api-utils.ts` 中的 helper 函数
- 分页参数默认值 page=1, limit=10
- `requireAdmin` 中间件检查 role 字段
- 搜索使用 SQLite `contains` 操作符

---

## 阶段 3：布局和设计系统

### Prompt
```
做布局和设计系统：Header（固定顶部毛玻璃导航）、Footer、移动端菜单，
UI组件（Badge、FilterChip、EmptyState、LoadingSkeleton、ErrorState、
NicheLevelBadge、Pagination、ConfirmDialog），全局暗色霓虹风格
（青#00f0ff 粉#ff2d95 紫#7c3aed），Inter+Space Grotesk字体，
玻璃态卡片和霓虹发光工具类，git commit。
```

### 意图
建立统一的设计语言和可复用 UI 组件库。

### 修正说明
- 所有 UI 组件导入 `cn` 需从 `@/lib/utils`（避免客户端打包 prisma）
- Tailwind 插件中使用 `addUtilities` 而非 `@layer` 来注册 glass/neon 类
- `@tailwindcss/plugin` 需导入 `plugin` 函数
- 字体使用 `next/font/google` 的 `Inter` + `Space_Grotesk`

---

## 阶段 4：首页

### Prompt
```
做首页：全屏Hero大图区（渐变网格背景+浮动光球+视差），横向滚动分类标签栏，
精选体验横滑卡片区，筛选栏（视觉风格+小众指数+排序），响应式三列体验卡片
网格+加载更多按钮，ExperienceCard做成毛玻璃卡片带悬停动效，
写好useExperiences和useCategories两个hook，git commit。
```

### 意图
构建完整首页，集成数据 hooks、筛选排序、分页加载。

### 修正说明
- Hero 使用 Canvas 渲染浮动画光球（requestAnimationFrame 循环）
- CategoryTabs 使用 `overflow-x-auto` + `scrollbar-hide` + snap 滚动
- 筛选状态提升到 HomePage 组件统一管理
- 分类选择与风格筛选互斥（选择风格时清除分类，反之亦然）
- useExperiences 支持 loadMore 追加翻页和 refresh 重置

---

## 阶段 5：详情页 + 搜索

### Prompt
```
做体验详情页和搜索：详情页全宽大图Hero带视差+标题叠加+元信息条
+时长预算季节卡片+正文故事区+图片画廊带灯箱+同分类3个相关体验卡片，
搜索页大输入框带防抖+结果网格+空状态/加载骨架/错误状态，
写好useSearch hook，详情页加SEO的generateMetadata，git commit。
```

### 意图
构建内容消费核心页面，完善 SEO 和数据流。

### 修正说明
- 详情页使用服务端组件直接 Prisma 查询（SEO generateMetadata）
- Lightbox 支持键盘 ← → Escape 导航 + 底部缩略图圆点
- InfoCards 自动推算：价格区间标签 + 位置决定最佳季节
- useSearch 使用 AbortController 取消前次请求 + 400ms 防抖
- 搜索空状态/加载态/错误态完整覆盖

---

## 阶段 6：后台管理

### Prompt
```
做后台管理：useAuth hook+AuthProvider、登录页、左侧导航+仪表盘布局、
统计卡片（总数/已发布/精选/浏览量）、体验列表可排序表格+搜索+分页、
体验表单用react-hook-form+zod（创建/编辑双模式含图片预览）、
分类增删改查、所有删除加确认弹窗和Toast提示，git commit。
```

### 意图
构建完整后台管理系统，实现内容运营闭环。

### 修正说明
- 使用 Next.js Route Group `(admin)` 实现登录页独立布局
- AuthProvider 用 React Context + localStorage 持久化
- AdminGuard 控制未登录重定向
- ExperienceForm 自动从标题生成 slug（创建模式）
- useFieldArray 实现动态图片行增删 + 实时预览
- 删除操作统一使用 ConfirmDialog + Toast 反馈

---

## 阶段 7：关于页 + 全局打磨

### Prompt
```
做关于页+整体打磨：品牌故事大标题区、三列价值主张卡片、各页面滚动动效、
移动端适配检查、图片改Next.js Image组件、无障碍语义标签、
所有页面过渡状态补全、加载/空/错误状态兜底，git commit。
```

### 意图
完成全局 polish，确保可访问性、响应式、状态覆盖。

### 修正说明
- 滚动动效使用 IntersectionObserver (`useScrollAnimation` + `ScrollReveal`)
- skip-to-content 链接 + aria-current/aria-expanded/aria-modal
- 所有装饰元素添加 `aria-hidden="true"`
- 统一 `px-4 sm:px-6` 响应式内边距
- 首页各区块包裹 ScrollReveal 实现滚动渐入

---

## 阶段 8-9：测试套件 + E2E

### Prompt
```
写测试：tests/lib 下 validation/auth/utils 三个文件各10-15条用例，
tests/api 下 experiences/categories/search/admin 四个文件覆盖接口核心逻辑和异常路径，
tests/components 下 ExperienceCard/FilterBar/SearchInput/ExperienceForm
四个组件测试覆盖渲染和交互，vitest.config配好路径别名和jsdom，
跑通 npm test 全部绿灯后 git commit。
```

### 意图
建立完整测试体系，确保代码质量和回归防范。

### 修正说明
- auth 测试使用 `@vitest-environment node` 解决 jose Uint8Array 跨域
- API 测试通过 `serverAvailable()` 自动跳过未运行的 dev server
- 组件测试需要使用 `@vitejs/plugin-react` 处理 JSX
- 测试文件从 `src/lib/utils.test.ts` 移动到 `tests/lib/utils.test.ts`

---

## 总结

整个项目通过 10 个阶段的迭代开发完成，每个阶段包含独立的功能模块、验证环节和 git commit。AI 协作的关键在于：**清晰的需求表达**、**增量式构建**、**及时验证**、**详细记录**。
