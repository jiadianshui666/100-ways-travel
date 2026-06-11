# 核心 Prompt 记录文档

> 作业要求：记录引导 AI 开发的最核心原始 Prompt，明确标记每个阶段对应的开发范式（SDD / DDD / TDD / E2E）。

---

## 【SDD 阶段】数据建模与 API 契约生成

### Prompt 1：项目脚手架 + 数据模型 + API 契约

```
帮我建一个 Next.js 14 全栈项目 "100-ways-travel"，使用 App Router + TypeScript。

数据层：SQLite + Prisma 7，定义3张核心表：
- User（id/name/email/passwordHash/role）
- Category（id/name/slug/description/icon）
- TravelExperience（id/title/slug/description/location/price/duration/images/featured/published/authorId/categoryId）

工具层：zod（输入校验）、jose（JWT HS256）、bcryptjs（密码哈希）、react-hook-form（表单）

API 契约：
- GET /api/experiences?category=&featured=&sort=&page=&limit= → { data[], pagination }
- GET /api/experiences/[slug] → 单条详情
- GET /api/experiences/search?q= → 全文搜索
- GET /api/categories → 分类列表
- POST /api/admin/login → JWT 登录
- GET/POST/PUT/DELETE /api/admin/experiments → 管理 CRUD
- GET/POST/PUT/DELETE /api/admin/categories → 分类 CRUD

样式：Tailwind CSS 暗色霓虹风（青#00f0ff/粉#ff2d95/紫#7c3aed），玻璃态卡片，自定义动画。

最后配好 vitest + playwright，git init 提交。
```

**意图与挑战**：项目从零起步，需要一次性建立完整的技术栈骨架。挑战在于 Prisma 7 的适配器配置——需要手动安装 `@prisma/adapter-better-sqlite3` 并在 `prisma.config.ts` 中配置，否则客户端无法连接 SQLite。同时 Zod 4 的类型系统与 `@hookform/resolvers` 存在兼容性问题，通过 `z.preprocess` 替代 `z.coerce` 解决。

---

### Prompt 2：种子数据 + 完整 API 实现

```
写种子脚本 prisma/seed.ts：1个管理员（admin@100ways.com/admin123）、
5个分类（城市探索/自然风光/美食之旅/极限冒险/文化体验）、
8条高质量旅行体验（覆盖冰岛极光/东京拉面/巴黎卢浮宫/尼泊尔徒步/成都美食/京都禅修/新西兰跳伞/曼谷水上市场），
每条包含3张Unsplash图片URL。

建全部16个API路由，用 Zod safeParse 校验输入，JWT 鉴权中间件 requireAdmin，
统一响应格式（ok/created/badRequest/unauthorized/notFound/serverError helpers），
分页 parsePagination(page,limit→skip,take)。跑通 curl 验证后 git commit。
```

**意图与挑战**：填充真实感的种子数据是 MVP 可演示的关键。挑战在于 API 的错误处理——初期版本没有统一 try/catch，Prisma 异常会直接暴露 HTML 错误页。后续通过 `withErrorHandler` 包装器解决。另外需要确保种子脚本的 PrismaClient 实例化方式与运行时一致。

---

## 【DDD 阶段】前端组件与页面生成

### Prompt 3：设计系统 + UI 组件库

```
做布局和设计系统：Header（固定顶部毛玻璃导航+滚动背景渐显）、Footer、
移动端汉堡菜单、全套UI组件（Badge/NicheLevelBadge/FilterChip/Pagination/
EmptyState/ErrorState/LoadingSkeleton/ConfirmDialog/Toaster），
全局暗色霓虹风格（青#00f0ff 粉#ff2d95 紫#7c3aed），
Inter + Space Grotesk 字体，玻璃态卡片(.glass/.glass-strong)和
霓虹发光(.text-glow-*/ .border-glow-*/ .btn-neon-*)工具类，
自定义动画(glow-pulse/neon-flicker/shimmer/slide-up/fade-in/scale-in)。

设计要求：每个像素都要有"不可思议"的视觉冲击力——卡片hover时玻璃态加深+
霓虹边框发光，骨架屏要有流动shimmer动画，空状态要有情感化插画感。
git commit。
```

**意图与挑战**：这是设计驱动开发的核心阶段——先建立视觉语言再写业务组件。挑战在于 Tailwind 自定义插件的边界：`addUtilities` vs `@layer components` 的选择影响样式优先级。最终选择 `addUtilities` 确保 glass/neon 类始终生效。另外暗色模式硬编码为 `dark`，暂未做亮色切换（符合 MVP 定位）。

---

### Prompt 4：首页 + 详情页 + 搜索页

```
做首页：全屏Hero（Canvas渐变网格+浮动光球动画）、横向滚动分类标签栏、
精选体验横滑卡片区、筛选栏（分类+排序）、响应式三列体验卡片网格+加载更多。
ExperienceCard做成毛玻璃卡片hover上浮+霓虹发光边框。
写好useExperiences/useCategories/useScrollAnimation三个hook。

做详情页：全宽视差Hero大图+标题叠加、MetaBar（地点/价格/时长/作者）、
InfoCards（时长等级/预算区间/最佳季节自动推算）、StorySection正文故事区、
ImageGallery带Lightbox（键盘←→Escape导航+底部缩略图）、
CommentSection评论区、FavoriteButton收藏按钮、
RelatedExperiences同分类3个推荐。
SEO：generateMetadata动态生成OG标签。

做搜索页：大输入框自动聚焦、useSearch hook（400ms防抖+AbortController取消前次请求）、
搜索结果网格、空/加载/错误状态全覆盖。
git commit。
```

