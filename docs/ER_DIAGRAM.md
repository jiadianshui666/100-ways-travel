# ER 图（实体关系图）

## Mermaid 图

```mermaid
erDiagram
    User ||--o{ TravelExperience : "creates (author)"
    Category ||--o{ TravelExperience : "contains (category)"

    User {
        string id PK "cuid()"
        string name "用户名称"
        string email UK "唯一邮箱"
        string passwordHash "bcryptjs 12轮哈希"
        string avatar "头像URL (可选)"
        string bio "个人简介 (可选)"
        string role "USER 或 ADMIN"
        datetime createdAt
        datetime updatedAt
    }

    Category {
        string id PK "cuid()"
        string name UK "分类名称 (唯一)"
        string slug UK "URL标识 (唯一)"
        string description "分类描述 (可选)"
        string icon "emoji图标 (可选)"
        datetime createdAt
        datetime updatedAt
    }

    TravelExperience {
        string id PK "cuid()"
        string title "体验标题"
        string slug UK "URL标识 (唯一)"
        string description "体验描述"
        string location "地点"
        float price "价格 (CNY)"
        string duration "时长 (如 3小时)"
        string images "JSON数组图片URL"
        boolean featured "是否精选"
        boolean published "是否发布"
        string authorId FK "作者ID → User"
        string categoryId FK "分类ID → Category"
        datetime createdAt
        datetime updatedAt
    }
```

## 关系说明

### User → TravelExperience (1:N)
- 一个用户可以创建多个旅行体验
- 删除用户时，关联的体验不会级联删除（需手动处理）
- `authorId` 为外键，指向 `User.id`

### Category → TravelExperience (1:N)
- 一个分类下可以有多个旅行体验
- 删除分类时，如果存在关联体验，API 层面会拒绝删除
- `categoryId` 为外键，指向 `Category.id`

## 技术实现

- **数据库**：SQLite，文件存储（`prisma/dev.db`）
- **ORM**：Prisma 7，使用 `@prisma/adapter-better-sqlite3` 驱动
- **ID 生成**：cuid()，自动生成唯一标识符
- **时间戳**：createdAt（自动设置创建时间），updatedAt（自动更新修改时间）

## 种子数据

通过 `npm run db:seed` 初始化：

| 表 | 数量 | 说明 |
|---|---|---|
| User | 1 | admin@100ways.com / admin123 (ADMIN) |
| Category | 5 | 城市探索 / 自然风光 / 美食之旅 / 极限冒险 / 文化体验 |
| TravelExperience | 8 | 各分类 1-2 个体验，覆盖东京/冰岛/成都/巴黎/尼泊尔/京都/新西兰/曼谷 |
