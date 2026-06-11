# 开发过程思路 & 工作流说明

## 一、开发流程：如何通过 Claude Code + Deepseek V4 Pro 进行开发

### 1.1 工作流总览

本次开发采用 **"分阶段范式切换"** 的策略，将整个项目拆解为 4 个核心阶段，每个阶段采用不同的开发范式以最大化 AI 协同效能：

```
SDD（契约驱动）     →   DDD（设计驱动）    →   TDD（测试驱动）    →   E2E（质量闭环）
数据模型 + API契约      组件库 + 视觉系统      单元/集成测试          端到端验证 + CI/CD
```

### 1.2 各阶段具体操作

**阶段一：SDD — 数据建模与 API 契约（约 2 小时）**

1. 首先在 Claude Code 中用一段结构化 Prompt 定义全部数据模型（3→5 张表）、API 路由（16 个端点）和工具层架构
2. AI 生成 `prisma/schema.prisma`、全部 `src/lib/` 基础文件、API 路由骨架
3. 立即运行 `prisma db push` + `curl` 验证每个端点，发现类型/适配器问题当场修正
4. 种子数据填充 8 条高质量体验，确保前后端联调有真实内容

**阶段二：DDD — 前端组件与视觉系统（约 3 小时）**

1. 先建设计系统——Tailwind 霓虹主题插件、glass/neon 工具类、全局 CSS 变量、动画关键帧
2. 再建 UI 组件库——Badge、Pagination、EmptyState、ErrorState、LoadingSkeleton 等 10+ 个组件
3. 最后建业务页面——首页（Hero+分类+筛选+卡片网格）、详情页（视差+画廊+评论+收藏）、搜索页、关于页
4. 每个页面完成后立即在浏览器验证视觉效果和交互

**阶段三：TDD — 测试驱动核心逻辑（约 2 小时）**

1. 先写 `tests/lib/` 纯函数测试（auth、utils、validations）——无外部依赖，快速跑通
2. 再写 `tests/api/` 集成测试——需要 dev server 运行，通过 `serverAvailable()` 优雅跳过
3. 最后写 `tests/components/` 组件测试——jsdom 环境，验证渲染和交互
4. 每写完一个测试文件立即 `vitest run` 验证，修复失败用例后 commit

**阶段四：E2E — 端到端质量闭环（约 1.5 小时）**

1. 写 Playwright 测试覆盖全部 5 个核心用户旅程
2. 配置 GitHub Actions CI（lint + test + build + e2e）
3. 配置 Docker 多阶段构建 + docker-compose
4. 最终代码审查和安全加固

### 1.3 工具链

| 工具 | 用途 |
|------|------|
| **Claude Code** | 主体开发环境，所有代码生成和修改的唯一入口 |
| **Deepseek V4 Pro** | 底层大模型，提供代码生成和推理能力 |
| **Superpowers 插件** | Claude Code 技能系统（Skills），用于项目管理、代码审查、测试运行等 |
| **Prisma 7** | ORM，Schema 定义后自动生成类型安全的客户端 |
| **Vitest + Playwright** | 测试框架，覆盖单元/集成/E2E 三层 |

---

## 二、与 AI 协同中遇到的典型问题及解决路径

### 问题 1：Prisma 7 适配器配置（SDD 阶段）

**现象**：`prisma db push` 成功，但运行 seed 脚本时报错 `PrismaClient must be constructed with an adapter`。

**分析**：Prisma 7 默认使用客户端引擎（需 `accelerateUrl`），SQLite 本地使用必须显式传入 `PrismaBetterSqlite3` 适配器。

**解决路径**：
1. 查阅 Prisma 7 文档确认 adapter 模式
2. 安装 `@prisma/adapter-better-sqlite3`
3. 在 `lib/prisma.ts` 和 `prisma/seed.ts` 中统一使用 `new PrismaBetterSqlite3({ url })` 构造 adapter
4. 使用 `globalThis` 缓存 PrismaClient 实例避免开发环境热重载创建多个连接

### 问题 2：Zod 4 + react-hook-form 类型不兼容（DDD 阶段）

**现象**：`zodResolver(schema)` 报 TypeScript 类型错误，`z.coerce` 的类型推断与 `@hookform/resolvers` 不兼容。

**分析**：Zod 4 的 `z.coerce` 类型系统有 breaking change，`@hookform/resolvers` 尚未完全适配。

**解决路径**：
1. 将 `z.coerce.number()` 替换为 `z.preprocess((v) => Number(v ?? 0), z.number())`
2. 在 `resolver` 赋值处使用 `as any` 类型断言并添加 `eslint-disable` 注释
3. 将表单专用 schema（`travelExperienceFormSchema`）与 API schema（`travelExperienceSchema`）分离，各自处理不同输入格式
4. 此方案在 `DEVELOPMENT.md` 中记录为已知权衡，待上游库更新后移除

### 问题 3：jose 库在 jsdom 环境下的 Uint8Array 跨域问题（TDD 阶段）

**现象**：auth 测试在 jsdom 环境下报 `Uint8Array` 相关错误，`jose` 的 `SignJWT.sign()` 失败。

**分析**：jsdom 的 `Uint8Array` 实现与 Node.js 原生实现有差异，jose 内部依赖 `Buffer.from()` 做编码转换，在 jsdom 中行为不一致。

**解决路径**：
1. 确认这是测试环境特有问题，生产代码（Node.js 运行时）不受影响
2. 在 auth 测试文件顶部添加 `@vitest-environment node` 指令覆盖 jsdom
3. API 集成测试通过真实 HTTP 请求调用（dev server 运行在 Node 环境），不直接导入 auth 模块

---

## 三、对"工程化 AI 开发"的理解

本次作业让我深刻认识到：**AI 不是"一键生成"的魔法，而是需要工程师主导的精密工具**。

### 3.1 AI 的优势与局限

AI（Claude Code + Deepseek V4 Pro）在以下方面表现出色：
- **代码生成速度**：生成型的 CRUD 代码、模板代码几乎零错误
- **模式匹配**：能快速理解项目约定（命名、目录结构）并一致执行
- **文档生成**：从代码反向生成 API 文档、ER 图等

AI 的局限需要工程师把控：
- **上下文窗口有限**：一个大项目需要拆分成多个独立可验证的阶段
- **类型系统盲区**：Zod 4 / Prisma 7 等新版本的 breaking change，AI 可能使用旧版 API
- **业务理解不足**：AI 不懂"不可思议旅行"的情感调性，需要工程师通过 Prompt 传递设计意图

### 3.2 工程化 AI 开发的核心原则

1. **分阶段范式切换**：不同开发阶段需要不同的范式引导。SDD 阶段强调契约精确性，DDD 阶段强调视觉冲击力，TDD 阶段强调边界覆盖。一套 Prompt 走到底必然失败。

2. **契约先行，实现后行**：数据模型和 API 契约是整个项目的"宪法"，必须先定型再施工。一旦契约确定，前后端可以并行开发而不会出现集成问题。

3. **每一阶段必须可验证**：每个 commit 后立即运行 `build + test + lint`，问题就地解决而不累积到下一阶段。

4. **Prompt 是工程文档，不是聊天**：好的 Prompt 包含输入（现有代码结构）、输出（期望的文件和格式）、约束（技术栈限制）和验收标准（如何验证成功）。

5. **上下文管理是核心技能**：哪些信息放在 Prompt 里、哪些放在项目文档里、哪些依赖 AI 自己读代码——这个判断力决定了协作效率的上限。