**意图与挑战**：这是用户感知最强的阶段，需要每个交互细节都打磨到位。挑战在于状态管理——多个数据 hook 之间需要协调（筛选条件变化→重置分页→重新请求），以及 Lightbox 的键盘导航无障碍实现。另外 SEO 的 `generateMetadata` 需要在服务端查 Prisma，与客户端渲染的页面组件形成了混合渲染模式。

---

### Prompt 5：后台管理系统

```
做后台管理：useAuth hook（React Context + localStorage持久化）、
AdminGuard鉴权路由守卫、登录页（react-hook-form+zod校验+错误提示+登录中状态）、
AdminLayout（左侧导航+顶栏+内容区）、
仪表盘（5个统计卡片：总数/已发布/精选/浏览/分类，骨架屏加载态）、
体验管理（表格列表+搜索+排序+分页、创建/编辑表单react-hook-form+zod+
自动slug生成+useFieldArray动态图片行增删+实时预览、删除确认弹窗+Toast）、
分类管理（列表含体验数、内联创建/编辑、删除保护-有关联体验时禁止删除）。
git commit。
```

**意图与挑战**：后台是运营闭环的关键。挑战在于双布局策略——`(admin)` Route Group 实现登录页独立布局 vs 管理页带侧边栏布局，以及 `AdminGuard` 的鉴权重定向时机（需要等 `AuthProvider` 的 `loading` 状态结束再判断）。另外 `ExperienceForm` 的 Zod schema 与 `lib/validations.ts` 存在重复——表单需要 `z.preprocess` 做字符串→数字转换，API 用 `z.number()`，最终提取 `travelExperienceFormSchema` 统一管理。

---

## 【TDD 阶段】核心逻辑的测试用例编写与业务实现

### Prompt 6：单元测试 + API 集成测试 + 组件测试

```
写完整测试套件，用 Vitest：

tests/lib/ 下三个文件：
- auth.test.ts：JWT 签名/验证/过期/篡改/空token等12+条用例（@vitest-environment node）
- utils.test.ts：cn/slugify/formatPrice/parseImages各2-3条用例
- validation.test.ts：registerSchema/loginSchema/categorySchema/travelExperienceSchema各3-5条用例

tests/api/ 下四个文件：
- experiences.test.ts：分页/分类筛选/精选筛选/排序/无效参数兜底等10+条
- search.test.ts：空查询/正常搜索/无结果/分页/特殊字符等8+条
- categories.test.ts：列表/排序/分类含体验数等8+条
- admin.test.ts：登录成功/错误密码/无权限/未登录/CRUD等15+条

tests/components/ 下四个文件：
- ExperienceCard.test.tsx：渲染标题/价格/地点/图片/链接
- FilterBar.test.tsx：渲染筛选按钮/点击切换/排序下拉
- SearchInput.test.tsx：渲染/输入/清除/防抖
- ExperienceForm.test.tsx：渲染表单字段/校验错误提示/提交按钮

全部跑通 npm test 绿灯后 git commit。
```

**意图与挑战**：测试驱动阶段的核心是"先写测试，再完善实现"。挑战在于 API 测试依赖运行中的 dev server——通过 `serverAvailable()` 函数检测服务器状态，不可用时优雅跳过而非报错。组件测试中 jsdom 环境的 Uint8Array 与 jose 库的内部引用方式不一致，auth 测试需要显式指定 `@vitest-environment node`。另外 Prisma 在 jsdom 中不可用，确保测试不导入 `@/lib` 的 server-only 导出。

---

## 【E2E 阶段】系统级端到端测试与质量闭环

### Prompt 7：Playwright E2E 测试 + CI/CD + Docker

```
写 Playwright E2E 测试，5个spec文件共36条用例：

e2e/01-homepage.spec.ts：页面渲染/Hero区/分类标签/精选横滑/筛选栏/卡片网格/点击跳转详情等7条
e2e/02-experience-detail.spec.ts：详情加载/标题显示/信息卡片/图片画廊/相关推荐等6条
e2e/03-search.spec.ts：空搜索/正常搜索/无结果/加载态等6条
e2e/04-filter-sort-paginate.spec.ts：分类筛选/精选筛选/排序切换/分页加载等8条
e2e/05-admin.spec.ts：登录页渲染/错误密码/正确登录/仪表盘/导航/CRUD等9条

配置 GitHub Actions CI：lint → test → build + e2e job（安装Chromium + 种子数据）
配置 Docker：multi-stage Dockerfile (node:20-alpine) + docker-compose.yml
git commit。
```

**意图与挑战**：E2E 阶段是质量闭环的最后一道防线。挑战在于 GitHub Actions 中需要安装 Chromium 浏览器依赖（`playwright install --with-deps chromium`）以及先运行种子数据确保数据库有可测试内容。另外 E2E 测试的断言设计需要容忍 dev 环境的偶发问题（SSR 错误、网络波动），采用宽松匹配策略（检查关键文本是否存在而非严格对比）。Playwright 配置使用非标准端口 3099 避免与其他服务冲突。

---

## 总结

以上 7 段核心 Prompt 覆盖了从数据建模（SDD）→ 组件设计（DDD）→ 测试驱动（TDD）→ 端到端验证（E2E）的完整开发周期。AI 协作的关键在于：

1. **清晰的需求表达**：每个 Prompt 都明确输入/输出/边界条件
2. **增量式构建**：每阶段独立可验证，不累积问题
3. **及时修正引导**：遇到类型/库兼容性问题时，在下一段 Prompt 中明确修正方向
4. **范式灵活切换**：不同阶段采用不同开发范式，SDD 确保契约正确，DDD 确保体验到位，TDD 确保逻辑可靠，E2E 确保系统完整
